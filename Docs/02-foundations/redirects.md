# Redirecionamentos HTTP

O CleanURL precisa responder ao navegador informando para qual endereço ele deve seguir.

## 301 — Moved Permanently

Indica mudança permanente. Pode ter efeitos de cache e de indexação que não são necessariamente desejáveis para um encurtador que quer observar cada acesso.

## 302 — Found

Indica redirecionamento temporário. É a escolha atual para a V1, pois o fluxo principal usa `GET` e o serviço precisa continuar recebendo os acessos para registrar cliques.

Exemplo conceitual:

```text
GET /s23B
↓
302 Found
Location: https://destino.com/...
↓
GET https://destino.com/...
```

## 307 — Temporary Redirect

Também é temporário, mas preserva explicitamente o método e o corpo da requisição. Como o fluxo público do CleanURL é baseado em `GET`, essa diferença não é central para a V1.

## Ponto ainda a validar

Antes de considerar a decisão definitiva, devem ser testados os efeitos de cache do redirecionamento em navegadores, proxies/CDNs e no registro de cliques.
