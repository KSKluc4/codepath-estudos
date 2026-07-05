---
id: "m6-a4"
mes: 6
numero: 4
titulo: "Construindo o projeto (parte 2)"
objetivo: "Finalizar a implementação do projeto final."
duracao: 40
status: "completo"
---

## Completando a estrutura

Na aula passada, construímos o núcleo do projeto — a camada de dados e a camada de negócio — seguindo
a ordem "de baixo para cima". Agora é hora de completar a implementação: adicionar a camada de
**apresentação** (a interface que o usuário realmente usa), implementar as funcionalidades restantes
do escopo definido na aula 1, e, criticamente, **refatorar** o código à luz do que aprendemos sobre
código limpo no mês 5.

## A camada de apresentação: fina por design

Retomando a aula 2, a camada de apresentação deveria ser **fina** — apenas traduzir a entrada do
usuário em chamadas para a camada de negócio, e mostrar o resultado de volta, sem conter regras
próprias:

```python
# cli.py — camada de apresentação
import sys
from repositorio import RepositorioDeHabitos
from servico import ServicoDeHabitos

def main():
    repositorio = RepositorioDeHabitos()
    servico = ServicoDeHabitos(repositorio)

    comando = sys.argv[1] if len(sys.argv) > 1 else None

    if comando == "adicionar":
        nome = sys.argv[2]
        servico.registrar_habito(nome)
        print(f"Hábito '{nome}' adicionado.")

    elif comando == "concluir":
        nome = sys.argv[2]
        servico.concluir_hoje(nome)
        streak = servico.calcular_streak(nome)
        print(f"'{nome}' concluído hoje! Streak atual: {streak} dias.")

    elif comando == "streak":
        nome = sys.argv[2]
        streak = servico.calcular_streak(nome)
        print(f"Streak atual de '{nome}': {streak} dias.")

    else:
        print("Comandos disponíveis: adicionar, concluir, streak")

if __name__ == "__main__":
    main()
```

Repare que `cli.py` nunca calcula um streak nem decide se um hábito existe — ele só chama métodos já
prontos de `ServicoDeHabitos` e formata a saída para o terminal. Se, no futuro, você quisesse trocar
essa interface de linha de comando por uma API web (retomando o mês 4), apenas este arquivo
precisaria mudar — `repositorio.py` e `servico.py` continuariam intactos, exatamente o benefício do
baixo acoplamento discutido no mês 5.

## Completando as funcionalidades restantes do escopo

Voltando ao mini-documento de escopo da aula 1, é hora de conferir: todas as funcionalidades
essenciais listadas já estão implementadas? Para o exemplo do rastreador de hábitos, faltava "ver o
histórico de um hábito nos últimos 30 dias":

```python
# Em ServicoDeHabitos
from datetime import date, timedelta

def obter_historico_30_dias(self, nome):
    marcacoes = set(self._repositorio.obter_marcacoes(nome))
    historico = []
    for i in range(30):
        dia = date.today() - timedelta(days=i)
        historico.append((dia.isoformat(), dia.isoformat() in marcacoes))
    return list(reversed(historico))
```

Esse é um bom momento para revisitar o documento de escopo linha por linha, como uma checklist —
resistindo à tentação de adicionar algo que não estava na lista original de "Funcionalidades
essenciais" (retomando a discussão sobre scope creep da aula 1).

## Refatorando com os olhos do mês 5

Com as funcionalidades essenciais implementadas, é hora de reler o código com espírito crítico,
aplicando os princípios de código limpo. Um trecho comum de se encontrar em um primeiro rascunho:

```python
# Antes: função fazendo demais, com nome genérico e número mágico
def processar(nome, a):
    if a == "c":
        servico.concluir_hoje(nome)
        s = servico.calcular_streak(nome)
        if s >= 7:
            print(f"Uma semana completa! Streak: {s}")
        else:
            print(f"Streak atual: {s}")
```

Aplicando responsabilidade única e nomes claros (mês 5, aula 3):

```python
# Depois: nomes claros, constante nomeada, responsabilidade única
DIAS_PARA_MARCO_SEMANAL = 7

def concluir_habito_hoje(nome):
    servico.concluir_hoje(nome)
    exibir_streak_atual(nome)

def exibir_streak_atual(nome):
    streak = servico.calcular_streak(nome)
    if streak >= DIAS_PARA_MARCO_SEMANAL:
        print(f"Uma semana completa! Streak: {streak}")
    else:
        print(f"Streak atual: {streak}")
```

A versão refatorada separa "concluir o hábito" de "exibir o streak" (responsabilidade única), nomeia
o número mágico `7` como `DIAS_PARA_MARCO_SEMANAL` (deixando claro seu significado), e troca `a == "c"`
e `processar` por nomes que contam a própria história do que a função faz — exatamente os mesmos
princípios praticados nos exercícios do mês 5.

## Exercício 1: Refatore uma função do seu projeto

Escolha uma função já escrita no seu próprio projeto (ou, se ainda não tiver uma, use o exemplo
`processar` da aula) e aplique pelo menos duas melhorias de código limpo: um nome mais claro para a
função ou variáveis, e a separação de uma responsabilidade que estava misturada com outra.

### Solução

Não existe uma única resposta correta aqui — o objetivo é praticar a leitura crítica do próprio
código. Um bom critério para avaliar se a refatoração foi bem-sucedida: leia a função refatorada em
voz alta, de cima a baixo, sem olhar para o código antigo. Ela conta uma história clara do que
acontece, sem exigir que você "rode o código na cabeça" para entender? Se a resposta for sim,
provavelmente a refatoração atingiu seu objetivo. Um sinal de que ainda há trabalho a fazer: se você
precisar de um comentário para explicar o que uma função faz, geralmente é sinal de que um nome mais
claro (de função ou variável) resolveria o problema de forma mais duradoura do que o comentário.

## Exercício 2: Avalie o acoplamento da interface

Suponha que, no futuro, você queira adicionar uma segunda forma de interagir com o rastreador de
hábitos: uma interface web simples, além da linha de comando já existente. Considerando a arquitetura
construída nesta e na aula anterior (`cli.py` dependendo de `ServicoDeHabitos`, que depende de
`RepositorioDeHabitos`), quais arquivos precisariam mudar para suportar essa nova interface, e quais
permaneceriam intactos?

### Solução

Apenas uma **nova camada de apresentação** precisaria ser criada (por exemplo, `web.py`, usando algum
framework web), reaproveitando exatamente as mesmas classes `ServicoDeHabitos` e
`RepositorioDeHabitos` já existentes, sem nenhuma modificação nelas. Isso é possível porque a camada
de apresentação (`cli.py`) foi mantida "fina" desde o início — toda a lógica real (calcular streak,
validar hábitos, persistir dados) vive nas camadas de negócio e dados, que não sabem nem se importam
com qual interface está chamando-as. Esse é o benefício concreto do baixo acoplamento: adicionar uma
nova forma de interação com o sistema exige apenas **adicionar** código novo, não modificar o código
já existente e testado.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Construindo o projeto (parte 2)" do meu curso de programação. Contexto: a aula
> explica como implementar uma camada de apresentação fina (sem regras de negócio), completar as
> funcionalidades restantes do escopo, e refatorar o código aplicando princípios de código limpo
> (nomes claros, responsabilidade única, eliminação de números mágicos). Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].

## Quiz

### 1. Por que a camada de apresentação deveria ser "fina", sem conter regras de negócio?

- [ ] Porque interfaces de linha de comando não suportam lógica complexa
- [x] Para que ela apenas traduza entrada/saída do usuário, mantendo as regras de negócio isoladas e reutilizáveis em outras interfaces futuras
- [ ] Porque o Python exige que toda lógica fique em um único arquivo
- [ ] Não há razão real para isso, é apenas uma preferência estética

> Manter a apresentação fina garante que a lógica de negócio permaneça reutilizável e independente da
> forma específica de interação (linha de comando, web, etc.), facilitando trocar ou adicionar
> interfaces no futuro.

### 2. Ao revisar o escopo definido na aula 1 durante a implementação, qual é o risco de adicionar funcionalidades que não estavam na lista original?

- [ ] Não há risco, mais funcionalidades sempre tornam o projeto melhor
- [x] O risco de scope creep, dificultando ou impedindo que o projeto seja considerado terminado
- [ ] O projeto para de compilar
- [ ] O Git rejeita commits com funcionalidades não planejadas

> Adicionar funcionalidades fora do escopo original reintroduz o risco de scope creep discutido na
> aula 1, comprometendo a chance de terminar o projeto dentro do prazo planejado.

### 3. No exemplo de refatoração da aula, por que nomear a constante `DIAS_PARA_MARCO_SEMANAL = 7` é uma melhoria em relação a deixar o número `7` solto no código?

- [ ] Porque constantes tornam o programa mais rápido
- [x] Porque o nome explica o significado do valor, eliminando a ambiguidade de um número mágico solto no código
- [ ] Porque o Python não permite comparar variáveis com números literais
- [ ] Porque isso reduz o tamanho do arquivo compilado

> Nomear a constante torna explícito o que aquele valor representa (o número de dias para completar
> uma semana), eliminando a necessidade de adivinhar o significado de um número solto no meio da
> lógica.

### 4. Qual é a vantagem prática, discutida no exercício 2, de manter a camada de apresentação separada da lógica de negócio?

- [ ] Torna o programa compatível com mais sistemas operacionais
- [x] Permite adicionar uma nova interface (como uma versão web) sem precisar modificar as camadas de negócio e dados já existentes
- [ ] Elimina a necessidade de testes automatizados
- [ ] Reduz o número de arquivos do projeto

> Como a lógica de negócio não depende de detalhes da interface, uma nova forma de interação pode ser
> adicionada isoladamente, reaproveitando as camadas de negócio e dados sem modificá-las.

### 5. Qual é um bom critério para avaliar se uma refatoração de código limpo foi bem-sucedida?

- [ ] O número de linhas do arquivo diminuiu
- [x] A função refatorada pode ser lida e entendida sem precisar "rodar o código na cabeça" ou depender de comentários explicativos
- [ ] O código passou a rodar mais rápido
- [ ] O número de funções no arquivo aumentou

> Código limpo é, fundamentalmente, código fácil de entender ao ser lido — se uma função ainda exige
> um comentário para explicar o que faz, geralmente um nome mais claro resolveria o problema de forma
> mais duradoura.
