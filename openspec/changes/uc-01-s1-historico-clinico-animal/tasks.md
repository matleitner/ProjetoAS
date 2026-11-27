# Tasks: uc-01-s1-historico-clinico-animal

## 1. Requirements baseline for UC-01.S1

- [x] 1.1 Confirmar o delta em `specs/animais/spec.md` com o requisito UC-01 e o cenário CT-01.1 (BR-01, RNF-01) e verificar que o cenário está presente

## 2. API contract for UC-01.S1

- [x] 2.1 Alinhar `docs/api/openapi.yaml` com `GET /api/v1/animais/{animalId}` e `GET /api/v1/animais/{animalId}/historico-clinico`, com `bearerAuth`, schemas `AnimalDetails`/`ClinicalHistory`/`Error` e respostas 200/401/403/404/500; verificar paths e schemas presentes
- [x] 2.2 Validar a estrutura do contrato (YAML, `$ref` resolvidos, `operationId` único) e verificar que os dois paths `/api/v1/...` existem exatamente uma vez

## 3. Design e arquitetura

- [x] 3.1 Atualizar `design.md` com os módulos E5, os paths `/api/v1/...`, a tabela `Slice | Endpoint(s) | Módulo(s)` e os ADR-001/003 (ADR-002 reservado para v1.1); verificar alinhamento com `docs/api/openapi.yaml`

## 4. Implementação do slice UC-01.S1

- [x] 4.1 Implementar a consulta de dados detalhados na API REST Node.js (módulo `animais`), Domínio/Serviços e Persistência MySQL na UE e verificar resposta `200` com `AnimalDetails` para um tutor autenticado associado ao animal
- [x] 4.2 Implementar a consulta do histórico clínico no módulo `animais` e verificar resposta `200` com `ClinicalHistory` e `records` de `ClinicalRecord` para o mesmo animal
- [x] 4.3 Implementar a apresentação na área de animais (Next.js) e verificar que identificação, informação clínica e histórico são apresentados de forma clara e segura (RNF-01)

## 5. Teste automático do slice

- [x] 5.1 CT-01.1 Consulta bem-sucedida de dados do animal — criar e executar teste E2E Playwright que autentica um tutor, seleciona um animal associado e valida `200` com `AnimalDetails` e `ClinicalHistory` na API e na UI, com seed determinístico entre execuções (ADR-001); verificar que o teste passa

## 6. Validação final

- [x] 6.1 Executar `openspec validate uc-01-s1-historico-clinico-animal --strict` e confirmar que o change valida
