# monitorizacao Specification

## Purpose
TBD - created by archiving change uc-03-s1-monitorizar-telemetria. Update Purpose after archive.

## Requirements

### Requirement: UC-03 Monitorizar telemetria
O sistema SHALL permitir que o tutor e a equipa veterinária consultem os dados de telemetria em tempo real (ex: sinais vitais) dos animais internados (BR-03).

#### Scenario: CT-03.1 Visualização de telemetria
**WHEN** um utilizador autorizado acede à página de telemetria de um animal internado
**THEN** o sistema apresenta os dados de telemetria atualizados (RNF-04)

### Requirement: UC-03 Monitorizar telemetria - Alerta anómalo
O sistema SHALL emitir alertas automáticos quando os sinais vitais de um animal apresentarem valores fora do intervalo considerado normal (BR-03.1).

#### Scenario: CT-03.2 Alerta de valor anómalo
**WHEN** o sistema deteta um sinal vital fora do intervalo normal
**THEN** o sistema envia um alerta imediato à equipa veterinária e regista a ocorrência no histórico do animal (RNF-05)
