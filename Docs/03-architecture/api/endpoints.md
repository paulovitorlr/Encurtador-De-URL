# Contratos dos Endpoints — V1

## Resumo

| Método | Endpoint | Acesso | Objetivo |
|---|---|---|---|
| `GET` | `/` | Público | Página inicial |
| `GET` | `/{shortCode}` | Público | Redirecionar para LongURL |
| `POST` | `/api/v1/urls` | Autenticado | Criar ShortURL |
| `GET` | `/api/v1/analytics` | Autenticado | Analytics agregados da conta |
| `GET` | `/api/v1/analytics/{shortCode}` | Autenticado + autorizado | Analytics de uma ShortURL |

---

## POST `/api/v1/urls`

### Objetivo

Criar uma nova ShortURL.

### Entrada

```json
{
  "longUrl": "https://exemplo.com/uma/url/grande"
}
```

### Processamento esperado

1. Confirmar autenticação.
2. Validar a LongURL.
3. Gerar ShortCode.
4. Definir dados de criação/expiração.
5. Associar a URL ao proprietário.
6. Persistir.
7. Retornar a representação criada.

### Saída conceitual

```json
{
  "shortUrl": "https://cleanurl.com/s23B",
  "shortCode": "s23B",
  "createdAt": "...",
  "expiresAt": "..."
}
```

### Sucesso

`201 Created`

---

## GET `/api/v1/analytics`

### Objetivo

Retornar analytics agregados das ShortURLs pertencentes ao usuário autenticado.

### Entrada

Não exige body. A identidade vem da autenticação.

### Saída esperada

Pode incluir, conforme a V1 for fechada:

- total de cliques;
- cliques por período;
- horários de maior movimento;
- quantidade de ShortURLs;
- URLs com maior número de acessos.

### Sucesso

`200 OK`

---

## GET `/api/v1/analytics/{shortCode}`

### Objetivo

Retornar analytics de uma ShortURL específica.

### Regras

- exige autenticação;
- o `shortCode` deve existir;
- o recurso precisa pertencer ao usuário autenticado.

### Sucesso

`200 OK`

---

## GET `/{shortCode}`

### Objetivo

Resolver uma ShortURL pública e redirecionar o visitante.

### Processamento esperado

1. Buscar a URL pelo ShortCode.
2. Validar existência.
3. Verificar validade.
4. Registrar o evento de clique.
5. Responder com redirecionamento.

### Sucesso atual

`302 Found` com header `Location` apontando para a LongURL.
