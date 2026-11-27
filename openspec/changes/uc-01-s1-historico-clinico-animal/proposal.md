# Proposal: uc-01-s1-historico-clinico-animal

## Why

O ProjetoAS (Grupo 22, MIAU) formalizou na SRS (E4, secções 3.1 e 3.2) o UC-01 "Consultar dados dos Animais", com o fluxo básico de consulta centralizada do histórico clínico e dos dados detalhados do animal pelo tutor (CT-01.1, BR-01, RNF-01) e a exceção de acesso não autorizado (CT-01.2, BR-01, RNF-01) no slice UC-01.S2.

O slice UC-01.S1 ("Fluxo básico" — consulta centralizada do histórico clínico e dados detalhados do animal pelo tutor) está no estado *Prepared*, ou seja, com requisitos e cenários prontos para serem transformados em design e implementação.

Como o repositório ainda não contém código-fonte, framework, base de dados ou CI, formalizar agora este slice cria um baseline de requisitos e um contrato de API inicial para a consulta de dados e histórico clínico, antes do design e da implementação.

## What Changes

- Formalizar o delta de requisitos (ADDED) da capability `animais` para o UC-01 – Fluxo básico, com o cenário CT-01.1.
- Criar `docs/api/openapi.yaml` com os endpoints REST necessários ao slice UC-01.S1:
  - `GET /api/v1/animais/{animalId}` — consulta os dados detalhados do animal (identificação e informação clínica disponível).
  - `GET /api/v1/animais/{animalId}/historico-clinico` — consulta o histórico clínico do animal (consultas, exames e outros registos).
- Não iniciar implementação de código.

## Capabilities

### New Capabilities

- `animais`: UC-01 — consultar dados dos animais, com o slice UC-01.S1 a formalizar o fluxo básico de consulta do histórico clínico e dados detalhados.

### Modified Capabilities

- Nenhuma: não existem specs principais atuais no working tree para alterar.

## Impact

- Código, APIs, base de dados e CI: ainda não identificados no projeto.
- Artefatos afetados: `openspec/changes/uc-01-s1-historico-clinico-animal/specs/animais/spec.md`, `design.md`, `tasks.md`, `docs/api/openapi.yaml`.
- Documentação de referência: SRS (`assets/E4a-SRS/`), protótipo (`assets/E3-Prototipo/`), visão (`assets/E2-Visão/`).
