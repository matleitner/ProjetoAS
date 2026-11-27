# Tasks: uc-03-s2-alerta-parametros-anomalos

## 1. Requisitos

- [ ] 1.1 Criar o delta da capacidade `monitorizacao` com o requisito UC-03 Alerta anómalo e o cenário CT-03.2 e verificar o arquivo

## 2. Contrato de API

- [ ] 2.1 Adicionar o endpoint `GET /api/animais/{id}/alertas` e os schemas `Alert` / `AlertList` (estado de anomalia e alertas ativos do animal) ao `docs/api/openapi.yaml` e verificar o arquivo
- [ ] 2.2 Validar a estrutura do contrato OpenAPI e verificar que o endpoint e os campos de anomalia estão presentes

## 3. Design

- [ ] 3.1 Incluir a regra/limiar de deteção de anomalia e a tabela de mapeamento `Slice | Endpoint(s) (se aplicável) | Módulo(s)` no design.md e verificar o arquivo

## 4. Validação

- [ ] 4.1 Executar `openspec validate` no change e corrigir eventuais falhas
