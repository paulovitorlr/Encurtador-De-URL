# CleanURL Web

Front-end básico em Angular (standalone components) para consumir a API `cleanurl-api`,
sem precisar chamar o backend diretamente via HTTP/Postman.

## O que faz

- Um formulário único: cole a URL longa, clique em **Encurtar**.
- Chama `POST /api/v1/urls` da API e exibe o link encurtado retornado.
- Botão para copiar o link e link clicável para testar o redirecionamento.
- Tratamento de erros (URL inválida, API fora do ar, etc).

## Como rodar

1. Instale as dependências:
   ```bash
   cd cleanurl-web
   npm install
   ```

2. Garanta que a API está rodando em `http://localhost:3000` (veja `cleanurl-api/README.md`).
   Foi adicionado `app.enableCors(...)` em `cleanurl-api/src/main.ts` e a variável
   `CORS_ORIGIN=http://localhost:4200` no `.env` da API, para permitir chamadas do Angular.

3. Suba o front-end:
   ```bash
   npm start
   ```
   A aplicação abre em `http://localhost:4200`.

## Configuração da URL da API

O endereço da API fica em `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
};
```

Ajuste `apiUrl` se a API rodar em outra porta/host.

## Estrutura

```
src/app/
  models/short-url.model.ts     # interfaces alinhadas com os DTOs da API
  services/short-url.service.ts # chamada HTTP (POST /urls)
  app.component.ts/.html/.css   # formulário + estado (loading, erro, resultado)
```
