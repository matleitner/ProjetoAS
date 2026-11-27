# ADR-001: Stack tecnológica do MIAU

## Estado

Aceite (v1.0). O ADR-002 permanece reservado para a v1.1 (Iteração 5).

## Data

2026-11-27

## Contexto

O MIAU (Monitorize Internal Animals Unit) é uma aplicação web responsiva para tutores e equipa clínica: consulta de dados e histórico clínico dos animais, marcação de consultas, monitorização de telemetria/parâmetros vitais e consulta do estado de internamento. A arquitetura de desenho (E5) organiza o sistema nos módulos de Apresentação, API REST, Domínio/Serviços, Persistência e Integrações/Adaptadores.

O repositório ainda não contém código-fonte, framework, base de dados ou CI; os requisitos e contratos estão concentrados na SRS (E4), nos artefactos OpenSpec e em `docs/api/openapi.yaml`. Os dados clínicos e a associação tutor–animal exigem confiança na persistência e conformidade com o RGPD, incluindo a localização da base de dados. É também necessário automatizar os cenários E2E dos slices com dados determinísticos entre execuções.

## Decisão

Adotar a seguinte stack para a v1.0:

- **Frontend:** Next.js, numa aplicação web responsiva (módulo de Apresentação), consumindo exclusivamente a API REST.
- **Backend:** Node.js, com uma API RESTful que concentra as regras de negócio e os serviços de domínio (ver ADR-003).
- **Base de dados:** MySQL alojada na União Europeia, garantindo a residência dos dados na UE e a conformidade RGPD; o acesso é feito pelo módulo de Persistência, nunca diretamente pelos clientes.
- **Testes E2E:** Playwright, com reposição/seed dos dados entre execuções para garantir repetibilidade e isolamento dos cenários.

## Alternativas consideradas

- **SPA pura (React/Vite):** rejeitada por exigir mais infraestrutura própria para renderização, encaminhamento e entrega web responsiva do que a solução integrada com Next.js.
- **Aplicações nativas separadas por plataforma (iOS/Android/desktop):** rejeitadas nesta versão pelo custo de duplicação de código e de manutenção face a uma aplicação web responsiva única.
- **Base de dados não relacional:** rejeitada porque o domínio é naturalmente relacional (tutor, animal, consulta, internamento e telemetria) e precisa de consistência transacional, por exemplo na verificação de conflito de horário.
- **Alojamento da base de dados fora da UE:** rejeitado por não satisfazer a conformidade RGPD e a exigência de residência dos dados na UE.

## Consequências

- Facilita o desenvolvimento web rápido e uma experiência responsiva consistente, com uma única aplicação de apresentação.
- A persistência em MySQL na UE simplifica o cumprimento do RGPD e a discussão de residência de dados com as partes interessadas.
- O Playwright permite automatizar os fluxos E2E dos slices, desde que o ambiente de testes e o seed sejam geridos de forma explícita entre execuções.
- Introduz a necessidade de coordenar os adaptadores de integração com dispositivos IoT, notificações e sistemas externos, incluindo o simulador, para não acoplar os testes a serviços externos.
- Reforça a disciplina de manter o contrato em `docs/api/openapi.yaml` como fonte da fronteira entre frontend, backend e futuros clientes (Web, Mobile, IoT).
