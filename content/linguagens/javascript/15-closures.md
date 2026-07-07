---
numero: 15
titulo: "Closures"
nivel: "avancado"
objetivo: "Entender closures e como funções 'lembram' do escopo onde nasceram."
duracao: 15
status: "completo"
---

## Conceito

Uma closure acontece quando uma função "lembra" das variáveis do escopo onde foi criada, mesmo
depois que esse escopo já terminou de executar. Em JavaScript, toda função criada dentro de outra
função forma automaticamente uma closure sobre as variáveis do escopo externo — é um dos conceitos
mais importantes (e mais usados sem perceber) da linguagem.

## Sintaxe

```javascript
function criarContador() {
  let contador = 0;              // variável "presa" na closure
  return function () {
    contador += 1;                // a função interna "lembra" de contador
    return contador;
  };
}

const incrementar = criarContador();
incrementar(); // 1
incrementar(); // 2
incrementar(); // 3 — o valor persiste entre chamadas, sem variável global
```

## Exemplos comentados

```javascript
// Cada chamada de criarContador() cria uma closure NOVA e independente
const contadorA = criarContador();
const contadorB = criarContador();
contadorA(); // 1
contadorA(); // 2
contadorB(); // 1 — contadorB tem seu PRÓPRIO "contador", separado de contadorA

// Closures são a base de "factory functions" (funções que criam funções configuradas)
function criarMultiplicador(fator) {
  return function (numero) {
    return numero * fator;
  };
}
const dobrar = criarMultiplicador(2);
const triplicar = criarMultiplicador(3);
dobrar(5);     // 10
triplicar(5);  // 15

// Closures também explicam por que o exemplo do capítulo de variáveis funciona:
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // cada callback "fecha" sobre o SEU PRÓPRIO i (let)
}

// Encapsulamento de estado "privado" com closures (antes de existirem campos # em classes)
function criarCofre(senhaInicial) {
  let senha = senhaInicial; // inacessível de fora, só através das funções retornadas
  return {
    verificar: (tentativa) => tentativa === senha,
    trocarSenha: (nova) => { senha = nova; },
  };
}
const cofre = criarCofre("1234");
cofre.verificar("1234"); // true
// não existe forma de acessar "senha" diretamente de fora

// Cuidado: closures dentro de loops podem prender referências "erradas" com var
for (var j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0); // imprime 3, 3, 3 — var não cria um j por iteração
}
```

## Exercício 1: Crie uma função que "lembra" de um valor

Escreva uma função `criarSaudacao(nome)` que retorna outra função, e ao ser chamada (sem
argumentos) retorna a string `"Olá, <nome>!"`, usando o `nome` capturado na closure.

### Solução

```javascript
function criarSaudacao(nome) {
  return function () {
    return `Olá, ${nome}!`;
  };
}

const saudarAna = criarSaudacao("Ana");
console.log(saudarAna()); // "Olá, Ana!"

const saudarBia = criarSaudacao("Bia");
console.log(saudarBia()); // "Olá, Bia!"
```

Cada chamada a `criarSaudacao` cria uma closure independente, "lembrando" do valor de `nome`
recebido naquela chamada específica — por isso `saudarAna` e `saudarBia` produzem resultados
diferentes, mesmo compartilhando a mesma definição de função interna.

## Exercício 2: Implemente um cache simples com closure

Escreva uma função `criarCache()` que retorna um objeto com dois métodos: `guardar(chave, valor)` e
`buscar(chave)`. Os dados devem ficar guardados em um objeto interno, inacessível diretamente de
fora da closure.

### Solução

```javascript
function criarCache() {
  const dados = {}; // "privado", só acessível pelos métodos retornados

  return {
    guardar(chave, valor) {
      dados[chave] = valor;
    },
    buscar(chave) {
      return dados[chave];
    },
  };
}

const cache = criarCache();
cache.guardar("usuario", { nome: "Ana" });
console.log(cache.buscar("usuario")); // { nome: "Ana" }
console.log(cache.buscar("inexistente")); // undefined
```

O objeto `dados` só existe dentro do escopo de `criarCache`, e as únicas formas de interagir com
ele são os métodos `guardar` e `buscar` retornados — que continuam "vendo" `dados` através da
closure, mesmo depois que `criarCache()` já terminou de executar.

## Quiz

### 1. O que é uma closure, em uma frase?

- [ ] Uma função que nunca retorna nenhum valor
- [x] Uma função que "lembra" e continua acessando as variáveis do escopo onde foi criada
- [ ] Um tipo especial de array
- [ ] Um erro comum de sintaxe em JavaScript

> Uma closure é formada sempre que uma função interna referencia variáveis do escopo da função
> externa que a criou — e continua tendo acesso a elas mesmo depois que a função externa já
> terminou de rodar.

### 2. No exemplo `criarContador`, por que `contadorA()` e `contadorB()` mantêm contagens independentes?

- [ ] Porque `contador` é uma variável global compartilhada
- [x] Porque cada chamada a `criarContador()` cria um novo escopo com sua própria variável `contador`
- [ ] Porque JavaScript reinicia todas as variáveis a cada segundo
- [ ] Isso não é verdade, elas sempre compartilham a mesma contagem

> Cada execução de `criarContador()` cria uma nova instância da variável local `contador`, e a
> função retornada forma uma closure sobre ESSA instância específica. `contadorA` e `contadorB`
> vêm de chamadas diferentes, então têm closures (e variáveis `contador`) completamente separadas.

### 3. Para que closures são frequentemente usadas na prática?

- [ ] Apenas para fazer contadores, sem outra utilidade real
- [x] Para encapsular estado "privado", criar factory functions e configurar comportamentos (como em callbacks)
- [ ] Para substituir completamente o uso de classes
- [ ] Apenas em código muito antigo, hoje evitadas

> Closures são usadas o tempo todo em JavaScript moderno: em callbacks de eventos, em hooks do
> React, para criar funções "pré-configuradas" (como `criarMultiplicador`), e para simular
> encapsulamento antes de recursos como campos privados (`#`) existirem em classes.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Closures" na trilha de JavaScript/TypeScript do CodePath. Contexto: o capítulo
> explica como funções internas capturam variáveis do escopo externo e usos práticos como
> contadores e encapsulamento. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
