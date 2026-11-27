## Purpose

Define what the system must do for an authenticated tutor to successfully submit a veterinary consultation booking by selecting an available time slot, as covered by slice UC-02.S1 of UC-02 (Fluxo básico).

## ADDED Requirements

### Requirement: UC-02 Marcar consulta
O sistema SHALL permitir que o tutor autenticado marque uma consulta veterinária para um animal associado à sua conta, selecionando um horário disponível (BR-02).

#### Scenario: CT-02.1 Agendamento bem-sucedido de consulta
**WHEN** um tutor autenticado seleciona um animal, um serviço veterinário e um horário disponível
**THEN** o sistema reserva o horário e confirma o agendamento da consulta ao tutor (RNF-02)
