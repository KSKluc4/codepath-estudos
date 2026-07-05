---
id: "m2-a2"
mes: 2
numero: 2
titulo: "Variáveis, tipos e memória em C"
objetivo: "Aprender como C representa variáveis na memória e quanto espaço cada tipo ocupa."
duracao: 25
status: "completo"
---

## Uma variável é uma caixa com etiqueta e tamanho fixo

Lá na Aula 2 do mês 1, vimos que tudo na memória do computador é, no fundo, uma sequência de bytes.
Uma **variável**, em C, é simplesmente um nome legível para humanos que aponta para um espaço
reservado na memória — uma "caixa" com um tamanho específico, definido por seu **tipo**.

Pense em um armário com gavetas de tamanhos diferentes: uma gaveta pequena guarda só um cartão (1
byte), outra guarda uma caixa de sapatos (4 bytes), outra guarda uma mala (8 bytes). Quando você
declara uma variável em C, você está, na prática, dizendo ao compilador: "reserve uma gaveta do
tamanho X, cole uma etiqueta com este nome nela, e guarde este valor lá dentro".

## Declarando variáveis

A sintaxe básica para declarar uma variável em C é:

```c
tipo nome = valor;
```

Por exemplo:

```c
int idade = 25;
char inicial = 'A';
float altura = 1.75;
double distancia_km = 384400.0;
```

Repare que, diferente de Python ou JavaScript, em C você **sempre** precisa declarar o tipo da
variável explicitamente. O compilador usa essa informação para saber exatamente quantos bytes
reservar e como interpretar os bits guardados ali (lembra da Aula 2 do mês 1? Os mesmos bits podem
significar coisas completamente diferentes dependendo de como são interpretados).

## Os tipos primitivos e seus tamanhos

Cada tipo em C ocupa uma quantidade específica (e normalmente fixa) de bytes na memória. Os tamanhos
abaixo são os mais comuns em sistemas modernos de 64 bits (o padrão da linguagem permite variação
entre plataformas, mas esses valores cobrem a grande maioria dos casos):

| Tipo | Tamanho típico | O que guarda |
|------|----------------|--------------|
| `char` | 1 byte | Um único caractere (ou um número inteiro pequeno, de -128 a 127) |
| `short` | 2 bytes | Um número inteiro pequeno |
| `int` | 4 bytes | Um número inteiro comum |
| `long` | 8 bytes | Um número inteiro grande |
| `float` | 4 bytes | Um número decimal (ponto flutuante), com menos precisão |
| `double` | 8 bytes | Um número decimal, com mais precisão que float |

Lembra da fórmula da Aula 2 do mês 1: com N bits, você representa `2ⁿ` valores diferentes? Um `char`
tem 1 byte = 8 bits, então ele representa `2⁸ = 256` valores possíveis — por isso um `char` sem sinal
(`unsigned char`) vai de 0 a 255, e um `int` de 4 bytes = 32 bits representa `2³² ≈ 4,3 bilhões` de
valores possíveis (indo de aproximadamente -2,1 bilhões a +2,1 bilhões, já que por padrão metade do
intervalo é reservada para números negativos).

## O operador `sizeof`

C oferece um operador chamado `sizeof`, que devolve exatamente quantos bytes um tipo (ou uma
variável) ocupa na memória. Isso é extremamente útil para confirmar, no seu próprio computador,
os tamanhos reais (que podem variar ligeiramente entre plataformas):

```c
#include <stdio.h>

int main() {
    printf("Tamanho de char: %zu bytes\n", sizeof(char));
    printf("Tamanho de int: %zu bytes\n", sizeof(int));
    printf("Tamanho de float: %zu bytes\n", sizeof(float));
    printf("Tamanho de double: %zu bytes\n", sizeof(double));
    return 0;
}
```

O especificador `%zu` em `printf` é usado especificamente para o tipo que `sizeof` devolve (chamado
`size_t`, um tipo inteiro sem sinal usado para representar tamanhos e contagens). Rodando esse
programa, a saída típica em um sistema de 64 bits seria:

```text
Tamanho de char: 1 bytes
Tamanho de int: 4 bytes
Tamanho de float: 4 bytes
Tamanho de double: 8 bytes
```

## Especificadores de formato do `printf`

Repare que usamos `%zu`, e não `%d`, para imprimir o resultado de `sizeof`. Isso porque `printf`
precisa saber **qual tipo** de dado está recebendo, para interpretar corretamente os bytes que estão
sendo passados a ele. Os especificadores mais comuns são:

| Especificador | Tipo |
|----------------|------|
| `%d` | int |
| `%c` | char |
| `%f` | float (ou double, ao imprimir) |
| `%lf` | double (em algumas funções de leitura, como `scanf`) |
| `%s` | string (texto) |
| `%zu` | size_t (resultado de sizeof) |

Usar o especificador errado é um erro comum e traiçoeiro em C: o programa pode compilar sem erros,
mas imprimir valores completamente sem sentido, porque `printf` vai interpretar os bytes recebidos
como se fossem de outro tipo.

## Conversão de tipos (casting)

Às vezes você precisa converter um valor de um tipo para outro — por exemplo, transformar um `int`
em `float` para fazer uma divisão com casas decimais. Isso pode acontecer de duas formas:

- **Implícita**: o compilador converte automaticamente, geralmente ao misturar tipos em uma
  expressão.
- **Explícita** (*casting*): você força a conversão manualmente, colocando o tipo desejado entre
  parênteses antes do valor.

```c
int a = 7;
int b = 2;

float resultado_errado = a / b;             // 3.0 (divisão inteira acontece antes da conversão!)
float resultado_certo = (float)a / b;         // 3.5 (conversão explícita antes da divisão)
```

Esse é um erro clássico em C: `a / b`, com `a` e `b` sendo `int`, faz uma **divisão inteira**
(descarta qualquer parte decimal) antes mesmo de o resultado ser guardado em uma variável `float`.
Para obter o resultado decimal correto, é preciso converter pelo menos um dos operandos para `float`
**antes** da divisão acontecer.

## Exercício 1: Quanto de memória isso usa?

Considerando os tamanhos típicos vistos na aula, calcule o total de bytes ocupados pelas variáveis
abaixo, se todas forem declaradas em sequência:

```c
int contador;
char letra;
double preco;
float nota;
```

### Solução

Somando os tamanhos típicos de cada tipo: `int` (4 bytes) + `char` (1 byte) + `double` (8 bytes) +
`float` (4 bytes) = **17 bytes** no total.

Na prática, compiladores costumam adicionar um pequeno espaçamento extra entre variáveis (chamado
*padding*) para otimizar o acesso à memória, então o total real usado pode ser ligeiramente maior que
essa soma simples — mas o raciocínio de somar os tamanhos individuais de cada tipo é exatamente o
ponto central deste exercício.

## Exercício 2: Programe e confira

Escreva um programa C completo que declare uma variável de cada tipo primitivo visto na aula (`int`,
`char`, `float`, `double`), e use `printf` com `sizeof` para imprimir o tamanho de cada uma.

### Solução

```c
#include <stdio.h>

int main() {
    int numero = 10;
    char letra = 'Z';
    float decimal_simples = 3.14f;
    double decimal_preciso = 3.14159265359;

    printf("int ocupa %zu bytes\n", sizeof(numero));
    printf("char ocupa %zu bytes\n", sizeof(letra));
    printf("float ocupa %zu bytes\n", sizeof(decimal_simples));
    printf("double ocupa %zu bytes\n", sizeof(decimal_preciso));

    return 0;
}
```

Compilando e rodando (`gcc arquivo.c -o arquivo && ./arquivo`), a saída esperada em um sistema
típico de 64 bits seria:

```text
int ocupa 4 bytes
char ocupa 1 bytes
float ocupa 4 bytes
double ocupa 8 bytes
```

Repare que usamos `sizeof(numero)` (a variável) em vez de `sizeof(int)` (o tipo) — ambos funcionam
igualmente bem, já que `sizeof` de uma variável sempre devolve o tamanho do tipo dela.

## Exercício 3: Previna o resultado

Qual é a saída impressa pelo programa abaixo? Explique o motivo, considerando divisão inteira.

```c
#include <stdio.h>

int main() {
    int total = 10;
    int pessoas = 4;
    float media = total / pessoas;
    printf("Media: %.2f\n", media);
    return 0;
}
```

### Solução

A saída impressa é:

```text
Media: 2.00
```

Mesmo que `media` seja declarada como `float`, a expressão `total / pessoas` é calculada **antes**
de qualquer conversão de tipo acontecer — e como `total` e `pessoas` são ambos `int`, a divisão
`10 / 4` é uma divisão inteira, que resulta em `2` (a parte decimal `0.5` é simplesmente descartada,
não arredondada). Só depois desse cálculo o valor `2` (int) é convertido para `2.0` (float) para ser
guardado em `media`.

Para obter o resultado correto (`2.50`), seria necessário converter explicitamente antes da divisão,
por exemplo: `float media = (float)total / pessoas;`.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Variáveis, tipos e memória em C" do meu curso de programação. Contexto: a aula
> explica os tipos primitivos de C (int, char, float, double), seus tamanhos em bytes, o operador
> sizeof e conversão de tipos (casting). Minha dúvida/meu exercício: [descreva aqui exatamente onde
> travou].

## Quiz

### 1. Qual é o tamanho típico, em bytes, de uma variável do tipo `int` em um sistema de 64 bits?

- [ ] 1 byte
- [ ] 2 bytes
- [x] 4 bytes
- [ ] 8 bytes

> Em sistemas modernos de 64 bits, o tipo `int` ocupa tipicamente 4 bytes (32 bits).

### 2. O que o operador `sizeof` faz em C?

- [ ] Converte uma variável para outro tipo
- [x] Devolve quantos bytes um tipo ou variável ocupa na memória
- [ ] Aloca memória dinamicamente
- [ ] Apaga o conteúdo de uma variável

> `sizeof` é um operador que devolve, em bytes, o espaço ocupado por um tipo ou por uma variável na
> memória.

### 3. Por que declarar o tipo de uma variável é obrigatório em C?

- [ ] Porque C não permite variáveis com nomes longos
- [x] Porque o compilador precisa saber quantos bytes reservar e como interpretar os bits guardados naquele espaço
- [ ] Porque isso torna o código mais bonito visualmente
- [ ] Porque apenas variáveis do tipo int podem ser impressas

> O tipo de uma variável informa ao compilador exatamente quanto espaço reservar na memória e como
> interpretar corretamente os bits armazenados ali (como número inteiro, caractere, decimal etc.).

### 4. Qual é o resultado da expressão `7 / 2` em C, se ambos os valores forem do tipo `int`?

- [ ] 3.5
- [x] 3
- [ ] 4
- [ ] Erro de compilação

> Quando ambos os operandos são `int`, C realiza uma divisão inteira, descartando qualquer parte
> decimal do resultado. `7 / 2` resulta em `3`, não `3.5`.

### 5. Qual especificador de formato do `printf` deve ser usado para imprimir um valor do tipo `char`?

- [ ] %d
- [x] %c
- [ ] %f
- [ ] %s

> `%c` é o especificador correto para imprimir um único caractere (`char`). Usar o especificador
> errado pode fazer o `printf` interpretar os bytes recebidos de forma incorreta.
