# Analytics

Analytics é uma representação construída pela aplicação a partir dos eventos armazenados. Não precisa corresponder a uma tabela específica do banco.

## Analytics gerais

Endpoint:

`GET /api/v1/analytics`

Objetivo: apresentar uma visão agregada das URLs do proprietário autenticado.

Possíveis métricas da V1:

- total de cliques;
- cliques por faixa de tempo;
- horário de maior movimentação;
- URLs com maior volume de acessos.

## Analytics específicos

Endpoint:

`GET /api/v1/analytics/{shortCode}`

Objetivo: analisar somente os eventos relacionados à ShortURL informada.

## Clique x visitante único

Na V1, um acesso válido gera um clique, mesmo quando vem do mesmo visitante várias vezes.

Visitantes únicos são uma métrica diferente e ficam fora do escopo inicial.
