# Design: uc-02-s2-conflito-horario-consulta

## Context

See proposal.md - Why. O slice UC-02.S2 (UC-02 - FB + E1) trata o fluxo de exceção E1 da SRS (E4, secção 3.1.2): no passo 8 do fluxo básico de marcação de consulta, o horário selecionado deixa de estar disponível; o sistema informa o tutor e regressa ao passo 4 para escolher outro horário.

O slice UC-02.S1 (Fluxo básico) está no estado *Prepared*; o UC-02.S2 formaliza a exceção por horário já indisponível com o cenário CT-02.2 (BR-02, RNF-03).

O repositório ainda não contém código-fonte, framework, base de dados ou CI; o contrato OpenAPI reside em `docs/api/openapi.yaml`, versionado em `/api/v1`. A arquitetura de referência e os ADRs estão resumidos em `openspec/config.yaml`; o ficheiro `docs/design/E5-Desenho.md` não está presente no working tree; os ADRs aceites estão em `docs/adr/`.

## Goals / Non-Goals

**Goals:**

- Garantir que a marcação de consulta verifica a disponibilidade e a sobreposição de horário antes de registar a consulta (BR-02).
- Detalhar a verificação de disponibilidade/sobreposição e a resposta de conflito no endpoint de marcação, sem criar novos endpoints.

**Non-Goals:**

- Não iniciar implementação de código, framework, base de dados ou CI.
- Não cobrir no design o fluxo de exceção E2 (falha ao registar consulta).

## Decisions

- D1: A verificação de disponibilidade é executada no endpoint `POST /api/v1/consultas` no âmbito da submissão da marcação; a consulta só é registada quando o horário se encontra disponível e sem sobreposição (BR-02).
- D2: A sobreposição é detetada por interseção de intervalos de horário: um agendamento existente `[start, end)` conflita com o solicitado `[scheduledAt, scheduledAt + duração)` quando `start < requestedEnd && end > requestedStart`.
- D3: O conflito de horário é devolvido como resposta `409 Conflict` com o esquema de erro partilhado (`Error`), incluindo mensagem informativa, código e detalhes do conflito (`veterinarioId`, `dataHora`, `conflictsWith`).

### Módulos E5 e ADRs aplicáveis

- Apresentação (Next.js): mensagem de conflito e regresso à escolha de horário, com alternativas obtidas da listagem de disponibilidades.
- API REST (Node.js): módulo `consultas`, endpoint `POST /api/v1/consultas` (e `GET /api/v1/consultas` para horários alternativos), com `bearerAuth`.
- Domínio/Serviços: verificação de disponibilidade e sobreposição de intervalos (BR-02).
- Persistência (MySQL na UE): agendamentos existentes e validação de que a marcação em conflito não é registada.
- Integrações/Adaptadores: não afetado neste slice.

ADRs aplicáveis (ficheiros em `docs/adr/`):

- [ADR-001 — Stack tecnológica do MIAU](../../../docs/adr/ADR-001-stack.md): Next.js na Apresentação, Node.js na API REST, MySQL na UE (RGPD) e Playwright para testes E2E com reposição/seed dos dados entre execuções.
- [ADR-003 — Fronteira estrita via API RESTful](../../../docs/adr/ADR-003-api-restful.md): toda a interação passa por endpoints `/api/v1` publicados em `docs/api/openapi.yaml`, com autenticação JWT (`bearerAuth`) e validação no servidor, sem acesso direto dos clientes à base de dados.

O ADR-002 está reservado para a v1.1 (Iteração 5), conforme ADR-001; a estratégia de testes E2E com Playwright e seed determinístico é consequência do ADR-001, não um ADR aceite. Não há desvio da arquitetura definida; não é necessário um novo ADR.

### API Contract: endpoint de marcação do UC-02.S1

- `POST /api/v1/consultas`: resposta `201` com `ConsultaResponse`; respostas `400`, `401`, `404`, `409`, `422` e `500` com `Error`.

### Verificação de disponibilidade e sobreposição de horário

- A marcação de consulta (passo 5/8 do fluxo básico) seleciona animal, veterinário/clínica e horário.
- O sistema consulta os agendamentos já registados para o veterinário/clínica alvo.
- Verifica interseção de intervalos (duração da consulta) e limites de disponibilidade (horários de funcionamento/indisponíveis).
- Se ocupado ou indisponível, responde `409 Conflict` com `Error` (sem registar a consulta). O destaque de horários alternativos é feito pela Apresentação a partir de `GET /api/v1/consultas`, sem adicionar campos ao esquema `Error`.

### Slice | Endpoint(s) | Módulo(s)

| Slice | Endpoint(s) | Módulo(s) |
| --- | --- | --- |
| UC-02.S2 | `POST /api/v1/consultas` · `GET /api/v1/consultas` (alternativas) | Apresentação (Next.js) · API REST (Node.js – `consultas`) · Domínio/Serviços · Persistência (MySQL na UE) |

## Risks / Trade-offs

- **R1**: Divergência entre o contrato OpenAPI (`docs/api/openapi.yaml`) e a delta spec (`openspec/changes/uc-02-s2-conflito-horario-consulta/specs/consultas/spec.md`). **Mitigation**: manter SHALLs e cenários alinhados com o contrato no design e validar ambos no fim do fluxo.
- **R2**: A duração da consulta e os limites de disponibilidade do veterinário/clínica não estão definidos na SRS; a interseção de intervalos assume uma duração padrão por consulta. **Mitigation**: registar como questão aberta e validar na implementação.

## Migration Plan

Não aplicável: o slice ainda não possui runtime (sem código, framework ou base de dados identificados).

## Open Questions

- Qual a duração padrão de uma consulta e como os horários de funcionamento do veterinário/clínica são representados (não altera os paths nem os schemas do contrato atual).
