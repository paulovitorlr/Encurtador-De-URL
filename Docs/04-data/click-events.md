# Eventos de Clique

## Definição

Cada acesso válido à ShortURL gera um evento de clique.

## Estrutura conceitual

```text
PK = <shortCode>
SK = CLICK#<timestamp>#<eventId>
```

## Por que não usar somente um contador?

Eventos individuais permitem responder perguntas como:

- quantos cliques ocorreram;
- em quais horários ocorreram;
- qual foi o período de maior movimento;
- quais cliques pertencem a uma janela temporal.

## Unicidade

Timestamp sozinho pode colidir. A principal alternativa em estudo é adicionar um UUID/GUID ou identificador equivalente ao final da Sort Key.

## Escala

Uma ShortURL muito popular pode gerar alto volume de escrita associado à mesma chave de agrupamento. Antes de escalar, devem ser estudados hot partitions, processamento assíncrono e estratégias de distribuição de escrita.
