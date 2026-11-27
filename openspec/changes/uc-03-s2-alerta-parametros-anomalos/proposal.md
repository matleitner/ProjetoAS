# Proposal: uc-03-s2-alerta-parametros-anomalos

## Why

O ProjetoAS (Grupo 22, MIAU) formalizou na SRS (E4, secções 3.1 e 3.2) o UC-03 "Monitorizar dados do animal", com o Fluxo básico e a exceção E1: no passo 7 do fluxo básico o sistema valida se os parâmetros se encontram dentro dos intervalos de normalidade configurados, e no fluxo de exceção E1 deteta um desvio clínico (ex.: febre ou bradicardia), destaca um alerta visual/sonoro prioritário no dashboard e regista o evento anómalo no processo antes de prosseguir.

O slice UC-03.S1 formalizou a consulta da telemetria e dos parâmetros vitais do animal (CT-03.1, BR-03). Falta agora formalizar o slice UC-03.S2 (FB + E1): o disparo de alerta visual prioritário por parâmetros anómalos (ex.: febre) detetados na telemetria, com o respetivo estado de anomalia e alertas ativos disponíveis no contrato de API.

## What Changes

- Formalizar, em delta de requisito (`ADDED`), a capacidade `monitorizacao` com o requisito de alerta anómalo e o cenário `CT-03.2` (alerta visual prioritário por parâmetro anómalo, ex.: febre).
- Atualizar `docs/api/openapi.yaml` com o endpoint `GET /api/animais/{id}/alertas` para consulta do estado de anomalia e dos alertas ativos do animal, incluindo os metadados da anomalia detetada.
- Documentar no `design.md` a regra/limiar de deteção de anomalia e a tabela de mapeamento `Slice | Endpoint(s) (se aplicável) | Módulo(s)` para o slice UC-03.S2.
- Não iniciar implementação de código.

## Capabilities

### New Capabilities

- `monitorizacao`: UC-03 — monitorizar telemetria e alertar anomalia; neste change formaliza o slice UC-03.S2 (FB + E1), que cobre o disparo de alerta visual prioritário por parâmetros anómalos fora dos limites (ex.: febre).

### Modified Capabilities

- Nenhuma: não existem specs principais atuais no working tree para alterar.

## Impact

- APIs: `docs/api/openapi.yaml` passa a incluir o endpoint `GET /api/animais/{id}/alertas` e os schemas de metadados de anomalia/alertas ativos do animal.
- Código, base de dados e CI: ainda não identificados no projeto; nenhuma implementação é iniciada neste change.
- Documentação de referência: SRS (`assets/E4a-SRS/E4_SRS.pdf`), protótipo (`assets/E3-Prototipo/`), visão (`assets/E2-Visão/`).
