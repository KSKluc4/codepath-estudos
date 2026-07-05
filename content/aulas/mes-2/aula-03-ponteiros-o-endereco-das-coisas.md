---
id: "m2-a3"
mes: 2
numero: 3
titulo: "Ponteiros — o endereço das coisas"
duracao: 30
objetivo: "Entender o que são ponteiros, como declará-los e por que são centrais em C."
status: "completo"
---

## Toda casa tem um endereço

Na Aula 2, vimos que uma variável é uma "caixa" reservada na memória, com um tamanho definido pelo
seu tipo. O que não mencionamos ainda é que **toda caixa tem um endereço** — uma posição exata na
memória RAM, geralmente representada como um número (em hexadecimal, por convenção). É exatamente
como toda casa em uma cidade tem um endereço único: rua, número.

Um **ponteiro** é uma variável especial que, em vez de guardar um valor "normal" (um número, uma
letra), guarda o **endereço de outra variável** — ou seja, guarda "onde" outra coisa está na
memória, não o quê está lá. Pense em um pontero como um pedaço de papel com um endereço escrito nele:
o papel em si não é a casa, mas te diz exatamente onde encontrá-la.

Esse é, sem exagero, o conceito mais importante de todo o mês 2 — e um dos mais importantes de todo
este curso. Ponteiros aparecem por trás de estruturas de dados inteiras (listas ligadas, árvores,
grafos — mês 3), da forma como funções recebem parâmetros grandes sem copiá-los inteiros, e de como
o próprio sistema operacional gerencia memória (mês 1, Aula 7).

## O operador `&`: "endereço de"

O operador `&`, colocado antes do nome de uma variável, devolve o **endereço** dela na memória — não
o valor que ela guarda, mas a posição exata onde ela está guardada.

```c
#include <stdio.h>

int main() {
    int idade = 25;
    printf("Valor de idade: %d\n", idade);
    printf("Endereco de idade: %p\n", (void*)&idade);
    return 0;
}
```

O especificador `%p` em `printf` é usado especificamente para imprimir endereços de memória. Rodando
esse programa, você veria algo como:

```text
Valor de idade: 25
Endereco de idade: 0x7ffd3a2c1a9c
```

O endereço exato (`0x7ffd3a2c1a9c`) vai variar a cada execução do programa — o sistema operacional
decide dinamicamente onde colocar cada variável na memória (lembra da memória virtual por processo,
vista na Aula 7 do mês 1?). O que importa não é decorar esse número, e sim entender que **ele
existe**, e que agora temos uma forma de obtê-lo.

## Declarando um ponteiro

Para declarar uma variável que vai guardar um endereço (ou seja, um ponteiro), usamos um asterisco
`*` entre o tipo e o nome:

```c
int idade = 25;
int *ponteiro_idade = &idade;
```

Aqui, `ponteiro_idade` é uma variável do tipo "ponteiro para int" (`int *`), e ela guarda o endereço
da variável `idade`. É importante notar que o tipo do ponteiro precisa combinar com o tipo da
variável apontada — um `int *` só deveria apontar para endereços de variáveis `int`, um `float *`
para variáveis `float`, e assim por diante. Isso porque, como veremos adiante, o tipo também diz ao
compilador **quantos bytes ler** a partir daquele endereço.

## O operador `*`: "desreferência" (ir até lá e pegar o valor)

O mesmo símbolo `*` tem um segundo uso: quando aplicado a um ponteiro já existente (não na
declaração), ele significa **desreferenciar** — "vá até o endereço guardado neste ponteiro, e me dê
o valor que está lá".

```c
#include <stdio.h>

int main() {
    int idade = 25;
    int *ponteiro_idade = &idade;

    printf("Valor de idade: %d\n", idade);
    printf("Valor via ponteiro: %d\n", *ponteiro_idade);

    *ponteiro_idade = 30;
    printf("Novo valor de idade: %d\n", idade);

    return 0;
}
```

Saída:

```text
Valor de idade: 25
Valor via ponteiro: 25
Novo valor de idade: 30
```

Repare na linha `*ponteiro_idade = 30;`: isso não muda o ponteiro para apontar para outro lugar —
isso vai até o endereço guardado em `ponteiro_idade` (que é o endereço de `idade`) e **sobrescreve o
valor que está lá**. Por isso a variável `idade` original muda para `30`, mesmo que a alteração
tenha sido feita "através" do ponteiro. Essa é a característica mais poderosa (e mais perigosa) dos
ponteiros: eles permitem modificar uma variável indiretamente, a partir de outro lugar do código.

## Por que isso importa: passando "por referência"

Um dos usos mais comuns de ponteiros é permitir que uma função **modifique** uma variável que
pertence a quem a chamou — algo impossível de fazer passando o valor diretamente. Veja o clássico
exemplo de trocar (swap) os valores de duas variáveis:

```c
#include <stdio.h>

void trocar(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 1;
    int y = 2;

    printf("Antes: x=%d, y=%d\n", x, y);
    trocar(&x, &y);
    printf("Depois: x=%d, y=%d\n", x, y);

    return 0;
}
```

Saída:

```text
Antes: x=1, y=2
Depois: x=2, y=1
```

Se a função `trocar` recebesse `int a` e `int b` diretamente (sem ponteiros), ela receberia apenas
**cópias** dos valores de `x` e `y` — qualquer troca feita dentro da função desapareceria assim que
ela terminasse, sem afetar `x` e `y` originais. Passando **endereços** (`&x` e `&y`), a função recebe
ponteiros que apontam diretamente para as variáveis originais, permitindo modificá-las de verdade.

## Ponteiros e arrays: primos muito próximos

Em C, arrays e ponteiros têm uma relação especial. O nome de um array, usado sozinho, se comporta
como um ponteiro para seu primeiro elemento:

```c
#include <stdio.h>

int main() {
    int numeros[3] = {10, 20, 30};
    int *ponteiro = numeros; // equivalente a: &numeros[0]

    printf("Primeiro elemento: %d\n", *ponteiro);
    printf("Segundo elemento: %d\n", *(ponteiro + 1));
    printf("Terceiro elemento: %d\n", *(ponteiro + 2));

    return 0;
}
```

Saída:

```text
Primeiro elemento: 10
Segundo elemento: 20
Terceiro elemento: 30
```

Repare em `*(ponteiro + 1)`: somar `1` a um ponteiro não avança necessariamente "1 byte" — o
compilador avança **o tamanho do tipo apontado** (lembra do `sizeof` da Aula 2?). Como `ponteiro` é
do tipo `int *`, e cada `int` ocupa 4 bytes, `ponteiro + 1` na verdade avança 4 bytes na memória,
pousando exatamente no início do próximo `int` do array. Essa é a base de como C acessa elementos de
arrays por trás dos panos: `numeros[1]` e `*(ponteiro + 1)` são, literalmente, a mesma operação.

## Ponteiros nulos e o perigo de "desreferenciar o nada"

Um ponteiro que não foi inicializado com um endereço válido pode conter "lixo" — um valor qualquer
que sobrou na memória. Desreferenciar um ponteiro assim é perigoso e pode travar o programa (um erro
chamado *segmentation fault*, que vamos encontrar de novo no mês 5). Por convenção, usamos a
constante `NULL` para representar "este ponteiro não aponta para lugar nenhum, de propósito":

```c
int *ponteiro = NULL;

if (ponteiro != NULL) {
    printf("%d\n", *ponteiro);
} else {
    printf("Ponteiro nao inicializado, nao vou desreferenciar!\n");
}
```

Verificar se um ponteiro é `NULL` antes de desreferenciá-lo é um hábito de segurança extremamente
importante em C, já que a linguagem **não impede** você de tentar acessar um endereço inválido — ela
simplesmente deixa o programa quebrar se você o fizer.

## Exercício 1: Previna o valor

Dado o código abaixo, qual será o valor impresso por `printf("%d\n", *p);`? Explique o raciocínio,
sem se preocupar com o endereço exato (que varia a cada execução).

```c
int x = 42;
int *p = &x;
x = 100;
printf("%d\n", *p);
```

### Solução

O valor impresso será `100`.

O ponteiro `p` guarda o **endereço** de `x`, não uma cópia do valor de `x` no momento da atribuição.
Depois que `p = &x` é executado, `p` sempre aponta para aquele mesmo endereço de memória — então,
quando `x` é alterado para `100`, `*p` (que significa "o valor que está no endereço guardado em p")
reflete automaticamente essa mudança, já que está lendo diretamente da mesma posição de memória onde
`x` vive.

## Exercício 2: Implemente uma função de incremento

Escreva uma função `incrementar` que recebe um ponteiro para `int` e soma `1` ao valor apontado por
ele. Depois, escreva um `main` que declare uma variável, chame essa função passando o endereço dela,
e imprima o resultado.

### Solução

```c
#include <stdio.h>

void incrementar(int *numero) {
    *numero = *numero + 1;
}

int main() {
    int contador = 5;
    incrementar(&contador);
    printf("Contador: %d\n", contador);
    return 0;
}
```

Saída:

```text
Contador: 6
```

A função `incrementar` recebe um `int *` (ponteiro para int). Dentro dela, `*numero = *numero + 1`
lê o valor atual no endereço apontado, soma `1`, e grava o resultado de volta no mesmo endereço. Como
o `main` passou `&contador` (o endereço da variável `contador`), a alteração feita dentro da função é
visível em `contador` depois que a função retorna — exatamente o mesmo princípio do exemplo `trocar`
visto na aula.

## Exercício 3: Percorrendo um array com ponteiros

Escreva um programa que declare um array de 4 inteiros, e use um ponteiro (com aritmética de
ponteiros, sem usar colchetes `[]`) para imprimir todos os elementos, um por linha.

### Solução

```c
#include <stdio.h>

int main() {
    int valores[4] = {5, 10, 15, 20};
    int *p = valores;

    for (int i = 0; i < 4; i++) {
        printf("%d\n", *(p + i));
    }

    return 0;
}
```

Saída:

```text
5
10
15
20
```

Em cada iteração do laço, `*(p + i)` avança `i` posições a partir do início do array (lembrando que
o compilador multiplica automaticamente pelo tamanho de `int`, então `p + i` sempre pousa
corretamente no início do i-ésimo elemento), e desreferencia esse endereço para obter o valor
guardado ali. Esse é exatamente o mesmo mecanismo usado internamente por `valores[i]`.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Ponteiros — o endereço das coisas" do meu curso de programação. Contexto: a aula
> explica o operador `&` (endereço de), o operador `*` (desreferência), como ponteiros permitem
> modificar variáveis através de funções, e a relação entre ponteiros e arrays. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. O que o operador `&` faz quando aplicado a uma variável?

- [ ] Multiplica o valor da variável por 2
- [x] Devolve o endereço de memória onde a variável está armazenada
- [ ] Cria uma cópia da variável
- [ ] Apaga o valor da variável

> O operador `&` ("endereço de") devolve a posição exata, na memória, onde uma variável está
> armazenada.

### 2. O que significa "desreferenciar" um ponteiro (usar `*` sobre ele)?

- [ ] Criar um novo ponteiro vazio
- [x] Ir até o endereço guardado no ponteiro e acessar (ou modificar) o valor que está lá
- [ ] Converter o ponteiro para um número inteiro
- [ ] Apagar o ponteiro da memória

> Desreferenciar um ponteiro (`*ponteiro`) acessa o valor armazenado no endereço de memória que o
> ponteiro guarda — permitindo tanto ler quanto modificar esse valor.

### 3. Por que passar `&x` (o endereço de x) para uma função permite que ela modifique x de verdade?

- [ ] Porque C sempre modifica variáveis automaticamente, com ou sem ponteiros
- [x] Porque a função recebe o endereço da variável original, podendo acessar e sobrescrever o mesmo espaço de memória
- [ ] Porque isso faz a variável x virar global
- [ ] Isso não é possível em C sob nenhuma circunstância

> Ao receber o endereço (não uma cópia do valor), a função pode desreferenciar o ponteiro e
> modificar diretamente o conteúdo daquela posição de memória — que é a mesma posição onde a
> variável original vive.

### 4. Em `int *p = numeros;` (onde `numeros` é um array), o que `p + 1` representa?

- [ ] O endereço de p somado a 1 byte, sempre
- [x] O endereço do próximo elemento do array, avançando exatamente o tamanho do tipo apontado (por exemplo, 4 bytes para int)
- [ ] Um erro de compilação
- [ ] O último elemento do array

> A aritmética de ponteiros avança de acordo com o tamanho do tipo apontado. Para um `int *`
> (tipicamente 4 bytes), `p + 1` avança 4 bytes, pousando exatamente no início do próximo `int`.

### 5. Por que é perigoso desreferenciar um ponteiro que não foi inicializado (ou que é NULL)?

- [ ] Porque isso sempre faz o computador desligar
- [x] Porque o ponteiro pode apontar para um endereço de memória inválido ou não pertencente ao programa, travando a execução
- [ ] Porque ponteiros não inicializados são convertidos automaticamente em zero
- [ ] Isso nunca é perigoso em C

> Um ponteiro não inicializado (ou NULL) pode conter um endereço inválido ou aleatório. Tentar
> acessar esse endereço pode causar uma falha grave na execução do programa (segmentation fault),
> por isso é uma boa prática verificar se um ponteiro é diferente de NULL antes de desreferenciá-lo.
