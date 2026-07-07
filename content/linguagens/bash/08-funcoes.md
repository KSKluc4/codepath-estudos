---
numero: 8
titulo: "Funções"
nivel: "intermediario"
objetivo: "Organizar scripts em funções reutilizáveis."
duracao: 10
status: "completo"
---

## Conceito

Funções em Bash agrupam comandos sob um nome, evitando repetição em scripts maiores. Diferente de
linguagens de programação tradicionais, funções Bash não têm uma lista de parâmetros nomeados na
declaração — argumentos são acessados através das variáveis posicionais `$1`, `$2`, etc., as
mesmas usadas para argumentos de script (assunto do próximo capítulo).

## Sintaxe

```bash
saudacao() {
    echo "Olá, $1!"
}

saudacao "Ana"   # Olá, Ana!
```

## Exemplos comentados

```bash
# Sintaxe alternativa (equivalente), com a palavra "function"
function saudacao {
    echo "Olá, $1!"
}

# Argumentos: $1, $2, $3... (posicionais); $# = quantidade de argumentos; $@ = todos os argumentos
somar() {
    local resultado=$(( $1 + $2 ))   # local restringe a variável ao escopo da função
    echo "$resultado"
}
soma=$(somar 5 3)
echo "$soma"   # 8

# "return" em Bash define apenas o CÓDIGO DE SAÍDA (0-255), não um valor de retorno de verdade
verificar_par() {
    if [ $(( $1 % 2 )) -eq 0 ]; then
        return 0   # 0 = sucesso/verdadeiro por convenção
    else
        return 1   # qualquer valor != 0 = falha/falso
    fi
}

if verificar_par 4; then
    echo "É par"
fi

# Para "retornar" um VALOR (não apenas sucesso/falha), a convenção é usar echo
# e capturar com $() de fora, como no exemplo de "somar" acima

# local é importante: sem ela, variáveis dentro de funções são GLOBAIS por padrão
contador=0
incrementar() {
    contador=$((contador + 1))  # sem "local", altera a variável GLOBAL "contador"
}
incrementar
echo "$contador"  # 1

# Funções podem chamar outras funções, e usar $@ para repassar todos os argumentos recebidos
log() {
    echo "[LOG] $@"
}
processar() {
    log "Iniciando processamento de $1"
    # ...
}
processar "dados.csv"
```

## Exercício 1: Escreva uma função de saudação com valor padrão

Escreva uma função `saudar` que recebe um nome como argumento e imprime `"Olá, <nome>!"`, ou
`"Olá, visitante!"` se nenhum argumento for passado.

### Solução

```bash
saudar() {
    local nome="${1:-visitante}"
    echo "Olá, $nome!"
}

saudar "Ana"   # Olá, Ana!
saudar          # Olá, visitante!
```

`${1:-visitante}` é a sintaxe de valor padrão em Bash: se `$1` estiver vazio ou não definido, usa
`"visitante"` no lugar. `local` garante que `nome` só existe dentro da função, sem vazar (ou
colidir com) variáveis do mesmo nome fora dela.

## Exercício 2: Escreva uma função que retorna um valor calculado

Escreva uma função `media` que recebe dois números e "retorna" a média deles (usando `echo` +
captura com `$()`).

### Solução

```bash
media() {
    local resultado=$(( ($1 + $2) / 2 ))
    echo "$resultado"
}

resultado=$(media 10 20)
echo "A média é $resultado"  # A média é 15
```

Como `return` em Bash só pode devolver um código numérico de 0 a 255 (não um valor de verdade),
funções que precisam "retornar" um dado usam `echo` para imprimir o resultado, e quem chama a
função captura essa saída com `$(nome_da_funcao args)` — exatamente como capturar a saída de
qualquer outro comando.

## Quiz

### 1. Como uma função Bash acessa os argumentos que recebeu?

- [ ] Através de parâmetros nomeados na declaração, como em outras linguagens
- [x] Através das variáveis posicionais `$1`, `$2`, etc. (as mesmas usadas para argumentos de script)
- [ ] Não é possível passar argumentos para funções em Bash
- [ ] Apenas através de variáveis globais

> Funções Bash não declaram parâmetros nomeados — dentro do corpo da função, `$1` é o primeiro
> argumento passado na chamada, `$2` o segundo, e assim por diante, igual ao acesso a argumentos
> de linha de comando de um script inteiro.

### 2. O que `return` faz em uma função Bash?

- [ ] Devolve qualquer tipo de valor, como string ou número decimal
- [x] Define o código de saída da função (um número inteiro de 0 a 255), usado para indicar sucesso (0) ou falha (diferente de 0)
- [ ] Interrompe o script inteiro
- [ ] É equivalente a `echo`

> Diferente de `return` em Python ou JavaScript, `return` em Bash só define o código de saída da
> função — um número entre 0 e 255, seguindo a convenção Unix de "0 = sucesso". Para "devolver" um
> dado de verdade (uma string ou número calculado), usa-se `echo` dentro da função e `$()` para
> capturar essa saída de fora.

### 3. Por que usar `local` para variáveis dentro de uma função é uma boa prática?

- [ ] `local` é obrigatório, sem ele o script não roda
- [x] Sem `local`, variáveis definidas dentro da função são GLOBAIS por padrão, podendo sobrescrever variáveis de mesmo nome usadas em outras partes do script
- [ ] `local` torna a função mais rápida
- [ ] `local` só funciona com números

> Bash, por padrão, não isola o escopo de variáveis dentro de funções — qualquer variável
> declarada sem `local` "vaza" para o escopo global, podendo sobrescrever acidentalmente outra
> variável de mesmo nome usada em qualquer outra parte do script. `local` restringe a variável
> apenas ao corpo daquela função.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Funções" na trilha de Bash do CodePath. Contexto: o capítulo explica declaração
> de funções, argumentos posicionais ($1, $2...), return (código de saída) e local. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
