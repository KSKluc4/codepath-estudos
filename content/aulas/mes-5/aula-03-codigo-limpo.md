---
id: "m5-a3"
mes: 5
numero: 3
titulo: "Código limpo"
objetivo: "Aprender princípios de código limpo para escrever software legível e fácil de manter."
duracao: 25
status: "completo"
---

## Código é lido muito mais do que é escrito

Uma verdade pouco intuitiva sobre programação profissional: o tempo que você passa **escrevendo**
código pela primeira vez é uma fração pequena do tempo que alguém (incluindo você mesmo, seis meses
depois) vai passar **lendo** esse código — para entender um bug, adicionar uma funcionalidade, ou
revisar uma mudança. Código limpo é, fundamentalmente, código otimizado para ser **lido e entendido
por humanos**, não apenas executado corretamente por um computador. Um código pode estar
tecnicamente correto e ainda assim ser péssimo de se trabalhar, se for confuso, mal nomeado ou
excessivamente complicado.

## Nomes que contam a história

O nome de uma variável, função ou classe é a primeira (e às vezes única) informação que alguém lendo
o código tem sobre o que aquilo faz. Compare:

```python
# Ruim: nomes não dizem nada sobre o que representam
def calc(x, y, z):
    d = x - y
    if d < 0:
        d = 0
    return d * z

# Bom: os nomes contam a história do que está acontecendo
def calcular_valor_do_desconto(preco_original, preco_com_desconto, quantidade):
    diferenca = preco_original - preco_com_desconto
    if diferenca < 0:
        diferenca = 0
    return diferenca * quantidade
```

As duas versões fazem exatamente a mesma coisa — mas a segunda pode ser entendida **sem precisar
rodar o código na cabeça** para descobrir o que `x`, `y`, `z` e `d` representam. Um bom nome responde,
de forma direta, à pergunta "o que isso é?" ou "o que isso faz?", eliminando a necessidade de um
comentário para explicar o óbvio.

Algumas diretrizes práticas de nomenclatura:

- **Funções** costumam ser nomeadas com verbos, descrevendo uma ação: `calcular_total()`,
  `enviar_email()`, `validar_cpf()`.
- **Variáveis booleanas** ficam mais claras com prefixos como `eh_`, `tem_`, `pode_`:
  `eh_valido`, `tem_permissao`, `pode_editar`.
- Evite abreviações obscuras (`qtd`, `vlr`, `flg`) quando o nome completo (`quantidade`, `valor`,
  `sinalizador`) não custa muito mais para digitar e economiza tempo de leitura para quem vier depois.

## Funções pequenas, com uma única responsabilidade

O **princípio da responsabilidade única** (uma das ideias centrais de código limpo) diz que uma
função deve fazer **uma coisa só**, e fazê-la bem. Uma função que valida dados, salva no banco, e
envia um e-mail de confirmação está fazendo três coisas — o que a torna mais difícil de testar, de
reutilizar, e de entender de relance.

```python
# Ruim: uma função fazendo três coisas diferentes
def processar_cadastro(dados):
    if not dados.get("email") or "@" not in dados["email"]:
        raise ValueError("Email inválido")
    banco.salvar(dados)
    email.enviar(dados["email"], "Bem-vindo!")

# Bom: cada função tem uma única responsabilidade
def validar_email(email):
    if not email or "@" not in email:
        raise ValueError("Email inválido")

def salvar_usuario(dados):
    banco.salvar(dados)

def enviar_email_boas_vindas(email):
    email_service.enviar(email, "Bem-vindo!")

def processar_cadastro(dados):
    validar_email(dados.get("email"))
    salvar_usuario(dados)
    enviar_email_boas_vindas(dados["email"])
```

Na versão "boa", `processar_cadastro` ainda coordena as três etapas, mas cada etapa em si vive em sua
própria função, nomeada de forma que a leitura de `processar_cadastro` já conta a história do fluxo
inteiro, sem precisar mergulhar nos detalhes de cada etapa. Além disso, cada função pequena pode ser
**testada isoladamente** (retomando a aula 2) — testar `validar_email` sozinha é muito mais simples
do que testar o comportamento inteiro de `processar_cadastro` de uma vez.

## Code smells: sinais de alerta

**Code smell** (literalmente, "cheiro de código") é um termo para padrões que, embora não sejam
tecnicamente bugs, costumam indicar um problema mais profundo de design. Alguns dos mais comuns:

| Code smell | O que é | Por que é um problema |
|------------|---------|-------------------------|
| **Duplicação** | O mesmo trecho de lógica repetido em vários lugares | Corrigir um bug exige lembrar de mudar em todos os lugares — fácil esquecer um |
| **Função longa** | Uma função com dezenas ou centenas de linhas | Difícil de entender de relance, difícil de testar, geralmente faz várias coisas ao mesmo tempo |
| **Números mágicos** | Um valor numérico solto no meio do código, sem explicação (`if idade > 18`) | Não fica claro o que `18` representa nem por que esse valor específico foi escolhido |
| **Aninhamento excessivo** | Vários `if`s ou `for`s aninhados, formando uma "pirâmide" | Cada nível de aninhamento exige mais esforço mental para acompanhar o fluxo |

Um exemplo de **número mágico** e como resolver nomeando a constante:

```python
# Ruim: o que "18" e "65" representam? Por que esses valores?
if 18 <= idade < 65:
    aplicar_taxa_padrao()

# Bom: os nomes explicam o significado dos números
IDADE_MINIMA_ADULTO = 18
IDADE_APOSENTADORIA = 65

if IDADE_MINIMA_ADULTO <= idade < IDADE_APOSENTADORIA:
    aplicar_taxa_padrao()
```

## DRY: Don't Repeat Yourself

O princípio **DRY** (*Don't Repeat Yourself*, não se repita) formaliza a ideia de que duplicação de
lógica é um risco: se a mesma regra de negócio está escrita em três lugares diferentes, e ela precisa
mudar, é fácil atualizar dois lugares e esquecer o terceiro — gerando um bug sutil e inconsistente. A
solução é **extrair** a lógica repetida para um único lugar (uma função, uma constante) e reutilizá-la
onde for necessária, ao invés de copiar e colar.

Vale um contraponto importante: DRY não significa eliminar **toda** semelhança entre trechos de
código a qualquer custo. Duas funções que parecem similares por coincidência, mas representam
conceitos diferentes que podem evoluir de forma independente no futuro, não deveriam ser forçadas a
compartilhar código só para "não se repetir" — isso pode criar um acoplamento artificial entre coisas
que não deveriam estar conectadas. DRY se aplica quando a duplicação representa o **mesmo
conhecimento** ou **mesma regra**, não apenas uma coincidência visual entre dois trechos de código.

## Exercício 1: Renomeie para maior clareza

O trecho abaixo calcula se um usuário pode fazer login. Reescreva-o com nomes de variáveis e função
mais claros, sem mudar o comportamento.

```python
def chk(u, p):
    r = False
    if u in db and db[u] == p:
        r = True
    return r
```

### Solução

```python
def usuario_pode_fazer_login(usuario, senha):
    usuario_valido = False
    if usuario in banco_de_usuarios and banco_de_usuarios[usuario] == senha:
        usuario_valido = True
    return usuario_valido
```

Nenhuma linha de lógica mudou — apenas os nomes. Mas agora, ao ler `usuario_pode_fazer_login(usuario,
senha)`, fica evidente o que a função faz e o que cada parâmetro representa, sem precisar decifrar
`chk`, `u`, `p` e `r`.

## Exercício 2: Identifique a violação da responsabilidade única

A função abaixo faz mais de uma coisa. Identifique quais responsabilidades diferentes estão
misturadas, e proponha como dividi-la em funções menores.

```python
def gerar_relatorio(vendas):
    total = sum(v["valor"] for v in vendas)
    texto = f"Total de vendas: R$ {total:.2f}\n"
    with open("relatorio.txt", "w") as arquivo:
        arquivo.write(texto)
    print("Relatório gerado com sucesso!")
```

### Solução

A função mistura três responsabilidades: **(1)** calcular o total de vendas, **(2)** formatar esse
total como texto de relatório, e **(3)** salvar esse texto em um arquivo (além de um efeito colateral
de imprimir uma mensagem). Separando cada uma:

```python
def calcular_total_vendas(vendas):
    return sum(v["valor"] for v in vendas)

def formatar_relatorio(total):
    return f"Total de vendas: R$ {total:.2f}\n"

def salvar_relatorio(texto, caminho="relatorio.txt"):
    with open(caminho, "w") as arquivo:
        arquivo.write(texto)

def gerar_relatorio(vendas):
    total = calcular_total_vendas(vendas)
    texto = formatar_relatorio(total)
    salvar_relatorio(texto)
    print("Relatório gerado com sucesso!")
```

Agora cada função pode ser testada isoladamente (por exemplo, testar `calcular_total_vendas` sem
precisar criar nem ler nenhum arquivo de verdade), e cada uma tem um único motivo para mudar no
futuro — se o formato do texto do relatório mudar, só `formatar_relatorio` precisa ser alterada.

## Exercício 3: Elimine a duplicação

O código abaixo calcula o frete de dois tipos de produto, repetindo a mesma regra de negócio (frete
grátis acima de R$ 200) em dois lugares. Reescreva para eliminar a duplicação, seguindo o princípio
DRY.

```python
def calcular_frete_livro(preco):
    if preco >= 200:
        return 0
    return 15

def calcular_frete_eletronico(preco):
    if preco >= 200:
        return 0
    return 15
```

### Solução

```python
FRETE_GRATIS_ACIMA_DE = 200
VALOR_FRETE_PADRAO = 15

def calcular_frete(preco):
    if preco >= FRETE_GRATIS_ACIMA_DE:
        return 0
    return VALOR_FRETE_PADRAO
```

Como as duas funções originais continham exatamente a mesma regra de negócio (mesmo valor limite,
mesmo valor de frete), elas representam o **mesmo conhecimento** duplicado — o caso ideal para
aplicar DRY. Agora, se o valor do frete grátis mudar de R$ 200 para R$ 150, por exemplo, existe
apenas **um lugar** para atualizar, eliminando o risco de atualizar uma função e esquecer da outra.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Código limpo" do meu curso de programação. Contexto: a aula explica nomenclatura
> clara, o princípio da responsabilidade única, code smells comuns (duplicação, função longa, números
> mágicos, aninhamento excessivo) e o princípio DRY. Minha dúvida/meu exercício: [descreva aqui
> exatamente onde travou].

## Quiz

### 1. Por que nomes claros de variáveis e funções são importantes em código limpo?

- [ ] Porque tornam o programa mais rápido de executar
- [x] Porque reduzem o esforço necessário para entender o que o código faz, já que código é lido muito mais do que é escrito
- [ ] Porque são exigidos pela linguagem de programação
- [ ] Porque reduzem o tamanho do arquivo compilado

> Nomes claros comunicam a intenção do código diretamente, eliminando a necessidade de decifrar o
> propósito de uma variável ou função só analisando seu uso.

### 2. O que o princípio da responsabilidade única propõe?

- [ ] Que cada arquivo do projeto deve ter exatamente uma função
- [x] Que uma função (ou classe) deve fazer uma coisa só, e fazê-la bem
- [ ] Que apenas uma pessoa do time pode editar cada função
- [ ] Que todo código deve rodar em uma única thread

> Funções com uma única responsabilidade são mais fáceis de entender, testar e reutilizar do que
> funções que misturam várias tarefas diferentes.

### 3. O que é um "número mágico", no contexto de code smells?

- [ ] Um número usado em criptografia
- [x] Um valor numérico solto no código, sem explicação do que representa ou por que foi escolhido
- [ ] Um número gerado aleatoriamente pelo programa
- [ ] O número de linhas de uma função

> Números mágicos (como um `18` solto em uma condição) dificultam entender o significado do valor;
> nomeá-los como constantes explica sua intenção.

### 4. O que o princípio DRY (Don't Repeat Yourself) recomenda?

- [ ] Nunca escrever dois trechos de código parecidos, mesmo que representem conceitos diferentes
- [x] Extrair lógica duplicada que representa o mesmo conhecimento/regra para um único lugar, evitando repetição
- [ ] Escrever o mínimo de comentários possível
- [ ] Usar sempre nomes de variáveis curtos

> DRY visa evitar que a mesma regra de negócio precise ser atualizada em múltiplos lugares — mas se
> aplica à duplicação do mesmo conhecimento, não a qualquer semelhança superficial entre trechos de
> código.

### 5. Por que uma função muito longa, fazendo várias coisas, é considerada um code smell?

- [ ] Porque funções longas sempre têm bugs
- [x] Porque é mais difícil de entender de relance, mais difícil de testar isoladamente, e geralmente mistura múltiplas responsabilidades
- [ ] Porque a linguagem de programação impõe um limite de linhas
- [ ] Porque funções longas rodam mais devagar

> Funções longas tendem a violar o princípio da responsabilidade única, tornando o código mais custoso
> de entender, testar e modificar com segurança.
