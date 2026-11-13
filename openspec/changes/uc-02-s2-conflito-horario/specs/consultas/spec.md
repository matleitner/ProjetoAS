## ADDED Requirements
### Requirement: UC-02 Conflito de horário
O sistema SHALL impedir a marcação de uma consulta se o horário selecionado estiver ocupado ou indisponível (BR-02.1).

#### Scenario: CT-02.2 Conflito de horário no agendamento
**WHEN** um tutor tenta marcar uma consulta num horário já reservado ou indisponível
**THEN** o sistema recusa o agendamento e apresenta uma mensagem informativa com sugestões de horários alternativos (RNF-03)