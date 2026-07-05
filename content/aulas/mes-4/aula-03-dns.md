---
id: "m4-a3"
mes: 4
numero: 3
titulo: "DNS"
objetivo: "Entender como nomes de domínio são traduzidos para endereços IP."
duracao: 20
status: "completo"
---

## Humanos preferem nomes, computadores preferem números

Na aula passada vimos que todo computador na internet tem um endereço IP, algo como
`142.250.218.14`. Mas você nunca digita esse número para acessar o Google — você digita
`google.com`. Alguma coisa precisa traduzir esse nome legível para o número que os roteadores
realmente usam para encaminhar pacotes. Esse "alguém" é o **DNS** (*Domain Name System*), um dos
serviços mais importantes — e mais invisíveis — de toda a internet.

Pense no DNS como a **agenda de contatos** do seu celular: você não decora o número de telefone de
cada pessoa, você salva o nome, e o celular busca o número correspondente quando você liga. O DNS
faz exatamente isso para a internet inteira: você lembra do nome (`google.com`), e o DNS busca o
número (o endereço IP) por trás das cortinas.

## Uma hierarquia de responsabilidade

Diferente de uma agenda de contatos pessoal, o DNS precisa responder por **centenas de milhões** de
domínios diferentes, geridos por donos diferentes ao redor do mundo. Nenhum servidor único guarda
essa lista inteira — em vez disso, o DNS é organizado como uma **hierarquia**, lida da direita para a
esquerda em um domínio como `www.codepath.com`:

```text
                    "." (raiz)
                     |
              servidores raiz
                     |
            .com  (TLD — domínio de topo)
                     |
         codepath.com  (servidor autoritativo)
                     |
       www.codepath.com  (registro específico)
```

- **Servidores raiz**: o ponto de partida de qualquer consulta, sabem apenas para onde apontar
  conforme o **TLD** (*top-level domain*) do domínio pedido (`.com`, `.org`, `.br`, etc).
- **Servidores de TLD**: sabem, para cada domínio registrado sob aquele TLD (todos os `.com`, por
  exemplo), qual servidor é o responsável final por aquele domínio específico.
- **Servidores autoritativos**: o "dono da informação" — sabem o endereço IP real associado a
  `codepath.com` e seus subdomínios, porque é o próprio dono do site quem configura esses registros.

Essa hierarquia distribui o trabalho: nenhum servidor único precisa conhecer todos os domínios do
mundo, apenas sua fatia de responsabilidade — o mesmo princípio de dividir um problema grande em
partes menores que você já viu em árvores e em busca binária, lá no mês 3.

## O caminho de uma consulta DNS

Quando você digita `www.codepath.com` no navegador, o processo (simplificado) é:

1. O computador pergunta a um **servidor DNS recursivo** (geralmente fornecido pelo seu provedor de
   internet, ou um público como `8.8.8.8` do Google): "qual o IP de `www.codepath.com`?"
2. Se esse servidor já souber a resposta de uma consulta recente (ver **cache** abaixo), ele responde
   na hora. Caso contrário, ele mesmo faz o trabalho de perguntar pela hierarquia:
   - Pergunta a um servidor **raiz**, que responde: "não sei o IP, mas pergunte a um servidor de
     `.com`".
   - Pergunta a um servidor de **TLD `.com`**, que responde: "não sei o IP, mas o responsável por
     `codepath.com` é este outro servidor".
   - Pergunta ao servidor **autoritativo** de `codepath.com`, que finalmente responde: "o IP de
     `www.codepath.com` é `93.184.216.34`".
3. O servidor recursivo devolve esse IP para o seu computador, que agora pode abrir uma conexão TCP
   diretamente com esse endereço (retomando a aula passada).

## Cache e TTL: evitando repetir o trabalho todo

Repetir essa cadeia inteira de consultas para *cada* requisição seria extremamente lento. Por isso,
cada resposta DNS vem acompanhada de um **TTL** (*Time To Live*) — um número em segundos que diz por
quanto tempo aquela resposta pode ser **guardada em cache** e reutilizada sem precisar consultar a
hierarquia de novo. Um TTL de `3600`, por exemplo, significa "essa resposta pode ser reaproveitada por
até uma hora".

Esse cache acontece em várias camadas: no seu navegador, no seu sistema operacional, e no servidor
DNS recursivo do seu provedor — cada um guardando uma cópia da resposta pelo tempo definido pelo TTL,
para evitar refazer o caminho inteiro pela hierarquia a cada consulta.

## Tipos de registro DNS

Um servidor autoritativo guarda diferentes tipos de **registro** para um domínio, cada um com um
propósito específico. Os mais comuns:

| Tipo | Propósito | Exemplo |
|------|-----------|---------|
| `A` | Aponta um nome para um endereço IPv4 | `codepath.com → 93.184.216.34` |
| `AAAA` | Aponta um nome para um endereço IPv6 | `codepath.com → 2606:2800:220:1::` |
| `CNAME` | Aponta um nome para **outro nome** (um apelido) | `www.codepath.com → codepath.com` |
| `MX` | Aponta para o servidor responsável por receber e-mails do domínio | `codepath.com → mail.codepath.com` |

## Consultando o DNS na prática

No terminal, o comando `dig` (ou `nslookup`, mais antigo) permite consultar registros DNS
diretamente, sem passar pelo navegador:

```bash
dig codepath.com A
```

Uma resposta simplificada seria algo como:

```text
;; ANSWER SECTION:
codepath.com.    3600    IN    A    93.184.216.34
```

Lendo essa linha: o domínio `codepath.com` tem um registro do tipo `A` (endereço IPv4), com TTL de
`3600` segundos, apontando para o IP `93.184.216.34`.

## Exercício 1: Complete a hierarquia

Ao consultar `blog.exemplo.com.br`, em que ordem os seguintes servidores são consultados (assumindo
que nada está em cache): servidor raiz, servidor de TLD `.com.br`, servidor autoritativo de
`exemplo.com.br`?

### Solução

A ordem é: **1) servidor raiz** (que aponta para onde ficam os servidores de `.com.br`), **2)
servidor de TLD `.com.br`** (que aponta para o servidor autoritativo de `exemplo.com.br`), **3)
servidor autoritativo de `exemplo.com.br`** (que finalmente responde com o IP de
`blog.exemplo.com.br`). A consulta sempre desce a hierarquia da direita para a esquerda no nome de
domínio: primeiro a raiz, depois o TLD, depois o domínio específico.

## Exercício 2: TTL e cache

Um registro DNS tem TTL de `300` segundos (5 minutos). Você consulta esse domínio às 10:00 e recebe
uma resposta que fica em cache no seu computador. Às 10:03 você acessa o mesmo site de novo; às 10:10
você acessa outra vez. Em qual dessas duas visitas seu computador precisa refazer a consulta DNS
completa pela hierarquia, e por quê?

### Solução

Às **10:03**, o computador **reutiliza a resposta em cache**, porque apenas 3 minutos se passaram
desde a consulta às 10:00, e o TTL permite reaproveitar a resposta por até 5 minutos. Às **10:10**, já
se passaram 10 minutos desde a consulta original — mais do que o TTL de 5 minutos — então o cache
expirou, e o computador precisa refazer a consulta DNS completa (potencialmente passando pela
hierarquia inteira de novo, a menos que algum servidor intermediário ainda tenha uma cópia válida em
seu próprio cache).

## Exercício 3: Escolha o tipo de registro

Uma empresa quer que `www.exemplo.com` seja apenas um "apelido" que sempre aponta para o mesmo lugar
que `exemplo.com` (sem precisar duplicar e manter dois endereços IP sincronizados manualmente). Qual
tipo de registro DNS é mais adequado para isso, e por quê?

### Solução

Um registro **`CNAME`** é o mais adequado. Diferente de um registro `A` (que aponta diretamente para
um endereço IP fixo), um `CNAME` aponta `www.exemplo.com` para o **nome** `exemplo.com`, e não para um
IP específico. Isso significa que, se o IP de `exemplo.com` mudar no futuro (o registro `A` dele é
atualizado), `www.exemplo.com` automaticamente "segue" essa mudança, sem precisar de nenhuma
atualização adicional — exatamente o comportamento de apelido que a empresa quer.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "DNS" do meu curso de programação. Contexto: a aula explica a hierarquia do DNS
> (raiz, TLD, autoritativo), o processo de resolução de um nome de domínio, TTL/cache, e os tipos de
> registro A, AAAA, CNAME e MX. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. Qual é a principal função do DNS?

- [ ] Criptografar dados trafegando pela internet
- [x] Traduzir nomes de domínio legíveis por humanos para endereços IP
- [ ] Estabelecer conexões TCP entre computadores
- [ ] Rotear pacotes entre redes diferentes

> O DNS funciona como uma agenda de contatos da internet, traduzindo nomes como `google.com` para o
> endereço IP correspondente, que é o que os roteadores realmente usam.

### 2. Por que o DNS é organizado como uma hierarquia (raiz, TLD, autoritativo), em vez de um único servidor gigante?

- [ ] Porque um único servidor seria mais rápido, mas menos seguro
- [x] Porque distribui a responsabilidade de conhecer centenas de milhões de domínios entre vários servidores especializados
- [ ] Porque é uma exigência legal em todos os países
- [ ] Porque assim nenhum domínio precisa de um endereço IP

> A hierarquia divide o problema: servidores raiz sabem apenas apontar para os TLDs certos, servidores
> de TLD sabem apontar para o autoritativo certo, e o autoritativo é quem realmente conhece o IP —
> nenhum servidor precisa saber tudo sozinho.

### 3. O que significa o TTL de um registro DNS?

- [ ] O tempo máximo que uma conexão TCP pode durar
- [x] Por quanto tempo uma resposta DNS pode ser guardada em cache e reaproveitada
- [ ] A velocidade máxima de transmissão de dados
- [ ] O número de servidores autoritativos de um domínio

> TTL (Time To Live) define, em segundos, por quanto tempo uma resposta pode ficar em cache antes de
> ser necessário consultar novamente a hierarquia DNS.

### 4. Qual tipo de registro DNS aponta um nome de domínio diretamente para um endereço IPv4?

- [x] A
- [ ] CNAME
- [ ] MX
- [ ] TTL

> O registro `A` mapeia um nome de domínio diretamente para um endereço IPv4. `CNAME` aponta para
> outro nome, `MX` aponta para o servidor de e-mail, e TTL não é um tipo de registro, mas um atributo
> de tempo de cache.

### 5. O que um registro CNAME faz de diferente de um registro A?

- [ ] CNAME criptografa a conexão, A não
- [x] CNAME aponta um nome para outro nome (um apelido), enquanto A aponta diretamente para um endereço IP
- [ ] CNAME só funciona para domínios `.com`
- [ ] Não há diferença prática entre os dois

> CNAME cria um "apelido": se o alvo apontado mudar de IP, o CNAME automaticamente segue essa
> mudança, sem precisar de atualização própria — diferente de A, que é um IP fixo.
