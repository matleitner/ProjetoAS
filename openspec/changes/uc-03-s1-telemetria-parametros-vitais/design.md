# Design: uc-03-s1-telemetria-parametros-vitais

## Context

See proposal.md - Why. O repositório não contém código-fonte, framework, base de dados ou CI; os requisitos vêm da SRS (E4) e o delta formalizado em `specs/monitorizacao/spec.md`. O slice UC-03.S1 formaliza a consulta de telemetria e parâmetros vitais (BR-03) e precisa de um desenho de API REST para a visualização em tempo real (RNF-02).

## Goals / Non-Goals

**Goals:**

- Permitir que utilizadores autorizados consultem a telemetria e os parâmetros vitais do animal em tempo real.

**Non-Goals:**

- Emitir alertas automáticos para valores anómalos (pertence ao slice UC-03.S2).
- Definir regras de threshold ou mecanismos de ingestão dos dispositivos (fora do contrato deste slice).

## Decisions

- D1: O desenho de API deste slice utiliza um único endpoint de leitura: `GET /api/animais/{id}/telemetria`, sem criação de endpoints fora do contrato.
- D2: O contrato OpenAPI é mantido em `docs/api/openapi.yaml` e é a fonte do contrato REST formalizado.
- D3: A resposta de sucesso devolve a leitura mais recente e, quando solicitada, a série temporal de telemetria (BR-03): identificador do animal, carimbo de medição de cada leitura, temperatura, frequência cardíaca e frequência respiratória. A janela temporal é controlada pelos parâmetros `desde`, `ate` e `limite`.

## Endpoint Design

O endpoint formalizado para o slice UC-03.S1 é:

```
GET /api/animais/{id}/telemetria
```

- **Path param**: `id` (UUID) — identificador do animal internado.
- **Query params opcionais**: `desde` e `ate` (date-time) definem a janela da série temporal; `limite` (inteiro, 1..1000) restringe o número de leituras. Sem janela, a resposta contém a leitura mais recente.
- **Autenticação**: `bearerAuth`; tag `monitorizacao`.
- **Resposta de sucesso (200)**: `TelemetriaSerie` com o identificador do animal e a lista de leituras (`Telemetria`), cada uma com o respetivo timestamp de recolha (BR-03).
- **Respostas de erro**: `401` (não autenticado), `403` (veterinário sem permissão sobre o animal), `404` (animal não encontrado) e `500` (falha técnica), todas com o schema `Error`.

O detalhe técnico completo do caminho, parâmetros, respostas e schema está versionado em `docs/api/openapi.yaml`.

## Slice / Endpoint Mapping

| Slice | Endpoint(s) (se aplicável) | Módulo(s) |
| --- | --- | --- |
| UC-03.S1 | GET /api/animais/{id}/telemetria | monitorizacao (telemetria); API |

## Risks / Trade-offs

- Risk: ausência de backend/serviço de telemetria no repositório pode adiar a implementação real do endpoint. → Mitigation: o contrato e o design deste slice são formais e versionados antes da implementação.

## Migration Plan

Não aplicável no estado atual do repositório: não existem sistemas de runtime para migrar.

## Open Questions

- Quais thresholds de anomalia definir para os parâmetros vitais (previsto para UC-03.S2).
- Mecanismo de aquisição/coleta da telemetria dos dispositivos (fora do contrato deste slice).
