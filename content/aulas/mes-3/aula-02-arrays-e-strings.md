---
id: "m3-a2"
mes: 3
numero: 2
titulo: "Arrays e Strings"
objetivo: "Entender como arrays são armazenados na memória e as operações fundamentais sobre eles."
duracao: 25
status: "completo"
---

## A primeira estrutura de dados: um armário de gavetas idênticas

Um **array** é a estrutura de dados mais fundamental de todas: um bloco de memória **contíguo**
(posições vizinhas, uma logo após a outra), dividido em gavetas de tamanho idêntico. Pense em um
armário com gavetas numeradas, todas do mesmo tamanho, uma exatamente ao lado da outra — não existem
espaços vazios entre elas.

Essa organização simples é o que torna arrays tão poderosos: se você sabe o endereço da primeira
gaveta (o array `base`) e o tamanho de cada gaveta (`sizeof(tipo)`, retomando a Aula 2 do mês 2), você
pode calcular o endereço de **qualquer** gaveta com uma única conta matemática, sem precisar abrir
nenhuma outra gaveta no caminho:

```text
endereço(i) = endereço_base + i × tamanho_do_tipo
```

## Por que o acesso por índice é O(1)

Essa fórmula é exatamente o motivo pelo qual acessar `array[i]` é `O(1)` (constante), como vimos na
Aula 1: não importa se `i` é 3 ou 3 milhões, o cálculo do endereço é sempre uma única multiplicação e
uma única soma — a mesma quantidade de trabalho, independente da posição acessada ou do tamanho do
array.

```c
#include <stdio.h>

int main() {
    int numeros[5] = {10, 20, 30, 40, 50};
    printf("%d\n", numeros[3]); // acesso direto, O(1)
    return 0;
}
```

Retomando a Aula 3 do mês 2: `numeros[3]` é, literalmente, equivalente a `*(numeros + 3)` — o
compilador calcula o endereço usando exatamente a fórmula acima, e então desreferencia.

## Arrays estáticos vs. dinâmicos

- **Array estático**: declarado com tamanho fixo, direto no código (`int numeros[5];`). Vive na
  stack (Aula 4 do mês 2), é extremamente rápido de criar, mas seu tamanho **não pode mudar** depois
  de declarado.
- **Array dinâmico**: alocado no heap com `malloc` (Aula 5 do mês 2), pode ter seu tamanho decidido
  em tempo de execução, e pode até ser redimensionado com `realloc` — exatamente como fizemos no
  gerenciador de notas do projeto do mês passado.

## O custo de inserir e remover elementos

Aqui está uma pegadinha importante: nem toda operação em um array custa o mesmo. Inserir ou remover
um elemento **no final** do array é rápido — `O(1)`, se já houver espaço reservado. Mas inserir ou
remover um elemento **no início ou no meio** exige **deslocar** todos os elementos seguintes uma
posição, para manter o array contíguo sem "buracos":

```c
#include <stdio.h>

void inserir_no_inicio(int *array, int *tamanho, int valor) {
    for (int i = *tamanho; i > 0; i--) {
        array[i] = array[i - 1]; // desloca cada elemento uma posição para a direita
    }
    array[0] = valor;
    *tamanho = *tamanho + 1;
}
```

Se o array tem `n` elementos, inserir no início precisa deslocar todos os `n` elementos existentes —
uma operação `O(n)`. Quanto mais próximo do início a inserção acontece, mais elementos precisam ser
deslocados; inserir exatamente no final não desloca nada, sendo `O(1)`.

```text
Antes:      [ 10, 20, 30, _ ]
Inserir 99 no início:
Passo 1:    [ 10, 20, 30, 30 ]   (desloca 30 para a direita)
Passo 2:    [ 10, 20, 20, 30 ]   (desloca 20 para a direita)
Passo 3:    [ 10, 10, 20, 30 ]   (desloca 10 para a direita)
Passo 4:    [ 99, 10, 20, 30 ]   (escreve 99 na posição 0)
```

## Crescimento de arrays dinâmicos

O que acontece quando um array dinâmico já está cheio e você precisa adicionar mais um elemento?
Como vimos no projeto do mês 2, a solução é usar `realloc` para pedir um bloco maior. Uma estratégia
comum (usada, por exemplo, internamente pelas listas do Python e pelos vetores do C++) é **dobrar**
a capacidade sempre que o espaço acabar, em vez de aumentar de um em um. Isso parece desperdiçar
memória à primeira vista, mas na prática faz com que o **custo médio** de cada inserção no final
permaneça próximo de `O(1)`, mesmo contando as vezes em que é necessário realocar e copiar tudo — uma
propriedade chamada *complexidade amortizada*, que evita ter que redimensionar (uma operação cara) a
cada única inserção.

## Strings em C: arrays de caracteres com um segredo

Diferente de Python ou JavaScript, C **não tem um tipo dedicado para strings**. Uma string em C é,
literalmente, um array de `char` — com uma convenção especial: o último caractere **útil** é sempre
seguido por um caractere invisível chamado **caractere nulo** (`'\0'`, que vale `0`), marcando onde o
texto termina.

```c
#include <stdio.h>

int main() {
    char palavra[6] = {'C', 'o', 'd', 'e', '!', '\0'};
    printf("%s\n", palavra); // imprime: Code!
    return 0;
}
```

Repare que o array tem 6 posições, mas o texto "Code!" tem apenas 5 caracteres visíveis — a sexta
posição guarda o `'\0'`, que diz a qualquer função (como `printf`) exatamente onde parar de ler. Sem
o `'\0'`, funções que trabalham com strings continuariam lendo memória além do array, imprimindo
"lixo" (ou pior — acessando memória que não pertence àquele dado, um problema de segurança real, que
vamos revisitar no mês 5).

Como C não guarda o tamanho da string em nenhum lugar (diferente de uma lista em Python, que sabe seu
próprio tamanho), calcular o comprimento de uma string exige **percorrer o array inteiro até
encontrar o `'\0'`** — uma operação `O(n)`, mesmo que pareça uma operação simples:

```c
#include <stdio.h>

int tamanho_string(char *texto) {
    int contador = 0;
    while (texto[contador] != '\0') {
        contador++;
    }
    return contador;
}

int main() {
    char nome[] = "CodePath";
    printf("Tamanho: %d\n", tamanho_string(nome));
    return 0;
}
```

Saída:

```text
Tamanho: 8
```

Essa é, essencialmente, uma reimplementação simplificada da função `strlen` da biblioteca padrão de
C (`string.h`).

## Exercício 1: Calculando endereços

Um array `int valores[10]` começa no endereço `1000` (um número imaginário, só para o exercício), e
cada `int` ocupa 4 bytes. Calcule o endereço de `valores[0]`, `valores[3]` e `valores[7]`.

### Solução

Usando a fórmula `endereço(i) = endereço_base + i × tamanho_do_tipo`:

- `valores[0]`: `1000 + 0 × 4 = 1000`
- `valores[3]`: `1000 + 3 × 4 = 1012`
- `valores[7]`: `1000 + 7 × 4 = 1028`

Repare que não foi preciso "percorrer" o array para chegar em `valores[7]` — o endereço foi calculado
diretamente com uma única multiplicação e soma, exatamente o motivo pelo qual o acesso indexado é
`O(1)`, independente de qual posição está sendo acessada.

## Exercício 2: Complexidade de remoção

A função abaixo remove o elemento na posição `0` de um array, deslocando todos os elementos
seguintes uma posição para a esquerda. Qual é a complexidade Big O dessa operação, em função do
tamanho do array `n`? O que mudaria se, em vez disso, removêssemos sempre o **último** elemento?

```c
void remover_do_inicio(int *array, int *tamanho) {
    for (int i = 0; i < *tamanho - 1; i++) {
        array[i] = array[i + 1];
    }
    *tamanho = *tamanho - 1;
}
```

### Solução

Remover do início é `O(n)`: no pior caso, o laço percorre e desloca praticamente todos os `n - 1`
elementos restantes, uma posição para a esquerda cada um, para preencher a "lacuna" deixada pela
remoção.

Se, em vez disso, removêssemos sempre o **último** elemento (simplesmente diminuindo `*tamanho` em
1, sem deslocar nada), a operação seria `O(1)` — nenhum outro elemento precisa se mover, porque
remover o último elemento não deixa nenhuma lacuna no meio do array.

## Exercício 3: Implemente sua própria `strlen`

Sem usar a função `strlen` da biblioteca padrão, escreva uma função `int minha_strlen(char *texto)`
que devolve o número de caracteres de uma string, e teste com a string `"Ola, mundo!"`.

### Solução

```c
#include <stdio.h>

int minha_strlen(char *texto) {
    int contador = 0;
    while (texto[contador] != '\0') {
        contador++;
    }
    return contador;
}

int main() {
    char frase[] = "Ola, mundo!";
    printf("%d\n", minha_strlen(frase));
    return 0;
}
```

Saída:

```text
11
```

A função percorre o array de caracteres posição por posição, incrementando `contador`, até encontrar
o caractere nulo `'\0'` que marca o fim da string — nesse ponto, `contador` guarda exatamente o
número de caracteres "úteis" que vieram antes dele. Como o laço, no pior caso, examina cada um dos
`n` caracteres da string exatamente uma vez, essa função tem complexidade `O(n)`.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Arrays e Strings" do meu curso de programação. Contexto: a aula explica por que o
> acesso indexado a arrays é O(1), a diferença de custo entre inserir/remover no início ou no final,
> arrays estáticos vs. dinâmicos, e como strings em C são arrays de char terminados por '\0'. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. Por que acessar `array[i]` é uma operação O(1)?

- [ ] Porque arrays sempre têm no máximo 10 elementos
- [x] Porque o endereço de qualquer posição pode ser calculado diretamente com uma única multiplicação e soma, sem percorrer o array
- [ ] Porque o processador tem uma instrução especial só para arrays
- [ ] Porque arrays são sempre armazenados na stack

> O acesso indexado usa a fórmula `endereço_base + i × tamanho_do_tipo`, um cálculo direto que leva
> sempre o mesmo tempo, independente do tamanho do array ou da posição acessada.

### 2. Qual é a complexidade de inserir um elemento no início de um array, deslocando os demais?

- [ ] O(1)
- [ ] O(log n)
- [x] O(n)
- [ ] O(n²)

> Inserir no início exige deslocar todos os elementos existentes uma posição para a direita, o que
> exige tempo proporcional ao tamanho do array — O(n).

### 3. O que é o caractere `'\0'` em uma string C?

- [ ] O primeiro caractere de qualquer string
- [x] Um caractere especial que marca o fim de uma string, usado por funções como printf e strlen
- [ ] Um caractere usado apenas em strings vazias
- [ ] Um erro de sintaxe comum

> O caractere nulo (`'\0'`) marca onde uma string termina dentro de um array de caracteres. Sem ele,
> funções que processam strings continuariam lendo memória além do conteúdo pretendido.

### 4. Qual é a principal diferença entre um array estático e um array dinâmico em C?

- [ ] Arrays estáticos só podem guardar números, e dinâmicos só texto
- [x] Arrays estáticos têm tamanho fixo definido em tempo de compilação; arrays dinâmicos são alocados no heap e podem ter tamanho definido (e redimensionado) em tempo de execução
- [ ] Não existe diferença real entre os dois
- [ ] Arrays dinâmicos sempre são mais rápidos de acessar

> Arrays estáticos (na stack) têm tamanho fixo desde a declaração. Arrays dinâmicos (no heap, via
> malloc/realloc) podem ter seu tamanho decidido e ajustado durante a execução do programa.

### 5. Por que calcular o tamanho de uma string em C (como faz strlen) é uma operação O(n)?

- [ ] Porque strings em C são sempre muito grandes
- [x] Porque C não guarda o tamanho da string em nenhum lugar; é preciso percorrer o array até encontrar o caractere nulo
- [ ] Porque strlen sempre percorre a string duas vezes
- [ ] Porque strings em C não são arrays de verdade

> Diferente de estruturas que guardam seu próprio tamanho, uma string em C é apenas um array de
> caracteres — descobrir seu comprimento exige percorrê-la, caractere por caractere, até encontrar o
> `'\0'`, uma operação proporcional ao tamanho da string.
