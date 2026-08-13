# Escopo da V1

A V1 deve ser pequena o suficiente para chegar à produção, mas completa o suficiente para validar o produto de ponta a ponta.

## Incluído

- Login com Google.
- Criação de ShortURL a partir de uma LongURL.
- Validação da URL recebida.
- Geração de ShortCode.
- Persistência dos dados da URL.
- Redirecionamento público por ShortCode.
- Registro individual dos eventos de clique.
- Consulta de analytics gerais da conta.
- Consulta de analytics de uma ShortURL específica.
- Verificação de propriedade antes de expor analytics.
- `CreatedAt` e `ExpiresAt` no modelo atual.
- Testes suficientes para publicar a V1 com confiança.

## Fora da V1

As funcionalidades abaixo são ideias de evolução e não devem aumentar o escopo da primeira entrega:

- Pagamentos.
- Planos e assinaturas.
- QR Code.
- Agendamento de links.
- Criação de páginas.
- Links protegidos por senha.
- Domínios personalizados.
- Alias personalizado pelo cliente.
- Detecção sofisticada de fraude/bots.

## Critério de conclusão

A V1 está pronta quando o usuário consegue autenticar, criar uma ShortURL, compartilhar o link, ter o visitante redirecionado corretamente e consultar os acessos gerados, com os fluxos principais testados e publicados.
