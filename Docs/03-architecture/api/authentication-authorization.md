# Autenticação e Autorização

## Autenticação

Responde à pergunta:

> Quem é o usuário?

A V1 pretende utilizar login com Google para autenticação da área de gerenciamento.

Rotas autenticadas:

- `POST /api/v1/urls`
- `GET /api/v1/analytics`
- `GET /api/v1/analytics/{shortCode}`

O endpoint `GET /{shortCode}` não exige login.

## Autorização

Responde à pergunta:

> Esse usuário pode acessar este recurso?

Estar autenticado não é suficiente para consultar analytics específicos. Antes de devolver os dados, a aplicação deve verificar se a ShortURL pertence ao usuário autenticado.

## API x Frontend

A API deve responder `401 Unauthorized` quando a autenticação necessária não estiver presente ou for inválida.

O frontend decide como representar isso para a pessoa, por exemplo, encaminhando-a para uma tela de login.
