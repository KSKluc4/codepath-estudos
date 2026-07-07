---
numero: 16
titulo: "Smart pointers"
nivel: "avancado"
objetivo: "Gerenciar memória automaticamente com unique_ptr e shared_ptr."
duracao: 15
status: "completo"
---

## Conceito

Smart pointers são objetos que "envolvem" um ponteiro comum e liberam a memória automaticamente
quando não são mais necessários, através de seu destrutor — eliminando a necessidade de chamar
`delete` manualmente (e o risco de esquecer, ou chamar duas vezes). `unique_ptr` representa posse
exclusiva de um recurso; `shared_ptr` permite que múltiplos donos compartilhem o mesmo recurso,
contando referências.

## Sintaxe

```cpp
#include <memory>

unique_ptr<int> p1 = make_unique<int>(42);  // dono único, liberado automaticamente
cout << *p1 << endl;                          // 42

shared_ptr<int> p2 = make_shared<int>(10);   // dono compartilhado, com contagem de referências
shared_ptr<int> p3 = p2;                       // agora dois donos do mesmo valor
```

## Exemplos comentados

```cpp
#include <iostream>
#include <memory>
using namespace std;

class Recurso {
public:
    string nome;
    Recurso(string n) : nome(n) { cout << "Criando " << nome << endl; }
    ~Recurso() { cout << "Destruindo " << nome << endl; }
};

int main() {
    // unique_ptr: posse exclusiva. Ao sair de escopo, delete é chamado automaticamente
    {
        unique_ptr<Recurso> r = make_unique<Recurso>("A");
        cout << r->nome << endl; // -> funciona igual a ponteiro comum
    } // "Destruindo A" automaticamente aqui, sem delete manual

    // unique_ptr NÃO pode ser copiado (só um dono é permitido)
    unique_ptr<Recurso> r1 = make_unique<Recurso>("B");
    // unique_ptr<Recurso> r2 = r1; // ERRO de compilação: cópia proibida

    // move transfere a posse (r1 fica vazio depois)
    unique_ptr<Recurso> r2 = move(r1);
    // r1 agora é nullptr; r2 é o novo dono

    // shared_ptr: múltiplos donos, com contagem de referências
    {
        shared_ptr<Recurso> s1 = make_shared<Recurso>("C");
        cout << s1.use_count() << endl; // 1
        {
            shared_ptr<Recurso> s2 = s1; // agora dois ponteiros compartilham o mesmo Recurso
            cout << s1.use_count() << endl; // 2
        } // s2 sai de escopo, contagem volta a 1 (Recurso ainda vivo, s1 ainda existe)
        cout << s1.use_count() << endl; // 1
    } // s1 sai de escopo, contagem chega a 0: "Destruindo C" acontece aqui

    // weak_ptr: referência que NÃO conta para a posse (evita ciclos de shared_ptr)
    shared_ptr<Recurso> forte = make_shared<Recurso>("D");
    weak_ptr<Recurso> fraco = forte; // não impede "D" de ser destruído quando "forte" sair de escopo

    return 0;
}
```

## Exercício 1: Use unique_ptr para gerenciar um objeto

Escreva um programa que cria um `unique_ptr<int>` com valor `100`, imprime o valor apontado, e
demonstre que a memória é liberada automaticamente ao sair de um bloco (usando a classe `Recurso`
do exemplo para observar o destrutor rodando).

### Solução

```cpp
#include <iostream>
#include <memory>
using namespace std;

class Recurso {
public:
    string nome;
    Recurso(string n) : nome(n) { cout << "Criando " << nome << endl; }
    ~Recurso() { cout << "Destruindo " << nome << endl; }
};

int main() {
    cout << "Início" << endl;
    {
        unique_ptr<Recurso> r = make_unique<Recurso>("Conexão");
        cout << "Usando " << r->nome << endl;
    } // destrutor chamado automaticamente aqui
    cout << "Fim" << endl;

    return 0;
}
// Saída:
// Início
// Criando Conexão
// Usando Conexão
// Destruindo Conexão
// Fim
```

Sem nenhum `delete` explícito, o destrutor de `Recurso` roda automaticamente assim que `r` sai de
escopo — `unique_ptr` garante isso através do próprio destrutor DELE, que chama `delete` no
ponteiro interno que gerencia.

## Exercício 2: Compartilhe um recurso com shared_ptr

Escreva um programa que cria um `shared_ptr<Recurso>`, imprime `use_count()` antes e depois de
criar uma segunda referência a ele em um bloco interno, demonstrando a contagem subindo e descendo.

### Solução

```cpp
#include <iostream>
#include <memory>
using namespace std;

class Recurso {
public:
    string nome;
    Recurso(string n) : nome(n) {}
};

int main() {
    shared_ptr<Recurso> principal = make_shared<Recurso>("Config");
    cout << principal.use_count() << endl; // 1

    {
        shared_ptr<Recurso> copia = principal;
        cout << principal.use_count() << endl; // 2
    } // "copia" sai de escopo, mas "Config" continua vivo (principal ainda existe)

    cout << principal.use_count() << endl; // 1

    return 0;
}
```

`use_count()` reflete quantos `shared_ptr` diferentes apontam para o mesmo recurso naquele
momento. O objeto só é de fato destruído quando essa contagem chega a zero — ou seja, quando o
ÚLTIMO `shared_ptr` que o referenciava sai de escopo (ou é explicitamente resetado).

## Quiz

### 1. Qual a principal vantagem de usar `unique_ptr` em vez de um ponteiro comum com `new`/`delete` manual?

- [ ] `unique_ptr` é sempre mais rápido em tempo de execução
- [x] `unique_ptr` libera a memória automaticamente (via destrutor) ao sair de escopo, eliminando o risco de esquecer o `delete`
- [ ] `unique_ptr` permite múltiplos donos do mesmo recurso
- [ ] `unique_ptr` só funciona com tipos primitivos

> `unique_ptr` aplica o padrão RAII: a memória que ele gerencia é liberada automaticamente quando o
> `unique_ptr` é destruído (por exemplo, ao sair de escopo), eliminando a necessidade de lembrar de
> chamar `delete` manualmente — e os bugs que vêm de esquecer isso (memory leaks) ou fazer duas
> vezes (double free).

### 2. Por que `unique_ptr` não pode ser copiado, apenas movido (com `std::move`)?

- [ ] É uma limitação técnica sem propósito
- [x] Porque `unique_ptr` representa posse EXCLUSIVA: só pode existir um dono do recurso por vez
- [ ] Cópia de `unique_ptr` é permitida, a afirmação está incorreta
- [ ] Apenas `shared_ptr` pode ser instanciado, `unique_ptr` foi descontinuado

> Se `unique_ptr` pudesse ser copiado livremente, dois `unique_ptr` diferentes acabariam tentando
> liberar a MESMA memória em seus destrutores (double free). Por isso a cópia é proibida em tempo
> de compilação, e transferir a posse exige `std::move`, que deixa claro que o ponteiro original
> perde o acesso ao recurso.

### 3. O que `shared_ptr.use_count()` retorna?

- [ ] O valor apontado pelo ponteiro
- [x] Quantos `shared_ptr` diferentes estão compartilhando a posse do mesmo recurso naquele momento
- [ ] O tamanho em bytes do objeto apontado
- [ ] Sempre retorna 1

> `shared_ptr` mantém uma contagem de referências compartilhada entre todas as cópias que apontam
> para o mesmo recurso. `use_count()` consulta essa contagem — o recurso só é destruído
> automaticamente quando o último `shared_ptr` (contagem chega a zero) deixa de existir.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Smart pointers" na trilha de C++ do CodePath. Contexto: o capítulo explica
> unique_ptr (posse exclusiva), shared_ptr (posse compartilhada com use_count) e weak_ptr. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
