## Purpose

Define what the system must do when a tutor attempts to mark a veterinary appointment at a time slot that is already occupied or unavailable, as covered by slice UC-02.S2 of UC-02 (Fluxo básico + Exceção E1).

## ADDED Requirements

### Requirement: UC-02 Conflito de horário
O sistema SHALL impedir a marcação de uma consulta veterinária se o horário selecionado estiver ocupado ou indisponível, devolvendo o respetivo conflito e sem registar a marcação (BR-02).

#### Scenario: CT-02.2 Conflito de horário no agendamento
**WHEN** um tutor tenta marcar uma consulta veterinária num horário que se encontra ocupado ou indisponível
**THEN** o sistema recusa o agendamento, informa o tutor com mensagem informativa e sugestões de horários alternativos (RNF-03) e não regista a consulta
