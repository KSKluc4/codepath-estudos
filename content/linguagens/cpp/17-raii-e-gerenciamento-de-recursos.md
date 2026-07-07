---
numero: 17
titulo: "RAII e gerenciamento de recursos"
nivel: "avancado"
objetivo: "Entender RAII como o padrão central de gerenciamento de recursos em C++."
duracao: 12
status: "completo"
---

## Conceito

RAII (Resource Acquisition Is Initialization — "aquisição de recurso é inicialização") é o padrão
mais importante de C++ para gerenciar recursos: memória, arquivos, conexões de rede, locks de
concorrência. A ideia é simples: adquira o recurso no construtor de um objeto, e libere-o no
destrutor. Como o destrutor roda automaticamente (mesmo se uma exceção for lançada no meio do
caminho), o recurso NUNCA fica "vazado" — smart pointers, `std::fstream` e `std::lock_guard` são
todos exemplos de RAII já prontos na biblioteca padrão.

## Sintaxe

```cpp
class GerenciadorDeArquivo {
private:
    FILE *arquivo;
public:
    GerenciadorDeArquivo(string nome) {
        arquivo = fopen(nome.c_str(), "r"); // adquire o recurso no construtor
    }
    ~GerenciadorDeArquivo() {
        if (arquivo) fclose(arquivo);        // libera no destrutor, sempre
    }
};

{
    GerenciadorDeArquivo g("dados.txt");
} // arquivo fechado automaticamente aqui, mesmo se algo der errado no meio
```

## Exemplos comentados

```cpp
#include <iostream>
#include <fstream>
#include <mutex>
using namespace std;

// std::fstream já é RAII: fecha o arquivo automaticamente no destrutor
void lerArquivo(string caminho) {
    ifstream arquivo(caminho); // "adquire" o arquivo aberto no construtor
    if (!arquivo.is_open()) {
        cout << "Erro ao abrir" << endl;
        return;
    }

    string linha;
    while (getline(arquivo, linha)) {
        cout << linha << endl;
    }
} // arquivo fechado automaticamente ao sair da função, mesmo com um "return" antecipado

// std::lock_guard é RAII para locks de concorrência (evita "esquecer" de destravar)
mutex m;
void secaoCritica() {
    lock_guard<mutex> trava(m); // adquire o lock no construtor
    // ... código protegido ...
} // libera o lock automaticamente ao sair da função, mesmo se uma exceção for lançada

// Por que RAII é tão importante: SEM ele, seria necessário liberar manualmente
// em TODOS os caminhos possíveis de saída da função (return normal, exceção, break)
void semRAII(string caminho) {
    FILE *arquivo = fopen(caminho.c_str(), "r");
    if (arquivo == nullptr) return; // ok, nada para liberar ainda

    // ... se algo lançar uma exceção aqui, fclose NUNCA seria chamado! ...

    fclose(arquivo); // fácil esquecer em algum caminho de saída
}

// RAII em uma classe própria: um "temporizador" que imprime a duração automaticamente
class Temporizador {
private:
    string nome;
public:
    Temporizador(string n) : nome(n) {
        cout << "Iniciando " << nome << endl;
    }
    ~Temporizador() {
        cout << "Finalizando " << nome << endl; // rodaria mesmo em caso de exceção
    }
};

void processar() {
    Temporizador t("processamento");
    // ... trabalho que pode levar tempo, ou até lançar exceção ...
} // "Finalizando processamento" sempre impresso ao sair, de qualquer forma
```

## Exercício 1: Implemente RAII para um recurso simulado

Crie uma classe `ConexaoSimulada` que imprime `"Conectando..."` no construtor e
`"Desconectando..."` no destrutor, e demonstre que a desconexão acontece automaticamente mesmo se
uma exceção for lançada no meio de uma função que usa a conexão.

### Solução

```cpp
#include <iostream>
#include <stdexcept>
using namespace std;

class ConexaoSimulada {
public:
    ConexaoSimulada() {
        cout << "Conectando..." << endl;
    }
    ~ConexaoSimulada() {
        cout << "Desconectando..." << endl;
    }
};

void processarComFalha() {
    ConexaoSimulada conexao;
    cout << "Processando dados..." << endl;
    throw runtime_error("Falha inesperada"); // erro no meio do processamento
    cout << "Isso nunca é impresso" << endl;
}

int main() {
    try {
        processarComFalha();
    } catch (const runtime_error &e) {
        cout << "Capturado: " << e.what() << endl;
    }
    return 0;
}
// Saída:
// Conectando...
// Processando dados...
// Desconectando...   <- destrutor roda MESMO com a exceção interrompendo o fluxo
// Capturado: Falha inesperada
```

Mesmo com o `throw` interrompendo `processarComFalha` antes de qualquer código de "limpeza"
manual, o destrutor de `conexao` é chamado automaticamente durante o processo de "desenrolar a
pilha" (stack unwinding) que ocorre ao propagar uma exceção — é exatamente esse comportamento
garantido que torna RAII confiável até em caminhos de erro.

## Exercício 2: Compare com e sem RAII

Explique, em suas próprias palavras, por que a versão `semRAII` do exemplo é mais arriscada que
usar uma classe RAII (ou um smart pointer) para o mesmo propósito.

### Solução

A versão `semRAII` chama `fopen` e depende de um `fclose` manual antes de CADA caminho possível de
saída da função — um `return` antecipado, uma exceção lançada no meio, ou até um `break`/`continue`
mal posicionado em versões mais complexas poderiam pular o `fclose`, vazando o descritor de
arquivo aberto.

Com RAII (como `std::ifstream`, ou uma classe própria com o padrão construtor/destrutor), a
liberação do recurso está amarrada ao **ciclo de vida do objeto**, não a um ponto específico do
código — não importa por qual caminho a função termine (normal, exceção, `return` antecipado), o
destrutor sempre roda quando o objeto sai de escopo, tornando impossível esquecer de liberar o
recurso.

## Quiz

### 1. O que RAII propõe, resumidamente?

- [ ] Nunca usar ponteiros em C++
- [x] Adquirir um recurso no construtor de um objeto e liberá-lo no destrutor, amarrando o ciclo de vida do recurso ao do objeto
- [ ] Sempre usar exceções para tratar erros
- [ ] É um recurso exclusivo de smart pointers, não um padrão geral

> RAII é o princípio de design central de C++ para gerenciamento seguro de recursos: como o
> destrutor de um objeto sempre roda quando ele sai de escopo (mesmo com exceções), amarrar a
> liberação de um recurso a esse destrutor garante que ele nunca fique "vazado", sem precisar de
> `finally` ou liberação manual em cada caminho de saída.

### 2. Por que `std::lock_guard` é considerado um exemplo de RAII?

- [ ] Porque ele nunca libera o lock automaticamente
- [x] Porque ele adquire o lock no construtor e o libera automaticamente no destrutor, mesmo se uma exceção ocorrer
- [ ] Porque é implementado usando templates
- [ ] Porque só funciona com um único tipo de mutex

> `lock_guard<mutex> trava(m);` trava o mutex `m` assim que é criado, e destrava automaticamente
> quando `trava` sai de escopo — seguindo exatamente o mesmo padrão de "adquirir no construtor,
> liberar no destrutor" que caracteriza RAII, evitando que um erro esquecido de "destravar
> manualmente" trave o programa indefinidamente.

### 3. O que acontece com objetos locais (na stack) quando uma exceção é lançada e propagada por uma função?

- [ ] Eles permanecem na memória até o programa terminar
- [x] Seus destrutores são chamados automaticamente durante o processo de "desenrolar a pilha" (stack unwinding)
- [ ] A exceção é ignorada silenciosamente
- [ ] O programa trava imediatamente, sem chance de tratamento

> Ao propagar uma exceção, C++ "desenrola" a pilha de chamadas, saindo de cada função no caminho —
> e, ao sair de cada escopo, os destrutores dos objetos locais daquele escopo são chamados
> normalmente, exatamente como aconteceria em uma saída de função comum. É esse comportamento que
> torna RAII confiável mesmo em cenários de erro.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "RAII e gerenciamento de recursos" na trilha de C++ do CodePath. Contexto: o
> capítulo explica o padrão RAII, exemplos como fstream/lock_guard, e como destrutores rodam mesmo
> com exceções. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
