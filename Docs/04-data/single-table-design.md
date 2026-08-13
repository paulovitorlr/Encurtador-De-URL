# Single Table Design

A modelagem atual mantém o item principal da URL e seus eventos de clique na mesma tabela.

## Chave principal

```text
PK = ShortCode
SK = Tipo + Valor
```

Exemplo conceitual:

```text
PK      | SK
--------|---------------------------------------------
s23B    | URL#2026-08-13T10:00:00Z
s23B    | CLICK#2026-08-13T10:15:32Z#<eventId>
s23B    | CLICK#2026-08-13T10:32:47Z#<eventId>
```

## Item URL

Pode conter:

- LongURL;
- ShortCode;
- proprietário;
- CreatedAt;
- ExpiresAt;
- atributos necessários aos índices.

## Item CLICK

Representa um evento de acesso individual. O timestamp participa da ordenação; um identificador adicional evita colisões entre eventos com o mesmo timestamp.

## Motivo dos prefixos

Prefixos como `URL#` e `CLICK#` permitem distinguir tipos de item dentro da mesma Partition Key e construir consultas específicas.
