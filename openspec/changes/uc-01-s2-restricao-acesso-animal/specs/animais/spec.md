## Purpose

Define what the system must do for an authenticated tutor to consult clinical and animal data only for animals associated with their account, blocking access when the association does not exist, as covered by slice UC-01.S2 of UC-01 (Proteção de privacidade e tratamento de exceção por restrição de acesso ao perfil de um animal).

## ADDED Requirements

### Requirement: UC-01 Restrição de acesso a dados de animais
O sistema SHALL impedir que um tutor autenticado aceda aos dados de animais que não estejam associados à sua conta autenticada, recusando o acesso com permissão insuficiente (BR-01).

#### Scenario: CT-01.2 Acesso não autorizado a animal de terceiros
**WHEN** um tutor autenticado tenta aceder aos dados de um animal que não pertence ao seu perfil
**THEN** o acesso é recusado com indicação de permissão insuficiente e os dados clínicos permanecem confidenciais (RNF-01)
