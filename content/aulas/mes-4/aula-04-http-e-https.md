---
id: "m4-a4"
mes: 4
numero: 4
titulo: "HTTP e HTTPS"
objetivo: "Entender o protocolo que move a web: requisições, respostas, métodos e status codes."
duracao: 30
status: "completo"
---

## A linguagem da web

Nas últimas aulas, vimos como um pacote encontra o caminho até um IP (TCP/IP) e como um nome de
domínio vira esse IP (DNS). Depois que a conexão TCP está estabelecida entre o navegador e o
servidor, falta a última peça: **o que, exatamente, eles dizem um ao outro**? Essa "conversa" segue
um protocolo chamado **HTTP** (*HyperText Transfer Protocol*) — a linguagem comum que navegadores e
servidores usam para trocar páginas, imagens, dados de formulários e praticamente tudo o que existe
na web.

## Requisição e resposta

O HTTP segue um modelo simples de **pergunta e resposta**: o cliente (navegador, app, ou outro
programa) envia uma **requisição**, e o servidor devolve uma **resposta**. Nada acontece sem uma
requisição primeiro — o servidor nunca "liga" espontaneamente para o cliente.

Uma requisição HTTP tem três partes principais:

```text
GET /produtos/123 HTTP/1.1          <- linha de requisição: método + caminho + versão
Host: loja.exemplo.com               <- cabeçalhos (headers)
User-Agent: Mozilla/5.0...
Accept: text/html

(corpo, opcional — usado em POST/PUT)
```

E a resposta correspondente:

```text
HTTP/1.1 200 OK                      <- linha de status: versão + código + mensagem
Content-Type: text/html              <- cabeçalhos (headers)
Content-Length: 1256

<html>...</html>                     <- corpo: o conteúdo pedido
```

## Métodos HTTP: o "verbo" da requisição

O **método** diz qual ação o cliente quer realizar sobre um recurso (identificado pelo caminho, como
`/produtos/123`):

| Método | Propósito | Analogia |
|--------|-----------|----------|
| `GET` | Buscar/ler um recurso, sem modificá-lo | Ler uma página de um livro |
| `POST` | Criar um novo recurso, enviando dados no corpo | Preencher e enviar um formulário novo |
| `PUT` | Atualizar um recurso existente por completo | Substituir uma página inteira do livro |
| `DELETE` | Remover um recurso | Arrancar uma página do livro |

Uma distinção importante: `GET` é considerado **seguro** (não deveria alterar nada no servidor) — é
por isso que atualizar a página de um carrinho de compras não deveria, sozinho, duplicar um pedido; já
`POST` explicitamente representa uma ação que muda o estado do servidor, como criar um novo pedido.

## Status codes: o "resultado" da resposta

Todo resposta HTTP carrega um **código de status** de três dígitos, indicando o resultado da
requisição. Os códigos são agrupados por faixa:

| Faixa | Categoria | Exemplos |
|-------|-----------|----------|
| `2xx` | Sucesso | `200 OK`, `201 Created`, `204 No Content` |
| `3xx` | Redirecionamento | `301 Moved Permanently`, `304 Not Modified` |
| `4xx` | Erro do cliente | `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| `5xx` | Erro do servidor | `500 Internal Server Error`, `503 Service Unavailable` |

Uma boa forma de memorizar a lógica das faixas: **4xx é "você (cliente) fez algo errado"** (pediu um
recurso que não existe, não se autenticou), enquanto **5xx é "o servidor quebrou tentando processar
seu pedido válido"** (um bug, uma sobrecarga). Essa distinção importa na prática: um erro `404` não
adianta tentar de novo sem mudar o pedido (o recurso simplesmente não existe), enquanto um `503`
frequentemente vale a pena tentar novamente depois de um tempo (o servidor pode estar temporariamente
sobrecarregado).

## HTTP é sem estado — e como cookies contornam isso

O HTTP é, por definição, **stateless** (sem estado): cada requisição é processada de forma totalmente
independente das anteriores — o servidor não "lembra" nativamente que a requisição de agora veio do
mesmo cliente da requisição de um minuto atrás. Isso é surpreendente à primeira vista: como, então,
sites conseguem manter você "logado" enquanto navega por várias páginas?

A resposta são os **cookies**: um pequeno pedaço de dado que o servidor pede para o navegador guardar
(através de um cabeçalho `Set-Cookie` na resposta) e reenviar automaticamente em **toda** requisição
futura para aquele mesmo domínio (através do cabeçalho `Cookie` na requisição). É assim que o
servidor consegue reconhecer "esse pedido veio do mesmo usuário que fez login há 5 minutos", mesmo o
HTTP em si não guardando memória nenhuma entre requisições.

## HTTPS: a mesma conversa, mas lacrada

O `S` de **HTTPS** significa *Secure*. Tecnicamente, é o mesmo protocolo HTTP, só que rodando **por
cima** de uma camada de criptografia chamada **TLS** (*Transport Layer Security*). Sem essa camada,
uma requisição HTTP comum trafega em **texto puro** pela rede — qualquer um no meio do caminho (um
roteador comprometido, alguém na mesma rede Wi-Fi pública) pode ler exatamente o que está sendo
enviado, incluindo senhas digitadas em um formulário.

O TLS resolve isso adicionando, antes da troca de dados HTTP, uma negociação (*handshake* de TLS,
distinto do handshake do TCP visto na aula 2) em que cliente e servidor:

1. Concordam em um método de criptografia a usar.
2. O servidor apresenta um **certificado digital**, emitido por uma autoridade certificadora
   confiável, provando "eu realmente sou `loja.exemplo.com`, e não um impostor".
3. Ambos os lados derivam uma chave de criptografia compartilhada, usada para embaralhar todo o
   tráfego HTTP que vier a seguir.

A partir daí, tudo que trafega — a requisição, os cabeçalhos, o corpo — está **criptografado**:
mesmo que alguém intercepte os pacotes no meio do caminho, só verá dados embaralhados, sem conseguir
ler o conteúdo real nem se passar pelo servidor legítimo sem o certificado correto.

## Exercício 1: Escolha o método certo

Para cada ação abaixo, escolha o método HTTP mais apropriado (`GET`, `POST`, `PUT` ou `DELETE`):

1. Carregar a página de perfil de um usuário
2. Enviar um novo comentário em um post de blog
3. Remover uma foto da sua galeria

### Solução

1. **GET** — apenas ler/buscar dados existentes, sem modificar nada no servidor.
2. **POST** — criar um novo recurso (o comentário), enviando os dados no corpo da requisição.
3. **DELETE** — remover um recurso existente (a foto).

## Exercício 2: Interprete o status code

Um cliente faz uma requisição `GET /usuarios/999` e recebe de volta `404 Not Found`. Depois, o mesmo
cliente faz uma requisição `POST /usuarios` com dados inválidos no corpo e recebe `400 Bad Request`.
Explique, em cada caso, de quem é a "responsabilidade" do erro (cliente ou servidor) e por quê.

### Solução

Em ambos os casos, o erro é do **cliente** — ambos os códigos estão na faixa `4xx`. No primeiro caso,
`404` significa que o recurso pedido (usuário com ID `999`) simplesmente **não existe**; o cliente
pediu algo que não está lá. No segundo caso, `400` significa que a requisição em si estava **malformada
ou com dados inválidos** — o servidor entendeu o pedido, mas os dados enviados não atendiam ao que era
esperado. Em nenhum dos dois casos o problema é uma falha interna do servidor (que seria `5xx`); em
ambos, o cliente precisa corrigir o próprio pedido antes de tentar de novo.

## Exercício 3: Por que HTTPS importa em uma rede Wi-Fi pública

Explique, em termos do que o TLS faz, por que é arriscado enviar sua senha em um site que usa apenas
`http://` (sem o `s`) enquanto conectado a uma rede Wi-Fi pública, e por que `https://` resolve esse
problema.

### Solução

Sem TLS, uma requisição HTTP trafega em **texto puro** pela rede. Em uma rede Wi-Fi pública, outros
dispositivos conectados à mesma rede (ou um roteador comprometido) podem **interceptar e ler** os
pacotes que estão passando — incluindo o valor exato de um campo de senha enviado em um formulário,
sem nenhum esforço extra de decodificação. Com `https://`, o TLS criptografa todo o conteúdo da
requisição antes de ela sair do dispositivo, incluindo a senha; mesmo que alguém intercepte os
pacotes na mesma rede, tudo que veria seria dados embaralhados e ilegíveis sem a chave de
criptografia negociada exclusivamente entre o seu navegador e o servidor legítimo.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "HTTP e HTTPS" do meu curso de programação. Contexto: a aula explica a estrutura de
> requisição/resposta HTTP, métodos (GET, POST, PUT, DELETE), status codes (2xx a 5xx), cookies para
> manter estado, e como o TLS adiciona criptografia no HTTPS. Minha dúvida/meu exercício: [descreva
> aqui exatamente onde travou].

## Quiz

### 1. O que caracteriza o modelo de comunicação do HTTP?

- [ ] O servidor envia dados espontaneamente, sem que o cliente peça
- [x] O cliente envia uma requisição, e o servidor responde — nada acontece sem uma requisição primeiro
- [ ] Cliente e servidor trocam mensagens simultaneamente, sem ordem definida
- [ ] Apenas servidores podem iniciar uma conexão HTTP

> HTTP segue um modelo de requisição-resposta: o cliente sempre inicia pedindo algo, e o servidor
> responde a esse pedido específico.

### 2. Qual método HTTP é mais apropriado para criar um novo recurso, enviando dados no corpo da requisição?

- [ ] GET
- [x] POST
- [ ] DELETE
- [ ] Nenhum método HTTP permite enviar dados no corpo

> POST é o método convencional para criar um novo recurso, enviando os dados necessários no corpo da
> requisição — diferente de GET, que apenas busca dados existentes.

### 3. Um status code `500 Internal Server Error` indica um problema de responsabilidade de quem?

- [ ] Do cliente, que enviou dados inválidos
- [x] Do servidor, que falhou ao processar um pedido válido
- [ ] Do DNS, que não conseguiu resolver o domínio
- [ ] Da rede Wi-Fi do usuário

> Códigos na faixa 5xx indicam que o servidor encontrou um erro interno ao tentar processar uma
> requisição — diferente da faixa 4xx, que indica um problema no pedido do cliente.

### 4. Como o HTTP, sendo "stateless", consegue manter um usuário "logado" entre páginas diferentes de um site?

- [ ] Isso não é possível com HTTP puro
- [x] Através de cookies, enviados pelo servidor e reenviados automaticamente pelo navegador em requisições futuras
- [ ] O servidor memoriza o IP do cliente permanentemente
- [ ] Apenas HTTPS permite manter sessões de login

> Como o HTTP não guarda estado nativamente entre requisições, cookies são usados para que o
> navegador reenvie, em cada nova requisição, um identificador que o servidor usa para reconhecer a
> sessão do usuário.

### 5. O que o TLS adiciona ao HTTP para formar o HTTPS?

- [ ] Um novo conjunto de métodos HTTP, como PATCH e OPTIONS
- [ ] Compressão de dados para acelerar o carregamento
- [x] Criptografia do tráfego e verificação da identidade do servidor via certificado digital
- [ ] Cache automático de todas as respostas

> O TLS negocia uma chave de criptografia compartilhada e verifica a identidade do servidor através
> de um certificado digital, garantindo que o tráfego HTTP não possa ser lido nem forjado por
> terceiros no meio do caminho.
