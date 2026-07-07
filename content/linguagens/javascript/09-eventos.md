---
numero: 9
titulo: "Eventos"
nivel: "intermediario"
objetivo: "Reagir a interações do usuário com event listeners."
duracao: 12
status: "completo"
---

## Conceito

Eventos são a forma de uma página reagir a ações do usuário (clique, digitação, envio de
formulário) ou do navegador (página carregada, janela redimensionada). Em vez de o JavaScript
"ficar checando" o tempo todo, você registra um **event listener**: uma função que só roda quando o
evento específico acontece.

## Sintaxe

```javascript
const botao = document.querySelector("#meuBotao");

botao.addEventListener("click", function () {
  console.log("Botão clicado!");
});

// Com arrow function
botao.addEventListener("click", () => console.log("Clicado!"));

// Remover um listener (precisa referenciar a mesma função)
function aoClicar() {
  console.log("Clique!");
}
botao.addEventListener("click", aoClicar);
botao.removeEventListener("click", aoClicar);
```

## Exemplos comentados

```javascript
// O objeto "event" carrega informações sobre o evento
document.querySelector("#form").addEventListener("submit", (event) => {
  event.preventDefault();  // impede o comportamento padrão (recarregar a página)
  console.log("Formulário enviado sem recarregar!");
});

document.addEventListener("keydown", (event) => {
  console.log(event.key); // qual tecla foi pressionada
  if (event.key === "Enter") {
    console.log("Enter pressionado");
  }
});

// event.target é o elemento que efetivamente disparou o evento
document.querySelector("#lista").addEventListener("click", (event) => {
  console.log("Clicou em:", event.target.textContent);
});

// Eventos comuns: click, input, change, submit, keydown, mouseover, load
const campo = document.querySelector("#busca");
campo.addEventListener("input", (event) => {
  console.log("Valor atual:", event.target.value); // roda a cada tecla digitada
});

// Delegação de eventos: registrar UM listener no elemento pai em vez de
// um em cada filho (útil quando os filhos são criados dinamicamente)
document.querySelector("#lista").addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    event.target.classList.toggle("concluido");
  }
});
```

## Exercício 1: Contador de cliques

Supondo `<button id="contador">Cliques: 0</button>` na página, escreva o JavaScript que incrementa
o número no texto do botão a cada clique.

### Solução

```javascript
let cliques = 0;
const botao = document.querySelector("#contador");

botao.addEventListener("click", () => {
  cliques += 1;
  botao.textContent = `Cliques: ${cliques}`;
});
```

A variável `cliques` fica "presa" (closure) dentro da função registrada como listener, mantendo seu
valor entre os cliques. A cada clique, o listener incrementa o contador e atualiza o texto do botão
com um template literal.

## Exercício 2: Valide um formulário antes de enviar

Supondo um formulário `<form id="cadastro"><input id="nome" /></form>`, escreva código que impede o
envio do formulário (usando `preventDefault`) e mostra um alerta se o campo `nome` estiver vazio.

### Solução

```javascript
document.querySelector("#cadastro").addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = document.querySelector("#nome").value.trim();
  if (nome === "") {
    alert("O campo nome é obrigatório");
    return;
  }

  console.log("Formulário válido, enviando:", nome);
});
```

`event.preventDefault()` sempre roda primeiro, para impedir o comportamento padrão de recarregar a
página independentemente do resultado da validação. Depois, o código lê o valor do campo, remove
espaços com `trim()`, e decide se segue ou interrompe o processamento com `return`.

## Quiz

### 1. Para que serve `event.preventDefault()`?

- [ ] Remove o elemento da página
- [x] Impede o comportamento padrão do navegador para aquele evento (como recarregar ao enviar um formulário)
- [ ] Cancela todos os outros event listeners da página
- [ ] Só funciona com eventos de teclado

> Alguns eventos têm um comportamento padrão do navegador associado — por exemplo, enviar um
> `<form>` recarrega a página por padrão. `event.preventDefault()` cancela esse comportamento,
> permitindo que o JavaScript assuma o controle total (como validar e enviar via `fetch`).

### 2. O que `event.target` representa dentro de um listener?

- [ ] O elemento onde o listener foi registrado, sempre
- [x] O elemento específico que efetivamente disparou o evento
- [ ] O documento inteiro
- [ ] Uma lista de todos os elementos da página

> `event.target` é o elemento exato que originou o evento — útil especialmente na delegação de
> eventos, quando o listener está registrado em um elemento pai, mas você precisa saber em qual
> filho específico o usuário interagiu.

### 3. O que é "delegação de eventos"?

- [ ] Registrar um listener idêntico em cada elemento filho individualmente
- [x] Registrar um único listener no elemento pai, verificando `event.target` para saber qual filho foi acionado
- [ ] Um recurso que só funciona com o evento `click`
- [ ] Uma forma de desativar eventos temporariamente

> Delegação de eventos aproveita que eventos "borbulham" (bubbling) do elemento filho até os
> ancestrais. Em vez de adicionar um listener a cada item de uma lista (inclusive itens criados
> depois), registra-se um único listener no elemento pai, que verifica `event.target` para agir
> apenas quando o clique originou-se no filho certo.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Eventos" na trilha de JavaScript/TypeScript do CodePath. Contexto: o capítulo
> explica addEventListener, o objeto event, preventDefault e delegação de eventos. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
