# Documentação do CleanURL

Esta pasta reúne a documentação técnica e de produto do **CleanURL**, uma API de encurtamento de URLs desenvolvida com NestJS.

A documentação registra tanto as funcionalidades já implementadas quanto as decisões e capacidades planejadas para a V1. O estado atual da implementação é apresentado separadamente para evitar que itens planejados sejam interpretados como concluídos.

## Sobre o CleanURL

O CleanURL permite transformar uma URL longa em um endereço curto, simples de compartilhar e capaz de redirecionar o usuário para o destino original.

Além do encurtamento e do redirecionamento, a V1 prevê autenticação, registro de acessos e consultas de analytics das URLs pertencentes ao usuário.

## Estado atual da implementação

### Implementado

- Criação de URLs encurtadas por meio de `POST /api/v1/urls`.
- Retorno do endereço curto completo, pronto para compartilhamento.
- Redirecionamento por meio de `GET /{shortCode}`.
- Redirecionamento temporário com status HTTP `302 Found`.
- Validação de URLs com protocolos HTTP e HTTPS.
- Bloqueio de protocolos não permitidos, como `javascript:` e `file:`.
- Geração e validação de códigos Base62 com sete caracteres.
- Validação de proprietário, data de criação e expiração.
- Expiração automática das URLs após 30 dias.
- Repositório em memória para desenvolvimento e testes.
- Testes unitários das regras de domínio e dos casos de uso.
- Testes E2E dos endpoints de criação e redirecionamento.

### Próximas etapas

- Persistência das URLs no DynamoDB.
- Implementação concreta do repositório do DynamoDB.
- Configuração da tabela e dos índices necessários.
- Testes de integração com o banco de dados.
- Registro dos eventos de clique.
- Consultas de analytics.
- Autenticação com Google.
- Autorização baseada no proprietário da URL.

> Os documentos de arquitetura e dados podem descrever itens ainda não implementados quando fizerem parte do planejamento da V1.

## Como a documentação está organizada

### 01 — Produto

Define **o que o sistema precisa resolver**, quais comportamentos são esperados e quais funcionalidades fazem parte do produto.

- [`overview.md`](01-product/overview.md) — problema, proposta e atores envolvidos.
- [`scope-v1.md`](01-product/scope-v1.md) — o que entra e o que fica fora da V1.
- [`requirements.md`](01-product/requirements.md) — requisitos funcionais e não funcionais.
- [`business-rules.md`](01-product/business-rules.md) — regras de negócio identificadas.
- [`roadmap.md`](01-product/roadmap.md) — funcionalidades futuras sem compromisso de implementação na V1.

### 02 — Fundamentos

Registra os conceitos estudados para sustentar as decisões técnicas do projeto.

- [`http.md`](02-foundations/http.md) — fundamentos do protocolo HTTP relevantes para a aplicação.
- [`url.md`](02-foundations/url.md) — estrutura, validação e comportamento de URLs.
- [`redirects.md`](02-foundations/redirects.md) — diferenças entre os principais códigos HTTP de redirecionamento.

### 03 — Arquitetura

Define **como a aplicação é organizada**, a direção das dependências e a forma como consumidores externos interagem com a API.

- [`overview.md`](03-architecture/overview.md) — visão geral da arquitetura.
- [`layers.md`](03-architecture/layers.md) — responsabilidades das camadas Domain, Application, Infrastructure e Presentation.
- [`api/endpoints.md`](03-architecture/api/endpoints.md) — contratos dos endpoints da V1.
- [`api/authentication-authorization.md`](03-architecture/api/authentication-authorization.md) — áreas públicas, autenticação e autorização.
- [`api/analytics.md`](03-architecture/api/analytics.md) — definição das consultas de analytics.
- [`api/redirect-flow.md`](03-architecture/api/redirect-flow.md) — caminho crítico do redirecionamento.
- [`api/errors-status-codes.md`](03-architecture/api/errors-status-codes.md) — respostas HTTP esperadas.

### 04 — Dados

Define **como os dados precisam ser acessados e organizados**, partindo dos padrões de acesso da aplicação.

- [`dynamodb-overview.md`](04-data/dynamodb-overview.md) — visão geral do uso do DynamoDB.
- [`access-patterns.md`](04-data/access-patterns.md) — consultas que o modelo de dados precisa atender.
- [`single-table-design.md`](04-data/single-table-design.md) — organização dos itens na tabela única.
- [`indexes.md`](04-data/indexes.md) — índices secundários necessários para consultas adicionais.
- [`click-events.md`](04-data/click-events.md) — estrutura e finalidade dos eventos de clique.

### 05 — Decisões

Contém os registros de decisões arquiteturais, também conhecidos como **ADRs — Architecture Decision Records**. Cada ADR documenta uma decisão importante, seu contexto, suas alternativas e suas consequências.

- [`adr-001-use-dynamodb.md`](05-decisions/adr-001-use-dynamodb.md) — escolha do DynamoDB como banco de dados.
- [`adr-002-shortcode-as-primary-access-key.md`](05-decisions/adr-002-shortcode-as-primary-access-key.md) — uso do código curto como chave principal de acesso.
- [`adr-003-single-table-design.md`](05-decisions/adr-003-single-table-design.md) — adoção do Single-Table Design.

### 06 — Questões em aberto

Registra dúvidas e decisões que ainda precisam de estudo, validação ou definição.

- [`README.md`](06-open-questions/README.md) — lista das questões ainda não resolvidas.

## Arquitetura da implementação

A API é organizada seguindo princípios de **Domain-Driven Design (DDD)** e separação de responsabilidades.

### Domain

Representa o núcleo da aplicação e contém as regras que devem existir independentemente do framework, do banco de dados ou do protocolo utilizado.

Essa camada contém:

- entidades, como `ShortUrl`;
- Value Objects, como `OriginalUrl` e `ShortCode`;
- erros de domínio;
- contratos de repositórios.

O Domain não depende de NestJS, DynamoDB ou HTTP.

### Application

Orquestra as regras do domínio para executar as ações oferecidas pelo sistema.

Essa camada contém:

- casos de uso, como criação e resolução de URLs encurtadas;
- entradas e saídas dos casos de uso;
- portas que representam dependências externas, como o gerador de códigos curtos.

A camada de Application decide **o que deve acontecer**, mas não conhece detalhes de rotas HTTP ou persistência concreta.

### Infrastructure

Contém as implementações concretas das dependências definidas pelas camadas internas.

Essa camada pode conter:

- repositório em memória;
- repositório do DynamoDB;
- implementação do gerador de códigos;
- configuração de providers e injeção de dependências do NestJS;
- integrações com serviços externos.

### Presentation

É a porta de entrada HTTP da aplicação.

Essa camada contém:

- controllers;
- DTOs de entrada e saída;
- validação dos dados recebidos;
- conversão de erros da aplicação e do domínio em respostas HTTP.

Os controllers recebem a requisição, acionam um caso de uso e transformam o resultado em uma resposta HTTP. As regras de negócio não devem ser implementadas diretamente nos controllers.

## Direção das dependências

As dependências devem apontar para as camadas mais internas:

```text
Presentation → Application → Domain
Infrastructure → Application e Domain
```

O Domain permanece no centro da aplicação. A Infrastructure implementa contratos definidos internamente e é conectada ao restante do sistema por meio da injeção de dependências.

## Arquitetura x regra de negócio

Uma **regra de negócio** descreve uma condição do produto sem depender da tecnologia utilizada.

Exemplo:

> Somente o proprietário de uma ShortURL pode consultar seus analytics.

A **arquitetura da API** define como essa capacidade é exposta tecnicamente.

Exemplo:

> `GET /api/v1/analytics/{shortCode}`, autenticado e com verificação de autorização.

A regra de negócio não deveria depender de saber se o sistema utiliza NestJS, Express, DynamoDB ou Google OAuth. A arquitetura transforma essas regras em casos de uso, endpoints, componentes técnicos e mecanismos de persistência.

## Decisões atuais importantes

- O código curto possui sete caracteres Base62.
- O redirecionamento utiliza `302 Found`.
- Apenas protocolos HTTP e HTTPS são aceitos como destino.
- Uma URL encurtada expira automaticamente após 30 dias na configuração atual.
- O código curto é o principal identificador utilizado no fluxo de redirecionamento.
- O DynamoDB foi escolhido para a persistência planejada da V1.
- O modelo de dados é definido a partir dos padrões de acesso.
- O registro de cliques será separado do item principal da URL.
- A rota de redirecionamento será pública; operações pessoais e analytics exigirão autenticação.

## Manutenção da documentação

A documentação deve ser atualizada sempre que ocorrer uma das situações abaixo:

- uma regra de negócio for criada ou alterada;
- um endpoint tiver seu contrato modificado;
- uma decisão arquitetural importante for tomada;
- o modelo de dados ou um padrão de acesso for alterado;
- uma questão em aberto for resolvida;
- uma funcionalidade planejada for implementada;
- o escopo da V1 mudar.

Decisões arquiteturais relevantes não devem ser apagadas silenciosamente. Quando uma decisão anterior for substituída, um novo ADR deve registrar a mudança e suas justificativas.

## Objetivo da documentação

Esta documentação busca permitir que qualquer pessoa interessada no projeto consiga compreender:

- qual problema o CleanURL resolve;
- quais funcionalidades pertencem à V1;
- quais regras orientam o comportamento da aplicação;
- como a arquitetura foi organizada;
- como os dados serão armazenados e consultados;
- quais decisões técnicas foram tomadas;
- o que já foi implementado;
- quais pontos ainda precisam ser definidos.
