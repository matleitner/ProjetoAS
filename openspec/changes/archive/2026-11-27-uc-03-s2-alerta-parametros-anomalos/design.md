# Design: uc-03-s2-alerta-parametros-anomalos

## Context

See proposal.md - Why. O slice UC-03.S1 formalizou a consulta da telemetria e dos parâmetros vitais do animal (CT-03.1). O slice UC-03.S2 (UC-03 - FB + E1) cobre o passo 7 do fluxo básico da SRS (E4, secções 3.1 e 3.2) — validação de que os parâmetros se encontram dentro dos intervalos de normalidade configurados — e a exceção E1: deteção de desvio clínico (ex.: febre ou bradicardia), destaque de um alerta visual/sonoro prioritário no dashboard e registo do evento anómalo no processo antes de prosseguir. BR-03 exige telemetria associada ao internamento com dispositivo IoT ativo e timestamp de cada leitura; BR-04 reserva a validação clínica ao veterinário; RNF-02 fixa o processamento da telemetria em menos de 2 segundos.

O repositório não contém código-fonte, framework, base de dados ou CI; o contrato REST vive em `docs/api/openapi.yaml` (paths `/api/v1/...`) e o comportamento em `specs/monitorizacao/spec.md`. A arquitetura de referência e os ADRs estão resumidos em `openspec/config.yaml`; o ficheiro `docs/design/E5-Desenho.md` não está presente no working tree; os ADRs aceites estão em `docs/adr/`.

## Goals / Non-Goals

**Goals:**

- Formalizar a regra/limiar de deteção de anomalia e o disparo do alerta visual prioritário (CT-03.2).
- Disponibilizar no contrato OpenAPI o estado de anomalia e os alertas ativos do animal, sem criar endpoints fora do contrato.

**Non-Goals:**

- Não iniciar implementação de código, framework, base de dados ou CI.
- Não alterar o contrato de consulta de telemetria do slice UC-03.S1.
- Não configurar limiares personalizados por animal (UC-08) nem realizar diagnósticos autónomos (BR-04).

## Decisions

- **D1 — Regra/limiar de deteção de anomalia:** o sistema compara cada leitura de telemetria de um animal internado com dispositivo IoT ativo (BR-03) com o intervalo de normalidade do parâmetro; uma leitura fora desse intervalo dispara o alerta. Para este slice, o limiar de referência para febre é **temperatura corporal superior a 39,0 °C**; o alerta conserva o valor lido, o limiar aplicado e o timestamp da leitura (BR-03). Alternativa considerada: detetar apenas desvios confirmados por um profissional — rejeitada porque a exceção E1 exige destaque imediato no dashboard, com validação clínica posterior (BR-04).
- **D2 — Contrato de API:** o estado de anomalia e os alertas ativos são expostos pelo endpoint `GET /api/v1/animais/{id}/alertas`, seguindo a convenção de caminho adotada para as fatias UC-03. Alternativa considerada: incluir metadados de alerta no payload de telemetria — deferida para não alterar o contrato de leitura do slice UC-03.S1.
- **D3 — Metadados do alerta:** a resposta de sucesso contém `animalId`, o estado de anomalia do animal (`anomalyState`: `NORMAL` / `ANOMALOUS`) e a lista de alertas ativos (`AlertList`); cada alerta inclui tipo (ex.: `FEVER`), parâmetro, valor lido, limiar aplicado, `detectedAt` e estado `ACTIVE`.
- **D4 — Prioridade visual:** o destaque prioritário é uma preocupação de apresentação do dashboard clínico, suportada pelos metadados do alerta; o sistema não emite diagnóstico e a validação clínica permanece com o veterinário (BR-04).

### Módulos E5 e ADRs aplicáveis

- Apresentação (Next.js): destaque visual prioritário no dashboard clínico e apresentação do estado de anomalia e dos alertas ativos.
- API REST (Node.js): módulo `monitorizacao`, endpoint `GET /api/v1/animais/{id}/alertas`, com `bearerAuth`.
- Domínio/Serviços: deteção de anomalia e regras BR-03/BR-04, sem diagnóstico autónomo.
- Persistência (MySQL na UE): registo do evento anómalo no processo do animal, com residência de dados na UE (RGPD).
- Integrações/Adaptadores: telemetria IoT do animal internado, com simulador para desenvolvimento/teste.

ADRs aplicáveis (ficheiros em `docs/adr/`):

- [ADR-001 — Stack tecnológica do MIAU](../../../docs/adr/ADR-001-stack.md): Next.js na Apresentação, Node.js na API REST, MySQL na UE (RGPD) e Playwright para testes E2E com reposição/seed dos dados entre execuções.
- [ADR-003 — Fronteira estrita via API RESTful](../../../docs/adr/ADR-003-api-restful.md): toda a interação passa por endpoints `/api/v1` publicados em `docs/api/openapi.yaml`, com autenticação JWT (`bearerAuth`) e validação no servidor, sem acesso direto dos clientes à base de dados.

O ADR-002 está reservado para a v1.1 (Iteração 5), conforme ADR-001; a estratégia de testes E2E com Playwright e seed determinístico é consequência do ADR-001, não um ADR aceite. Não há desvio da arquitetura definida; não é necessário um novo ADR.

### API Contract: endpoint do UC-03.S2

O endpoint do slice UC-03.S2 está definido no contrato OpenAPI em `docs/api/openapi.yaml`:

- `GET /api/v1/animais/{id}/alertas`: resposta `200` com `AlertList` (estado de anomalia e alertas ativos do animal); respostas `401`, `403`, `404` e `500` com `Error`.
- Exige autenticação (`bearerAuth`) e está sob a tag `monitorizacao`.

### Slice | Endpoint(s) | Módulo(s)

| Slice | Endpoint(s) | Módulo(s) |
| --- | --- | --- |
| UC-03.S2 | `GET /api/v1/animais/{id}/alertas` | Apresentação (Next.js) · API REST (Node.js – `monitorizacao`) · Domínio/Serviços · Persistência (MySQL na UE) · Integrações/Adaptadores IoT (simulador) |

## Risks / Trade-offs

- **R1**: o limiar fixo de referência (39,0 °C) pode divergir de limiares clínicos personalizados. → Mitigation: o limiar do slice é explícito neste design e a configuração por animal fica no UC-08; a validação clínica cabe ao veterinário (BR-04).
- **R2**: latência entre a chegada da telemetria e a disponibilização do alerta pode violar RNF-02 (< 2 s). → Mitigation: verificar o tempo de processamento no cenário CT-03.2 quando o slice for implementado.
- **R3**: divergência entre o contrato OpenAPI e o delta de requisitos. → Mitigation: manter IDs `CT-03.2` / `UC-03 Alerta anómalo` estáveis e validar ambos no fim do fluxo.

## Migration Plan

Não aplicável: o slice ainda não possui runtime (sem código, framework ou base de dados identificados).

## Open Questions

- Confirmação clínica do limiar de referência de febre e dos intervalos de normalidade para frequência cardíaca e respiratória (UC-08 / BR-04).
- O destaque sonoro e as notificações externas não são cobertos por este contrato de API.
