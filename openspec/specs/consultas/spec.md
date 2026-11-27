# Consultas Specification

## Purpose

Define what the system must do for an authenticated tutor to book a veterinary consultation by selecting an available time slot, and what must happen when the selected slot is already occupied or unavailable, as covered by slices UC-02.S1 and UC-02.S2 of UC-02 (Fluxo básico + Exceção E1).

## Requirements

### Requirement: UC-02 Marcar consulta
O sistema SHALL permitir que o tutor autenticado marque uma consulta veterinária para um animal associado à sua conta, selecionando um horário disponível (BR-02).

#### Scenario: CT-02.1 Agendamento bem-sucedido de consulta
**WHEN** um tutor autenticado seleciona um animal, um serviço veterinário e um horário disponível
**THEN** o sistema reserva o horário e confirma o agendamento da consulta ao tutor (RNF-02)

### Requirement: UC-02 Conflito de horário
O sistema SHALL impedir a marcação de uma consulta veterinária se o horário selecionado estiver ocupado ou indisponível, devolvendo o respetivo conflito e sem registar a marcação (BR-02).

#### Scenario: CT-02.2 Conflito de horário no agendamento
**WHEN** um tutor tenta marcar uma consulta veterinária num horário que se encontra ocupado ou indisponível
**THEN** o sistema recusa o agendamento, informa o tutor com mensagem informativa e sugestões de horários alternativos (RNF-03) e não regista a consulta
