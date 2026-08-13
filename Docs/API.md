# Arquitetura e Responsabilidades da API

## Objetivo do sistema

O CleanURL é um serviço de encurtamento de URLs responsável por transformar
uma URL longa em uma URL curta, permitir o redirecionamento para o destino
original e registrar eventos de acesso para geração de métricas.

O sistema deverá:

- Receber uma URL longa e gerar uma URL curta.
- Validar a URL fornecida pelo cliente.
- Gerar um identificador único para a URL curta utilizando Base62.
- Controlar a validade da URL por meio de `CreatedAt` e `ExpiresAt`.
- Redirecionar o usuário para a URL original.
- Registrar os acessos realizados por meio da URL curta.
- Disponibilizar informações e métricas relacionadas aos acessos.

---

# O que os clientes esperam?

Os principais comportamentos esperados são:

- Ser redirecionado rapidamente para a página original.
- Poder acompanhar os acessos realizados por uma URL específica.
- Visualizar métricas relacionadas ao tráfego.
- Identificar períodos de maior movimentação da URL.

O CleanURL é responsável pelo acesso à URL curta e pelo registro desse
evento. O comportamento do usuário após chegar ao site de destino não faz
parte da responsabilidade do CleanURL.

---

# Responsabilidades da API

A API será responsável por intermediar as operações entre o cliente,
as regras de negócio e os recursos utilizados pelo sistema.

Fluxo conceitual:

Cliente
↓
API
↓
Controller
↓
Service
↓
Repository
↓
DynamoDB

O cliente não deverá acessar o banco de dados diretamente.

---

# Principais operações

Inicialmente, o sistema será dividido em três operações principais:

- Criar uma URL
- Acessar uma URL
- Consultar uma URL

---

# Base da API

A API utilizará uma estrutura versionada:

`/api/v1`

O domínio do serviço de redirecionamento e o domínio utilizado pela API
ainda serão avaliados durante a definição da arquitetura.

---

# Criar uma URL

## Objetivo

Receber uma URL longa e criar uma nova URL curta.

## Método

`POST`

## Entrada

O cliente deverá fornecer uma `LongURL`.

Exemplo conceitual:

`https://exemplo.com/produtos/celulares/iphone`

## Processo

1. Receber a `LongURL`.
2. Validar a estrutura da URL.
3. Avaliar se será necessário verificar se o destino realmente existe.
4. Gerar um identificador único utilizando Base62.
5. Associar o identificador ao domínio do CleanURL.
6. Registrar a data de criação (`CreatedAt`).
7. Definir a data de expiração (`ExpiresAt`), quando aplicável.
8. Persistir as informações.
9. Retornar a URL curta ao cliente.

Fluxo:

LongURL
↓
Validação
↓
Geração do identificador
↓
ShortURL
↓
CreatedAt / ExpiresAt
↓
Persistência
↓
Resposta ao cliente

---

# Acessar uma URL

## Objetivo

Permitir que o usuário utilize a URL curta para chegar ao endereço
original.

Exemplo conceitual:

`https://cleanurl.com/s23B`

O sistema deverá:

1. Receber o identificador da URL curta.
2. Localizar a URL correspondente.
3. Verificar se a URL ainda está válida.
4. Registrar o evento de acesso.
5. Redirecionar o usuário para a `LongURL`.

Fluxo:

ShortURL
↓
Buscar URL
↓
Verificar validade
↓
Registrar evento
↓
Redirecionamento
↓
LongURL

---

# Redirecionamento HTTP

Foram identificados três possíveis códigos de status para o
redirecionamento:

- `301`
- `302`
- `307`

## 301 — Moved Permanently

Indica que o recurso foi movido permanentemente para outro endereço.

É utilizado, por exemplo, quando uma página possui uma URL antiga e foi
transferida definitivamente para uma nova URL.

Um dos motivos para utilizar o `301` é comunicar aos mecanismos de busca
que a mudança é permanente e que os sinais associados à URL antiga devem
ser considerados na nova URL.

### Exemplo

`/produtos/setor-iphones`

foi substituído permanentemente por:

`/produtos/celulares/iphones`

---

## 302 — Found

Indica um redirecionamento temporário.

O cliente recebe a informação de que o recurso está temporariamente
disponível em outro endereço.

No contexto do CleanURL, o fluxo seria conceitualmente:

GET /s23B
↓
302
↓
Location: LongURL
↓
GET LongURL

A questão do comportamento de clientes em relação à preservação do método
HTTP durante redirecionamentos `301` e `302` será considerada na decisão
final do código utilizado pelo sistema.

---

## 307 — Temporary Redirect

Também representa um redirecionamento temporário, porém possui como
característica importante a preservação do método da requisição e do
corpo da requisição durante o redirecionamento.

Por exemplo:

POST /recurso
↓
307
↓
POST /novo-recurso

No CleanURL, normalmente o acesso à URL curta será realizado utilizando
`GET`, portanto a necessidade de preservar um corpo de requisição não é
uma característica central do nosso fluxo.

---

# Decisão sobre o código de redirecionamento

A escolha entre `301`, `302` e `307` ainda não será definida apenas pela
característica de permanência do redirecionamento.

Também será necessário avaliar:

- comportamento de cache;
- impacto sobre o registro de cliques;
- comportamento dos navegadores;
- comportamento de intermediários como CDNs e proxies;
- necessidade de que os acessos continuem chegando ao CleanURL.

Essa decisão será tomada durante a definição da arquitetura de
redirecionamento.

---

# Consultar uma URL

## Objetivo

Permitir que o proprietário da URL consulte informações relacionadas à
sua ShortURL.

Exemplo conceitual:

`/api/v1/consultas/s23B`

A consulta poderá apresentar informações como:

- quantidade de cliques;
- cliques por período;
- horários de maior movimentação;
- data de criação;
- data de expiração;
- outras métricas que sejam adicionadas posteriormente.

## Observação

A consulta de analytics não deve necessariamente ser pública.

Será necessário definir posteriormente um mecanismo de autenticação e
autorização para determinar quem possui permissão para consultar os dados
de uma determinada ShortURL.

---

# Definição de clique

Um clique representa uma requisição válida recebida pela ShortURL que
resulta no início do redirecionamento para a URL de destino.

Exemplo:

Usuário
↓
Acessa /s23B
↓
CleanURL recebe a requisição
↓
Evento de clique
↓
Redirecionamento
↓
Site de destino

A interação posterior do usuário com o site de destino não faz parte da
responsabilidade do CleanURL.

---

# Cliques repetidos

Cada novo acesso à ShortURL será considerado um novo clique.

Exemplo:

Usuário A
↓
/s23B
↓
Clique 1

Usuário A
↓
/s23B
↓
Clique 2

Resultado:

`2 cliques`

O sistema não considerará inicialmente que múltiplos acessos realizados
pela mesma pessoa representam um único clique.

---

# Cliques e visitantes únicos

"Quantidade de cliques" e "quantidade de visitantes únicos" são métricas
diferentes.

Exemplo:

Um visitante acessa a mesma URL três vezes.

Resultado:

- Cliques: 3
- Visitante identificado: 1

A identificação de visitantes únicos poderá ser estudada posteriormente
por meio de mecanismos como:

- identificador armazenado no navegador;
- sessão;
- usuário autenticado;
- outros mecanismos de identificação.

Nenhum desses mecanismos garante que um identificador represente
necessariamente uma pessoa física.

Um mesmo usuário pode utilizar diferentes navegadores ou dispositivos,
enquanto diferentes pessoas podem utilizar o mesmo dispositivo.

---

# Usuário proprietário x visitante

O proprietário da ShortURL e o visitante da URL são entidades diferentes.

## Proprietário

É o usuário responsável pela criação da ShortURL.

Exemplo:

UserId
↓
ShortURL

O proprietário poderá futuramente possuir permissões para:

- consultar analytics;
- gerenciar suas URLs;
- controlar seus recursos;
- utilizar limites relacionados ao seu plano.

## Visitante

É qualquer pessoa que acessar a ShortURL.

O visitante não precisa necessariamente estar autenticado.

Exemplo:

User A cria:

`https://cleanurl.com/s23B`

Depois compartilha o link.

Visitantes diferentes poderão acessar:

`https://cleanurl.com/s23B`

Esses visitantes não precisam possuir relação de autenticação com o
proprietário da URL.

---

# Tráfego artificial

Existe a possibilidade de usuários tentarem inflar artificialmente as
métricas de uma URL.

Exemplo:

- abrir e fechar repetidamente uma URL;
- utilizar várias pessoas para acessar o mesmo link;
- utilizar automações ou bots;
- gerar grande quantidade de requisições artificialmente.

Inicialmente, cada acesso válido será contabilizado como um clique.

Não será adotado neste momento um limite arbitrário de cliques por
usuário, pois isso poderia também descartar acessos legítimos.

Será necessário estudar posteriormente mecanismos de identificação e
tratamento de tráfego artificial.

Possíveis conceitos a serem investigados:

- Rate Limiting;
- Bot Detection;
- visitantes únicos;
- sessões;
- análise de padrões de acesso;
- tráfego inválido.

---

# Alto volume de acessos

O registro de cliques pode gerar uma quantidade significativa de eventos.

Exemplo:

Uma campanha pode gerar:

`1.000 acessos`

ou até:

`1.000.000 acessos`

em um curto período.

Isso cria possíveis problemas relacionados a:

- quantidade de requisições;
- quantidade de escritas;
- capacidade de processamento;
- distribuição das operações;
- carga sobre o banco de dados;
- latência do redirecionamento.

Por esse motivo, a arquitetura deverá considerar posteriormente
estratégias para lidar com grandes volumes de eventos.

---

# Processamento de cliques

O registro de um clique não deve necessariamente bloquear o
redirecionamento do usuário.

O caminho principal da requisição é:

GET /s23B
↓
Localizar destino
↓
Validar URL
↓
Redirecionar

Enquanto o registro analítico poderá futuramente utilizar mecanismos
desacoplados do caminho crítico.

Possíveis tecnologias e estratégias a serem estudadas posteriormente:

- mensageria;
- processamento assíncrono;
- filas;
- event logging;
- cache;
- CDN;
- rate limiting;
- estratégias de escrita no DynamoDB.

Essas estratégias não fazem parte da implementação inicial.

Neste momento, elas são registradas como pontos de investigação
arquitetural para futuras necessidades de escala.

---

# Princípio de acesso ao banco

O cliente nunca deverá acessar o DynamoDB diretamente.

O acesso aos dados será intermediado pela aplicação:

Cliente
↓
API
↓
Controller
↓
Service
↓
Repository
↓
DynamoDB

Essa separação permite que as regras de negócio permaneçam na aplicação
e evita expor diretamente o banco de dados aos clientes.

---

# Questões ainda em aberto

As seguintes decisões ainda precisam ser investigadas antes da
implementação definitiva:

- Qual código de redirecionamento será utilizado: `301`, `302` ou `307`?
- Qual será o impacto do cache sobre o registro de cliques?
- O domínio da ShortURL será o mesmo domínio utilizado pela API?
- Como validar a estrutura de uma URL?
- Será necessário verificar se o destino realmente existe?
- Como autenticar o proprietário da ShortURL?
- Como autorizar o acesso aos analytics?
- Como identificar visitantes únicos?
- Como tratar bots e tráfego artificial?
- Como lidar com grandes picos de cliques?
- O registro de cliques será síncrono ou assíncrono?
- Como distribuir os eventos de clique no DynamoDB em situações de alto
  volume?

Essas questões serão resolvidas durante as próximas etapas de
modelagem e arquitetura.

# Definições de Endpoints

A API será dividida entre recursos públicos e recursos que exigem autenticação.

Apenas a página inicial e o acesso às ShortURLs serão públicos. As operações de gerenciamento e consulta de analytics exigirão um usuário autenticado.

## Visão geral

### Recursos públicos

- `GET /`
- `GET /{shortCode}`

### Recursos autenticados

- `POST /api/v1/urls`
- `GET /api/v1/analytics`
- `GET /api/v1/analytics/{shortCode}`

---

# Criar uma ShortURL

### Endpoint

`POST /api/v1/urls`

### Objetivo

Criar uma nova ShortURL a partir de uma LongURL fornecida pelo usuário.

### Quem pode chamar?

Somente usuários autenticados.

### O que envia?

Um objeto contendo a LongURL.

Exemplo conceitual:

```json
{
  "longUrl": "https://exemplo.com/uma/url/muito/grande"
}
```

### O que o sistema faz?

1. Verifica se o usuário está autenticado.
2. Valida a LongURL recebida.
3. Gera um ShortCode único.
4. Define a data de criação.
5. Define a data de expiração, caso aplicável.
6. Associa a ShortURL ao usuário que a criou.
7. Persiste os dados.
8. Retorna os dados da ShortURL criada.

### O que retorna?

A ShortURL criada e seus dados relevantes.

Exemplo conceitual:

```json
{
  "shortUrl": "https://cleanurl.com/s23B",
  "createdAt": "...",
  "expiresAt": "..."
}
```

### Status de sucesso

`201 Created`

### Possíveis erros

- LongURL inválida → requisição rejeitada.
- LongURL ausente → requisição rejeitada.
- Usuário não autenticado → `401 Unauthorized`.

A API informa que a requisição não está autenticada. O frontend poderá utilizar essa resposta para encaminhar o usuário para a tela de login/registro.

---

# Consultar Analytics da Conta

### Endpoint

`GET /api/v1/analytics`

### Objetivo

Retornar uma visão geral dos acessos das ShortURLs pertencentes ao usuário autenticado.

### Quem pode chamar?

Somente usuários autenticados.

### O que envia?

Nenhum dado obrigatório no corpo da requisição.

A identificação do usuário será obtida através do mecanismo de autenticação.

### O que o sistema faz?

1. Verifica se o usuário está autenticado.
2. Identifica o usuário através da autenticação.
3. Localiza as ShortURLs pertencentes ao usuário.
4. Consulta os eventos e métricas relacionados.
5. Retorna os analytics agregados.

### O que retorna?

Exemplos:

- Quantidade total de cliques.
- Cliques por período.
- Horários de maior movimentação.
- Quantidade de ShortURLs.
- URLs com maior número de acessos.

### Status de sucesso

`200 OK`

### Possíveis erros

- Usuário não autenticado → `401 Unauthorized`.

Não se aplica validação de LongURL ou ShortCode neste endpoint, pois nenhuma URL específica é informada.

---

# Consultar Analytics de uma ShortURL

### Endpoint

`GET /api/v1/analytics/{shortCode}`

Exemplo:

`GET /api/v1/analytics/s23B`

### Objetivo

Retornar os analytics de uma ShortURL específica.

### Quem pode chamar?

Somente usuários autenticados e autorizados a consultar a ShortURL informada.

### O que envia?

O `shortCode` utilizado para identificar a ShortURL.

### O que o sistema faz?

1. Verifica se o usuário está autenticado.
2. Identifica a ShortURL através do `shortCode`.
3. Verifica se a ShortURL pertence ao usuário autenticado.
4. Consulta os eventos e métricas relacionados.
5. Retorna os analytics da ShortURL.

### O que retorna?

Exemplos:

- Quantidade de cliques.
- Cliques por período.
- Horários de maior movimentação.
- Histórico de acessos.
- Data de criação.
- Data de expiração.

### Status de sucesso

`200 OK`

### Possíveis erros

- Usuário não autenticado → `401 Unauthorized`.
- ShortCode inexistente → `404 Not Found`.
- ShortURL existente, mas não pertence ao usuário → acesso negado.

---

# Acessar uma ShortURL

### Endpoint

`GET /{shortCode}`

Exemplo:

`GET /s23B`

### Objetivo

Permitir que qualquer pessoa utilize uma ShortURL e seja redirecionada para a LongURL correspondente.

### Quem pode chamar?

Qualquer pessoa. Não é necessário possuir uma conta no CleanURL.

### O que envia?

O `shortCode` através da própria URL.

Exemplo:

`https://cleanurl.com/s23B`

### O que o sistema faz?

1. Recebe o `shortCode`.
2. Localiza a ShortURL correspondente.
3. Verifica se a ShortURL existe.
4. Verifica se ainda está válida.
5. Registra o evento de acesso.
6. Redireciona o cliente para a LongURL.

### O que retorna?

Uma resposta HTTP de redirecionamento contendo a LongURL no cabeçalho `Location`.

```text
HTTP/1.1 302 Found
Location: https://exemplo.com/produto/123
```

### Status de sucesso

`302 Found`

### Possíveis erros

- ShortCode inexistente → `404 Not Found`.
- ShortURL expirada → requisição rejeitada.
- ShortURL inválida ou indisponível → requisição rejeitada.

O comportamento exato para URLs expiradas será definido posteriormente.

---

# Resumo dos Endpoints

| Método | Endpoint | Autenticação | Objetivo |
|---|---|---|---|
| `GET` | `/` | Não | Página inicial |
| `POST` | `/api/v1/urls` | Sim | Criar ShortURL |
| `GET` | `/api/v1/analytics` | Sim | Analytics da conta |
| `GET` | `/api/v1/analytics/{shortCode}` | Sim | Analytics de uma ShortURL |
| `GET` | `/{shortCode}` | Não | Redirecionar para LongURL |

## Separação de responsabilidades

Os endpoints autenticados são utilizados para gerenciamento e consulta das URLs do usuário.

O endpoint público `/{shortCode}` permite que qualquer pessoa utilize a ShortURL sem precisar possuir uma conta no CleanURL.

A autenticação identifica **quem é o usuário**.

A autorização determina **se esse usuário possui permissão para acessar determinado recurso**.

O frontend será responsável por apresentar telas de login e pelo tratamento visual dos erros. A API será responsável por autenticar, autorizar, processar as regras de negócio e retornar os respectivos códigos HTTP

