---
numero: 7
titulo: "Construtores e destrutores"
nivel: "basico"
objetivo: "Inicializar e finalizar objetos com construtores e destrutores."
duracao: 12
status: "completo"
---

## Conceito

Um construtor é um método especial, com o mesmo nome da classe, chamado automaticamente sempre que
um objeto é criado — usado para inicializar seus atributos. Um destrutor (nome da classe precedido
de `~`) é chamado automaticamente quando o objeto é destruído (sai de escopo na stack, ou recebe
`delete` na heap) — usado para liberar recursos que o objeto tenha adquirido.

## Sintaxe

```cpp
class Pessoa {
public:
    string nome;

    Pessoa(string n) {        // construtor: mesmo nome da classe
        nome = n;
        cout << "Pessoa criada: " << nome << endl;
    }

    ~Pessoa() {                // destrutor: nome da classe com ~
        cout << "Pessoa destruída: " << nome << endl;
    }
};

Pessoa ana("Ana"); // chama o construtor automaticamente
```

## Exemplos comentados

```cpp
#include <iostream>
using namespace std;

class Retangulo {
public:
    double largura;
    double altura;

    // Construtor: inicializa os atributos a partir dos argumentos recebidos
    Retangulo(double l, double a) {
        largura = l;
        altura = a;
    }

    // Lista de inicialização: forma mais idiomática e eficiente de inicializar atributos
    // (equivalente ao construtor acima, mas evita uma atribuição extra)
    // Retangulo(double l, double a) : largura(l), altura(a) {}

    double area() {
        return largura * altura;
    }
};

class Log {
public:
    string arquivo;

    Log(string nomeArquivo) {
        arquivo = nomeArquivo;
        cout << "Abrindo log: " << arquivo << endl;
    }

    ~Log() {
        cout << "Fechando log: " << arquivo << endl;
    }
};

int main() {
    Retangulo r(4, 5); // construtor chamado com os argumentos
    cout << r.area() << endl; // 20

    {
        Log log("app.log"); // "Abrindo log: app.log"
        cout << "Fazendo alguma coisa..." << endl;
    } // ao sair deste bloco, log é destruído automaticamente: "Fechando log: app.log"

    // Construtor padrão (sem argumentos): usado quando nenhum é fornecido explicitamente
    class Contador {
    public:
        int valor;
        Contador() { valor = 0; }  // construtor padrão
    };
    Contador c; // chama Contador() automaticamente, valor começa em 0

    return 0;
}
```

## Exercício 1: Escreva um construtor com lista de inicialização

Escreva uma classe `Ponto` com atributos `x` e `y` (double), usando a sintaxe de lista de
inicialização no construtor (`: x(valorX), y(valorY)`).

### Solução

```cpp
#include <iostream>
using namespace std;

class Ponto {
public:
    double x;
    double y;

    Ponto(double valorX, double valorY) : x(valorX), y(valorY) {}
};

int main() {
    Ponto p(3, 4);
    cout << p.x << ", " << p.y << endl; // 3, 4
    return 0;
}
```

A lista de inicialização (`: x(valorX), y(valorY)`) inicializa os atributos diretamente com os
valores recebidos, antes mesmo do corpo `{}` do construtor começar a executar — é a forma
recomendada em C++ moderno, mais eficiente do que atribuir dentro do corpo do construtor
(especialmente relevante para atributos que são objetos de outras classes, ou que são `const`).

## Exercício 2: Use o destrutor para simular liberação de recurso

Escreva uma classe `ArquivoSimulado` que imprime `"Abrindo <nome>"` no construtor e
`"Fechando <nome>"` no destrutor, e demonstre que o destrutor roda automaticamente ao sair de um
bloco.

### Solução

```cpp
#include <iostream>
using namespace std;

class ArquivoSimulado {
public:
    string nome;

    ArquivoSimulado(string n) : nome(n) {
        cout << "Abrindo " << nome << endl;
    }

    ~ArquivoSimulado() {
        cout << "Fechando " << nome << endl;
    }
};

int main() {
    cout << "Início do programa" << endl;
    {
        ArquivoSimulado arq("dados.txt"); // "Abrindo dados.txt"
        cout << "Usando o arquivo..." << endl;
    } // saída do bloco: "Fechando dados.txt" automaticamente
    cout << "Fim do programa" << endl;
    return 0;
}
```

O destrutor é chamado automaticamente pelo compilador assim que o objeto `arq` sai de escopo (ao
final do bloco `{}`), sem precisar de nenhuma chamada manual — esse comportamento automático e
determinístico é a base do padrão RAII, que será aprofundado mais adiante nesta trilha.

## Quiz

### 1. Quando um construtor é chamado?

- [ ] Apenas quando o programador chama manualmente
- [x] Automaticamente, toda vez que um novo objeto daquela classe é criado
- [ ] Apenas na primeira vez que a classe é usada no programa
- [ ] Nunca, é opcional e raramente necessário

> O construtor roda automaticamente no exato momento em que um objeto é instanciado — seja na
> stack (`Pessoa ana("Ana");`) ou na heap (`new Pessoa("Ana")`), garantindo que o objeto já nasça
> em um estado válido e inicializado.

### 2. Quando um destrutor é chamado em um objeto criado na stack?

- [ ] Nunca, destrutores só existem para objetos na heap
- [x] Automaticamente, assim que o objeto sai de escopo (por exemplo, ao final do bloco onde foi declarado)
- [ ] Apenas quando o programa termina completamente
- [ ] Só quando `delete` é chamado explicitamente

> Objetos criados na stack (sem `new`) têm seu destrutor chamado automaticamente pelo compilador
> assim que saem de escopo — diferente de objetos na heap, que exigem `delete` explícito para que
> o destrutor seja acionado.

### 3. O que uma lista de inicialização (`: x(valorX), y(valorY)`) em um construtor faz?

- [ ] É apenas um comentário, sem efeito real
- [x] Inicializa os atributos diretamente com os valores recebidos, antes do corpo do construtor executar
- [ ] Substitui completamente a necessidade de um construtor
- [ ] Só funciona com atributos do tipo `int`

> A lista de inicialização é a forma mais eficiente e idiomática de inicializar atributos em C++:
> em vez de criar o atributo com um valor "vazio" padrão e depois atribuir dentro do corpo do
> construtor, ela já inicializa diretamente com o valor final — importante especialmente para
> atributos `const` ou referências, que só podem ser inicializados dessa forma.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Construtores e destrutores" na trilha de C++ do CodePath. Contexto: o capítulo
> explica construtores, listas de inicialização e destrutores chamados automaticamente. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
