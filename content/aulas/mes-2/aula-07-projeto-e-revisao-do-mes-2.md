---
id: "m2-a7"
mes: 2
numero: 7
titulo: "Projeto e revisão do Mês 2"
objetivo: "Consolidar C, ponteiros e memória com um projeto prático."
duracao: 30
status: "completo"
---

## De "hello world" a gerenciar memória de verdade

Neste mês, você saiu de "por que aprender C" para conseguir alocar, redimensionar e liberar memória
manualmente — um caminho e tanto! Este projeto guiado junta praticamente tudo: tipos e `sizeof`
(Aula 2), ponteiros (Aula 3), a diferença entre stack e heap (Aula 4), e `malloc`/`realloc`/`free`
(Aula 5). Vamos construir, passo a passo, um pequeno **gerenciador de notas** que cresce
dinamicamente conforme novas notas são adicionadas.

## O projeto: gerenciador de notas dinâmico

A ideia: em vez de um array de tamanho fixo (que teria um limite rígido de notas), vamos alocar um
array **no heap**, que pode crescer conforme necessário usando `realloc` — exatamente o cenário real
em que a alocação dinâmica se torna necessária, como vimos na Aula 4.

### Passo 1: calculando a média

Primeiro, uma função que recebe um ponteiro para um array de notas e a quantidade de notas, e
calcula a média.

## Exercício 1: Implemente `calcular_media`

Escreva uma função `double calcular_media(int *notas, int quantidade)` que soma todas as notas do
array (usando indexação, `notas[i]`) e devolve a média como `double`. Preste atenção na divisão
inteira vista na Aula 2!

### Solução

```c
double calcular_media(int *notas, int quantidade) {
    int soma = 0;
    for (int i = 0; i < quantidade; i++) {
        soma += notas[i];
    }
    return (double)soma / quantidade;
}
```

Repare no `(double)soma`: sem essa conversão explícita, `soma / quantidade` seria uma divisão
inteira (ambos `int`), descartando a parte decimal — exatamente o cuidado que vimos na Aula 2 sobre
conversão de tipos. Note também que `notas` é recebido como um ponteiro (`int *`), mas usado com a
sintaxe de array (`notas[i]`) — lembrando da Aula 3, isso funciona porque um array "decai" para um
ponteiro ao seu primeiro elemento, e `notas[i]` é exatamente equivalente a `*(notas + i)`.

### Passo 2: adicionando uma nova nota dinamicamente

Agora a parte mais interessante: uma função que recebe o array atual, adiciona uma nova nota ao
final, e devolve o (possivelmente novo) endereço do array — usando `realloc`, exatamente como vimos
na Aula 5.

## Exercício 2: Implemente `adicionar_nota`

Escreva uma função `int* adicionar_nota(int *notas, int *quantidade, int nova_nota)` que: (a) usa
`realloc` para aumentar o array em um espaço; (b) coloca `nova_nota` na última posição; (c)
incrementa `*quantidade` (recebido como ponteiro, para que o `main` veja a atualização); (d) devolve
o novo ponteiro do array.

### Solução

```c
int* adicionar_nota(int *notas, int *quantidade, int nova_nota) {
    int novo_tamanho = (*quantidade + 1) * sizeof(int);
    int *novo_array = realloc(notas, novo_tamanho);

    if (novo_array == NULL) {
        printf("Falha ao redimensionar!\n");
        return notas; // devolve o array antigo, ainda válido, se realloc falhar
    }

    novo_array[*quantidade] = nova_nota;
    *quantidade = *quantidade + 1;

    return novo_array;
}
```

Repare em três detalhes que juntam exatamente o que vimos nas últimas aulas: (1) o resultado de
`realloc` é guardado em uma variável separada (`novo_array`) antes de qualquer outra coisa, exatamente
a prática de segurança da Aula 5, para não perder a referência ao array original se `realloc`
falhar; (2) `quantidade` é recebido como `int *` (ponteiro), porque a função precisa modificar a
variável do `main` que guarda a quantidade atual de notas — exatamente o mecanismo de "passagem por
referência" da Aula 3; (3) a função devolve o novo ponteiro do array, porque quem a chamou (`main`)
precisa atualizar sua própria variável, já que `realloc` pode ter movido o bloco de memória para um
novo endereço.

### Passo 3: juntando tudo no `main`

## Exercício 3: Monte o programa completo

Escreva um `main` que: (a) aloque um array inicial de 3 notas usando `malloc` (com os valores 7, 8 e
6); (b) imprima a média inicial usando `calcular_media`; (c) adicione duas novas notas (9 e 10) usando
`adicionar_nota`; (d) imprima a nova média; (e) libere a memória corretamente ao final.

### Solução

```c
#include <stdio.h>
#include <stdlib.h>

double calcular_media(int *notas, int quantidade) {
    int soma = 0;
    for (int i = 0; i < quantidade; i++) {
        soma += notas[i];
    }
    return (double)soma / quantidade;
}

int* adicionar_nota(int *notas, int *quantidade, int nova_nota) {
    int novo_tamanho = (*quantidade + 1) * sizeof(int);
    int *novo_array = realloc(notas, novo_tamanho);

    if (novo_array == NULL) {
        printf("Falha ao redimensionar!\n");
        return notas;
    }

    novo_array[*quantidade] = nova_nota;
    *quantidade = *quantidade + 1;

    return novo_array;
}

int main() {
    int quantidade = 3;
    int *notas = malloc(quantidade * sizeof(int));

    if (notas == NULL) {
        printf("Falha ao alocar memoria!\n");
        return 1;
    }

    notas[0] = 7;
    notas[1] = 8;
    notas[2] = 6;

    printf("Media inicial: %.2f\n", calcular_media(notas, quantidade));

    notas = adicionar_nota(notas, &quantidade, 9);
    notas = adicionar_nota(notas, &quantidade, 10);

    printf("Media apos adicionar notas: %.2f\n", calcular_media(notas, quantidade));

    free(notas);
    notas = NULL;

    return 0;
}
```

Compilando e rodando:

```bash
gcc notas.c -o notas
./notas
```

Saída esperada:

```text
Media inicial: 7.00
Media apos adicionar notas: 8.00
```

Repare que `notas = adicionar_nota(notas, &quantidade, 9);` sempre reatribui o ponteiro `notas` com
o valor devolvido pela função — exatamente porque, como vimos na Aula 5, `realloc` pode mover o bloco
de memória para um novo endereço, e o `main` precisa continuar usando o endereço atualizado e
correto do array.

## Resumo do Mês 2 — memória sob seu controle

Antes do quiz de revisão, um mapa mental de tudo o que vimos:

- **Aula 1 — Por que C**: C fica no meio do espectro entre linguagens de alto e baixo nível, é
  compilada (não interpretada), e não esconde o gerenciamento de memória do programador.
- **Aula 2 — Variáveis, tipos e memória**: cada tipo (int, char, float, double) ocupa um número
  específico de bytes; `sizeof` revela esse tamanho; divisão entre inteiros é uma divisão inteira,
  exigindo conversão explícita (casting) quando você quer um resultado decimal.
- **Aula 3 — Ponteiros**: `&` devolve o endereço de uma variável; `*` desreferencia um ponteiro
  (acessa/modifica o valor no endereço guardado); arrays e ponteiros são profundamente relacionados.
- **Aula 4 — Stack vs. Heap**: a stack é automática, rápida, organizada em LIFO, e limitada (podendo
  estourar com recursão sem caso base); o heap é manual, flexível, e mais lento para gerenciar.
- **Aula 5 — malloc, free e cia**: `malloc`/`calloc` pedem memória no heap; `realloc` redimensiona;
  `free` devolve a memória; esquecer `free` causa vazamento; usar memória após `free` causa um
  ponteiro solto.
- **Aula 6 — Como o compilador funciona**: pré-processamento, compilação, montagem e linkagem são as
  quatro etapas que transformam texto C em um executável; erros de linkagem (como "undefined
  reference") acontecem na etapa final, quando o linker não encontra a implementação de uma função.

No mês 3, vamos usar tudo isso — especialmente ponteiros e alocação dinâmica — como base para
construir estruturas de dados de verdade: listas ligadas, árvores e grafos, além de aprender a medir
formalmente a eficiência de algoritmos com a notação Big O.

## Tirou dúvida?

Se travar em algum ponto deste projeto ou da revisão, descreva o contexto exato do que você já
entendeu e onde travou. Copie e adapte o modelo abaixo:

> Estou estudando "Projeto e revisão do Mês 2" do meu curso de programação. Contexto: o projeto
> constrói um gerenciador de notas dinâmico em C usando malloc/realloc/free e ponteiros, revisando
> tipos, memória, stack/heap e o processo de compilação. Minha dúvida/meu exercício: [descreva aqui
> exatamente onde travou].

## Quiz

### 1. Por que C é considerada uma linguagem de "nível intermediário"?

- [ ] Porque só programadores intermediários conseguem usá-la
- [x] Porque permite código estruturado e legível, mas exige controle manual explícito sobre a memória
- [ ] Porque ela só roda em processadores de médio desempenho
- [ ] Porque foi a segunda linguagem de programação já criada

> C oferece uma sintaxe estruturada (mais alto nível que assembly), mas não gerencia memória
> automaticamente como Python ou JavaScript — o programador tem controle e responsabilidade direta.

### 2. O que o operador `sizeof` devolve?

- [ ] O valor atual de uma variável
- [x] Quantos bytes um tipo ou variável ocupa na memória
- [ ] O endereço de memória de uma variável
- [ ] Um ponteiro para o próximo elemento de um array

> `sizeof` devolve, em bytes, o espaço ocupado por um tipo ou variável — essencial para calcular
> corretamente quanto espaço alocar dinamicamente, como fizemos no projeto com `malloc`.

### 3. O que o operador `&` faz quando aplicado a uma variável?

- [ ] Devolve o valor da variável multiplicado por 2
- [x] Devolve o endereço de memória onde a variável está armazenada
- [ ] Cria uma cópia da variável no heap
- [ ] Converte a variável para um ponteiro nulo

> `&` ("endereço de") devolve a posição de memória onde a variável está guardada — usado, por
> exemplo, para passar `&quantidade` no projeto, permitindo que a função modifique a variável
> original do `main`.

### 4. Qual disciplina de organização a stack segue?

- [ ] FIFO (primeiro a entrar, primeiro a sair)
- [x] LIFO (último a entrar, primeiro a sair)
- [ ] Ordem alfabética
- [ ] Nenhuma ordem específica

> A stack segue LIFO: a última função chamada é a primeira a terminar e sair da pilha de chamadas.

### 5. O que causa tipicamente um "stack overflow"?

- [ ] Alocar memória demais no heap com malloc
- [x] Uma função recursiva sem condição de parada, empilhando frames indefinidamente
- [ ] Usar muitas variáveis do tipo char
- [ ] Esquecer de chamar free

> Um stack overflow ocorre quando frames de função se acumulam além do limite da stack — o cenário
> mais comum sendo uma recursão sem caso base.

### 6. O que é necessário fazer depois de alocar memória com `malloc` e terminar de usá-la?

- [ ] Nada, o sistema libera automaticamente ao final da função
- [x] Chamar free() explicitamente para devolver a memória ao sistema
- [ ] Declarar a variável novamente
- [ ] Reiniciar o programa

> Diferente da stack, memória alocada no heap com `malloc` não é liberada automaticamente — é
> responsabilidade do programador chamar `free()` explicitamente, ou o programa sofre um vazamento
> de memória.

### 7. O que é um "ponteiro solto" (dangling pointer)?

- [ ] Um ponteiro que nunca foi inicializado
- [x] Um ponteiro que ainda guarda o endereço de uma memória já liberada com free
- [ ] Um ponteiro que aponta para uma variável na stack
- [ ] Um ponteiro usado dentro de um laço for

> Um ponteiro solto continua guardando um endereço de memória já devolvido ao sistema. Usá-lo depois
> disso tem comportamento indefinido e perigoso.

### 8. Por que é importante guardar o resultado de `realloc` em uma variável separada, como fizemos em `adicionar_nota`?

- [ ] Porque realloc nunca funciona na primeira tentativa
- [x] Porque, se realloc falhar (devolvendo NULL), sobrescrever o ponteiro original faria perder a única referência válida ao bloco de memória
- [ ] Porque realloc não pode redimensionar arrays de inteiros
- [ ] Isso é apenas uma preferência de estilo, sem consequência real

> Se `realloc` falhar, ele devolve `NULL`, mas o bloco original continua válido. Sobrescrever
> diretamente o ponteiro original perderia essa referência, causando um vazamento de memória.

### 9. Qual é a ordem correta das quatro etapas de compilação em C?

- [x] Pré-processamento, compilação, montagem, linkagem
- [ ] Compilação, montagem, pré-processamento, linkagem
- [ ] Linkagem, pré-processamento, compilação, montagem
- [ ] Montagem, compilação, linkagem, pré-processamento

> A ordem é: pré-processamento (resolve diretivas como #include), compilação (gera assembly),
> montagem (gera um arquivo objeto binário) e linkagem (junta tudo em um executável).

### 10. Um erro do tipo `undefined reference to 'minha_funcao'` normalmente indica um problema em qual etapa?

- [ ] Pré-processamento
- [ ] Compilação
- [ ] Montagem
- [x] Linkagem

> Esse erro ocorre na etapa de linkagem, quando o linker não consegue encontrar a implementação real
> de uma função que foi declarada e chamada corretamente no código.
