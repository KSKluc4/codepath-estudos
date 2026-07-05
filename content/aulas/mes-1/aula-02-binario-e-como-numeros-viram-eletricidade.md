---
id: "m1-a2"
mes: 1
numero: 2
titulo: "Binário e como números viram eletricidade"
objetivo: "Entender por que computadores usam apenas dois estados (0 e 1), e como converter números entre decimal e binário."
duracao: 30
status: "completo"
---

## Por que só dois estados?

Imagine um interruptor de luz. Ele só tem dois estados possíveis: **ligado** ou **desligado**. Não
existe "meio ligado" de forma confiável — ou a lâmpada acende, ou não acende.

Os computadores usam exatamente essa ideia. Internamente, tudo é eletricidade: há tensão alta (por
exemplo, perto de 5 volts ou 3.3 volts, dependendo do chip) ou tensão baixa (perto de 0 volts). Só
isso. Chamamos a tensão alta de **1** e a tensão baixa de **0**.

Você pode perguntar: por que não usar 10 níveis de tensão diferentes, e representar diretamente os
dígitos de 0 a 9, como fazemos no dia a dia? A resposta é **confiabilidade**. Distinguir com certeza
absoluta entre "ligado" e "desligado" é fácil e barato de fazer bilhões de vezes por segundo, com
praticamente zero erro. Distinguir entre 10 níveis sutis de tensão, no meio de interferência
elétrica, calor e ruído, seria lento e cheio de erros. Dois estados extremos (bem ligado, bem
desligado) são muito mais fáceis de proteger contra erro do que dez estados intermediários.

Esse sistema de contar usando apenas dois símbolos (0 e 1) se chama **sistema binário** — "bi" de
dois.

## Sistema decimal: o que você já conhece (mas talvez nunca tenha parado para pensar)

Você usa o sistema **decimal** (base 10) todos os dias, então talvez nunca tenha se perguntado *por
que* ele funciona do jeito que funciona. Pegue o número **523**:

```text
5 2 3
```

Cada posição representa uma potência de 10, da direita para a esquerda:

```text
   5    2    3
  10²  10¹  10⁰
  100   10    1
```

Então 523 significa: `5×100 + 2×10 + 3×1 = 500 + 20 + 3 = 523`. Isso parece óbvio porque você
aprendeu desde criança, mas é justamente essa lógica — **sistema posicional** — que vamos reaplicar
para o binário, só que trocando a base 10 pela base 2.

## Sistema binário: a mesma lógica, com base 2

No binário, cada posição representa uma potência de **2**, não de 10, e só existem dois algarismos
possíveis: 0 e 1.

```text
   1    0    1    1
  2³   2²   2¹   2⁰
   8    4    2    1
```

O número binário `1011` significa: `1×8 + 0×4 + 1×2 + 1×1 = 8 + 0 + 2 + 1 = 11` em decimal.

Repare no padrão: assim como em decimal a posição mais à direita vale `10⁰ = 1`, em binário a
posição mais à direita também vale `2⁰ = 1`. E cada posição para a esquerda dobra de valor (1, 2, 4,
8, 16, 32...), em vez de multiplicar por 10 (1, 10, 100, 1000...).

## Convertendo binário para decimal

Passo a passo para converter `1101` (binário) para decimal:

```text
posições (da direita p/ esquerda): 2⁰, 2¹, 2², 2³
valores dessas posições:             1,  2,  4,  8

dígitos de 1101 (esquerda p/ direita): 1   1   0   1
alinhando com as posições:            2³  2²  2¹  2⁰
                                        1   1   0   1

soma dos valores onde há "1": 8 + 4 + 0 + 1 = 13
```

Então `1101` em binário é `13` em decimal.

## Convertendo decimal para binário

O método mais simples é a **divisão sucessiva por 2**, guardando o resto de cada divisão:

Vamos converter 13 (decimal) para binário:

```text
13 ÷ 2 = 6   resto 1
 6 ÷ 2 = 3   resto 0
 3 ÷ 2 = 1   resto 1
 1 ÷ 2 = 0   resto 1

Lendo os restos de baixo para cima: 1101
```

Resultado: 13 em decimal é `1101` em binário — que confere com a conversão que fizemos no sentido
contrário acima!

## Bits, bytes e o que cabe em cada um

- Um **bit** é um único dígito binário: 0 ou 1. É a menor unidade de informação em um computador.
- Um **byte** é um grupo de **8 bits**. É a unidade mais comum para medir tamanho de arquivos,
  memória, etc.

Quantos valores diferentes cabem em 8 bits? Cada bit tem 2 possibilidades, e temos 8 bits, então o
total de combinações é `2⁸ = 256`. Ou seja, um byte pode representar 256 valores diferentes — por
exemplo, os números de 0 a 255.

Essa é a regra geral: **com N bits, você consegue representar `2ⁿ` valores diferentes.** Essa conta
vai reaparecer o curso inteiro (em endereços de memória, em tipos de dados, em hash tables no mês
3), então vale a pena gravar essa ideia agora.

## De binário para texto: uma prévia rápida

Se tudo no computador é 0s e 1s, como uma letra como `A` é armazenada? A resposta: por convenção,
cada caractere recebe um número. O padrão mais famoso (embora hoje um pouco antigo) se chama
**ASCII**, e nele a letra `A` maiúscula corresponde ao número decimal 65 — ou `01000001` em binário
(usando 8 bits/1 byte). A letra `a` minúscula é 97. O caractere de espaço em branco é 32.

Hoje em dia o padrão mais usado é o **Unicode** (que inclui ASCII como um subconjunto, e também
suporta emojis, acentos e caracteres de qualquer idioma do mundo), mas a ideia central é a mesma:
**todo caractere é, no fundo, apenas um número — e todo número é, no fundo, apenas binário.**

## O ciclo completo

Juntando tudo o que vimos até aqui:

```text
Texto que você digita ("A")
   │ convertido para um número (65)
   ▼
Número decimal (65)
   │ convertido para binário
   ▼
Binário (01000001)
   │ cada bit vira um nível de tensão elétrica
   ▼
Eletricidade (alto, baixo, baixo, alto, baixo, baixo, baixo, alto)
```

E no sentido inverso, é assim que a eletricidade dentro do computador "vira" as letras que você lê
na tela. Na próxima aula, vamos ver exatamente como esses 0s e 1s são combinados e comparados usando
**lógica booleana** e **portas lógicas** — o primeiro passo para a eletricidade "tomar decisões".

## Exercício 1: Convertendo decimal para binário

Converta os seguintes números decimais para binário, usando o método da divisão sucessiva por 2:
(a) 9, (b) 22, (c) 42.

### Solução

**(a) 9 em binário:**

```text
9 ÷ 2 = 4   resto 1
4 ÷ 2 = 2   resto 0
2 ÷ 2 = 1   resto 0
1 ÷ 2 = 0   resto 1

Lendo de baixo para cima: 1001
```

`9 = 1001` em binário. Conferindo: `1×8 + 0×4 + 0×2 + 1×1 = 9`. ✔

**(b) 22 em binário:**

```text
22 ÷ 2 = 11   resto 0
11 ÷ 2 = 5    resto 1
 5 ÷ 2 = 2    resto 1
 2 ÷ 2 = 1    resto 0
 1 ÷ 2 = 0    resto 1

Lendo de baixo para cima: 10110
```

`22 = 10110` em binário. Conferindo: `1×16 + 0×8 + 1×4 + 1×2 + 0×1 = 16 + 4 + 2 = 22`. ✔

**(c) 42 em binário:**

```text
42 ÷ 2 = 21   resto 0
21 ÷ 2 = 10   resto 1
10 ÷ 2 = 5    resto 0
 5 ÷ 2 = 2    resto 1
 2 ÷ 2 = 1    resto 0
 1 ÷ 2 = 0    resto 1

Lendo de baixo para cima: 101010
```

`42 = 101010` em binário. Conferindo: `1×32 + 0×16 + 1×8 + 0×4 + 1×2 + 0×1 = 32 + 8 + 2 = 42`. ✔

## Exercício 2: Convertendo binário para decimal

Converta os seguintes binários para decimal: (a) `1010`, (b) `11001`, (c) `100000`.

### Solução

**(a) `1010`:** posições (da esquerda) valem 8, 4, 2, 1. Os dígitos são 1, 0, 1, 0.
`1×8 + 0×4 + 1×2 + 0×1 = 8 + 2 = 10`.

**(b) `11001`:** posições valem 16, 8, 4, 2, 1. Os dígitos são 1, 1, 0, 0, 1.
`1×16 + 1×8 + 0×4 + 0×2 + 1×1 = 16 + 8 + 1 = 25`.

**(c) `100000`:** posições valem 32, 16, 8, 4, 2, 1. Só o primeiro dígito é 1, os demais são 0.
`1×32 = 32`. Repare que `100000` é simplesmente `2⁵`, um padrão que vale a pena reconhecer: um `1`
seguido de N zeros em binário sempre representa `2ᴺ`.

## Exercício 3: Quantos valores cabem?

Responda: (a) quantos valores diferentes é possível representar com 4 bits? (b) e com 8 bits? (c)
se um sistema usa 3 bits para representar cores básicas (cada bit liga ou desliga uma cor primária:
vermelho, verde, azul), quantas cores distintas esse sistema consegue representar no total?

### Solução

**(a)** Com 4 bits, temos `2⁴ = 16` valores possíveis (de 0000 até 1111, ou seja, de 0 a 15 em
decimal).

**(b)** Com 8 bits, temos `2⁸ = 256` valores possíveis (de 0 a 255 em decimal) — o mesmo número que
vimos na aula para um byte.

**(c)** Com 3 bits (um para cada cor primária: vermelho, verde, azul, ligado ou desligado), temos
`2³ = 8` combinações possíveis: nenhuma cor (preto), só vermelho, só verde, só azul, vermelho+verde
(amarelo), vermelho+azul (magenta), verde+azul (ciano), e as três juntas (branco). Esse é
exatamente o princípio por trás de sistemas de cor simples, embora sistemas reais usem muito mais
bits por cor (normalmente 8 bits por canal, dando 256 tons de cada cor primária).

## Quiz

### 1. Por que os computadores usam o sistema binário (base 2) em vez de decimal (base 10)?

- [ ] Porque binário é mais fácil para humanos lerem
- [x] Porque é muito mais fácil e confiável distinguir apenas dois níveis de tensão elétrica (ligado/desligado)
- [ ] Porque o sistema decimal não pode ser representado eletricamente
- [ ] Porque os primeiros computadores só conseguiam contar até 2

> Distinguir com certeza entre "ligado" (tensão alta) e "desligado" (tensão baixa) é muito mais
> simples e resistente a erros do que tentar distinguir dez níveis diferentes de tensão em meio a
> ruído elétrico.

### 2. Quanto vale o número binário `1010` em decimal?

- [ ] 5
- [x] 10
- [ ] 12
- [ ] 20

> `1010` = `1×8 + 0×4 + 1×2 + 0×1 = 8 + 2 = 10`.

### 3. Quantos valores diferentes podem ser representados com 8 bits (1 byte)?

- [ ] 8
- [ ] 128
- [x] 256
- [ ] 512

> Com N bits, o total de combinações possíveis é `2ⁿ`. Com 8 bits, `2⁸ = 256`.

### 4. No sistema posicional binário, qual é o valor da posição mais à esquerda no número `1000`?

- [ ] 2⁰ = 1
- [ ] 2¹ = 2
- [ ] 2² = 4
- [x] 2³ = 8

> Em `1000`, contando as posições da direita (2⁰) para a esquerda, o dígito mais à esquerda está na
> quarta posição, que vale `2³ = 8`. Como só esse dígito é 1, o valor total é 8.

### 5. O que a letra "A" representa, no fundo, dentro de um computador?

- [ ] Um símbolo especial que não pode ser convertido em número
- [x] Um número (65, no padrão ASCII), que por sua vez é representado em binário
- [ ] Uma imagem armazenada em formato de foto
- [ ] Um comando executado diretamente pela CPU

> Todo caractere é armazenado, no fundo, como um número (por exemplo, "A" é 65 no ASCII), e esse
> número é representado em binário, que por sua vez é representado por níveis de tensão elétrica.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Binário e como números viram eletricidade" do meu curso de programação. Contexto:
> a aula explica o sistema posicional em base 2 e como converter números entre decimal e binário.
> Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
