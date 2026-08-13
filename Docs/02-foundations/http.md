# HTTP — Notas de Estudo

HTTP é um protocolo da camada de aplicação utilizado para troca de mensagens entre clientes e servidores na Web.

## Modelo básico

```text
Cliente → Request → Servidor
Cliente ← Response ← Servidor
```

O cliente inicia a requisição e o servidor retorna uma resposta.

## Stateless

HTTP é stateless: uma requisição não depende automaticamente da memória de requisições anteriores. Estado de sessão pode ser construído por mecanismos adicionais, como cookies ou tokens.

## Headers

Cabeçalhos carregam metadados da requisição ou resposta e permitem estender o protocolo sem alterar sua estrutura fundamental.

## Métodos relevantes ao CleanURL

- `GET` — recuperar um recurso ou iniciar o acesso a uma ShortURL.
- `POST` — criar um novo recurso URL.

Outros métodos só devem ser introduzidos quando existir um requisito real para eles.
