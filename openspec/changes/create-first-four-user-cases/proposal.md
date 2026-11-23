# Proposal: create-first-four-user-cases

## Why

O ProjetoAS (Grupo 22, Analise e Desenvolvimento de Sistemas) e o produto MIAU — plataforma de gestão de saúde animal e telemetria de internamento — registam na SRS (E4, v1.0, 2026/10/30) os primeiros quatro casos de utilização: UC-01 Consultar dados dos Animais, UC-02 Marcar consulta veterinária, UC-03 Monitorizar dados do animal e UC-04 Verificar estado de internamento, suportados por regras de negócio (BR-01 a BR-04) e requisitos não funcionais (RNF-01 a RNF-06).

Apesar de as frentes estarem documentadas, os artefatos OpenSpec formais para estas quatro UCs não estavam presentes no repositório. Formalizar agora os quatro primeiros casos de utilização cria um baseline de requisitos estável, com cenários testáveis, antes do design e da implementação.

## What Changes

- Criar deltas de requisitos (ADDED) para as quatro primeiras UCs:
  - UC-01 (capacidade `animais`): o tutor autenticado consulta dados clínicos do animal; acessos a animais não associados são bloqueados.
  - UC-02 (capacidade `consultas`): o tutor marca consulta em horário disponível; conflitos de horário são impedidos.
  - UC-03 (capacidade `monitorizacao`): utilizadores autorizados consultam telemetria em tempo real; alertas são emitidos para valores anómalos.
  - UC-04 (capacidade `internamento`): utilizadores consultam o estado de internamento do animal.
- Sem código-fonte, framework, base de dados ou CI existentes no repositório, o impacto esperado é limitado a artefatos de requisitos em `openspec/`.

## Capabilities

### New Capabilities

- `animais`: UC-01 — consultar dados dos animais e controlo de acesso do tutor.
- `consultas`: UC-02 — marcar consulta veterinária e evitar conflito de horário.
- `monitorizacao`: UC-03 — monitorizar telemetria e alertar anomalia.
- `internamento`: UC-04 — consultar estado de internamento.

### Modified Capabilities

- Nenhuma: não existem specs principais atuais no working tree para alterar.

## Impact

- Código, APIs, base de dados e CI: ainda não identificados no projeto.
- Artefatos afetados: `openspec/changes/create-first-four-user-cases/specs/<capability>/spec.md`, `design.md`, `tasks.md`.
- Documentação de referência: SRS (`assets/E4a-SRS/`), protótipo (`assets/E3-Prototipo/`), visão (`assets/E2-Visão/`).
