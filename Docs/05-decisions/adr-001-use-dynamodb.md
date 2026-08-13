# ADR-001 — Utilizar DynamoDB

**Status:** Aceita para a V1/estudo

## Contexto

O projeto precisa persistir URLs e eventos de clique e será utilizado para estudar modelagem NoSQL orientada por padrões de acesso.

## Decisão

Utilizar DynamoDB como banco inicial.

## Motivos

- aprendizado prático de NoSQL;
- necessidade de modelar consultas antes da estrutura física;
- oportunidade de estudar Partition Key, Sort Key, GSI e distribuição de acesso.

## Consequências

- a modelagem não seguirá o mesmo processo de normalização de um banco relacional;
- padrões de acesso precisam ser explícitos;
- mudanças nos padrões podem exigir novos índices ou alterações de modelagem.
