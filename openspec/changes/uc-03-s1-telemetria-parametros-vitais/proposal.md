# Proposal: uc-03-s1-telemetria-parametros-vitais

## Why

O UC-03 (Fluxo básico) define que o sistema deve permitir a monitorização da telemetria do animal e a visualização em tempo real dos sinais vitais. O slice UC-03.S1 formaliza a primeira parte deste fluxo: a consulta da telemetria e dos parâmetros vitais do animal (ex.: temperatura, frequência cardíaca/respiratória) em tempo real.

Enquanto os requisitos estavam concentrados na SRS (E4) e não existiam artefatos OpenSpec formais para este slice, faltava um contrato de consulta para a telemetria, que é a base sobre a qual o slice de alerta de anomalia (UC-03.S2) será formalizado.

## What Changes

- Formalizar, em delta de requisito (`ADDED`), a capacidade `monitorizacao` com o requisito de consulta de telemetria em tempo real (UC-03) e o cenário `CT-03.1` (visualização de telemetria).
- Desenhar no `design.md` o endpoint REST `GET /api/animais/{id}/telemetria` e registá-lo no contrato OpenAPI (`docs/api/openapi.yaml`).

## Capabilities

### New Capabilities

- `monitorizacao`: UC-03 — monitorizar telemetria e alertar anomalia; neste change formaliza o slice UC-03.S1, que cobre a visualização em tempo real da telemetria e dos parâmetros vitais do animal.

### Modified Capabilities

- Nenhuma: não existem specs principais atuais no working tree para alterar.

## Impact

- APIs: `docs/api/openapi.yaml` passa a incluir o endpoint `GET /api/animais/{id}/telemetria` para consulta de telemetria e leituras vitais.
- Código, banco de dados e CI: ainda não identificados no projeto.
