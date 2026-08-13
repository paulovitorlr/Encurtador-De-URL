# Índices Secundários

GSIs só devem ser adicionados quando existirem padrões de acesso que a chave principal não atende de forma adequada.

## Consulta por LongURL

Estrutura conceitual em avaliação:

```text
GSI PK = LongURL
GSI SK = CreatedAt
```

Esse índice pode permitir localizar múltiplas ShortURLs associadas à mesma LongURL.

## Consulta de URLs por período

Estrutura conceitual em avaliação:

```text
GSI1PK = agrupador
GSI1SK = CreatedAt
```

O agrupador permite consultar itens por uma janela de `CreatedAt`.

## Atenção

Um valor fixo único para todos os itens no `GSI1PK` é simples para estudo, mas pode concentrar carga em escala. A estratégia definitiva deve ser validada antes de produção com volume relevante.
