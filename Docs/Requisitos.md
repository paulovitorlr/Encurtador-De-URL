Requisitos do Encurtador 

Requisitos Funcionais:

Geração de link curto: Criar um identificador único, curto e alfanumérico a partir de uma URL longa informada.

Redirecionamento: Levar o usuário instantaneamente para o endereço web original ao acessar a URL encurtada.

Aliases personalizados: Permitir que o usuário escolha um texto customizado para compor o final do link.

Expiração de links: Definir prazos de validade opcionais ou padrão para que o link deixe de funcionar após certo tempo.

Métrica de cliques: Rastrear a quantidade de acessos recebidos por cada link.

Requisitos não funcionais:

Alta disponibilidade: Manter o serviço ativo ininterruptamente, pois qualquer falha impede o acesso aos links redirecionados.

Baixa latência: Garantir que o redirecionamento ocorra em tempo real, sem atrasos perceptíveis para o usuário.

Segurança e opacidade: Evitar que os identificadores curtos sejam totalmente sequenciais ou fáceis de adivinhar por robôs (prevenindo enumeração de dados).

Escalabilidade: Suportar alto volume de requisições simultâneas de leitura ( cliques) e escrita (geração de novos links)