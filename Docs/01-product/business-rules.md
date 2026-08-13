# Regras de Negócio

Este documento contém regras do produto. Elas devem continuar verdadeiras independentemente do framework ou banco escolhido.

## RN-01 — Criação exige autenticação

Somente usuários autenticados podem criar ShortURLs.

## RN-02 — Redirecionamento é público

Qualquer visitante pode acessar uma ShortURL válida sem possuir conta no CleanURL.

## RN-03 — Analytics são privados

Os analytics de uma ShortURL só podem ser consultados por um usuário autorizado sobre aquele recurso.

## RN-04 — Definição de clique

Um clique é uma requisição válida recebida pela ShortURL que inicia o fluxo de redirecionamento.

Se o mesmo visitante acessar o link duas vezes, são contabilizados dois cliques.

Clique e visitante único são métricas diferentes.

## RN-05 — Escopo termina no redirecionamento

O CleanURL não mede ações realizadas dentro do site de destino.

## RN-06 — Validade

Antes de redirecionar, o sistema deve verificar se a URL está dentro do período permitido por `ExpiresAt`.

## RN-07 — Propriedade

Toda ShortURL criada na área autenticada deve ser associada ao usuário que a criou.

## RN-08 — Tráfego artificial

Na V1, acessos válidos são contabilizados como cliques. Estratégias avançadas de detecção de fraude, bots ou inflação artificial de métricas ficam fora do escopo inicial.
