## Purpose

Define what the system must do for authorized users to consult the real-time telemetry and vital parameters of hospitalized animals (UC-03, slice UC-03.S1).

## ADDED Requirements

### Requirement: UC-03 Monitorizar telemetria
O sistema SHALL permitir que a equipa veterinária consulte os dados de telemetria em tempo real (sinais vitais) de animais internados com dispositivo IoT ativo, indicando sempre a data e hora de recolha de cada leitura (BR-03).

#### Scenario: CT-03.1 Visualização de telemetria
- **WHEN** um veterinário autenticado consulta a telemetria de um animal internado com sensor IoT ativo
- **THEN** o sistema apresenta os parâmetros vitais mais recentes e os gráficos temporais (temperatura, frequência cardíaca e respiratória), com o respetivo timestamp de recolha (BR-03, RNF-02)
