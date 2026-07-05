---
id: "m6-a5"
mes: 6
numero: 5
titulo: "Testando e documentando"
objetivo: "Adicionar testes automatizados e documentação ao projeto final."
duracao: 25
status: "completo"
---

## Um projeto não está pronto sem os dois últimos passos

Com a implementação completa (aulas 3 e 4), falta um passo essencial antes de considerar o projeto
verdadeiramente terminado: **testes automatizados** que validem o comportamento do código (retomando
o mês 5, aula 2), e uma **documentação** clara o suficiente para que outra pessoa (ou você mesmo,
daqui a seis meses) entenda o que o projeto faz e como rodá-lo sem precisar ler cada linha de código.

## Priorizando o que testar: as partes críticas primeiro

Não é necessário (nem realista, dado o tempo disponível) testar **cada** linha do projeto. A
prioridade deveria ser as **regras de negócio** — a lógica que, se estiver errada, produz um resultado
silenciosamente incorreto, sem travar o programa. Retomando a pirâmide de testes do mês 5, a camada de
negócio é o alvo ideal de testes unitários: rápida de testar, isolada, e é onde os bugs mais sutis
(e mais custosos) costumam se esconder.

```python
# test_servico.py
from repositorio import RepositorioDeHabitos
from servico import ServicoDeHabitos

def test_streak_conta_dias_consecutivos_ate_hoje():
    repositorio = RepositorioDeHabitos(caminho_arquivo="teste_temp.json")
    servico = ServicoDeHabitos(repositorio)
    servico.registrar_habito("ler")

    servico.concluir_hoje("ler")

    assert servico.calcular_streak("ler") == 1

def test_habito_sem_marcacoes_tem_streak_zero():
    repositorio = RepositorioDeHabitos(caminho_arquivo="teste_temp.json")
    servico = ServicoDeHabitos(repositorio)
    servico.registrar_habito("meditar")

    assert servico.calcular_streak("meditar") == 0
```

O segundo teste é particularmente valioso: ele cobre um **caso de borda** (um hábito recém-criado,
sem nenhuma marcação ainda) — o tipo de cenário que é fácil esquecer de considerar manualmente, mas
que um teste automatizado nunca deixa passar despercebido depois da primeira vez que é escrito.

## Testando casos de borda, não só o caminho feliz

O "caminho feliz" (tudo funcionando como esperado, com dados bem-comportados) é importante, mas os
bugs mais frequentes em produção normalmente vêm de **casos de borda** não considerados: entradas
vazias, valores no limite, ou sequências incomuns de ações. Para o cálculo de streak, alguns casos de
borda relevantes:

- Um hábito que foi concluído **ontem**, mas não hoje — o streak deveria continuar contando a partir
  de ontem, ou zerar?
- Um hábito concluído em dias **não consecutivos** (por exemplo, segunda e quarta, pulando terça) — o
  streak deveria contar apenas os dias consecutivos mais recentes.
- Tentar concluir um hábito que **não existe** no repositório.

Pensar explicitamente nesses casos, e escrever um teste para cada um, é o que separa um projeto
testado "por cima" (só o caminho óbvio) de um projeto genuinamente confiável.

## Escrevendo um README completo

Um **README** é, tipicamente, a primeira (e às vezes única) coisa que alguém lê antes de decidir se
vale a pena explorar seu projeto — seja um recrutador avaliando seu portfólio, seja outro
desenvolvedor decidindo se usa sua ferramenta. Um bom README de projeto pessoal costuma ter estas
seções:

```markdown
# Rastreador de Hábitos

Uma ferramenta de linha de comando para acompanhar hábitos diários e visualizar streaks de
consistência.

## Funcionalidades

- Cadastrar hábitos
- Marcar um hábito como concluído no dia atual
- Consultar o streak atual (dias consecutivos) de um hábito
- Ver o histórico dos últimos 30 dias de um hábito

## Como rodar

\`\`\`bash
git clone <url-do-repositorio>
cd rastreador-habitos
python cli.py adicionar "ler 10 paginas"
python cli.py concluir "ler 10 paginas"
python cli.py streak "ler 10 paginas"
\`\`\`

## Arquitetura

O projeto segue uma arquitetura em três camadas:
- `repositorio.py`: persistência dos dados em um arquivo JSON
- `servico.py`: regras de negócio (cálculo de streak, validações)
- `cli.py`: interface de linha de comando

## Rodando os testes

\`\`\`bash
python -m pytest test_servico.py
\`\`\`
```

Note que a seção "Como rodar" contém comandos **copiáveis e executáveis**, não uma descrição em
prosa de "instale as dependências e rode o programa" — alguém lendo o README deveria conseguir copiar
e colar os comandos e ver o projeto funcionando, sem precisar adivinhar nenhum passo intermediário.

## Exercício 1: Escreva um teste de caso de borda

Considerando o `ServicoDeHabitos` construído nas aulas anteriores, escreva um teste que verifique o
comportamento ao chamar `calcular_streak` para um nome de hábito que **nunca foi registrado** no
sistema (não existe nem no repositório). Que comportamento você esperaria, e o teste confirma isso?

### Solução

```python
def test_streak_de_habito_inexistente_e_zero():
    repositorio = RepositorioDeHabitos(caminho_arquivo="teste_temp.json")
    servico = ServicoDeHabitos(repositorio)

    assert servico.calcular_streak("habito-que-nao-existe") == 0
```

Esse teste confirma que, mesmo para um hábito nunca registrado, `calcular_streak` devolve `0` de
forma previsível, em vez de lançar um erro inesperado. Isso funciona porque
`self._repositorio.obter_marcacoes(nome)` (implementado na aula 3) usa `.get(nome, {})`, devolvendo
um dicionário vazio para nomes desconhecidos, em vez de lançar uma exceção — um comportamento
defensivo que vale a pena confirmar explicitamente com um teste, já que é fácil quebrá-lo
acidentalmente em uma refatoração futura sem perceber.

## Exercício 2: Escreva a seção "Como rodar" do seu README

Para o seu próprio projeto final (ou usando o exemplo do rastreador de hábitos, caso ainda não tenha
o seu), escreva a seção "Como rodar" de um README, com comandos concretos e copiáveis, desde clonar o
repositório até executar uma funcionalidade específica.

### Solução

Não existe uma única resposta correta — o critério de qualidade é que os comandos sejam **completos
e executáveis do zero**. Um bom teste para validar sua própria seção "Como rodar": peça para alguém
(ou finja ser alguém) que nunca viu o projeto antes seguir exatamente os comandos escritos, sem
nenhuma etapa "óbvia" pulada mentalmente por você (como instalar uma dependência específica, ou criar
uma pasta antes de rodar um comando). Se qualquer passo exigir conhecimento que só você tem por ter
escrito o código, esse passo está faltando no README.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Testando e documentando" do meu curso de programação. Contexto: a aula explica como
> priorizar testes das regras de negócio, testar casos de borda além do caminho feliz, e escrever um
> README completo (funcionalidades, como rodar, arquitetura, como testar). Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].

## Quiz

### 1. Por que a camada de negócio costuma ser a prioridade ao decidir o que testar em um projeto?

- [ ] Porque é a camada mais fácil de testar tecnicamente
- [x] Porque é onde vivem as regras que, se erradas, produzem resultados silenciosamente incorretos, sem travar o programa
- [ ] Porque a camada de apresentação não pode ser testada
- [ ] Porque a camada de dados nunca contém bugs

> Erros na lógica de negócio costumam ser mais sutis e custosos — o programa continua rodando, mas
> produz resultados incorretos — o que torna essa camada prioritária para testes automatizados.

### 2. O que é um "caso de borda", no contexto de testes automatizados?

- [ ] Um erro de sintaxe no código
- [x] Um cenário incomum ou extremo (entrada vazia, valor no limite, sequência atípica de ações) que é fácil de esquecer ao testar apenas o caminho esperado
- [ ] Um teste que sempre falha
- [ ] Um tipo de teste exclusivo de bancos de dados

> Casos de borda são cenários fora do "caminho feliz" mais óbvio — como um hábito sem nenhuma
> marcação ainda — que costumam concentrar os bugs mais frequentes se não forem testados
> explicitamente.

### 3. Por que testar apenas o "caminho feliz" de uma funcionalidade não é suficiente?

- [ ] Porque o caminho feliz nunca contém bugs, tornando o teste desnecessário
- [x] Porque bugs em produção costumam vir justamente de casos de borda não considerados, que o caminho feliz não cobre
- [ ] Porque o caminho feliz é mais difícil de testar do que casos de borda
- [ ] Não há diferença entre testar o caminho feliz e testar casos de borda

> Cenários incomuns (entradas vazias, valores extremos, sequências atípicas) são frequentemente a
> origem de bugs reais, mesmo quando o comportamento esperado do uso comum já está bem testado.

### 4. O que a seção "Como rodar" de um bom README deveria conter?

- [ ] Uma explicação teórica de cada função do código
- [x] Comandos concretos e copiáveis, permitindo que alguém execute o projeto do zero sem etapas implícitas
- [ ] O histórico completo de commits do projeto
- [ ] Uma lista de bugs conhecidos

> Um README eficaz permite que alguém sem conhecimento prévio do projeto consiga rodá-lo apenas
> seguindo os comandos descritos, sem precisar adivinhar passos intermediários.

### 5. Por que é importante testar o comportamento de uma função para uma entrada que nunca foi registrada no sistema (como um hábito inexistente)?

- [ ] Porque isso nunca acontece na prática, mas é exigido por convenção
- [x] Porque confirma explicitamente que o comportamento defensivo (como devolver um valor padrão) continua funcionando, mesmo após futuras refatorações
- [ ] Porque aumenta a velocidade de execução do programa
- [ ] Porque é a única forma de testar a camada de apresentação

> Testar esse caso garante que o comportamento esperado para entradas desconhecidas seja preservado
> intencionalmente, evitando que uma refatoração futura quebre esse comportamento sem que ninguém
> perceba.
