---
numero: 11
titulo: "Ponteiros e funções"
nivel: "intermediario"
objetivo: "Passar ponteiros como argumento para alterar valores fora da função."
duracao: 12
status: "completo"
---

## Conceito

Como visto no capítulo de funções, C passa argumentos **por valor** por padrão — a função recebe
uma cópia. Para que uma função altere uma variável do escopo de quem a chamou, é preciso passar o
**endereço** dessa variável (um ponteiro), e a função usa `*` para escrever no endereço recebido.
Esse padrão simula "passagem por referência", algo nativo em outras linguagens mas explícito em C.

## Sintaxe

```c
void incrementar(int *valor) {
    *valor = *valor + 1;
}

int main(void) {
    int x = 10;
    incrementar(&x);   // passa o ENDEREÇO de x
    printf("%d\n", x);  // 11
    return 0;
}
```

## Exemplos comentados

```c
#include <stdio.h>

// Sem ponteiro: só altera a cópia local, sem efeito fora da função
void dobrarSemEfeito(int numero) {
    numero = numero * 2;
}

// Com ponteiro: altera a variável original, através do endereço
void dobrarComEfeito(int *numero) {
    *numero = *numero * 2;
}

int main(void) {
    int a = 5;
    dobrarSemEfeito(a);
    printf("%d\n", a); // 5 — sem efeito, "a" continua igual

    int b = 5;
    dobrarComEfeito(&b);
    printf("%d\n", b); // 10 — a função alterou "b" de verdade

    return 0;
}

// Padrão muito comum: função que retorna MÚLTIPLOS valores via ponteiros
// (já que uma função C só pode ter um único "return")
void dividir(int dividendo, int divisor, int *quociente, int *resto) {
    *quociente = dividendo / divisor;
    *resto = dividendo % divisor;
}

int main2(void) {
    int q, r;
    dividir(17, 5, &q, &r);
    printf("Quociente: %d, Resto: %d\n", q, r); // Quociente: 3, Resto: 2
    return 0;
}

// scanf é o exemplo mais comum de função que exige ponteiros: precisa ESCREVER
// no endereço da variável para "devolver" o valor lido do usuário
int idade;
// scanf("%d", &idade); // scanf recebe o ENDEREÇO de idade para poder alterá-la
```

## Exercício 1: Função que retorna múltiplos valores

Escreva uma função `void minMax(int arr[], int tamanho, int *min, int *max)` que encontra o menor e
o maior valor de um array, "retornando" ambos através dos ponteiros `min` e `max`.

### Solução

```c
#include <stdio.h>

void minMax(int arr[], int tamanho, int *min, int *max) {
    *min = arr[0];
    *max = arr[0];
    for (int i = 1; i < tamanho; i++) {
        if (arr[i] < *min) *min = arr[i];
        if (arr[i] > *max) *max = arr[i];
    }
}

int main(void) {
    int numeros[] = {7, 2, 9, 4, 1, 8};
    int menor, maior;

    minMax(numeros, 6, &menor, &maior);
    printf("Menor: %d, Maior: %d\n", menor, maior); // Menor: 1, Maior: 8

    return 0;
}
```

Como C só permite um valor de retorno por `return`, "retornar" dois resultados (`min` e `max`) ao
mesmo tempo exige passar ponteiros para onde esses resultados devem ser escritos — a função
modifica diretamente o conteúdo apontado por `min` e `max`, que `main` já declarou antes de chamar
a função.

## Exercício 2: Implemente um "reset" via ponteiro

Escreva uma função `void zerarArray(int *arr, int tamanho)` que define todos os elementos de um
array como `0`, e verifique o resultado em `main`.

### Solução

```c
#include <stdio.h>

void zerarArray(int *arr, int tamanho) {
    for (int i = 0; i < tamanho; i++) {
        arr[i] = 0;
    }
}

int main(void) {
    int valores[] = {1, 2, 3, 4, 5};

    zerarArray(valores, 5);

    for (int i = 0; i < 5; i++) {
        printf("%d ", valores[i]); // 0 0 0 0 0
    }
    printf("\n");

    return 0;
}
```

Como arrays já decaem para ponteiros ao serem passados para funções (visto no capítulo anterior),
não é necessário usar `&` ao chamar `zerarArray(valores, 5)` — `valores` já É um ponteiro para o
primeiro elemento, e a função modifica o array original diretamente através dele.

## Quiz

### 1. Por que `void dobrar(int numero) { numero *= 2; }` não altera a variável passada para ela?

- [ ] Porque a multiplicação `*=` não funciona dentro de funções
- [x] Porque `numero` é um parâmetro por valor: a função recebe e altera apenas uma CÓPIA local
- [ ] Porque a função precisa de um `return` para funcionar
- [ ] Porque `int` não pode ser multiplicado

> Sem um ponteiro, o parâmetro `numero` é uma cópia independente da variável original passada na
> chamada. Qualquer alteração dentro da função afeta só essa cópia local, que deixa de existir
> quando a função termina — a variável original, no escopo de quem chamou, nunca é tocada.

### 2. Como uma função retorna mais de um valor "efetivo" em C, já que só existe um `return`?

- [ ] Não é possível, C só permite retornar um valor por função
- [x] Recebendo ponteiros como parâmetros e escrevendo os resultados extras através deles
- [ ] Usando múltiplos `return` na mesma função
- [ ] Retornando um array sempre

> O padrão comum em C é passar ponteiros para onde os resultados adicionais devem ser escritos
> (como em `minMax`), já que a função só pode devolver diretamente um valor via `return`, mas pode
> modificar quantas variáveis externas quiser através de ponteiros recebidos como parâmetro.

### 3. Por que `scanf("%d", &idade)` usa `&idade` em vez de apenas `idade`?

- [ ] É apenas um estilo de escrita, sem efeito real
- [x] `scanf` precisa do ENDEREÇO da variável para poder escrever o valor lido nela
- [ ] `&` converte `idade` para string
- [ ] `scanf` sempre ignora o segundo argumento

> `scanf` funciona como qualquer outra função em C que precisa "retornar" um valor através de um
> parâmetro: ela recebe o endereço de `idade` e escreve o valor digitado diretamente naquele
> endereço de memória — sem o `&`, a função receberia apenas uma cópia do valor atual de `idade`
> (geralmente lixo, se não inicializada), sem nenhuma forma de alterar a variável original.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Ponteiros e funções" na trilha de C do CodePath. Contexto: o capítulo explica
> como passar ponteiros para alterar variáveis fora da função, e o padrão de retornar múltiplos
> valores. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
