---
numero: 7
titulo: "Loops"
nivel: "intermediario"
objetivo: "Repetir comandos com for e while em Bash."
duracao: 10
status: "completo"
---

## Conceito

Bash tem `for` (percorre uma lista de valores ou os resultados de um comando) e `while` (repete
enquanto uma condição for verdadeira) — muito usados para processar múltiplos arquivos, repetir
uma operação, ou esperar por uma condição externa.

## Sintaxe

```bash
for arquivo in *.txt; do
    echo "$arquivo"
done

contador=0
while [ "$contador" -lt 5 ]; do
    echo "$contador"
    contador=$((contador + 1))
done
```

## Exemplos comentados

```bash
# for percorrendo uma lista explícita de valores
for nome in Ana Bia Carlos; do
    echo "Olá, $nome"
done

# for percorrendo arquivos que casam com um padrão (glob)
for arquivo in *.txt; do
    echo "Processando $arquivo"
done

# for com uma sequência numérica
for i in {1..5}; do
    echo "Número $i"
done

for i in $(seq 0 2 10); do    # seq início passo fim
    echo "$i"                  # 0 2 4 6 8 10
done

# for estilo C, mais parecido com outras linguagens
for ((i = 0; i < 5; i++)); do
    echo "$i"
done

# while: repete ENQUANTO a condição for verdadeira
contador=0
while [ "$contador" -lt 3 ]; do
    echo "Contador: $contador"
    contador=$((contador + 1))     # aritmética em Bash usa $(( ))
done

# Ler um arquivo linha por linha com while + read
while IFS= read -r linha; do
    echo "Linha: $linha"
done < arquivo.txt

# until: o oposto de while, repete ENQUANTO a condição for FALSA
contador=0
until [ "$contador" -ge 3 ]; do
    echo "$contador"
    contador=$((contador + 1))
done

# break e continue funcionam como em outras linguagens
for n in {1..10}; do
    if [ "$n" -eq 5 ]; then
        break
    fi
    echo "$n"
done
```

## Exercício 1: Liste arquivos .sh do diretório atual

Escreva um `for` que percorre todos os arquivos `.sh` do diretório atual e imprime o nome de cada
um, prefixado por `"Script: "`.

### Solução

```bash
for arquivo in *.sh; do
    echo "Script: $arquivo"
done
```

`*.sh` é um padrão glob expandido pelo próprio Bash antes de o `for` rodar — ele vira a lista de
todos os arquivos que terminam em `.sh` no diretório atual, e o loop atribui cada um, um de cada
vez, à variável `arquivo`.

## Exercício 2: Some números de 1 a 100 com while

Escreva um script usando `while` que soma todos os inteiros de 1 a 100 e imprime o resultado.

### Solução

```bash
soma=0
n=1
while [ "$n" -le 100 ]; do
    soma=$((soma + n))
    n=$((n + 1))
done
echo "$soma"  # 5050
```

`$(( expressao ))` é a sintaxe de aritmética em Bash — dentro dela, variáveis podem ser usadas sem
o `$` (embora `$n` também funcione). O loop continua enquanto `n` for menor ou igual a 100,
acumulando a soma e incrementando `n` a cada iteração.

## Quiz

### 1. Como se faz aritmética (soma, multiplicação, etc.) em Bash?

- [ ] Usando os operadores diretamente, como em qualquer linguagem: `soma = a + b`
- [x] Com a sintaxe `$(( expressao ))`, como em `soma=$((a + b))`
- [ ] Bash não suporta operações matemáticas
- [ ] Apenas com o comando `calc`

> Bash trata variáveis como texto por padrão; para fazer cálculos numéricos, é preciso usar a
> sintaxe de expansão aritmética `$(( ))`, que interpreta o conteúdo como uma expressão matemática
> e retorna o resultado.

### 2. Qual a diferença entre `while` e `until` em Bash?

- [ ] São sinônimos
- [x] `while` repete ENQUANTO a condição for verdadeira; `until` repete ENQUANTO a condição for FALSA
- [ ] `until` só funciona com números
- [ ] `while` não pode ser usado com `break`

> `while [ condicao ]` continua repetindo enquanto a condição avaliar como verdadeira (código de
> saída `0`). `until [ condicao ]` é o oposto: continua repetindo enquanto a condição for falsa,
> parando assim que ela se tornar verdadeira.

### 3. O que `for arquivo in *.txt; do ... done` faz se não houver nenhum arquivo `.txt` no diretório?

- [ ] Lança um erro e interrompe o script
- [x] Em configuração padrão, o loop roda uma vez com `arquivo` sendo literalmente o texto `"*.txt"` (o padrão não expandido)
- [ ] O loop nunca executa nenhuma iteração
- [ ] O script trava indefinidamente

> Esse é um detalhe sutil e uma pegadinha comum: se o glob `*.txt` não corresponder a nenhum
> arquivo, e a opção `nullglob` não estiver ativada, Bash deixa o padrão sem expandir, e o loop
> roda uma única vez com essa string literal — por isso scripts mais robustos costumam checar
> `[ -f "$arquivo" ]` dentro do loop antes de processar.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Loops" na trilha de Bash do CodePath. Contexto: o capítulo explica for (com
> listas, glob e sequências), while, until e aritmética com $(( )). Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
