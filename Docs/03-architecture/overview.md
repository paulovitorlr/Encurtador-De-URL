# Visão Geral da Arquitetura

A arquitetura deve separar a interface HTTP das regras de negócio e da persistência.

```text
Cliente
  ↓
API / Routes
  ↓
Controller
  ↓
Service / Casos de uso
  ↓
Repository
  ↓
DynamoDB
```

## Área pública

```text
GET /
GET /{shortCode}
```

O redirecionamento precisa funcionar sem autenticação.

## Área autenticada

```text
POST /api/v1/urls
GET  /api/v1/analytics
GET  /api/v1/analytics/{shortCode}
```

## Arquitetura não é regra de negócio

Exemplo de regra de negócio:

> Somente o proprietário pode consultar os analytics da ShortURL.

Exemplo de decisão arquitetural que implementa essa regra:

> O endpoint de analytics exige autenticação e o Service verifica a propriedade antes de consultar os eventos.

## Objetivo da separação

- Controllers lidam com HTTP.
- Services executam regras e casos de uso.
- Repositories encapsulam acesso aos dados.
- O domínio não deve depender de detalhes do DynamoDB ou do framework HTTP.
