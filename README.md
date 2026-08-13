# Documentação do CleanURL

Esta pasta contém a documentação técnica e de produto do projeto.

## Como a documentação está organizada

### 01 — Produto

Define **o que o sistema precisa resolver** e quais comportamentos são esperados.

- [`overview.md`](01-product/overview.md) — problema, proposta e atores.
- [`scope-v1.md`](01-product/scope-v1.md) — o que entra e o que fica fora da V1.
- [`requirements.md`](01-product/requirements.md) — requisitos funcionais e não funcionais.
- [`business-rules.md`](01-product/business-rules.md) — regras de negócio já identificadas.
- [`roadmap.md`](01-product/roadmap.md) — funcionalidades futuras sem compromisso de implementação na V1.

### 02 — Fundamentos

Registra os conceitos estudados para sustentar as decisões técnicas.

- [`http.md`](02-foundations/http.md)
- [`url.md`](02-foundations/url.md)
- [`redirects.md`](02-foundations/redirects.md)

### 03 — Arquitetura

Define **como a aplicação é organizada** e como consumidores externos interagem com ela.

- [`overview.md`](03-architecture/overview.md) — visão geral da arquitetura.
- [`layers.md`](03-architecture/layers.md) — responsabilidades de Controller, Service e Repository.
- [`api/endpoints.md`](03-architecture/api/endpoints.md) — contratos dos endpoints da V1.
- [`api/authentication-authorization.md`](03-architecture/api/authentication-authorization.md) — áreas públicas, autenticação e autorização.
- [`api/analytics.md`](03-architecture/api/analytics.md) — definição das consultas de analytics.
- [`api/redirect-flow.md`](03-architecture/api/redirect-flow.md) — caminho crítico do redirecionamento.
- [`api/errors-status-codes.md`](03-architecture/api/errors-status-codes.md) — respostas HTTP esperadas.

### 04 — Dados

Define **como os dados precisam ser acessados e organizados**.

- [`dynamodb-overview.md`](04-data/dynamodb-overview.md)
- [`access-patterns.md`](04-data/access-patterns.md)
- [`single-table-design.md`](04-data/single-table-design.md)
- [`indexes.md`](04-data/indexes.md)
- [`click-events.md`](04-data/click-events.md)

### 05 — Decisões

ADRs registram decisões arquiteturais importantes e seus motivos.

- [`adr-001-use-dynamodb.md`](05-decisions/adr-001-use-dynamodb.md)
- [`adr-002-shortcode-as-primary-access-key.md`](05-decisions/adr-002-shortcode-as-primary-access-key.md)
- [`adr-003-single-table-design.md`](05-decisions/adr-003-single-table-design.md)

### 06 — Questões em aberto

- [`README.md`](06-open-questions/README.md)

## Arquitetura x regra de negócio

Uma **regra de negócio** descreve uma condição do produto independentemente da tecnologia. Exemplo: somente o proprietário de uma ShortURL pode consultar seus analytics.

A **arquitetura da API** define como essa capacidade é exposta tecnicamente. Exemplo: `GET /api/v1/analytics/{shortCode}`, autenticado, com verificação de autorização.

Uma regra de negócio não deveria depender de saber se o sistema usa Express, DynamoDB ou Google OAuth. A arquitetura é quem transforma essas regras em fluxos, endpoints e componentes técnicos.
