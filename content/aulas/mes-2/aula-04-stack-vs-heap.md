---
id: "m2-a4"
mes: 2
numero: 4
titulo: "Stack vs Heap"
objetivo: "Entender as duas regiões de memória usadas por um programa em execução e quando cada uma é usada."
duracao: 25
status: "completo"
---

## Duas "salas" diferentes dentro da memória do seu programa

Quando um programa em C roda, a memória RAM que o sistema operacional reserva para ele (lembra da
memória virtual por processo, Aula 7 do mês 1?) é organizada em regiões com propósitos diferentes.
As duas mais importantes para você agora são a **stack** (pilha) e o **heap** (monte/depósito).

Pense em um restaurante: a **stack** é como a pilha de bandejas limpas no início do balcão — você
sempre pega a bandeja de cima e sempre devolve a bandeja no topo. É rápido, organizado, e totalmente
automático. Já o **heap** é como o depósito nos fundos do restaurante: se você precisa de uma panela
grande especial, você vai até lá, pega exatamente o que precisa, e — este é o ponto importante —
**você é responsável por devolvê-la** quando terminar. Ninguém faz isso automaticamente por você.

## A stack: automática, rápida, e organizada em LIFO

Toda vez que uma função é chamada em C, o sistema reserva automaticamente um pedaço de memória na
stack para guardar as variáveis locais dessa função, seus parâmetros, e o endereço para onde o
programa deve voltar quando ela terminar. Esse pedaço se chama **frame** (quadro). Quando a função
termina, seu frame é automaticamente removido da stack — sem que você precise fazer nada.

A stack segue uma disciplina chamada **LIFO** (*Last In, First Out* — o último a entrar é o primeiro
a sair), exatamente como uma pilha de bandejas: a última função chamada é sempre a primeira a
terminar e "sair" da pilha.

```c
#include <stdio.h>

void funcaoC() {
    printf("Dentro de C\n");
}

void funcaoB() {
    printf("Dentro de B, antes de chamar C\n");
    funcaoC();
    printf("Dentro de B, depois de chamar C\n");
}

void funcaoA() {
    printf("Dentro de A, antes de chamar B\n");
    funcaoB();
    printf("Dentro de A, depois de chamar B\n");
}

int main() {
    funcaoA();
    return 0;
}
```

Saída:

```text
Dentro de A, antes de chamar B
Dentro de B, antes de chamar C
Dentro de C
Dentro de B, depois de chamar C
Dentro de A, depois de chamar B
```

Visualizando a stack crescendo e diminuindo ao longo dessa execução:

```text
chamada de A:        [ A ]
chamada de B:         [ A ][ B ]
chamada de C:          [ A ][ B ][ C ]
C termina, sai:        [ A ][ B ]
B termina, sai:       [ A ]
A termina, sai:      [ ]
```

Repare que `C` (a última chamada) é a primeira a terminar e sair da pilha — exatamente LIFO. É
justamente por isso que "Dentro de C" aparece no meio da saída, e a impressão "depois de chamar C"
de `B` só acontece depois que `C` já saiu completamente da stack.

## Por que a stack é tão rápida (e por que é limitada)

Alocar espaço na stack é extremamente rápido: o sistema só precisa mover um "ponteiro de topo" para
cima ou para baixo — não é preciso procurar um espaço livre nem fazer contabilidade complexa,
diferente do heap, como veremos a seguir.

Em compensação, a stack tem um tamanho **fixo e relativamente pequeno** (normalmente entre 1 MB e
8 MB, dependendo do sistema operacional e configuração). Isso é proposital: a stack é pensada para
guardar variáveis locais e informações de controle de chamadas de função, não estruturas de dados
gigantes.

## Estouro de pilha (stack overflow)

Se um programa empilha frames de função além do limite da stack — o caso mais comum sendo uma
**função recursiva sem uma condição de parada correta**, chamando a si mesma indefinidamente — a
stack acaba estourando. Isso se chama **stack overflow**, e normalmente derruba o programa
imediatamente com um erro grave.

```c
#include <stdio.h>

void recursaoInfinita(int contador) {
    printf("Chamada numero %d\n", contador);
    recursaoInfinita(contador + 1); // nunca para!
}

int main() {
    recursaoInfinita(1);
    return 0;
}
```

Esse programa chama `recursaoInfinita` repetidamente, cada chamada empilhando um novo frame na
stack, sem nunca desempilhar nenhum (já que nenhuma chamada retorna antes de fazer a próxima). Depois
de milhares (ou milhões) de chamadas, a stack estoura, e o sistema operacional derruba o programa com
um erro — no Linux/macOS, tipicamente um "segmentation fault". Toda função recursiva **precisa** de
uma condição de parada (chamada *caso base*) que efetivamente pare de fazer novas chamadas em algum
momento, ou esse é exatamente o resultado.

## O heap: manual, flexível, mas mais lento

O **heap** é uma região de memória muito maior (limitada basicamente pela RAM disponível no sistema),
mas que **não** é gerenciada automaticamente. Para usar memória no heap, o programador precisa
**pedir explicitamente** ao sistema (usando uma função chamada `malloc`, que veremos em detalhe na
próxima aula) e, depois de usar, **devolver explicitamente** essa memória (usando `free`).

Diferente da stack, o heap não segue uma ordem LIFO simples — pedidos e liberações de memória podem
acontecer em qualquer ordem, o que exige que o sistema mantenha um controle mais sofisticado (e mais
lento) de quais partes da memória estão livres e quais estão em uso.

## Quando usar cada um

Na prática, você não "escolhe" onde uma variável comum vai — variáveis locais declaradas normalmente
dentro de uma função (como fizemos em todas as aulas anteriores: `int x = 10;`) sempre vão para a
stack, automaticamente. Você só usa o heap quando precisa **explicitamente** de memória que:

- Precisa sobreviver além do fim da função que a criou (por exemplo, para ser usada por outra parte
  do programa depois).
- Tem um tamanho que só é conhecido em tempo de execução (por exemplo, o tamanho de uma lista que
  cresce dinamicamente, que veremos no mês 3).
- É grande demais para caber confortavelmente na stack, que é limitada.

## Visualizando a memória de um processo

Uma forma comum de representar a memória de um programa em execução:

```text
Endereços altos
┌─────────────────────────┐
│          Stack           │  ← cresce para baixo (variáveis locais, frames de função)
│            ↓              │
│                           │
│            ↑              │
│           Heap            │  ← cresce para cima (memória alocada com malloc)
├─────────────────────────┤
│   Dados globais/estáticos │
├─────────────────────────┤
│   Código do programa      │
└─────────────────────────┘
Endereços baixos
```

Stack e heap crescem em direções opostas dentro do espaço de memória do processo — e é justamente
por isso que, em teoria, quando um programa usa memória demais em ambos ao mesmo tempo, as duas
regiões podem colidir, um cenário raro, mas que reforça por que gerenciar bem a memória importa.

## Exercício 1: Onde essa variável vive?

Para cada declaração abaixo, dentro de uma função comum, diga se ela vive na **stack**: (a)
`int idade = 25;`, (b) `char letra = 'A';`, (c) `double valores[100];` (um array declarado
diretamente, sem malloc).

### Solução

Todas as três vivem na **stack**. Nenhuma delas usa `malloc` (que veremos na próxima aula) — são
todas variáveis locais declaradas diretamente dentro de uma função, com tamanho conhecido em tempo de
compilação. O sistema reserva automaticamente esse espaço na stack ao entrar na função, e libera
automaticamente ao sair dela, sem nenhuma ação manual necessária.

## Exercício 2: Rastreie a pilha de chamadas

Considerando o código abaixo, desenhe (em texto, como no exemplo da aula) o estado da stack de
chamadas em cada momento-chave: logo após `principal()` chamar `etapa1()`, logo após `etapa1()`
chamar `etapa2()`, e logo depois que `etapa2()` termina.

```c
void etapa2() { /* ... */ }
void etapa1() { etapa2(); }
void principal() { etapa1(); }
```

### Solução

```text
principal() chama etapa1():        [ principal ][ etapa1 ]
etapa1() chama etapa2():           [ principal ][ etapa1 ][ etapa2 ]
etapa2() termina e sai da pilha:   [ principal ][ etapa1 ]
```

Depois que `etapa2()` termina, sua entrada é removida do topo da pilha (LIFO), voltando o controle
para `etapa1()` exatamente de onde ela havia parado (logo após ter chamado `etapa2()`).

## Exercício 3: Por que isso trava o programa?

Explique por que a função abaixo eventualmente derruba o programa com um erro, e como corrigi-la
para que funcione corretamente para qualquer número positivo `n`.

```c
int fatorial(int n) {
    return n * fatorial(n - 1);
}
```

### Solução

Essa função nunca para de chamar a si mesma: não existe nenhuma condição que interrompa a recursão
(um *caso base*). Cada chamada empilha um novo frame na stack (aguardando o resultado da próxima
chamada para poder multiplicar), e como a recursão nunca termina, a stack eventualmente estoura
(*stack overflow*), derrubando o programa.

Correção, adicionando um caso base para `n <= 1` (por definição, `0! = 1` e `1! = 1`):

```c
int fatorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * fatorial(n - 1);
}
```

Agora, para qualquer `n` positivo, a recursão eventualmente atinge `n <= 1`, retorna `1` sem fazer
uma nova chamada, e a pilha de chamadas começa a "desempilhar" e multiplicar os resultados de volta,
até `principal` receber o valor final — sem nunca estourar a stack (desde que `n` não seja
absurdamente grande).

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Stack vs Heap" do meu curso de programação. Contexto: a aula explica a diferença
> entre a stack (automática, rápida, organizada em LIFO, com frames de função) e o heap (manual,
> flexível, gerenciado por malloc/free), e o que causa um stack overflow. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].

## Quiz

### 1. Qual disciplina de organização a stack segue?

- [ ] FIFO (primeiro a entrar, primeiro a sair)
- [x] LIFO (último a entrar, primeiro a sair)
- [ ] Ordem alfabética dos nomes das variáveis
- [ ] Ordem aleatória

> A stack segue a disciplina LIFO (Last In, First Out): a última função chamada é sempre a primeira
> a terminar e ser removida da pilha.

### 2. Por que alocar memória na stack é mais rápido que alocar no heap?

- [ ] Porque a stack usa um tipo de memória fisicamente diferente do heap
- [x] Porque a stack só precisa mover um "ponteiro de topo", sem precisar procurar espaço livre ou fazer contabilidade complexa
- [ ] Porque o heap está sempre cheio
- [ ] Não há diferença de velocidade entre os dois

> A stack aloca memória apenas movendo um ponteiro de topo para cima ou para baixo — uma operação
> muito rápida. O heap precisa rastrear quais blocos de memória estão livres ou ocupados, o que exige
> mais trabalho de gerenciamento.

### 3. O que normalmente causa um "stack overflow"?

- [ ] Declarar variáveis globais demais
- [x] Uma função recursiva sem uma condição de parada correta, empilhando frames indefinidamente
- [ ] Usar muitas variáveis do tipo float
- [ ] Fechar o programa antes de todas as funções terminarem

> Um stack overflow acontece quando frames de função se acumulam além do limite de tamanho da
> stack — o cenário mais comum sendo uma recursão que nunca atinge seu caso base.

### 4. Qual das opções abaixo é verdadeira sobre variáveis locais declaradas normalmente dentro de uma função (sem malloc)?

- [ ] Elas sempre vão para o heap
- [x] Elas vão automaticamente para a stack, e são liberadas automaticamente quando a função termina
- [ ] Elas precisam ser liberadas manualmente com free
- [ ] Elas nunca são apagadas da memória, mesmo depois que o programa termina

> Variáveis locais comuns são alocadas automaticamente na stack quando a função é chamada, e
> liberadas automaticamente quando ela termina — sem nenhuma ação manual do programador.

### 5. Qual é a principal diferença entre stack e heap em termos de gerenciamento de memória?

- [ ] O heap é gerenciado automaticamente, e a stack precisa ser gerenciada manualmente
- [x] A stack é gerenciada automaticamente pelo sistema; o heap exige que o programador peça e devolva memória explicitamente
- [ ] Ambos são gerenciados exatamente da mesma forma
- [ ] O heap só pode ser usado por funções recursivas

> A stack é automática: memória é reservada e liberada sozinha conforme funções são chamadas e
> terminam. O heap exige alocação e liberação manuais, através de funções como `malloc` e `free`
> (que veremos na próxima aula).
