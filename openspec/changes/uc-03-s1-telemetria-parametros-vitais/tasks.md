# Tasks: uc-03-s1-telemetria-parametros-vitais

## 1. Requisitos

- [ ] 1.1 Corrigir o delta `specs/monitorizacao/spec.md`: actor veterinário, timestamp de recolha e o RNF inexistente → `RNF-02` no requisito UC-03 e no cenário CT-03.1; verificar que nenhum identificador de RNF inexistente resta em `openspec/` nem em `docs/`

## 2. Contrato de API

- [ ] 2.1 Adicionar `GET /api/animais/{id}/telemetria` e os schemas `TelemetriaSerie`/`Telemetria` a `docs/api/openapi.yaml`, com as respostas 200/401/403/404/500 via `Error`; verificar que o path está presente
- [ ] 2.2 Validar o contrato: YAML válido, todos os `$ref` resolvem, `operationId` único e o path `/telemetria` existe exatamente uma vez

## 3. Design

- [ ] 3.1 Atualizar `design.md` com a correção do RNF para `RNF-02`, a série temporal com janela (`desde`/`ate`/`limite`), a secção Endpoint Design com 200/401/403/404/500 e a tabela `Slice | Endpoint(s) (se aplicável) | Módulo(s)`; verificar que design e contrato usam o mesmo path e as mesmas respostas

## 4. Validação final

- [ ] 4.1 Executar `openspec validate uc-03-s1-telemetria-parametros-vitais --strict` e confirmar que continua a validar
