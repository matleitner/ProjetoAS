# Tasks: uc-03-s2-alerta-parametros-anomalos

## 1. Requisitos

- [ ] 1.1 Confirmar o delta da capacidade `monitorizacao` com o requisito UC-03 de alerta anómalo e o cenário CT-03.2 (BR-03, BR-04, RNF-02) e verificar que o identificador estável do cenário é mantido

## 2. Contrato de API

- [ ] 2.1 Alinhar `docs/api/openapi.yaml` com `GET /api/v1/animais/{id}/alertas` e os schemas `Alert`/`AlertList` (estado de anomalia e alertas ativos do animal), com as respostas 200/401/403/404/500 via `Error`; verificar path e schemas presentes
- [ ] 2.2 Validar a estrutura do contrato (YAML, `$ref` resolvidos, `operationId` único) e verificar que o endpoint e os campos de anomalia estão presentes sem remover endpoints de outros slices

## 3. Design e arquitetura

- [ ] 3.1 Atualizar `design.md` com a regra/limiar de deteção de anomalia, os módulos E5, a tabela `Slice | Endpoint(s) | Módulo(s)` e os ADR-001/003 (ADR-002 reservado para v1.1); verificar alinhamento com `docs/api/openapi.yaml`

## 4. Implementação do slice UC-03.S2

- [ ] 4.1 Implementar a deteção de anomalia no Domínio/Serviços do módulo `monitorizacao` e verificar que uma leitura de febre acima de 39,0 °C gera `anomalyState: ANOMALOUS` e um alerta `FEVER` com valor, limiar e `detectedAt`
- [ ] 4.2 Implementar a exposição de `AlertList` na API REST Node.js e verificar respostas 200/401/403/404/500 com `Error`, sem diagnóstico autónomo (BR-04)
- [ ] 4.3 Implementar o destaque visual prioritário na Apresentação (Next.js) e o registo do evento anómalo na Persistência MySQL na UE via telemetria do adaptador IoT (simulador), e verificar processamento em menos de 2 segundos (RNF-02)

## 5. Teste automático do slice

- [ ] 5.1 CT-03.2 Disparo de alerta visual prioritário por parâmetro anómalo — criar e executar teste E2E Playwright que injeta telemetria anómala via simulador e valida destaque no dashboard, `AlertList` com `ANOMALOUS`/`ACTIVE`, registo do evento e latência inferior a 2 s, com seed determinístico entre execuções (ADR-001); verificar que o teste passa

## 6. Validação final

- [ ] 6.1 Executar `openspec validate uc-03-s2-alerta-parametros-anomalos --strict` e confirmar que o change valida
