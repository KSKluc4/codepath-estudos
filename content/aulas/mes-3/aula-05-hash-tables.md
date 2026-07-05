---
id: "m3-a5"
mes: 3
numero: 5
titulo: "Hash Tables"
objetivo: "Entender como hash tables alcançam busca em tempo O(1) e como colisões são tratadas."
duracao: 30
status: "completo"
---

## O(1), mas por nome, não por número

Vimos na Aula 2 que um array tem acesso `O(1)` — mas só se você souber o **índice numérico** exato
que quer acessar. Isso é ótimo quando você já sabe que quer "a posição 5", mas e se você quiser
buscar algo por **nome**, como `"maçã"` em um mapa de preços de frutas, ou `"joão@email.com"` em uma
lista de usuários? Percorrer tudo (`O(n)`) até encontrar seria muito mais lento do que gostaríamos.

A **hash table** (tabela hash, ou mapa/dicionário) resolve exatamente esse problema: ela permite
buscar, inserir e remover valores por uma **chave** qualquer (não necessariamente um número), em
tempo médio `O(1)` — combinando a ideia de acesso indexado de array com uma função matemática que
transforma qualquer chave em um índice.

## A função de hash: transformando qualquer coisa em um número

Uma **função de hash** recebe uma chave (por exemplo, uma string) e devolve um número — um índice —
de forma **determinística** (a mesma chave sempre produz o mesmo número) e, idealmente, bem
distribuída (chaves diferentes tendem a produzir números diferentes, espalhados uniformemente).

Pense em um sistema de escaninhos de correio: em vez de organizar as cartas em ordem alfabética
percorrendo tudo a cada busca (`O(n)`), um funcionário aplica uma fórmula rápida ao nome do
destinatário (por exemplo, baseada nas letras do nome) para calcular diretamente **qual escaninho**
verificar — sem precisar olhar os outros.

Uma função de hash simples, só para entender o princípio (funções de hash usadas na prática, como
SHA-256, são bem mais sofisticadas):

```c
int funcao_hash(char *chave, int tamanho_tabela) {
    int soma = 0;
    for (int i = 0; chave[i] != '\0'; i++) {
        soma += chave[i]; // soma o valor ASCII de cada caractere
    }
    return soma % tamanho_tabela; // garante que o índice caiba na tabela
}
```

Essa função soma o valor numérico (ASCII, retomando a Aula 2 do mês 1) de cada caractere da string, e
usa o resto da divisão (`%`) pelo tamanho da tabela para garantir que o resultado sempre caiba dentro
dos índices válidos do array.

## Colisões: quando duas chaves querem a mesma gaveta

Como o número de chaves possíveis (praticamente infinito — qualquer string) é muito maior que o
número de posições da tabela (um número finito e fixo), é **matematicamente inevitável** que, em
algum momento, duas chaves diferentes produzam o mesmo índice. Isso se chama **colisão**.

Por exemplo, com uma tabela de tamanho 10, tanto `"ab"` (`97 + 98 = 195`, `195 % 10 = 5`) quanto uma
outra string cuja soma também termine em 5 vão colidir na mesma posição. Uma boa hash table precisa
de uma estratégia para lidar com isso sem perder dados.

## Resolvendo colisões com encadeamento (chaining)

A estratégia mais comum — e a que se conecta diretamente com o que você aprendeu na Aula 3 — é o
**encadeamento** (*chaining*): em vez de guardar um único valor em cada posição da tabela, cada
posição guarda a **cabeça de uma lista ligada**. Se duas chaves colidem no mesmo índice, o novo item
simplesmente é adicionado à lista ligada daquela posição, em vez de sobrescrever o que já estava lá.

```c
struct Entrada {
    char *chave;
    int valor;
    struct Entrada *proximo; // encadeamento para tratar colisões
};

struct Entrada* tabela[10]; // cada posição é a cabeça de uma lista ligada (ou NULL)

void inserir(char *chave, int valor) {
    int indice = funcao_hash(chave, 10);

    struct Entrada *nova = malloc(sizeof(struct Entrada));
    nova->chave = chave;
    nova->valor = valor;
    nova->proximo = tabela[indice]; // encadeia com o que já existia ali (ou NULL)

    tabela[indice] = nova;
}
```

```text
Índice 5:  ["ab", 10] -> ["xy", 42] -> NULL   (colisão: ambas as chaves foram para o índice 5)
Índice 7:  ["ola", 99] -> NULL
```

Para **buscar** uma chave, calculamos seu índice com a mesma função de hash, e então percorremos a
pequena lista ligada naquela posição (geralmente muito curta) até encontrar a chave exata:

```c
int buscar(char *chave) {
    int indice = funcao_hash(chave, 10);
    struct Entrada *atual = tabela[indice];

    while (atual != NULL) {
        if (strcmp(atual->chave, chave) == 0) {
            return atual->valor;
        }
        atual = atual->proximo;
    }

    return -1; // não encontrado
}
```

## Por que isso ainda é (em média) O(1)

Se a função de hash distribui bem as chaves, e a tabela não está sobrecarregada (uma proporção
chamada *fator de carga*: número de elementos dividido pelo tamanho da tabela), cada posição da
tabela acaba com **pouquíssimos** elementos encadeados — geralmente 0 ou 1. Buscar, inserir e remover
se tornam, na prática, `O(1)` **em média**: um cálculo de hash (rápido) mais percorrer uma lista
curtíssima.

O pior caso teórico ainda é `O(n)`: se a função de hash for muito ruim (por exemplo, sempre
devolvendo o mesmo índice para tudo), todas as chaves colidiriam na mesma lista ligada, degradando a
hash table inteira para o equivalente a uma única lista ligada gigante. É exatamente por isso que
projetar boas funções de hash — que distribuam bem as chaves — é tão importante na prática.

## Hash tables no seu dia a dia como programador

Você provavelmente já usou hash tables sem perceber: o `dicionário` do Python (`dict`), os `objetos`
do JavaScript (`{ chave: valor }`), e o `HashMap` do Java são, por trás dos panos, implementações de
hash table exatamente como a que construímos aqui — só que muito mais otimizadas e testadas.

## Exercício 1: Calcule os hashes

Usando a função de hash da aula (soma dos valores ASCII, módulo o tamanho da tabela), e sabendo que
`'a' = 97`, `'b' = 98`, `'c' = 99`, calcule o índice, em uma tabela de tamanho 10, para as chaves:
(a) `"a"`, (b) `"b"`, (c) `"ab"`.

### Solução

- **(a) `"a"`**: soma `= 97`. `97 % 10 = 7`.
- **(b) `"b"`**: soma `= 98`. `98 % 10 = 8`.
- **(c) `"ab"`**: soma `= 97 + 98 = 195`. `195 % 10 = 5`.

Nenhuma colisão acontece entre essas três chaves específicas (índices 7, 8 e 5, todos diferentes) —
mas isso é apenas sorte de exemplo. Chaves diferentes (por exemplo, uma string cuja soma ASCII também
resulte em `195` ou qualquer outro número terminado da mesma forma após o módulo) colidiriam
facilmente, o que reforça por que a estratégia de encadeamento é necessária.

## Exercício 2: Trace a colisão

Considerando uma tabela de tamanho 5, e que as chaves `"xy"` e `"ab"` produzem, ambas, o índice `2`
(uma colisão proposital para este exercício), descreva o estado da lista ligada no índice 2 depois
de inserir, nessa ordem: `inserir("xy", 100)`, `inserir("ab", 200)`.

### Solução

```text
Após inserir("xy", 100):
Índice 2:  ["xy", 100] -> NULL

Após inserir("ab", 200):
Índice 2:  ["ab", 200] -> ["xy", 100] -> NULL
```

Como a função `inserir` da aula sempre encadeia o novo item **na frente** da lista existente
(`nova->proximo = tabela[indice]`, e depois `tabela[indice] = nova`), a entrada mais recentemente
inserida (`"ab"`) aparece no início da lista, e a mais antiga (`"xy"`) vem em seguida — exatamente o
mesmo padrão de inserção no início que vimos na Aula 3.

## Exercício 3: O que acontece com uma função de hash ruim?

Explique o que aconteceria com o desempenho de uma hash table se a função de hash usada fosse,
simplesmente, `return 0;` para qualquer chave (ou seja, sempre devolvendo o mesmo índice).

### Solução

Se toda chave produzisse o mesmo índice (`0`), todas as inserções cairiam na **mesma** lista ligada,
no índice `0` — e nenhuma outra posição da tabela seria usada. Nesse cenário, a hash table inteira se
comportaria, na prática, como uma única lista ligada gigante: buscar uma chave exigiria percorrer,
no pior caso, **todos** os elementos já inseridos, uma operação `O(n)`, em vez do `O(1)` médio
esperado de uma hash table bem projetada.

Esse exemplo extremo ilustra por que a qualidade da função de hash é tão importante: ela é
justamente o que garante que os elementos fiquem bem distribuídos entre as posições da tabela,
mantendo cada lista encadeada curta.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Hash Tables" do meu curso de programação. Contexto: a aula explica como uma
> função de hash transforma uma chave em um índice, como colisões são tratadas com encadeamento
> (chaining, usando listas ligadas), e por que a busca é O(1) em média. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].

## Quiz

### 1. O que uma função de hash faz?

- [ ] Ordena uma lista de valores
- [x] Transforma uma chave (como uma string) em um número/índice, de forma determinística
- [ ] Remove duplicatas de um array
- [ ] Comprime um arquivo para ocupar menos espaço

> Uma função de hash recebe uma chave e devolve um número (índice), sempre o mesmo número para a
> mesma chave, idealmente distribuindo bem chaves diferentes entre índices diferentes.

### 2. O que é uma "colisão" em uma hash table?

- [ ] Um erro de compilação ao declarar a tabela
- [x] Quando duas chaves diferentes produzem o mesmo índice pela função de hash
- [ ] Quando a tabela fica sem memória disponível
- [ ] Quando duas threads tentam acessar a tabela ao mesmo tempo

> Uma colisão ocorre quando chaves diferentes são mapeadas, pela função de hash, para o mesmo
> índice — algo matematicamente inevitável, já que há infinitas chaves possíveis e um número finito
> de posições na tabela.

### 3. Como o encadeamento (chaining) resolve colisões?

- [ ] Ignorando a segunda chave que colidiu
- [x] Guardando uma lista ligada de entradas em cada posição da tabela, permitindo múltiplos itens no mesmo índice
- [ ] Aumentando automaticamente o tamanho da tabela a cada colisão
- [ ] Convertendo a chave em um número diferente

> Com encadeamento, cada posição da tabela guarda a cabeça de uma lista ligada. Quando ocorre uma
> colisão, o novo item é simplesmente adicionado a essa lista, sem sobrescrever os itens existentes.

### 4. Por que hash tables oferecem busca O(1) em média, mesmo com colisões?

- [ ] Porque colisões nunca acontecem na prática
- [x] Porque, com uma boa função de hash e uma tabela não sobrecarregada, cada lista encadeada tende a ficar muito curta
- [ ] Porque hash tables não usam memória de verdade
- [ ] Porque hash tables são sempre ordenadas

> Com uma boa distribuição de chaves e um fator de carga razoável, cada posição da tabela acumula
> pouquíssimos elementos, tornando a busca dentro de cada lista encadeada praticamente instantânea.

### 5. Qual estrutura de dados do dia a dia de um programador é, por trás dos panos, geralmente implementada como uma hash table?

- [ ] Um array de tamanho fixo
- [x] Um dicionário (dict) do Python ou um objeto ({chave: valor}) do JavaScript
- [ ] Uma pilha (stack)
- [ ] Uma fila (queue)

> Dicionários do Python e objetos do JavaScript são, internamente, implementações de hash table,
> permitindo busca, inserção e remoção por chave em tempo médio O(1).
