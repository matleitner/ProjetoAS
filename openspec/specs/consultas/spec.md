# consultas Specification

## Purpose
TBD - created by archiving change uc-02-s1-marcar-consulta. Update Purpose after archive.

## Requirements

### Requirement: UC-02 Marcar consulta
O sistema SHALL permitir que o tutor autenticado marque uma consulta para um animal associado à sua conta, selecionando um horário disponível (BR-02).

#### Scenario: CT-02.1 Agendamento bem-sucedido de consulta
**WHEN** um tutor autenticado seleciona um animal, um serviço veterinário e um horário disponível
**THEN** o sistema reserva o horário e confirma o agendamento da consulta ao tutor (RNF-02)

### Requirement: UC-02 Marcar consulta - Conflito de horário
O sistema SHALL impedir a marcação de uma consulta se o horário selecionado estiver ocupado ou indisponível (BR-02.1).

#### Scenario: CT-02.2 Conflito de horário no agendamento
**WHEN** um tutor tenta marcar uma consulta num horário já reservado ou indisponível
**THEN** o sistema recusa o agendamento e apresenta uma mensagem informativa com sugestões de horários alternativos (RNF-03)
