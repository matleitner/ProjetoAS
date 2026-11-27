## Purpose

Define o comportamento do sistema quando a telemetria de um animal internado apresenta parâmetros vitais anómalos: detetar o desvio, destacar um alerta visual prioritário no dashboard clínico e disponibilizar o estado de anomalia e os alertas ativos do animal (UC-03, slice UC-03.S2).

## ADDED Requirements

### Requirement: UC-03 Alerta anómalo
O sistema SHALL detetar parâmetros vitais fora dos intervalos de normalidade configurados e SHALL destacar um alerta visual prioritário no dashboard clínico, disponibilizando o estado de anomalia e os alertas ativos do animal e registando o evento anómalo no processo (BR-03, BR-04).

#### Scenario: CT-03.2 Disparo de alerta visual prioritário por parâmetro anómalo
- **WHEN** o sensor IoT envia telemetria com uma leitura anómala (ex.: febre) fora dos limites de normalidade de um animal internado com dispositivo ativo
- **THEN** o sistema destaca um alerta visual prioritário no dashboard clínico, disponibiliza o estado de anomalia e o alerta ativo do animal com a respetiva data e hora de recolha, e regista o evento anómalo no processo antes de prosseguir (BR-03, BR-04, RNF-02)
