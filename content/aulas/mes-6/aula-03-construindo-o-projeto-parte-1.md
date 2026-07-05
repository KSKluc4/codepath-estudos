---
id: "m6-a3"
mes: 6
numero: 3
titulo: "Construindo o projeto (parte 1)"
objetivo: "Implementar a primeira metade do projeto final aplicando boas práticas."
duracao: 40
status: "completo"
---

## Da planta baixa à primeira parede

Com o escopo (aula 1) e a arquitetura (aula 2) definidos, chegou a hora de escrever código de
verdade. Esta aula cobre a primeira metade da implementação: configurar o ambiente do projeto
corretamente, e construir o **núcleo** — as camadas de dados e negócio, de baixo para cima —, antes de
qualquer preocupação com interface.

## Configurando o repositório desde o início

Retomando o mês 5, aula 1, um projeto deveria nascer já versionado com Git, não ganhar controle de
versão como uma reflexão tardia depois de várias horas de código já escritas:

```bash
mkdir rastreador-habitos
cd rastreador-habitos
git init
```

Um primeiro commit vazio ou mínimo, logo de cara, estabelece o ponto de partida do histórico:

```bash
echo "# Rastreador de Hábitos" > README.md
git add README.md
git commit -m "Inicializa o projeto"
```

A partir daqui, a prática recomendada é commitar em **incrementos pequenos e funcionais** — cada
commit representando um passo coerente (uma função implementada, um teste adicionado), em vez de um
único commit gigante no final com "implementa tudo". Isso não é só disciplina por disciplina: um
histórico incremental permite voltar a um estado anterior específico caso algo dê errado, e comunica
claramente, para quem ler o histórico depois (incluindo você mesmo), como o projeto evoluiu.

## De baixo para cima: comece pela camada de dados

Retomando a arquitetura esboçada na aula 2, uma ordem de implementação que costuma funcionar bem é
**de baixo para cima**: primeiro a camada de dados (o alicerce), depois a camada de negócio (que
depende dela), e só depois a apresentação (que depende de ambas). Isso evita a armadilha de construir
uma interface bonita por cima de uma base que ainda não existe de verdade.

```python
# repositorio.py — camada de dados
import json
import os

class RepositorioDeHabitos:
    def __init__(self, caminho_arquivo="habitos.json"):
        self._caminho_arquivo = caminho_arquivo
        self._habitos = self._carregar()

    def _carregar(self):
        if not os.path.exists(self._caminho_arquivo):
            return {}
        with open(self._caminho_arquivo, "r") as arquivo:
            return json.load(arquivo)

    def _salvar(self):
        with open(self._caminho_arquivo, "w") as arquivo:
            json.dump(self._habitos, arquivo, indent=2)

    def adicionar_habito(self, nome):
        if nome not in self._habitos:
            self._habitos[nome] = {"marcacoes": []}
            self._salvar()

    def marcar_dia(self, nome, data):
        if nome in self._habitos and data not in self._habitos[nome]["marcacoes"]:
            self._habitos[nome]["marcacoes"].append(data)
            self._salvar()

    def obter_marcacoes(self, nome):
        return self._habitos.get(nome, {}).get("marcacoes", [])
```

Note que essa classe só sabe **como persistir** hábitos e marcações — ela não sabe calcular um
streak, nem validar regras de negócio. Essa disciplina de manter a camada de dados "burra" (sem
regras de negócio) é o que permite trocar sua implementação interna no futuro (de JSON para um banco
de verdade, por exemplo) sem afetar a camada de negócio, exatamente como discutido na aula 2 do mês 5.

## Construindo a camada de negócio por cima

Com a camada de dados funcionando, a camada de negócio pode ser construída **usando** o repositório,
sem se preocupar com como os dados são fisicamente armazenados:

```python
# servico.py — camada de negócio
from datetime import date, timedelta

class ServicoDeHabitos:
    def __init__(self, repositorio):
        self._repositorio = repositorio

    def registrar_habito(self, nome):
        self._repositorio.adicionar_habito(nome)

    def concluir_hoje(self, nome):
        hoje = date.today().isoformat()
        self._repositorio.marcar_dia(nome, hoje)

    def calcular_streak(self, nome):
        marcacoes = set(self._repositorio.obter_marcacoes(nome))
        streak = 0
        dia_atual = date.today()
        while dia_atual.isoformat() in marcacoes:
            streak += 1
            dia_atual -= timedelta(days=1)
        return streak
```

O método `calcular_streak` é a primeira **regra de negócio de verdade** do projeto: ele parte de hoje
e volta dia a dia, contando quantos dias consecutivos aparecem marcados, parando no primeiro dia sem
marcação. Repare que esse método não sabe nada sobre arquivos ou JSON — ele só chama
`obter_marcacoes`, confiando que o repositório devolve a lista correta, não importa como ela é
armazenada por baixo.

## Commits pequenos, uma peça de cada vez

Uma sequência de commits razoável para essa primeira metade do projeto, refletindo o progresso
incremental:

```bash
git add repositorio.py
git commit -m "Implementa RepositorioDeHabitos com persistencia em JSON"

git add servico.py
git commit -m "Implementa ServicoDeHabitos com registro e conclusao de habitos"

git add servico.py
git commit -m "Implementa calculo de streak no ServicoDeHabitos"
```

Cada commit representa um pedaço coerente e funcional — nunca um estado quebrado no meio do caminho.
Se, revisando depois, você perceber que o cálculo de streak tem um bug, esse histórico granular
facilita identificar exatamente em qual commit o comportamento mudou.

## Exercício 1: Complete o repositório

Adicione ao `RepositorioDeHabitos` um método `remover_habito(nome)`, que remove um hábito e todas as
suas marcações. Depois, escreva o comando `git commit` apropriado para esse incremento, seguindo o
padrão de mensagens usado na aula.

### Solução

```python
def remover_habito(self, nome):
    if nome in self._habitos:
        del self._habitos[nome]
        self._salvar()
```

```bash
git add repositorio.py
git commit -m "Adiciona remocao de habitos no RepositorioDeHabitos"
```

O método segue o mesmo estilo dos demais: verifica se o hábito existe antes de agir (evitando um
erro caso o nome não exista), remove a entrada correspondente do dicionário interno, e persiste a
mudança chamando `_salvar()` — a mesma disciplina de sempre salvar após qualquer alteração, já
estabelecida pelos outros métodos da classe.

## Exercício 2: Identifique a camada errada

Um colega de curso escreveu o método abaixo diretamente dentro de `RepositorioDeHabitos`:

```python
def esta_em_dia(self, nome):
    marcacoes = self._habitos.get(nome, {}).get("marcacoes", [])
    hoje = date.today().isoformat()
    return hoje in marcacoes
```

Por que esse método está na camada errada? Em qual classe ele deveria estar, e por quê?

### Solução

Esse método está na camada **errada**: `esta_em_dia` decide algo sobre a **regra de negócio** ("o
hábito foi cumprido hoje?"), não sobre **como persistir dados** — que é a única responsabilidade que
`RepositorioDeHabitos` deveria ter. Ele deveria estar em `ServicoDeHabitos`, ao lado de
`calcular_streak`, chamando o repositório apenas para obter os dados brutos:

```python
# Dentro de ServicoDeHabitos
def esta_em_dia(self, nome):
    hoje = date.today().isoformat()
    return hoje in self._repositorio.obter_marcacoes(nome)
```

Misturar essa lógica dentro do repositório violaria a separação de responsabilidades da arquitetura
em camadas (mês 5, aula 4): se no futuro a definição de "em dia" mudar (por exemplo, passar a
considerar hábitos semanais, não só diários), essa mudança deveria afetar apenas a camada de negócio,
sem exigir alterações na camada de dados.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Construindo o projeto (parte 1)" do meu curso de programação. Contexto: a aula
> explica como configurar o repositório Git desde o início do projeto, construir de baixo para cima
> (dados, depois negócio), e manter commits pequenos e incrementais. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].

## Quiz

### 1. Por que é recomendado configurar o Git desde o início de um projeto, e não como uma reflexão tardia?

- [ ] Porque o Git só funciona se configurado antes de qualquer código ser escrito
- [x] Porque um histórico de commits desde o início permite acompanhar a evolução do projeto e voltar a estados anteriores específicos se necessário
- [ ] Porque projetos sem Git não podem ser hospedados no GitHub
- [ ] Não há vantagem real em configurar o Git cedo

> Iniciar o controle de versão desde o começo garante que todo o progresso do projeto fique registrado
> de forma incremental e recuperável, em vez de depender de um único commit tardio.

### 2. Por que construir "de baixo para cima" (dados, depois negócio, depois apresentação) é uma ordem razoável de implementação?

- [ ] Porque a camada de apresentação nunca deveria ser implementada
- [x] Porque evita construir uma interface por cima de uma base (dados e regras) que ainda não existe de verdade
- [ ] Porque é a única ordem permitida pela linguagem Python
- [ ] Porque a camada de dados sempre é mais rápida de implementar

> Implementar primeiro as camadas das quais as demais dependem evita a armadilha de construir uma
> interface funcional sobre uma lógica de negócio ou persistência ainda incompleta ou inexistente.

### 3. Por que `RepositorioDeHabitos` não deveria conter a lógica de calcular um streak?

- [ ] Porque cálculos matemáticos não podem ser feitos em Python
- [x] Porque calcular streak é uma regra de negócio, e misturá-la com a camada de dados violaria a separação de responsabilidades da arquitetura em camadas
- [ ] Porque streaks só podem ser calculados no banco de dados
- [ ] Não há problema nenhum nisso, é apenas uma questão de estilo

> Manter a camada de dados livre de regras de negócio permite trocar sua implementação (por exemplo,
> de JSON para um banco real) sem afetar a lógica que decide o comportamento do sistema.

### 4. Qual é a vantagem de fazer commits pequenos e incrementais durante o desenvolvimento do projeto?

- [ ] Reduz o tamanho final do repositório
- [x] Facilita identificar exatamente em qual etapa um comportamento específico foi introduzido, e permite voltar a um estado funcional anterior se necessário
- [ ] Torna o código automaticamente mais rápido de executar
- [ ] É uma exigência técnica do Git para repositórios grandes

> Um histórico granular de commits pequenos e funcionais facilita rastrear quando um bug foi
> introduzido e permite reverter a um ponto anterior específico, se necessário.

### 5. No exercício sobre `esta_em_dia`, por que esse método deveria estar em `ServicoDeHabitos`, e não em `RepositorioDeHabitos`?

- [ ] Porque `RepositorioDeHabitos` não pode ter métodos que retornam valores booleanos
- [x] Porque decidir se um hábito "está em dia" é uma regra do domínio do problema, não uma questão de como os dados são persistidos
- [ ] Porque `ServicoDeHabitos` é sempre mais rápido de executar
- [ ] Não faz diferença em qual classe esse método fica

> Regras que decidem o comportamento do sistema (como definir "em dia") pertencem à camada de
> negócio, que pode evoluir independentemente de como os dados são armazenados na camada de dados.
