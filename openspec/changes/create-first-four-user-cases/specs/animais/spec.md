## Purpose
Define what the system must do for tutors to consult animal clinical data and for access to animal data to be controlled (UC-01).

## ADDED Requirements

### Requirement: UC-01 Consultar dados dos animais
O sistema SHALL permitir que o tutor autenticado consulte o histórico clínico e dados detalhados dos animais associados à sua conta (BR-01).

#### Scenario: CT-01.1 Consulta bem-sucedida de dados do animal
**WHEN** um tutor autenticado seleciona um animal associado ao seu perfil para consulta de dados
**THEN** o sistema apresenta o perfil, dados de identificação e histórico clínico do animal de forma clara e segura (RNF-01)

### Requirement: UC-01 Acesso não autorizado
O sistema SHALL impedir que um tutor aceda a dados de animais que não estão associados à sua conta (BR-01.1).

#### Scenario: CT-01.2 Acesso negado a animal de terceiros
**WHEN** um tutor autenticado tenta aceder aos dados de um animal que não pertence ao seu perfil
**THEN** o sistema recusa o acesso e apresenta uma mensagem de erro de permissão (RNF-02)
