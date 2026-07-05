---
id: "m5-a4"
mes: 5
numero: 4
titulo: "Arquitetura de software"
objetivo: "Entender padrões de arquitetura que organizam sistemas maiores de forma sustentável."
duracao: 30
status: "completo"
---

## Do código limpo ao sistema inteiro

A aula passada tratou de como organizar **funções e nomes** dentro de um arquivo. Esta aula sobe um
nível de abstração: como organizar **um sistema inteiro**, com muitos arquivos, módulos e
responsabilidades diferentes, de um jeito que continue fácil de entender e modificar conforme o
projeto cresce. Essa organização de alto nível — como as partes de um sistema se dividem e se
comunicam entre si — é o que chamamos de **arquitetura de software**.

## Separação em camadas

Um padrão extremamente comum é organizar um sistema em **camadas**, cada uma com uma responsabilidade
bem definida, parecido com o modelo de camadas de rede que vimos no mês 4 — cada camada conversa
apenas com a camada vizinha, sem precisar conhecer os detalhes internos das demais:

```text
┌─────────────────────────┐
│   Apresentação           │  <- interface com o usuário (páginas web, API, linha de comando)
├─────────────────────────┤
│   Negócio (domínio)      │  <- regras e lógica específicas do problema sendo resolvido
├─────────────────────────┤
│   Dados (persistência)   │  <- leitura e escrita em banco de dados, arquivos, cache
└─────────────────────────┘
```

- **Camada de apresentação**: recebe a entrada do usuário (um clique, uma requisição HTTP — retomando
  o mês 4) e mostra os resultados de volta. Não deveria conter regras de negócio complexas.
- **Camada de negócio**: o "cérebro" do sistema — valida regras, calcula valores, decide o que fazer.
  Por exemplo, "um pedido só pode ser cancelado se ainda não foi enviado" é uma regra de negócio.
- **Camada de dados**: responsável por salvar e recuperar informações de forma persistente (banco de
  dados, aula 5 deste mês), escondendo da camada de negócio os detalhes de **como** os dados são
  armazenados.

A vantagem central dessa separação: a camada de negócio pode ser testada (retomando a aula 2) sem
depender de um banco de dados real, e a interface (web, app mobile, linha de comando) pode mudar
completamente sem exigir nenhuma alteração nas regras de negócio, desde que a camada de dados
continue oferecendo a mesma informação.

## MVC: um padrão popular de camadas

**MVC** (*Model-View-Controller*) é uma forma específica e muito difundida de aplicar a ideia de
camadas, comum em frameworks web:

- **Model (modelo)**: representa os dados e as regras de negócio — equivalente às camadas de negócio
  e dados juntas, no modelo genérico acima.
- **View (visão)**: responsável por exibir informação ao usuário — o HTML renderizado, por exemplo.
- **Controller (controlador)**: recebe a requisição do usuário, decide o que fazer (chamando o
  Model), e escolhe qual View mostrar como resposta.

```text
Usuário → Controller → Model (busca/atualiza dados e aplica regras)
              ↓
            View (mostra o resultado para o usuário)
```

Um exemplo prático: ao acessar a página de um produto em uma loja online, o **Controller** recebe a
requisição, pede ao **Model** os dados daquele produto (que, por sua vez, pode consultar o banco de
dados e aplicar regras como "só mostrar se estiver em estoque"), e então passa esses dados para a
**View**, que os renderiza como HTML para o navegador.

## Acoplamento e coesão

Dois conceitos centrais para avaliar se uma arquitetura está bem organizada:

- **Acoplamento**: o quanto uma parte do sistema **depende dos detalhes internos** de outra parte.
  Acoplamento **baixo** é desejável: uma mudança interna em um módulo não deveria forçar mudanças em
  outros módulos que apenas o utilizam.
- **Coesão**: o quanto os elementos **dentro** de um mesmo módulo estão relacionados entre si, focados
  em um único propósito. Coesão **alta** é desejável: um módulo deveria agrupar coisas que realmente
  pertencem juntas (o mesmo raciocínio da responsabilidade única da aula 3, aplicado a um módulo
  inteiro, e não só a uma função).

Uma boa arquitetura busca **alta coesão, baixo acoplamento**: módulos internamente bem organizados em
torno de um propósito claro, mas que se comunicam entre si através de interfaces simples e estáveis,
sem depender dos detalhes de implementação uns dos outros.

```python
# Alto acoplamento: ProcessadorDePedido conhece detalhes internos de EstoqueSQL
class ProcessadorDePedido:
    def processar(self, pedido):
        conexao = sqlite3.connect("estoque.db")
        cursor = conexao.cursor()
        cursor.execute("UPDATE estoque SET quantidade = quantidade - ? WHERE produto_id = ?",
                       (pedido.quantidade, pedido.produto_id))
        conexao.commit()

# Baixo acoplamento: ProcessadorDePedido só conhece a interface de Estoque
class ProcessadorDePedido:
    def __init__(self, estoque):
        self.estoque = estoque

    def processar(self, pedido):
        self.estoque.remover(pedido.produto_id, pedido.quantidade)
```

Na segunda versão, `ProcessadorDePedido` não sabe (nem precisa saber) se `estoque` guarda dados em
SQLite, em um arquivo de texto, ou em memória — ele só depende do método `remover(...)` existir. Isso
significa que `Estoque` pode ser completamente reescrito por dentro (trocar de banco de dados, por
exemplo) sem exigir nenhuma mudança em `ProcessadorDePedido`, e também torna `ProcessadorDePedido`
mais fácil de testar (basta fornecer uma versão falsa de `estoque` que simula o comportamento
esperado, sem precisar de um banco de dados real).

## Exercício 1: Identifique a camada

Para cada responsabilidade abaixo, identifique a qual camada da arquitetura em camadas ela pertence
(Apresentação, Negócio ou Dados):

1. Verificar se um pedido pode ser cancelado, com base na regra "só antes de ser enviado"
2. Exibir a mensagem de confirmação de cancelamento na tela do usuário
3. Executar a consulta SQL que atualiza o status do pedido no banco de dados

### Solução

1. **Negócio** — a regra "só pode cancelar antes de ser enviado" é uma decisão sobre o domínio do
   problema, não sobre como os dados são exibidos ou armazenados.
2. **Apresentação** — mostrar informação ao usuário é responsabilidade da camada que lida com a
   interface, sem envolver a lógica de decisão nem o armazenamento.
3. **Dados** — a execução direta de uma consulta SQL é um detalhe de **como** a informação é
   persistida, que deveria ficar isolado na camada de dados.

## Exercício 2: Avalie o acoplamento

Compare as duas versões de `ProcessadorDePedido` mostradas na aula. Se a equipe decidir trocar o
banco de dados de SQLite para PostgreSQL, qual das duas versões exige mudanças em
`ProcessadorDePedido`, e por quê?

### Solução

A **primeira versão** (alto acoplamento) exigiria mudanças em `ProcessadorDePedido`, porque o código
de conexão e a consulta SQL específica estão escritos diretamente dentro dela — trocar de banco de
dados normalmente significa mudar a forma de conectar e, possivelmente, a sintaxe de algumas
consultas. A **segunda versão** (baixo acoplamento) não exigiria nenhuma mudança em
`ProcessadorDePedido`: ela não sabe nem se importa com qual banco de dados está por trás de
`estoque.remover(...)` — toda a complexidade de trocar de banco ficaria isolada dentro da própria
classe `Estoque`, sem vazar para quem a utiliza.

## Exercício 3: Coesão em um módulo

Um módulo chamado `utilitarios.py` contém as seguintes funções: `formatar_data`, `enviar_email`,
`calcular_frete`, e `validar_cpf`. Essas funções, juntas, formam um módulo de **alta** ou **baixa**
coesão? Justifique, e proponha uma reorganização melhor.

### Solução

Esse é um módulo de **baixa coesão**: as quatro funções não compartilham um propósito comum — formatar
datas, enviar e-mails, calcular frete e validar CPF são responsabilidades completamente diferentes,
agrupadas apenas por serem "coisas genéricas que não se encaixam em outro lugar" (um padrão comum,
mas problemático, de módulo "gaveta de bagunça"). Uma reorganização com maior coesão separaria essas
funções por propósito relacionado: `formatacao.py` (com `formatar_data` e outras funções de
formatação), `notificacoes.py` (com `enviar_email` e funções relacionadas), `frete.py` (com
`calcular_frete`), e `validacao.py` (com `validar_cpf` e outras validações) — cada módulo agrupando
apenas funções que genuinamente pertencem ao mesmo domínio de responsabilidade.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Arquitetura de software" do meu curso de programação. Contexto: a aula explica
> arquitetura em camadas (apresentação, negócio, dados), o padrão MVC, e os conceitos de acoplamento
> (baixo é melhor) e coesão (alta é melhor). Minha dúvida/meu exercício: [descreva aqui exatamente
> onde travou].

## Quiz

### 1. Qual é o papel da camada de negócio em uma arquitetura em camadas?

- [ ] Exibir informações formatadas para o usuário
- [x] Aplicar as regras e a lógica específicas do problema sendo resolvido
- [ ] Executar consultas diretas ao banco de dados
- [ ] Gerenciar a conexão de rede com o servidor

> A camada de negócio concentra as decisões e regras do domínio do problema (como "um pedido só pode
> ser cancelado antes de ser enviado"), independente de como os dados são exibidos ou armazenados.

### 2. No padrão MVC, qual componente decide o que fazer com uma requisição do usuário e escolhe qual View mostrar?

- [ ] Model
- [ ] View
- [x] Controller
- [ ] Nenhum dos três — isso é feito diretamente pelo banco de dados

> O Controller recebe a requisição, coordena com o Model para obter ou atualizar dados, e decide qual
> View deve ser exibida como resposta.

### 3. O que significa "baixo acoplamento" entre dois módulos?

- [ ] Os módulos nunca se comunicam entre si
- [x] Um módulo não depende dos detalhes internos de implementação do outro, apenas de uma interface estável
- [ ] Os módulos compartilham todas as suas variáveis internas
- [ ] Os módulos estão no mesmo arquivo

> Baixo acoplamento significa que mudanças internas em um módulo não exigem mudanças em outros
> módulos que dependem apenas de sua interface pública, e não de seus detalhes de implementação.

### 4. O que caracteriza um módulo com "alta coesão"?

- [ ] Ele contém o maior número possível de funções
- [x] Seus elementos internos estão fortemente relacionados, focados em um único propósito
- [ ] Ele depende de muitos outros módulos do sistema
- [ ] Ele não tem nenhuma função pública

> Alta coesão significa que tudo dentro do módulo pertence genuinamente ao mesmo propósito ou domínio
> de responsabilidade, evitando módulos que misturam funcionalidades não relacionadas.

### 5. Por que uma boa arquitetura busca alta coesão e baixo acoplamento ao mesmo tempo?

- [ ] Porque isso torna o programa mais rápido de executar
- [x] Porque módulos coesos e pouco acoplados são mais fáceis de entender, testar e modificar isoladamente, sem efeitos colaterais inesperados em outras partes do sistema
- [ ] Porque é uma exigência da maioria das linguagens de programação
- [ ] Porque reduz o número de arquivos do projeto

> Alta coesão mantém cada módulo focado e compreensível; baixo acoplamento isola o impacto de mudanças
> — juntos, tornam o sistema mais fácil de manter e evoluir conforme cresce.
