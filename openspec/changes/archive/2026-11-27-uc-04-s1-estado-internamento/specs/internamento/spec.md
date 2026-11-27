## Purpose

Define what the system must do for an authenticated tutor to consult in real time the current status and the evolution of the hospitalization of an animal associated with their account, as covered by slice UC-04.S1 of UC-04 (Fluxo básico).

## ADDED Requirements

### Requirement: UC-04 Estado de internamento
O sistema SHALL permitir que o tutor autenticado consulte, em tempo real, o estado atual e a evolução do internamento de um animal associado à sua conta (BR-01, BR-03, RNF-01).

#### Scenario: CT-04.1 Consulta de estado de internamento
**WHEN** um tutor autenticado acede à área de internamentos e seleciona um animal internado associado à sua conta
**THEN** o sistema apresenta o estado atual, a equipa responsável, a previsão de alta (se disponível) e a evolução do internamento, incluindo a telemetria mais recente (BR-01, BR-03, RNF-01)
