# Design: uc-01-s1-historico-clinico-animal

## Context

See proposal.md - Why. O slice UC-01.S1 (UC-01 - Fluxo básico) entrega a consulta centralizada do histórico clínico e dos dados detalhados do animal pelo tutor autenticado, com base no fluxo básico da SRS (E4, secções 3.1 e 3.2): o tutor acede à área de animais, seleciona o animal, o sistema verifica permissões e recupera os dados, apresenta os dados de identificação e a informação clínica, e o tutor consulta o histórico clínico (consultas, exames, outros registos).

O repositório ainda não contém código-fonte, framework, base de dados ou CI; as exigências estão concentradas na SRS (E4) e nos artefactos OpenSpec.

## Goals / Non-Goals

**Goals:**

- Garantir que o slice UC-01.S1 possui contrato de requisitos (delta ADDED em `specs/animais/spec.md`) e contrato de API alinhados com o fluxo básico (CT-01.1, BR-01, RNF-01).
- Definir os endpoints REST necessários à consulta dos dados detalhados do animal e do respetivo histórico clínico.

**Non-Goals:**

- Não iniciar implementação de código, framework, base de dados ou CI.
- Não cobrir no design a exceção de acesso não autorizado (E1 / CT-01.2), atribuída ao slice UC-01.S2.

## Decisions

- D1: O contrato OpenAPI passa a residir no ficheiro `docs/api/openapi.yaml`, versionado em `/api/v1`.
- D2: O slice UC-01.S1 passa a expor dois endpoints REST para suportar o fluxo básico de consulta:
  - `GET /api/v1/animals/{animalId}` — recupera os dados detalhados do animal (dados de identificação e informação clínica disponível);
  - `GET /api/v1/animals/{animalId}/clinical-history` — recupera o histórico clínico do animal (consultas, exames e outros registos).
- D3: A autorização por associação tutor–animal (BR-01) é tratada no design como parte do contrato de segurança; a respetiva validação comportamental (CT-01.2) fica para o slice UC-01.S2.

### API Contract: endpoints do UC-01.S1

Os endpoints do slice UC-01.S1 estão definidos no contrato OpenAPI em `docs/api/openapi.yaml`:

- `GET /api/v1/animals/{animalId}`: resposta `200` com `AnimalDetails` (identificação + informação clínica disponível); respostas `401`, `404` e `500` com `Error`.
- `GET /api/v1/animals/{animalId}/clinical-history`: resposta `200` com `ClinicalHistory` (lista de `ClinicalRecord`); respostas `401`, `404` e `500` com `Error`.

Ambos exigem autenticação (`bearerAuth`) e estão disponíveis sob a tag `animais`.

### Slice ↔ Endpoint Mapping

| Slice | Endpoint(s) (se aplicável) | Módulo(s) |
| --- | --- | --- |
| UC-01.S1 | `GET /api/v1/animals/{animalId}` · `GET /api/v1/animals/{animalId}/clinical-history` | API REST – módulo `animais` |

## Risks / Trade-offs

- **R1**: Divergência entre o contrato OpenAPI (`docs/api/openapi.yaml`) e a delta spec (`openspec/changes/uc-01-s1-historico-clinico-animal/specs/animais/spec.md`). **Mitigation**: manter SHALLs e cenários alinhados com o contrato no design e validar ambos no fim do fluxo.

## Migration Plan

Não aplicável: o slice ainda não possui runtime (sem código, framework ou base de dados identificados).

## Open Questions

- Quais campos do histórico clínico devem ser incluídos no payload final de resposta no slice UC-01.S1.
- Nome técnico do token de acesso (JWT) e endpoint de autenticação SSO a acoplar no contrato.
