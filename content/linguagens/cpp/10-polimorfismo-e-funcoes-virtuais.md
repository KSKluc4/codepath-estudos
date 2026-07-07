---
numero: 10
titulo: "Polimorfismo e funções virtuais"
nivel: "intermediario"
objetivo: "Usar funções virtuais para permitir polimorfismo entre classes derivadas."
duracao: 15
status: "completo"
---

## Conceito

Por padrão, chamar um método sobrescrito em C++ através de um **ponteiro ou referência para a
classe base** ainda executa a versão da classe base, não a da derivada — o oposto do que acontece
em Python ou Java. Para obter polimorfismo de verdade (a versão correta ser chamada dinamicamente,
baseada no tipo real do objeto), o método precisa ser declarado `virtual` na classe base.

## Sintaxe

```cpp
class Animal {
public:
    virtual string fazerSom() {  // virtual habilita polimorfismo
        return "...";
    }
};

class Cachorro : public Animal {
public:
    string fazerSom() override {  // override documenta a intenção (opcional, mas recomendado)
        return "Au au!";
    }
};

Animal *a = new Cachorro();
cout << a->fazerSom(); // "Au au!" — graças a virtual, chama a versão de Cachorro
```

## Exemplos comentados

```cpp
#include <iostream>
#include <vector>
using namespace std;

class Animal {
public:
    string nome;
    Animal(string n) : nome(n) {}

    virtual string fazerSom() { // sem "virtual", o polimorfismo abaixo NÃO funcionaria
        return "...";
    }

    // Destrutor virtual: OBRIGATÓRIO quando a classe será usada polimorficamente
    // com delete através de ponteiro para a classe base, para evitar vazamento
    virtual ~Animal() {}
};

class Cachorro : public Animal {
public:
    Cachorro(string n) : Animal(n) {}
    string fazerSom() override {
        return "Au au!";
    }
};

class Gato : public Animal {
public:
    Gato(string n) : Animal(n) {}
    string fazerSom() override {
        return "Miau!";
    }
};

int main() {
    // Polimorfismo em ação: um vector de PONTEIROS para a classe base,
    // guardando objetos de tipos DERIVADOS diferentes
    vector<Animal*> animais;
    animais.push_back(new Cachorro("Rex"));
    animais.push_back(new Gato("Mimi"));

    for (Animal *a : animais) {
        cout << a->nome << " diz " << a->fazerSom() << endl;
        // Rex diz Au au!
        // Mimi diz Miau!
    }

    for (Animal *a : animais) {
        delete a; // graças ao destrutor virtual, chama o destrutor CORRETO de cada subclasse
    }

    return 0;
}

// Classe abstrata: tem pelo menos um método virtual "puro" (= 0), não pode ser instanciada
class FormaAbstrata {
public:
    virtual double area() = 0; // método virtual puro: subclasses SÃO OBRIGADAS a implementar
};
// FormaAbstrata f; // erro de compilação: classe abstrata não pode ser instanciada
```

## Exercício 1: Crie uma hierarquia polimórfica

Crie uma classe base `Forma` com um método virtual `virtual double area() { return 0; }`, e duas
subclasses `Quadrado` e `Circulo` que sobrescrevem `area()`. Depois, percorra um `vector<Forma*>`
imprimindo a área de cada uma.

### Solução

```cpp
#include <iostream>
#include <vector>
using namespace std;

class Forma {
public:
    virtual double area() { return 0; }
    virtual ~Forma() {}
};

class Quadrado : public Forma {
public:
    double lado;
    Quadrado(double l) : lado(l) {}
    double area() override { return lado * lado; }
};

class Circulo : public Forma {
public:
    double raio;
    Circulo(double r) : raio(r) {}
    double area() override { return 3.14159 * raio * raio; }
};

int main() {
    vector<Forma*> formas;
    formas.push_back(new Quadrado(4));
    formas.push_back(new Circulo(3));

    for (Forma *f : formas) {
        cout << f->area() << endl; // 16, depois 28.27...
    }

    for (Forma *f : formas) {
        delete f;
    }

    return 0;
}
```

Como `area()` é `virtual` na classe base, chamar `f->area()` através de um ponteiro `Forma*`
executa corretamente a versão de `Quadrado` ou `Circulo`, dependendo do tipo real do objeto
apontado — mesmo que o tipo estático da variável (`Forma*`) seja sempre o mesmo.

## Exercício 2: Torne uma classe abstrata

Reescreva a classe `Forma` do exercício anterior como uma classe abstrata (com `area()` sendo um
método virtual puro), garantindo que ela não possa ser instanciada diretamente.

### Solução

```cpp
#include <iostream>
using namespace std;

class Forma {
public:
    virtual double area() = 0; // método virtual puro
    virtual ~Forma() {}
};

class Quadrado : public Forma {
public:
    double lado;
    Quadrado(double l) : lado(l) {}
    double area() override { return lado * lado; }
};

int main() {
    // Forma f; // ERRO de compilação: Forma é abstrata, não pode ser instanciada
    Quadrado q(4);
    cout << q.area() << endl; // 16
    return 0;
}
```

`virtual double area() = 0;` marca `area` como um método virtual **puro**: a classe `Forma` não
fornece implementação nenhuma, e qualquer classe derivada é obrigada a implementá-lo, ou também se
torna abstrata. Isso impede a criação de um objeto `Forma` "genérico" sem uma área bem definida.

## Quiz

### 1. O que acontece ao chamar um método sobrescrito através de um ponteiro para a classe base, SE o método não for `virtual`?

- [ ] A versão correta da subclasse é sempre chamada
- [x] A versão da classe BASE é chamada, ignorando a sobrescrita da subclasse (sem polimorfismo)
- [ ] O programa não compila
- [ ] Um erro é lançado em tempo de execução

> Sem `virtual`, C++ decide qual versão do método chamar em tempo de compilação, baseado no TIPO
> ESTÁTICO do ponteiro/referência (a classe base), não no tipo real do objeto. Isso é chamado de
> "binding estático" — o oposto do polimorfismo dinâmico que `virtual` habilita.

### 2. Por que uma classe usada polimorficamente (com `delete` através de ponteiro para a base) precisa de um destrutor `virtual`?

- [ ] Não precisa, destrutores nunca causam problema
- [x] Sem destrutor virtual, `delete` através de um ponteiro para a base só chamaria o destrutor da base, vazando recursos da subclasse
- [ ] Destrutores virtuais são proibidos em C++
- [ ] Apenas classes abstratas precisam de destrutor virtual

> Assim como métodos comuns, destrutores não-virtuais são resolvidos estaticamente. Se `Animal`
> não tivesse `virtual ~Animal()`, `delete` em um `Animal*` apontando para um `Cachorro` chamaria
> apenas `~Animal()`, pulando `~Cachorro()` — o que causaria vazamento de qualquer recurso que o
> destrutor de `Cachorro` deveria liberar.

### 3. O que `virtual double area() = 0;` representa?

- [ ] Um método virtual comum, que a classe base já implementa
- [x] Um método virtual PURO: a classe base não fornece implementação, e a classe se torna abstrata (não instanciável)
- [ ] Um erro de sintaxe
- [ ] Um método que sempre retorna zero

> O `= 0` marca o método como "puro": não há implementação na classe base, apenas a assinatura. Uma
> classe com pelo menos um método virtual puro se torna abstrata — não pode ser instanciada
> diretamente, servindo apenas como um "contrato" que classes derivadas concretas devem cumprir.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Polimorfismo e funções virtuais" na trilha de C++ do CodePath. Contexto: o
> capítulo explica métodos virtual, override, destrutores virtuais e classes abstratas. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
