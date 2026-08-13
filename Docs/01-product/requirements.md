# Requisitos

## Requisitos funcionais

### RF-01 — Autenticar usuário

O sistema deve permitir autenticação por Google para as funções de gerenciamento.

### RF-02 — Criar ShortURL

Um usuário autenticado deve conseguir enviar uma LongURL e receber uma ShortURL.

### RF-03 — Validar LongURL

O sistema deve rejeitar entradas que não representem uma URL válida segundo as regras definidas pela aplicação.

### RF-04 — Redirecionar visitante

Ao acessar uma ShortURL válida e ativa, o visitante deve ser redirecionado para a LongURL correspondente.

### RF-05 — Registrar clique

Cada acesso válido à ShortURL deve gerar um evento de clique.

### RF-06 — Consultar analytics gerais

O usuário autenticado deve conseguir consultar uma visão agregada dos acessos de suas ShortURLs.

### RF-07 — Consultar analytics específicos

O usuário autenticado deve conseguir consultar os analytics de uma ShortURL que pertença a ele.

### RF-08 — Verificar validade

Uma URL expirada não deve seguir o fluxo normal de redirecionamento.

## Requisitos não funcionais

### RNF-01 — Baixa latência

O redirecionamento deve adicionar o mínimo possível de atraso perceptível ao visitante.

### RNF-02 — Disponibilidade

O endpoint público de redirecionamento é parte crítica do produto e deve ser tratado como caminho de alta disponibilidade.

### RNF-03 — Segurança

Analytics e criação de URLs devem exigir autenticação; analytics específicos devem exigir também autorização sobre o recurso.

### RNF-04 — Escalabilidade

A arquitetura deve permitir evolução para volumes maiores de leitura e eventos de clique sem exigir reescrita completa do domínio.

### RNF-05 — Extensibilidade

Novas capacidades devem poder ser adicionadas sem espalhar regras específicas por toda a aplicação.
