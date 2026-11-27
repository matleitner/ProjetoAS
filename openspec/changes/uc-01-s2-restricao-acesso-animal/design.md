# Design: uc-01-s2-restricao-acesso-animal

## Context

See proposal.md - Why. O slice UC-01.S2 (UC-01 - FB+E1) formaliza o tratamento da exceção E1 [Acesso não autorizado] do fluxo básico de consulta do tutor, complementando o slice UC-01.S1 (UC-01 - Fluxo básico), que formalizou o contrato OpenAPI em `docs/api/openapi.yaml` com os endpoints:

- `GET /api/v1/animais/{animalId}` — consulta os dados detalhados do animal (identificação e informação clínica disponível);
- `GET /api/v1/animais/{animalId}/historico-clinico` — consulta o histórico clínico do animal (consultas, exames e outros registos).

O contrato REST é versionado em `/api/v1`. A arquitetura de referência e os ADRs estão resumidos em `openspec/config.yaml`; o ficheiro `docs/design/E5-Desenho.md` não está presente no working tree; os ADRs aceites estão em `docs/adr/`. O repositório ainda não contém código-fonte, framework, base de dados ou CI.

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

### Módulos E5 e ADRs aplicáveis

- Apresentação (Next.js): mensagem de permissão negada na área de animais, sem divulgar dados clínicos (RNF-01).
- API REST (Node.js): módulo `animais`, validação da associação antes de devolver dados em `GET /api/v1/animais/{animalId}` e `GET /api/v1/animais/{animalId}/historico-clinico`, com `bearerAuth`.
- Domínio/Serviços: regra BR-01 de associação tutor–animal.
- Persistência (MySQL na UE): consulta da associação tutor–animal e dos dados clínicos, com residência de dados na UE (RGPD).
- Integrações/Adaptadores: não afetado neste slice.

ADRs aplicáveis (ficheiros em `docs/adr/`):

- [ADR-001 — Stack tecnológica do MIAU](../../../docs/adr/ADR-001-stack.md): Next.js na Apresentação, Node.js na API REST, MySQL na UE (RGPD) e Playwright para testes E2E com reposição/seed dos dados entre execuções.
- [ADR-003 — Fronteira estrita via API RESTful](../../../docs/adr/ADR-003-api-restful.md): toda a interação passa por endpoints `/api/v1` publicados em `docs/api/openapi.yaml`, com autenticação JWT (`bearerAuth`) e validação no servidor, sem acesso direto dos clientes à base de dados.

O ADR-002 está reservado para a v1.1 (Iteração 5), conforme ADR-001; a estratégia de testes E2E com Playwright e seed determinístico é consequência do ADR-001, não um ADR aceite. Não há desvio da arquitetura definida; não é necessário um novo ADR.

### Validação de posse/autorização do tutor sobre o animal

A validação de posse/autorização do tutor sobre o animal consiste na verificação, no servidor, da associação entre a conta autenticada do tutor e o animal alvo da consulta:

1. O tutor autenticado (via `bearerAuth`) realiza a consulta em `GET /api/v1/animais/{animalId}` ou `GET /api/v1/animais/{animalId}/historico-clinico`.
2. O sistema valida a associação tutor–animal do animal.
3. Caso a associação exista, o sistema retorna os dados detalhados do animal ou o respetivo histórico clínico.
4. Caso a associação não exista, o sistema bloqueia o acesso, responde `403 Forbidden` com o schema de erro `Error` e a interação termina sem disponibilizar dados clínicos.

### API Contract: respostas de autorização/erro (UC-01.S2)

O contrato OpenAPI em `docs/api/openapi.yaml` mantém os endpoints do UC-01.S1 e passa a refletir o comportamento de autorização/erro do UC-01.S2:

- `GET /api/v1/animais/{animalId}`: resposta `200` com `AnimalDetails`; respostas `401`, `403`, `404` e `500` com `Error`.
- `GET /api/v1/animais/{animalId}/historico-clinico`: resposta `200` com `ClinicalHistory` (lista de `ClinicalRecord`); respostas `401`, `403`, `404` e `500` com `Error`.

### Slice | Endpoint(s) | Módulo(s)

| Slice | Endpoint(s) | Módulo(s) |
| --- | --- | --- |
| UC-01.S2 | `GET /api/v1/animais/{animalId}` · `GET /api/v1/animais/{animalId}/historico-clinico` | Apresentação (Next.js) · API REST (Node.js – `animais`, autorização) · Domínio/Serviços (BR-01) · Persistência (MySQL na UE) |

## Risks / Trade-offs

- **R1**: Divergência entre o contrato OpenAPI (`docs/api/openapi.yaml`) e a delta spec (`openspec/changes/uc-01-s2-restricao-acesso-animal/specs/animais/spec.md`). **Mitigation**: manter SHALLs e cenários alinhados com o contrato no design e validar ambos no fim do fluxo.

## Migration Plan

Não aplicável: o slice ainda não possui runtime (sem código, framework ou base de dados identificados).

## Open Questions

- Nenhuma: os campos do histórico clínico estão definidos em `ClinicalHistory`/`ClinicalRecord` no contrato. O emissor do token JWT é detalhe de implementação fora do âmbito deste contrato e não altera o slice.
