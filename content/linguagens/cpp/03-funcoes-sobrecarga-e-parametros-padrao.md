---
numero: 3
titulo: "Funções: sobrecarga e parâmetros padrão"
nivel: "basico"
objetivo: "Declarar múltiplas versões de uma função (overloading) e parâmetros com valor padrão."
duracao: 10
status: "completo"
---

## Conceito

C++ permite **sobrecarga de funções** (function overloading): várias funções com o mesmo nome,
desde que tenham assinaturas diferentes (número ou tipo de parâmetros diferente). O compilador
escolhe automaticamente qual versão chamar, baseado nos argumentos passados. C++ também permite
**parâmetros com valor padrão**, assim como Python, algo que C puro não suporta nativamente.

## Sintaxe

```cpp
int somar(int a, int b) {
    return a + b;
}

double somar(double a, double b) {  // mesmo nome, tipos diferentes: sobrecarga válida
    return a + b;
}

void saudacao(string nome = "visitante") {  // parâmetro com valor padrão
    cout << "Olá, " << nome << "!" << endl;
}
```

## Exemplos comentados

```cpp
#include <iostream>
using namespace std;

// Sobrecarga por número de parâmetros
int somar(int a, int b) {
    return a + b;
}
int somar(int a, int b, int c) {
    return a + b + c;
}

// Sobrecarga por tipo de parâmetros
double somar(double a, double b) {
    return a + b;
}

int main() {
    cout << somar(2, 3) << endl;         // 5 — chama a versão com 2 ints
    cout << somar(2, 3, 4) << endl;       // 9 — chama a versão com 3 ints
    cout << somar(2.5, 3.5) << endl;       // 6.0 — chama a versão com double

    // Parâmetros com valor padrão: só podem vir DEPOIS dos parâmetros obrigatórios
    auto criarUsuario = [](string nome, int idade, bool ativo = true) {
        cout << nome << ", " << idade << " anos, ativo: " << ativo << endl;
    };
    criarUsuario("Ana", 28);          // usa ativo = true por padrão
    criarUsuario("Bia", 25, false);    // sobrescreve o padrão

    return 0;
}

// Função com múltiplos parâmetros padrão
void configurar(int largura = 800, int altura = 600, string titulo = "App") {
    cout << titulo << ": " << largura << "x" << altura << endl;
}
// configurar();                 // usa todos os padrões
// configurar(1024);             // só largura é customizada
// configurar(1024, 768);        // largura e altura customizadas
```

## Exercício 1: Sobrecarregue uma função de área

Escreva duas versões sobrecarregadas de `area`: `double area(double lado)` para um quadrado, e
`double area(double largura, double altura)` para um retângulo.

### Solução

```cpp
#include <iostream>
using namespace std;

double area(double lado) {
    return lado * lado;
}

double area(double largura, double altura) {
    return largura * altura;
}

int main() {
    cout << area(4) << endl;        // 16 — versão de um parâmetro (quadrado)
    cout << area(4, 5) << endl;      // 20 — versão de dois parâmetros (retângulo)
    return 0;
}
```

O compilador escolhe automaticamente qual `area` chamar baseado em quantos argumentos são
passados na chamada — `area(4)` só combina com a assinatura de um parâmetro, e `area(4, 5)` só
combina com a de dois.

## Exercício 2: Função com parâmetros padrão

Escreva uma função `void log(string mensagem, string nivel = "INFO")` que imprime
`"[NIVEL] mensagem"`, usando `"INFO"` como nível padrão quando não especificado.

### Solução

```cpp
#include <iostream>
using namespace std;

void log(string mensagem, string nivel = "INFO") {
    cout << "[" << nivel << "] " << mensagem << endl;
}

int main() {
    log("Servidor iniciado");             // [INFO] Servidor iniciado
    log("Falha na conexão", "ERROR");      // [ERROR] Falha na conexão
    return 0;
}
```

Como `nivel` tem um valor padrão, `log` pode ser chamada com um ou dois argumentos. O parâmetro
com valor padrão precisa vir depois dos parâmetros obrigatórios na assinatura — `mensagem` (sem
padrão) vem antes de `nivel` (com padrão).

## Quiz

### 1. O que caracteriza uma sobrecarga de função válida em C++?

- [ ] Duas funções com o mesmo nome e exatamente a mesma assinatura
- [x] Duas ou mais funções com o mesmo nome, mas com número ou tipos de parâmetros diferentes
- [ ] Só é possível sobrecarregar funções que retornam `void`
- [ ] Sobrecarga não existe em C++, apenas em outras linguagens

> Sobrecarga permite reutilizar o mesmo nome de função para operações conceitualmente
> relacionadas, mas com assinaturas diferentes — o compilador escolhe a versão correta baseado nos
> tipos e na quantidade de argumentos passados na chamada. Ter o mesmo nome com assinatura
> IDÊNTICA seria um erro de redefinição, não uma sobrecarga válida.

### 2. Onde parâmetros com valor padrão devem ser posicionados na assinatura de uma função?

- [ ] Sempre no início, antes dos parâmetros obrigatórios
- [x] Depois de todos os parâmetros obrigatórios (sem valor padrão)
- [ ] Em qualquer posição, a ordem não importa
- [ ] C++ não suporta parâmetros com valor padrão

> Parâmetros com valor padrão precisam vir por último na lista, depois de todos os parâmetros
> obrigatórios — isso porque, ao omitir argumentos em uma chamada, C++ preenche da direita para a
> esquerda, então os parâmetros "opcionais" precisam estar no final.

### 3. Como o compilador decide qual versão sobrecarregada de uma função chamar?

- [ ] Sempre chama a primeira versão declarada no arquivo
- [x] Compara o número e os tipos dos argumentos passados na chamada com as assinaturas disponíveis
- [ ] Pergunta ao usuário em tempo de execução
- [ ] É aleatório

> A resolução de sobrecarga acontece em tempo de compilação: o compilador analisa os argumentos da
> chamada (quantos são, e de que tipo) e escolhe a assinatura de função que melhor corresponde —
> se nenhuma corresponder de forma inequívoca, é um erro de compilação (chamada ambígua).

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Funções: sobrecarga e parâmetros padrão" na trilha de C++ do CodePath. Contexto:
> o capítulo explica sobrecarga de funções (overloading) e parâmetros com valor padrão. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
