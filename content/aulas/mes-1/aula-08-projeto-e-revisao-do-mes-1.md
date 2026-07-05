---
id: "m1-a8"
mes: 1
numero: 8
titulo: "Projeto e revisão do Mês 1"
objetivo: "Consolidar os conceitos de binário, lógica, CPU e sistema operacional com um projeto prático de revisão."
duracao: 30
status: "completo"
---

## Chegou a hora de juntar tudo

Em sete aulas, você percorreu a jornada completa de um computador: de elétrons ligando e desligando,
até um sistema operacional inteiro coordenando dezenas de programas ao mesmo tempo. Esta aula tem
dois objetivos: (1) um **projeto prático guiado**, que usa binário, lógica booleana e terminal juntos
em uma única tarefa, e (2) uma **revisão completa** de tudo o que vimos, fechando o mês com um mapa
mental do computador inteiro, do elétron ao software.

## O projeto: construindo um "somador binário" de papel

Um dos trabalhos mais fundamentais que uma CPU faz, bilhões de vezes por segundo, é **somar
números binários** dentro da ALU (Aula 4). Esses circuitos de soma são construídos inteiramente a
partir de portas lógicas (Aula 3). Neste projeto, você vai construir — no papel, com tabelas-verdade
— o circuito mais simples que soma dois bits, e depois documentar seu projeto usando o terminal
(Aula 6).

Antes de começar, precisamos de uma porta lógica nova, que não vimos na Aula 3: a porta **XOR**
("ou exclusivo"). Ela é parecida com o OR, mas com uma diferença importante: o resultado é 1 quando
**exatamente uma** das entradas é 1 — se as duas forem iguais (`0,0` ou `1,1`), o resultado é 0.

```text
0 XOR 0 = 0
0 XOR 1 = 1
1 XOR 0 = 1
1 XOR 1 = 0
```

A porta XOR é essencial para somar bits, porque ela captura exatamente a regra da soma binária de um
único dígito: `0+0=0`, `0+1=1`, `1+0=1`, mas `1+1=10` (ou seja, dá "estouro" — o resultado do dígito
é 0, mas gera um **carry**, um "vai um" para a próxima posição, exatamente como quando você soma
`5+7=12` em decimal e "vai 1" para a casa da dezena).

### Passo 1: o meio-somador (half adder)

Um **meio-somador** é o circuito que soma dois bits únicos, A e B, produzindo dois resultados: a
**soma** (`S`) e o **carry** (`C`, o "vai um"). Ele é construído com exatamente duas portas lógicas:

```text
S = A XOR B      (o dígito do resultado)
C = A AND B      (o "vai um", só acontece quando os dois bits são 1)
```

```text
A ──┬── XOR ── S (soma)
    │
    └── AND ── C (carry / "vai um")
B ──┴──────────┘
```

## Exercício 1: Complete a tabela-verdade do meio-somador

Complete a tabela-verdade do meio-somador para as 4 combinações possíveis de A e B, calculando S
(A XOR B) e C (A AND B) para cada uma.

### Solução

| A | B | S (A XOR B) | C (A AND B) |
|---|---|-------------|-------------|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

Repare na última linha: `1 + 1` produz soma `0` com carry `1` — exatamente `10` em binário (que é
`2` em decimal), confirmando que o circuito soma corretamente `1 + 1 = 2`.

## Exercício 2: Somando dois números de 2 bits

Usando o meio-somador do Passo 1 para o bit menos significativo, e considerando que o carry gerado
precisaria ser somado junto com o próximo par de bits (isso, na prática, exige um circuito um pouco
mais completo chamado *full adder*, que aceita três entradas: A, B e o carry vindo da posição
anterior), calcule manualmente, em binário, o resultado de `11 + 01` (dois números de 2 bits),
mostrando o carry gerado em cada posição.

### Solução

Vamos somar bit a bit, da direita para a esquerda, como você faria manualmente em decimal:

```text
    1 1   (11 em binário = 3 em decimal)
+   0 1   (01 em binário = 1 em decimal)
-------
```

**Posição menos significativa (direita):** `1 + 1 = 0`, carry `1` (exatamente a última linha da
tabela-verdade do Exercício 1).

**Próxima posição:** `1 + 0 = 1`, mais o carry `1` vindo da posição anterior: `1 + 0 + 1 = 10`, ou
seja, soma `0` com um novo carry `1`.

**Carry final:** como não há mais posições, esse último carry `1` se torna um novo dígito à
esquerda do resultado.

```text
    1 1
+   0 1
-------
  1 0 0
```

Resultado: `100` em binário, que é `4` em decimal — conferindo com a soma esperada: `3 + 1 = 4`. Esse
é exatamente o tipo de operação, bit a bit com propagação de carry, que a ALU de qualquer processador
realiza — só que em uma escala de 32 ou 64 bits de cada vez, e bilhões de vezes por segundo.

## Exercício 3: Documentando o projeto no terminal

Usando os comandos de Bash da Aula 6, escreva a sequência de comandos para: (a) criar uma pasta
chamada `projeto-somador`; (b) entrar nela; (c) criar um arquivo `tabela-verdade.txt`; (d) escrever
dentro dele a linha `0 XOR 0 = 0` (usando redirecionamento, sem abrir um editor de texto); (e)
conferir o conteúdo do arquivo.

### Solução

```bash
mkdir projeto-somador
cd projeto-somador
touch tabela-verdade.txt
echo "0 XOR 0 = 0" > tabela-verdade.txt
cat tabela-verdade.txt
```

Cada comando corresponde exatamente a um passo: `mkdir` cria a pasta, `cd` entra nela usando um
caminho relativo, `touch` cria o arquivo vazio, `echo "..." > arquivo` escreve o texto dentro do
arquivo (sobrescrevendo qualquer conteúdo anterior), e `cat` mostra o conteúdo gravado, confirmando
que tudo funcionou como esperado.

## Resumo do Mês 1 — a máquina, de cima a baixo

Antes do quiz de revisão, aqui está um mapa mental de tudo o que vimos neste mês, do nível mais alto
(você) ao mais baixo (elétrons):

- **Aula 1 — O que é um computador**: hardware (físico) vs. software (instruções); camadas de
  abstração conectando você, aplicativos, sistema operacional, CPU e transistores.
- **Aula 2 — Binário**: computadores representam tudo em base 2 (0s e 1s) porque é muito mais
  confiável distinguir dois níveis de tensão elétrica do que dez. Bits, bytes, `2ⁿ` valores possíveis
  com N bits.
- **Aula 3 — Lógica booleana e portas lógicas**: AND, OR e NOT (e, nesta aula, XOR) são operadores
  que combinam valores verdadeiro/falso; portas lógicas são circuitos físicos, feitos de
  transistores, que implementam esses operadores com eletricidade.
- **Aula 4 — CPU e memória**: a CPU tem ALU (contas), unidade de controle (coordenação) e
  registradores (memória ultra-rápida); ela repete o ciclo fetch-decode-execute bilhões de vezes por
  segundo (medido em GHz); existe uma hierarquia de memória equilibrando velocidade e capacidade.
- **Aula 5 — RAM vs. disco**: RAM é rápida mas volátil (depende de energia constante); disco é lento
  mas permanente; memória virtual usa o disco como "extensão" da RAM quando ela está cheia.
- **Aula 6 — Terminal e Bash**: uma forma alternativa (e poderosa) de operar o computador via texto,
  usando comandos como `pwd`, `ls`, `cd`, `mkdir` e `rm`, e a diferença entre caminhos absolutos e
  relativos.
- **Aula 7 — Sistema operacional**: o "maestro" que gerencia hardware e programas; kernel
  (privilegiado) vs. espaço do usuário (comum); chamadas de sistema como ponte entre os dois; o
  escalonador permite multitarefa dividindo o tempo da CPU em fatias.

A partir do mês 2, vamos sair do "como o computador funciona por dentro" e começar a **escrever
código de verdade**, em C — a linguagem perfeita para colocar tudo o que aprendemos aqui em prática,
já que ela expõe diretamente conceitos como memória, ponteiros e endereços.

## Tirou dúvida?

Se travar em algum ponto deste projeto ou da revisão, descreva o contexto exato do que você já
entendeu e onde travou. Copie e adapte o modelo abaixo:

> Estou estudando "Projeto e revisão do Mês 1" do meu curso de programação. Contexto: o projeto
> constrói um somador binário com portas lógicas (incluindo XOR) e usa o terminal para documentar o
> processo, revisando binário, lógica booleana, CPU/memória e sistema operacional. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. Qual é o resultado de `1 XOR 1`?

- [x] 0
- [ ] 1
- [ ] Indefinido
- [ ] 2

> A porta XOR resulta em 1 apenas quando as entradas são diferentes. Como as duas entradas são
> iguais (1 e 1), o resultado é 0.

### 2. No meio-somador (half adder), qual porta lógica calcula o carry ("vai um")?

- [ ] OR
- [ ] XOR
- [x] AND
- [ ] NOT

> O carry só deve ser 1 quando ambos os bits somados são 1 (situação em que `1+1` "estoura" para a
> próxima posição) — exatamente a tabela-verdade da porta AND.

### 3. Quantos valores diferentes podem ser representados com 5 bits?

- [ ] 10
- [ ] 16
- [x] 32
- [ ] 64

> Com N bits, o total de combinações possíveis é `2ⁿ`. Com 5 bits, `2⁵ = 32`.

### 4. Qual é a ordem correta do ciclo que a CPU repete continuamente para executar instruções?

- [x] Fetch, Decode, Execute
- [ ] Decode, Execute, Fetch
- [ ] Execute, Fetch, Decode
- [ ] Decode, Fetch, Execute

> A CPU primeiro busca a instrução na memória (fetch), depois a interpreta (decode), e só então a
> executa (execute).

### 5. Por que a RAM é chamada de memória volátil?

- [ ] Porque ela é fisicamente instável e pode quebrar facilmente
- [x] Porque ela perde todo o seu conteúdo quando a energia elétrica é interrompida
- [ ] Porque seu tamanho muda a cada reinicialização
- [ ] Porque só funciona com determinados sistemas operacionais

> A RAM guarda dados em capacitores que perdem carga rapidamente sem um processo constante de
> recarga (refresh), que só ocorre com energia elétrica contínua.

### 6. Qual comando de terminal mostra o conteúdo de um arquivo de texto?

- [ ] ls
- [ ] pwd
- [x] cat
- [ ] mkdir

> `cat` (concatenate) exibe o conteúdo de um arquivo diretamente no terminal.

### 7. Em Bash, o caminho `../projetos` é um exemplo de:

- [ ] Caminho absoluto
- [x] Caminho relativo
- [ ] Caminho inválido
- [ ] Comando, não caminho

> Caminhos que não começam com `/` são relativos à pasta atual. `..` representa a pasta um nível
> acima da atual.

### 8. Qual é a principal diferença entre kernel e espaço do usuário?

- [ ] O kernel é mais lento, pois faz mais verificações de segurança
- [x] O kernel tem acesso direto e privilegiado ao hardware; o espaço do usuário precisa pedir permissão via chamadas de sistema
- [ ] Aplicativos comuns sempre rodam dentro do kernel
- [ ] Essa distinção só existe em sistemas operacionais antigos

> O kernel é a camada privilegiada com acesso direto ao hardware. Programas no espaço do usuário
> precisam fazer chamadas de sistema para pedir ao kernel que realize ações envolvendo hardware.

### 9. O que permite que vários programas pareçam rodar "ao mesmo tempo" mesmo com poucos núcleos de CPU?

- [ ] Cada programa usa uma CPU virtual independente e ilimitada
- [x] Um escalonador do sistema operacional alterna rapidamente o tempo de CPU entre os programas
- [ ] Os programas se comunicam diretamente entre si sem envolver o sistema operacional
- [ ] Isso só é possível em processadores acima de 5 GHz

> O escalonador (scheduler) do kernel divide o tempo da CPU em fatias pequenas e alterna entre os
> programas rapidamente, criando a sensação de execução simultânea.

### 10. Qual das opções abaixo resume corretamente a jornada de um clique, do início ao fim, vista neste mês?

- [ ] Tela → CPU → usuário → disco
- [ ] Software → hardware → usuário
- [x] Usuário → sistema operacional → CPU (executando instruções binárias via portas lógicas) → hardware de saída (tela, som, etc.)
- [ ] Disco → RAM → usuário, sem envolvimento do sistema operacional

> Essa é a cadeia completa vista desde a Aula 1: o usuário interage, o sistema operacional traduz e
> coordena, a CPU executa instruções binárias (usando circuitos de portas lógicas), e o resultado é
> enviado a algum dispositivo de saída.
