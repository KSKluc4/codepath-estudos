---
numero: 2
titulo: "Tipos, referências e const"
nivel: "basico"
objetivo: "Usar referências (&) como alternativa mais segura a ponteiros, e o qualificador const."
duracao: 12
status: "completo"
---

## Conceito

C++ mantém os tipos primitivos de C (`int`, `float`, `double`, `char`, `bool` nativo desta vez) e
adiciona **referências**: um "apelido" para uma variável existente, declarado com `&`. Diferente de
um ponteiro, uma referência não pode ser nula nem "reapontada" depois de criada — é sempre um
alias direto e seguro para a variável original. `const` marca um valor (ou referência) como
somente leitura, ajudando o compilador a pegar alterações acidentais.

## Sintaxe

```cpp
int idade = 28;
int &referencia = idade;   // referencia é um APELIDO de idade, não uma cópia

referencia = 29;    // altera idade também! são a mesma variável
cout << idade;        // 29

const int MAX = 100;  // não pode ser reatribuído
```

## Exemplos comentados

```cpp
#include <iostream>
using namespace std;

int main() {
    int x = 10;
    int &ref = x; // ref e x são a MESMA variável, com dois nomes

    ref = 20;
    cout << x << endl;    // 20 — alterar ref altera x
    cout << ref << endl;  // 20

    // Diferente de ponteiro: referência precisa ser inicializada na criação
    // int &semDono; // ERRO de compilação: referência precisa apontar para algo já

    // bool é um tipo nativo em C++ (diferente de C clássico, que usava int/0/1)
    bool ativo = true;
    if (ativo) {
        cout << "Está ativo" << endl;
    }

    // const impede reatribuição
    const double PI = 3.14159;
    // PI = 3.14; // erro de compilação: PI é const

    // Uso mais comum de referência: parâmetros de função (próximo capítulo detalha)
    // void incrementar(int &numero) { numero++; }  // altera a variável original, sem precisar de ponteiro

    // const em parâmetros de referência: permite ler sem copiar, mas impede alterar
    // void imprimir(const string &texto) { cout << texto; texto += "!"; } // erro: texto é const

    // auto: deixa o compilador inferir o tipo (parecido com "let" tipado implicitamente)
    auto numero = 42;        // int
    auto preco = 19.90;        // double
    auto nome = string("Ana");  // string

    return 0;
}
```

## Exercício 1: Troque valores com referências

Escreva uma função `void trocar(int &a, int &b)` que troca os valores de duas variáveis usando
referências (sem usar `&` de endereço nem `*` de desreferência, como seria necessário em C puro).

### Solução

```cpp
#include <iostream>
using namespace std;

void trocar(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 5, y = 10;
    trocar(x, y); // passa as variáveis diretamente, sem &x, &y!
    cout << "x=" << x << " y=" << y << endl; // x=10 y=5
    return 0;
}
```

Como `a` e `b` são referências aos argumentos originais, a função pode alterá-los diretamente,
usando a sintaxe normal de atribuição (`a = b;`) — sem precisar desreferenciar com `*` como seria
necessário com ponteiros em C. A chamada também é mais simples: `trocar(x, y)`, sem `&x, &y`.

## Exercício 2: Use const para proteger um parâmetro

Escreva uma função `void imprimirMaiusculo(const string &texto)` que imprime `texto` em maiúsculas,
sem alterar a string original recebida (use um `string` local para a versão maiúscula).

### Solução

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

void imprimirMaiusculo(const string &texto) {
    string maiusculo = texto; // cópia local, para não alterar "texto"
    transform(maiusculo.begin(), maiusculo.end(), maiusculo.begin(), ::toupper);
    cout << maiusculo << endl;
}

int main() {
    string nome = "ana";
    imprimirMaiusculo(nome);
    cout << nome << endl; // "ana" — string original inalterada
    return 0;
}
```

`const string &texto` passa a string por referência (evitando o custo de copiar a string inteira
na chamada), mas o `const` garante, em tempo de compilação, que a função não pode modificar
`texto` diretamente — obrigando a criar uma cópia local (`maiusculo`) para qualquer transformação.

## Quiz

### 1. Qual a principal diferença entre uma referência (`int &r = x;`) e um ponteiro (`int *p = &x;`)?

- [ ] Não há diferença nenhuma
- [x] Uma referência é um apelido fixo para uma variável já existente, sem poder ser nula ou "reapontada"; um ponteiro pode
- [ ] Referências só funcionam com números
- [ ] Ponteiros não existem mais em C++

> Uma referência precisa ser inicializada no momento da declaração e sempre se refere à mesma
> variável durante toda sua vida — não existe "referência nula" nem reatribuir uma referência para
> apontar a outra variável depois. Ponteiros são mais flexíveis (podem ser `NULL`, reatribuídos),
> mas também mais propensos a erro.

### 2. O que `const int MAX = 100;` impede?

- [ ] Impede que `MAX` seja lido
- [x] Impede que `MAX` seja reatribuído a um novo valor depois de inicializado
- [ ] Impede que `MAX` seja usado em expressões matemáticas
- [ ] Torna `MAX` uma variável global automaticamente

> `const` marca a variável como somente leitura após a inicialização. Tentar `MAX = 200;` depois
> geraria um erro de compilação, ajudando a garantir (e documentar) que aquele valor nunca deveria
> mudar.

### 3. Por que passar um parâmetro como `const string &texto` é uma prática comum em C++?

- [ ] Porque `string` não pode ser passada de outra forma
- [x] Porque evita copiar a string inteira (referência), mas ainda impede que a função a altere por engano (const)
- [ ] Porque torna a função mais lenta, mas mais segura
- [ ] `const` e `&` juntos sempre causam erro de compilação

> Passar por referência (`&`) evita o custo de copiar dados potencialmente grandes, como uma
> `string`. Adicionar `const` combina essa eficiência com a garantia de que a função não vai
> modificar o valor original, comunicando a intenção de "só leitura" tanto ao compilador quanto a
> quem lê o código.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Tipos, referências e const" na trilha de C++ do CodePath. Contexto: o capítulo
> explica referências (&), o qualificador const, e o tipo bool nativo de C++. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
