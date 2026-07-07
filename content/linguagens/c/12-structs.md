---
numero: 12
titulo: "Structs"
nivel: "intermediario"
objetivo: "Agrupar dados relacionados em uma struct."
duracao: 12
status: "completo"
---

## Conceito

Uma `struct` agrupa várias variáveis (de tipos possivelmente diferentes) sob um único nome,
formando um novo tipo composto. É a forma que C oferece para modelar "objetos" simples — sem
métodos, apenas dados — como um ponto (x, y), uma pessoa (nome, idade) ou um produto (nome, preço,
estoque).

## Sintaxe

```c
struct Pessoa {
    char nome[50];
    int idade;
};

struct Pessoa p1 = {"Ana", 28};
printf("%s tem %d anos\n", p1.nome, p1.idade); // acesso com ponto
```

## Exemplos comentados

```c
#include <stdio.h>
#include <string.h>

struct Produto {
    char nome[30];
    float preco;
    int estoque;
};

int main(void) {
    // Inicialização por ordem dos campos
    struct Produto mouse = {"Mouse", 79.90f, 15};

    // Ou por campo nomeado (mais legível, ordem não importa)
    struct Produto teclado = {.nome = "Teclado", .preco = 149.90f, .estoque = 8};

    printf("%s: R$%.2f (%d em estoque)\n", mouse.nome, mouse.preco, mouse.estoque);

    // Alterar um campo
    mouse.estoque -= 1; // simula uma venda

    // typedef evita ter que escrever "struct" toda vez
    typedef struct {
        float x;
        float y;
    } Ponto;

    Ponto origem = {0.0f, 0.0f};
    Ponto destino = {3.0f, 4.0f};
    printf("Destino: (%.1f, %.1f)\n", destino.x, destino.y);

    // Structs dentro de arrays: muito comum para representar "tabelas" de dados
    struct Produto estoque[2] = {
        {"Mouse", 79.90f, 15},
        {"Teclado", 149.90f, 8},
    };
    for (int i = 0; i < 2; i++) {
        printf("%s\n", estoque[i].nome);
    }

    // Ponteiro para struct: usa -> em vez de . para acessar campos
    struct Produto *p = &mouse;
    printf("%s\n", p->nome);      // equivalente a (*p).nome, mas mais legível
    p->estoque = 20;                // altera o campo através do ponteiro

    return 0;
}
```

## Exercício 1: Modele um retângulo

Declare uma `struct Retangulo` com campos `largura` e `altura` (ambos `float`), crie uma instância
com `largura = 4.0` e `altura = 5.0`, e imprima sua área (`largura * altura`).

### Solução

```c
#include <stdio.h>

struct Retangulo {
    float largura;
    float altura;
};

int main(void) {
    struct Retangulo r = {4.0f, 5.0f};
    float area = r.largura * r.altura;
    printf("Área: %.1f\n", area); // Área: 20.0
    return 0;
}
```

A struct apenas agrupa os dois campos relacionados sob um nome — o cálculo da área continua sendo
uma expressão comum, usando `.` para acessar cada campo da instância `r`.

## Exercício 2: Escreva uma função que recebe uma struct por ponteiro

Escreva uma função `void aplicarDesconto(struct Produto *p, float percentual)` que reduz o campo
`preco` de um `struct Produto` em `percentual`%, alterando a struct original (não uma cópia).

### Solução

```c
#include <stdio.h>

struct Produto {
    char nome[30];
    float preco;
};

void aplicarDesconto(struct Produto *p, float percentual) {
    p->preco = p->preco - (p->preco * percentual / 100);
}

int main(void) {
    struct Produto mouse = {"Mouse", 100.0f};

    aplicarDesconto(&mouse, 10);
    printf("Novo preço: %.2f\n", mouse.preco); // Novo preço: 90.00

    return 0;
}
```

Assim como com variáveis simples, passar `&mouse` (o endereço) permite que a função altere a struct
original em `main`. Se a função recebesse `struct Produto p` (por valor, sem ponteiro), receberia
uma cópia inteira da struct, e a alteração de preço não teria efeito nenhum fora da função — só que
com structs, copiar por valor também é mais custoso, já que copia todos os campos de uma vez.

## Quiz

### 1. O que uma `struct` permite fazer em C?

- [ ] Definir uma nova função
- [x] Agrupar várias variáveis (possivelmente de tipos diferentes) sob um único novo tipo composto
- [ ] Criar um array dinâmico
- [ ] Substituir a necessidade de ponteiros

> `struct` é a ferramenta de C para modelar dados compostos, agrupando campos relacionados (como
> nome, idade, preço) sob um único tipo nomeado, que pode então ser usado para declarar variáveis,
> parâmetros de função, arrays, etc.

### 2. Qual a diferença entre acessar um campo com `.` e com `->`?

- [ ] Não há diferença, são intercambiáveis
- [x] `.` acessa um campo diretamente em uma struct; `->` acessa um campo através de um PONTEIRO para a struct
- [ ] `->` só funciona com números
- [ ] `.` só funciona dentro de funções

> `variavel.campo` é usado quando você tem a struct diretamente. `ponteiro->campo` é um atalho
> para `(*ponteiro).campo` — necessário quando você tem apenas um ponteiro para a struct, como
> dentro de uma função que recebe `struct Produto *p`.

### 3. Por que passar uma struct por ponteiro para uma função costuma ser preferível a passar por valor?

- [ ] Passar por valor nunca é permitido em C
- [x] Passar por valor copia TODOS os campos da struct, o que é mais custoso, além de não permitir alterar a struct original
- [ ] `->` só existe quando a struct é passada por valor
- [ ] Não há diferença de desempenho entre as duas formas

> Passar uma struct por valor cria uma cópia completa de todos os seus campos na pilha, o que pode
> ser custoso para structs grandes — e qualquer alteração feita na cópia não afeta a struct
> original. Passar um ponteiro evita essa cópia (só copia o endereço, tipicamente 8 bytes) e ainda
> permite modificar a struct original quando necessário.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Structs" na trilha de C do CodePath. Contexto: o capítulo explica declaração de
> structs, acesso com . e ->, e a passagem de structs por ponteiro para funções. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
