# ProjetoAS
Projeto Grupo 22 de AS, MIAU

# Monitorize Internal Animals Unit


Martim Leitner 125122

Joana Gião 126489

João Sinaré 125549

António Lima 124788

link para o Jira: https://grupo22miau.atlassian.net/jira/software/projects/MIAU/boards/1?filter=&groupBy=none&atlOrigin=eyJpIjoiOWEwZjY4OWM5N2UzNDFiNTliYmNhYjY5NmUyMDk3OTAiLCJwIjoiaiJ9

## Desenvolvimento (UC-01.S1)

Scaffold mínimo da stack ADR-001: API REST Node.js, Next.js, MySQL e Playwright.

```bash
npm install
npm run db:local     # inicializa/arranca MySQL local e aplica o seed determinístico
npm run dev:api      # http://127.0.0.1:4000
npm run dev:web      # http://127.0.0.1:3000
npm run test:e2e     # inclui CT-01.1
```

O contrato em `docs/api/openapi.yaml` é a única fronteira HTTP. Os clientes não acedem diretamente à base de dados (ADR-003). Em produção, configurar `MYSQL_HOST` para uma instância na UE (ADR-001).
