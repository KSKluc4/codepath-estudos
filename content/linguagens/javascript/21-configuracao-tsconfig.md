---
numero: 21
titulo: "Configuração tsconfig"
nivel: "avancado"
objetivo: "Configurar um projeto TypeScript com tsconfig.json."
duracao: 10
status: "completo"
---

## Conceito

`tsconfig.json` é o arquivo que configura como o compilador do TypeScript (`tsc`) deve tratar seu
projeto: quais arquivos incluir, para qual versão de JavaScript compilar, quão rígida deve ser a
checagem de tipos, e para onde colocar os arquivos compilados. Todo projeto TypeScript sério tem um
`tsconfig.json` na raiz.

## Sintaxe

```bash
# Cria um tsconfig.json com valores padrão comentados
npx tsc --init
```

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

## Exemplos comentados

```json
{
  "compilerOptions": {
    // Para qual versão de JavaScript o código é compilado (ES2020, ES2015, etc.)
    "target": "ES2020",

    // Sistema de módulos usado no código compilado (ESNext para import/export nativo,
    // CommonJS para Node.js mais antigo)
    "module": "ESNext",

    // strict ativa um GRUPO de checagens rígidas de uma vez (recomendado sempre ligar)
    // inclui strictNullChecks, noImplicitAny, entre outras
    "strict": true,

    // Onde colocar os arquivos .js compilados
    "outDir": "./dist",

    // Onde está o código-fonte .ts
    "rootDir": "./src",

    // Gera arquivos .d.ts com as definições de tipo, úteis se seu código for uma biblioteca
    "declaration": true,

    // Permite importar módulos CommonJS (como muitos pacotes do npm) com sintaxe ES
    "esModuleInterop": true,

    // Exige que nomes de arquivos importados batam exatamente em maiúsculas/minúsculas
    // (evita bugs que só aparecem em sistemas de arquivo case-sensitive, como Linux)
    "forceConsistentCasingInFileNames": true,

    // Não permite código "morto" depois de um return, por exemplo
    "skipLibCheck": true  // pula checagem de tipos dentro dos arquivos .d.ts de bibliotecas (mais rápido)
  },
  "include": ["src/**/*"],   // quais arquivos o TypeScript deve considerar
  "exclude": ["node_modules", "dist"]  // quais pastas ignorar
}
```

```bash
# Compila o projeto inteiro de acordo com o tsconfig.json
npx tsc

# Modo watch: recompila automaticamente a cada alteração salva
npx tsc --watch
```

## Exercício 1: Configure um projeto Node.js simples

Escreva um `tsconfig.json` mínimo para um projeto Node.js que: compila para `ES2020`, usa módulos
`CommonJS`, tem o código-fonte em `src/` e o compilado em `build/`, com checagem estrita ativada.

### Solução

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./build",
    "strict": true
  },
  "include": ["src/**/*"]
}
```

Cada opção mapeia diretamente para um requisito do enunciado: `target` e `module` definem o
JavaScript de saída, `rootDir`/`outDir` definem as pastas de entrada e saída, e `strict: true`
ativa o conjunto recomendado de checagens rígidas de tipo.

## Exercício 2: Identifique o problema de configuração

O `tsconfig.json` abaixo está causando um erro ao tentar importar um pacote do npm com
`import express from "express"` (o pacote usa `module.exports = ...`, estilo CommonJS). Qual opção
está faltando, e o que ela faz?

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS"
  }
}
```

### Solução

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "esModuleInterop": true
  }
}
```

Falta `"esModuleInterop": true`. Sem essa opção, o TypeScript exige uma sintaxe mais verbosa
(`import * as express from "express"`) para importar módulos CommonJS que não usam `export
default`. Com `esModuleInterop` ativado, a sintaxe `import express from "express"` (mais comum e
familiar) passa a funcionar corretamente.

## Quiz

### 1. Para que serve o arquivo `tsconfig.json`?

- [ ] Armazena as dependências do projeto, como o `package.json`
- [x] Configura como o compilador TypeScript deve processar o projeto (versão de saída, rigor de checagem, pastas, etc.)
- [ ] Só é necessário em projetos que usam React
- [ ] Substitui completamente o `package.json`

> `tsconfig.json` centraliza as opções de compilação do TypeScript: para qual versão de JavaScript
> gerar código, quão rígida deve ser a checagem de tipos, quais arquivos incluir/excluir, e onde
> colocar a saída compilada.

### 2. O que a opção `"strict": true` ativa?

- [ ] Apenas uma checagem isolada e específica
- [x] Um grupo de checagens de tipo rígidas de uma vez (como proibir `any` implícito e checar null/undefined)
- [ ] Impede o código de ser compilado com qualquer erro de formatação
- [ ] Torna a compilação mais lenta sem nenhum benefício de segurança

> `strict` é um atalho que liga várias flags de checagem rigorosa ao mesmo tempo (como
> `strictNullChecks` e `noImplicitAny`), sendo a configuração recomendada para praticamente todo
> projeto TypeScript novo, por capturar mais erros em tempo de compilação.

### 3. O que `"outDir"` e `"rootDir"` configuram?

- [ ] O nome do projeto e sua versão
- [x] Onde está o código-fonte TypeScript (`rootDir`) e onde colocar o JavaScript compilado (`outDir`)
- [ ] Quais bibliotecas externas instalar automaticamente
- [ ] O tema visual do editor de código

> `rootDir` indica ao compilador onde procurar os arquivos `.ts` de entrada (geralmente `src/`), e
> `outDir` indica onde escrever os arquivos `.js` gerados após a compilação (geralmente `dist/` ou
> `build/`), mantendo o código-fonte e o compilado em pastas separadas.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Configuração tsconfig" na trilha de JavaScript/TypeScript do CodePath. Contexto:
> o capítulo explica as principais opções do tsconfig.json, como target, module, strict e
> outDir/rootDir. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
