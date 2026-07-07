---
numero: 1
titulo: "Do C ao C++: o que muda"
nivel: "basico"
objetivo: "Entender as principais diferenças de C++ sobre C: iostream, namespaces e compilação."
duracao: 12
status: "completo"
---

## Conceito

C++ nasceu como "C com classes": ele mantém quase tudo de C (tipos, ponteiros, structs, funções)
e adiciona orientação a objetos, templates e uma biblioteca padrão muito mais rica (a STL). Para
quem já sabe C, a curva de entrada é sobre aprender os recursos **novos** — a sintaxe básica de
variáveis, condicionais e loops é praticamente idêntica.

## Sintaxe

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Olá, mundo!" << endl;
    return 0;
}
```

```bash
g++ programa.cpp -o programa   # compilador de C++ (equivalente ao gcc para C)
./programa
```

## Exemplos comentados

```cpp
#include <iostream>  // <iostream> substitui <stdio.h> para entrada/saída em C++
using namespace std;   // evita precisar escrever std:: antes de cout, cin, string, etc.

int main() {
    // cout (character output) substitui printf para saída simples
    cout << "Bem-vindo ao C++" << endl; // << encadeia valores, endl quebra linha

    int idade = 28;
    cout << "Idade: " << idade << endl; // não precisa de placeholders como %d

    // cin (character input) substitui scanf para entrada
    int numero;
    cout << "Digite um número: ";
    cin >> numero; // >> lê o valor digitado direto para a variável (sem &!)

    // C++ ainda aceita printf/scanf de C, por compatibilidade — mas cout/cin
    // são o estilo idiomático em código C++ novo

    // namespaces evitam conflito de nomes entre bibliotecas diferentes
    // std é o namespace da biblioteca padrão; sem "using namespace std;",
    // seria necessário escrever std::cout, std::cin, std::string, etc.
    std::cout << "Também funciona sem o using" << std::endl;

    // Comentários são idênticos a C: // de uma linha, /* */ de várias

    return 0;
}
```

## Exercício 1: Converta um "Hello, World!" de C para C++

Reescreva o programa C abaixo em C++, usando `cout` em vez de `printf`.

```c
#include <stdio.h>

int main() {
    printf("Olá, %s! Você tem %d anos.\n", "Ana", 28);
    return 0;
}
```

### Solução

```cpp
#include <iostream>
using namespace std;

int main() {
    string nome = "Ana";
    int idade = 28;
    cout << "Olá, " << nome << "! Você tem " << idade << " anos." << endl;
    return 0;
}
```

Em vez de uma string de formato com placeholders (`%s`, `%d`), C++ usa o operador `<<` para
encadear quantos valores forem necessários diretamente na expressão de saída — cada `<<` "empurra"
mais um valor para o fluxo `cout`, na ordem em que aparecem.

## Exercício 2: Leia dois números e some

Escreva um programa C++ que lê dois números inteiros do usuário com `cin` e imprime a soma deles
com `cout`.

### Solução

```cpp
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cout << "Digite dois números: ";
    cin >> a >> b; // cin também encadeia com >>, lendo dois valores seguidos

    cout << "Soma: " << (a + b) << endl;
    return 0;
}
```

`cin >> a >> b` lê dois valores separados por espaço (ou quebra de linha) diretamente para `a` e
`b`, sem precisar do operador `&` que `scanf` exigia em C — `cin` já sabe onde escrever porque
recebe a variável diretamente (por referência, assunto do próximo capítulo).

## Quiz

### 1. Qual biblioteca C++ substitui `<stdio.h>` para entrada e saída padrão?

- [ ] `<input.h>`
- [x] `<iostream>`
- [ ] `<console.h>`
- [ ] C++ não tem substituto, usa `<stdio.h>` sempre

> `<iostream>` fornece `cout` (saída) e `cin` (entrada), o estilo idiomático de C++ para
> entrada/saída no console. `printf`/`scanf` de C ainda funcionam em C++ por compatibilidade, mas
> não são o padrão recomendado em código C++ novo.

### 2. Para que serve `using namespace std;`?

- [ ] É obrigatório em todo programa C++
- [x] Evita precisar escrever o prefixo `std::` antes de cada nome da biblioteca padrão, como `cout` e `string`
- [ ] Importa automaticamente todas as bibliotecas do C++
- [ ] Substitui a necessidade de `#include`

> `std` é o namespace onde vive toda a biblioteca padrão de C++. Sem `using namespace std;`, seria
> necessário escrever `std::cout`, `std::cin`, `std::string` a cada uso — o `using` traz esses
> nomes para o escopo atual, evitando repetição (embora em projetos grandes seja comum evitar essa
> diretiva em arquivos header, para não "vazar" nomes).

### 3. O que `cout << valor` faz, em termos gerais?

- [ ] Lê um valor digitado pelo usuário e guarda em `valor`
- [x] Envia `valor` para a saída padrão (geralmente o terminal), podendo ser encadeado com mais `<<`
- [ ] Compara `valor` com o conteúdo atual de `cout`
- [ ] Só funciona com números inteiros

> `<<` é o operador de "inserção" no fluxo de saída: ele imprime `valor` em `cout` e retorna o
> próprio `cout`, permitindo encadear mais `<< outroValor` na mesma expressão, como em
> `cout << "Idade: " << idade << endl;`.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Do C ao C++: o que muda" na trilha de C++ do CodePath. Contexto: o capítulo
> explica iostream, cout/cin e namespaces como diferenças iniciais de C++ sobre C. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
