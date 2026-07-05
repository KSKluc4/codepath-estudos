---
id: "m6-a7"
mes: 6
numero: 7
titulo: "Simulado de entrevista"
objetivo: "Simular uma entrevista técnica completa com perguntas de código e de sistema."
duracao: 30
status: "completo"
---

## Colocando o roteiro em prática, sob pressão

A aula passada apresentou um roteiro para abordar problemas de código em entrevistas. Esta aula é um
**simulado completo**: um problema de código para resolver sob um limite de tempo realista, seguido
de perguntas comportamentais comuns — as duas partes que praticamente toda entrevista técnica de
programação inclui.

## Parte 1: o problema de código (15 minutos)

Antes de ler a solução abaixo, reserve **15 minutos** (use um cronômetro de verdade) e tente resolver
o problema sozinho, aplicando o roteiro da aula passada: esclarecer, exemplo concreto, força bruta,
complexidade, otimizar, testar casos de borda. Narre seu raciocínio em voz alta enquanto resolve — é a
prática mais próxima de uma entrevista real que você pode simular sozinho.

> **Problema**: dada uma string, encontre o tamanho da maior substring (sequência contígua de
> caracteres) que não contém caracteres repetidos. Por exemplo, para `"abcabcbb"`, a resposta é `3`
> (a substring `"abc"`).

## Parte 2: a solução comentada

Depois de tentar por conta própria, compare seu raciocínio com o roteiro completo aplicado abaixo:

**1. Esclarecimento**: perguntas relevantes seriam "a string pode ser vazia?" e "a comparação
diferencia maiúsculas de minúsculas?" (assumindo que sim, para simplificar).

**2. Exemplo concreto**: `"abcabcbb"` → a resposta é `3`, pela substring `"abc"` (o próximo caractere,
outro `"a"`, já repetiria o `"a"` inicial dessa substring).

**3. Força bruta**: testar todas as substrings possíveis, verificando se cada uma tem caracteres
repetidos:

```python
def maior_substring_sem_repeticao_forca_bruta(s):
    maior = 0
    for i in range(len(s)):
        for j in range(i, len(s)):
            substring = s[i:j+1]
            if len(set(substring)) == len(substring):
                maior = max(maior, len(substring))
    return maior
```

**4. Complexidade da força bruta**: os dois laços aninhados já dão `O(n²)` substrings possíveis, e
verificar cada uma com `set(substring)` custa mais `O(n)` — resultando em `O(n³)` no total. Claramente
otimizável.

**5. Otimização — janela deslizante**: em vez de checar cada substring do zero, usamos a técnica de
**sliding window** (retomando o mês 3, aula 8): mantemos uma "janela" que cresce enquanto não há
repetição, e encolhe pela esquerda assim que uma repetição aparece.

```python
def maior_substring_sem_repeticao(s):
    vistos = {}  # caractere -> ultimo indice visto
    inicio_janela = 0
    maior = 0

    for fim_janela, caractere in enumerate(s):
        if caractere in vistos and vistos[caractere] >= inicio_janela:
            inicio_janela = vistos[caractere] + 1
        vistos[caractere] = fim_janela
        maior = max(maior, fim_janela - inicio_janela + 1)

    return maior
```

A complexidade cai para **O(n)**: cada caractere é visitado uma única vez pelo laço `for`, e o
dicionário `vistos` permite verificar/atualizar a última posição de um caractere em O(1) — a mesma
combinação de janela deslizante com hash table que costuma resolver esse tipo de problema
eficientemente.

**6. Casos de borda**: string vazia (`""` deveria devolver `0` — o laço `for` simplesmente não
executa, e `maior` permanece `0`, seu valor inicial); string com um único caractere (`"a"` deveria
devolver `1`); string sem nenhuma repetição (`"abc"` deveria devolver `3`, o tamanho da própria
string).

## Parte 3: perguntas comportamentais e o método STAR

Além do problema de código, praticamente toda entrevista técnica inclui perguntas **comportamentais**
— sobre experiências passadas, não sobre algoritmos. Uma estrutura eficaz para responder esse tipo de
pergunta é o método **STAR**:

- **Situação**: o contexto — quando e onde isso aconteceu?
- **Tarefa**: qual era seu objetivo ou responsabilidade específica?
- **Ação**: o que você, especificamente, fez?
- **Resultado**: o que aconteceu no final, idealmente com um resultado mensurável ou concreto?

Um exemplo de pergunta comum: **"Conte sobre uma vez que você enfrentou um bug difícil de resolver."**
Uma resposta estruturada com STAR, usando o próprio projeto final deste curso como exemplo:

> **Situação**: "Durante o projeto final do curso, meu cálculo de streak de hábitos estava
> devolvendo um valor a mais do que o esperado em alguns casos." **Tarefa**: "Eu precisava encontrar
> a causa raiz e corrigir sem quebrar os testes que já passavam." **Ação**: "Escrevi um teste
> específico reproduzindo o cenário exato do bug (um hábito concluído ontem mas não hoje), o que me
> ajudou a perceber que a lógica não tratava corretamente o caso de o streak não incluir o dia atual
> quando ele ainda não havia sido marcado." **Resultado**: "Corrigi a condição do laço, o novo teste
> passou a validar esse caso especificamente, e usei esse aprendizado para revisar outros métodos em
> busca do mesmo tipo de erro de limite (off-by-one)."

Note como a resposta é **específica** (menciona o bug real, a causa raiz encontrada, a correção
aplicada) — respostas vagas como "eu tive um bug difícil uma vez e consegui resolver" não demonstram
nada de concreto sobre como a pessoa pensa e trabalha.

## Exercício 1: Pratique o roteiro em voz alta

Sem olhar a solução acima, reserve 15 minutos e resolva o problema da maior substring sem repetição
por conta própria, narrando seu raciocínio em voz alta (mesmo sozinho na sala) em cada uma das seis
etapas do roteiro. Depois, compare sua solução força bruta e sua otimização com as apresentadas nesta
aula.

### Solução

Este exercício não tem uma "resposta" para conferir além da sua própria prática — o valor está no
**processo**, não em chegar a um código idêntico ao da aula. Um critério útil de autoavaliação: você
conseguiu verbalizar cada uma das seis etapas antes de escrever a versão otimizada? Você identificou
sozinho que uma janela deslizante seria mais eficiente que testar todas as substrings, ou precisou
olhar a solução para perceber isso? Anote honestamente em qual etapa você travou mais — essa é
justamente a etapa que merece mais prática deliberada antes de uma entrevista real.

## Exercício 2: Escreva sua própria resposta STAR

Pensando em uma experiência real sua (do seu projeto final deste curso, de um trabalho anterior, ou
de qualquer projeto pessoal), escreva uma resposta estruturada em STAR para a pergunta: "Conte sobre
uma vez que você precisou aprender algo novo rapidamente para completar uma tarefa."

### Solução

Não existe uma resposta "correta" única — mas uma boa resposta deveria conseguir preencher claramente
as quatro partes: uma **Situação** concreta (não genérica), uma **Tarefa** específica que era sua
responsabilidade, uma **Ação** detalhada o suficiente para mostrar como você pensa (não apenas "eu
pesquisei e resolvi"), e um **Resultado** verificável. Um teste rápido para avaliar sua própria
resposta: ela contém pelo menos um detalhe específico (um nome de tecnologia, um número, uma decisão
concreta) que só faria sentido se a história fosse real? Se a resposta poderia ser contada por
qualquer pessoa, sobre qualquer situação, provavelmente está genérica demais para ser convincente em
uma entrevista real.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Simulado de entrevista" do meu curso de programação. Contexto: a aula apresenta um
> problema de código completo (maior substring sem repetição, resolvido com janela deslizante) seguindo
> o roteiro de seis passos, e o método STAR (Situação, Tarefa, Ação, Resultado) para perguntas
> comportamentais. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. No problema da maior substring sem repetição, por que a solução força bruta tem complexidade O(n³)?

- [ ] Porque strings em Python são sempre processadas em O(n³)
- [x] Porque gerar todas as substrings possíveis já é O(n²), e verificar cada uma quanto a repetições custa mais O(n)
- [ ] Porque o problema exige três laços aninhados obrigatoriamente
- [ ] Essa afirmação está incorreta, a força bruta é O(n)

> Os dois laços aninhados para gerar substrings resultam em O(n²) substrings possíveis, e checar cada
> uma quanto a caracteres repetidos custa O(n) adicional, totalizando O(n³).

### 2. Qual técnica permite resolver o problema da maior substring sem repetição em O(n)?

- [ ] Busca binária
- [x] Janela deslizante (sliding window), combinada com uma hash table para rastrear a última posição de cada caractere
- [ ] Ordenação da string antes de processá-la
- [ ] Recursão sem memoização

> A janela deslizante evita reprocessar substrings do zero, ajustando o início da janela apenas quando
> uma repetição é encontrada, com a hash table permitindo consultas O(1) sobre a última posição de
> cada caractere.

### 3. No método STAR para perguntas comportamentais, o que a letra "A" representa?

- [ ] Análise do problema
- [x] Ação — o que a pessoa, especificamente, fez
- [ ] Avaliação do resultado final
- [ ] Alternativas consideradas antes de agir

> STAR significa Situação, Tarefa, Ação e Resultado; a "Ação" detalha especificamente o que a pessoa
> fez para lidar com a situação e a tarefa descritas.

### 4. Por que uma resposta comportamental vaga e genérica costuma ser menos convincente em uma entrevista?

- [ ] Porque entrevistadores preferem respostas curtas
- [x] Porque não demonstra evidências concretas de como a pessoa realmente pensa e age diante de um desafio específico
- [ ] Porque respostas vagas sempre ultrapassam o tempo permitido
- [ ] Não há diferença de impacto entre respostas específicas e genéricas

> Detalhes concretos (tecnologias, decisões, números) tornam a resposta verificável e demonstram
> exatamente como o candidato aborda desafios reais, ao contrário de respostas que poderiam se aplicar
> a qualquer situação.

### 5. Para a string vazia (`""`), qual é o resultado esperado de `maior_substring_sem_repeticao`, e por quê?

- [ ] Um erro, já que strings vazias não são um caso válido
- [x] `0`, porque o laço `for` não executa nenhuma iteração, e a variável `maior` permanece em seu valor inicial
- [ ] `1`, porque toda string tem pelo menos uma substring vazia
- [ ] Depende da versão do Python usada

> Como o laço percorre os caracteres da string e uma string vazia não tem nenhum caractere para
> iterar, a variável `maior`, inicializada em `0`, nunca é atualizada, resultando corretamente em `0`.
