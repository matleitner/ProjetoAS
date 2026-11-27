# Tasks: uc-04-s1-estado-internamento

## 1. Requirements baseline for UC-04.S1

- [ ] 1.1 Confirmar o delta em `specs/internamento/spec.md` com o requisito UC-04 e o cenário CT-04.1 (BR-01, BR-03, RNF-01) e verificar que o cenário está presente

## 2. API contract for UC-04.S1

- [ ] 2.1 Alinhar `docs/api/openapi.yaml` com `GET /api/v1/animais/{id}/internamento` para o estado atual e a evolução do internamento, com `bearerAuth`, schemas `Internamento`/`Telemetria`/`RegistoEvolucao`/`Error` e respostas 200/401/403/404/500; verificar path e schemas presentes sem remover endpoints de outros slices
- [ ] 2.2 Validar a estrutura do contrato (YAML, `$ref` resolvidos, `operationId` único) e verificar que o path `/api/v1/animais/{id}/internamento` existe exatamente uma vez

## 3. Design e arquitetura

- [ ] 3.1 Atualizar `design.md` com os módulos E5, o path `/api/v1/...`, a tabela `Slice | Endpoint(s) | Módulo(s)` e os ADR-001/003 (ADR-002 reservado para v1.1); verificar alinhamento com `docs/api/openapi.yaml`

## 4. Implementação do slice UC-04.S1

- [ ] 4.1 Implementar a consulta do estado e da evolução do internamento na API REST Node.js (módulo `internamento`) e no Domínio/Serviços e verificar resposta `200` com `Internamento` para um tutor autenticado associado ao animal
- [ ] 4.2 Implementar a agregação da telemetria mais recente e da evolução a partir da Persistência MySQL na UE e do adaptador IoT (simulador) e verificar `telemetriaMaisRecente` e `evolucao` no payload, sem criar novo endpoint de telemetria
- [ ] 4.3 Implementar a área de internamentos na Apresentação (Next.js) e verificar apresentação do estado atual, equipa responsável, previsão de alta (se disponível), telemetria recente e evolução (RNF-01)

## 5. Teste automático do slice

- [ ] 5.1 CT-04.1 Consulta de estado de internamento — criar e executar teste E2E Playwright em que um tutor autenticado seleciona um animal internado associado e valida `200` com `Internamento` e a apresentação dos campos na UI, com seed determinístico entre execuções (ADR-001); verificar que o teste passa

## 6. Validação final

- [ ] 6.1 Executar `openspec validate uc-04-s1-estado-internamento --strict` e confirmar que o change valida
