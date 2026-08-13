# ADR-003 — Single Table Design para URL e eventos

**Status:** Aceita conceitualmente

## Contexto

Uma ShortURL possui um item principal e vários eventos de clique. Os padrões de acesso frequentemente partem do mesmo ShortCode.

## Decisão

Manter os tipos de item relacionados na mesma tabela, diferenciados por Sort Key prefixada.

## Exemplo

```text
PK=s23B | SK=URL#...
PK=s23B | SK=CLICK#...#<eventId>
```

## Consequências

- consultas relacionadas podem compartilhar a mesma Partition Key;
- a estrutura exige disciplina de nomenclatura das chaves;
- novos padrões de acesso devem ser avaliados antes de adicionar índices.
