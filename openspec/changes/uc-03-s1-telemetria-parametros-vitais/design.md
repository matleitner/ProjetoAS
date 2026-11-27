# Design: uc-03-s1-telemetria-parametros-vitais

## Context

See proposal.md - Why. O repositório não contém código-fonte, framework, base de dados ou CI; os requisitos vêm da SRS (E4) e o delta formalizado em `specs/monitorizacao/spec.md`. O slice UC-03.S1 formaliza a consulta de telemetria e parâmetros vitais (BR-03) e precisa de um desenho de API REST para a visualização em tempo real (RNF-02).

O contrato REST é `docs/api/openapi.yaml` (paths `/api/v1/...`). A arquitetura de referência e os ADRs estão resumidos em `openspec/config.yaml`; o ficheiro `docs/design/E5-Desenho.md` não está presente no working tree; os ADRs aceites estão em `docs/adr/`.

## Goals / Non-Goals

**Goals:**

- Permitir que utilizadores autorizados consultem a telemetria e os parâmetros vitais do animal em tempo real.
- Manter o endpoint de leitura exatamente como versionado em `docs/api/openapi.yaml`.

**Non-Goals:**

- Emitir alertas automáticos para valores anómalos (pertence ao slice UC-03.S2).
- Definir regras de threshold ou mecanismos de ingestão dos dispositivos (fora do contrato deste slice).

## Decisions

- D1: O desenho de API deste slice utiliza um único endpoint de leitura: `GET /api/v1/animais/{id}/telemetria`, sem criação de endpoints fora do contrato.
- D2: O contrato OpenAPI é mantido em `docs/api/openapi.yaml` e é a fonte do contrato REST formalizado.
- D3: A resposta de sucesso devolve a leitura mais recente e, quando solicitada, a série temporal de telemetria (BR-03): identificador do animal, carimbo de medição de cada leitura, temperatura, frequência cardíaca e frequência respiratória. A janela temporal é controlada pelos parâmetros `desde`, `ate` e `limite`.

### Módulos E5 e ADRs aplicáveis

- Apresentação (Next.js): dashboard clínico com os parâmetros vitais mais recentes e gráficos temporais, incluindo o timestamp de recolha (RNF-02).
- API REST (Node.js): módulo `monitorizacao`, endpoint `GET /api/v1/animais/{id}/telemetria`, com `bearerAuth`.
- Domínio/Serviços: consulta da telemetria de animais internados com dispositivo IoT ativo (BR-03).
- Persistência (MySQL na UE): leituras de telemetria e respetivos timestamps, com residência de dados na UE (RGPD).
- Integrações/Adaptadores: fonte dos dados IoT do animal internado, com simulador para desenvolvimento/teste; a ingestão detalhada fica fora do contrato deste slice.

ADRs aplicáveis (ficheiros em `docs/adr/`):

- [ADR-001 — Stack tecnológica do MIAU](../../../docs/adr/ADR-001-stack.md): Next.js na Apresentação, Node.js na API REST, MySQL na UE (RGPD) e Playwright para testes E2E com reposição/seed dos dados entre execuções.
- [ADR-003 — Fronteira estrita via API RESTful](../../../docs/adr/ADR-003-api-restful.md): toda a interação passa por endpoints `/api/v1` publicados em `docs/api/openapi.yaml`, com autenticação JWT (`bearerAuth`) e validação no servidor, sem acesso direto dos clientes à base de dados.

O ADR-002 está reservado para a v1.1 (Iteração 5), conforme ADR-001; a estratégia de testes E2E com Playwright e seed determinístico é consequência do ADR-001, não um ADR aceite. Não há desvio da arquitetura definida; não é necessário um novo ADR.

## Endpoint Design

O endpoint formalizado para o slice UC-03.S1 é:

```
GET /api/v1/animais/{id}/telemetria
```

- **Path param**: `id` (UUID) — identificador do animal internado.
- **Query params opcionais**: `desde` e `ate` (date-time) definem a janela da série temporal; `limite` (inteiro, 1..1000) restringe o número de leituras. Sem janela, a resposta contém a leitura mais recente.
- **Autenticação**: `bearerAuth`; tag `monitorizacao`.
- **Resposta de sucesso (200)**: `TelemetriaSerie` com o identificador do animal e a lista de leituras (`Telemetria`), cada uma com o respetivo timestamp de recolha (BR-03).
- **Respostas de erro**: `401` (não autenticado), `403` (veterinário sem permissão sobre o animal), `404` (animal não encontrado) e `500` (falha técnica), todas com o schema `Error`.

O detalhe técnico completo do caminho, parâmetros, respostas e schema está versionado em `docs/api/openapi.yaml`.

### Slice | Endpoint(s) | Módulo(s)

| Slice | Endpoint(s) | Módulo(s) |
| --- | --- | --- |
| UC-03.S1 | `GET /api/v1/animais/{id}/telemetria` | Apresentação (Next.js) · API REST (Node.js – `monitorizacao`) · Domínio/Serviços · Persistência (MySQL na UE) · Integrações/Adaptadores IoT (simulador) |

## Risks / Trade-offs

- Risk: ausência de backend/serviço de telemetria no repositório pode adiar a implementação real do endpoint. → Mitigation: o contrato e o design deste slice são formais e versionados antes da implementação.

## Migration Plan

Não aplicável no estado atual do repositório: não existem sistemas de runtime para migrar.

## Open Questions

- Quais thresholds de anomalia definir para os parâmetros vitais (previsto para UC-03.S2).
- Mecanismo de aquisição/coleta da telemetria dos dispositivos (fora do contrato deste slice).
