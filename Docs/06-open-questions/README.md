# Questões em Aberto

Estas questões foram identificadas, mas ainda não devem ser tratadas como decisões definitivas.

## API e redirecionamento

- Validar apenas a sintaxe da LongURL ou também verificar disponibilidade do destino?
- Qual comportamento HTTP adotar para ShortURL expirada?
- Quais efeitos reais de cache o `302` terá no ambiente de produção?

## Autenticação

- Qual fluxo exato de integração com Google será utilizado no backend/frontend?
- Como representar o identificador do proprietário no modelo do DynamoDB?

## Cliques

- UUID/GUID será a estratégia definitiva para unicidade de eventos?
- Qual precisão de timestamp será utilizada?
- Quando será necessário desacoplar registro de clique do redirecionamento?
- Como lidar com hot partitions em links extremamente populares?

## Analytics

- Quais métricas entram exatamente na V1?
- Analytics agregados serão calculados em tempo real ou terão projeções/aggregates no futuro?

## DynamoDB

- O GSI por LongURL realmente será necessário na V1?
- O GSI por período de criação realmente é um requisito da V1?
- Qual estratégia de agrupamento usar caso a consulta por período seja mantida em escala?
- TTL será utilizado apenas para limpeza ou nem entrará na V1?

## Segurança e abuso

- Como tratar bots e tráfego artificial sem distorcer cliques legítimos?
- Em analytics de recurso alheio, retornar `403` ou ocultar a existência com `404`?
