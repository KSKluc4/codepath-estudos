---
id: "m6-a2"
mes: 6
numero: 2
titulo: "Planejando a arquitetura do projeto"
objetivo: "Planejar a arquitetura técnica do projeto final antes de escrever código."
duracao: 25
status: "completo"
---

## Antes de codar, desenhe

Com o escopo do seu projeto definido na aula passada, a tentação natural é abrir o editor e começar a
escrever código imediatamente. Resista a essa pressa: alguns minutos planejando a **arquitetura**
(retomando o mês 5, aula 4) antes de escrever a primeira linha economizam horas de retrabalho depois —
é muito mais barato mudar um plano no papel do que reescrever código já feito porque uma decisão
estrutural inicial se mostrou ruim no meio do caminho.

## Um diagrama simples de arquitetura em camadas

Você não precisa de uma ferramenta sofisticada de diagramação — um esboço em texto, como o que
usamos ao longo deste curso, já é suficiente para alinhar as ideias antes de codar. Retomando a
arquitetura em camadas do mês 5:

```text
┌─────────────────────────────────────┐
│  Apresentação                        │
│  (linha de comando ou rotas de API)  │
├─────────────────────────────────────┤
│  Negócio                             │
│  (regras: streak, limites, validações)│
├─────────────────────────────────────┤
│  Dados                               │
│  (repositório: salvar/consultar)     │
└─────────────────────────────────────┘
```

Para o exemplo do "rastreador de hábitos" da aula anterior, um diagrama preenchido poderia ser:

```text
Apresentação: comandos de terminal (adicionar-habito, marcar-dia, ver-historico)
       ↓
Negócio: ServicoDeHabitos (calcula streak, valida frequência, aplica regras)
       ↓
Dados: RepositorioDeHabitos (salva e consulta hábitos e marcações)
```

O valor desse diagrama não é a estética — é forçar você a responder, **antes** de escrever código,
perguntas como: "que módulos vou ter?", "quem depende de quem?", "onde vive cada responsabilidade?".

## Escolhendo tecnologias com justificativa

Para cada peça técnica do projeto (linguagem, forma de persistência, bibliotecas), vale a pena
escrever explicitamente **por que** aquela escolha faz sentido para o seu projeto específico — não
"porque é a mais popular" ou "porque vi em um tutorial", mas uma justificativa ligada ao escopo e às
restrições reais do projeto.

| Decisão | Pergunta a se fazer | Exemplo de justificativa |
|---------|----------------------|----------------------------|
| Linguagem | Qual você já domina o suficiente para focar em resolver o problema, não a sintaxe? | "Python, porque quero focar na lógica do projeto, não relembrar sintaxe" |
| Persistência | Os dados precisam sobreviver a reinicializações? Precisam de relações complexas? | "Um arquivo JSON simples é suficiente — não há relações complexas nem múltiplos usuários" |
| Interface | Uma interface de linha de comando resolve, ou o projeto exige uma tela visual? | "Linha de comando, porque o foco do projeto é a lógica de streaks, não a interface" |

Justificar cada escolha, mesmo brevemente, tem um efeito colateral valioso: força você a perceber
quando está escolhendo algo só porque é o que já conhece, versus escolhendo algo genuinamente
adequado ao problema — e também é exatamente esse tipo de raciocínio que uma entrevista técnica
frequentemente pede ("por que você escolheu X em vez de Y?").

## Pensando no modelo de dados antes do código

Retomando a aula 5 do mês 5, vale a pena esboçar, ainda em texto, **quais entidades** seu projeto vai
guardar e como elas se relacionam, antes de escrever a primeira classe:

```text
Habito
  - id
  - nome
  - frequencia_desejada (ex: "diaria")

Marcacao
  - habito_id  (chave estrangeira apontando para Habito)
  - data
  - concluido (booleano)
```

Note que esse esboço já responde perguntas de design importantes: um hábito pode ter várias marcações
(uma por dia), e cada marcação pertence a exatamente um hábito — a mesma relação um-para-muitos vista
nas tabelas `clientes`/`pedidos` do mês 5. Ter esse modelo claro antes de codar evita descobrir, no
meio da implementação, que a estrutura de dados escolhida não suporta uma consulta importante (como
"quantos dias consecutivos esse hábito foi concluído?").

## Exercício 1: Desenhe a arquitetura em camadas

Para um projeto de "lista de tarefas com prioridades e categorias" (linha de comando), esboce um
diagrama de arquitetura em três camadas (apresentação, negócio, dados), preenchendo o que cada camada
seria responsável por fazer.

### Solução

```text
Apresentação: comandos de terminal (adicionar-tarefa, listar-atrasadas, concluir-tarefa)
       ↓
Negócio: ServicoDeTarefas (decide o que conta como "atrasada", valida prioridade/categoria válidas)
       ↓
Dados: RepositorioDeTarefas (salva e consulta tarefas, prioridades e categorias)
```

A camada de **apresentação** só traduz comandos digitados pelo usuário em chamadas para a camada de
negócio, sem conter regras próprias. A camada de **negócio** concentra decisões como "uma tarefa é
considerada atrasada se a data de vencimento já passou e ela ainda não foi concluída" — uma regra do
domínio do problema, não de como os dados são armazenados. A camada de **dados** só sabe salvar e
consultar tarefas, sem conhecer o conceito de "atrasada" — essa palavra nem deveria aparecer no código
dessa camada.

## Exercício 2: Justifique uma escolha técnica

Para o mesmo projeto de lista de tarefas, você está decidindo entre guardar os dados em um arquivo
JSON simples ou em um banco de dados relacional (SQLite, por exemplo). Considerando que o projeto é
de uso pessoal, para um único usuário, sem necessidade de consultas complexas, qual escolha parece
mais justificada, e por quê?

### Solução

Um **arquivo JSON simples** parece mais justificado neste caso. As restrições do projeto (uso
pessoal, um único usuário, sem consultas complexas como `JOIN`s entre múltiplas entidades
relacionadas) não exigem as garantias que um banco relacional oferece — a complexidade extra de
configurar e consultar um SQLite não traria benefício real para este escopo específico. Se o projeto
crescesse para múltiplos usuários, categorias compartilhadas entre eles, ou consultas mais elaboradas
(por exemplo, relatórios cruzando tarefas de várias categorias e prazos), a justificativa mudaria de
lado — nesse cenário, os benefícios de um banco relacional real (retomando o mês 5) começariam a
compensar a complexidade adicional. O ponto central do exercício não é que uma opção seja "sempre
melhor", mas que a decisão deveria vir de uma justificativa ligada às restrições reais do projeto, não
de um hábito ou preferência genérica.

## Exercício 3: Esboce o modelo de dados

Para o mesmo projeto de lista de tarefas (com prioridade e categoria por tarefa), esboce, em texto,
as entidades principais e seus atributos, seguindo o formato usado na aula para `Habito` e
`Marcacao`.

### Solução

```text
Tarefa
  - id
  - titulo
  - prioridade (ex: "alta", "media", "baixa")
  - categoria
  - data_vencimento
  - concluida (booleano)
```

Diferente do exemplo de hábitos, este projeto provavelmente precisa de apenas **uma entidade**
principal (`Tarefa`), sem uma segunda entidade separada como `Marcacao` — cada tarefa já carrega, em
si mesma, todas as informações necessárias (prioridade, categoria, prazo, status). Esboçar isso antes
de codar já revela uma decisão importante: não há uma relação um-para-muitos como no projeto de
hábitos, então o modelo de dados aqui é mais simples, o que por sua vez reforça a justificativa do
Exercício 2 de que um arquivo JSON simples é suficiente, sem necessidade de relacionar tabelas.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Planejando a arquitetura do projeto" do meu curso de programação. Contexto: a aula
> explica como esboçar um diagrama de arquitetura em camadas antes de codar, como justificar escolhas
> técnicas com base nas restrições reais do projeto, e como esboçar o modelo de dados (entidades e
> relações) antecipadamente. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].

## Quiz

### 1. Por que vale a pena esboçar a arquitetura de um projeto antes de escrever código?

- [ ] Porque é uma exigência formal de todo projeto de programação
- [x] Porque é mais barato ajustar um plano no papel do que reescrever código já implementado, caso uma decisão estrutural inicial se mostre inadequada
- [ ] Porque diagramas de arquitetura substituem a necessidade de testes
- [ ] Porque o compilador exige um diagrama antes de rodar o código

> Planejar a estrutura antes de codar permite identificar problemas de design cedo, quando ainda são
> baratos de corrigir, em vez de descobri-los depois de boa parte do código já estar escrito.

### 2. Em uma arquitetura em camadas, qual camada deveria concentrar uma regra como "uma tarefa é considerada atrasada se o prazo já passou e ela não foi concluída"?

- [ ] Apresentação
- [x] Negócio
- [ ] Dados
- [ ] Nenhuma das camadas — essa regra deveria ficar espalhada por todas

> Regras que definem o comportamento do domínio do problema pertencem à camada de negócio,
> independente de como os dados são exibidos (apresentação) ou armazenados (dados).

### 3. O que significa justificar uma escolha técnica com base nas "restrições reais do projeto"?

- [ ] Escolher sempre a tecnologia mais recente disponível
- [x] Basear a decisão nas necessidades específicas do projeto (como volume de dados, complexidade de consultas, número de usuários), em vez de hábito ou popularidade genérica
- [ ] Escolher sempre a tecnologia mais simples possível, sem exceção
- [ ] Perguntar a outras pessoas qual tecnologia usar, sem analisar o próprio projeto

> Uma boa justificativa técnica conecta a escolha às restrições e necessidades concretas daquele
> projeto específico, e não a uma preferência genérica ou à tecnologia mais na moda.

### 4. Qual é a vantagem de esboçar o modelo de dados (entidades e relações) antes de implementar o projeto?

- [ ] Elimina completamente a necessidade de testes
- [x] Ajuda a identificar, antecipadamente, se a estrutura de dados escolhida suporta as consultas e regras que o projeto vai precisar
- [ ] Torna o código automaticamente mais rápido de executar
- [ ] É uma exigência da linguagem de programação

> Esboçar as entidades e como elas se relacionam revela decisões importantes de design antes da
> implementação, evitando descobrir tarde demais que uma consulta necessária não é bem suportada pela
> estrutura escolhida.

### 5. No exercício da lista de tarefas, por que um arquivo JSON simples foi considerado mais adequado do que um banco relacional?

- [ ] Porque bancos relacionais nunca deveriam ser usados em projetos pessoais
- [x] Porque as restrições do projeto (uso pessoal, um usuário, sem consultas complexas) não justificam a complexidade adicional de um banco relacional
- [ ] Porque arquivos JSON são sempre mais rápidos que bancos de dados
- [ ] Porque bancos relacionais não suportam múltiplas categorias

> A escolha entre JSON e banco relacional depende do contexto: para um projeto simples, de uso
> pessoal e sem relações complexas entre entidades, a simplicidade de um arquivo JSON é suficiente e
> evita complexidade desnecessária.
