# ADR-003: Fronteira estrita via API RESTful

## Estado

Aceite (v1.0).

## Data

2026-11-27

## Contexto

O MIAU terá múltiplos consumidores dos mesmos dados clínicos e operacionais: a aplicação web responsiva em Next.js, clientes móveis futuros e integrações com dispositivos IoT e sistemas externos através de adaptadores. A arquitetura de desenho (E5) separa as responsabilidades de Apresentação, API REST, Domínio/Serviços, Persistência e Integrações, e o contrato formal da API está versionado em `docs/api/openapi.yaml`.

Regras de negócio como BR-01 (associação tutor–animal) e BR-02 (conflito de horário) exigem validação no servidor, e os cenários de teste precisam de uma fronteira estável para validar contrato e autorização de forma isolada.

## Decisão

Definir uma fronteira estrita entre clientes e backend: toda a interação passa por uma API RESTful implementada em Node.js, com payloads JSON e controlo de acesso/autenticação baseado em tokens JWT (`bearerAuth`), seguindo o contrato em `docs/api/openapi.yaml`.

- Os clientes (Web, Mobile e adaptadores IoT) consomem apenas os endpoints publicados no contrato, sob `/api/v1`, sem acesso direto à base de dados.
- A autenticação e a autorização são validadas no servidor antes do acesso a dados clínicos; não são criados endpoints fora do contrato.
- O contrato OpenAPI é a fonte da verdade para formatos de pedido/resposta e códigos de erro, permitindo testes de contrato isolados por slice.

## Alternativas consideradas

- **Chamadas diretas ou acoplamento server-side** (por exemplo, Server Actions do Next.js a aceder diretamente à base de dados sem uma camada de API exposta): rejeitadas porque acoplam a apresentação ao domínio e à persistência, dificultam o suporte a múltiplos clientes e impedem testes de contrato isolados e a reutilização das regras de negócio pelos adaptadores IoT.

## Consequências

- Facilita o desacoplamento entre frontend e backend e o suporte a múltiplos clientes (Web, Mobile, IoT) sobre o mesmo contrato.
- Permite testes isolados de contrato e de autorização, com os cenários WHEN/THEN validados contra `docs/api/openapi.yaml`.
- Obriga a manter `docs/api/openapi.yaml` atualizado sempre que um slice altera endpoints, payloads ou respostas de erro.
- Obriga a validar payloads e autorização no servidor, além de gerir CORS, ciclo de vida dos tokens JWT e versionamento da API.
- Qualquer desvio a esta fronteira (por exemplo, acesso direto à base de dados a partir do frontend) exige um novo ADR antes da implementação.
