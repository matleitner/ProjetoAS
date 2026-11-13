# animais Specification

## Purpose
TBD - created by archiving change uc-01-s1-consultar-animais. Update Purpose after archive.

## Requirements

### Requirement: UC-01 Consultar dados dos animais
O sistema SHALL permitir que o tutor autenticado consulte o histórico clínico e dados detalhados dos animais associados à sua conta (BR-01).

#### Scenario: CT-01.1 Consulta bem-sucedida de dados do animal
**WHEN** um tutor autenticado seleciona um animal associado ao seu perfil para consulta de dados
**THEN** o sistema apresenta o perfil, dados de identificação e histórico clínico do animal de forma clara e segura (RNF-01)

### Requirement: UC-01 Restrição de acesso a dados de animais
O sistema SHALL impedir que um tutor aceda aos dados de animais que não estejam associados à sua conta autenticada (BR-01).

#### Scenario: CT-01.2 Acesso não autorizado a animal de terceiros
**WHEN** um tutor autenticado tenta aceder aos dados de um animal que não pertence ao seu perfil
**THEN** o acesso é recusado com indicação de permissão insuficiente e os dados clínicos permanecem confidenciais (RNF-01)
