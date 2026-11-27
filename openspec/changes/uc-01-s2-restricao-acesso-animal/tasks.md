# Tasks: uc-01-s2-restricao-acesso-animal

## 1. Requirements baseline for UC-01.S2

- [ ] 1.1 Confirmar o delta em `specs/animais/spec.md` com o requisito UC-01 de restrição de acesso e o cenário CT-01.2 (BR-01, RNF-01) e verificar que o cenário está presente

## 2. API contract for UC-01.S2

- [ ] 2.1 Alinhar `docs/api/openapi.yaml` com `GET /api/v1/animais/{animalId}` e `GET /api/v1/animais/{animalId}/historico-clinico`, incluindo `403 Forbidden` e `404 Not Found` com o schema `Error`; verificar paths e respostas presentes
- [ ] 2.2 Validar a estrutura do contrato (YAML, `$ref` resolvidos, `operationId` único) e verificar que as respostas de erro são consistentes com o contrato do UC-01.S1

## 3. Design e arquitetura

- [ ] 3.1 Atualizar `design.md` com a validação de associação tutor–animal, os módulos E5, os paths `/api/v1/...`, a tabela `Slice | Endpoint(s) | Módulo(s)` e os ADR-001/003 (ADR-002 reservado para v1.1); verificar alinhamento com `docs/api/openapi.yaml`

## 4. Implementação do slice UC-01.S2

- [ ] 4.1 Implementar a validação de associação tutor–animal na API REST Node.js (módulo `animais`) e no Domínio/Serviços, antes de devolver dados nos dois endpoints, e verificar `403` para tutor sem associação e `200` para tutor associado
- [ ] 4.2 Implementar a consulta da associação na Persistência MySQL na UE e verificar que o identificador do tutor autenticado é usado na validação, sem divulgar dados de terceiros
- [ ] 4.3 Implementar a mensagem de acesso negado na Apresentação (Next.js) e verificar que nenhum campo clínico do animal de terceiros é apresentado (RNF-01)

## 5. Teste automático do slice

- [ ] 5.1 CT-01.2 Acesso não autorizado a animal de terceiros — criar e executar teste E2E Playwright em que um tutor autenticado tenta aceder aos dois endpoints de um animal de outro tutor, validando `403` com `Error` e ausência de dados clínicos na UI, com seed determinístico entre execuções (ADR-001); verificar que o teste passa

## 6. Validação final

- [ ] 6.1 Executar `openspec validate uc-01-s2-restricao-acesso-animal --strict` e confirmar que o change valida
