## Purpose

Define what the system must do for an authenticated tutor to centrally consult the clinical history and detailed data of an animal associated with their account, as covered by slice UC-01.S1 of UC-01 (Fluxo básico).

## ADDED Requirements

### Requirement: UC-01 Consultar dados dos animais
O sistema SHALL permitir que o tutor autenticado consulte o histórico clínico e dados detalhados dos animais associados à sua conta (BR-01).

#### Scenario: CT-01.1 Consulta bem-sucedida de dados do animal
**WHEN** um tutor autenticado seleciona um animal associado ao seu perfil para consulta de dados
**THEN** o sistema apresenta o perfil, dados de identificação e histórico clínico do animal de forma clara e segura (RNF-01)
