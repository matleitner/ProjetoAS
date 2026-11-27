# Tasks: uc-03-s1-telemetria-parametros-vitais

## 1. Requisitos

- [x] 1.1 Confirmar o delta em `specs/monitorizacao/spec.md` com o requisito UC-03 (actor veterinário, timestamp de recolha e `RNF-02`) e o cenário CT-03.1 e verificar que o identificador estável do cenário é mantido

## 2. Contrato de API

- [x] 2.1 Alinhar `docs/api/openapi.yaml` com `GET /api/v1/animais/{id}/telemetria` e os schemas `TelemetriaSerie`/`Telemetria`, com as respostas 200/401/403/404/500 via `Error`; verificar que o path está presente
- [x] 2.2 Validar o contrato: YAML válido, todos os `$ref` resolvem, `operationId` único e o path `/api/v1/animais/{id}/telemetria` existe exatamente uma vez

## 3. Design e arquitetura

- [x] 3.1 Atualizar `design.md` com a série temporal com janela (`desde`/`ate`/`limite`), a secção Endpoint Design com 200/401/403/404/500, os módulos E5, a tabela `Slice | Endpoint(s) | Módulo(s)` e os ADR-001/003 (ADR-002 reservado para v1.1); verificar que design e contrato usam o mesmo path e as mesmas respostas

## 4. Implementação do slice UC-03.S1

- [x] 4.1 Implementar a consulta da leitura mais recente na API REST Node.js (módulo `monitorizacao`) e no Domínio/Serviços para um animal internado com dispositivo IoT ativo (BR-03) e verificar resposta `200` com `TelemetriaSerie`
- [x] 4.2 Implementar a série temporal com `desde`/`ate`/`limite` usando a Integração/Adaptador IoT (simulador) e a Persistência MySQL na UE e verificar leituras ordenadas, cada uma com timestamp de recolha
- [x] 4.3 Implementar a visualização no dashboard clínico (Next.js) e verificar que temperatura, frequência cardíaca/respiratória e timestamp são apresentados dentro do limite RNF-02

## 5. Teste automático do slice

- [x] 5.1 CT-03.1 Visualização de telemetria — criar e executar teste E2E Playwright em que um veterinário autenticado consulta a telemetria de um animal internado e valida `200`, `TelemetriaSerie` com timestamp de recolha e apresentação no dashboard, com seed determinístico entre execuções (ADR-001); verificar que o teste passa

## 6. Validação final

- [x] 6.1 Executar `openspec validate uc-03-s1-telemetria-parametros-vitais --strict` e confirmar que o change valida
