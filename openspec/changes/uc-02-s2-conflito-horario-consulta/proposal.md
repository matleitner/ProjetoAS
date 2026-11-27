# Proposal: uc-02-s2-conflito-horario-consulta

## Why

O ProjetoAS (Grupo 22, MIAU) formalizou na SRS (E4, secções 3.1.2 e Tabela 3) o UC-02 "Marcar consulta veterinária" com o fluxo básico (FB) e o fluxo de exceção E1: no passo 8 do fluxo básico de marcação, o horário selecionado deixa de estar disponível; o sistema informa o tutor e regressa ao passo 4 para escolher outro horário.

O slice UC-02.S1 (Fluxo básico de marcação de consulta, CT-02.1, BR-02) está no estado *Prepared*, enquanto o slice UC-02.S2 (UC-02 - FB + E1; Tratamento de exceção por horário já indisponível) passa a *Defined*.

Como o repositório ainda não contém código-fonte, framework, base de dados ou CI, formalizar agora este slice cria um contrato de requisitos e de API para o tratamento de conflito de horário, antes do design e da implementação.

## What Changes

- Formalizar o delta de requisitos (ADDED) da capability `consultas` para o tratamento da exceção por horário já indisponível na marcação de consulta veterinária (BR-02), com o cenário CT-02.2.
- Atualizar o contrato OpenAPI (`docs/api/openapi.yaml`) no endpoint de marcação de consulta (`POST /api/consultas`) com a resposta de conflito de horário (`409 Conflict` / `422 Unprocessable Entity`) e o respetivo esquema de erro, sem criar endpoints fora do contrato.

## Capabilities

### New Capabilities

- `consultas`: UC-02 — marcar consulta veterinária e evitar conflito de horário, com o slice UC-02.S2 a formalizar o tratamento da exceção por horário indisponível.

### Modified Capabilities

- Nenhuma: não existem specs principais atuais no working tree para alterar.

## Impact

- Código, APIs, base de dados e CI: ainda não identificados no projeto.
- Artefatos afetados: `openspec/changes/uc-02-s2-conflito-horario-consulta/specs/consultas/spec.md`, `design.md`, `tasks.md`, `docs/api/openapi.yaml`.
- Documentação de referência: SRS (`assets/E4a-SRS/`), protótipo (`assets/E3-Prototipo/`), visão (`assets/E2-Visão/`).
