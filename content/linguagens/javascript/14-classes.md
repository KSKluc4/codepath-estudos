---
numero: 14
titulo: "Classes"
nivel: "intermediario"
objetivo: "Modelar objetos com classes, construtores e herança em JavaScript."
duracao: 12
status: "completo"
---

## Conceito

Classes em JavaScript são, por baixo dos panos, "açúcar sintático" sobre o sistema de protótipos da
linguagem — mas a sintaxe é muito parecida com a de outras linguagens orientadas a objeto. Uma
classe define um construtor (`constructor`) e métodos que toda instância criada com `new` vai ter
acesso.

## Sintaxe

```javascript
class Pessoa {
  constructor(nome, idade) {
    this.nome = nome;
    this.idade = idade;
  }

  apresentar() {
    return `Oi, eu sou ${this.nome} e tenho ${this.idade} anos`;
  }
}

const ana = new Pessoa("Ana", 28);
console.log(ana.apresentar()); // "Oi, eu sou Ana e tenho 28 anos"
```

## Exemplos comentados

```javascript
class ContaBancaria {
  // Campo estático: compartilhado pela classe, não por instância
  static banco = "Banco CodePath";

  // Campo de instância com valor padrão
  saldo = 0;

  constructor(titular, saldoInicial = 0) {
    this.titular = titular;
    this.saldo = saldoInicial;
  }

  depositar(valor) {
    this.saldo += valor;
  }

  sacar(valor) {
    if (valor > this.saldo) {
      console.log("Saldo insuficiente");
      return;
    }
    this.saldo -= valor;
  }

  // getter: acessado como propriedade, sem parênteses
  get saldoFormatado() {
    return `R$${this.saldo.toFixed(2)}`;
  }
}

const conta = new ContaBancaria("Bia", 100);
conta.depositar(50);
console.log(conta.saldoFormatado); // "R$150.00"
console.log(ContaBancaria.banco);   // "Banco CodePath"

// Herança com extends e super()
class ContaPoupanca extends ContaBancaria {
  constructor(titular, saldoInicial, taxaJuros) {
    super(titular, saldoInicial); // chama o construtor da classe pai
    this.taxaJuros = taxaJuros;
  }

  renderJuros() {
    this.depositar(this.saldo * this.taxaJuros); // reaproveita o método herdado
  }
}

const poupanca = new ContaPoupanca("Carlos", 1000, 0.01);
poupanca.renderJuros();
console.log(poupanca.saldo); // 1010

// Campos privados (prefixo #), acessíveis só de dentro da classe
class Cofre {
  #senha;

  constructor(senha) {
    this.#senha = senha;
  }

  verificar(tentativa) {
    return tentativa === this.#senha;
  }
}
const cofre = new Cofre("1234");
cofre.verificar("1234"); // true
// cofre.#senha; // SyntaxError: campo privado, inacessível de fora da classe
```

## Exercício 1: Modele um retângulo

Crie uma classe `Retangulo` com propriedades `largura` e `altura` definidas no construtor, e
métodos `area()` e `perimetro()`.

### Solução

```javascript
class Retangulo {
  constructor(largura, altura) {
    this.largura = largura;
    this.altura = altura;
  }

  area() {
    return this.largura * this.altura;
  }

  perimetro() {
    return 2 * (this.largura + this.altura);
  }
}

const r = new Retangulo(4, 5);
console.log(r.area());       // 20
console.log(r.perimetro());  // 18
```

Assim como em outras linguagens orientadas a objeto, cada instância criada com `new Retangulo(...)`
tem seus próprios valores de `largura` e `altura`, independentes de qualquer outra instância.

## Exercício 2: Crie uma subclasse com herança

Dada a classe `Animal` abaixo, crie uma classe `Cachorro` que herda dela e sobrescreve o método
`fazerSom()` para retornar `"Au au!"`.

```javascript
class Animal {
  constructor(nome) {
    this.nome = nome;
  }

  fazerSom() {
    return "...";
  }
}
```

### Solução

```javascript
class Animal {
  constructor(nome) {
    this.nome = nome;
  }

  fazerSom() {
    return "...";
  }
}

class Cachorro extends Animal {
  fazerSom() {
    return "Au au!";
  }
}

const rex = new Cachorro("Rex");
console.log(rex.nome, rex.fazerSom()); // "Rex Au au!"
```

`Cachorro` não precisa declarar seu próprio `constructor` porque não adiciona nenhuma propriedade
nova além das que `Animal` já define — nesse caso, o JavaScript usa automaticamente o construtor da
classe pai. Sobrescrever `fazerSom()` na subclasse substitui a implementação herdada.

## Quiz

### 1. Para que serve `super(...)` dentro do construtor de uma subclasse?

- [ ] Cria uma instância separada da classe pai
- [x] Chama o construtor da classe pai, necessário antes de usar `this` em uma subclasse
- [ ] É opcional e nunca causa erro se omitido
- [ ] Só existe em versões antigas de JavaScript

> Em uma classe que usa `extends`, o construtor precisa chamar `super(...)` antes de poder usar
> `this` — é assim que o objeto "herda" a inicialização feita pela classe pai. Esquecer `super()`
> quando há um construtor customizado lança um erro em tempo de execução.

### 2. Como se declara um campo privado em uma classe JavaScript moderna?

- [ ] Prefixando o nome com `_` (underscore)
- [x] Prefixando o nome com `#`
- [ ] Usando a palavra-chave `private`
- [ ] Não é possível ter campos privados em JavaScript

> O prefixo `#` marca um campo (ou método) como verdadeiramente privado: ele só pode ser acessado
> de dentro da própria classe, e tentar acessá-lo de fora (`objeto.#campo`) é um erro de sintaxe,
> não apenas uma convenção como o `_` (que é só uma convenção visual, sem proteção real).

### 3. O que um `get` (getter) dentro de uma classe permite fazer?

- [ ] Definir um método que só pode ser chamado uma vez
- [x] Acessar um método como se fosse uma propriedade comum, sem usar parênteses
- [ ] Tornar a classe inteira somente leitura
- [ ] Substituir o construtor da classe

> Um getter transforma um método em algo acessado como propriedade: `objeto.saldoFormatado` em vez
> de `objeto.saldoFormatado()`. É útil para expor valores computados a partir de outros campos da
> classe, mantendo uma interface de uso simples.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Classes" na trilha de JavaScript/TypeScript do CodePath. Contexto: o capítulo
> explica constructor, herança com extends/super, campos estáticos/privados e getters. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
