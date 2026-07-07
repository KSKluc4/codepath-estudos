---
numero: 6
titulo: "Condicionais"
nivel: "intermediario"
objetivo: "Controlar fluxo em scripts com if, test e comparações."
duracao: 12
status: "completo"
---

## Conceito

`if` em Bash testa o **código de saída** de um comando: `0` significa sucesso (a condição é
tratada como "verdadeira"), qualquer outro valor significa falha. `[ ]` (ou `test`) é o comando
mais comum usado dentro de um `if` para comparar valores, strings e checar arquivos — a sintaxe
tem particularidades importantes, como espaços obrigatórios ao redor dos colchetes.

## Sintaxe

```bash
if [ "$idade" -ge 18 ]; then
    echo "Maior de idade"
else
    echo "Menor de idade"
fi
```

## Exemplos comentados

```bash
idade=20

# Comparação NUMÉRICA: -eq -ne -gt -lt -ge -le
if [ "$idade" -ge 18 ]; then
    echo "Maior de idade"
elif [ "$idade" -ge 12 ]; then
    echo "Adolescente"
else
    echo "Criança"
fi

# Comparação de STRING: = != -z (vazia) -n (não vazia)
nome="Ana"
if [ "$nome" = "Ana" ]; then
    echo "Nome é Ana"
fi

if [ -z "$variavel_vazia" ]; then
    echo "Variável está vazia ou não definida"
fi

# Testes de ARQUIVO: -e (existe) -f (é arquivo) -d (é diretório) -x (é executável)
if [ -f "config.txt" ]; then
    echo "config.txt existe e é um arquivo"
fi

if [ ! -d "logs" ]; then           # ! nega a condição
    mkdir logs
    echo "Diretório logs criado"
fi

# Operadores lógicos: -a (AND, dentro de []) ou && (entre comandos/testes)
if [ "$idade" -ge 18 ] && [ "$nome" = "Ana" ]; then
    echo "Ana é maior de idade"
fi

if [ "$idade" -lt 12 ] || [ "$idade" -gt 65 ]; then
    echo "Fora da faixa etária padrão"
fi

# [[ ]] é uma versão mais moderna de teste (bashismo, não POSIX), com mais recursos
if [[ "$nome" == A* ]]; then    # suporta padrões glob, algo que [ ] não faz
    echo "Nome começa com A"
fi

# case: alternativa ao if/elif encadeado, para comparar contra vários valores
case "$nome" in
    "Ana") echo "Encontrei Ana" ;;
    "Bia"|"Beatriz") echo "Encontrei Bia ou Beatriz" ;;
    *) echo "Nome desconhecido" ;;
esac
```

## Exercício 1: Verifique se um arquivo existe antes de lê-lo

Escreva um script que verifica se `dados.csv` existe no diretório atual: se sim, imprime
`"Arquivo encontrado"`; se não, imprime `"Arquivo não encontrado"`.

### Solução

```bash
if [ -f "dados.csv" ]; then
    echo "Arquivo encontrado"
else
    echo "Arquivo não encontrado"
fi
```

`-f "dados.csv"` testa se o caminho existe E é um arquivo comum (não um diretório). Verificar a
existência de um arquivo antes de tentar lê-lo é uma prática comum em scripts, evitando erros
inesperados mais adiante no código.

## Exercício 2: Classifique uma nota com elif

Escreva um script que, dada uma variável `nota=75`, imprime `"Aprovado com destaque"` se
`nota >= 90`, `"Aprovado"` se `nota >= 60`, ou `"Reprovado"` caso contrário.

### Solução

```bash
nota=75

if [ "$nota" -ge 90 ]; then
    echo "Aprovado com destaque"
elif [ "$nota" -ge 60 ]; then
    echo "Aprovado"
else
    echo "Reprovado"
fi
```

`-ge` (greater or equal) é o operador de comparação numérica "maior ou igual" em Bash — importante
lembrar que `>=` não funciona da mesma forma dentro de `[ ]` para números (seria interpretado como
comparação de string). As condições são testadas em ordem, e a primeira verdadeira "vence".

## Quiz

### 1. Por que os espaços ao redor de `[` e `]` em `if [ "$x" = "y" ]` são obrigatórios?

- [ ] São apenas estéticos, podem ser removidos sem problema
- [x] `[` é, na verdade, um comando (sinônimo de `test`), e precisa de espaço para ser reconhecido como um comando separado dos seus argumentos
- [ ] Só são obrigatórios em comparações numéricas
- [ ] Bash ignora espaços em condicionais

> `[` não é uma sintaxe especial — é literalmente um programa/comando chamado `[` (equivalente a
> `test`), que espera seus argumentos separados por espaço, incluindo o `]` final, que também é
> tratado como um argumento (o último, esperado por convenção). Escrever `[$x=$y]` sem espaços
> resultaria em erro de sintaxe.

### 2. Qual operador é usado para comparação numérica "maior ou igual" dentro de `[ ]`?

- [ ] `>=`
- [x] `-ge`
- [ ] `=>`
- [ ] `is_greater_equal`

> Dentro de `[ ]`, comparações numéricas usam operadores textuais: `-eq`, `-ne`, `-gt`, `-lt`,
> `-ge`, `-le`. Usar `>` ou `>=` dentro de `[ ]` seria interpretado como redirecionamento de saída,
> não como comparação — um erro comum para quem vem de outras linguagens.

### 3. O que `-z "$variavel"` testa?

- [ ] Se a variável contém apenas números
- [x] Se a variável está vazia (string de comprimento zero) ou não foi definida
- [ ] Se a variável é um arquivo válido
- [ ] Se a variável tem exatamente zero caracteres MAIÚSCULOS

> `-z` (zero length) retorna verdadeiro quando a string está vazia — muito usado para checar se
> uma variável foi definida antes de usá-la, evitando erros com variáveis vazias ou inexistentes.
> `-n` faz o oposto: testa se a string NÃO está vazia.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Condicionais" na trilha de Bash do CodePath. Contexto: o capítulo explica if/
> elif/else, os testes com [ ] (numéricos, de string e de arquivo) e case. Minha dúvida/meu
> exercício: [descreva aqui exatamente onde travou].
