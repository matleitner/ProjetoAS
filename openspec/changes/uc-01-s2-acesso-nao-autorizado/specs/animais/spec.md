## ADDED Requirements
### Requirement: UC-01 Acesso não autorizado
O sistema SHALL impedir que um tutor aceda a dados de animais que não estão associados à sua conta (BR-01.1).

#### Scenario: CT-01.2 Acesso negado a animal de terceiros
**WHEN** um tutor autenticado tenta aceder aos dados de um animal que não pertence ao seu perfil
**THEN** o sistema recusa o acesso e apresenta uma mensagem de erro de permissão (RNF-02)