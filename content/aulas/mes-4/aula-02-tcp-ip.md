---
id: "m4-a2"
mes: 4
numero: 2
titulo: "TCP/IP"
objetivo: "Entender como endereços IP identificam computadores e como o TCP garante entrega confiável de dados."
duracao: 30
status: "completo"
---

## Dois problemas, dois protocolos

Na aula passada vimos que a internet transporta dados em pacotes, roteados de computador em
computador até o destino. Mas isso levanta duas perguntas bem diferentes:

1. Como identificar **qual computador**, entre bilhões conectados à internet, é o destino de um
   pacote?
2. Como garantir que uma mensagem grande, cortada em muitos pacotes que podem chegar fora de ordem ou
   se perder pelo caminho, seja **remontada corretamente** do outro lado?

A primeira pergunta é resolvida pelo **IP** (*Internet Protocol*). A segunda é resolvida pelo **TCP**
(*Transmission Control Protocol*). Juntos, formam a dupla que dá nome à pilha de protocolos mais
usada da internet: **TCP/IP**.

## IP: o endereço postal da internet

Todo dispositivo conectado à internet recebe um **endereço IP** — uma sequência de números que o
identifica de forma única na rede, assim como um endereço postal identifica uma casa. A versão mais
comum, **IPv4**, é escrita como quatro números de 0 a 255 separados por pontos, como `192.168.1.10` ou
`93.184.216.34`. Cada um desses quatro números ocupa 1 byte (8 bits) — por isso o intervalo vai de
0 a 255 (`2⁸ = 256` valores possíveis), totalizando 32 bits por endereço.

O IP resolve o **roteamento**: cada pacote carrega o IP de destino, e cada roteador no caminho usa
esse número para decidir por qual próxima rota encaminhar o pacote, até ele chegar ao destino final.
O IP, no entanto, **não garante nada** além disso — ele é um protocolo "best effort" (melhor esforço):
um pacote pode se perder, chegar corrompido, ou chegar fora de ordem, e o IP sozinho não faz nada a
respeito. É exatamente esse buraco que o TCP preenche.

> **Nota sobre IPv6**: como o número de dispositivos conectados à internet cresceu muito além do que
> os ~4,3 bilhões de endereços possíveis em IPv4 comportam, existe também o **IPv6**, com endereços
> de 128 bits (escritos em grupos hexadecimais, como `2001:0db8:85a3::8a2e:0370:7334`), oferecendo uma
> quantidade de endereços astronomicamente maior. Para os fins deste curso, o raciocínio sobre
> endereçamento e roteamento é o mesmo — vamos usar IPv4 nos exemplos por ser mais simples de ler.

## Portas: várias conversas no mesmo endereço

Um único computador roda muitos programas ao mesmo tempo, cada um potencialmente se comunicando pela
rede — o navegador, o cliente de e-mail, um jogo online. O IP identifica o computador, mas não diz
*qual programa* deve receber cada pacote. Esse é o papel da **porta**: um número de 0 a 65535 que
identifica, dentro de um mesmo computador, qual aplicação deve receber aquela conversa.

Um endereço completo, portanto, é o par **IP + porta**, geralmente escrito como `192.168.1.10:443`.
Algumas portas têm convenções bem estabelecidas:

| Porta | Uso convencional |
|-------|--------------------|
| 80 | HTTP (web, sem criptografia) |
| 443 | HTTPS (web, com criptografia) |
| 22 | SSH (acesso remoto seguro) |
| 25 | SMTP (envio de e-mail) |
| 53 | DNS |

Voltando à analogia do correio: se o IP é o endereço do prédio, a porta é o número do apartamento —
o carteiro (roteador) entrega a carta no prédio certo, mas é o número do apartamento que garante que
ela chegue à pessoa certa lá dentro.

## TCP: entrega garantida

O TCP existe para transformar a entrega "melhor esforço" do IP em uma entrega **confiável**. Ele
garante três coisas que o IP sozinho não garante:

- **Nenhum pacote se perde**: se um pacote não chegar, o TCP detecta e pede a retransmissão.
- **Ordem correta**: cada pacote TCP carrega um número de sequência; o receptor usa esses números
  para remontar a mensagem na ordem original, mesmo que os pacotes cheguem fora de ordem.
- **Sem duplicatas nem corrupção**: pacotes duplicados são descartados, e uma soma de verificação
  (*checksum*) detecta dados corrompidos no caminho.

### O aperto de mãos em três vias (three-way handshake)

Antes de trocar qualquer dado, dois computadores que vão se comunicar por TCP precisam estabelecer
uma conexão através de uma pequena "negociação" de três passos:

1. **SYN**: o cliente envia um pacote pedindo para sincronizar ("quero abrir uma conexão").
2. **SYN-ACK**: o servidor responde confirmando e também pedindo sua própria sincronização ("recebi,
   também quero conversar").
3. **ACK**: o cliente confirma de volta ("combinado, vamos começar").

```text
Cliente                     Servidor
   |------ SYN ------------>  |
   |<----- SYN-ACK ---------  |
   |------ ACK ------------>  |
   |   (conexão estabelecida) |
```

Só depois desse "aperto de mãos" os dados de verdade começam a trafegar. É por isso que o TCP é
chamado de protocolo **orientado a conexão**: existe uma etapa explícita de estabelecer a conversa
antes da troca de dados, e outra etapa (não mostrada aqui) para encerrá-la educadamente no final.

## UDP: o primo mais rápido e menos confiável

Nem toda aplicação precisa da confiabilidade do TCP — e essa confiabilidade tem um custo: o aperto de
mãos, a confirmação de cada pacote recebido e a possível retransmissão adicionam **latência** (atraso).
Para casos onde velocidade importa mais do que garantia de entrega — como chamadas de vídeo ao vivo
ou jogos online, onde um pacote perdido de um segundo atrás já é inútil de qualquer forma — existe o
**UDP** (*User Datagram Protocol*): ele envia pacotes sem estabelecer conexão prévia e sem garantir
entrega, ordem ou ausência de duplicatas. É mais rápido, mas a aplicação é quem precisa lidar com
qualquer perda de dados, se isso importar.

| | TCP | UDP |
|---|-----|-----|
| Confiabilidade | Garante entrega, ordem, sem duplicatas | Nenhuma garantia |
| Conexão | Orientado a conexão (handshake) | Sem conexão |
| Velocidade | Mais lento (overhead de garantias) | Mais rápido |
| Uso típico | Páginas web, e-mail, transferência de arquivos | Streaming ao vivo, jogos online, DNS |

## Exercício 1: Identifique o protocolo de transporte

Para cada cenário abaixo, decida se **TCP** ou **UDP** é mais adequado, e justifique:

1. Baixar um arquivo PDF de um site
2. Uma chamada de vídeo ao vivo entre duas pessoas
3. Enviar um e-mail

### Solução

1. **TCP** — um PDF corrompido ou com pedaços faltando é inútil; a confiabilidade do TCP (nenhum
   pacote perdido, ordem garantida) é essencial aqui, e o custo extra de velocidade vale a pena.
2. **UDP** — em uma chamada ao vivo, um frame de vídeo perdido de um segundo atrás não vale a pena
   retransmitir (a conversa já seguiu adiante); prioriza-se velocidade e baixa latência sobre garantia
   de entrega perfeita.
3. **TCP** — assim como o PDF, um e-mail com conteúdo faltando ou corrompido não é aceitável; a
   confiabilidade do TCP é necessária.

## Exercício 2: Endereço completo

Um servidor web está rodando em um computador com IP `200.150.10.5`, escutando na porta padrão de
HTTPS. Escreva o endereço completo (IP + porta) que um cliente usaria para se conectar a esse
servidor, e explique o papel de cada uma das duas partes desse endereço.

### Solução

O endereço completo é `200.150.10.5:443`. O **IP** (`200.150.10.5`) identifica **qual computador**,
entre todos os conectados à internet, deve receber o pacote — o papel de roteamento, resolvido pelos
roteadores no caminho. A **porta** (`443`, convenção padrão para HTTPS) identifica **qual aplicação**,
dentro desse computador, deve processar a conexão — nesse caso, o servidor web escutando por
conexões HTTPS, e não, por exemplo, um servidor de e-mail rodando na mesma máquina.

## Exercício 3: Ordene o handshake

As três mensagens do three-way handshake do TCP estão fora de ordem abaixo. Ordene-as corretamente e
diga quem (cliente ou servidor) envia cada uma:

- ACK
- SYN
- SYN-ACK

### Solução

A ordem correta é:

1. **SYN** (enviado pelo **cliente**) — pedido inicial de sincronização, abrindo a conversa.
2. **SYN-ACK** (enviado pelo **servidor**) — confirmação do pedido do cliente, combinada com o
   próprio pedido de sincronização do servidor.
3. **ACK** (enviado pelo **cliente**) — confirmação final, e a conexão está pronta para troca de
   dados.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "TCP/IP" do meu curso de programação. Contexto: a aula explica endereços IP,
> portas, o three-way handshake do TCP, e a diferença entre TCP (confiável, orientado a conexão) e
> UDP (rápido, sem garantias). Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. O que um endereço IP identifica?

- [ ] Qual aplicação, dentro de um computador, deve receber os dados
- [x] Um computador específico, de forma única, dentro da rede
- [ ] O conteúdo criptografado de uma mensagem
- [ ] O nome de domínio de um site

> O endereço IP identifica de forma única um dispositivo conectado à rede, de forma análoga a um
> endereço postal identificando uma casa.

### 2. Qual é o papel de uma porta, além do endereço IP?

- [ ] Definir a velocidade máxima da conexão
- [x] Identificar qual aplicação, dentro de um mesmo computador, deve receber os dados
- [ ] Criptografar os dados antes de enviar
- [ ] Substituir a necessidade de um endereço IP

> A porta identifica a aplicação específica dentro do computador de destino — o IP entrega no prédio
> certo, a porta entrega no apartamento certo.

### 3. O que o TCP garante que o IP sozinho não garante?

- [ ] O endereço de destino do pacote
- [x] Entrega sem perdas, sem duplicatas e na ordem correta
- [ ] A velocidade máxima de transmissão
- [ ] A localização geográfica do servidor

> O IP apenas roteia pacotes com "melhor esforço"; é o TCP que adiciona confiabilidade — detectando
> perdas, remontando a ordem correta e descartando duplicatas.

### 4. Qual é o propósito do three-way handshake do TCP?

- [x] Estabelecer uma conexão confirmada por ambos os lados antes de trocar dados
- [ ] Criptografar o conteúdo da mensagem
- [ ] Traduzir um nome de domínio para um endereço IP
- [ ] Escolher qual porta será usada na conexão

> O handshake (SYN, SYN-ACK, ACK) garante que cliente e servidor confirmaram mutuamente que estão
> prontos para se comunicar, antes de qualquer dado real ser trocado.

### 5. Por que o UDP é mais rápido que o TCP, e quando isso é uma boa troca?

- [ ] Porque o UDP usa endereços IP menores
- [x] Porque o UDP não estabelece conexão nem garante entrega, o que reduz overhead — bom para casos como streaming ao vivo, onde velocidade importa mais que garantia total de entrega
- [ ] Porque o UDP só funciona em redes locais
- [ ] Não há diferença real de velocidade entre TCP e UDP

> Sem o custo do handshake e das confirmações/retransmissões do TCP, o UDP entrega pacotes mais
> rapidamente — uma boa troca quando dados um pouco desatualizados ou perdidos não comprometem a
> aplicação, como em chamadas de vídeo ao vivo.
