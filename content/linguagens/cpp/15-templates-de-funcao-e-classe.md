---
numero: 15
titulo: "Templates de função e classe"
nivel: "avancado"
objetivo: "Escrever código genérico reutilizável com templates."
duracao: 15
status: "completo"
---

## Conceito

Templates permitem escrever funções e classes que funcionam com **qualquer tipo**, sem duplicar
código para cada tipo específico — o compilador gera automaticamente uma versão especializada para
cada tipo realmente usado, em tempo de compilação. É o equivalente C++ aos generics vistos na
trilha de TypeScript, mas resolvido inteiramente antes da execução, sem custo em tempo de
execução.

## Sintaxe

```cpp
template <typename T>
T maximo(T a, T b) {
    return (a > b) ? a : b;
}

maximo(3, 7);       // T é deduzido como int
maximo(3.5, 2.1);    // T é deduzido como double
maximo(string("a"), string("b")); // T é deduzido como string
```

## Exemplos comentados

```cpp
#include <iostream>
using namespace std;

// Template de função: funciona para qualquer tipo que suporte o operador >
template <typename T>
T maximo(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    cout << maximo(3, 7) << endl;          // 7 (int)
    cout << maximo(3.5, 2.1) << endl;       // 3.5 (double)
    cout << maximo(string("ana"), string("bia")) << endl; // "bia" (string, comparação lexicográfica)

    return 0;
}

// Template com múltiplos parâmetros de tipo
template <typename A, typename B>
void imprimirPar(A a, B b) {
    cout << "(" << a << ", " << b << ")" << endl;
}
// imprimirPar(1, "texto"); // (1, texto) — A=int, B=const char*

// Template de classe: uma "Caixa" genérica que guarda qualquer tipo
template <typename T>
class Caixa {
private:
    T conteudo;
public:
    Caixa(T valor) : conteudo(valor) {}

    T obter() {
        return conteudo;
    }

    void definir(T novoValor) {
        conteudo = novoValor;
    }
};

// Uso:
// Caixa<int> caixaDeNumero(42);
// Caixa<string> caixaDeTexto("olá");

// Pilha genérica usando um vector internamente (template de classe mais completo)
template <typename T>
class Pilha {
private:
    vector<T> itens;
public:
    void empilhar(T item) {
        itens.push_back(item);
    }
    T desempilhar() {
        T topo = itens.back();
        itens.pop_back();
        return topo;
    }
    bool vazia() {
        return itens.empty();
    }
};
```

## Exercício 1: Escreva uma função template de troca

Escreva uma função template `void trocar(T &a, T &b)` que troca os valores de duas variáveis de
qualquer tipo `T`, usando referências.

### Solução

```cpp
#include <iostream>
using namespace std;

template <typename T>
void trocar(T &a, T &b) {
    T temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 5, y = 10;
    trocar(x, y);
    cout << x << " " << y << endl; // 10 5

    double p = 1.5, q = 2.5;
    trocar(p, q);
    cout << p << " " << q << endl; // 2.5 1.5

    return 0;
}
```

A mesma implementação de `trocar` funciona tanto para `int` quanto para `double` (ou qualquer
outro tipo que suporte cópia), porque o compilador gera uma versão especializada de `trocar<T>`
para cada tipo `T` realmente usado nas chamadas do programa — sem precisar escrever
`trocarInt`, `trocarDouble`, etc. separadamente.

## Exercício 2: Crie uma classe template Par

Crie uma classe template `Par<A, B>` que guarda dois valores de tipos possivelmente diferentes
(`primeiro` e `segundo`), com um método `void exibir()` que os imprime.

### Solução

```cpp
#include <iostream>
using namespace std;

template <typename A, typename B>
class Par {
public:
    A primeiro;
    B segundo;

    Par(A p, B s) : primeiro(p), segundo(s) {}

    void exibir() {
        cout << "(" << primeiro << ", " << segundo << ")" << endl;
    }
};

int main() {
    Par<string, int> pessoa("Ana", 28);
    pessoa.exibir(); // (Ana, 28)

    Par<int, double> medida(5, 2.5);
    medida.exibir();  // (5, 2.5)

    return 0;
}
```

`Par<A, B>` aceita dois parâmetros de tipo independentes, permitindo combinações como
`Par<string, int>` ou `Par<int, double>` — cada instanciação gera uma classe concreta diferente,
todas geradas a partir do mesmo código-fonte do template.

## Quiz

### 1. Qual o principal benefício de usar templates em vez de duplicar uma função para cada tipo?

- [ ] Templates tornam o código mais lento
- [x] Uma única implementação genérica funciona para vários tipos, sem duplicação de código, resolvida em tempo de compilação
- [ ] Templates só funcionam com tipos numéricos
- [ ] É a única forma de declarar funções em C++

> Em vez de escrever `maximoInt`, `maximoDouble`, `maximoString` separadamente, um único template
> `maximo<T>` cobre todos esses casos — o compilador gera automaticamente a versão especializada
> necessária para cada tipo usado, sem custo de performance em tempo de execução (diferente de
> `any`/reflexão, que teriam custo).

### 2. Quando o compilador decide qual tipo `T` usar em uma chamada como `maximo(3, 7)`?

- [ ] Em tempo de execução, checando os valores dinamicamente
- [x] Em tempo de compilação, deduzindo `T` a partir dos tipos dos argumentos passados
- [ ] `T` precisa ser sempre especificado explicitamente, nunca é deduzido
- [ ] Nunca, `T` é sempre `int` por padrão

> O compilador analisa os tipos dos argumentos na chamada (`3` e `7`, ambos `int`) e deduz `T =
> int` automaticamente, gerando a versão `maximo<int>` daquele template — tudo resolvido antes do
> programa rodar, sem overhead de tipo dinâmico.

### 3. O que `Caixa<int>` e `Caixa<string>` representam, sendo `Caixa<T>` um template de classe?

- [ ] São a mesma classe, apenas com nomes diferentes
- [x] São duas classes CONCRETAS diferentes, geradas a partir do mesmo template, uma especializada para `int` e outra para `string`
- [ ] `Caixa<string>` é uma subclasse de `Caixa<int>`
- [ ] É um erro de compilação usar o mesmo template com tipos diferentes

> Cada instanciação de um template de classe com um tipo concreto (`Caixa<int>`, `Caixa<string>`)
> gera uma classe totalmente separada em tempo de compilação — elas compartilham a mesma
> implementação-fonte, mas são tipos distintos e não relacionados por herança entre si.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Templates de função e classe" na trilha de C++ do CodePath. Contexto: o
> capítulo explica templates genéricos para funções e classes, e a dedução automática de tipo.
> Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
