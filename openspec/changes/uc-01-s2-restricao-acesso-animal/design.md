# Design: uc-01-s2-restricao-acesso-animal

## Context

See proposal.md - Why. O slice UC-01.S2 (UC-01 - FB+E1) formaliza o tratamento da exceção E1 [Acesso não autorizado] do fluxo básico de consulta do tutor, complementando o slice UC-01.S1 (UC-01 - Fluxo básico), que formalizou o contrato OpenAPI em `docs/api/openapi.yaml` com os endpoints:

- `GET /api/v1/animals/{animalId}` — consulta os dados detalhados do animal (identificação e informação clínica disponível);
- `GET /api/v1/animals/{animalId}/clinical-history` — consulta o histórico clínico do animal (consultas, exames e outros registos).

O repositório ainda não contém código-fonte, framework, base de dados ou CI; as exigências estão concentradas na SRS (E4) e nos artefactos OpenSpec.

## Goals / Non-Goals

**Goals:**

- Garantir que o tutor autenticado consulte apenas dados de animais associados à sua conta autenticada (BR-01).
- Bloquear o acesso com `403 Forbidden` quando a associação tutor–animal não existir, mantendo os dados clínicos confidenciais (RNF-01).

**Non-Goals:**

- Não iniciar implementação de código, framework, base de dados ou CI.
- Não criar endpoints fora do contrato do UC-01.S1.
- Não cobrir no design a falha técnica de recuperação de dados (E2 [Falha na recuperação dos dados]).

## Decisions

- D1: A validação de posse (associação tutor–animal) é responsabilidade do backend do módulo `animais`, executada no início do fluxo de consulta, antes do acesso ao histórico clínico e aos dados detalhados do animal.
- D2: Quando o tutor autenticado não possui associação com o animal, o endpoint SHALL responder `403 Forbidden` com o schema de erro `Error`; os dados clínicos não são devolvidos.
- D3: Quando o animal não existe, o endpoint SHALL responder `404 Not Found` com o schema de erro `Error`, mantendo consistência com o contrato do UC-01.S1.

### Validação de posse/autorização do tutor sobre o animal

A validação de posse/autorização do tutor sobre o animal consiste na verificação, no servidor, da associação entre a conta autenticada do tutor e o animal alvo da consulta:

1. O tutor autenticado (via `bearerAuth`) realiza a consulta em `GET /api/v1/animals/{animalId}` ou `GET /api/v1/animals/{animalId}/clinical-history`.
2. O sistema valida a associação tutor–animal do animal.
3. Caso a associação exista, o sistema retorna os dados detalhados do animal ou o respetivo histórico clínico.
4. Caso a associação não exista, o sistema bloqueia o acesso, responde `403 Forbidden` com o schema de erro `Error` e a interação termina sem disponibilizar dados clínicos.

### API Contract: respostas de autorização/erro (UC-01.S2)

O contrato OpenAPI em `docs/api/openapi.yaml` mantém os endpoints do UC-01.S1 e passa a refletir o comportamento de autorização/erro do UC-01.S2:

- `GET /api/v1/animals/{animalId}`: resposta `200` com `AnimalDetails`; respostas `401`, `403`, `404` e `500` com `Error`.
- `GET /api/v1/animals/{animalId}/clinical-history`: resposta `200` com `ClinicalHistory` (lista de `ClinicalRecord`); respostas `401`, `403`, `404` e `500` com `Error`.

### Slice ↔ Endpoint Mapping

| Slice | Endpoint(s) (se aplicável) | Módulo(s) |
| --- | --- | --- |
| UC-01.S2 | `GET /api/v1/animals/{animalId}` · `GET /api/v1/animals/{animalId}/clinical-history` | API REST – módulo `animais` |

## Risks / Trade-offs

- **R1**: Divergência entre o contrato OpenAPI (`docs/api/openapi.yaml`) e a delta spec (`openspec/changes/uc-01-s2-restricao-acesso-animal/specs/animais/spec.md`). **Mitigation**: manter SHALLs e cenários alinhados com o contrato no design e validar ambos no fim do fluxo.

## Migration Plan

Não aplicável: o slice ainda não possui runtime (sem código, framework ou base de dados identificados).

## Open Questions

- Nome técnico do token de acesso (JWT) e endpoint de autenticação SSO a acoplar no contrato.
- Quais campos do histórico clínico devem ser incluídos no payload final de resposta no slice UC-01.S1.
