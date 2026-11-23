## Purpose
Define what the system must do for authorized users to monitor real-time animal telemetry and for alerts to be emitted on anomalous readings (UC-03).

## ADDED Requirements

### Requirement: UC-03 Monitorizar telemetria
O sistema SHALL permitir que o tutor e a equipa veterinária consultem os dados de telemetria em tempo real (ex: sinais vitais) dos animais internados (BR-03).

#### Scenario: CT-03.1 Visualização de telemetria
**WHEN** um utilizador autorizado acede à página de telemetria de um animal internado
**THEN** o sistema apresenta os dados de telemetria atualizados (RNF-04)

### Requirement: UC-03 Alerta anómalo
O sistema SHALL emitir alertas automáticos quando os sinais vitais de um animal apresentarem valores fora do intervalo considerado normal (BR-03.1).

#### Scenario: CT-03.2 Alerta de valor anómalo
**WHEN** o sistema deteta um sinal vital fora do intervalo normal
**THEN** o sistema envia um alerta imediato à equipa veterinária e regista a ocorrência no histórico do animal (RNF-05)
