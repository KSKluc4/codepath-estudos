---
numero: 11
titulo: "Sobrecarga de operadores"
nivel: "intermediario"
objetivo: "Redefinir operadores como + e == para tipos definidos pelo usuário."
duracao: 12
status: "completo"
---

## Conceito

C++ permite redefinir o comportamento de operadores (`+`, `==`, `<<`, etc.) para tipos criados pelo
próprio programador, fazendo objetos de uma classe se comportarem de forma natural em expressões —
por exemplo, somar dois objetos `Ponto` com `p1 + p2`, em vez de escrever um método
`p1.somar(p2)`. É a mesma ideia dos métodos especiais (`__add__`, `__eq__`) vistos em Python.

## Sintaxe

```cpp
class Ponto {
public:
    double x, y;
    Ponto(double x, double y) : x(x), y(y) {}

    Ponto operator+(const Ponto &outro) {  // sobrecarga do operador +
        return Ponto(x + outro.x, y + outro.y);
    }
};

Ponto p1(1, 2), p2(3, 4);
Ponto soma = p1 + p2;  // chama operator+ automaticamente
```

## Exemplos comentados

```cpp
#include <iostream>
using namespace std;

class Ponto {
public:
    double x, y;
    Ponto(double x = 0, double y = 0) : x(x), y(y) {}

    // Sobrecarga de +
    Ponto operator+(const Ponto &outro) {
        return Ponto(x + outro.x, y + outro.y);
    }

    // Sobrecarga de == (comparação de igualdade)
    bool operator==(const Ponto &outro) {
        return x == outro.x && y == outro.y;
    }

    // Sobrecarga de << para permitir cout << ponto diretamente
    // precisa ser uma função "livre" (fora da classe), pois cout vem do lado esquerdo
    friend ostream& operator<<(ostream &saida, const Ponto &p) {
        saida << "(" << p.x << ", " << p.y << ")";
        return saida;
    }
};

int main() {
    Ponto p1(1, 2);
    Ponto p2(3, 4);

    Ponto soma = p1 + p2;    // usa operator+
    cout << soma << endl;      // usa operator<<, imprime "(4, 6)"

    if (p1 == Ponto(1, 2)) {  // usa operator==
        cout << "Pontos iguais" << endl;
    }

    return 0;
}

// Regra geral: sobrecarregue operadores só quando o significado é intuitivo
// e óbvio para quem lê o código (somar pontos = "+" faz sentido;
// "multiplicar" duas Pessoas provavelmente NÃO faria sentido nenhum)
```

## Exercício 1: Sobrecarregue o operador de igualdade

Adicione à classe `Ponto` do exemplo um `operator==` (se ainda não tiver) e demonstre comparando
dois pontos iguais e dois diferentes.

### Solução

```cpp
#include <iostream>
using namespace std;

class Ponto {
public:
    double x, y;
    Ponto(double x, double y) : x(x), y(y) {}

    bool operator==(const Ponto &outro) {
        return x == outro.x && y == outro.y;
    }
};

int main() {
    Ponto a(2, 3);
    Ponto b(2, 3);
    Ponto c(5, 5);

    cout << (a == b) << endl; // 1 (true)
    cout << (a == c) << endl; // 0 (false)

    return 0;
}
```

Sem sobrecarregar `operator==`, comparar dois objetos `Ponto` com `==` compararia os endereços de
memória (como ponteiros), quase sempre `false` mesmo para pontos com as mesmas coordenadas. A
sobrecarga redefine `==` para comparar o CONTEÚDO (`x` e `y`) de cada objeto.

## Exercício 2: Sobrecarregue o operador de multiplicação por escalar

Adicione à classe `Ponto` um `operator*(double escalar)` que multiplica `x` e `y` por um número, e
demonstre `Ponto(2, 3) * 2` resultando em `(4, 6)`.

### Solução

```cpp
#include <iostream>
using namespace std;

class Ponto {
public:
    double x, y;
    Ponto(double x, double y) : x(x), y(y) {}

    Ponto operator*(double escalar) {
        return Ponto(x * escalar, y * escalar);
    }

    friend ostream& operator<<(ostream &saida, const Ponto &p) {
        saida << "(" << p.x << ", " << p.y << ")";
        return saida;
    }
};

int main() {
    Ponto p(2, 3);
    Ponto resultado = p * 2;
    cout << resultado << endl; // (4, 6)
    return 0;
}
```

`operator*(double escalar)` define o que acontece quando um `Ponto` aparece do lado esquerdo de
`*` e um número do lado direito (`p * 2`). Multiplicar um ponto por um escalar é uma operação
geometricamente intuitiva, um bom candidato para sobrecarga de operador.

## Quiz

### 1. O que a sobrecarga de operadores permite fazer em C++?

- [ ] Criar novos operadores que não existem na linguagem, como `**`
- [x] Redefinir o comportamento de operadores existentes (como `+`, `==`) para tipos criados pelo programador
- [ ] Alterar o comportamento de `+` para tipos primitivos como `int`
- [ ] É um recurso exclusivo de C, não existe em C++

> Sobrecarga de operadores permite que classes definidas pelo programador respondam de forma
> natural a operadores como `+`, `==`, `<<`, tornando o código que as usa mais legível — mas não
> permite inventar operadores novos, nem alterar o comportamento desses operadores para tipos
> primitivos já existentes.

### 2. Por que `operator<<` (para permitir `cout << objeto`) costuma ser declarado como uma função `friend`, fora da classe?

- [ ] Porque `<<` não pode ser sobrecarregado de forma alguma
- [x] Porque `cout` (do tipo `ostream`) vem do lado ESQUERDO do operador, e não é um objeto da classe sendo sobrecarregada
- [ ] Porque funções `friend` são mais rápidas
- [ ] É apenas uma convenção de estilo, sem motivo técnico

> Operadores membro (`Ponto operator+(...)`) assumem que o objeto da própria classe está do lado
> ESQUERDO da expressão. Como em `cout << ponto` o `cout` (não um `Ponto`) está à esquerda, essa
> sobrecarga precisa ser uma função livre que recebe ambos os lados como parâmetros — `friend`
> permite que essa função externa acesse membros privados do `Ponto`, se necessário.

### 3. Qual seria um mau exemplo de uso de sobrecarga de operadores?

- [ ] Somar dois vetores matemáticos com `+`
- [ ] Comparar dois pontos com `==`
- [x] Usar `*` entre dois objetos `Pessoa` para significar "casar as duas pessoas"
- [ ] Concatenar strings customizadas com `+`

> Sobrecarga de operadores deve ser usada quando o significado do operador é intuitivo e esperado
> pelo tipo (somar vetores, comparar coordenadas). Usar `*` para uma operação sem relação óbvia com
> multiplicação (como "casar" duas pessoas) torna o código confuso e surpreendente para quem lê —
> um método nomeado explicitamente seria mais claro nesse caso.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Sobrecarga de operadores" na trilha de C++ do CodePath. Contexto: o capítulo
> explica operator+, operator==, operator<< com friend, e quando faz sentido sobrecarregar um
> operador. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
