# Design: uc-02-s2-conflito-horario-consulta

## Context

See proposal.md - Why. O slice UC-02.S2 (UC-02 - FB + E1) trata o fluxo de exceção E1 da SRS (E4, secção 3.1.2): no passo 8 do fluxo básico de marcação de consulta, o horário selecionado deixa de estar disponível; o sistema informa o tutor e regressa ao passo 4 para escolher outro horário.

O slice UC-02.S1 (Fluxo básico) está no estado *Prepared*; o UC-02.S2 formaliza a exceção por horário já indisponível com o cenário CT-02.2 (BR-02, RNF-03).

O repositório ainda não contém código-fonte, framework, base de dados ou CI; o contrato OpenAPI reside em `docs/api/openapi.yaml`, versionado em `/api/v1`.

## Goals / Non-Goals

**Goals:**

- Garantir que a marcação de consulta verifica a disponibilidade e a sobreposição de horário antes de registar a consulta (BR-02).
- Detalhar a verificação de disponibilidade/sobreposição e a resposta de conflito no endpoint de marcação.

**Non-Goals:**

- Não iniciar implementação de código, framework, base de dados ou CI.
- Não cobrir no design o fluxo de exceção E2 (falha ao registar consulta).

## Decisions

- D1: A verificação de disponibilidade é executada no endpoint de marcação (`POST /api/consultas`) no âmbito da submissão da marcação; a consulta só é registada quando o horário se encontra disponível e sem sobreposição (BR-02).
- D2: A sobreposição é detetada por interseção de intervalos de horário: um agendamento existente `[start, end)` conflita com o solicitado `[scheduledAt, scheduledAt + duração)` quando `start < requestedEnd && end > requestedStart`.
- D3: O conflito de horário é devolvido como resposta `409 Conflict` com o esquema de erro partilhado (`Error`), incluindo mensagem informativa, código e detalhes do conflito.

### API Contract: endpoint de marcação do UC-02.S1

- `POST /api/consultas`: resposta `201` com `ConsultaResponse`; respostas `400`, `401`, `404`, `409`, `422` e `500` com `Error`.

### Verificação de disponibilidade e sobreposição de horário

- A marcação de consulta (passo 5/8 do fluxo básico) seleciona animal, veterinário/clínica e horário.
- O sistema consulta os agendamentos já registados para o veterinário/clínica alvo.
- Verifica interseção de intervalos (duração da consulta) e limites de disponibilidade (horários de funcionamento/indisponíveis).
- Se ocupado ou indisponível, responde `409 Conflict` com `Error` (sem registar a consulta) e o tutor é informado, regressando ao passo de escolha de horário (fluxo E1).

### Slice ↔ Endpoint Mapping

| Slice | Endpoint(s) (se aplicável) | Módulo(s) |
| --- | --- | --- |
| UC-02.S2 | `POST /api/consultas` | API REST – módulo `consultas` |

## Risks / Trade-offs

- **R1**: Divergência entre o contrato OpenAPI (`docs/api/openapi.yaml`) e a delta spec (`openspec/changes/uc-02-s2-conflito-horario-consulta/specs/consultas/spec.md`). **Mitigation**: manter SHALLs e cenários alinhados com o contrato no design e validar ambos no fim do fluxo.
- **R2**: A duração da consulta e os limites de disponibilidade do veterinário/clínica não estão definidos na SRS; a interseção de intervalos assume uma duração padrão por consulta. **Mitigation**: registar como questão aberta e validar na implementação.

## Migration Plan

Não aplicável: o slice ainda não possui runtime (sem código, framework ou base de dados identificados).

## Open Questions

- Como as sugestões de horários alternativos são devolvidas no âmbito da resposta de conflito (campo dedicado no esquema `Error` vs. mensagem informativa).
- Qual a duração padrão de uma consulta e como os horários de funcionamento do veterinário/clínica são representados.
