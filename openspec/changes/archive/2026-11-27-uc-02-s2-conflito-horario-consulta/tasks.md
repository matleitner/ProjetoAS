# Tasks: uc-02-s2-conflito-horario-consulta

## 1. Requirements baseline for UC-02.S2

- [x] 1.1 Confirmar o delta em `specs/consultas/spec.md` com o requisito UC-02 de conflito de horário e o cenário CT-02.2 (BR-02, RNF-03) e verificar que o cenário está presente

## 2. API contract for UC-02.S2

- [x] 2.1 Alinhar `docs/api/openapi.yaml` no endpoint `POST /api/v1/consultas` com as respostas `409 Conflict` e `422 Unprocessable Entity` e o schema `Error` com `details`; verificar path e respostas presentes sem remover endpoints de outros slices
- [x] 2.2 Validar a estrutura do contrato (YAML, `$ref` resolvidos, `operationId` único) e verificar que a resposta de conflito é consistente com o contrato do UC-02.S1

## 3. Design e arquitetura

- [x] 3.1 Atualizar `design.md` com a verificação de disponibilidade/sobreposição, os módulos E5, os paths `/api/v1/...`, a tabela `Slice | Endpoint(s) | Módulo(s)` e os ADR-001/003 (ADR-002 reservado para v1.1); verificar alinhamento com `docs/api/openapi.yaml`

## 4. Implementação do slice UC-02.S2

- [x] 4.1 Implementar a verificação de disponibilidade e sobreposição de intervalos no Domínio/Serviços do módulo `consultas` e verificar que um horário ocupado é detetado antes de registar a consulta
- [x] 4.2 Implementar a resposta `409 Conflict` com `Error` (mensagem e `details`) na API REST Node.js e verificar que nenhuma marcação é gravada na Persistência MySQL na UE
- [x] 4.3 Implementar na Apresentação (Next.js) a mensagem de conflito e a apresentação de horários alternativos obtidos de `GET /api/v1/consultas`, e verificar o regresso à escolha de horário

## 5. Teste automático do slice

- [x] 5.1 CT-02.2 Conflito de horário no agendamento — criar e executar teste E2E Playwright que autentica um tutor, tenta marcar consulta num horário ocupado/indisponível e valida `409` com `Error`, ausência de registo e apresentação de alternativas, com seed determinístico entre execuções (ADR-001); verificar que o teste passa

## 6. Validação final

- [x] 6.1 Executar `openspec validate uc-02-s2-conflito-horario-consulta --strict` e confirmar que o change valida
