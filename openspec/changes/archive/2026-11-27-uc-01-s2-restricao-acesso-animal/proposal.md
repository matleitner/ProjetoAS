# Proposal: uc-01-s2-restricao-acesso-animal

## Why

O ProjetoAS (Grupo 22, MIAU) formalizou na SRS (E4, secções 3.1 e 3.2) o UC-01 "Consultar dados dos Animais" com dois slices: UC-01.S1 (Fluxo básico de consulta de histórico clínico e dados detalhados do animal pelo tutor) e UC-01.S2 (FB+E1 – Proteção de privacidade e tratamento de exceção por restrição de acesso ao perfil de um animal).

Enquanto o slice UC-01.S1 formalizou o fluxo básico de consulta centralizada (CT-01.1, BR-01, RNF-01), o slice UC-01.S2 formaliza o tratamento da exceção E1 [Acesso não autorizado] do fluxo: quando o tutor autenticado tenta aceder a dados de um animal que não está associado à sua conta, o sistema SHALL bloquear o acesso, apresentar mensagem de permissão negada e impedir a visualização dos dados clínicos (CT-01.2, BR-01, RNF-01).

## What Changes

- Formalizar o delta de requisitos (ADDED) da capability `animais` para o UC-01 – Restrição de acesso a dados de animais, com o cenário CT-01.2 (Acesso não autorizado a animal de terceiros).
- Atualizar o contrato OpenAPI em `docs/api/openapi.yaml` para refletir o comportamento de autorização/erro nos endpoints do recurso de animais (`GET /api/v1/animais/{animalId}` e `GET /api/v1/animais/{animalId}/historico-clinico`): respostas `403 Forbidden` (tutor autenticado sem associação com o animal) e `404 Not Found`, mantendo o schema de erro `Error` e os endpoints definidos no UC-01.S1.
- Não iniciar implementação de código.

## Capabilities

### New Capabilities

- `animais`: UC-01 – consulta de dados dos animais com restrição de acesso por tutor autenticado (slices UC-01.S1 e UC-01.S2).

### Modified Capabilities

- Nenhuma: não existem specs principais atuais no working tree para alterar.

## Impact

- Código, APIs, base de dados e CI: ainda não identificados no projeto.
- Artefatos afetados: `openspec/changes/uc-01-s2-restricao-acesso-animal/specs/animais/spec.md`, `design.md`, `tasks.md`, `docs/api/openapi.yaml`.
- Documentação de referência: SRS (`assets/E4a-SRS/`), protótipo (`assets/E3-Prototipo/`), visão (`assets/E2-Visão/`).
