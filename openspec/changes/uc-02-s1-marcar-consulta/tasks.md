# Tasks: uc-02-s1-marcar-consulta

## 1. Requirements delta for UC-02 (slice UC-02.S1)

- [ ] 1.1 Confirmar o delta em `specs/consultas/spec.md` com o requisito UC-02 e o cenário CT-02.1 (BR-02, RNF-02) e verificar que o cenário está presente

## 2. API contract

- [ ] 2.1 Alinhar `docs/api/openapi.yaml` com `GET /api/v1/consultas` e `POST /api/v1/consultas`, com `bearerAuth`, schemas `ConsultaRequest`/`ConsultaResponse`/`Error` e respostas 200/201/400/401/404/409/422/500; verificar paths e schemas presentes
- [ ] 2.2 Validar a estrutura do contrato (YAML, `$ref` resolvidos, `operationId` único) e verificar que os dois paths `/api/v1/...` do slice estão presentes, preservando os endpoints dos outros slices

## 3. Design e arquitetura

- [ ] 3.1 Atualizar `design.md` com os módulos E5, os paths `/api/v1/...`, a tabela `Slice | Endpoint(s) | Módulo(s)` e os ADR-001/003 (ADR-002 reservado para v1.1); verificar alinhamento com `docs/api/openapi.yaml`

## 4. Implementação do slice UC-02.S1

- [ ] 4.1 Implementar a listagem de disponibilidades na API REST Node.js (módulo `consultas`), Domínio/Serviços e Persistência MySQL na UE e verificar resposta `200` com `ConsultaResponse` filtrável por `animalId`/`veterinarioId`
- [ ] 4.2 Implementar a submissão de marcação com `ConsultaRequest` e verificar resposta `201` com `ConsultaResponse` para horário disponível, além das respostas `400`/`401`/`404`/`422`/`500` com `Error`
- [ ] 4.3 Implementar a listagem e o formulário de marcação na Apresentação (Next.js) e verificar que o tutor recebe a confirmação do agendamento (CT-02.1)

## 5. Teste automático do slice

- [ ] 5.1 CT-02.1 Agendamento bem-sucedido de consulta — criar e executar teste E2E Playwright que autentica um tutor, seleciona animal, serviço veterinário e horário disponível, submete a marcação e valida `201` com `ConsultaResponse` e a confirmação na UI, com seed determinístico entre execuções (ADR-001); verificar que o teste passa

## 6. Validação final

- [ ] 6.1 Executar `openspec validate uc-02-s1-marcar-consulta --strict` e confirmar que o change valida
