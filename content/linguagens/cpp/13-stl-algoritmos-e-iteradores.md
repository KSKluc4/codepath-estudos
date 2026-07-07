---
numero: 13
titulo: "STL: algoritmos e iteradores"
nivel: "intermediario"
objetivo: "Usar iteradores e algoritmos genéricos da STL como sort e find."
duracao: 12
status: "completo"
---

## Conceito

Um iterador é um objeto que "aponta" para uma posição dentro de um container (`vector`, `map`,
`set`, etc.) e sabe avançar para o próximo elemento — uma abstração comum que permite que
algoritmos da biblioteca `<algorithm>` (como `sort`, `find`, `count`) funcionem de forma genérica
sobre QUALQUER container que suporte iteração, sem precisar reimplementar cada algoritmo para cada
estrutura de dados.

## Sintaxe

```cpp
#include <algorithm>
#include <vector>

vector<int> numeros = {5, 2, 8, 1, 9};

sort(numeros.begin(), numeros.end());               // ordena in place: {1, 2, 5, 8, 9}

auto it = find(numeros.begin(), numeros.end(), 8);    // busca o valor 8
if (it != numeros.end()) {
    cout << "Encontrado" << endl;
}
```

## Exemplos comentados

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> numeros = {5, 2, 8, 1, 9, 3};

    // sort: ordena in place (modifica o próprio vector)
    sort(numeros.begin(), numeros.end());
    for (int n : numeros) cout << n << " "; // 1 2 3 5 8 9
    cout << endl;

    // sort com critério customizado (ordem decrescente)
    sort(numeros.begin(), numeros.end(), greater<int>());
    for (int n : numeros) cout << n << " "; // 9 8 5 3 2 1
    cout << endl;

    // find: retorna um iterador para a PRIMEIRA ocorrência, ou .end() se não achar
    auto it = find(numeros.begin(), numeros.end(), 5);
    if (it != numeros.end()) {
        cout << "Encontrado na posição " << (it - numeros.begin()) << endl;
    }

    // count: conta quantas vezes um valor aparece
    vector<int> repetidos = {1, 2, 2, 3, 2};
    cout << count(repetidos.begin(), repetidos.end(), 2) << endl; // 3

    // max_element / min_element: retornam ITERADORES para o maior/menor valor
    auto maior = max_element(numeros.begin(), numeros.end());
    cout << *maior << endl; // desreferencia o iterador para pegar o valor: 9

    // for_each: aplica uma função (ou lambda) a cada elemento
    for_each(numeros.begin(), numeros.end(), [](int n) {
        cout << n * 2 << " ";
    });
    cout << endl;

    // accumulate (de <numeric>): soma (ou combina) todos os elementos
    // #include <numeric>
    // int soma = accumulate(numeros.begin(), numeros.end(), 0);

    // Manipulando um iterador diretamente
    vector<int> lista = {10, 20, 30};
    for (auto iterador = lista.begin(); iterador != lista.end(); ++iterador) {
        cout << *iterador << " "; // * desreferencia o iterador, como um ponteiro
    }
    cout << endl;

    return 0;
}
```

## Exercício 1: Ordene e busque em um vector

Escreva um programa que ordena `vector<int> valores = {9, 3, 7, 1, 5};` e usa `find` para checar se
o valor `7` está presente, imprimindo `"Encontrado"` ou `"Não encontrado"`.

### Solução

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> valores = {9, 3, 7, 1, 5};

    sort(valores.begin(), valores.end());
    for (int v : valores) cout << v << " "; // 1 3 5 7 9
    cout << endl;

    auto it = find(valores.begin(), valores.end(), 7);
    if (it != valores.end()) {
        cout << "Encontrado" << endl;
    } else {
        cout << "Não encontrado" << endl;
    }

    return 0;
}
```

`find` percorre o intervalo `[begin, end)` comparando cada elemento com o valor procurado,
retornando um iterador para a primeira correspondência — comparar esse iterador com `.end()` é a
forma padrão de checar se a busca teve sucesso, já que `.end()` representa "logo após o último
elemento" (nunca um elemento de verdade).

## Exercício 2: Some os elementos com for_each

Escreva um programa que usa `for_each` (com uma lambda) para somar todos os elementos de
`vector<int> numeros = {1, 2, 3, 4, 5};` em uma variável externa.

### Solução

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> numeros = {1, 2, 3, 4, 5};
    int soma = 0;

    for_each(numeros.begin(), numeros.end(), [&soma](int n) {
        soma += n; // [&soma] captura "soma" por referência, permitindo alterá-la
    });

    cout << soma << endl; // 15
    return 0;
}
```

A lambda `[&soma](int n) { soma += n; }` captura a variável externa `soma` por referência (`&`),
permitindo que cada chamada dentro de `for_each` acumule o total na mesma variável — capturas de
lambda são exploradas com mais detalhe no último capítulo desta trilha.

## Quiz

### 1. O que um iterador representa, de forma geral?

- [ ] Um índice numérico fixo
- [x] Um objeto que "aponta" para uma posição dentro de um container e sabe avançar para a próxima
- [ ] Uma cópia completa do container
- [ ] Um tipo exclusivo de `vector`

> Iteradores são uma abstração que generaliza o conceito de "percorrer" uma coleção, funcionando de
> forma parecida com ponteiros (podem ser desreferenciados com `*` e avançados com `++`), mas
> funcionando igualmente para `vector`, `map`, `set`, `list`, etc., cada um com sua implementação
> interna própria.

### 2. O que `container.end()` representa?

- [ ] Um iterador para o ÚLTIMO elemento válido do container
- [x] Um iterador que representa a posição "logo após" o último elemento, usado como marcador de fim
- [ ] O tamanho do container
- [ ] Sempre gera um erro se usado

> `.end()` NÃO aponta para um elemento real — é um marcador especial que representa "uma posição
> além do fim". Por isso, comparar um iterador retornado por `find` com `.end()` é a forma padrão
> de checar se a busca falhou (chegou ao fim sem encontrar o valor).

### 3. Qual a vantagem de algoritmos genéricos como `sort` e `find` trabalharem com iteradores, em vez de um container específico?

- [ ] Não há vantagem, é apenas uma escolha arbitrária de design
- [x] O mesmo algoritmo funciona com QUALQUER container que suporte iteração, sem precisar reimplementá-lo para cada um
- [ ] Iteradores tornam os algoritmos mais lentos
- [ ] Algoritmos com iteradores só funcionam com números

> Como `sort`, `find`, `count`, etc. operam sobre um par de iteradores (`begin`, `end`) em vez de um
> tipo de container específico, a mesma implementação de `sort` funciona tanto em um `vector`
> quanto em um array C tradicional ou qualquer outro container compatível — um exemplo do poder de
> abstração dos templates da STL.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "STL: algoritmos e iteradores" na trilha de C++ do CodePath. Contexto: o
> capítulo explica iteradores, sort, find, count e for_each. Minha dúvida/meu exercício: [descreva
> aqui exatamente onde travou].
