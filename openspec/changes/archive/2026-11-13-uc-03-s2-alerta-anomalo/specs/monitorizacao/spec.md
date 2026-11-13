## ADDED Requirements
### Requirement: UC-03 Monitorizar telemetria - Alerta anómalo
O sistema SHALL emitir alertas automáticos quando os sinais vitais de um animal apresentarem valores fora do intervalo considerado normal (BR-03.1).

#### Scenario: CT-03.2 Alerta de valor anómalo
**WHEN** o sistema deteta um sinal vital fora do intervalo normal
**THEN** o sistema envia um alerta imediato à equipa veterinária e regista a ocorrência no histórico do animal (RNF-05)