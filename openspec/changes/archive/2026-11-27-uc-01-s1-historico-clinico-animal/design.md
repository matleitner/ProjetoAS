# Design: uc-01-s1-historico-clinico-animal

## Context

See proposal.md - Why. O slice UC-01.S1 (UC-01 - Fluxo básico) entrega a consulta centralizada do histórico clínico e dos dados detalhados do animal pelo tutor autenticado, com base no fluxo básico da SRS (E4, secções 3.1 e 3.2): o tutor acede à área de animais, seleciona o animal, o sistema verifica permissões e recupera os dados, apresenta os dados de identificação e a informação clínica, e o tutor consulta o histórico clínico (consultas, exames, outros registos).

O contrato REST é `docs/api/openapi.yaml` (paths `/api/v1/...`). A arquitetura de referência e os ADRs estão resumidos em `openspec/config.yaml`; o ficheiro `docs/design/E5-Desenho.md` não está presente no working tree; os ADRs aceites estão em `docs/adr/`. O repositório ainda não contém código-fonte, framework, base de dados ou CI.

## Goals / Non-Goals

**Goals:**

- Garantir que o slice UC-01.S1 possui contrato de requisitos (delta ADDED em `specs/animais/spec.md`) e contrato de API alinhados com o fluxo básico (CT-01.1, BR-01, RNF-01).
- Definir os endpoints REST necessários à consulta dos dados detalhados do animal e do respetivo histórico clínico, exatamente como versionados em `docs/api/openapi.yaml`.

**Non-Goals:**

- Não iniciar implementação de código, framework, base de dados ou CI.
- Não cobrir no design a exceção de acesso não autorizado (E1 / CT-01.2), atribuída ao slice UC-01.S2.

## Decisions

- D1: O contrato OpenAPI reside em `docs/api/openapi.yaml`, versionado em `/api/v1`.
- D2: O slice UC-01.S1 expõe dois endpoints REST para suportar o fluxo básico de consulta:
  - `GET /api/v1/animais/{animalId}` — recupera os dados detalhados do animal (dados de identificação e informação clínica disponível);
  - `GET /api/v1/animais/{animalId}/historico-clinico` — recupera o histórico clínico do animal (consultas, exames e outros registos).
- D3: A autorização por associação tutor–animal (BR-01) é tratada no design como parte do contrato de segurança; o contrato inclui `403`, mas a validação comportamental (CT-01.2) fica para o slice UC-01.S2.

### Módulos E5 e ADRs aplicáveis

- Apresentação (Next.js): área de animais do tutor, seleção do animal e apresentação de identificação, resumo clínico e histórico (RNF-01).
- API REST (Node.js): módulo `animais`, endpoints `GET /api/v1/animais/{animalId}` e `GET /api/v1/animais/{animalId}/historico-clinico`, com `bearerAuth`.
- Domínio/Serviços: regras de consulta de dados do animal e do histórico clínico, respeitando BR-01.
- Persistência (MySQL na UE): dados de identificação, informação clínica e registos do histórico, com residência de dados na UE (RGPD).
- Integrações/Adaptadores: não afetado neste slice; o fluxo não depende de dispositivos ou sistemas externos.

ADRs aplicáveis (ficheiros em `docs/adr/`):

- [ADR-001 — Stack tecnológica do MIAU](../../../docs/adr/ADR-001-stack.md): Next.js na Apresentação, Node.js na API REST, MySQL na UE (RGPD) e Playwright para testes E2E com reposição/seed dos dados entre execuções.
- [ADR-003 — Fronteira estrita via API RESTful](../../../docs/adr/ADR-003-api-restful.md): toda a interação passa por endpoints `/api/v1` publicados em `docs/api/openapi.yaml`, com autenticação JWT (`bearerAuth`) e validação no servidor, sem acesso direto dos clientes à base de dados.

O ADR-002 está reservado para a v1.1 (Iteração 5), conforme ADR-001; a estratégia de testes E2E com Playwright e seed determinístico é consequência do ADR-001, não um ADR aceite. Não há desvio da arquitetura definida; não é necessário um novo ADR.

### API Contract: endpoints do UC-01.S1

Os endpoints do slice UC-01.S1 estão definidos no contrato OpenAPI em `docs/api/openapi.yaml`:

- `GET /api/v1/animais/{animalId}`: resposta `200` com `AnimalDetails` (identificação + informação clínica disponível); respostas `401`, `403`, `404` e `500` com `Error`.
- `GET /api/v1/animais/{animalId}/historico-clinico`: resposta `200` com `ClinicalHistory` (`records` de `ClinicalRecord`); respostas `401`, `403`, `404` e `500` com `Error`.

Ambos exigem autenticação (`bearerAuth`) e estão disponíveis sob a tag `animais`.

### Slice | Endpoint(s) | Módulo(s)

| Slice | Endpoint(s) | Módulo(s) |
| --- | --- | --- |
| UC-01.S1 | `GET /api/v1/animais/{animalId}` · `GET /api/v1/animais/{animalId}/historico-clinico` | Apresentação (Next.js) · API REST (Node.js – `animais`) · Domínio/Serviços · Persistência (MySQL na UE) |

## Risks / Trade-offs

- **R1**: Divergência entre o contrato OpenAPI (`docs/api/openapi.yaml`) e a delta spec (`openspec/changes/uc-01-s1-historico-clinico-animal/specs/animais/spec.md`). **Mitigation**: manter SHALLs e cenários alinhados com o contrato no design e validar ambos no fim do fluxo.

## Migration Plan

Não aplicável: o slice ainda não possui runtime (sem código, framework ou base de dados identificados).

## Open Questions

- Nenhuma: os campos do histórico clínico estão definidos em `ClinicalHistory`/`ClinicalRecord` no contrato. O emissor do token JWT é detalhe de implementação fora do âmbito deste contrato e não altera o slice.
