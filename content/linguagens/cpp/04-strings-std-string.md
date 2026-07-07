---
numero: 4
titulo: "Strings (std::string)"
nivel: "basico"
objetivo: "Manipular texto com std::string, mais seguro que arrays de char de C."
duracao: 10
status: "completo"
---

## Conceito

`std::string` é o tipo de string da biblioteca padrão de C++, muito mais seguro e conveniente que
arrays de `char` terminados em `'\0'` de C: ela gerencia seu próprio tamanho e memória
automaticamente, cresce dinamicamente, e suporta operadores comuns como `+` para concatenação e
`==` para comparação de conteúdo (algo que exigia `strcat`/`strcmp` em C).

## Sintaxe

```cpp
#include <string>

string nome = "Ana";
string sobrenome = "Silva";
string completo = nome + " " + sobrenome;  // "Ana Silva" — + concatena de verdade

completo.length();          // 9 — tamanho da string
completo == "Ana Silva";    // true — == compara CONTEÚDO, não endereço
```

## Exemplos comentados

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string frase = "Programação em C++";

    cout << frase.length() << endl;   // 19 — tamanho (também: frase.size())
    cout << frase.substr(0, 12) << endl; // "Programação" — substring(início, tamanho)

    frase += " é divertida"; // += concatena, cresce a string automaticamente
    cout << frase << endl;

    // == compara conteúdo diretamente, diferente de strings em C
    string a = "teste";
    string b = "teste";
    if (a == b) {
        cout << "São iguais" << endl;
    }

    // find retorna a posição da primeira ocorrência (ou string::npos se não encontrar)
    size_t posicao = frase.find("C++");
    if (posicao != string::npos) {
        cout << "Encontrado na posição " << posicao << endl;
    }

    // Percorrer caractere por caractere (assim como um array)
    string palavra = "abc";
    for (char c : palavra) { // range-based for, visto com mais detalhe em loops de C++
        cout << c << " ";
    }
    cout << endl;

    // Conversões entre string e número
    string numeroTexto = "42";
    int numero = stoi(numeroTexto);      // string to int
    string deVolta = to_string(numero);   // int to string

    // Comparação com strings estilo C ainda funciona, mas não é o padrão recomendado
    // char nomeC[] = "Ana"; // evite em código C++ moderno, prefira std::string

    return 0;
}
```

## Exercício 1: Verifique um palíndromo

Escreva uma função `bool ehPalindromo(string texto)` que retorna `true` se `texto` é igual ao seu
próprio reverso (use a função `reverse` de `<algorithm>` sobre uma cópia).

### Solução

```cpp
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

bool ehPalindromo(string texto) {
    string invertido = texto;
    reverse(invertido.begin(), invertido.end());
    return texto == invertido;
}

int main() {
    cout << ehPalindromo("arara") << endl;  // 1 (true)
    cout << ehPalindromo("banana") << endl;  // 0 (false)
    return 0;
}
```

`reverse(inicio, fim)` (da biblioteca `<algorithm>`) inverte um intervalo in place — por isso a
função primeiro copia `texto` para `invertido`, para não alterar o parâmetro original, e então
compara os dois com `==`, que já funciona corretamente por conteúdo em `std::string`.

## Exercício 2: Conte ocorrências de uma substring

Escreva uma função `int contarOcorrencias(string texto, string alvo)` que conta quantas vezes
`alvo` aparece dentro de `texto`, usando `.find()` em um loop.

### Solução

```cpp
#include <iostream>
#include <string>
using namespace std;

int contarOcorrencias(string texto, string alvo) {
    int contador = 0;
    size_t posicao = texto.find(alvo);

    while (posicao != string::npos) {
        contador++;
        posicao = texto.find(alvo, posicao + 1); // busca a partir da próxima posição
    }

    return contador;
}

int main() {
    cout << contarOcorrencias("banana", "an") << endl; // 2
    return 0;
}
```

`texto.find(alvo, posicaoInicial)` aceita um segundo argumento opcional indicando de onde começar
a busca — usado aqui para continuar procurando depois de cada ocorrência encontrada, evitando um
loop infinito e permitindo contar ocorrências sobrepostas corretamente.

## Quiz

### 1. Qual a principal vantagem de `std::string` sobre arrays de `char` de C?

- [ ] `std::string` é mais rápida em todos os casos
- [x] `std::string` gerencia memória e tamanho automaticamente, crescendo dinamicamente e evitando erros manuais de buffer
- [ ] Arrays de char não podem mais ser usados em C++
- [ ] `std::string` só funciona com texto em inglês

> Diferente de arrays de `char`, que exigem gerenciamento manual de tamanho e terminador `'\0'`,
> `std::string` cresce e encolhe automaticamente conforme necessário, eliminando uma classe inteira
> de bugs comuns em C (buffer overflow, esquecer o terminador nulo, etc.).

### 2. O que `a == b` faz quando `a` e `b` são `std::string`?

- [ ] Compara os endereços de memória de `a` e `b`
- [x] Compara o CONTEÚDO das duas strings, retornando `true` se forem textualmente iguais
- [ ] Sempre retorna `false`
- [ ] Só funciona se as strings tiverem o mesmo tamanho declarado

> Diferente de arrays de `char` em C (onde `==` compararia ponteiros), `std::string` sobrecarrega o
> operador `==` para comparar o conteúdo textual das duas strings diretamente — não é necessário
> nenhuma função equivalente a `strcmp`.

### 3. O que `string::npos` representa?

- [ ] A posição inicial de qualquer string
- [x] Um valor especial retornado por `.find()` quando a substring procurada NÃO é encontrada
- [ ] O tamanho máximo permitido para uma string
- [ ] Um erro de compilação

> `.find()` retorna a posição (índice) da primeira ocorrência encontrada, ou o valor especial
> `string::npos` se a substring não existir no texto — por isso é comum checar
> `if (posicao != string::npos)` antes de usar o resultado de uma busca.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Strings (std::string)" na trilha de C++ do CodePath. Contexto: o capítulo
> explica std::string, concatenação, find/substr e comparação de conteúdo. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
