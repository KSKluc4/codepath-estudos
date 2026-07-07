---
numero: 8
titulo: "Encapsulamento"
nivel: "intermediario"
objetivo: "Controlar acesso a membros de uma classe com public, private e protected."
duracao: 12
status: "completo"
---

## Conceito

Encapsulamento é o princípio de esconder os detalhes internos de uma classe, expondo apenas uma
interface controlada. C++ oferece três níveis de acesso: `public` (acessível de qualquer lugar),
`private` (acessível só de dentro da própria classe) e `protected` (acessível na própria classe e
em classes que herdam dela, assunto do próximo capítulo). Por padrão, membros de uma `class` são
`private` (diferente de `struct`, onde o padrão é `public`).

## Sintaxe

```cpp
class ContaBancaria {
private:
    double saldo;   // só acessível de dentro da classe

public:
    void depositar(double valor) {
        saldo += valor;
    }

    double consultarSaldo() {
        return saldo;
    }
};

ContaBancaria conta;
// conta.saldo = 1000000; // ERRO de compilação: saldo é private
conta.depositar(100);       // ok: depositar é public
```

## Exemplos comentados

```cpp
#include <iostream>
using namespace std;

class ContaBancaria {
private:
    double saldo; // ninguém de fora pode alterar saldo diretamente

public:
    ContaBancaria(double saldoInicial) {
        if (saldoInicial < 0) {
            saldo = 0; // validação: garante que a conta nunca comece negativa
        } else {
            saldo = saldoInicial;
        }
    }

    void depositar(double valor) {
        if (valor > 0) {
            saldo += valor;
        }
    }

    bool sacar(double valor) {
        if (valor > saldo) {
            return false; // saque negado
        }
        saldo -= valor;
        return true;
    }

    // getter: única forma de LER saldo de fora da classe
    double consultarSaldo() {
        return saldo;
    }
};

int main() {
    ContaBancaria conta(100);
    conta.depositar(50);
    conta.sacar(30);

    cout << conta.consultarSaldo() << endl; // 120
    // conta.saldo = 999999; // erro de compilação: acesso negado

    return 0;
}

// protected: acessível na própria classe e em subclasses (não de fora)
class Veiculo {
protected:
    int velocidade; // subclasses podem acessar, código externo não
public:
    Veiculo() { velocidade = 0; }
};
// class Carro : public Veiculo {
//     void acelerar() { velocidade += 10; } // ok, protected é visível aqui
// };
```

## Exercício 1: Proteja um atributo com validação

Crie uma classe `Termometro` com atributo privado `temperatura`, um método `void definir(double t)`
que só aceita valores entre -50 e 60 (ignora valores fora dessa faixa), e um método
`double obter()` para ler o valor.

### Solução

```cpp
#include <iostream>
using namespace std;

class Termometro {
private:
    double temperatura;

public:
    Termometro() {
        temperatura = 20; // valor padrão razoável
    }

    void definir(double t) {
        if (t >= -50 && t <= 60) {
            temperatura = t;
        }
        // valores fora da faixa são silenciosamente ignorados
    }

    double obter() {
        return temperatura;
    }
};

int main() {
    Termometro t;
    t.definir(25);
    cout << t.obter() << endl; // 25

    t.definir(1000); // fora da faixa, ignorado
    cout << t.obter() << endl; // ainda 25

    return 0;
}
```

Como `temperatura` é `private`, a única forma de alterá-la é através do método `definir`, que
centraliza a validação em um único lugar — impossível "burlar" a regra de negócio atribuindo
diretamente `t.temperatura = 1000;` de fora da classe, já que isso nem compilaria.

## Exercício 2: Explique a diferença de acesso

Sem rodar o código, diga qual linha causa um erro de compilação e por quê:

```cpp
class Caixa {
private:
    int conteudo;
public:
    void guardar(int valor) { conteudo = valor; }
};

int main() {
    Caixa c;
    c.guardar(42);      // linha A
    cout << c.conteudo; // linha B
    return 0;
}
```

### Solução

A **linha B** (`cout << c.conteudo;`) causa erro de compilação, porque `conteudo` é `private` —
só pode ser acessado de dentro dos métodos da própria classe `Caixa`. A linha A funciona
normalmente, porque `guardar` é `public`.

Para consertar, seria necessário adicionar um método público de leitura, como
`int obter() { return conteudo; }`, e chamar `cout << c.obter();` em vez de acessar o atributo
diretamente.

## Quiz

### 1. Qual o nível de acesso padrão de membros em uma `class` (sem especificar nada)?

- [ ] `public`
- [x] `private`
- [ ] `protected`
- [ ] Não compila sem especificar

> Diferente de `struct` (onde o padrão é `public`), membros de uma `class` são `private` por
> padrão, se nenhum especificador de acesso for indicado — refletindo a filosofia de C++ de
> favorecer o encapsulamento por padrão em classes.

### 2. Por que expor um atributo apenas através de métodos públicos (getters/setters), em vez de deixá-lo `public` diretamente, é uma boa prática?

- [ ] Não é uma boa prática, atributos deveriam ser sempre públicos
- [x] Permite validar e controlar como o valor é lido/alterado, centralizando as regras de negócio em um único lugar
- [ ] Torna o programa mais lento sempre
- [ ] É obrigatório em C++, não é uma escolha

> Com um atributo `private` e métodos públicos controlando o acesso (como `definir()` no exercício
> do termômetro), é possível garantir invariantes (como "a temperatura nunca sai da faixa válida")
> em um único ponto do código, em vez de confiar que todo código externo vai respeitar essa regra
> manualmente.

### 3. Qual a diferença entre `private` e `protected`?

- [ ] Não há diferença nenhuma
- [x] `private` só é acessível dentro da própria classe; `protected` também é acessível em classes que herdam dela
- [ ] `protected` é mais restritivo que `private`
- [ ] `protected` só existe em structs

> `private` restringe o acesso exclusivamente ao código dentro da própria classe. `protected`
> estende esse acesso também às classes derivadas (subclasses, via herança), mas continua
> inacessível para código externo que não seja parte dessa hierarquia — assunto detalhado no
> próximo capítulo, sobre herança.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Encapsulamento" na trilha de C++ do CodePath. Contexto: o capítulo explica
> public, private, protected e o uso de getters/setters para proteger atributos. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
