# Design: uc-04-s1-estado-internamento

## Context

See proposal.md - Why. O slice UC-04.S1 (UC-04 - Fluxo básico) entrega a consulta em tempo real do estado e da evolução do internamento do animal pelo tutor, com base no fluxo básico da SRS (E4, secções 3.1 e 3.2): o tutor acede à área de internamentos, o sistema apresenta os internamentos associados ao tutor, o tutor seleciona o animal internado, o sistema apresenta o estado atual do internamento e os parâmetros vitais e dados de telemetria mais recentes recolhidos pelos sensores (CT-04.1, BR-01, BR-03, RNF-01).

O contrato OpenAPI em `docs/api/openapi.yaml` é versionado em `/api/v1` e passa a incluir o endpoint de internamento do UC-04.S1. A arquitetura de referência e os ADRs estão resumidos em `openspec/config.yaml`; o ficheiro `docs/design/E5-Desenho.md` não está presente no working tree; os ADRs aceites estão em `docs/adr/`. O repositório ainda não contém código-fonte, framework, base de dados ou CI.

## Goals / Non-Goals

**Goals:**

- Garantir que o slice UC-04.S1 possui contrato de requisitos (delta ADDED em `specs/internamento/spec.md`) e contrato de API alinhados com o fluxo básico (CT-04.1, BR-01, BR-03, RNF-01).
- Definir o endpoint REST necessário à consulta do estado e da evolução do internamento do animal, exatamente como versionado em `docs/api/openapi.yaml`.

**Non-Goals:**

- Não iniciar implementação de código, framework, base de dados ou CI.
- Não cobrir no design as exceções do fluxo (E1 [Dados temporariamente indisponíveis], E2 [Internamento terminado]) nem o histórico de telemetria (A1), atribuídas ao slice UC-04.S2.
- Não criar endpoints adicionais para telemetria; a telemetria mais recente é incluída na resposta do internamento.

## Decisions

- D1: O endpoint do slice UC-04.S1 é `GET /api/v1/animais/{id}/internamento`, no caminho do recurso `animais` com o identificador do animal e presente no contrato `docs/api/openapi.yaml`.
- D2: A resposta `200` utiliza o schema `Internamento`, que agrega o estado atual (`estadoAtual`), a equipa responsável (`responsavel`), a previsão de alta (`previsaoAlta`, quando disponível), a telemetria mais recente (`telemetriaMaisRecente` → `Telemetria`) e a evolução do internamento (`evolucao` → `RegistoEvolucao`).
- D3: O acesso ao internamento respeita o controlo de acesso do tutor (BR-01): respostas `401` (não autenticado), `403` (sem associação com o animal, UC-01.S2), `404` (animal/internamento não encontrado) e `500` (falha técnica), todas com o schema de erro `Error`.
- D4: A autorização por associação tutor–animal (BR-01) é tratada no design como parte do contrato de segurança; a respetiva validação comportamental (CT-01.2) fica para o slice UC-01.S2.

### Módulos E5 e ADRs aplicáveis

- Apresentação (Next.js): área de internamentos do tutor, com estado atual, equipa responsável, previsão de alta, telemetria recente e evolução (RNF-01).
- API REST (Node.js): módulo `internamento`, endpoint `GET /api/v1/animais/{id}/internamento`, com `bearerAuth`.
- Domínio/Serviços: regras de consulta do estado e da evolução do internamento (BR-01, BR-03).
- Persistência (MySQL na UE): internamento, evolução e registos recentes, com residência de dados na UE (RGPD).
- Integrações/Adaptadores: telemetria mais recente recolhida dos sensores IoT do animal internado, com simulador para desenvolvimento/teste; sem novo endpoint de telemetria.

ADRs aplicáveis (ficheiros em `docs/adr/`):

- [ADR-001 — Stack tecnológica do MIAU](../../../docs/adr/ADR-001-stack.md): Next.js na Apresentação, Node.js na API REST, MySQL na UE (RGPD) e Playwright para testes E2E com reposição/seed dos dados entre execuções.
- [ADR-003 — Fronteira estrita via API RESTful](../../../docs/adr/ADR-003-api-restful.md): toda a interação passa por endpoints `/api/v1` publicados em `docs/api/openapi.yaml`, com autenticação JWT (`bearerAuth`) e validação no servidor, sem acesso direto dos clientes à base de dados.

O ADR-002 está reservado para a v1.1 (Iteração 5), conforme ADR-001; a estratégia de testes E2E com Playwright e seed determinístico é consequência do ADR-001, não um ADR aceite. Não há desvio da arquitetura definida; não é necessário um novo ADR.

### API Contract: endpoint do UC-04.S1

O endpoint do slice UC-04.S1 está definido no contrato OpenAPI em `docs/api/openapi.yaml`:

- `GET /api/v1/animais/{id}/internamento`: resposta `200` com `Internamento` (estado atual, equipa responsável, previsão de alta - se disponível, telemetria mais recente e evolução do internamento); respostas `401`, `403`, `404` e `500` com `Error`.

Exige autenticação (`bearerAuth`) e está disponível sob a tag `internamento`.

### Slice | Endpoint(s) | Módulo(s)

| Slice | Endpoint(s) | Módulo(s) |
| --- | --- | --- |
| UC-04.S1 | `GET /api/v1/animais/{id}/internamento` | Apresentação (Next.js) · API REST (Node.js – `internamento`) · Domínio/Serviços · Persistência (MySQL na UE) · Integrações/Adaptadores (telemetria recente) |

## Risks / Trade-offs

- **R1**: Divergência entre o contrato OpenAPI (`docs/api/openapi.yaml`) e a delta spec (`openspec/changes/uc-04-s1-estado-internamento/specs/internamento/spec.md`). **Mitigation**: manter SHALLs e cenários alinhados com o contrato no design e validar ambos no fim do fluxo.

## Migration Plan

Não aplicável: o slice ainda não possui runtime (sem código, framework ou base de dados identificados).

## Open Questions

- Nenhuma: os campos da evolução do internamento e da telemetria recente estão definidos em `Internamento`, `RegistoEvolucao` e `Telemetria` no contrato. O emissor do token JWT é detalhe de implementação fora do âmbito deste contrato e não altera o slice.
