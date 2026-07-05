---
id: "m2-a6"
mes: 2
numero: 6
titulo: "Como o compilador transforma texto em binário"
objetivo: "Entender as etapas de pré-processamento, compilação, montagem e linkagem que transformam código C em executável."
duracao: 25
status: "completo"
---

## A promessa da Aula 1

Lá na primeira aula deste mês, prometemos voltar com detalhes sobre como o `gcc` transforma seu
arquivo `.c` em um programa executável. Chegou a hora: esse processo, chamado **compilação**, na
verdade acontece em **quatro etapas distintas**, cada uma feita por uma ferramenta diferente (mesmo
que o comando `gcc` esconda isso de você, rodando todas automaticamente em sequência).

Pense em publicar um livro: primeiro alguém revisa notas de rodapé e referências (pré-processamento),
depois um tradutor converte o texto para outro idioma (compilação), depois um tipógrafo prepara as
páginas para impressão (montagem), e por fim uma gráfica junta tudo — capítulos, índice,
referências de outros livros citados — em um único livro encadernado (linkagem).

## Etapa 1: Pré-processamento

O **pré-processador** lida com linhas que começam com `#` (chamadas *diretivas*), como
`#include` e `#define`, **antes** de qualquer compilação de verdade acontecer. Ele faz substituições
puramente textuais: troca `#include <stdio.h>` pelo conteúdo real daquele arquivo de cabeçalho, troca
qualquer uso de uma macro definida com `#define` pelo seu valor, e remove todos os comentários.

Você pode ver o resultado dessa etapa isoladamente com a flag `-E`:

```bash
gcc -E hello.c -o hello.i
```

Isso gera um arquivo `hello.i` — o código-fonte já "expandido", geralmente centenas ou milhares de
linhas maiores que o original, porque todo o conteúdo de `<stdio.h>` (e de tudo que ele inclui) foi
colado ali dentro.

## Etapa 2: Compilação (de verdade)

Agora sim, o **compilador** traduz o código C pré-processado para **assembly** — a linguagem de
baixo nível que vimos brevemente na Aula 1, muito mais próxima das instruções que a CPU entende
diretamente (retomando a Aula 4 do mês 1, sobre o ciclo fetch-decode-execute).

```bash
gcc -S hello.i -o hello.s
```

Isso gera um arquivo `hello.s`, contendo instruções de assembly específicas da arquitetura do seu
processador. Você não precisa entender assembly em detalhe, mas vale espiar o arquivo gerado uma vez
— é surpreendente ver quantas linhas de assembly um simples `printf("Hello, World!\n");` pode gerar.

## Etapa 3: Montagem (assembly → binário)

O **assembler** (montador) traduz o código assembly gerado na etapa anterior para **código de
máquina real** — os mesmos 0s e 1s que vimos na Aula 2 do mês 1 — e empacota isso em um **arquivo
objeto**:

```bash
gcc -c hello.s -o hello.o
```

Esse arquivo `hello.o` já contém binário de verdade, mas **ainda não é um programa executável
completo**. Ele contém "buracos" — referências a funções externas (como `printf`) que ainda não
foram resolvidas, porque `printf` não está definida no seu arquivo, e sim na biblioteca padrão de C.

## Etapa 4: Linkagem (juntando tudo)

O **linker** (ligador) é responsável por juntar seu arquivo objeto com o código já compilado de
todas as bibliotecas que você usa (como a implementação real de `printf`, que já vem pré-compilada
junto com o sistema), resolvendo cada referência pendente e produzindo, finalmente, um **executável
completo**:

```bash
gcc hello.o -o hello
```

Agora sim, `./hello` pode ser executado diretamente — todas as peças foram encaixadas: seu código,
mais o código de qualquer biblioteca que você usou, tudo junto em um único arquivo binário pronto
para rodar.

## Vendo tudo de uma vez

Quando você roda simplesmente `gcc hello.c -o hello`, o `gcc` executa essas quatro etapas
automaticamente, em sequência, nos bastidores — apagando os arquivos intermediários (`.i`, `.s`,
`.o`) ao final, a menos que você peça explicitamente para vê-los, como fizemos acima:

```text
hello.c  ──(pré-processador)──▶  hello.i  ──(compilador)──▶  hello.s  ──(assembler)──▶  hello.o  ──(linker)──▶  hello
```

## Erros de compilação vs. erros de linkagem

Entender essas quatro etapas ajuda a interpretar mensagens de erro do `gcc` — um dos momentos mais
frustrantes para quem está começando em C. Existem, basicamente, dois tipos de erro:

- **Erro de compilação**: acontece nas etapas 1-2, quando seu código tem um problema de sintaxe
  (parênteses ou chaves não fechadas, ponto e vírgula faltando, palavra-chave escrita errada). O
  `gcc` aponta a linha exata do problema.
- **Erro de linkagem**: acontece na etapa 4, quando o código compila perfeitamente (a sintaxe está
  correta), mas o linker não consegue encontrar a implementação de alguma função referenciada.
  Normalmente aparece como `undefined reference to 'nome_da_funcao'`.

Um erro de linkagem clássico: usar funções matemáticas como `sqrt()` (da biblioteca `math.h`) sem
adicionar a flag `-lm` (que diz ao linker para incluir a biblioteca matemática):

```bash
gcc programa.c -o programa -lm
```

Sem o `-lm`, o compilador aceita seu código normalmente (a sintaxe está correta, e o cabeçalho
`math.h` só declara que a função existe, sem implementá-la), mas o linker falha ao tentar encontrar
a implementação real de `sqrt`, resultando em um erro de linkagem.

## Exercício 1: Rode as quatro etapas manualmente

Considerando um arquivo chamado `programa.c`, escreva os quatro comandos `gcc` necessários para gerar,
em sequência, o arquivo pré-processado (`programa.i`), o assembly (`programa.s`), o arquivo objeto
(`programa.o`), e finalmente o executável (`programa`).

### Solução

```bash
gcc -E programa.c -o programa.i
gcc -S programa.i -o programa.s
gcc -c programa.s -o programa.o
gcc programa.o -o programa
```

Cada comando corresponde exatamente a uma das quatro etapas vistas na aula: `-E` para
pré-processamento, `-S` para compilação (gerando assembly), `-c` para montagem (gerando o arquivo
objeto binário), e o comando final sem flags especiais para linkagem, produzindo o executável
`programa`.

## Exercício 2: Compilação ou linkagem?

Classifique cada erro abaixo como um erro de **compilação** ou de **linkagem**: (a) esquecer um
ponto e vírgula ao final de uma linha; (b) chamar uma função `calcular_media()` que você declarou mas
nunca implementou em lugar nenhum do seu código; (c) escrever `flaot` em vez de `float` ao declarar
uma variável.

### Solução

- **(a) Ponto e vírgula faltando → Erro de compilação.** É um problema de sintaxe, detectado ainda
  nas primeiras etapas (pré-processamento/compilação), antes mesmo de chegar à geração de código de
  máquina.
- **(b) Função declarada mas nunca implementada → Erro de linkagem.** A sintaxe está correta (o
  compilador aceita a chamada da função, assumindo que ela existe em algum lugar), mas o linker não
  encontra nenhuma implementação real de `calcular_media` para resolver essa referência, resultando
  em `undefined reference to 'calcular_media'`.
- **(c) `flaot` em vez de `float` → Erro de compilação.** O compilador não reconhece `flaot` como uma
  palavra-chave válida da linguagem C, então rejeita o código já na etapa de compilação, antes mesmo
  de tentar gerar assembly.

## Exercício 3: Diagnostique a mensagem de erro

Um colega roda `gcc calculo.c -o calculo` e recebe a seguinte mensagem: `undefined reference to
'sqrt'`. O código dele usa `#include <math.h>` corretamente e chama `sqrt(16)`. Qual é o problema
mais provável, e como ele deveria corrigir o comando de compilação?

### Solução

O problema mais provável é que a **biblioteca matemática não foi vinculada** durante a linkagem.
Incluir `#include <math.h>` no código apenas informa ao compilador **que a função `sqrt` existe e
qual é sua assinatura** — isso é suficiente para a etapa de compilação passar sem erros. Mas a
**implementação real** de `sqrt` fica em uma biblioteca separada, que precisa ser explicitamente
informada ao linker através da flag `-lm`:

```bash
gcc calculo.c -o calculo -lm
```

Sem essa flag, o linker simplesmente não sabe onde encontrar o código real de `sqrt`, mesmo que o
programa tenha compilado normalmente — por isso o erro aparece apenas na etapa final (linkagem), e
não durante a compilação.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Como o compilador transforma texto em binário" do meu curso de programação.
> Contexto: a aula explica as quatro etapas da compilação em C (pré-processamento, compilação,
> montagem, linkagem) e a diferença entre erros de compilação e de linkagem. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. Qual é a ordem correta das quatro etapas da compilação em C?

- [x] Pré-processamento, compilação, montagem, linkagem
- [ ] Compilação, pré-processamento, linkagem, montagem
- [ ] Montagem, linkagem, compilação, pré-processamento
- [ ] Linkagem, montagem, compilação, pré-processamento

> A ordem correta é: pré-processamento (resolve diretivas como #include), compilação (gera
> assembly), montagem (gera código de máquina em um arquivo objeto), e linkagem (junta tudo em um
> executável).

### 2. O que o pré-processador faz com uma diretiva como `#include <stdio.h>`?

- [ ] Compila diretamente essa biblioteca para binário
- [x] Substitui a diretiva pelo conteúdo real do arquivo de cabeçalho stdio.h
- [ ] Ignora a diretiva, deixando para o linker resolver depois
- [ ] Apaga a linha do código-fonte sem fazer nada

> O pré-processador realiza substituições textuais: ele troca `#include <stdio.h>` pelo conteúdo
> real daquele arquivo de cabeçalho, antes de qualquer compilação de verdade acontecer.

### 3. O que é um "arquivo objeto" (.o), gerado na etapa de montagem?

- [ ] Um executável completo, pronto para rodar
- [x] Código de máquina binário, mas ainda com referências pendentes a funções externas
- [ ] O código-fonte original, sem nenhuma alteração
- [ ] Um arquivo de configuração do compilador

> O arquivo objeto já contém código de máquina real, mas ainda não é um executável completo — ele
> pode conter referências não resolvidas a funções externas, que só serão resolvidas na etapa de
> linkagem.

### 4. Qual é a função do linker?

- [ ] Remover comentários do código-fonte
- [ ] Traduzir C para assembly
- [x] Juntar o(s) arquivo(s) objeto com o código de bibliotecas externas, resolvendo todas as referências pendentes
- [ ] Verificar erros de sintaxe no código-fonte

> O linker combina seu arquivo objeto com implementações de bibliotecas externas (como a biblioteca
> padrão de C), resolvendo referências pendentes e produzindo o executável final.

### 5. Qual é a causa mais provável de um erro do tipo `undefined reference to 'nome_da_funcao'`?

- [ ] Um ponto e vírgula faltando no código
- [ ] Uma variável declarada com o tipo errado
- [x] A implementação real dessa função não foi encontrada durante a linkagem (por exemplo, esquecer uma flag de biblioteca como -lm)
- [ ] O arquivo .c não existe no sistema

> Esse erro específico ocorre na etapa de linkagem, quando o linker não consegue encontrar a
> implementação real de uma função que foi declarada e chamada corretamente no código.
