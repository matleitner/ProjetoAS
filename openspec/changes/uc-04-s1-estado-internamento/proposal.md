# Proposal: uc-04-s1-estado-internamento

## Why

O ProjetoAS (Grupo 22, MIAU) formalizou na SRS (E4, secções 3.1 e 3.2) o UC-04 "Verificar estado de internamento", com o fluxo básico de consulta do estado de internamento do animal pelo tutor (CT-04.1, BR-01, BR-03, RNF-01).

O slice UC-04.S1 ("Fluxo básico" — consulta em tempo real do estado de internamento do animal pelo tutor) está no estado *Prepared*, ou seja, com requisitos e cenários prontos para serem transformados em design e implementação.

Como o repositório ainda não contém código-fonte, framework, base de dados ou CI, formalizar agora este slice cria um baseline de requisitos e um contrato de API inicial para a consulta do estado e evolução do internamento, antes do design e da implementação.

## What Changes

- Formalizar o delta de requisitos (ADDED) da capability `internamento` para o UC-04 – Fluxo básico, com o cenário CT-04.1 (consulta em tempo real do estado de internamento, BR-01, BR-03, RNF-01).
- Atualizar `docs/api/openapi.yaml` com o endpoint REST necessário ao slice UC-04.S1 para consultar o estado e evolução do internamento do animal:
  - `GET /api/v1/animais/{id}/internamento` — consulta o estado atual e a evolução do internamento do animal (caminho presente no contrato, alinhado com o exemplo indicado para este slice).
- Não iniciar implementação de código.

## Capabilities

### New Capabilities

- `internamento`: UC-04 — consultar estado de internamento, com o slice UC-04.S1 a formalizar a consulta em tempo real do estado e evolução do internamento pelo tutor (BR-01, BR-03, RNF-01).

### Modified Capabilities

- Nenhuma: não existem specs principais atuais no working tree para alterar.

## Impact

- Código, APIs, base de dados e CI: ainda não identificados no projeto.
- Artefatos afetados: `openspec/changes/uc-04-s1-estado-internamento/specs/internamento/spec.md`, `design.md`, `tasks.md`, `docs/api/openapi.yaml`.
- Documentação de referência: SRS (`assets/E4a-SRS/`), protótipo (`assets/E3-Prototipo/`), visão (`assets/E2-Visão/`).
