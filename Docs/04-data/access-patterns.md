# Padrões de Acesso

## AP-01 — Criar URL

**Dado:** LongURL, usuário, dados temporais.

**Precisa criar:** ShortCode/ShortURL.

**Precisa registrar:** dados principais da URL.

## AP-02 — Resolver ShortURL

**Dado:** ShortCode.

**Precisa encontrar:** LongURL, `CreatedAt`, `ExpiresAt` e dados necessários para validar o redirecionamento.

## AP-03 — Consultar URL

**Dado:** ShortCode.

**Precisa encontrar:** informações da URL sem gerar clique.

## AP-04 — Registrar clique

**Dado:** ShortCode + momento do acesso + identificador do evento.

**Precisa criar:** evento de clique.

## AP-05 — Consultar cliques

**Dado:** ShortCode.

**Precisa encontrar:** eventos de clique relacionados à URL.

## AP-06 — Consultar cliques por período

**Dado:** ShortCode + intervalo temporal.

**Precisa encontrar:** somente os eventos dentro do período.

## AP-07 — Consultar por LongURL

Padrão em avaliação para descobrir ShortURLs associadas à mesma LongURL.

## AP-08 — Consultar URLs por período de criação

Padrão em avaliação para analytics/agregações administrativas e estudo de GSI.
