Visão geral do HTTP

Http é um protocolo que permite a obtenção de recursos.

É a base de qualquer troca de dados na web.

As requisições sempre começam pelo cliente.

Um documento completo é reconstruído através de vários sub-documentos (.HTML, .CSS, etc).

Clientes e servidores se comunicam trocando mensagens individuais.

Geralmente por meio de um browser, o cliente manda requisições (requests) e o servidor retorna respostas(responses).

Na realidade, existem muitos computadores, modens, roteadores e muito mais entre o cliente e servidor, porém, o método HTTP está no topo da camada de aplicação.

O HTTP é simples, foi projetado para ser legível ás pessoas, isso facilita o ambiente de desenvolvimento, testes e para os estudantes.

O HTTP é extensível graças aos cabeçalhos (headers), novas funcionalidades podem ser introduzidas pelo simples acordo entre cliente e servidor pela semnântica de um header.

HTTP não tem estado, mas tem sessões. Isso quer dizer que: a cada requisição é completamente nova e elas não se comunicam entre si, porém, os cookies que estão no header alimentam as requisições com o contexto daquela sessão.
Por Exemplo: Login. Você faz o login na req1, na req2 o login estará no cookie da sessão, nao na requisição.

