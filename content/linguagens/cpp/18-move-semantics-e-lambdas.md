---
numero: 18
titulo: "Move semantics e lambdas"
nivel: "avancado"
objetivo: "Evitar cópias desnecessárias com move semantics e escrever funções anônimas com lambdas."
duracao: 15
status: "completo"
---

## Conceito

Move semantics (introduzida no C++11) permite **transferir** os recursos internos de um objeto
para outro, em vez de copiá-los — essencial para performance quando se trabalha com objetos que
guardam dados grandes (como um `vector` com milhões de elementos). Lambdas são funções anônimas,
declaradas inline, que podem capturar variáveis do escopo ao redor — muito usadas com algoritmos
da STL, como visto em `for_each` e `sort`.

## Sintaxe

```cpp
vector<int> origem = {1, 2, 3, 4, 5};
vector<int> destino = move(origem);  // TRANSFERE o conteúdo, sem copiar; origem fica vazio

// Lambda: [capturas](parametros) { corpo }
auto somar = [](int a, int b) { return a + b; };
somar(2, 3); // 5
```

## Exemplos comentados

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    // move: transfere a "posse" dos dados internos, sem copiar
    vector<int> origem = {1, 2, 3, 4, 5};
    vector<int> destino = move(origem);

    cout << destino.size() << endl; // 5
    cout << origem.size() << endl;   // 0 — origem foi "esvaziado" pelo move

    // Sem move, essa mesma linha COPIARIA todos os elementos:
    // vector<int> copia = origem; // origem continuaria com 5 elementos

    // Lambdas: funções anônimas, criadas no local onde são usadas
    auto quadrado = [](int n) { return n * n; };
    cout << quadrado(5) << endl; // 25

    // Capturas: [valor] copia a variável externa; [&valor] captura por referência
    int fator = 3;
    auto multiplicar = [fator](int n) { return n * fator; }; // captura fator POR VALOR (cópia)
    cout << multiplicar(10) << endl; // 30

    int contador = 0;
    auto incrementar = [&contador]() { contador++; }; // captura POR REFERÊNCIA
    incrementar();
    incrementar();
    cout << contador << endl; // 2 — a lambda alterou a variável externa de verdade

    // [=] captura TUDO do escopo por valor; [&] captura TUDO por referência
    int a = 1, b = 2;
    auto somarAB = [=]() { return a + b; }; // captura a e b por valor

    // Lambdas são muito usadas como argumento de algoritmos da STL
    vector<int> numeros = {5, 2, 8, 1, 9};
    sort(numeros.begin(), numeros.end(), [](int x, int y) {
        return x > y; // critério de ordenação customizado: decrescente
    });
    for (int n : numeros) cout << n << " "; // 9 8 5 2 1
    cout << endl;

    return 0;
}
```

## Exercício 1: Use move para transferir um vector

Escreva uma função `vector<int> processarEDevolver(vector<int> dados)` que adiciona o valor `0` ao
final de `dados` e o retorna usando `move`, evitando uma cópia desnecessária.

### Solução

```cpp
#include <iostream>
#include <vector>
using namespace std;

vector<int> processarEDevolver(vector<int> dados) {
    dados.push_back(0);
    return dados; // o compilador já otimiza isso automaticamente (RVO/move implícito)
}

int main() {
    vector<int> original = {1, 2, 3};
    vector<int> resultado = move(processarEDevolver(move(original)));

    for (int n : resultado) cout << n << " "; // 1 2 3 0
    cout << endl;
    cout << original.size() << endl; // 0 — foi movido para dentro da função

    return 0;
}
```

`move(original)` transfere o conteúdo de `original` diretamente para o parâmetro `dados` da
função, sem copiar os elementos. Ao retornar `dados`, o compilador moderno já aplica otimizações
automáticas (RVO — Return Value Optimization) para evitar cópia também nesse retorno, na maioria
dos casos.

## Exercício 2: Filtre um vector com lambda e algoritmo

Escreva um programa que usa `copy_if` (de `<algorithm>`) com uma lambda para copiar apenas os
números pares de `vector<int> numeros = {1, 2, 3, 4, 5, 6};` para um novo vector.

### Solução

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> numeros = {1, 2, 3, 4, 5, 6};
    vector<int> pares;

    copy_if(numeros.begin(), numeros.end(), back_inserter(pares), [](int n) {
        return n % 2 == 0;
    });

    for (int n : pares) cout << n << " "; // 2 4 6
    cout << endl;

    return 0;
}
```

A lambda `[](int n) { return n % 2 == 0; }` é passada diretamente como critério de filtro para
`copy_if`, sem precisar declarar uma função nomeada separada só para esse uso pontual —
`back_inserter(pares)` é um iterador especial que chama `push_back` automaticamente para cada
elemento copiado, permitindo que `pares` cresça dinamicamente durante a cópia.

## Quiz

### 1. O que `move(origem)` faz a um `vector` (ou outro objeto que suporte move semantics)?

- [ ] Cria uma cópia completa e independente do vector original
- [x] Transfere os dados internos do vector para o destino, deixando o original "esvaziado" (em um estado válido, mas não especificado)
- [ ] Remove o vector da memória imediatamente
- [ ] Só funciona com tipos primitivos, não com `vector`

> `move` sinaliza ao compilador que o objeto original não será mais usado com seu valor atual,
> permitindo que os recursos internos (como o ponteiro para o array de dados do `vector`) sejam
> simplesmente "roubados" para o novo objeto, em vez de copiados byte a byte — muito mais rápido
> para estruturas grandes.

### 2. O que `[fator]` e `[&fator]` significam nas capturas de uma lambda?

- [ ] São sinônimos, não há diferença
- [x] `[fator]` captura uma CÓPIA da variável no momento da criação da lambda; `[&fator]` captura uma REFERÊNCIA, refletindo mudanças futuras
- [ ] `[&fator]` só funciona com números
- [ ] `[fator]` só pode ser usado uma vez

> Captura por valor (`[fator]`) congela o valor da variável no exato momento em que a lambda é
> criada — alterações posteriores à variável externa não afetam a cópia guardada na lambda.
> Captura por referência (`[&fator]`) mantém uma ligação direta com a variável original,
> refletindo (e podendo alterar) seu valor real.

### 3. Por que lambdas são frequentemente usadas como argumento de algoritmos da STL, como `sort` ou `copy_if`?

- [ ] Porque algoritmos da STL só aceitam lambdas, nunca funções nomeadas
- [x] Permitem definir um critério customizado (comparação, filtro) inline, no exato local de uso, sem precisar declarar uma função separada
- [ ] Lambdas tornam os algoritmos mais lentos
- [ ] Só funcionam dentro de um `for`

> Para um critério usado uma única vez (como um comparador customizado de `sort`), declarar uma
> função nomeada separada adicionaria distância entre a definição e o uso. Lambdas permitem
> escrever esse critério diretamente na chamada do algoritmo, deixando o código mais coeso e fácil
> de ler no contexto onde é usado.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Move semantics e lambdas" na trilha de C++ do CodePath. Contexto: o capítulo
> explica std::move, capturas de lambda por valor/referência, e o uso de lambdas com algoritmos da
> STL. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
