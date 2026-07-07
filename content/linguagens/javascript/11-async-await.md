---
numero: 11
titulo: "Async/await"
nivel: "intermediario"
objetivo: "Escrever código assíncrono de forma linear com async/await."
duracao: 12
status: "completo"
---

## Conceito

`async`/`await` é uma forma mais legível de trabalhar com Promises, escrita como se fosse código
síncrono (de cima para baixo), mesmo sendo assíncrono por baixo dos panos. Toda função marcada com
`async` retorna automaticamente uma Promise, e dentro dela `await` "pausa" a execução até a Promise
ser resolvida — sem bloquear o restante da página.

## Sintaxe

```javascript
async function buscarDados() {
  const resultado = await algumaPromise();
  console.log(resultado);
  return resultado;
}

// Equivalente com arrow function
const buscarDados2 = async () => {
  const resultado = await algumaPromise();
  return resultado;
};

// await só pode ser usado dentro de uma função async
```

## Exemplos comentados

```javascript
function buscarUsuario(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, nome: "Ana" }), 500);
  });
}

// Versão com .then() (capítulo anterior)
function versaoComPromise() {
  buscarUsuario(1).then((usuario) => console.log(usuario));
}

// Mesma lógica com async/await — mais parecida com código síncrono
async function versaoComAwait() {
  const usuario = await buscarUsuario(1);
  console.log(usuario);
}

// Tratamento de erros: try/catch em vez de .catch()
async function buscarComTratamento(id) {
  try {
    const usuario = await buscarUsuario(id);
    return usuario;
  } catch (erro) {
    console.error("Erro ao buscar usuário:", erro.message);
    return null;
  }
}

// Múltiplas chamadas em sequência (uma espera a outra terminar)
async function buscarEmSequencia() {
  const usuario1 = await buscarUsuario(1); // espera terminar...
  const usuario2 = await buscarUsuario(2); // ...antes de começar essa
  return [usuario1, usuario2];
}

// Múltiplas chamadas em paralelo (mais rápido quando não dependem uma da outra)
async function buscarEmParalelo() {
  const [usuario1, usuario2] = await Promise.all([
    buscarUsuario(1),
    buscarUsuario(2),
  ]);
  return [usuario1, usuario2];
}

// Uma função async SEMPRE retorna uma Promise, mesmo que o return seja um valor simples
async function retornaNumero() {
  return 42;
}
retornaNumero().then((valor) => console.log(valor)); // 42
```

## Exercício 1: Converta de .then() para async/await

Reescreva o código abaixo usando `async`/`await` em vez de `.then()`/`.catch()`:

```javascript
function carregarPerfil(id) {
  buscarUsuario(id)
    .then((usuario) => console.log("Perfil:", usuario))
    .catch((erro) => console.log("Falhou:", erro.message));
}
```

### Solução

```javascript
async function carregarPerfil(id) {
  try {
    const usuario = await buscarUsuario(id);
    console.log("Perfil:", usuario);
  } catch (erro) {
    console.log("Falhou:", erro.message);
  }
}
```

A lógica é a mesma, mas a leitura fica mais linear: `await buscarUsuario(id)` "pausa" até a
Promise resolver e devolve o valor diretamente, como se fosse uma chamada síncrona. Erros que
antes cairiam no `.catch()` agora são capturados pelo `catch` de um `try/catch` normal.

## Exercício 2: Busque dados em paralelo

Dada a função `buscarUsuario(id)` do exemplo, escreva uma função assíncrona `buscarTres()` que
busca os usuários de id 1, 2 e 3 **em paralelo** (não um depois do outro) e retorna um array com os
três resultados.

### Solução

```javascript
async function buscarTres() {
  const resultados = await Promise.all([
    buscarUsuario(1),
    buscarUsuario(2),
    buscarUsuario(3),
  ]);
  return resultados;
}

buscarTres().then((usuarios) => console.log(usuarios));
```

Se o código usasse três `await buscarUsuario(...)` em sequência, cada chamada esperaria a anterior
terminar antes de começar, mesmo que fossem independentes entre si. Envolvendo as três chamadas em
`Promise.all`, todas começam ao mesmo tempo, e o `await` só espera a mais lenta delas terminar —
bem mais rápido no total.

## Quiz

### 1. O que uma função declarada com `async` sempre retorna?

- [ ] O valor literal do `return`, sem nenhuma transformação
- [x] Uma Promise, que resolve com o valor do `return` (ou rejeita se um erro for lançado)
- [ ] `undefined`, sempre
- [ ] Um array de resultados

> Toda função `async` retorna implicitamente uma Promise. Se a função faz `return valor`, a
> Promise resolvida vale `valor`. Se uma exceção é lançada dentro dela, a Promise é rejeitada com
> essa exceção.

### 2. Onde a palavra-chave `await` pode ser usada?

- [ ] Em qualquer lugar do código JavaScript
- [x] Apenas dentro de uma função marcada com `async` (ou no nível superior de módulos ES modernos)
- [ ] Apenas dentro de um `.then()`
- [ ] Apenas em event listeners

> `await` só é válido dentro do corpo de uma função `async` — usá-lo fora disso é um erro de
> sintaxe (com a exceção de "top-level await" em módulos ES, um recurso mais recente e específico).

### 3. Por que `await buscarUsuario(1); await buscarUsuario(2);` (em sequência) pode ser mais lento que usar `Promise.all`?

- [ ] Não há diferença de velocidade entre as duas formas
- [x] Em sequência, a segunda chamada só começa depois que a primeira termina completamente
- [ ] `Promise.all` sempre falha se houver mais de duas promises
- [ ] `await` em sequência sempre lança erro

> Cada `await` pausa a função até aquela Promise específica resolver antes de seguir para a
> próxima linha. Se as chamadas são independentes entre si, isso desperdiça tempo esperando uma
> terminar para só então começar a outra. `Promise.all` inicia todas ao mesmo tempo, e o tempo
> total é aproximadamente o da mais lenta, não a soma de todas.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Async/await" na trilha de JavaScript/TypeScript do CodePath. Contexto: o
> capítulo explica async/await, try/catch para erros assíncronos, e execução em sequência vs.
> paralelo com Promise.all. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
