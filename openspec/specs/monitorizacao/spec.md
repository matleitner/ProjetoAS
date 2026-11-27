# Monitorização Specification

## Purpose

Define what the system must do for the veterinary team to consult the real-time telemetry and vital parameters of hospitalized animals with active IoT devices, and to detect and highlight anomalous parameters with an active-alert state, as covered by slices UC-03.S1 and UC-03.S2 of UC-03.

## Requirements

### Requirement: UC-03 Monitorizar telemetria
O sistema SHALL permitir que a equipa veterinária consulte os dados de telemetria em tempo real (sinais vitais) de animais internados com dispositivo IoT ativo, indicando sempre a data e hora de recolha de cada leitura (BR-03).

#### Scenario: CT-03.1 Visualização de telemetria
**WHEN** um veterinário autenticado consulta a telemetria de um animal internado com sensor IoT ativo
**THEN** o sistema apresenta os parâmetros vitais mais recentes e os gráficos temporais (temperatura, frequência cardíaca e respiratória), com o respetivo timestamp de recolha (BR-03, RNF-02)

### Requirement: UC-03 Alerta anómalo
O sistema SHALL detetar parâmetros vitais fora dos intervalos de normalidade configurados e SHALL destacar um alerta visual prioritário no dashboard clínico, disponibilizando o estado de anomalia e os alertas ativos do animal e registando o evento anómalo no processo (BR-03, BR-04).

#### Scenario: CT-03.2 Disparo de alerta visual prioritário por parâmetro anómalo
**WHEN** o sensor IoT envia telemetria com uma leitura anómala (ex.: febre) fora dos limites de normalidade de um animal internado com dispositivo ativo
**THEN** o sistema destaca um alerta visual prioritário no dashboard clínico, disponibiliza o estado de anomalia e o alerta ativo do animal com a respetiva data e hora de recolha, e regista o evento anómalo no processo antes de prosseguir (BR-03, BR-04, RNF-02)
