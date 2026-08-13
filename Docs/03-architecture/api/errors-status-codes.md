# Erros e Status Codes

## Sucessos

### `201 Created`

Usado quando `POST /api/v1/urls` cria uma nova URL.

### `200 OK`

Usado nas consultas de analytics quando executadas com sucesso.

### `302 Found`

Resposta atual do endpoint público de redirecionamento.

## Erros principais

### `400 Bad Request`

Candidato para entradas inválidas, como LongURL ausente ou com formato rejeitado pela aplicação.

### `401 Unauthorized`

A requisição exige autenticação e o cliente não apresentou uma identidade válida.

### `403 Forbidden`

Pode ser utilizado quando o usuário está autenticado, mas não possui permissão para consultar o recurso.

Como alternativa de segurança, poderá ser avaliado retornar `404` para não revelar a existência de recursos pertencentes a terceiros.

### `404 Not Found`

ShortCode ou recurso solicitado não foi encontrado.

## Pendência

O comportamento HTTP específico de ShortURLs expiradas ainda precisa ser definido.
