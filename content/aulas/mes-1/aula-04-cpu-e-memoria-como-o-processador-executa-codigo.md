---
id: "m1-a4"
mes: 1
numero: 4
titulo: "CPU e memória — como o processador executa código"
objetivo: "Entender as partes internas da CPU, o ciclo de busca-decodificação-execução, e como a hierarquia de memória equilibra velocidade e capacidade."
duracao: 30
status: "completo"
---

## Bilhões de portas lógicas, um propósito

Na aula passada vimos as portas lógicas: pequenos circuitos que implementam AND, OR e NOT. Um
processador moderno (CPU — *Central Processing Unit*, ou Unidade Central de Processamento) é feito
de **bilhões** dessas portas, organizadas em estruturas cada vez maiores e mais especializadas, até
formar uma máquina capaz de somar números, comparar valores e decidir o que fazer em seguida —
bilhões de vezes por segundo.

Nesta aula, vamos abrir essa caixa e ver, em linhas gerais, como isso acontece.

## As três partes principais da CPU

Uma CPU pode ser dividida (de forma simplificada) em três grandes partes:

- **ALU (Arithmetic Logic Unit / Unidade Lógica e Aritmética)**: é onde as contas de verdade
  acontecem — somar, subtrair, comparar, aplicar AND/OR/NOT. É construída diretamente a partir de
  portas lógicas combinadas.
- **Unidade de controle (Control Unit)**: é o "maestro". Ela lê as instruções do programa uma por
  uma e coordena todas as outras partes da CPU para executar aquela instrução corretamente.
- **Registradores**: são pequenos espaços de memória *dentro* da própria CPU, extremamente rápidos,
  usados para guardar os valores que estão sendo processados naquele exato instante (por exemplo, os
  dois números que estão prestes a ser somados).

Pense na CPU como uma cozinha industrial minúscula: a unidade de controle é o chef gritando ordens,
a ALU são as mãos que efetivamente cortam e misturam os ingredientes, e os registradores são a
bancada de trabalho — pequena, mas ao alcance imediato da mão, muito mais rápida de usar do que ir
até a despensa (a memória RAM) toda vez que você precisa de algo.

## O ciclo fetch-decode-execute (busca, decodificação, execução)

Todo processador, para executar qualquer programa, repete incansavelmente um ciclo de três passos:

1. **Fetch (busca)**: a CPU busca, na memória RAM, a próxima instrução do programa que precisa ser
   executada. Ela sabe qual buscar graças a um registrador especial chamado *program counter*
   (contador de programa), que guarda o endereço da próxima instrução.
2. **Decode (decodificação)**: a unidade de controle interpreta essa instrução (que é apenas um
   número binário) e descobre o que ela representa: "somar dois números", "comparar dois valores",
   "pular para outra parte do programa", etc.
3. **Execute (execução)**: a CPU efetivamente realiza a ação — por exemplo, a ALU soma os dois
   números — e o resultado é guardado em um registrador ou de volta na memória.

Depois disso, o *program counter* avança para a próxima instrução, e o ciclo recomeça. Isso
acontece **bilhões de vezes por segundo** em um processador moderno.

```text
   ┌────────┐      ┌─────────┐      ┌──────────┐
   │ FETCH  │ ───▶ │ DECODE  │ ───▶ │ EXECUTE  │ ───┐
   └────────┘      └─────────┘      └──────────┘    │
        ▲                                            │
        └────────────────────────────────────────────┘
                (repete para a próxima instrução)
```

## Clock speed: o "batimento cardíaco" da CPU

Você já deve ter visto processadores anunciados com números como "3.5 GHz". Isso é a **frequência
do clock** — imagine um metrônomo interno, batendo em um ritmo constante, e a cada batida a CPU
avança um passo no ciclo fetch-decode-execute (na prática, instruções modernas geralmente levam
vários "batimentos" para completar, mas a ideia central se mantém).

"GHz" significa **gigahertz**, ou seja, bilhões de ciclos por segundo. Um processador de 3 GHz bate
esse metrônomo **3 bilhões de vezes por segundo**. É por isso que operações que pareceriam
impossivelmente lentas se feitas por uma pessoa (somar milhões de números, por exemplo) são
instantâneas para um computador.

## A hierarquia de memória: nem tudo pode ser rápido E grande

Aqui está uma tensão fundamental em toda a computação: **memória rápida é cara e pequena. Memória
grande e barata é lenta.** Não existe (ainda) uma memória que seja ao mesmo tempo enorme, barata e
instantânea. Por isso, os computadores usam várias camadas de memória, cada uma com um equilíbrio
diferente entre velocidade e tamanho:

```text
Registradores     ← menor e mais rápida (poucos bytes, acesso quase instantâneo)
     ▲
Cache L1, L2, L3  ← pequena, muito rápida (alguns KB a poucos MB)
     ▲
RAM (memória)     ← média, rápida (GBs, mas bem mais lenta que o cache)
     ▲
Disco / SSD       ← enorme, lenta (TBs, mas centenas ou milhares de vezes mais lenta que a RAM)
```

A ideia é que a CPU sempre tenta manter os dados que está usando **naquele exato momento** o mais
próximo possível dela (registradores e cache). Dados usados com menos frequência ficam na RAM. E
dados que precisam sobreviver mesmo com o computador desligado ficam no disco.

Esse mecanismo de "tentar manter por perto o que é usado com mais frequência" se chama
**cache**, e é uma das ideias mais reaproveitadas em toda a computação — dos processadores aos
navegadores de internet.

## Um exemplo completo: somando 2 + 2

Vamos juntar tudo com um exemplo simplificado de como a CPU calcularia `2 + 2`:

1. **Fetch**: a CPU busca na RAM a instrução que diz, em binário, algo equivalente a "some os
   valores dos registradores A e B, e guarde o resultado no registrador C".
2. **Decode**: a unidade de controle reconhece essa instrução como uma operação de soma, e prepara
   a ALU para realizá-la.
3. **Execute**: a ALU (construída a partir de portas lógicas) recebe o valor `2` do registrador A e
   o valor `2` do registrador B, realiza a soma binária (`10 + 10 = 100` em binário, ou seja, `4` em
   decimal) e guarda o resultado `4` no registrador C.

Cada uma dessas etapas leva uma fração de bilionésimo de segundo. Multiplicado por bilhões de
instruções por segundo, é assim que programas complexos — de jogos a inteligência artificial —
conseguem rodar em tempo real.

## Múltiplos núcleos (cores)

Processadores modernos costumam ter vários **núcleos** (cores) — na prática, várias CPUs completas
dentro do mesmo chip, cada uma capaz de executar seu próprio ciclo fetch-decode-execute de forma
independente e simultânea. Um processador "8-core" pode, em teoria, executar 8 sequências de
instruções completamente diferentes ao mesmo tempo. Vamos voltar a esse assunto com mais
profundidade no mês 4, quando falarmos sobre processos e threads.

## Por que isso importa para programar

Entender esse ciclo explica muita coisa que você vai encontrar como programador: por que loops
muito grandes demoram mais (mais ciclos fetch-decode-execute são necessários); por que acessar dados
"em cache" é mais rápido do que acessar dados espalhados aleatoriamente na RAM; e por que a
velocidade do clock sozinha não conta a história toda sobre o quão rápido um programa vai rodar —
também importa quão bem o programa usa a memória.

## Exercício 1: Narre o ciclo fetch-decode-execute

Imagine a instrução "compare o valor do registrador A com o valor 10; se forem iguais, pule para
outra parte do programa". Narre, em suas próprias palavras, como seria o fetch, o decode e o execute
dessa instrução.

### Solução

- **Fetch**: a CPU usa o *program counter* para saber o endereço, na RAM, dessa instrução, e a
  carrega para dentro da unidade de controle.
- **Decode**: a unidade de controle interpreta o padrão binário dessa instrução e reconhece que se
  trata de uma comparação condicional (um "salto condicional"), identificando quais registradores e
  quais endereços de destino estão envolvidos.
- **Execute**: a ALU compara o valor armazenado no registrador A com o número 10. Se os valores
  forem iguais, o *program counter* é atualizado para apontar para o endereço de destino do "pulo".
  Se não forem iguais, o *program counter* simplesmente avança para a próxima instrução em sequência,
  ignorando o pulo.

## Exercício 2: Calculando ciclos por segundo

Um processador roda a 2.5 GHz. (a) Quantos ciclos de clock ele executa por segundo? (b)
Aproximadamente quanto tempo (em segundos) dura um único ciclo de clock?

### Solução

**(a)** "GHz" significa bilhões de ciclos por segundo. `2.5 GHz = 2.5 bilhões de ciclos por segundo
= 2.500.000.000 ciclos/segundo`.

**(b)** Se em 1 segundo cabem 2,5 bilhões de ciclos, cada ciclo individual dura aproximadamente
`1 ÷ 2.500.000.000 ≈ 0,0000000004 segundos`, ou seja, cerca de **0,4 nanossegundos** por ciclo. Isso
ilustra por que operações que parecem instantâneas para nós envolvem, na verdade, um número
gigantesco de ciclos individuais acontecendo em sequência.

## Exercício 3: Ordene a hierarquia de memória

Ordene os seguintes tipos de memória do **mais rápido e menor** para o **mais lento e maior**:
RAM, registradores, disco/SSD, cache (L1/L2/L3).

### Solução

Do mais rápido/menor para o mais lento/maior:

1. **Registradores** — dentro da própria CPU, poucos bytes, acesso praticamente instantâneo.
2. **Cache (L1, depois L2, depois L3)** — muito perto da CPU, poucos KB a alguns MB.
3. **RAM** — memória de trabalho principal, GBs de capacidade, mais lenta que o cache mas ainda
   rápida.
4. **Disco/SSD** — armazenamento permanente, TBs de capacidade, ordens de magnitude mais lento que a
   RAM, mas os dados sobrevivem mesmo com o computador desligado.

Essa ordem reflete exatamente a tensão que vimos na aula: quanto mais rápida a memória, menor e mais
cara ela costuma ser — por isso usamos várias camadas em conjunto, cada uma cumprindo um papel
diferente.

## Quiz

### 1. Qual é a função da ALU (Arithmetic Logic Unit) dentro da CPU?

- [ ] Armazenar permanentemente os arquivos do usuário
- [x] Realizar operações aritméticas e lógicas, como somas e comparações
- [ ] Desenhar imagens na tela
- [ ] Gerenciar a conexão com a internet

> A ALU é a parte da CPU construída a partir de portas lógicas que efetivamente realiza contas e
> comparações — é "onde a matemática acontece" dentro do processador.

### 2. Qual é a ordem correta do ciclo que a CPU repete continuamente?

- [ ] Execute, Decode, Fetch
- [x] Fetch, Decode, Execute
- [ ] Decode, Fetch, Execute
- [ ] Execute, Fetch, Decode

> A CPU primeiro busca (fetch) a instrução na memória, depois a decodifica (decode) para entender o
> que ela significa, e só então a executa (execute).

### 3. O que significa quando dizemos que um processador tem "3 GHz" de clock?

- [ ] Ele processa 3 gigabytes de dados por segundo
- [ ] Ele tem 3 núcleos (cores)
- [x] Ele realiza aproximadamente 3 bilhões de ciclos por segundo
- [ ] Ele consome 3 gigawatts de energia

> "GHz" (gigahertz) mede a frequência do clock — quantos ciclos por segundo a CPU realiza. 3 GHz
> equivale a aproximadamente 3 bilhões de ciclos por segundo.

### 4. Por que os computadores usam várias camadas de memória (registradores, cache, RAM, disco) em vez de apenas uma?

- [ ] Porque é uma tradição da indústria sem motivo técnico
- [x] Porque memória rápida costuma ser cara e pequena, e memória grande costuma ser mais barata e lenta — as camadas equilibram esses dois fatores
- [ ] Porque cada tipo de arquivo precisa de um tipo de memória diferente
- [ ] Porque o sistema operacional exige isso por motivos de segurança

> Não existe (ainda) uma memória ao mesmo tempo grande, barata e instantânea. Por isso usamos uma
> hierarquia: memórias pequenas e rápidas perto da CPU, e memórias grandes e lentas para
> armazenamento de longo prazo.

### 5. Os registradores da CPU são geralmente...

- [x] Extremamente rápidos, mas com capacidade muito pequena (poucos valores por vez)
- [ ] Extremamente grandes, capazes de guardar gigabytes de dados
- [ ] Mais lentos que a memória RAM, mas mais baratos
- [ ] Usados exclusivamente para armazenar arquivos do usuário permanentemente

> Registradores ficam dentro da própria CPU e são a memória mais rápida que existe no sistema — mas
> justamente por isso, têm capacidade extremamente limitada, guardando só os valores em uso imediato.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "CPU e memória — como o processador executa código" do meu curso de programação.
> Contexto: a aula explica o ciclo fetch-decode-execute e a hierarquia de memória (registradores,
> cache, RAM, disco). Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
