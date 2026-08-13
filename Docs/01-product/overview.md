# Visão do Produto

## Problema

URLs podem ser extensas, difíceis de compartilhar e pouco amigáveis visualmente. Além do encurtamento, existe valor em observar quando os links são acessados para entender o desempenho de uma campanha ou divulgação.

## Proposta

O CleanURL recebe uma URL original e gera um identificador curto que pode ser compartilhado publicamente. Quando alguém acessa esse identificador, o serviço localiza o destino, registra o evento de acesso e redireciona o visitante.

Fluxo principal:

```text
Proprietário → LongURL → CleanURL → ShortURL
                                ↓
Visitante → ShortURL → registro do clique → redirecionamento → LongURL
```

## Atores

### Proprietário

Usuário autenticado que cria uma ShortURL e pode consultar seus analytics.

### Visitante

Pessoa que recebe e acessa uma ShortURL. Não precisa possuir conta no CleanURL.

## Responsabilidade do CleanURL

O CleanURL observa o acesso até o início do redirecionamento. O que o visitante faz depois de chegar ao site de destino pertence ao sistema de destino e não faz parte do CleanURL.
