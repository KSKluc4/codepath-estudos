---
numero: 10
titulo: "Promises"
nivel: "intermediario"
objetivo: "Lidar com operações assíncronas usando Promises."
duracao: 12
status: "completo"
---

## Conceito

Uma Promise representa um valor que ainda não existe, mas vai existir no futuro — o resultado de
uma operação assíncrona, como buscar dados de um servidor. Ela tem três estados: **pending**
(pendente, ainda rodando), **fulfilled** (concluída com sucesso) e **rejected** (falhou). Promises
resolveram o problema do "callback hell" das versões antigas de JavaScript, permitindo encadear
operações assíncronas de forma mais legível.

## Sintaxe

```javascript
const promessa = new Promise((resolve, reject) => {
  const sucesso = true;
  if (sucesso) {
    resolve("Deu certo!");
  } else {
    reject("Deu errado!");
  }
});

promessa
  .then((resultado) => console.log(resultado))   // roda se resolve() foi chamado
  .catch((erro) => console.log(erro))              // roda se reject() foi chamado
  .finally(() => console.log("Sempre roda"));       // roda em ambos os casos
```

## Exemplos comentados

```javascript
function buscarUsuario(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, nome: "Ana" });
      } else {
        reject(new Error("ID inválido"));
      }
    }, 1000); // simula uma operação demorada (como uma requisição de rede)
  });
}

buscarUsuario(1)
  .then((usuario) => console.log(usuario))
  .catch((erro) => console.error(erro.message));

// Encadeando várias Promises: cada .then() recebe o resultado do anterior
buscarUsuario(1)
  .then((usuario) => buscarPedidos(usuario.id))  // suponha que retorna outra Promise
  .then((pedidos) => console.log(pedidos))
  .catch((erro) => console.error("Algo falhou na cadeia:", erro));

// Promise.all: espera TODAS as promises terminarem (rejeita se qualquer uma falhar)
Promise.all([buscarUsuario(1), buscarUsuario(2)]).then(([usuario1, usuario2]) => {
  console.log(usuario1, usuario2);
});

// Promise.race: resolve/rejeita assim que a PRIMEIRA terminar
Promise.race([buscarUsuario(1), buscarUsuario(2)]).then((primeiro) => {
  console.log("Primeiro a terminar:", primeiro);
});

// Muitas APIs modernas do navegador já retornam Promises nativamente
fetch("https://api.exemplo.com/dados").then((resposta) => resposta.json());
```

## Exercício 1: Crie uma Promise de temporizador

Escreva uma função `esperar(ms)` que retorna uma Promise que resolve (sem nenhum valor) depois de
`ms` milissegundos, usando `setTimeout`.

### Solução

```javascript
function esperar(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

esperar(1000).then(() => console.log("1 segundo se passou"));
```

Como não é preciso rejeitar essa Promise (ela sempre "dá certo", só demora), o parâmetro `reject`
do executor nem precisa ser declarado. `setTimeout(resolve, ms)` chama `resolve()` diretamente
quando o tempo passa, sem argumentos.

## Exercício 2: Trate erros em uma cadeia de Promises

Dada a função `buscarUsuario` do exemplo, escreva um código que busca o usuário com `id = -1`
(inválido) e trata o erro imprimindo `"Erro ao buscar usuário: <mensagem>"`.

### Solução

```javascript
function buscarUsuario(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({ id, nome: "Ana" });
      } else {
        reject(new Error("ID inválido"));
      }
    }, 500);
  });
}

buscarUsuario(-1)
  .then((usuario) => console.log(usuario))
  .catch((erro) => console.log(`Erro ao buscar usuário: ${erro.message}`));
// "Erro ao buscar usuário: ID inválido"
```

Quando `id` é `-1`, a Promise chama `reject(new Error(...))`, o que faz a execução pular
diretamente o `.then()` e cair no `.catch()` mais próximo na cadeia — exatamente como um
`try/except` faria em Python.

## Quiz

### 1. Quais são os três estados possíveis de uma Promise?

- [ ] "iniciada", "pausada", "finalizada"
- [x] "pending", "fulfilled" e "rejected"
- [ ] "true", "false" e "null"
- [ ] "loading", "success" e "error" (esses não são os nomes oficiais dos estados)

> Toda Promise começa em `pending` (pendente). Quando a operação assíncrona termina com sucesso,
> ela vira `fulfilled` (e dispara os `.then()`); se falha, vira `rejected` (e dispara os
> `.catch()`).

### 2. O que `.catch()` captura em uma cadeia de `.then()`?

- [ ] Apenas erros de sintaxe do próprio JavaScript
- [x] Qualquer rejeição (reject) ou erro lançado em qualquer `.then()` anterior na cadeia
- [ ] Só o erro do primeiro `.then()`
- [ ] `.catch()` não pode ser usado depois de mais de um `.then()`

> `.catch()` funciona como uma "rede de segurança" para toda a cadeia acima dele: se qualquer
> `.then()` anterior rejeitar ou lançar uma exceção, a execução pula diretamente para o `.catch()`
> mais próximo, ignorando os `.then()` intermediários.

### 3. O que `Promise.all([p1, p2])` faz se `p2` for rejeitada?

- [ ] Ignora a rejeição e continua normalmente com o resultado de `p1`
- [x] A Promise resultante de `Promise.all` também é rejeitada, com o motivo de `p2`
- [ ] Espera indefinidamente até `p2` resolver
- [ ] Lança um erro de sintaxe

> `Promise.all` só resolve com sucesso se TODAS as promises do array resolverem. Se qualquer uma
> delas rejeitar, `Promise.all` rejeita imediatamente com o motivo daquela falha, mesmo que as
> outras ainda estejam pendentes.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Promises" na trilha de JavaScript/TypeScript do CodePath. Contexto: o capítulo
> explica os estados de uma Promise, then/catch/finally e Promise.all/Promise.race. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
