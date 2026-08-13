# Camadas e Responsabilidades

## Routes

Responsáveis por mapear método + caminho para um Controller.

Não devem conter regras de negócio.

## Controller

Responsável pela borda HTTP:

- ler path, query, body e identidade autenticada;
- chamar o caso de uso correto;
- transformar o resultado em resposta HTTP;
- escolher o status code adequado com base no resultado.

Não deve conhecer detalhes de acesso ao DynamoDB.

## Service / Caso de uso

Responsável pela lógica da aplicação.

Exemplos:

- validar se uma URL pode ser criada;
- gerar o ShortCode;
- definir `CreatedAt` e `ExpiresAt`;
- verificar expiração;
- verificar propriedade antes de retornar analytics;
- coordenar o registro de clique e o redirecionamento.

## Repository

Responsável por traduzir necessidades de persistência em operações no banco.

Exemplos:

- salvar URL;
- buscar URL por ShortCode;
- consultar eventos por período;
- recuperar dados necessários aos analytics.

## Banco

O DynamoDB persiste e recupera dados. Ele não deve concentrar regras de negócio da aplicação.

## Dependência conceitual

```text
HTTP → Application → Data Access → DynamoDB
```

O fluxo de chamadas vai para dentro; detalhes externos não devem se espalhar pelas regras do produto.
