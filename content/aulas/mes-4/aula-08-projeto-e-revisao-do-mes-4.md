---
id: "m4-a8"
mes: 4
numero: 8
titulo: "Projeto e revisão do Mês 4"
objetivo: "Consolidar redes e sistemas com um projeto prático de diagnóstico de rede."
duracao: 30
status: "completo"
---

## Da teoria à prática: um diagnóstico de rede

Este mês cobriu como computadores se comunicam pela rede (internet, TCP/IP, DNS, HTTP/HTTPS) e como
o sistema operacional gerencia o que roda dentro de uma máquina (processos, threads, Linux). Neste
projeto guiado (em Python, usando a biblioteca `socket` da linguagem), vamos construir uma pequena
**ferramenta de diagnóstico de rede** que combina três verificações do mês: resolver um nome de
domínio via **DNS**, testar se uma **porta TCP** está aberta em um servidor, e fazer uma requisição
**HTTP** manual usando sockets — os três primeiros passos que qualquer navegador executa por trás dos
panos, só que aqui feitos explicitamente, um de cada vez.

## Passo 1: resolver o domínio (DNS)

Retomando a aula 3, antes de conectar a qualquer coisa, precisamos traduzir o nome de domínio para um
endereço IP. Em Python, a função `socket.gethostbyname()` faz exatamente essa consulta DNS.

## Exercício 1: Implemente a resolução DNS

Escreva uma função `resolver_dominio(dominio)` que recebe um nome de domínio (como `"exemplo.com"`) e
devolve o endereço IP correspondente, ou a mensagem `"Não foi possível resolver"` se a consulta
falhar.

### Solução

```python
import socket

def resolver_dominio(dominio):
    try:
        return socket.gethostbyname(dominio)
    except socket.gaierror:
        return "Não foi possível resolver"
```

Por trás dessa única chamada de função, o sistema operacional está fazendo exatamente o processo
descrito na aula 3: consultando um servidor DNS recursivo, que por sua vez pode percorrer a hierarquia
de servidores raiz, TLD e autoritativo até encontrar o registro `A` correspondente — ou usar uma
resposta já guardada em cache, se o TTL ainda for válido.

## Passo 2: testar se uma porta está aberta (TCP)

Retomando a aula 2, sabendo o IP, o próximo passo é verificar se o servidor está de fato aceitando
conexões TCP em uma porta específica — por exemplo, a porta `443` (HTTPS). Isso é feito tentando
completar o three-way handshake e medindo se ele é bem-sucedido dentro de um tempo limite.

## Exercício 2: Implemente o teste de porta

Escreva uma função `porta_aberta(ip, porta, timeout=3)` que tenta abrir uma conexão TCP com o
`ip`/`porta` indicados, devolvendo `True` se a conexão for bem-sucedida (porta aberta) e `False` caso
contrário (porta fechada ou tempo esgotado).

### Solução

```python
import socket

def porta_aberta(ip, porta, timeout=3):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(timeout)
        resultado = s.connect_ex((ip, porta))
        return resultado == 0
```

`connect_ex` tenta o three-way handshake da aula 2 e devolve `0` se a conexão foi estabelecida com
sucesso (SYN, SYN-ACK, ACK completos), ou um código de erro diferente de `0` caso contrário — seja
porque o servidor recusou ativamente a conexão naquela porta, seja porque o tempo limite (`timeout`)
se esgotou sem resposta. Note que `socket.SOCK_STREAM` indica explicitamente que queremos um socket
**TCP** (orientado a conexão), e não `SOCK_DGRAM` (UDP, sem conexão) — a mesma distinção vista na
aula 2.

## Passo 3: requisição HTTP manual

Retomando a aula 4, uma vez que a conexão TCP está aberta, podemos montar e enviar uma requisição
HTTP manualmente, como texto puro, exatamente no formato que vimos naquela aula.

## Exercício 3: Implemente uma requisição HTTP manual

Escreva uma função `requisicao_http_simples(dominio)` que abre uma conexão TCP na porta `80` do
domínio informado, envia uma requisição `GET /` manualmente formatada, e devolve a primeira linha da
resposta (a linha de status, como `HTTP/1.1 200 OK`).

### Solução

```python
import socket

def requisicao_http_simples(dominio):
    ip = resolver_dominio(dominio)
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(5)
        s.connect((ip, 80))
        requisicao = (
            f"GET / HTTP/1.1\r\n"
            f"Host: {dominio}\r\n"
            f"Connection: close\r\n"
            f"\r\n"
        )
        s.sendall(requisicao.encode())
        resposta = s.recv(4096).decode(errors="ignore")
        return resposta.split("\r\n")[0]
```

Repare que estamos montando, byte a byte, exatamente a estrutura de requisição vista na aula 4: a
linha de requisição (`GET / HTTP/1.1`) seguida dos cabeçalhos (`Host`, `Connection`) e uma linha em
branco (`\r\n\r\n`) marcando o fim dos cabeçalhos — o mesmo formato que o navegador monta
automaticamente, mas aqui feito à mão. O cabeçalho `Host` é obrigatório no HTTP/1.1 porque um mesmo
IP pode hospedar vários domínios diferentes; sem ele, o servidor não saberia qual site você está
pedindo. A resposta chega no mesmo formato: uma linha de status seguida de cabeçalhos e o corpo — aqui
extraímos só a primeira linha para confirmar que a requisição funcionou.

## Resumo do Mês 4 — como a internet e o sistema operacional funcionam

Antes do quiz de revisão, um mapa mental de todo o mês:

- **Aula 1 — Como a internet funciona**: dados trafegam em pacotes (comutação de pacotes), roteados
  por um modelo de camadas (aplicação, transporte, rede) onde cada camada resolve seu próprio
  problema, isolada das demais.
- **Aula 2 — TCP/IP**: o IP identifica computadores e permite roteamento; portas identificam qual
  aplicação recebe os dados; o TCP garante entrega confiável, em ordem, via three-way handshake; UDP
  troca essa confiabilidade por velocidade.
- **Aula 3 — DNS**: traduz nomes de domínio para endereços IP através de uma hierarquia (raiz, TLD,
  autoritativo); TTL controla por quanto tempo uma resposta pode ficar em cache; registros A, CNAME e
  MX servem propósitos diferentes.
- **Aula 4 — HTTP e HTTPS**: requisição/resposta com métodos (GET, POST, PUT, DELETE) e status codes
  (2xx sucesso, 4xx erro do cliente, 5xx erro do servidor); cookies contornam o fato de o HTTP não ter
  estado; TLS adiciona criptografia e verificação de identidade, formando o HTTPS.
- **Aula 5 — Processos**: um processo é um programa em execução, com memória isolada e PCB próprio;
  estados incluem pronto, executando e esperando; `fork()`/`exec()` criam e transformam processos em
  sistemas Unix/Linux.
- **Aula 6 — Threads e concorrência**: threads compartilham a memória do processo, ao contrário de
  processos isolados entre si; concorrência não exige paralelismo real; condições de corrida surgem
  de acesso não sincronizado a dados compartilhados; mutex protege seções críticas.
- **Aula 7 — Linux na prática**: sistema de arquivos em árvore única; permissões `rwx` para
  dono/grupo/outros via `chmod`; `ps`/`top`/`kill` gerenciam processos; pipes e redirecionamento
  compõem comandos pequenos em soluções maiores.

A partir do mês 5, vamos sair da infraestrutura de baixo nível e entrar nas práticas que separam
código de estudante de código profissional: versionamento avançado, testes automatizados, arquitetura
de software e segurança.

## Tirou dúvida?

Se travar em algum ponto deste projeto ou da revisão, descreva o contexto exato do que você já
entendeu e onde travou. Copie e adapte o modelo abaixo:

> Estou estudando "Projeto e revisão do Mês 4" do meu curso de programação. Contexto: o projeto
> constrói uma ferramenta de diagnóstico de rede em Python (resolução DNS, teste de porta TCP,
> requisição HTTP manual via sockets), revisando TCP/IP, DNS, HTTP/HTTPS, processos, threads e Linux
> do mês inteiro. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. O que caracteriza a comutação de pacotes usada na internet?

- [ ] Uma linha física dedicada é reservada durante toda a comunicação
- [x] Mensagens são divididas em pacotes menores, roteados independentemente, permitindo que a infraestrutura seja compartilhada por muitas conexões
- [ ] Cada computador só pode se comunicar com um outro computador por vez
- [ ] Não existem roteadores envolvidos no processo

> A comutação de pacotes divide mensagens em pacotes independentes que compartilham a mesma
> infraestrutura de rede com outras conexões, ao contrário da comutação de circuitos, que reserva uma
> linha dedicada.

### 2. O que o TCP garante que o IP sozinho não garante?

- [ ] O endereço de destino do pacote
- [x] Entrega confiável: sem perdas, sem duplicatas, na ordem correta
- [ ] A tradução de nomes de domínio para IPs
- [ ] A criptografia do conteúdo transmitido

> O IP roteia pacotes com "melhor esforço", sem garantias; o TCP adiciona confiabilidade através do
> three-way handshake, números de sequência e retransmissão.

### 3. Qual é o papel de uma porta, além do endereço IP?

- [x] Identificar qual aplicação, dentro do computador de destino, deve receber os dados
- [ ] Substituir a necessidade de um servidor DNS
- [ ] Criptografar o conteúdo da mensagem
- [ ] Determinar a velocidade máxima da conexão

> O IP identifica o computador; a porta identifica a aplicação específica dentro dele que deve
> processar a conexão.

### 4. Por que o DNS é organizado como uma hierarquia (raiz, TLD, autoritativo)?

- [ ] Para tornar as consultas mais lentas de propósito
- [x] Para distribuir a responsabilidade de conhecer centenas de milhões de domínios entre servidores especializados
- [ ] Porque um único servidor não pode processar solicitações HTTP
- [ ] Isso não é verdade, o DNS usa um único servidor central

> Nenhum servidor único conhece todos os domínios do mundo; a hierarquia divide essa responsabilidade
> entre servidores raiz, de TLD, e autoritativos.

### 5. O que o TTL de um registro DNS controla?

- [ ] O tempo máximo de uma conexão TCP
- [x] Por quanto tempo uma resposta DNS pode ser reaproveitada do cache antes de expirar
- [ ] A quantidade de servidores autoritativos de um domínio
- [ ] O tamanho máximo de um pacote

> TTL define, em segundos, o tempo que uma resposta DNS pode ficar em cache antes de ser necessário
> consultar novamente a hierarquia.

### 6. Um status HTTP `404 Not Found` indica um problema de responsabilidade de quem?

- [ ] Do servidor, que está sobrecarregado
- [x] Do cliente, que pediu um recurso que não existe
- [ ] Do DNS, que falhou ao resolver o domínio
- [ ] Da camada TCP, que perdeu pacotes

> Códigos na faixa 4xx indicam um problema relacionado ao pedido do cliente — nesse caso, o recurso
> pedido simplesmente não existe no servidor.

### 7. O que o TLS adiciona ao HTTP para formar o HTTPS?

- [ ] Novos métodos HTTP, como PATCH
- [x] Criptografia do tráfego e verificação da identidade do servidor via certificado digital
- [ ] Compressão automática de imagens
- [ ] Cache permanente de todas as respostas

> O TLS negocia uma chave de criptografia compartilhada e verifica a identidade do servidor através
> de um certificado digital emitido por uma autoridade confiável.

### 8. Qual é a principal diferença entre um processo e uma thread?

- [ ] Threads não podem ser criadas em sistemas Linux
- [x] Threads do mesmo processo compartilham memória; processos diferentes têm memória isolada entre si
- [ ] Processos são sempre mais rápidos que threads
- [ ] Não existe diferença técnica real entre os dois

> Threads compartilham o espaço de memória do processo ao qual pertencem, permitindo comunicação
> direta, mas também tornando possíveis condições de corrida — diferente de processos, isolados entre
> si.

### 9. O que caracteriza uma condição de corrida (race condition)?

- [ ] Um erro de sintaxe em código concorrente
- [x] O resultado final do programa depende de uma ordem imprevisível de acesso a dados compartilhados por múltiplas threads
- [ ] Uma thread executando código incorreto sozinha, sem outras threads envolvidas
- [ ] Um processo que nunca termina de executar

> Condições de corrida surgem quando o resultado depende de uma intercalação específica e não
> determinística entre threads acessando o mesmo dado, sem sincronização adequada.

### 10. No projeto desta aula, por que a função `porta_aberta` usa `socket.SOCK_STREAM` em vez de `socket.SOCK_DGRAM`?

- [ ] Porque `SOCK_DGRAM` não existe na biblioteca `socket` do Python
- [x] Porque queremos testar uma conexão TCP (orientada a conexão), e `SOCK_STREAM` representa TCP, enquanto `SOCK_DGRAM` representa UDP
- [ ] Porque `SOCK_STREAM` é sempre mais rápido que `SOCK_DGRAM`
- [ ] Não há diferença entre as duas opções para esse caso

> `SOCK_STREAM` cria um socket TCP, que tenta o three-way handshake da aula 2 ao conectar —
> exatamente o que a função precisa testar. `SOCK_DGRAM` criaria um socket UDP, sem conexão nem
> handshake, inadequado para verificar se uma porta TCP está aberta.
