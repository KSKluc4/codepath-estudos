---
numero: 12
titulo: "STL: containers (map, set, list)"
nivel: "intermediario"
objetivo: "Conhecer os containers mais usados da STL além do vector."
duracao: 15
status: "completo"
---

## Conceito

A STL (Standard Template Library) oferece diversos containers além de `vector`, cada um otimizado
para um padrão de uso diferente: `map` (pares chave-valor, como um dicionário Python), `set`
(valores únicos, como um set Python), e `list` (lista duplamente ligada, eficiente para inserção/
remoção no meio). Escolher o container certo para cada situação é uma habilidade central em C++
idiomático.

## Sintaxe

```cpp
#include <map>
#include <set>
#include <list>

map<string, int> idades = {{"Ana", 28}, {"Bia", 25}};
idades["Carlos"] = 30;      // adiciona ou atualiza uma chave

set<int> numeros = {3, 1, 2, 1};  // {1, 2, 3} — duplicatas removidas automaticamente

list<int> fila = {1, 2, 3};
fila.push_front(0);          // insere no início, O(1) — mais rápido que vector nesse caso
```

## Exemplos comentados

```cpp
#include <iostream>
#include <map>
#include <set>
#include <list>
using namespace std;

int main() {
    // map: pares chave-valor, ordenados automaticamente pela chave
    map<string, int> idades;
    idades["Ana"] = 28;
    idades["Bia"] = 25;
    idades["Carlos"] = 30;

    cout << idades["Ana"] << endl; // 28

    // Percorrer um map: cada item é um par (first = chave, second = valor)
    for (auto &par : idades) {
        cout << par.first << ": " << par.second << endl;
    }

    // Checar se uma chave existe, sem criá-la acidentalmente com []
    if (idades.find("Duda") == idades.end()) {
        cout << "Duda não encontrada" << endl;
    }

    // set: valores únicos, ordenados automaticamente
    set<int> unicos = {5, 3, 5, 1, 3, 2};
    for (int n : unicos) {
        cout << n << " "; // 1 2 3 5 — ordenados, sem duplicatas
    }
    cout << endl;

    unicos.insert(10);
    unicos.erase(1);
    cout << unicos.count(3) << endl; // 1 (existe) ou 0 (não existe)

    // list: lista duplamente ligada — ótima para inserir/remover no MEIO com frequência
    list<int> tarefas = {2, 3, 4};
    tarefas.push_front(1);  // {1, 2, 3, 4}
    tarefas.push_back(5);    // {1, 2, 3, 4, 5}

    for (int t : tarefas) {
        cout << t << " ";
    }
    cout << endl;

    return 0;
}
```

## Exercício 1: Conte a frequência de palavras com map

Escreva um programa que, dado `vector<string> palavras = {"c++", "python", "c++", "java",
"c++"};`, usa um `map<string, int>` para contar quantas vezes cada palavra aparece.

### Solução

```cpp
#include <iostream>
#include <map>
#include <vector>
#include <string>
using namespace std;

int main() {
    vector<string> palavras = {"c++", "python", "c++", "java", "c++"};
    map<string, int> frequencia;

    for (string &palavra : palavras) {
        frequencia[palavra]++; // se a chave não existir, é criada com valor 0 e já incrementada
    }

    for (auto &par : frequencia) {
        cout << par.first << ": " << par.second << endl;
    }
    // c++: 3
    // java: 1
    // python: 1

    return 0;
}
```

`frequencia[palavra]++` funciona porque `operator[]` de `map` cria automaticamente a chave com um
valor padrão (`0` para `int`) se ela ainda não existir — o `++` logo em seguida incrementa esse
valor recém-criado (ou já existente) em uma única expressão.

## Exercício 2: Remova duplicatas com set

Escreva uma função `vector<int> removerDuplicatas(vector<int> numeros)` que retorna um novo vector
sem valores repetidos, usando um `set<int>` como estrutura intermediária.

### Solução

```cpp
#include <iostream>
#include <vector>
#include <set>
using namespace std;

vector<int> removerDuplicatas(vector<int> numeros) {
    set<int> unicos(numeros.begin(), numeros.end()); // constrói um set a partir do vector
    vector<int> resultado(unicos.begin(), unicos.end()); // e converte de volta para vector
    return resultado;
}

int main() {
    vector<int> numeros = {4, 2, 4, 1, 3, 2, 5};
    vector<int> resultado = removerDuplicatas(numeros);

    for (int n : resultado) {
        cout << n << " "; // 1 2 3 4 5 — sem duplicatas, e ordenados (efeito colateral do set)
    }
    cout << endl;

    return 0;
}
```

Construir um `set` diretamente a partir de um intervalo (`numeros.begin(), numeros.end()`)
descarta automaticamente qualquer duplicata. Como efeito colateral, o resultado também sai
ordenado, já que `set` mantém seus elementos sempre em ordem — se a ordem original precisasse ser
preservada, outra estratégia (como percorrer manualmente checando com `find`) seria necessária.

## Quiz

### 1. Qual a principal característica de um `std::map`?

- [ ] Armazena valores em ordem de inserção, sem chaves
- [x] Armazena pares chave-valor, mantendo as chaves ordenadas automaticamente
- [ ] Só pode armazenar números
- [ ] Não permite acessar valores por chave, apenas por índice

> `map` é o equivalente C++ a um dicionário Python, guardando pares chave-valor. Diferente de um
> `unordered_map` (outro container da STL, com performance diferente), um `map` comum mantém as
> chaves sempre ordenadas internamente.

### 2. Por que `set<int> unicos = {5, 3, 5, 1, 3, 2};` resulta em `{1, 2, 3, 5}`?

- [ ] `set` sempre limita o tamanho a 4 elementos
- [x] `set` armazena apenas valores únicos (duplicatas são automaticamente descartadas) e os mantém ordenados
- [ ] É um erro de compilação
- [ ] `set` embaralha os valores aleatoriamente

> `set` garante que cada valor apareça no máximo uma vez — inserir um valor já existente
> simplesmente não tem efeito. Além disso, um `set` padrão mantém seus elementos em ordem
> crescente automaticamente, por isso o resultado sai ordenado mesmo sem pedir explicitamente.

### 3. Quando `std::list` costuma ser preferível a `std::vector`?

- [ ] Sempre, `list` é geneticamente mais rápida em todos os casos
- [x] Quando há muitas inserções/remoções no MEIO da coleção, já que list não precisa deslocar elementos
- [ ] Quando é preciso acessar elementos por índice frequentemente
- [ ] `list` nunca deveria ser usada, é um container obsoleto

> `vector` armazena elementos contiguamente na memória, o que torna inserir/remover no meio custoso
> (precisa deslocar todos os elementos seguintes). `list` é uma lista duplamente ligada, onde
> inserir/remover em qualquer posição (já tendo um iterador para lá) é rápido — mas em compensação,
> `list` não permite acesso direto por índice como `vector[i]`.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "STL: containers (map, set, list)" na trilha de C++ do CodePath. Contexto: o
> capítulo explica map, set e list, e quando cada um é mais apropriado. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
