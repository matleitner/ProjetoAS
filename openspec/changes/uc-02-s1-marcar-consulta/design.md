# Design: uc-02-s1-marcar-consulta

## Context

See proposal.md - Why.

O repositório ainda não contém código-fonte, framework, base de dados ou CI; os requisitos estão concentrados na SRS (E4, secções 3.1 e 3.2) e nos deltas OpenSpec. O UC-02 "Marcar consulta veterinária" descreve o fluxo básico com os passos 1 a 9 (SRS 3.1.2) e as regras de negócio BR-01 a BR-04; o slice UC-02.S1 cobre a submissão bem-sucedida de marcação de consulta veterinária pelo tutor (CT-02.1, BR-02, RNF-02).

O contrato REST é `docs/api/openapi.yaml` (paths `/api/v1/...`). A arquitetura de referência e os ADRs estão resumidos em `openspec/config.yaml`; o ficheiro `docs/design/E5-Desenho.md` não está presente no working tree; os ADRs aceites estão em `docs/adr/`.

## Goals / Non-Goals

**Goals:**

- Formalizar o requisito SHALL do UC-02 (marcar consulta, BR-02) com o cenário CT-02.1.
- Desenhar o contrato REST do slice UC-02.S1, com a listagem de disponibilidades e a criação de marcação, exatamente como versionado em `docs/api/openapi.yaml`.

**Non-Goals:**

- Fluxo de exceção de conflito de horário (UC-02.S2, CT-02.2, BR-02.1) — fica para a change `uc-02-s2-conflito-horario`.
- Confirmação da marcação pelo veterinário (fluxo passo 7) e notificação aos intervenientes (passo 9) — fora do slice UC-02.S1.

## Decisions

- D1: A capability `consultas` é introduzida no delta desta change com o requisito "UC-02 Marcar consulta" e o cenário CT-02.1, reutilizando a redação da SRS para manter estáveis os IDs de requisito e cenário.
- D2: O contrato REST do slice UC-02.S1 usa exatamente dois endpoints: `GET /api/v1/consultas` e `POST /api/v1/consultas`, sem paths adicionais.
- D3: O tutor responsável é identificado pela sessão autenticada (`bearerAuth`); os endpoints de marcação não expõem credenciais na URI.

### Módulos E5 e ADRs aplicáveis

- Apresentação (Next.js): listagem de disponibilidades, formulário de marcação e confirmação da consulta ao tutor.
- API REST (Node.js): módulo `consultas`, endpoints `GET /api/v1/consultas` e `POST /api/v1/consultas`, com `bearerAuth`.
- Domínio/Serviços: regras de marcação e identificação do tutor autenticado (BR-02).
- Persistência (MySQL na UE): disponibilidades e marcações de consultas, com residência de dados na UE (RGPD).
- Integrações/Adaptadores: não afetado neste slice; confirmação pelo veterinário e notificações ficam fora do escopo.

ADRs aplicáveis (ficheiros em `docs/adr/`):

- [ADR-001 — Stack tecnológica do MIAU](../../../docs/adr/ADR-001-stack.md): Next.js na Apresentação, Node.js na API REST, MySQL na UE (RGPD) e Playwright para testes E2E com reposição/seed dos dados entre execuções.
- [ADR-003 — Fronteira estrita via API RESTful](../../../docs/adr/ADR-003-api-restful.md): toda a interação passa por endpoints `/api/v1` publicados em `docs/api/openapi.yaml`, com autenticação JWT (`bearerAuth`) e validação no servidor, sem acesso direto dos clientes à base de dados.

O ADR-002 está reservado para a v1.1 (Iteração 5), conforme ADR-001; a estratégia de testes E2E com Playwright e seed determinístico é consequência do ADR-001, não um ADR aceite. Não há desvio da arquitetura definida; não é necessário um novo ADR.

## Endpoints

### GET /api/v1/consultas

- **Purpose**: listar as disponibilidades de marcação de consultas (veterinário/horário) para os animais do tutor autenticado.
- **Desenho**: parâmetros opcionais `animalId` e `veterinarioId`; resposta `200 OK` com uma lista de `ConsultaResponse`; respostas `401` e `500` com `Error`.

### POST /api/v1/consultas

- **Purpose**: criar uma nova marcação de consulta veterinária submetida pelo tutor autenticado.
- **Request body**: `ConsultaRequest` com `animalId`, `veterinarioId`, `dataHora` e `motivo`; o tutor é identificado pela sessão autenticada.
- **Responses**: `201 Created` com `ConsultaResponse`; `400`, `401`, `404`, `409`, `422` e `500` com `Error` (o `409` pertence ao comportamento do slice UC-02.S2).

### Slice | Endpoint(s) | Módulo(s)

| Slice | Endpoint(s) | Módulo(s) |
| --- | --- | --- |
| UC-02.S1 | `GET /api/v1/consultas` · `POST /api/v1/consultas` | Apresentação (Next.js) · API REST (Node.js – `consultas`) · Domínio/Serviços · Persistência (MySQL na UE) |

## Risks / Trade-offs

- [Risco] O fluxo da SRS inclui etapas posteriores à submissão (confirmação do veterinário, notificação) que não estão cobertas pelo slice. → Mitigação: manter o slice no escopo da submissão bem-sucedida (CT-02.1).

## Migration Plan

Não aplicável: change de requisitos e contrato de API, sem sistemas em runtime.

## Open Questions

- Nenhuma: o versionamento `/api/v1` e os parâmetros/respostas estão definidos em `docs/api/openapi.yaml`.
