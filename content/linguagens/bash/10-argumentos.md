---
numero: 10
titulo: "Argumentos"
nivel: "intermediario"
objetivo: "Ler argumentos de linha de comando dentro de um script."
duracao: 10
status: "completo"
---

## Conceito

Scripts recebem argumentos da mesma forma que funções: através das variáveis posicionais `$1`,
`$2`, etc. Bash também oferece variáveis especiais para inspecionar a quantidade de argumentos
(`$#`), o nome do próprio script (`$0`), e formas de percorrer todos os argumentos de uma vez —
essencial para escrever scripts flexíveis, configuráveis por quem os chama.

## Sintaxe

```bash
#!/bin/bash
echo "Primeiro argumento: $1"
echo "Total de argumentos: $#"
```

```bash
./script.sh alfa beta
# Primeiro argumento: alfa
# Total de argumentos: 2
```

## Exemplos comentados

```bash
#!/bin/bash

echo "Nome do script: $0"
echo "Primeiro argumento: $1"
echo "Segundo argumento: $2"
echo "Quantidade de argumentos: $#"
echo "Todos os argumentos: $@"

# $@ vs $*: parecidos, mas $@ preserva argumentos com espaço como itens SEPARADOS
# quando usados como "$@" (entre aspas) — geralmente a escolha certa em loops
for arg in "$@"; do
    echo "Argumento: $arg"
done

# Verificar se um argumento obrigatório foi passado
if [ $# -eq 0 ]; then
    echo "Uso: $0 <nome_do_arquivo>" >&2
    exit 1
fi

# shift remove o primeiro argumento, "empurrando" os demais uma posição para trás
processar_multiplos() {
    while [ $# -gt 0 ]; do
        echo "Processando: $1"
        shift
    done
}
processar_multiplos arquivo1.txt arquivo2.txt arquivo3.txt

# Parseando flags simples (--verbose, --output=arquivo.txt) com um loop e case
verbose=false
saida="padrao.txt"

while [ $# -gt 0 ]; do
    case "$1" in
        --verbose)
            verbose=true
            shift
            ;;
        --output)
            saida="$2"
            shift 2   # consome tanto --output quanto o valor seguinte
            ;;
        *)
            echo "Argumento desconhecido: $1" >&2
            exit 1
            ;;
    esac
done

echo "verbose=$verbose saida=$saida"
```

## Exercício 1: Exija um argumento obrigatório

Escreva um script que espera um nome de arquivo como argumento; se nenhum for passado, imprime
uma mensagem de uso em stderr e sai com código `1`.

### Solução

```bash
#!/bin/bash

if [ $# -eq 0 ]; then
    echo "Uso: $0 <arquivo>" >&2
    exit 1
fi

echo "Processando arquivo: $1"
```

`$#` contém quantos argumentos foram passados ao script. Checar `$# -eq 0` logo no início é o
padrão para "argumentos obrigatórios": se ninguém passar nada, o script explica como deveria ser
usado (usando `$0`, o próprio nome do script) e sai com código diferente de zero, sinalizando
falha para quem o chamou.

## Exercício 2: Processe uma lista de arquivos com shift

Escreva um script que recebe uma quantidade qualquer de nomes de arquivo como argumentos e
imprime `"Arquivo N: <nome>"` para cada um, numerando a partir de 1.

### Solução

```bash
#!/bin/bash

numero=1
while [ $# -gt 0 ]; do
    echo "Arquivo $numero: $1"
    numero=$((numero + 1))
    shift
done
```

```bash
./script.sh a.txt b.txt c.txt
# Arquivo 1: a.txt
# Arquivo 2: b.txt
# Arquivo 3: c.txt
```

A cada iteração, `$1` sempre se refere ao "primeiro argumento restante" — `shift` remove esse
primeiro argumento da lista, fazendo o que era `$2` virar o novo `$1`. O loop continua enquanto
`$#` (a contagem de argumentos restantes) for maior que zero.

## Quiz

### 1. O que `$#` representa dentro de um script?

- [ ] O nome do script
- [x] A quantidade de argumentos passados ao script
- [ ] O primeiro argumento
- [ ] O código de saída do último comando

> `$#` é uma variável especial que contém o número total de argumentos posicionais recebidos —
> muito usada para validar se os argumentos obrigatórios foram fornecidos antes de o script
> continuar.

### 2. O que `shift` faz dentro de um script ou função?

- [ ] Ordena os argumentos alfabeticamente
- [x] Remove o primeiro argumento posicional ($1), fazendo os demais "andarem" uma posição para trás
- [ ] Adiciona um novo argumento à lista
- [ ] Reinicia a contagem de argumentos

> Depois de `shift`, o que era `$2` passa a ser `$1`, o que era `$3` vira `$2`, e assim por diante
> — muito usado em loops `while [ $# -gt 0 ]` para processar uma quantidade variável de argumentos
> um de cada vez, sem precisar saber de antemão quantos existem.

### 3. Qual a diferença prática entre `$@` e `$*` ao usar `"$@"` (com aspas) em um loop?

- [ ] Não há diferença nenhuma
- [x] `"$@"` preserva cada argumento como um item separado (mesmo contendo espaços); `"$*"` junta tudo em uma única string
- [ ] `$*` só funciona com números
- [ ] `$@` não pode ser usado dentro de aspas

> Quando usados sem aspas, `$@` e `$*` se comportam de forma parecida. Mas `"$@"` (a forma
> recomendada em loops) expande para cada argumento como uma palavra separada, preservando
> corretamente argumentos que contenham espaços — `"$*"` junta todos os argumentos em uma única
> string, separada pelo primeiro caractere de `IFS` (geralmente espaço).

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Argumentos" na trilha de Bash do CodePath. Contexto: o capítulo explica $1/$2,
> $#, $@ vs $*, shift e o parsing básico de flags. Minha dúvida/meu exercício: [descreva aqui
> exatamente onde travou].
