# DynamoDB — Visão Geral da Modelagem

O DynamoDB foi escolhido principalmente como oportunidade de estudar modelagem NoSQL orientada por padrões de acesso em um problema real.

## Estratégia atual

- Single Table Design.
- `ShortCode`/ShortURL como principal chave de agrupamento dos dados da URL.
- Sort Key com prefixos para diferenciar o item principal dos eventos.
- Eventos de clique persistidos individualmente.
- GSIs apenas quando um padrão de acesso não puder ser atendido pela chave principal.

## Regra de modelagem

A tabela não deve ser desenhada primeiro para depois descobrir como consultá-la.

```text
Caso de uso
   ↓
Padrão de acesso
   ↓
Chaves / índices
   ↓
Estrutura dos itens
```
