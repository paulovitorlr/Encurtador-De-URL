# Modelagem do Banco de Dados

## Banco de dados

**DynamoDB**

Escolho o DynamoDB neste projeto principalmente para estudar modelagem NoSQL orientada aos padrões de acesso da aplicação, além de praticar uma solução real de pequena escala.

Por ser um banco NoSQL, o DynamoDB permite que os dados sejam modelados de acordo com os padrões de acesso da aplicação, em vez de depender de uma estrutura relacional tradicional.

A modelagem será baseada principalmente em:

- Partition Key
- Sort Key
- Índices secundários (GSI), quando necessários
- Single Table Design

---

# Estrutura principal

A aplicação terá inicialmente uma única tabela.

## Tabela: URL

Os principais dados relacionados à URL são:

- LongURL
- ShortURL
- CreatedAt
- ExpiresAt
- Eventos de clique

### LongURL

Representa o endereço original fornecido pelo usuário.

Exemplo:

`https://exemplo.com/produto/123`

A LongURL representa o destino original para o qual a ShortURL deverá redirecionar.

---

### ShortURL

Representa o identificador curto gerado pelo sistema.

Será utilizado **Base62** para gerar a parte curta da URL.

Exemplo:

`2b9X`

A ShortURL será utilizada como **Partition Key** da tabela principal, pois cada URL curta deve possuir um identificador único.

A ShortURL armazenará apenas a parte gerada pelo sistema, e não o endereço completo.

Exemplo:

`https://encurtador.com/2b9X`

O valor armazenado será:

`2b9X`

---

### CreatedAt

Representa a data e hora em que a URL foi criada.

Será utilizada para:

- registrar o momento de criação;
- análises;
- organização dos dados;
- consultas por período de criação;
- possibilitar futuras regras relacionadas à validade da URL.

---

### ExpiresAt

Representa o momento em que a URL deixa de ser válida.

A aplicação utilizará esse valor para determinar se uma URL ainda pode ser acessada.

Exemplo:

```text
CreatedAt = 2026-08-12T10:00:00
ExpiresAt = 2026-09-12T10:00:00
```

A verificação de validade será realizada pela aplicação durante o acesso à ShortURL.

---

# Chaves da tabela principal

## Partition Key

A **ShortURL** será utilizada como Partition Key.

Exemplo:

`2b9X`

A Partition Key permite localizar os dados relacionados a uma URL específica.

Como cada ShortURL deve ser única, ela funciona como o principal identificador da URL dentro da tabela.

---

## Sort Key

A Sort Key será utilizada para diferenciar os diferentes tipos de itens pertencentes à mesma URL.

Será utilizado um sistema de prefixos para identificar o tipo do item.

Exemplo conceitual:

```text
PK      | SK
--------|---------------------------------------------
2b9X    | URL#2026-08-12T10:00:00
2b9X    | CLICK#2026-08-12T10:15:32#UUID
2b9X    | CLICK#2026-08-12T10:32:47#UUID
2b9X    | CLICK#2026-08-12T11:47:03#UUID
```

Dessa forma, a mesma Partition Key pode conter o item principal da URL e diversos eventos relacionados a ela.

### Prefixos

`URL#`

Identifica o item principal que representa a URL.

`CLICK#`

Identifica um evento de clique.

A utilização dos prefixos permite diferenciar os tipos de itens dentro da mesma Partition Key e possibilita consultas específicas.

---

# Single Table Design

A tabela não será separada em uma tabela para URLs e outra para cliques.

Os diferentes tipos de informação serão armazenados na mesma tabela e diferenciados por meio da combinação:

```text
Partition Key + Sort Key
```

Exemplo:

```text
PK      | SK
--------|---------------------------------------------
2b9X    | URL#2026-08-12T10:00:00
2b9X    | CLICK#2026-08-12T10:15:32#UUID
2b9X    | CLICK#2026-08-12T10:32:47#UUID
2b9X    | CLICK#2026-08-12T11:47:03#UUID
```

Conceitualmente:

```text
                    ShortURL
                       |
                       v
                 Partition Key
                       |
            +----------+----------+
            |                     |
            v                     v
          URL#                  CLICK#
            |                     |
       dados da URL          eventos de clique
                                  |
                              timestamp
                                  |
                                ID único
```

A estrutura da tabela é determinada pelos padrões de acesso da aplicação.

---

# Eventos de clique

Cada acesso à URL curta gera um evento de clique.

O evento deverá registrar, no mínimo, o momento em que o clique ocorreu.

Exemplo conceitual:

```text
PK: 2b9X
SK: CLICK#2026-08-12T10:15:32#UUID
```

O clique não será tratado apenas como um contador.

A intenção é manter os eventos individualmente para permitir análises posteriores, como:

- quantidade de cliques;
- horário dos cliques;
- identificação de picos de acesso;
- consultas por período;
- histórico de acessos.

### Unicidade dos eventos

Existe a possibilidade de dois cliques ocorrerem no mesmo timestamp.

Exemplo:

```text
CLICK#2026-08-12T10:15:32
CLICK#2026-08-12T10:15:32
```

Para evitar colisões, o timestamp poderá ser acompanhado por um identificador único do evento.

Exemplo:

```text
CLICK#2026-08-12T10:15:32#UUID-1
CLICK#2026-08-12T10:15:32#UUID-2
```

A utilização de UUID/GUID é a principal estratégia considerada para garantir a unicidade dos eventos.

Essa decisão ainda será validada durante a implementação.

---

# Padrões de acesso

Os padrões de acesso representam as perguntas que a aplicação precisa responder ao banco de dados.

---

## Criar URL

### Dado

- LongURL
- CreatedAt
- ExpiresAt

### Preciso criar

- ShortURL

### Preciso registrar

- Data de criação
- Data de expiração

Fluxo conceitual:

```text
LongURL
CreatedAt
ExpiresAt
    |
    v
geração do identificador
    |
    v
ShortURL
    |
    v
persistência
```

A ShortURL será gerada pelo sistema utilizando Base62.

---

## Acessar URL curta

### Dado

- ShortURL

### Preciso encontrar

- LongURL
- CreatedAt
- ExpiresAt

### Preciso registrar

- Evento de clique

Fluxo conceitual:

```text
ShortURL
    |
    v
encontrar URL
    |
    v
verificar validade
    |
    +----> expirada
    |         |
    |         v
    |      não redireciona
    |
    v
registrar CLICK
    |
    v
redirecionar
    |
    v
LongURL
```

O redirecionamento faz parte do fluxo da aplicação, mas não representa necessariamente um dado que precise ser armazenado.

---

## Consultar URL

### Dado

- ShortURL

### Preciso encontrar

- Informações da URL

Exemplo:

```text
ShortURL
LongURL
CreatedAt
ExpiresAt
```

Essa operação não necessariamente gera um evento de clique.

---

## Consultar cliques

### Dado

- ShortURL

### Preciso encontrar

- Eventos de clique daquela URL

A consulta deverá utilizar a Partition Key da URL e identificar os itens de clique por meio do prefixo:

`CLICK#`

Conceitualmente:

```text
PK = ShortURL
SK começa com CLICK#
```

---

## Consultar cliques por período

### Dado

- ShortURL
- Período

### Preciso encontrar

- Eventos de clique daquela URL dentro do período informado

Conceitualmente:

```text
PK = ShortURL

SK:
CLICK#<data/hora inicial>
até
CLICK#<data/hora final>
```

A utilização da data e hora na Sort Key permite organizar os eventos cronologicamente e realizar consultas por intervalo.

Quando necessário, o identificador único do evento será utilizado após o timestamp para evitar colisões.

---

# Índices secundários

Alguns padrões de acesso não são atendidos naturalmente pela chave primária da tabela.

Por isso, índices secundários poderão ser utilizados quando houver uma necessidade real de consulta por outro atributo.

---

## GSI para consulta por LongURL

Um dos padrões analisados é:

### Dado

- LongURL

### Preciso encontrar

- ShortURL associada

Como uma mesma LongURL poderá possuir múltiplas ShortURLs, um GSI pode ser utilizado para localizar todas as ShortURLs associadas a uma determinada LongURL.

Estrutura conceitual:

```text
GSI

Partition Key → LongURL
Sort Key      → CreatedAt
```

Exemplo:

```text
LongURL                         | CreatedAt
--------------------------------|-------------------
https://exemplo.com/produto/1   | 2026-08-10 10:00
https://exemplo.com/produto/1   | 2026-08-11 14:20
https://exemplo.com/produto/1   | 2026-08-12 09:15
```

Isso permite que uma mesma LongURL esteja associada a diferentes ShortURLs.

A necessidade e estrutura definitiva desse GSI ainda serão validadas durante a implementação.

---

## GSI para consulta de URLs por período

Outro padrão identificado é:

### Dado

- Período

### Preciso encontrar

- URLs criadas dentro desse período
- quantidade de URLs criadas

A Partition Key principal é a ShortURL, portanto cada URL pertence a uma partição lógica diferente.

Isso dificulta uma consulta baseada diretamente em `CreatedAt`.

Por isso, foi considerada a utilização de um GSI.

Estrutura conceitual:

```text
GSI

Partition Key → GSI1PK
Sort Key      → CreatedAt
```

O `GSI1PK` poderá utilizar um valor de agrupamento comum para os itens que precisam participar dessa consulta.

Exemplo conceitual:

```text
GSI1PK | CreatedAt
-------|-------------------
URL    | 2026-08-12 10:00
URL    | 2026-08-12 10:15
URL    | 2026-08-12 11:30
URL    | 2026-08-12 13:00
```

Assim, seria possível consultar um intervalo de `CreatedAt`.

A estrutura definitiva desse GSI ainda será validada de acordo com os requisitos e comportamento esperado da aplicação.

---

# URLs ativas e expiradas

A URL possui um período de validade determinado por `ExpiresAt`.

Durante o acesso, a aplicação deverá verificar se a URL ainda está ativa.

Conceitualmente:

```text
momento atual < ExpiresAt
        |
        v
      ativa
        |
        v
   pode redirecionar
```

Caso:

```text
momento atual >= ExpiresAt
```

a URL será considerada expirada e o redirecionamento não deverá ser realizado.

A verificação de validade será uma responsabilidade da aplicação.

### DynamoDB TTL

O DynamoDB TTL poderá ser utilizado futuramente para realizar a limpeza automática de dados que não precisam mais ser mantidos.

Entretanto, o TTL não será utilizado como mecanismo principal para determinar se uma URL está ativa ou expirada.

A aplicação deverá utilizar `ExpiresAt` para essa decisão.

---

# Regras de negócio identificadas

## Expiração

Uma URL possui um período de validade definido por `ExpiresAt`.

Durante o acesso, a aplicação deve verificar se a URL ainda está dentro do período de validade antes de realizar o redirecionamento.

---

## Múltiplas ShortURLs para uma LongURL

Uma mesma LongURL poderá possuir múltiplas ShortURLs.

Exemplo:

```text
LongURL
   |
   +---- ShortURL A
   |
   +---- ShortURL B
   |
   +---- ShortURL C
```

Essa possibilidade é importante para permitir diferentes usos da mesma URL, como campanhas, compartilhamentos ou diferentes contextos de acesso.

---

## Planos e limite de URLs

O sistema poderá possuir planos de assinatura com diferentes limites de criação de ShortURLs.

Exemplo inicial:

```text
Plano gratuito
→ máximo de 5 ShortURLs

Plano pago
→ quantidade de URLs definida pelo plano
```

Essa regra será implementada posteriormente.

A regra de assinatura não faz parte da modelagem principal da URL neste momento.

---

# Decisões atuais

Até o momento, as principais decisões são:

- Utilizar DynamoDB para praticar modelagem NoSQL orientada a padrões de acesso.
- Utilizar inicialmente uma única tabela.
- Utilizar Single Table Design.
- Utilizar ShortURL como Partition Key da tabela principal.
- Utilizar Sort Key para diferenciar os tipos de itens relacionados à mesma URL.
- Utilizar prefixos como `URL#` e `CLICK#`.
- Armazenar eventos de clique individualmente.
- Utilizar data e hora como parte da identificação e ordenação dos eventos.
- Considerar UUID/GUID para garantir unicidade entre eventos com o mesmo timestamp.
- Utilizar Base62 para geração da ShortURL.
- Permitir múltiplas ShortURLs para uma mesma LongURL.
- Utilizar `CreatedAt` para registrar o momento de criação da URL.
- Utilizar `ExpiresAt` para determinar a validade da URL.
- A aplicação será responsável por verificar se uma URL está ativa antes do redirecionamento.
- Utilizar GSIs somente quando um padrão de acesso exigir outro caminho de consulta.
- Considerar um GSI utilizando LongURL como Partition Key e CreatedAt como Sort Key.
- Considerar um GSI utilizando GSI1PK como agrupador e CreatedAt como Sort Key para consultas de URLs por período.

---

# Pontos ainda em investigação

- Estratégia definitiva para garantir unicidade dos eventos de clique.
- Precisão do timestamp utilizada nos eventos.
- Estrutura definitiva da Sort Key dos eventos.
- Estrutura definitiva do GSI baseado em LongURL.
- Estrutura definitiva do GSI para consulta de URLs por período.
- Necessidade de consultar URLs ativas diretamente por período.
- Estratégia de limpeza de URLs expiradas.
- Utilização futura do DynamoDB TTL.
- Estrutura de dados relacionada aos usuários e planos de assinatura.
- Como o limite de ShortURLs será contabilizado por usuário/plano.
- Regras para reutilização ou não de uma ShortURL após sua expiração.

---

# Resumo conceitual

A modelagem atual pode ser resumida da seguinte maneira:

```text
                         TABELA PRINCIPAL
                              |
                              v
                    PK = ShortURL
                    SK = Tipo + Valor
                              |
                +-------------+-------------+
                |                           |
                v                           v
          URL#<CreatedAt>          CLICK#<Timestamp>#<ID>
                |                           |
                v                           v
       LongURL / CreatedAt /       Evento individual
       ExpiresAt                  de clique
                |
                |
                v
         Verificação de validade
                |
                v
         Redirecionamento
                |
                v
             LongURL
```

Os principais caminhos de acesso são:

```text
ShortURL
   ↓
encontrar URL
```

```text
ShortURL
   ↓
encontrar eventos de clique
```

```text
ShortURL + período
   ↓
encontrar cliques dentro do período
```

```text
LongURL
   ↓
GSI
   ↓
encontrar ShortURLs associadas
```

```text
Período de criação
   ↓
GSI
   ↓
encontrar URLs criadas no período
```

A modelagem continuará sendo refinada conforme novos requisitos e padrões de acesso forem identificados.
