---
id: "m6-a1"
mes: 6
numero: 1
titulo: "Escolhendo o projeto final"
objetivo: "Definir o escopo de um projeto final que integre tudo o que foi estudado nos últimos 5 meses."
duracao: 20
status: "completo"
---

## Bem-vindo ao mês 6, o último do CodePath

Nos últimos cinco meses você percorreu um caminho longo: entendeu a máquina por dentro, programou em
C mexendo diretamente com memória, estudou estruturas de dados e algoritmos, aprendeu como
computadores conversam pela rede e como o sistema operacional gerencia processos, e praticou as
disciplinas de engenharia de software (Git, testes, arquitetura, bancos de dados, segurança). Este
último mês tem dois objetivos: **construir um projeto final** que amarre esse conhecimento todo em
algo concreto para o seu portfólio, e **se preparar especificamente para entrevistas técnicas** de
programação. Vamos começar pela decisão mais importante de qualquer projeto: **o que construir**.

## Por que a escolha do projeto importa tanto

É tentador escolher o projeto mais ambicioso possível — um clone de rede social, um jogo multiplayer,
um sistema completo de e-commerce. Na prática, esse impulso costuma sair pela culatra: projetos
grandes demais raramente são terminados, e um projeto **inacabado** vale muito menos, tanto para o
seu aprendizado quanto para mostrar a recrutadores, do que um projeto **pequeno e completo**. Um bom
projeto final de curso tem três características:

1. **Escopo terminável** em algumas semanas de trabalho consistente, não meses.
2. **Usa múltiplas habilidades** estudadas ao longo do curso — não precisa usar todas, mas deveria
   integrar pelo menos algumas: uma estrutura de dados relevante (mês 3), alguma noção de rede/cliente-
   servidor (mês 4), arquitetura em camadas, testes e um banco de dados (mês 5).
3. **Tem um critério claro de "pronto"** — você consegue descrever, em uma frase, o que o projeto faz
   quando está terminado, sem depender de "e também poderia ter X, Y, Z" indefinidamente.

## A armadilha do escopo infinito

Praticamente todo projeto de software sofre de **scope creep** (expansão descontrolada de escopo): no
meio do desenvolvimento, sempre surge "seria legal se também tivesse...". Sem um escopo definido por
escrito **antes** de começar a codar, é fácil nunca terminar, porque sempre existe mais uma
funcionalidade tentadora para adicionar. A defesa contra isso é simples, mas poucas pessoas praticam:
escrever um **mini-documento de escopo** antes de escrever a primeira linha de código, definindo
explicitamente o que **está dentro** e o que **está fora** do projeto.

## O mini-documento de escopo

Um documento de escopo eficaz para um projeto pessoal não precisa ser longo — cabe em meia página, com
quatro seções:

```text
## Problema
Que problema real este projeto resolve? Para quem?

## Funcionalidades essenciais (dentro do escopo)
Lista curta (3 a 6 itens) do que o projeto PRECISA fazer para ser considerado "pronto".

## Fora do escopo (por enquanto)
Lista do que seria legal ter, mas explicitamente NÃO faz parte da primeira versão.

## Critério de pronto
Uma frase: como saber, sem ambiguidade, que o projeto está terminado?
```

Um exemplo preenchido, para um projeto de "rastreador de hábitos":

```text
## Problema
Ajudar uma pessoa a acompanhar hábitos diários (beber água, estudar, exercitar) e visualizar sua
consistência ao longo do tempo.

## Funcionalidades essenciais
- Cadastrar um hábito (nome, frequência desejada)
- Marcar um hábito como concluído em um dia específico
- Ver o histórico de um hábito nos últimos 30 dias
- Ver uma sequência atual de dias consecutivos (streak) por hábito

## Fora do escopo (por enquanto)
- Notificações/lembretes
- Múltiplos usuários com login
- Aplicativo mobile (só linha de comando ou web simples)
- Gráficos elaborados de estatísticas

## Critério de pronto
Uma pessoa consegue cadastrar 3 hábitos diferentes, marcar dias como concluídos ao longo de uma
semana simulada, e ver corretamente o streak atual de cada um.
```

Note como a seção "Fora do escopo" é tão importante quanto a de funcionalidades essenciais — ela
existe justamente para você poder dizer "não, isso fica para depois" quando a tentação de expandir o
projeto aparecer no meio do caminho, sem se sentir culpado por isso.

## Boas fontes de ideias de projeto

Projetos que costumam funcionar bem como projeto final de curso geralmente resolvem um problema
**pessoal e específico** (algo que você mesmo usaria ou já sentiu falta), em vez de tentar imitar um
produto comercial gigante. Algumas categorias que tendem a ter bom escopo:

- **Uma ferramenta de linha de comando** que automatiza uma tarefa repetitiva sua (organizar
  arquivos, converter formatos, gerar relatórios a partir de dados).
- **Um pequeno sistema de gestão** de algo concreto (biblioteca pessoal, coleção, gastos, hábitos —
  parecido com o projeto guiado do mês 5).
- **Uma API simples** com algumas rotas bem definidas, consumida por um cliente simples (linha de
  comando ou uma página web básica).

## Exercício 1: Avalie duas ideias de projeto

Duas ideias de projeto final estão descritas abaixo. Para cada uma, avalie se o escopo parece
terminável em algumas semanas, e identifique pelo menos um risco de "scope creep".

1. "Uma rede social completa, com perfis, posts, curtidas, comentários, mensagens diretas e um feed
   personalizado por algoritmo."
2. "Um sistema de linha de comando para gerenciar uma lista de tarefas, com prioridades, categorias, e
   um comando para listar tarefas atrasadas."

### Solução

**Ideia 1** tem escopo **excessivamente amplo** para um projeto final de curso — cada uma das
funcionalidades listadas (perfis, posts, curtidas, comentários, mensagens diretas, feed com
algoritmo) já seria, isoladamente, um projeto razoável. O risco de scope creep aqui não é nem
"crescer além do planejado" — o escopo inicial já é grande demais para terminar em algumas semanas.

**Ideia 2** tem um escopo mais **realista e terminável**: as funcionalidades (adicionar tarefa,
prioridade, categoria, listar atrasadas) são concretas e limitadas. Um risco de scope creep possível:
a tentação de adicionar "só mais uma coisinha" no meio do caminho, como notificações, sincronização
entre dispositivos, ou uma interface gráfica — nenhuma dessas ideias é ruim, mas todas deveriam ir
explicitamente para a seção "Fora do escopo (por enquanto)" do documento, evitando que o projeto nunca
seja considerado terminado.

## Exercício 2: Escreva seu mini-documento de escopo

Pense em uma ideia de projeto final que você gostaria de construir ao longo deste mês (pode ser
inspirada nas categorias sugeridas na aula, ou uma ideia própria). Escreva seu próprio mini-documento
de escopo, preenchendo as quatro seções: Problema, Funcionalidades essenciais, Fora do escopo, e
Critério de pronto.

### Solução

Não existe uma resposta única correta aqui — o objetivo do exercício é praticar o processo de
**definir limites explícitos** antes de começar a codificar. Um documento de escopo bem escrito deve
permitir que, ao reler depois de duas semanas de trabalho, você consiga responder com clareza "isso
está dentro do escopo original?" para qualquer nova ideia que surgir no meio do caminho. Um bom teste
para avaliar seu próprio documento: mostre a lista de "Funcionalidades essenciais" para alguém que não
conhece o projeto — essa pessoa consegue, só com essa lista, descrever em uma frase o que o sistema
faz? Se a resposta for sim, seu escopo provavelmente está bem definido.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Escolhendo o projeto final" do meu curso de programação. Contexto: a aula explica
> os critérios de um bom escopo de projeto (terminável, usa múltiplas habilidades, com critério claro
> de pronto), o risco de scope creep, e como escrever um mini-documento de escopo (problema,
> funcionalidades essenciais, fora do escopo, critério de pronto). Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].

## Quiz

### 1. Por que um projeto pequeno e completo costuma ser melhor escolha de projeto final do que um projeto ambicioso e inacabado?

- [ ] Porque projetos pequenos sempre têm menos bugs
- [x] Porque um projeto inacabado vale muito menos, tanto para o aprendizado quanto para mostrar a recrutadores, do que um projeto pequeno mas terminado
- [ ] Porque recrutadores nunca avaliam a complexidade de um projeto
- [ ] Porque projetos pequenos não precisam de testes

> Um projeto terminado demonstra capacidade de entregar algo funcional do início ao fim — algo que um
> projeto ambicioso, mas incompleto, não consegue mostrar.

### 2. O que é "scope creep"?

- [ ] Um tipo de bug relacionado a memória
- [x] A expansão descontrolada do escopo de um projeto durante o desenvolvimento, dificultando terminá-lo
- [ ] Um padrão de arquitetura de software
- [ ] Um comando do Git

> Scope creep acontece quando novas funcionalidades tentadoras são adicionadas continuamente durante o
> desenvolvimento, sem um limite definido, dificultando ou impedindo que o projeto seja considerado
> terminado.

### 3. Qual é o propósito da seção "Fora do escopo" em um documento de escopo de projeto?

- [ ] Listar bugs conhecidos do projeto
- [x] Registrar explicitamente o que não faz parte da primeira versão, servindo de referência para recusar expansões não planejadas
- [ ] Listar tecnologias proibidas de usar
- [ ] Substituir a necessidade de testes automatizados

> Definir explicitamente o que fica de fora ajuda a resistir à tentação de expandir o projeto
> indefinidamente no meio do desenvolvimento, servindo como referência objetiva para dizer "isso fica
> para depois".

### 4. O que caracteriza um bom "critério de pronto" para um projeto?

- [ ] Uma lista aberta de possíveis melhorias futuras
- [x] Uma descrição sem ambiguidade de como saber que o projeto está terminado
- [ ] Uma estimativa de quantas linhas de código o projeto deve ter
- [ ] Uma lista de tecnologias que devem ser usadas

> Um bom critério de pronto permite verificar, de forma objetiva e sem ambiguidade, se o projeto
> atingiu o estado esperado — evitando que "terminar" vire um alvo que sempre se move.

### 5. Por que projetos que resolvem um problema pessoal e específico tendem a ter melhor escopo do que tentativas de imitar um produto comercial gigante?

- [ ] Porque produtos comerciais nunca usam boas práticas de programação
- [x] Porque produtos comerciais gigantes normalmente envolvem funcionalidades demais para serem replicadas em um projeto de curso, enquanto um problema pessoal específico naturalmente já vem com um escopo mais limitado
- [ ] Porque problemas pessoais nunca precisam de banco de dados
- [ ] Não há diferença real de escopo entre os dois tipos de projeto

> Produtos comerciais consolidados geralmente acumularam anos de funcionalidades; um problema pessoal
> específico tende a ter uma necessidade mais limitada e concreta, facilitando definir um escopo
> terminável.
