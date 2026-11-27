# Proposal: uc-02-s1-marcar-consulta

## Why

O ProjetoAS (Grupo 22, MIAU) formalizou na SRS (E4, secções 3.1 e 3.2) o UC-02 "Marcar consulta veterinária", com o fluxo básico de marcação de consulta (CT-02.1, BR-02) e o fluxo de exceção de conflito de horário (CT-02.2, BR-02.1).

O slice UC-02.S1 ("Fluxo básico" — submissão bem-sucedida de marcação de consulta veterinária pelo tutor) está no estado *Prepared*, ou seja, com requisitos e cenários prontos para serem transformados em design e implementação.

Como o repositório ainda não contém código-fonte, framework, base de dados ou CI, formalizar agora este slice cria um baseline de requisitos e um contrato de API inicial para a submissão de marcações, antes do design e da implementação.

## What Changes

- Formalizar o delta de requisitos (ADDED) da capability `consultas` para o UC-02 – Fluxo básico, com o cenário CT-02.1 (agendamento bem-sucedido de consulta, BR-02).
- Criar `docs/api/openapi.yaml` com os endpoints REST necessários ao slice UC-02.S1:
  - `GET /api/consultas` — lista as disponibilidades de marcação de consultas.
  - `POST /api/consultas` — cria uma nova marcação de consulta veterinária.
- Não iniciar implementação de código.

## Capabilities

### New Capabilities

- `consultas`: UC-02 — marcar consulta veterinária, com o slice UC-02.S1 a formalizar a submissão bem-sucedida da marcação (BR-02).

### Modified Capabilities

- Nenhuma: não existem specs principais atuais no working tree para alterar.

## Impact

- Código, APIs, base de dados e CI: ainda não identificados no projeto.
- Artefatos afetados: `openspec/changes/uc-02-s1-marcar-consulta/specs/consultas/spec.md`, `design.md`, `tasks.md`, `docs/api/openapi.yaml`.
- Documentação de referência: SRS (`assets/E4a-SRS/`), protótipo (`assets/E3-Prototipo/`), visão (`assets/E2-Visão/`).
