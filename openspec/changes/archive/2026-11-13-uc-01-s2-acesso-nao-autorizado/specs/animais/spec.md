## ADDED Requirements
### Requirement: UC-01 Restrição de acesso a dados de animais
O sistema SHALL impedir que um tutor aceda aos dados de animais que não estejam associados à sua conta autenticada (BR-01).

#### Scenario: CT-01.2 Acesso não autorizado a animal de terceiros
**WHEN** um tutor autenticado tenta aceder aos dados de um animal que não pertence ao seu perfil
**THEN** o acesso é recusado com indicação de permissão insuficiente e os dados clínicos permanecem confidenciais (RNF-01)
