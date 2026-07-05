---
id: "m6-a6"
mes: 6
numero: 6
titulo: "Preparação para entrevistas técnicas"
objetivo: "Revisar os tópicos mais cobrados em entrevistas técnicas de programação."
duracao: 30
status: "completo"
---

## Do projeto para a entrevista

Com o projeto final encaminhado, as últimas três aulas do curso mudam de foco: da construção de
software para a **comunicação** do seu conhecimento técnico em uma entrevista de emprego. Entrevistas
técnicas de programação seguem um formato bastante previsível — e é exatamente essa previsibilidade
que torna possível se preparar de forma eficaz.

## O que realmente está sendo avaliado

Um erro comum é achar que uma entrevista técnica avalia apenas "se você chegou à resposta certa".
Na prática, entrevistadores experientes prestam atenção a um conjunto mais amplo de sinais:

- **Processo de raciocínio**: você consegue quebrar um problema ambíguo em passos concretos?
- **Comunicação**: você consegue explicar sua linha de pensamento **enquanto** resolve o problema, não
  só depois?
- **Conhecimento de fundamentos**: você reconhece qual estrutura de dados ou algoritmo se encaixa no
  problema, e sabe justificar essa escolha (retomando o mês 3)?
- **Tratamento de casos de borda**: você lembra de considerar entradas vazias, valores extremos,
  entradas inválidas (retomando a aula 5 deste mês)?

Isso significa que **travar** em um problema não é, sozinho, motivo de reprovação — muitos candidatos
aprovados travam em algum ponto. O que costuma pesar mais é **como** a pessoa reage ao travar:
permanece em silêncio tentando adivinhar, ou verbaliza o raciocínio, tenta uma abordagem mais simples,
e pede uma pista de forma construtiva?

## Revisando estruturas de dados e Big O

Retomando o mês 3, um exercício valioso antes de qualquer entrevista é conseguir responder, sem
consultar nada, perguntas como:

| Pergunta | Resposta esperada |
|----------|---------------------|
| Qual a complexidade de buscar um elemento em um array não ordenado? | O(n) — pode ser necessário percorrer todos os elementos |
| Qual a complexidade de buscar uma chave em uma hash table? | O(1) em média |
| Quando usar uma pilha em vez de uma fila? | Quando a ordem de processamento precisa ser LIFO (o mais recente primeiro), como desfazer ações |
| Por que árvores binárias de busca balanceadas mantêm O(log n)? | Porque cada comparação descarta metade das possibilidades restantes, retomando a lógica da busca binária |

Não se trata de decorar respostas — se trata de ter esse raciocínio **automatizado** o suficiente para
não gastar energia mental relembrando conceitos básicos durante a entrevista, deixando espaço para
focar no problema específico sendo apresentado.

## Um roteiro para abordar qualquer problema de código

Um erro comum sob pressão é começar a escrever código **antes** de entender completamente o problema.
Um roteiro testado e comprovado para abordar um problema de entrevista:

1. **Esclareça o problema em voz alta**: repita o enunciado com suas próprias palavras, e faça
   perguntas sobre casos de borda ("o array pode estar vazio? pode ter números negativos? pode ter
   duplicatas?"). Isso demonstra atenção a detalhes e evita resolver o problema errado.
2. **Pense em um exemplo concreto**: antes de qualquer código, escreva à mão uma entrada de exemplo
   simples e a saída esperada — isso frequentemente revela detalhes do problema que passariam
   despercebidos apenas lendo o enunciado.
3. **Comece pela solução força bruta**: mesmo sabendo que não é a mais eficiente, descrever (e às
   vezes implementar) uma solução simples e correta primeiro mostra que você entendeu o problema, e dá
   uma base sólida para otimizar depois.
4. **Analise a complexidade da solução força bruta**: usando Big O (mês 3), identifique o gargalo —
   geralmente um laço aninhado (O(n²)) que poderia virar uma única passada (O(n)) com a estrutura de
   dados certa.
5. **Otimize, explicando o raciocínio**: proponha a melhoria (por exemplo, "posso usar uma hash table
   aqui para evitar o laço aninhado"), implemente, e teste mentalmente com o exemplo do passo 2.
6. **Teste casos de borda**: antes de declarar a solução pronta, verifique explicitamente entradas
   vazias, de tamanho 1, ou com valores repetidos — os mesmos casos de borda discutidos na aula 5.

## Pensar em voz alta: a habilidade mais subestimada

Muitos candidatos tecnicamente competentes se saem mal em entrevistas porque resolvem o problema **em
silêncio**, entregando só o código pronto no final. Do ponto de vista do entrevistador, um candidato
que verbaliza "estou pensando em usar uma hash table aqui para conseguir busca O(1), em vez de
percorrer o array de novo" está demonstrando exatamente o raciocínio que a entrevista quer avaliar —
mesmo que a implementação final leve um tempo a mais para ficar pronta. Pensar em voz alta é uma
habilidade que se desenvolve com **prática deliberada**: resolver problemas narrando o raciocínio em
voz alta, sozinho, antes do dia da entrevista de verdade.

## Exercício 1: Aplique o roteiro a um problema

Considere o problema: "dado um array de inteiros, encontre se existem dois números que somam a um
valor alvo". Aplique os passos 1 a 4 do roteiro desta aula: esclareça o problema (liste duas perguntas
de esclarecimento relevantes), descreva um exemplo concreto, descreva a solução força bruta, e
calcule sua complexidade.

### Solução

**1. Esclarecimento**: duas perguntas relevantes seriam "o array pode conter números repetidos?" e "o
mesmo elemento pode ser usado duas vezes para formar a soma, ou precisam ser dois elementos
diferentes?" — respostas que mudam significativamente a solução.

**2. Exemplo concreto**: para `array = [2, 7, 11, 15]` e `alvo = 9`, a resposta esperada seria
`True` (ou os índices `0` e `1`), já que `2 + 7 = 9`.

**3. Solução força bruta**: comparar cada par possível de elementos, verificando se algum par soma ao
alvo:

```python
def existe_par_com_soma(array, alvo):
    for i in range(len(array)):
        for j in range(i + 1, len(array)):
            if array[i] + array[j] == alvo:
                return True
    return False
```

**4. Complexidade**: `O(n²)`, retomando o mês 3 — para cada um dos `n` elementos, o laço interno
percorre novamente os elementos restantes, resultando em aproximadamente `n × n` comparações no pior
caso.

## Exercício 2: Otimize a solução força bruta

Continuando o exercício anterior, proponha uma otimização para `existe_par_com_soma`, usando uma
estrutura de dados do mês 3 para reduzir a complexidade de `O(n²)` para `O(n)`. Explique o raciocínio.

### Solução

```python
def existe_par_com_soma(array, alvo):
    vistos = set()
    for numero in array:
        complemento = alvo - numero
        if complemento in vistos:
            return True
        vistos.add(numero)
    return False
```

O raciocínio: em vez de comparar cada par explicitamente, guardamos os números já vistos em um
**conjunto** (implementado com uma hash table, mês 3, aula 5), que permite verificar "esse
complemento já apareceu?" em **O(1)** em média. Para cada número do array, calculamos o complemento
necessário (`alvo - numero`) e verificamos se ele já foi visto antes — se sim, encontramos um par;
se não, adicionamos o número atual ao conjunto e seguimos adiante. Isso reduz a solução de dois laços
aninhados (O(n²)) para um único laço com buscas O(1) dentro dele, resultando em complexidade **O(n)**
no total — exatamente o tipo de otimização, trocando tempo por espaço extra (o conjunto `vistos`),
que entrevistas técnicas costumam querer ver.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Preparação para entrevistas técnicas" do meu curso de programação. Contexto: a
> aula explica o que entrevistadores avaliam além da resposta correta, revisão de estruturas de dados
> e Big O, o roteiro de seis passos para abordar um problema (esclarecer, exemplo, força bruta,
> complexidade, otimizar, testar casos de borda), e a importância de pensar em voz alta. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. Além de chegar à resposta correta, o que um entrevistador técnico costuma avaliar durante uma entrevista de código?

- [ ] Apenas a velocidade de digitação do candidato
- [x] O processo de raciocínio, a comunicação durante a resolução, conhecimento de fundamentos e tratamento de casos de borda
- [ ] Se o candidato memorizou a solução exata do problema
- [ ] Apenas se o código compila sem erros

> Entrevistadores experientes avaliam sinais além da resposta final: como o candidato quebra o
> problema, comunica seu raciocínio, aplica fundamentos e considera casos de borda.

### 2. Segundo o roteiro apresentado na aula, qual deveria ser o primeiro passo ao receber um problema de código em uma entrevista?

- [ ] Começar a escrever código imediatamente
- [x] Esclarecer o problema em voz alta e fazer perguntas sobre casos de borda
- [ ] Calcular a complexidade Big O antes de entender o problema
- [ ] Pedir para pular para o próximo problema

> Esclarecer o problema antes de codificar evita resolver o problema errado e demonstra atenção a
> detalhes importantes, como restrições e casos de borda.

### 3. Por que começar por uma solução força bruta, mesmo sabendo que não é a mais eficiente, é uma estratégia recomendada?

- [ ] Porque soluções força bruta sempre são aceitas como resposta final
- [x] Porque demonstra que o problema foi entendido corretamente e cria uma base sólida para otimizar depois
- [ ] Porque é sempre mais rápida de implementar do que a solução otimizada
- [ ] Porque entrevistadores nunca perguntam sobre complexidade

> Uma solução força bruta correta mostra domínio do problema e serve de ponto de partida concreto
> para identificar gargalos e propor otimizações justificadas.

### 4. Por que "pensar em voz alta" durante uma entrevista técnica é considerado uma habilidade importante?

- [ ] Porque acelera a velocidade de digitação do código
- [x] Porque permite ao entrevistador acompanhar o raciocínio do candidato, mesmo quando a solução final demora mais para ficar pronta
- [ ] Porque é obrigatório por lei em entrevistas técnicas
- [ ] Porque substitui a necessidade de testar o código

> Verbalizar o raciocínio demonstra exatamente os sinais que a entrevista busca avaliar — como o
> candidato decompõe e resolve o problema — mesmo que a implementação final leve mais tempo.

### 5. No exercício de otimização (encontrar um par que soma a um valor alvo), por que usar um conjunto (hash table) reduz a complexidade de O(n²) para O(n)?

- [ ] Porque conjuntos ordenam os elementos automaticamente
- [x] Porque verificar se um valor já foi visto em um conjunto é O(1) em média, eliminando a necessidade do laço aninhado da solução força bruta
- [ ] Porque conjuntos armazenam menos memória do que arrays
- [ ] Não há redução real de complexidade, apenas de legibilidade

> Substituir a comparação par a par por uma verificação O(1) em um conjunto elimina o segundo laço da
> solução força bruta, reduzindo o total de operações de O(n²) para O(n).
