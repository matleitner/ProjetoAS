# Design: uc-02-s1-marcar-consulta

## Context

See proposal.md - Why.

O repositório ainda não contém código-fonte, framework, base de dados ou CI; os requisitos estão concentrados na SRS (E4, secções 3.1 e 3.2) e nos deltas OpenSpec. O UC-02 "Marcar consulta veterinária" descreve o fluxo básico com os passos 1 a 9 (SRS 3.1.2) e as regras de negócio BR-01 a BR-04; o slice UC-02.S1 cobre a submissão bem-sucedida de marcação de consulta veterinária pelo tutor (CT-02.1, BR-02, RNF-02).

## Goals / Non-Goals

**Goals:**

- Formalizar o requisito SHALL do UC-02 (marcar consulta, BR-02) com o cenário CT-02.1.
- Desenhar o contrato REST do slice UC-02.S1, com a listagem de disponibilidades e a criação de marcação.

**Non-Goals:**

- Fluxo de exceção de conflito de horário (UC-02.S2, CT-02.2, BR-02.1) — fica para a change `uc-02-s2-conflito-horario`.
- Confirmação da marcação pelo veterinário (fluxo passo 7) e notificação aos intervenientes (passo 9) — fora do slice UC-02.S1.

## Decisions

- D1: A capability `consultas` é introduzida no delta desta change com o requisito "UC-02 Marcar consulta" e o cenário CT-02.1, reutilizando a redação da SRS para manter estáveis os IDs de requisito e cenário.
- D2: O contrato REST do slice UC-02.S1 é limitado a dois endpoints, sem endpoints adicionais: `GET /api/consultas` e `POST /api/consultas`.
- D3: O tutor responsável é identificado pela sessão autenticada; os endpoints de marcação não expõem credenciais na URI.

## Endpoints

### GET /api/consultas

- **Purpose**: listar as disponibilidades de marcação de consultas (veterinário/horário) para os animais do tutor autenticado.
- **Desenho**: parâmetros de consulta para refinar a listagem (`animalId`, `veterinarioId` e janela de datas/horas); resposta `200 OK` com a lista de disponibilidades.

### POST /api/consultas

- **Purpose**: criar uma nova marcação de consulta veterinária submetida pelo tutor autenticado.
- **Request body**: `animalId`, `veterinarioId`, `dataHora` e `motivo`; o tutor é identificado pela sessão autenticada.
- **Responses**: `201 Created` (marcação criada), `400 Bad Request` (payload inválido) e `401 Unauthorized`.

## Slice ↔ Endpoint(s) ↔ Módulo(s)

| Slice | Endpoint(s) (se aplicável) | Módulo(s) |
| --- | --- | --- |
| UC-02.S1 | GET /api/consultas; POST /api/consultas | consultas |

## Risks / Trade-offs

- [Risco] O fluxo da SRS inclui etapas posteriores à submissão (confirmação do veterinário, notificação) que não estão cobertas pelo slice. → Mitigação: manter o slice no escopo da submissão bem-sucedida (CT-02.1).

## Migration Plan

Não aplicável: change de requisitos e contrato de API, sem sistemas em runtime.

## Open Questions

- Estratégia de versionamento da API (ex.: `/api/v1/...`) — a definir nos próximos slices, sem alterar o contrato deste.
