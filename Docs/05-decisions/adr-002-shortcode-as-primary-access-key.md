# ADR-002 — ShortCode como chave principal de acesso à URL

**Status:** Aceita conceitualmente

## Contexto

O fluxo mais importante do produto recebe um ShortCode e precisa resolver rapidamente a LongURL correspondente.

## Decisão

Utilizar o ShortCode como valor principal de agrupamento/acesso dos dados relacionados a uma URL.

## Consequências

- o redirecionamento consulta diretamente pelo identificador público;
- eventos relacionados à URL podem compartilhar o mesmo agrupamento;
- padrões que não partem do ShortCode podem exigir GSIs.
