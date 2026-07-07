---
numero: 8
titulo: "DOM básico"
nivel: "intermediario"
objetivo: "Selecionar e manipular elementos HTML a partir do JavaScript."
duracao: 12
status: "completo"
---

## Conceito

O DOM (Document Object Model) é a representação de uma página HTML como uma árvore de objetos que
o JavaScript pode ler e modificar. É assim que uma página se torna interativa: o JavaScript
seleciona elementos da árvore e altera seu conteúdo, atributos ou estilo, e o navegador redesenha a
tela automaticamente.

## Sintaxe

```javascript
// Selecionar elementos
document.getElementById("titulo");
document.querySelector(".card");        // primeiro elemento que casa com o seletor CSS
document.querySelectorAll(".card");      // TODOS os elementos que casam (NodeList)

// Ler e alterar conteúdo
const titulo = document.querySelector("#titulo");
titulo.textContent;                // lê o texto
titulo.textContent = "Novo título";  // altera o texto
```

## Exemplos comentados

```javascript
// HTML de exemplo:
// <div id="app">
//   <h1 id="titulo">Olá</h1>
//   <ul class="lista">
//     <li>Item 1</li>
//   </ul>
// </div>

const titulo = document.getElementById("titulo");
titulo.textContent = "Bem-vindo!";           // altera o texto (seguro contra HTML injection)
titulo.innerHTML = "<em>Bem-vindo!</em>";     // altera interpretando HTML (cuidado com dados de usuário)

// Classes CSS
titulo.classList.add("destaque");
titulo.classList.remove("destaque");
titulo.classList.toggle("ativo");   // adiciona se não tiver, remove se já tiver

// Atributos
titulo.setAttribute("data-id", "42");
titulo.getAttribute("data-id");      // "42"

// Criar e inserir elementos novos
const novoItem = document.createElement("li");
novoItem.textContent = "Item 2";
document.querySelector(".lista").appendChild(novoItem);

// Percorrer uma NodeList (resultado de querySelectorAll)
const itens = document.querySelectorAll("li");
itens.forEach((item) => console.log(item.textContent));

// Estilo direto (evitar para muitas mudanças — prefira classList quando possível)
titulo.style.color = "blue";

// Remover um elemento da página
novoItem.remove();
```

## Exercício 1: Altere o texto de um elemento

Supondo que existe um elemento `<p id="mensagem">Carregando...</p>` na página, escreva o
JavaScript que seleciona esse elemento e altera seu texto para `"Pronto!"`.

### Solução

```javascript
const mensagem = document.getElementById("mensagem");
mensagem.textContent = "Pronto!";
```

`getElementById` é a forma mais direta de selecionar um único elemento quando você conhece o `id`
dele. `textContent` altera apenas o texto visível, sem interpretar HTML — a forma mais segura
quando o novo conteúdo pode incluir dados vindos do usuário.

## Exercício 2: Adicione itens a uma lista dinamicamente

Dado um `<ul id="lista"></ul>` vazio na página e um array `frutas = ["Maçã", "Banana", "Uva"]`,
escreva o código que cria um `<li>` para cada fruta e os adiciona à lista.

### Solução

```javascript
const frutas = ["Maçã", "Banana", "Uva"];
const lista = document.getElementById("lista");

frutas.forEach((fruta) => {
  const item = document.createElement("li");
  item.textContent = fruta;
  lista.appendChild(item);
});
```

Para cada fruta do array, o código cria um novo elemento `<li>` com `createElement`, define seu
texto, e o anexa à lista existente com `appendChild`. Esse padrão — gerar elementos HTML a partir
de dados em JavaScript — é a base de qualquer interface dinâmica.

## Quiz

### 1. Qual a diferença entre `document.querySelector` e `document.querySelectorAll`?

- [ ] São idênticos, apenas nomes diferentes
- [x] `querySelector` retorna o primeiro elemento que casa; `querySelectorAll` retorna todos, em uma NodeList
- [ ] `querySelectorAll` só funciona com classes CSS
- [ ] `querySelector` não aceita seletores CSS complexos

> `querySelector` para na primeira correspondência encontrada e retorna um único elemento (ou
> `null`). `querySelectorAll` retorna uma `NodeList` com todos os elementos que casam com o
> seletor CSS informado, mesmo que seja apenas um ou nenhum.

### 2. Por que `textContent` costuma ser mais seguro que `innerHTML` ao inserir texto vindo do usuário?

- [ ] `textContent` é mais rápido de processar
- [x] `textContent` insere o texto literalmente, sem interpretar HTML/scripts, evitando injeção de código
- [ ] `innerHTML` não funciona em navegadores modernos
- [ ] Não há diferença de segurança entre os dois

> `innerHTML` interpreta a string como HTML, o que significa que um valor malicioso (por exemplo,
> contendo `<script>`) poderia ser executado na página — um ataque de XSS. `textContent` sempre
> trata o valor como texto puro, sem interpretar marcação.

### 3. O que `elemento.classList.toggle("ativo")` faz?

- [ ] Sempre adiciona a classe "ativo"
- [ ] Sempre remove a classe "ativo"
- [x] Adiciona a classe se ela não existir, ou remove se já existir
- [ ] Renomeia a classe do elemento

> `toggle()` alterna o estado da classe: se o elemento ainda não tiver a classe `"ativo"`, ela é
> adicionada; se já tiver, é removida. É muito usado para implementar comportamentos como abrir/
> fechar um menu.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "DOM básico" na trilha de JavaScript/TypeScript do CodePath. Contexto: o
> capítulo explica seleção de elementos (querySelector), manipulação de conteúdo/classes/atributos
> e criação de elementos. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
