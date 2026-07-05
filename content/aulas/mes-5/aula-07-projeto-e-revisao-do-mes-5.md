---
id: "m5-a7"
mes: 5
numero: 7
titulo: "Projeto e revisão do Mês 5"
objetivo: "Consolidar práticas de engenharia de software com um projeto que aplica testes, arquitetura e banco de dados."
duracao: 30
status: "completo"
---

## Da teoria à prática: um sistema de biblioteca

Este mês cobriu práticas essenciais de engenharia de software: Git avançado, testes automatizados,
código limpo, arquitetura de software, bancos de dados e segurança básica. Neste projeto guiado (em
Python), vamos construir um pequeno **sistema de empréstimo de livros de uma biblioteca**, aplicando
três ideias centrais do mês: **arquitetura em camadas** (separando regras de negócio da persistência
de dados), **testes automatizados** (validando o comportamento sem depender de um banco real), e
**código limpo** (funções pequenas, nomes claros, responsabilidade única).

## Passo 1: a camada de dados (repositório)

Retomando a aula 4, vamos isolar toda a lógica de "onde os dados vivem" em uma classe própria — aqui,
por simplicidade, guardando tudo em memória (um dicionário), mas o princípio de isolamento seria
idêntico se fosse um banco de dados de verdade (aula 5).

## Exercício 1: Implemente o repositório de livros

Escreva uma classe `RepositorioLivros` com os métodos `adicionar(titulo)` (adiciona um livro
disponível), `emprestar(titulo)` (marca um livro como emprestado, devolvendo `True` se havia um livro
disponível para emprestar, ou `False` caso contrário), e `esta_disponivel(titulo)` (devolve `True`/
`False`).

### Solução

```python
class RepositorioLivros:
    def __init__(self):
        self._disponiveis = {}  # titulo -> quantidade disponivel

    def adicionar(self, titulo):
        self._disponiveis[titulo] = self._disponiveis.get(titulo, 0) + 1

    def emprestar(self, titulo):
        if self._disponiveis.get(titulo, 0) <= 0:
            return False
        self._disponiveis[titulo] -= 1
        return True

    def esta_disponivel(self, titulo):
        return self._disponiveis.get(titulo, 0) > 0
```

Note que essa classe só conhece **como armazenar e consultar** a disponibilidade de livros — ela não
sabe nada sobre regras de negócio como "um usuário só pode ter 3 livros emprestados ao mesmo tempo".
Essa separação é exatamente o princípio de **baixo acoplamento** da aula 4: a camada de negócio, que
vamos escrever a seguir, vai depender apenas dos métodos públicos dessa classe (`adicionar`,
`emprestar`, `esta_disponivel`), sem se importar se por trás existe um dicionário em memória ou um
banco de dados relacional de verdade.

## Passo 2: a camada de negócio (regras do empréstimo)

## Exercício 2: Implemente a regra de limite de empréstimos

Escreva uma classe `ServicoDeEmprestimo`, que recebe um `RepositorioLivros` no construtor, e um
método `emprestar_livro(usuario, titulo, emprestimos_do_usuario)`, onde `emprestimos_do_usuario` é a
contagem atual de livros que aquele usuário já tem emprestados. A regra de negócio: um usuário não
pode ter mais de **3** livros emprestados ao mesmo tempo. O método deve devolver uma mensagem
apropriada de sucesso ou erro.

### Solução

```python
LIMITE_EMPRESTIMOS_POR_USUARIO = 3

class ServicoDeEmprestimo:
    def __init__(self, repositorio):
        self._repositorio = repositorio

    def emprestar_livro(self, usuario, titulo, emprestimos_do_usuario):
        if emprestimos_do_usuario >= LIMITE_EMPRESTIMOS_POR_USUARIO:
            return f"{usuario} já atingiu o limite de {LIMITE_EMPRESTIMOS_POR_USUARIO} livros emprestados"

        if not self._repositorio.emprestar(titulo):
            return f"'{titulo}' não está disponível no momento"

        return f"'{titulo}' emprestado com sucesso para {usuario}"
```

Repare que `ServicoDeEmprestimo` (a camada de negócio) nunca acessa o dicionário `_disponiveis`
diretamente — ele só chama o método público `emprestar(titulo)` do repositório, sem saber (nem
precisar saber) como a disponibilidade é armazenada por dentro. A regra de negócio (o limite de 3
livros) vive inteiramente aqui, na camada de negócio, e não na camada de dados — exatamente a
separação de responsabilidades vista na aula 4.

## Passo 3: testando sem precisar de um banco de dados de verdade

Retomando a aula 2, a vantagem de isolar a camada de negócio da camada de dados aparece com clareza
na hora de testar: podemos testar `ServicoDeEmprestimo` usando o próprio `RepositorioLivros` em
memória (rápido, sem infraestrutura externa), como um teste unitário.

## Exercício 3: Escreva os testes do serviço de empréstimo

Escreva dois testes unitários para `ServicoDeEmprestimo`: um verificando que um empréstimo válido
funciona, e outro verificando que o limite de 3 empréstimos por usuário é respeitado.

### Solução

```python
def test_emprestimo_bem_sucedido():
    repositorio = RepositorioLivros()
    repositorio.adicionar("Dom Casmurro")
    servico = ServicoDeEmprestimo(repositorio)

    resultado = servico.emprestar_livro("Ana", "Dom Casmurro", emprestimos_do_usuario=0)

    assert resultado == "'Dom Casmurro' emprestado com sucesso para Ana"
    assert repositorio.esta_disponivel("Dom Casmurro") == False

def test_limite_de_emprestimos_e_respeitado():
    repositorio = RepositorioLivros()
    repositorio.adicionar("1984")
    servico = ServicoDeEmprestimo(repositorio)

    resultado = servico.emprestar_livro("Bruno", "1984", emprestimos_do_usuario=3)

    assert resultado == "Bruno já atingiu o limite de 3 livros emprestados"
    assert repositorio.esta_disponivel("1984") == True  # o livro NÃO deveria ter sido emprestado
```

O segundo teste é particularmente importante: ele confirma não apenas que a mensagem de erro certa é
devolvida, mas que o livro **continua disponível** depois da tentativa recusada — garantindo que a
verificação do limite acontece **antes** de qualquer alteração no repositório. Como visto na aula 2,
esses testes rodam em milissegundos, sem precisar de nenhum banco de dados real, exatamente por
`RepositorioLivros` guardar tudo em memória — na prática, o mesmo teste continuaria funcionando sem
nenhuma mudança mesmo que, no futuro, `RepositorioLivros` passasse a usar um banco relacional de
verdade por trás dos panos.

## Resumo do Mês 5 — engenharia de software na prática

Antes do quiz de revisão, um mapa mental de todo o mês:

- **Aula 1 — Git avançado**: branches permitem trabalho paralelo isolado; merge preserva o histórico
  com bifurcações, rebase reescreve commits para um histórico linear (nunca em branches
  compartilhados); conflitos são resolvidos editando manualmente os marcadores `<<<<<<<`, `=======`
  e `>>>>>>>`.
- **Aula 2 — Testes automatizados**: a estrutura Arrange-Act-Assert organiza um teste; a pirâmide de
  testes prioriza testes unitários (rápidos, isolados) sobre integração e e2e (mais lentos, mais
  abrangentes); TDD segue o ciclo vermelho-verde-refatorar.
- **Aula 3 — Código limpo**: nomes claros eliminam a necessidade de decifrar o propósito do código;
  o princípio da responsabilidade única mantém funções pequenas e focadas; code smells (duplicação,
  números mágicos, aninhamento excessivo) sinalizam problemas de design; DRY evita duplicar a mesma
  regra de negócio em múltiplos lugares.
- **Aula 4 — Arquitetura de software**: camadas (apresentação, negócio, dados) separam
  responsabilidades; MVC é um padrão popular dessa ideia; baixo acoplamento e alta coesão tornam um
  sistema mais fácil de entender, testar e modificar.
- **Aula 5 — Bancos de dados**: bancos relacionais (SQL) organizam dados em tabelas relacionadas por
  chaves, consultadas com `JOIN`; normalização evita duplicação e inconsistência; bancos NoSQL (como
  documentos) oferecem estruturas mais flexíveis, adequadas a dados menos uniformes.
- **Aula 6 — Segurança básica**: SQL Injection e XSS surgem quando entrada do usuário é interpretada
  como código; consultas parametrizadas e escape de HTML são as defesas centrais; senhas devem ser
  guardadas como hash, nunca em texto puro; o princípio do menor privilégio limita o estrago possível
  de qualquer comprometimento.

A partir do mês 6, você vai integrar tudo o que aprendeu nos cinco meses anteriores em um projeto
final robusto, além de se preparar especificamente para entrevistas técnicas de programação.

## Tirou dúvida?

Se travar em algum ponto deste projeto ou da revisão, descreva o contexto exato do que você já
entendeu e onde travou. Copie e adapte o modelo abaixo:

> Estou estudando "Projeto e revisão do Mês 5" do meu curso de programação. Contexto: o projeto
> constrói um sistema de empréstimo de biblioteca em Python, separando repositório (dados) de serviço
> (regras de negócio), com testes unitários, revisando Git avançado, testes, código limpo,
> arquitetura, bancos de dados e segurança do mês inteiro. Minha dúvida/meu exercício: [descreva aqui
> exatamente onde travou].

## Quiz

### 1. Qual é a principal diferença entre merge e rebase no Git?

- [ ] Merge é usado apenas em repositórios privados
- [x] Merge preserva o histórico com bifurcações através de um commit de união; rebase reescreve commits para criar um histórico linear
- [ ] Rebase nunca causa conflitos, merge sempre causa
- [ ] Não há diferença real entre os dois comandos

> Merge cria um commit que une dois caminhos de histórico; rebase reaplica commits sobre uma nova
> base, reescrevendo-os (por isso não deve ser usado em branches já compartilhados).

### 2. Por que testes unitários formam a base da pirâmide de testes?

- [ ] Porque são os únicos testes válidos
- [x] Porque são rápidos, isolados e baratos de rodar, dando retorno imediato sobre pequenas partes do código
- [ ] Porque testes de integração não detectam bugs
- [ ] Porque a ordem da pirâmide é apenas estética

> Testes unitários isolam uma única unidade de código, rodando rapidamente sem depender de sistemas
> externos, o que permite que existam em grande quantidade.

### 3. O que o princípio da responsabilidade única recomenda para uma função?

- [ ] Que ela nunca receba parâmetros
- [x] Que ela faça uma única coisa, e a faça bem
- [ ] Que ela sempre devolva um valor booleano
- [ ] Que ela seja escrita em uma única linha

> Funções focadas em uma única responsabilidade são mais fáceis de entender, testar e reutilizar do
> que funções que misturam múltiplas tarefas.

### 4. O que caracteriza baixo acoplamento entre dois módulos de um sistema?

- [ ] Os módulos nunca trocam informação entre si
- [x] Um módulo depende apenas da interface pública de outro, não de seus detalhes internos de implementação
- [ ] Os módulos estão sempre no mesmo arquivo
- [ ] Um módulo conhece exatamente como o outro armazena seus dados internamente

> Baixo acoplamento significa que mudanças internas em um módulo não exigem alterações em outros
> módulos que dependem apenas de sua interface estável.

### 5. Qual é a função do `JOIN` em uma consulta SQL?

- [ ] Apagar registros duplicados de uma tabela
- [x] Combinar linhas de tabelas diferentes com base em uma relação entre elas
- [ ] Criar uma nova tabela vazia
- [ ] Validar os dados antes de inserir na tabela

> `JOIN` permite consultar informações relacionadas que estão espalhadas por tabelas diferentes,
> combinando-as com base em chaves primárias e estrangeiras.

### 6. Por que a normalização de um banco de dados relacional é importante?

- [ ] Porque torna todas as consultas SQL mais rápidas automaticamente
- [x] Porque evita duplicação de dados, reduzindo o risco de inconsistências quando uma informação precisa ser atualizada
- [ ] Porque é exigida pela sintaxe do SQL
- [ ] Porque elimina a necessidade de chaves primárias

> Sem normalização, dados duplicados em múltiplos lugares podem ficar inconsistentes se apenas
> algumas cópias forem atualizadas; a normalização guarda cada informação em um único lugar canônico.

### 7. O que é uma vulnerabilidade de SQL Injection?

- [ ] Um erro de conexão com o banco de dados
- [x] Uma falha onde entrada do usuário, inserida sem tratamento em uma consulta, é interpretada como código SQL
- [ ] Uma otimização de performance de consultas
- [ ] Um recurso exclusivo de bancos NoSQL

> SQL Injection ocorre quando texto controlado pelo usuário é concatenado diretamente em uma consulta,
> permitindo alterar seu comportamento — evitado com consultas parametrizadas.

### 8. Por que senhas devem ser armazenadas como hash, em vez de texto puro?

- [ ] Para economizar espaço no banco de dados
- [x] Para que, em caso de vazamento do banco de dados, a senha original não fique diretamente exposta
- [ ] Para tornar o processo de login mais rápido
- [ ] Não há diferença de segurança entre as duas abordagens

> Um hash é uma transformação de mão única; mesmo que o banco vaze, a senha original não pode ser
> facilmente recuperada a partir do hash armazenado.

### 9. No projeto desta aula, por que `ServicoDeEmprestimo` (camada de negócio) não acessa diretamente o dicionário interno de `RepositorioLivros`?

- [ ] Porque Python não permite esse tipo de acesso
- [x] Para manter baixo acoplamento: o serviço depende apenas da interface pública do repositório, podendo trocar sua implementação interna sem impacto
- [ ] Porque dicionários não podem ser usados dentro de classes
- [ ] Isso não faz diferença prática nenhuma

> Depender apenas dos métodos públicos do repositório (`emprestar`, `esta_disponivel`) permite que sua
> implementação interna mude (por exemplo, para um banco de dados real) sem exigir nenhuma alteração
> na camada de negócio.

### 10. Qual é a vantagem de testar `ServicoDeEmprestimo` usando `RepositorioLivros` em memória, em vez de um banco de dados real?

- [ ] Um banco de dados real nunca poderia ser usado para esse tipo de sistema
- [x] Os testes rodam rapidamente e de forma isolada, sem depender de infraestrutura externa, retomando a vantagem de testes unitários
- [ ] Testes com banco de dados real sempre falham
- [ ] Não há vantagem real, os dois métodos são equivalentes

> Testes que não dependem de infraestrutura externa (como um banco de dados real) rodam mais rápido e
> de forma mais previsível — a essência de um teste unitário eficaz, discutida na aula 2.
