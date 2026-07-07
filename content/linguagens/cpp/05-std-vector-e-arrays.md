---
numero: 5
titulo: "std::vector e arrays"
nivel: "basico"
objetivo: "Usar std::vector como array dinâmico, mais seguro e flexível que arrays de C."
duracao: 12
status: "completo"
---

## Conceito

`std::vector` é o "array dinâmico" da biblioteca padrão de C++: ele cresce e encolhe
automaticamente (como uma lista Python ou um `Array` de JavaScript), gerencia sua própria memória,
e sabe seu próprio tamanho — resolvendo as principais limitações dos arrays de tamanho fixo de C.
Arrays estilo C (`int arr[5]`) continuam existindo em C++, mas `vector` é a escolha padrão para a
maioria dos casos.

## Sintaxe

```cpp
#include <vector>

vector<int> numeros = {1, 2, 3};
numeros.push_back(4);       // adiciona ao final: {1, 2, 3, 4}
numeros[0];                    // 1 — acesso por índice, igual a um array
numeros.size();                // 4 — tamanho atual
```

## Exemplos comentados

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> notas = {8, 7, 9};

    notas.push_back(10);        // {8, 7, 9, 10}
    notas.pop_back();            // remove o último: {8, 7, 9}

    cout << notas.size() << endl;   // 3
    cout << notas[0] << endl;        // 8
    cout << notas.front() << endl;    // 8 — primeiro elemento
    cout << notas.back() << endl;      // 9 — último elemento

    // Percorrer com índice tradicional
    for (int i = 0; i < notas.size(); i++) {
        cout << notas[i] << " ";
    }
    cout << endl;

    // Range-based for: forma mais idiomática de percorrer em C++ moderno
    for (int nota : notas) {
        cout << nota << " ";
    }
    cout << endl;

    // Vector vazio, cresce sob demanda
    vector<string> nomes;
    nomes.push_back("Ana");
    nomes.push_back("Bia");

    // .empty() checa se está vazio, mais legível que size() == 0
    if (nomes.empty()) {
        cout << "Vazio" << endl;
    }

    // insert/erase para inserir/remover em posições específicas (mais custoso que push/pop_back)
    notas.insert(notas.begin() + 1, 100); // insere 100 na posição 1
    notas.erase(notas.begin());            // remove o primeiro elemento

    // Vector de vectors, equivalente a uma matriz dinâmica
    vector<vector<int>> matriz = {{1, 2}, {3, 4}};
    cout << matriz[1][0] << endl; // 3

    // .clear() remove todos os elementos, mantendo o vector (vazio, mas existente)
    notas.clear();

    return 0;
}
```

## Exercício 1: Some os elementos de um vector

Escreva uma função `int somar(vector<int> numeros)` que retorna a soma de todos os elementos de
um vector.

### Solução

```cpp
#include <iostream>
#include <vector>
using namespace std;

int somar(vector<int> numeros) {
    int total = 0;
    for (int n : numeros) {
        total += n;
    }
    return total;
}

int main() {
    vector<int> valores = {4, 8, 15, 16, 23, 42};
    cout << somar(valores) << endl; // 108
    return 0;
}
```

O range-based for (`for (int n : numeros)`) percorre cada elemento diretamente, sem precisar
controlar um índice manualmente — mais limpo do que o equivalente `for (int i = 0; i <
numeros.size(); i++)`, embora ambos funcionem igualmente bem.

## Exercício 2: Filtre elementos em um novo vector

Escreva uma função `vector<int> filtrarPares(vector<int> numeros)` que retorna um novo vector
contendo apenas os elementos pares de `numeros`.

### Solução

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> filtrarPares(vector<int> numeros) {
    vector<int> pares;
    for (int n : numeros) {
        if (n % 2 == 0) {
            pares.push_back(n);
        }
    }
    return pares;
}

int main() {
    vector<int> numeros = {4, 7, 10, 13, 18, 21, 24};
    vector<int> resultado = filtrarPares(numeros);

    for (int n : resultado) {
        cout << n << " "; // 4 10 18 24
    }
    cout << endl;

    return 0;
}
```

A estratégia é a mesma de um array de C ou uma lista Python: começa com um vector vazio (`pares`)
e usa `push_back` para adicionar cada elemento que satisfaz a condição, sem precisar se preocupar
com o tamanho final — o vector cresce sozinho conforme necessário.

## Quiz

### 1. Qual a principal vantagem de `std::vector` sobre um array C tradicional (`int arr[5]`)?

- [ ] `vector` é sempre mais rápido para acessar um elemento por índice
- [x] `vector` cresce e encolhe dinamicamente, gerenciando sua própria memória e sabendo seu próprio tamanho
- [ ] Arrays C não podem mais ser usados em C++
- [ ] `vector` só funciona com números

> Arrays C têm tamanho fixo, decidido em tempo de compilação, e não sabem seu próprio tamanho em
> tempo de execução (é preciso guardar isso separadamente, como visto na trilha de C).
> `std::vector` resolve ambos os problemas, se comportando de forma parecida com uma lista Python
> ou um array JavaScript.

### 2. O que `vector.push_back(valor)` faz?

- [ ] Substitui o primeiro elemento do vector
- [x] Adiciona `valor` ao final do vector, crescendo-o automaticamente se necessário
- [ ] Remove o último elemento
- [ ] Só funciona em vectors vazios

> `push_back` é o método padrão para adicionar um novo elemento ao final de um `vector` — se o
> espaço interno alocado não for suficiente, o vector realoca automaticamente um bloco maior de
> memória, copiando os elementos existentes, sem exigir nenhuma ação manual do programador.

### 3. O que um "range-based for" como `for (int n : numeros)` faz?

- [ ] Só funciona com arrays de tamanho fixo, não com `vector`
- [x] Percorre cada elemento da coleção diretamente, sem precisar controlar um índice manualmente
- [ ] Modifica os elementos originais automaticamente
- [ ] É equivalente a um `while`, não a um `for`

> O range-based for (introduzido no C++11) percorre diretamente os elementos de qualquer coleção
> que suporte iteração (vectors, arrays, strings, etc.), atribuindo cada valor à variável `n` a
> cada iteração — mais legível que controlar um índice manualmente, especialmente quando o índice
> em si não é necessário.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "std::vector e arrays" na trilha de C++ do CodePath. Contexto: o capítulo explica
> vector, push_back/pop_back, e o range-based for. Minha dúvida/meu exercício: [descreva aqui
> exatamente onde travou].
