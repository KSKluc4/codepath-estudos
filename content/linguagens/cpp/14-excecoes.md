---
numero: 14
titulo: "Exceções"
nivel: "avancado"
objetivo: "Tratar erros em tempo de execução com try, catch e throw."
duracao: 12
status: "completo"
---

## Conceito

Exceções em C++ permitem sinalizar e tratar erros de forma estruturada, separando o código "normal"
do código de tratamento de erro — diferente de C, onde erros geralmente são sinalizados por valores
de retorno especiais (como `NULL` ou `-1`) que é fácil esquecer de checar. Um bloco `try` executa
código que pode falhar; `throw` lança uma exceção; `catch` a captura e trata.

## Sintaxe

```cpp
#include <stdexcept>

try {
    if (divisor == 0) {
        throw runtime_error("Divisão por zero");
    }
    int resultado = dividendo / divisor;
} catch (const runtime_error &erro) {
    cout << "Erro: " << erro.what() << endl;
}
```

## Exemplos comentados

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

double dividir(double a, double b) {
    if (b == 0) {
        throw invalid_argument("Divisor não pode ser zero");
    }
    return a / b;
}

int main() {
    try {
        cout << dividir(10, 2) << endl; // 5
        cout << dividir(10, 0) << endl; // lança exceção antes de chegar aqui
    } catch (const invalid_argument &erro) {
        cout << "Erro: " << erro.what() << endl;
    }

    // Múltiplos catch, do mais específico para o mais genérico
    try {
        throw out_of_range("índice inválido");
    } catch (const invalid_argument &e) {
        cout << "Argumento inválido: " << e.what() << endl;
    } catch (const out_of_range &e) {
        cout << "Fora do intervalo: " << e.what() << endl;
    } catch (const exception &e) {
        // captura QUALQUER exceção derivada de std::exception, como último recurso
        cout << "Erro genérico: " << e.what() << endl;
    }

    // finally não existe em C++ — RAII (visto em capítulo próprio) cumpre esse papel:
    // destrutores de objetos locais rodam automaticamente mesmo se uma exceção for lançada

    // Exceção customizada: herda de std::exception (ou uma subclasse dela)
    class SaldoInsuficienteException : public runtime_error {
    public:
        SaldoInsuficienteException(string msg) : runtime_error(msg) {}
    };

    try {
        throw SaldoInsuficienteException("Saldo insuficiente para o saque");
    } catch (const SaldoInsuficienteException &e) {
        cout << e.what() << endl;
    }

    return 0;
}
```

## Exercício 1: Trate uma divisão segura

Escreva uma função `double dividirSeguro(double a, double b)` que lança `invalid_argument` se `b`
for zero, e um `main` que trata esse erro imprimindo a mensagem da exceção.

### Solução

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

double dividirSeguro(double a, double b) {
    if (b == 0) {
        throw invalid_argument("Não é possível dividir por zero");
    }
    return a / b;
}

int main() {
    try {
        cout << dividirSeguro(10, 2) << endl; // 5
        cout << dividirSeguro(10, 0) << endl; // lança exceção
    } catch (const invalid_argument &erro) {
        cout << "Erro: " << erro.what() << endl;
    }

    return 0;
}
```

`throw invalid_argument(...)` interrompe imediatamente o fluxo normal de `dividirSeguro`,
"subindo" até encontrar um `catch` compatível na pilha de chamadas — nesse caso, o `catch (const
invalid_argument &erro)` em `main`, que trata o erro sem deixar o programa travar.

## Exercício 2: Crie uma exceção customizada

Crie uma classe `IdadeInvalidaException` (herdando de `std::runtime_error`) e uma função
`void validarIdade(int idade)` que a lança se `idade` for negativa ou maior que 120.

### Solução

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

class IdadeInvalidaException : public runtime_error {
public:
    IdadeInvalidaException(string msg) : runtime_error(msg) {}
};

void validarIdade(int idade) {
    if (idade < 0 || idade > 120) {
        throw IdadeInvalidaException("Idade inválida: " + to_string(idade));
    }
}

int main() {
    try {
        validarIdade(-5);
    } catch (const IdadeInvalidaException &erro) {
        cout << erro.what() << endl; // "Idade inválida: -5"
    }

    return 0;
}
```

Herdar de `runtime_error` (que já sabe guardar e expor uma mensagem via `.what()`) evita reescrever
essa infraestrutura do zero — a classe customizada só precisa repassar a mensagem para o construtor
da classe base, ganhando toda a interface padrão de exceções C++ automaticamente.

## Quiz

### 1. O que `throw` faz em C++?

- [ ] Encerra o programa imediatamente, sem possibilidade de tratamento
- [x] Lança uma exceção, interrompendo o fluxo normal até encontrar um `catch` compatível
- [ ] É equivalente a `return`
- [ ] Só pode ser usado dentro de um `catch`

> `throw` interrompe a execução normal e "propaga" a exceção lançada pela pilha de chamadas até
> encontrar um bloco `catch` que aceite aquele tipo (ou um tipo base dele) — se nenhum `catch`
> compatível for encontrado em lugar nenhum, o programa termina de forma abrupta.

### 2. Em uma cadeia de múltiplos `catch`, qual ordem é recomendada?

- [ ] Não importa a ordem, C++ escolhe automaticamente o mais específico
- [x] Do tipo mais específico para o mais genérico (por exemplo, exceções customizadas antes de `std::exception`)
- [ ] Sempre em ordem alfabética
- [ ] Do mais genérico para o mais específico

> C++ testa os blocos `catch` na ordem em que aparecem, usando o PRIMEIRO que seja compatível com
> o tipo da exceção lançada. Se um `catch` genérico (como `const exception &`) viesse antes de um
> mais específico, ele "capturaria" a exceção primeiro, e o `catch` mais específico nunca seria
> alcançado.

### 3. Por que herdar de `std::runtime_error` (ou outra classe de `<stdexcept>`) ao criar uma exceção customizada é conveniente?

- [ ] Não traz nenhuma vantagem prática
- [x] Reaproveita a infraestrutura de guardar e expor uma mensagem via `.what()`, já testada pela biblioteca padrão
- [ ] É obrigatório em C++, exceções customizadas sem herança não compilam
- [ ] Torna a exceção mais rápida de lançar

> `std::runtime_error` já implementa o armazenamento da mensagem de erro e o método `.what()` para
> recuperá-la. Herdar dela (em vez de criar uma classe de exceção totalmente do zero) economiza
> código e garante compatibilidade com blocos `catch (const exception &e)` genéricos que já
> esperam essa interface padrão.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Exceções" na trilha de C++ do CodePath. Contexto: o capítulo explica try/catch/
> throw, múltiplos blocos catch e exceções customizadas herdando de std::runtime_error. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
