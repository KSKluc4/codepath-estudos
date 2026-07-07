---
numero: 12
titulo: "Fetch"
nivel: "intermediario"
objetivo: "Fazer requisições HTTP a partir do navegador com a Fetch API."
duracao: 12
status: "completo"
---

## Conceito

`fetch()` é a API nativa do navegador (e do Node.js moderno) para fazer requisições HTTP —
buscar dados de uma API, enviar um formulário, etc. Ela retorna uma Promise, então combina
naturalmente com tudo o que foi visto nos dois capítulos anteriores. `fetch` resolve a Promise
assim que os **cabeçalhos** da resposta chegam — ler o corpo da resposta (como JSON) é um segundo
passo, também assíncrono.

## Sintaxe

```javascript
fetch("https://api.exemplo.com/usuarios")
  .then((resposta) => resposta.json())  // converte o corpo da resposta para JSON
  .then((dados) => console.log(dados))
  .catch((erro) => console.error(erro));

// Com async/await
async function buscarUsuarios() {
  const resposta = await fetch("https://api.exemplo.com/usuarios");
  const dados = await resposta.json();
  return dados;
}
```

## Exemplos comentados

```javascript
// GET é o método padrão, não precisa configurar nada extra
async function buscarUsuario(id) {
  const resposta = await fetch(`https://api.exemplo.com/usuarios/${id}`);
  return resposta.json();
}

// fetch NÃO rejeita a Promise em respostas de erro HTTP (404, 500) —
// só rejeita em falhas de rede. É preciso checar resposta.ok manualmente
async function buscarComTratamento(id) {
  const resposta = await fetch(`https://api.exemplo.com/usuarios/${id}`);
  if (!resposta.ok) {
    throw new Error(`Erro HTTP: ${resposta.status}`);
  }
  return resposta.json();
}

// POST: enviando dados como JSON
async function criarUsuario(dados) {
  const resposta = await fetch("https://api.exemplo.com/usuarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return resposta.json();
}

criarUsuario({ nome: "Ana", idade: 28 });

// PUT/DELETE seguem o mesmo padrão, mudando o "method"
fetch(`https://api.exemplo.com/usuarios/5`, { method: "DELETE" });

// Tratando erros de rede (ex: sem internet) com try/catch
async function buscarSeguro(url) {
  try {
    const resposta = await fetch(url);
    if (!resposta.ok) throw new Error(`Status ${resposta.status}`);
    return await resposta.json();
  } catch (erro) {
    console.error("Falha na requisição:", erro.message);
    return null;
  }
}
```

## Exercício 1: Busque e trate erros HTTP

Escreva uma função assíncrona `buscarPost(id)` que busca `https://api.exemplo.com/posts/${id}`, e
lança um erro com a mensagem `"Post não encontrado"` se a resposta não for `ok` (por exemplo, um
404).

### Solução

```javascript
async function buscarPost(id) {
  const resposta = await fetch(`https://api.exemplo.com/posts/${id}`);
  if (!resposta.ok) {
    throw new Error("Post não encontrado");
  }
  return resposta.json();
}
```

`fetch` só rejeita a Promise em problemas de conexão (sem internet, servidor fora do ar) — uma
resposta `404 Not Found` ainda é considerada uma resposta "bem-sucedida" do ponto de vista da
Promise. Por isso é preciso checar `resposta.ok` (verdadeiro para status 200-299) manualmente e
lançar um erro próprio quando necessário.

## Exercício 2: Envie dados com POST

Escreva uma função assíncrona `enviarComentario(postId, texto)` que envia um POST para
`https://api.exemplo.com/comentarios` com o corpo `{ postId, texto }` em JSON, e retorna os dados
da resposta.

### Solução

```javascript
async function enviarComentario(postId, texto) {
  const resposta = await fetch("https://api.exemplo.com/comentarios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId, texto }),
  });

  if (!resposta.ok) {
    throw new Error("Falha ao enviar comentário");
  }

  return resposta.json();
}
```

Três coisas são necessárias para um POST com corpo JSON: definir `method: "POST"`, informar o
cabeçalho `Content-Type: application/json` (para o servidor saber como interpretar o corpo), e
converter o objeto JavaScript para uma string JSON com `JSON.stringify()` antes de enviá-lo em
`body`.

## Quiz

### 1. Quando a Promise retornada por `fetch()` é rejeitada?

- [ ] Sempre que o servidor responde com status 404 ou 500
- [x] Apenas em falhas de rede (sem conexão, DNS não resolvido, etc.), não em respostas de erro HTTP
- [ ] Nunca é rejeitada, sob nenhuma circunstância
- [ ] Apenas quando se usa `async/await`, não com `.then()`

> `fetch` resolve a Promise assim que recebe QUALQUER resposta HTTP, mesmo um erro (404, 500). Ela
> só rejeita em falhas que impedem obter uma resposta, como problemas de rede. Por isso é sempre
> necessário checar `resposta.ok` manualmente para tratar erros HTTP.

### 2. Para que serve `resposta.json()`?

- [ ] Envia dados JSON para o servidor
- [x] Lê e converte o corpo da resposta HTTP de texto JSON para um objeto/array JavaScript
- [ ] Verifica se a resposta foi bem-sucedida
- [ ] Cancela a requisição em andamento

> O corpo de uma resposta HTTP chega como um stream de bytes; `resposta.json()` lê esse stream por
> completo e faz o parse do texto como JSON, retornando uma Promise que resolve com o objeto/array
> resultante — por isso também precisa de `await` (ou `.then()`).

### 3. O que é necessário para enviar um corpo JSON em uma requisição POST com fetch?

- [ ] Nada além de passar o objeto diretamente em `body`
- [x] Definir `method: "POST"`, o header `Content-Type: application/json`, e converter o corpo com `JSON.stringify()`
- [ ] Usar `method: "JSON"` em vez de `"POST"`
- [ ] Fetch não suporta enviar corpo em requisições

> `body` de um fetch precisa ser uma string (ou outros tipos específicos, como `FormData`) — um
> objeto JavaScript puro não é aceito diretamente, por isso `JSON.stringify()` é necessário. O
> header `Content-Type` avisa o servidor que o conteúdo do corpo deve ser interpretado como JSON.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Fetch" na trilha de JavaScript/TypeScript do CodePath. Contexto: o capítulo
> explica fetch(), resposta.json(), resposta.ok e como enviar POST com corpo JSON. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
