---
numero: 6
titulo: "Classes e objetos"
nivel: "basico"
objetivo: "Definir classes, atributos e métodos, e instanciar objetos em C++."
duracao: 15
status: "completo"
---

## Conceito

Uma `class` em C++ agrupa dados (atributos) e comportamento (métodos) sob um único tipo, permitindo
criar objetos (instâncias) a partir dela — a base da orientação a objetos que C++ adiciona sobre
C. Diferente de uma `struct` de C (que só agrupa dados), uma classe também define funções que
operam sobre esses dados.

## Sintaxe

```cpp
class Pessoa {
public:
    string nome;
    int idade;

    void apresentar() {
        cout << "Oi, eu sou " << nome << " e tenho " << idade << " anos" << endl;
    }
};

Pessoa ana;
ana.nome = "Ana";
ana.idade = 28;
ana.apresentar();
```

## Exemplos comentados

```cpp
#include <iostream>
#include <string>
using namespace std;

class ContaBancaria {
public:
    string titular;
    double saldo;

    void depositar(double valor) {
        saldo += valor;
    }

    void sacar(double valor) {
        if (valor > saldo) {
            cout << "Saldo insuficiente" << endl;
            return;
        }
        saldo -= valor;
    }

    void exibirSaldo() {
        cout << titular << ": R$" << saldo << endl;
    }
};

int main() {
    // Instanciando um objeto na stack
    ContaBancaria conta;
    conta.titular = "Bia";
    conta.saldo = 100;

    conta.depositar(50);
    conta.sacar(30);
    conta.exibirSaldo(); // Bia: R$120

    // Instanciando com "new", na heap (precisa de delete depois, ou usar smart pointers)
    ContaBancaria *contaHeap = new ContaBancaria();
    contaHeap->titular = "Carlos"; // -> acessa membros através de ponteiro, como em structs de C
    contaHeap->saldo = 200;
    delete contaHeap; // libera a memória alocada com new

    // Vários objetos, cada um com seus próprios valores independentes
    ContaBancaria conta1, conta2;
    conta1.titular = "Duda";
    conta1.saldo = 500;
    conta2.titular = "Eva";
    conta2.saldo = 1000;

    return 0;
}
```

## Exercício 1: Modele um retângulo

Crie uma classe `Retangulo` com atributos `largura` e `altura` (públicos), e um método `area()` que
retorna `largura * altura`.

### Solução

```cpp
#include <iostream>
using namespace std;

class Retangulo {
public:
    double largura;
    double altura;

    double area() {
        return largura * altura;
    }
};

int main() {
    Retangulo r;
    r.largura = 4;
    r.altura = 5;

    cout << r.area() << endl; // 20
    return 0;
}
```

Assim como em outras linguagens orientadas a objeto vistas nesta plataforma, cada instância de
`Retangulo` tem seus próprios valores de `largura` e `altura`, independentes de qualquer outra
instância criada a partir da mesma classe.

## Exercício 2: Crie um método que altera o próprio objeto

Adicione à classe `Retangulo` um método `void dobrarTamanho()` que multiplica `largura` e `altura`
por 2, alterando o próprio objeto.

### Solução

```cpp
#include <iostream>
using namespace std;

class Retangulo {
public:
    double largura;
    double altura;

    double area() {
        return largura * altura;
    }

    void dobrarTamanho() {
        largura *= 2;
        altura *= 2;
    }
};

int main() {
    Retangulo r;
    r.largura = 4;
    r.altura = 5;

    r.dobrarTamanho();
    cout << r.largura << " x " << r.altura << endl; // 8 x 10
    cout << r.area() << endl;                          // 80

    return 0;
}
```

Dentro de um método, `largura` e `altura` se referem automaticamente aos atributos DO OBJETO que
chamou o método (equivalente ao `this->largura`, que também poderia ser escrito explicitamente) —
não é preciso nenhuma sintaxe especial como `self.` (Python) ou passar o objeto como parâmetro,
como seria necessário em C com structs e funções separadas.

## Quiz

### 1. Qual a principal diferença entre uma `class` e uma `struct` de C, conceitualmente?

- [ ] Não há diferença nenhuma em C++
- [x] Uma classe agrupa dados E comportamento (métodos); uma struct de C só agrupa dados
- [ ] `struct` não pode ter mais de 3 campos
- [ ] Classes não podem ter atributos públicos

> Em C, `struct` é usada apenas para agrupar variáveis relacionadas, sem função associada
> diretamente a ela. Em C++, `class` permite declarar métodos junto com os atributos, unindo dados
> e comportamento no mesmo tipo — a base da orientação a objetos.

### 2. Qual a diferença entre instanciar um objeto na stack (`ContaBancaria conta;`) e na heap (`new ContaBancaria();`)?

- [ ] Não há diferença nenhuma
- [x] Objetos na stack são liberados automaticamente ao sair de escopo; objetos na heap (via `new`) exigem `delete` manual
- [ ] Objetos na heap não podem ter métodos
- [ ] `new` só funciona com tipos primitivos

> Um objeto criado com `ContaBancaria conta;` vive na stack e é destruído automaticamente quando
> sai de escopo (por exemplo, ao final da função). Um objeto criado com `new ContaBancaria()` vive
> na heap e continua existindo até que `delete` seja chamado explicitamente — assunto retomado no
> capítulo de smart pointers, que evita esse gerenciamento manual.

### 3. Como um método de uma classe acessa os atributos DO PRÓPRIO OBJETO que o chamou?

- [ ] Precisa receber o objeto como parâmetro explícito
- [x] Acessa diretamente pelo nome do atributo (implicitamente equivalente a `this->atributo`)
- [ ] Só é possível usando ponteiros
- [ ] Métodos não podem acessar atributos da própria classe

> Dentro de um método, o compilador já sabe que nomes de atributos como `largura` se referem ao
> objeto que está chamando aquele método (guardado implicitamente no ponteiro especial `this`) —
> não é necessário passar o objeto como argumento explícito, como seria o caso em C com funções
> separadas operando sobre uma struct.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Classes e objetos" na trilha de C++ do CodePath. Contexto: o capítulo explica
> declaração de classes, atributos, métodos e instanciação com stack/heap. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
