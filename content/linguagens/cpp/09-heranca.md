---
numero: 9
titulo: "Herança"
nivel: "intermediario"
objetivo: "Reaproveitar código entre classes com herança em C++."
duracao: 12
status: "completo"
---

## Conceito

Herança permite que uma classe (a "derivada" ou "filha") reaproveite atributos e métodos de outra
classe (a "base" ou "pai"), declarando `class Filha : public Base`. A classe derivada herda tudo o
que é `public` e `protected` da base, e pode adicionar seus próprios membros ou sobrescrever
comportamentos herdados.

## Sintaxe

```cpp
class Animal {
public:
    string nome;
    void comer() {
        cout << nome << " está comendo" << endl;
    }
};

class Cachorro : public Animal {  // Cachorro herda de Animal
public:
    void latir() {
        cout << nome << " diz Au au!" << endl; // nome herdado de Animal
    }
};

Cachorro rex;
rex.nome = "Rex";     // atributo herdado
rex.comer();            // método herdado
rex.latir();             // método próprio
```

## Exemplos comentados

```cpp
#include <iostream>
using namespace std;

class Funcionario {
protected:
    string nome;
    double salario;

public:
    Funcionario(string n, double s) : nome(n), salario(s) {}

    double calcularBonus() {
        return salario * 0.1;
    }

    void exibir() {
        cout << nome << ": R$" << salario << endl;
    }
};

// Gerente HERDA de Funcionario, reaproveitando nome, salario e os métodos
class Gerente : public Funcionario {
private:
    int tamanhoEquipe;

public:
    // O construtor da classe derivada precisa chamar o construtor da base explicitamente
    Gerente(string n, double s, int equipe) : Funcionario(n, s), tamanhoEquipe(equipe) {}

    // Sobrescrevendo (redefinindo) um método herdado
    double calcularBonus() {
        return salario * 0.1 + tamanhoEquipe * 100; // reaproveita "salario" da base
    }
};

int main() {
    Funcionario f("Ana", 5000);
    cout << f.calcularBonus() << endl; // 500

    Gerente g("Bia", 8000, 3);
    g.exibir();                    // "Bia: R$8000" — método herdado de Funcionario
    cout << g.calcularBonus() << endl; // 8000*0.1 + 3*100 = 1100

    return 0;
}

// Uma classe pode herdar publicamente (public), o mais comum, mantendo a
// visibilidade original dos membros herdados. private/protected na herança
// mudam essa visibilidade, mas são bem menos usados na prática cotidiana
```

## Exercício 1: Crie uma hierarquia simples

Crie uma classe base `Forma` com um método `void descrever()` que imprime `"Sou uma forma"`, e uma
classe `Circulo : public Forma` que adiciona um atributo `raio` e um método `double area()`.

### Solução

```cpp
#include <iostream>
using namespace std;

class Forma {
public:
    void descrever() {
        cout << "Sou uma forma" << endl;
    }
};

class Circulo : public Forma {
public:
    double raio;

    Circulo(double r) : raio(r) {}

    double area() {
        return 3.14159 * raio * raio;
    }
};

int main() {
    Circulo c(5);
    c.descrever();          // "Sou uma forma" — herdado de Forma
    cout << c.area() << endl; // 78.5397...

    return 0;
}
```

`Circulo` reaproveita `descrever()` de `Forma` sem precisar reimplementá-lo, e adiciona seu próprio
atributo (`raio`) e método (`area()`), que não existem na classe base.

## Exercício 2: Sobrescreva um método herdado

Estenda o exemplo de `Funcionario`/`Gerente` do capítulo, criando uma classe `Diretor : public
Gerente` que sobrescreve `calcularBonus()` para retornar o dobro do bônus de um `Gerente` comum.

### Solução

```cpp
#include <iostream>
using namespace std;

class Funcionario {
protected:
    string nome;
    double salario;
public:
    Funcionario(string n, double s) : nome(n), salario(s) {}
    double calcularBonus() { return salario * 0.1; }
};

class Gerente : public Funcionario {
protected:
    int tamanhoEquipe;
public:
    Gerente(string n, double s, int equipe) : Funcionario(n, s), tamanhoEquipe(equipe) {}
    double calcularBonus() { return salario * 0.1 + tamanhoEquipe * 100; }
};

class Diretor : public Gerente {
public:
    Diretor(string n, double s, int equipe) : Gerente(n, s, equipe) {}

    double calcularBonus() {
        return Gerente::calcularBonus() * 2; // reaproveita a lógica de Gerente, dobrando o resultado
    }
};

int main() {
    Diretor d("Carlos", 10000, 5);
    cout << d.calcularBonus() << endl; // (10000*0.1 + 5*100) * 2 = 3000
    return 0;
}
```

`Gerente::calcularBonus()` chama explicitamente a versão da classe pai (`Gerente`), evitando
duplicar aquela lógica dentro de `Diretor` — a nova versão apenas reaproveita o resultado e aplica
a regra extra (dobrar) por cima.

## Quiz

### 1. O que a sintaxe `class Cachorro : public Animal` significa?

- [ ] `Cachorro` e `Animal` são a mesma classe
- [x] `Cachorro` herda publicamente de `Animal`, reaproveitando seus membros públicos e protegidos
- [ ] `Animal` herda de `Cachorro`
- [ ] É um erro de sintaxe

> `: public Animal` declara que `Cachorro` é uma classe derivada de `Animal` (a classe base),
> herdando seus atributos e métodos `public`/`protected` e podendo adicionar ou sobrescrever
> comportamento próprio.

### 2. Por que o construtor de uma classe derivada precisa chamar explicitamente o construtor da classe base?

- [ ] Não precisa, isso acontece automaticamente sem nenhuma sintaxe especial
- [x] Para garantir que os atributos herdados da base sejam inicializados corretamente, antes dos atributos próprios da derivada
- [ ] Porque construtores nunca são herdados de forma alguma
- [ ] Apenas para classes com métodos virtuais

> Na lista de inicialização do construtor da classe derivada (`Gerente(...) : Funcionario(n, s),
> ...`), é preciso invocar explicitamente o construtor da classe base, passando os argumentos que
> ele espera — isso garante que os atributos herdados (como `nome` e `salario`) sejam
> inicializados corretamente antes do restante do construtor derivado executar.

### 3. O que significa "sobrescrever" um método herdado, como `calcularBonus()` em `Gerente`?

- [ ] Apagar o método da classe base permanentemente
- [x] Declarar uma nova versão do método na classe derivada, que substitui o comportamento herdado quando chamado em objetos dessa subclasse
- [ ] É proibido em C++
- [ ] Só funciona se o método da base for `private`

> Ao declarar um método com a mesma assinatura na classe derivada, essa nova versão passa a ser
> usada quando o método é chamado em objetos daquela subclasse — a versão original da classe base
> ainda pode ser acessada explicitamente com `Base::metodo()`, como no exemplo do `Diretor`.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Herança" na trilha de C++ do CodePath. Contexto: o capítulo explica herança
> pública, o construtor da classe derivada chamando o da base, e sobrescrita de métodos. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
