---
id: "m4-a1"
mes: 4
numero: 1
titulo: "Como a internet funciona (visão geral)"
objetivo: "Ter uma visão panorâmica de como dados viajam entre computadores pelo mundo."
duracao: 25
status: "completo"
---

## Bem-vindo ao mês 4

Nos últimos três meses você entendeu a máquina por dentro (binário, CPU, memória), programou em C
mexendo diretamente com ponteiros e memória, e aprendeu as estruturas de dados e algoritmos que todo
programador usa para resolver problemas com eficiência. Tudo isso, até agora, aconteceu dentro de
**um único computador**. Este mês vamos sair de dentro da máquina e entender como computadores
**conversam entre si** — o que acontece, literalmente, entre o momento em que você digita um endereço
no navegador e a página aparecer na tela.

## O correio mundial

A analogia mais útil para entender a internet é o **sistema de correios**. Quando você envia uma
carta, ela precisa de um endereço de destino, passa por diversos centros de triagem no caminho, e
pode ser dividida em múltiplas entregas se for muito grande. A internet funciona de um jeito
parecido:

- Todo computador conectado à internet tem um **endereço** (o **IP**, que veremos na próxima aula),
  assim como toda casa tem um endereço postal.
- As informações não viajam inteiras de uma vez: elas são cortadas em pedaços menores chamados
  **pacotes**, cada um com o endereço de origem e destino, como envelopes separados de uma
  correspondência grande.
- Esses pacotes passam por diversos **roteadores** no caminho — equipamentos cuja única função é
  olhar o endereço de destino de cada pacote e decidir para qual direção encaminhá-lo, exatamente como
  um centro de triagem dos correios decide para qual cidade despachar cada carta.
- Pacotes da mesma mensagem podem, inclusive, seguir **caminhos diferentes** até o destino, e são
  remontados na ordem correta apenas quando chegam lá — algo que nunca aconteceria com cartas físicas,
  mas é rotina na internet.

Esse modelo de dividir mensagens em pacotes independentes, que trafegam pela rede e podem seguir
rotas diferentes, se chama **comutação de pacotes** (*packet switching*) — é o princípio fundamental
que torna a internet possível, permitindo que milhões de conexões compartilhem a mesma infraestrutura
física de cabos e roteadores ao mesmo tempo, sem que ninguém precise de uma linha dedicada exclusiva.

## O modelo de camadas

Fazer todo esse sistema funcionar exige resolver vários problemas diferentes: como identificar
computadores, como garantir que os pacotes cheguem completos e na ordem certa, como as aplicações
conversam de fato. Ao invés de resolver tudo isso em um bloco só, os engenheiros de rede organizaram o
problema em **camadas**, cada uma responsável por uma parte específica, e que conversa apenas com a
camada logo acima e logo abaixo dela. Este mês vamos estudar uma versão simplificada dessa pilha,
de baixo para cima:

| Camada | Responsabilidade | O que veremos |
|--------|-------------------|----------------|
| Aplicação | Formato da conversa entre programas (navegador ↔ servidor) | HTTP/HTTPS (aula 4) |
| Transporte | Entrega confiável, em ordem, na porta certa | TCP (aula 2) |
| Rede | Endereçamento e roteamento entre redes diferentes | IP (aula 2) |
| Enlace/Física | Transmissão de bits pelo cabo, fibra ou Wi-Fi | Fora do escopo deste curso |

Além disso, veremos o **DNS** (aula 3), que não é bem uma camada, mas um serviço que resolve nomes
como `codepath.com` para o endereço IP correspondente — porque humanos preferem lembrar de nomes, e
computadores precisam de números.

A ideia-chave desse modelo é o **isolamento de responsabilidades**: a camada de transporte (TCP) não
precisa saber se está entregando um e-mail, uma página web ou uma mensagem de chat — ela só garante
que os bytes chegam completos e na ordem certa. A camada de aplicação (HTTP), por sua vez, não precisa
saber como os pacotes são roteados fisicamente pela internet — ela só usa o TCP como uma entrega
confiável já pronta. Essa separação é o mesmo princípio de **abstração** que você já viu em outros
contextos deste curso: cada camada expõe uma interface simples e esconde a complexidade de como
resolve seu próprio problema por baixo dos panos.

## A jornada de uma requisição

Vamos acompanhar, em alto nível, o que acontece quando você digita `https://exemplo.com` no navegador
e aperta Enter — cada passo será aprofundado nas próximas aulas:

1. **DNS (aula 3)**: o navegador precisa descobrir qual endereço IP corresponde ao nome
   `exemplo.com`. Ele pergunta a um servidor DNS, que devolve algo como `93.184.216.34`.
2. **TCP (aula 2)**: o navegador estabelece uma conexão confiável com esse IP, através de um processo
   chamado *three-way handshake*, garantindo que ambos os lados estão prontos para trocar dados.
3. **TLS (aula 4)**: como o endereço começa com `https`, uma camada extra de criptografia é
   negociada, para que ninguém no meio do caminho consiga ler o conteúdo da conversa.
4. **HTTP (aula 4)**: o navegador envia uma requisição HTTP (`GET /`) pedindo o conteúdo da página. O
   servidor processa o pedido e devolve uma resposta HTTP com o HTML da página.
5. **Renderização**: o navegador recebe o HTML e começa a desenhar a página na tela, disparando novas
   requisições para imagens, estilos e scripts referenciados nela.

Tudo isso — desde digitar o endereço até a página aparecer — normalmente acontece em **menos de um
segundo**, envolvendo múltiplos servidores, possivelmente em diferentes continentes.

## Exercício 1: Identifique a camada

Para cada responsabilidade abaixo, identifique a qual camada da pilha simplificada ela pertence
(Aplicação, Transporte ou Rede):

1. Decidir qual formato de mensagem o navegador usa para pedir uma página (`GET /pagina`)
2. Decidir para qual roteador encaminhar um pacote com destino a um IP na Ásia
3. Garantir que todos os pacotes de um vídeo cheguem completos e na ordem certa

### Solução

1. **Aplicação** — o formato da mensagem trocada entre navegador e servidor (o "verbo" `GET`, o
   caminho `/pagina`) é definido pelo protocolo HTTP, que vive na camada de aplicação.
2. **Rede** — decidir o caminho que um pacote percorre até um endereço IP distante é exatamente o
   papel do roteamento, na camada de rede (IP).
3. **Transporte** — garantir entrega completa e em ordem é a responsabilidade central do TCP, na
   camada de transporte, independente do que está sendo transportado (vídeo, texto, imagem).

## Exercício 2: Comutação de pacotes vs. uma ligação telefônica tradicional

Uma ligação telefônica tradicional (não digital) usa **comutação de circuitos**: uma linha física
dedicada é reservada entre os dois telefones durante toda a chamada, mesmo nos momentos de silêncio.
Compare esse modelo com a comutação de pacotes usada na internet, explicando **uma vantagem** e **uma
desvantagem** da comutação de pacotes em relação à de circuitos.

### Solução

**Vantagem**: a comutação de pacotes permite que a mesma infraestrutura física (cabos, roteadores)
seja **compartilhada** por milhões de conexões simultâneas, porque nenhuma conexão reserva uma linha
inteira só para si — os pacotes de conexões diferentes se intercalam pelos mesmos cabos. Isso torna o
uso da rede muito mais eficiente do que reservar um circuito dedicado por chamada, especialmente
considerando que boa parte do tempo de uma comunicação (silêncio em uma ligação, tempo de leitura
entre requisições) não usaria a linha de qualquer forma.

**Desvantagem**: como não há um caminho dedicado e reservado, não há garantia de que os pacotes vão
chegar em um tempo previsível — eles competem com pacotes de outras conexões nos mesmos roteadores, o
que pode causar atrasos (**latência**) e até perda de pacotes em momentos de congestionamento. Uma
linha de circuito dedicada, uma vez estabelecida, garante uma taxa de transmissão constante durante
toda a chamada.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Como a internet funciona (visão geral)" do meu curso de programação. Contexto: a
> aula explica comutação de pacotes, o modelo de camadas simplificado (aplicação, transporte, rede) e
> a jornada de uma requisição HTTP (DNS, TCP, TLS, HTTP). Minha dúvida/meu exercício: [descreva aqui
> exatamente onde travou].

## Quiz

### 1. O que é um "pacote", no contexto de redes de computadores?

- [ ] Um cabo físico que conecta dois computadores
- [x] Um pedaço menor de uma mensagem, com endereço de origem e destino, que trafega independentemente pela rede
- [ ] Um tipo de vírus de computador
- [ ] O nome de um roteador

> Mensagens grandes são divididas em pacotes menores, cada um contendo os endereços de origem e
> destino, para trafegar pela rede de forma independente e eficiente.

### 2. Qual é a principal vantagem da comutação de pacotes sobre a comutação de circuitos?

- [ ] Ela garante que os pacotes nunca se percam
- [x] Ela permite que a mesma infraestrutura seja compartilhada por muitas conexões ao mesmo tempo, sem reservar uma linha dedicada
- [ ] Ela elimina completamente a necessidade de roteadores
- [ ] Ela só funciona em redes muito pequenas

> Como nenhuma conexão reserva uma linha física inteira para si, muitas conexões podem compartilhar
> os mesmos cabos e roteadores simultaneamente, tornando o uso da infraestrutura mais eficiente.

### 3. Qual é a função de um roteador?

- [ ] Traduzir nomes de domínio para endereços IP
- [ ] Criptografar o conteúdo de uma mensagem
- [x] Examinar o endereço de destino de um pacote e decidir para qual direção encaminhá-lo
- [ ] Renderizar páginas HTML no navegador

> Um roteador funciona como um centro de triagem: recebe pacotes, olha o endereço de destino, e
> decide para qual próximo salto encaminhá-los até chegarem ao destino final.

### 4. No modelo de camadas simplificado desta aula, qual camada é responsável por garantir que os pacotes cheguem completos e na ordem correta?

- [ ] Aplicação
- [x] Transporte
- [ ] Rede
- [ ] Nenhuma — isso não é garantido em nenhuma camada

> A camada de transporte (protocolo TCP) é responsável por garantir entrega confiável, completa e em
> ordem, independente do tipo de conteúdo sendo transportado.

### 5. Por que o modelo de camadas é útil no design de redes de computadores?

- [ ] Porque deixa a internet mais lenta, mas mais segura
- [ ] Porque elimina a necessidade de endereços IP
- [x] Porque isola responsabilidades, permitindo que cada camada resolva seu próprio problema sem precisar entender os detalhes das outras
- [ ] Porque é exigido por lei em todos os países

> Cada camada expõe uma interface simples para a camada vizinha e esconde sua complexidade interna —
> o mesmo princípio de abstração usado no design de software, aplicado ao design de redes.
