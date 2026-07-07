---
numero: 14
titulo: "Arquivos"
nivel: "avancado"
objetivo: "Ler e escrever arquivos em C com fopen, fprintf e fclose."
duracao: 12
status: "completo"
---

## Conceito

C manipula arquivos através de um ponteiro especial `FILE *`, obtido com `fopen()`. Assim como em
outras linguagens, é preciso especificar um **modo** de abertura (leitura, escrita, append) e,
fundamentalmente, **fechar** o arquivo com `fclose()` ao terminar — sem `with` automático como em
Python, essa responsabilidade é inteiramente manual em C.

## Sintaxe

```c
#include <stdio.h>

FILE *arquivo = fopen("dados.txt", "r"); // "r" leitura, "w" escrita, "a" append
if (arquivo == NULL) {
    // fopen falha (arquivo não existe, sem permissão, etc.) e retorna NULL
}

fclose(arquivo); // sempre feche o arquivo ao terminar
```

## Exemplos comentados

```c
#include <stdio.h>

int main(void) {
    // Escrevendo em um arquivo
    FILE *saida = fopen("saida.txt", "w"); // "w" sobrescreve o arquivo inteiro
    if (saida == NULL) {
        printf("Erro ao abrir arquivo para escrita\n");
        return 1;
    }
    fprintf(saida, "Nome: %s\n", "Ana");   // fprintf funciona como printf, mas para arquivo
    fprintf(saida, "Idade: %d\n", 28);
    fclose(saida);

    // Lendo um arquivo linha por linha
    FILE *entrada = fopen("saida.txt", "r");
    if (entrada == NULL) {
        printf("Erro ao abrir arquivo para leitura\n");
        return 1;
    }

    char linha[100];
    while (fgets(linha, sizeof(linha), entrada) != NULL) {
        printf("%s", linha); // fgets já inclui o \n no final da linha lida
    }
    fclose(entrada);

    // Adicionando ao final de um arquivo (sem apagar o conteúdo existente)
    FILE *log = fopen("log.txt", "a"); // "a" = append
    fprintf(log, "Nova entrada de log\n");
    fclose(log);

    // Lendo valores formatados (equivalente a scanf, mas de arquivo)
    FILE *dados = fopen("saida.txt", "r");
    char nome[50];
    int idade;
    fscanf(dados, "Nome: %s\n", nome);
    fscanf(dados, "Idade: %d\n", &idade);
    fclose(dados);

    return 0;
}
```

## Exercício 1: Escreva uma lista em um arquivo

Escreva um programa que grava os números de 1 a 5 em um arquivo `numeros.txt`, um por linha,
usando `fprintf`.

### Solução

```c
#include <stdio.h>

int main(void) {
    FILE *arquivo = fopen("numeros.txt", "w");
    if (arquivo == NULL) {
        return 1;
    }

    for (int i = 1; i <= 5; i++) {
        fprintf(arquivo, "%d\n", i);
    }

    fclose(arquivo);
    return 0;
}
```

`fprintf(arquivo, ...)` funciona exatamente como `printf`, só que o primeiro argumento indica para
onde a saída deve ir (o arquivo, em vez do terminal). Cada chamada dentro do loop escreve um número
seguido de quebra de linha.

## Exercício 2: Conte as linhas de um arquivo

Escreva um programa que abre `numeros.txt` (do exercício anterior) e conta quantas linhas ele tem,
usando `fgets` em um loop.

### Solução

```c
#include <stdio.h>

int main(void) {
    FILE *arquivo = fopen("numeros.txt", "r");
    if (arquivo == NULL) {
        return 1;
    }

    int contador = 0;
    char linha[100];
    while (fgets(linha, sizeof(linha), arquivo) != NULL) {
        contador++;
    }

    printf("Total de linhas: %d\n", contador); // 5
    fclose(arquivo);
    return 0;
}
```

`fgets` lê uma linha por vez (até encontrar `\n` ou atingir o limite de `sizeof(linha)`) e retorna
`NULL` quando chega ao final do arquivo — condição usada para controlar o loop `while`. Cada
iteração bem-sucedida representa uma linha lida, então basta incrementar o contador a cada volta.

## Quiz

### 1. O que `fopen()` retorna se o arquivo não puder ser aberto (por exemplo, não existe)?

- [ ] Lança automaticamente uma exceção
- [x] Retorna `NULL`, que deve ser checado antes de usar o arquivo
- [ ] Trava o programa imediatamente
- [ ] Cria o arquivo automaticamente, mesmo em modo leitura

> `fopen` sinaliza falha retornando `NULL`, sem lançar nenhuma exceção (C não tem esse mecanismo
> nativamente). É responsabilidade de quem chama `fopen` checar esse retorno antes de tentar usar
> o ponteiro `FILE *`, ou o programa pode falhar de forma imprevisível ao tentar ler/escrever em um
> ponteiro nulo.

### 2. Qual a diferença entre abrir um arquivo com `"w"` e com `"a"`?

- [ ] Não há diferença
- [x] `"w"` sobrescreve todo o conteúdo existente; `"a"` adiciona ao final, preservando o que já havia
- [ ] `"a"` só funciona com arquivos de texto
- [ ] `"w"` abre em modo somente leitura

> `"w"` (write) apaga qualquer conteúdo anterior do arquivo antes de começar a escrever. `"a"`
> (append) preserva o conteúdo existente e adiciona as novas escritas ao final do arquivo — útil
> especialmente para arquivos de log.

### 3. Por que é importante chamar `fclose()` ao terminar de usar um arquivo?

- [ ] Não é importante, o sistema operacional sempre fecha sozinho imediatamente
- [x] Libera o recurso do sistema associado ao arquivo e garante que dados ainda em buffer sejam gravados
- [ ] `fclose()` é opcional apenas em modo leitura
- [ ] `fclose()` apaga o conteúdo do arquivo

> Assim como `malloc`/`free`, arquivos abertos consomem um recurso limitado do sistema operacional
> (descritores de arquivo), e dados escritos podem ficar temporariamente em um buffer antes de
> serem gravados fisicamente no disco. `fclose()` libera esse recurso e garante (faz "flush") que
> tudo que foi escrito realmente chegue ao arquivo.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Arquivos" na trilha de C do CodePath. Contexto: o capítulo explica fopen, os
> modos de abertura, fprintf/fgets/fscanf e fclose. Minha dúvida/meu exercício: [descreva aqui
> exatamente onde travou].
