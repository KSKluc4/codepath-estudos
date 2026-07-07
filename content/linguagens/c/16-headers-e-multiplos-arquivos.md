---
numero: 16
titulo: "Headers e múltiplos arquivos"
nivel: "avancado"
objetivo: "Organizar um programa C em múltiplos arquivos .c e .h."
duracao: 12
status: "completo"
---

## Conceito

Programas C reais são divididos em múltiplos arquivos `.c` (implementação), cada um acompanhado de
um arquivo `.h` (header) que declara o que aquele módulo oferece para o resto do programa — funções,
structs, constantes. Outros arquivos `.c` incluem o `.h` com `#include` para usar esse código, sem
precisar ver (ou recompilar) a implementação completa.

## Sintaxe

```c
// matematica.h
#ifndef MATEMATICA_H
#define MATEMATICA_H

int somar(int a, int b);

#endif
```

```c
// matematica.c
#include "matematica.h"

int somar(int a, int b) {
    return a + b;
}
```

```c
// main.c
#include <stdio.h>
#include "matematica.h"

int main(void) {
    printf("%d\n", somar(2, 3));
    return 0;
}
```

```bash
gcc main.c matematica.c -o programa
```

## Exemplos comentados

```c
// Diferença entre #include <...> e #include "...":
// <stdio.h>  -> procura em diretórios padrão do sistema/compilador (bibliotecas)
// "meuarquivo.h" -> procura primeiro no diretório do projeto (headers próprios)

// include guards (#ifndef/#define/#endif) evitam erro de "redefinição" se o
// mesmo header for incluído (direta ou indiretamente) mais de uma vez no mesmo arquivo
#ifndef PESSOA_H
#define PESSOA_H

struct Pessoa {
    char nome[50];
    int idade;
};

void apresentar(struct Pessoa p);

#endif // PESSOA_H

// pessoa.c implementa o que pessoa.h declarou
// #include "pessoa.h"
// #include <stdio.h>
//
// void apresentar(struct Pessoa p) {
//     printf("%s tem %d anos\n", p.nome, p.idade);
// }

// Regra geral do que vai em cada arquivo:
// .h -> "o que existe": protótipos de função, structs, constantes (a INTERFACE pública)
// .c -> "como funciona": a implementação de verdade das funções

// Alternativa moderna ao #ifndef/#define/#endif, suportada pela maioria dos
// compiladores (não é 100% padrão ISO, mas amplamente usada)
// #pragma once
```

## Exercício 1: Divida um programa em dois arquivos

Descreva o conteúdo de `circulo.h` e `circulo.c` para uma função `float areaCirculo(float raio)`,
e como `main.c` usaria essa função.

### Solução

```c
// circulo.h
#ifndef CIRCULO_H
#define CIRCULO_H

float areaCirculo(float raio);

#endif
```

```c
// circulo.c
#include "circulo.h"
#include <math.h>

float areaCirculo(float raio) {
    return M_PI * raio * raio;
}
```

```c
// main.c
#include <stdio.h>
#include "circulo.h"

int main(void) {
    printf("%.2f\n", areaCirculo(5)); // 78.54
    return 0;
}
```

```bash
gcc main.c circulo.c -o programa -lm
```

`circulo.h` só declara a **assinatura** da função (o que ela recebe e retorna), sem o corpo.
`circulo.c` implementa de fato. `main.c` só precisa incluir o header para chamar a função, sem
saber (ou se importar) como ela foi implementada — a flag `-lm` é necessária ao usar `<math.h>` com
gcc, para "linkar" a biblioteca matemática.

## Exercício 2: Corrija o erro de "redefinição"

O programa abaixo dá erro de compilação por redefinição de `struct Ponto`, porque `geometria.h` é
incluído indiretamente duas vezes. Explique a causa e a correção usando include guards.

```c
// geometria.h (SEM include guard)
struct Ponto {
    float x;
    float y;
};
```

### Solução

```c
// geometria.h (COM include guard)
#ifndef GEOMETRIA_H
#define GEOMETRIA_H

struct Ponto {
    float x;
    float y;
};

#endif
```

Sem o include guard, se dois arquivos diferentes (ou o mesmo arquivo por um caminho indireto)
incluírem `geometria.h`, o pré-processador colaria o conteúdo do header duas vezes no mesmo
arquivo `.c` final, fazendo o compilador ver `struct Ponto` declarada duas vezes — um erro. O
padrão `#ifndef NOME_H / #define NOME_H / ... / #endif` garante que, a partir da segunda inclusão
no mesmo arquivo, o conteúdo entre as diretivas seja pulado, já que `NOME_H` já estará definido.

## Quiz

### 1. Qual a diferença entre o que geralmente vai em um arquivo `.h` e em um `.c`?

- [ ] Não há diferença, o conteúdo é sempre idêntico
- [x] `.h` declara a interface pública (protótipos, structs); `.c` contém a implementação de verdade
- [ ] `.c` só pode ter uma função
- [ ] `.h` é opcional e nunca é necessário

> Um arquivo header (`.h`) funciona como um "índice" do que um módulo oferece — protótipos de
> função, definições de struct, constantes — sem revelar como as funções são implementadas. O
> arquivo `.c` correspondente contém o código de verdade, que outros arquivos não precisam ver
> para poder usar aquelas funções.

### 2. Para que servem os "include guards" (`#ifndef`/`#define`/`#endif`) em um header?

- [ ] Para melhorar a performance do programa em tempo de execução
- [x] Para evitar erro de "redefinição" quando o mesmo header é incluído mais de uma vez no mesmo arquivo
- [ ] São obrigatórios apenas em arquivos `.c`
- [ ] Servem para esconder o conteúdo do header de outros arquivos

> Se o mesmo header for incluído (direta ou indiretamente, através de outros headers) mais de uma
> vez no mesmo arquivo final, o compilador veria as mesmas declarações repetidas, gerando erro.
> Include guards fazem o conteúdo do header ser processado apenas na primeira inclusão, ignorando
> inclusões subsequentes no mesmo arquivo.

### 3. Qual a diferença entre `#include <stdio.h>` e `#include "meuarquivo.h"`?

- [ ] Não há diferença nenhuma
- [x] `<...>` busca em diretórios padrão do sistema/compilador; `"..."` busca primeiro no diretório do próprio projeto
- [ ] `"..."` só funciona com bibliotecas padrão
- [ ] `<...>` é usado apenas para arquivos de código, nunca headers

> A convenção (seguida pela maioria dos compiladores) é: `<nome.h>` procura o arquivo nos
> diretórios de include padrão (onde ficam as bibliotecas do sistema/compilador), enquanto
> `"nome.h"` procura primeiro no diretório do arquivo atual (ou do projeto), e só depois nos
> diretórios padrão — por isso headers próprios do projeto usam aspas.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Headers e múltiplos arquivos" na trilha de C do CodePath. Contexto: o capítulo
> explica a divisão entre arquivos .c e .h, include guards e como compilar múltiplos arquivos
> juntos. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
