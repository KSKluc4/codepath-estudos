---
id: "m5-a2"
mes: 5
numero: 2
titulo: "Testes automatizados"
objetivo: "Entender por que e como escrever testes automatizados para validar código continuamente."
duracao: 30
status: "completo"
---

## Como saber se o código funciona?

Até agora neste curso, provavelmente você testou seu código "na mão": rodando o programa, olhando a
saída, e conferindo se parece certo. Isso funciona para programas pequenos, mas não escala: em um
sistema com milhares de linhas, testar manualmente **toda vez** que algo muda é lento, cansativo, e
fácil de esquecer um caso importante. Pior ainda: nada impede que uma mudança em uma parte do código
quebre silenciosamente outra parte distante, sem que ninguém perceba até o problema aparecer em
produção. **Testes automatizados** resolvem exatamente isso: são pedaços de código que verificam,
automaticamente, se outro pedaço de código se comporta como esperado.

## Anatomia de um teste

Um teste automatizado normalmente segue uma estrutura de três partes, às vezes chamada de
**Arrange-Act-Assert** (organizar, agir, verificar):

```python
def somar(a, b):
    return a + b

def test_somar_dois_numeros_positivos():
    # Arrange: prepara os dados de entrada
    a, b = 2, 3

    # Act: executa a função sendo testada
    resultado = somar(a, b)

    # Assert: verifica se o resultado é o esperado
    assert resultado == 5
```

Um **assert** (afirmação) é a verificação central de um teste: uma expressão que deve ser verdadeira
se o código está correto. Se `resultado == 5` for falso, o teste **falha**, sinalizando imediatamente
que algo está errado — sem precisar de nenhuma inspeção manual.

## A pirâmide de testes

Nem todo teste verifica a mesma coisa, no mesmo nível de detalhe. Uma forma comum de organizar essa
ideia é a **pirâmide de testes**:

```text
        /\
       /e2e\          <- poucos, lentos, testam o sistema inteiro
      /------\
     /integração\     <- alguns, testam partes do sistema conversando entre si
    /------------\
   /   unitários   \  <- muitos, rápidos, testam uma função/unidade isolada
  /------------------\
```

- **Testes unitários**: verificam uma única função ou unidade de código isoladamente, sem depender de
  banco de dados, rede ou outras partes do sistema. São rápidos (rodam em milissegundos) e é por isso
  que devem ser a maioria — o exemplo de `somar()` acima é um teste unitário.
- **Testes de integração**: verificam se **várias partes** do sistema funcionam corretamente juntas —
  por exemplo, se uma função que salva dados realmente grava corretamente em um banco de dados real
  (ou uma versão de teste dele).
- **Testes end-to-end (e2e)**: simulam o comportamento de um usuário real usando o sistema completo,
  do início ao fim — por exemplo, abrir o navegador, preencher um formulário de login, e verificar se
  a página seguinte carrega corretamente.

A pirâmide é mais estreita no topo porque testes de integração e e2e são mais **lentos** (envolvem
mais partes reais do sistema) e mais **frágeis** (podem falhar por motivos alheios ao que você está
testando, como uma rede lenta). Testes unitários, sendo rápidos e isolados, dão o retorno mais rápido
e barato sobre se o código está correto, e por isso formam a base da pirâmide.

## TDD: escrever o teste antes do código

**TDD** (*Test-Driven Development*, desenvolvimento guiado por testes) inverte a ordem natural de
escrever primeiro o código e depois (talvez) o teste. O ciclo do TDD é conhecido como
**vermelho-verde-refatorar**:

1. **Vermelho**: escreva um teste para uma funcionalidade que **ainda não existe**. Rode o teste — ele
   deve **falhar** (ficar "vermelho"), já que o código correspondente ainda não foi escrito.
2. **Verde**: escreva o **mínimo de código possível** para fazer aquele teste passar (ficar "verde") —
   sem se preocupar ainda com elegância ou generalidade.
3. **Refatorar**: agora que o teste garante que o comportamento correto existe, melhore o código
   (nomes, estrutura, duplicação) com confiança, rodando o teste de novo a cada mudança para garantir
   que nada quebrou.

A vantagem central do TDD é que o teste é escrito **antes** de qualquer viés de "eu sei que meu código
funciona porque acabei de escrevê-lo" — o teste é definido a partir do comportamento esperado, não do
código que já existe.

## Por que testes automatizados importam na prática

Além de detectar bugs, testes automatizados cumprem um papel importante quando o código **muda** ao
longo do tempo — o que é a regra, não a exceção, em qualquer projeto real:

- **Rede de segurança contra regressões**: se uma mudança em uma parte do código quebra o
  comportamento de outra parte, um teste existente falha imediatamente, ao invés de o problema ser
  descoberto (ou não) muito depois, em produção.
- **Documentação viva**: um teste bem escrito mostra exatamente como uma função deve se comportar em
  casos específicos — muitas vezes mais claro e mais confiável do que um comentário, porque o teste
  **falha** se deixar de ser verdade, enquanto um comentário desatualizado simplesmente mente
  silenciosamente.
- **Confiança para refatorar**: sem testes, mudar a estrutura interna de um código é arriscado (como
  saber se você não quebrou nada?). Com uma boa suíte de testes, você pode reorganizar o código
  livremente, rodando os testes a cada passo para confirmar que o comportamento externo continua
  correto.

## Exercício 1: Escreva um teste unitário

Considere a função abaixo, que verifica se um número é primo:

```python
def eh_primo(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return False
    return True
```

Escreva dois testes unitários para essa função: um verificando um número primo conhecido, e outro
verificando um número que não é primo.

### Solução

```python
def test_sete_e_primo():
    assert eh_primo(7) == True

def test_oito_nao_e_primo():
    assert eh_primo(8) == False
```

Cada teste segue a estrutura Arrange-Act-Assert de forma bem enxuta: o "Arrange" aqui é trivial (o
próprio número já está definido na chamada), o "Act" é a chamada `eh_primo(...)`, e o "Assert" verifica
se o resultado bate com o valor esperado. Vale notar que testar **apenas** um caso (como só `7`) não
seria suficiente — testar tanto um caso positivo quanto um negativo aumenta a confiança de que a
função realmente distingue números primos de não-primos, e não está apenas sempre retornando `True`
ou sempre `False`.

## Exercício 2: Classifique o tipo de teste

Para cada teste descrito abaixo, classifique como **unitário**, **de integração** ou **end-to-end**:

1. Um teste que chama diretamente a função `calcular_desconto(preco, percentual)` e verifica o valor
   retornado, sem tocar em banco de dados ou rede.
2. Um teste que simula um usuário abrindo o navegador, digitando um produto na busca, adicionando ao
   carrinho e finalizando a compra.
3. Um teste que chama a função `salvar_pedido(pedido)` e depois verifica, consultando um banco de
   dados de teste, se o pedido foi realmente gravado lá.

### Solução

1. **Unitário** — testa uma única função isoladamente, sem depender de nenhum sistema externo (banco
   de dados, rede), e roda rapidamente.
2. **End-to-end** — simula o fluxo completo de um usuário real interagindo com o sistema do começo ao
   fim, passando por múltiplas telas e funcionalidades integradas.
3. **De integração** — verifica se duas partes do sistema (a função `salvar_pedido` e o banco de
   dados real) funcionam corretamente **juntas**, indo além de testar a função isoladamente.

## Exercício 3: Aplique o ciclo do TDD

Você precisa implementar uma função `eh_palindromo(texto)`, que devolve `True` se o texto lido de trás
para frente for igual ao original (ignorando essa complexidade de maiúsculas/espaços por simplicidade).
Seguindo o ciclo vermelho-verde-refatorar do TDD, escreva primeiro o teste (vermelho), depois a
implementação mais simples possível que o faça passar (verde).

### Solução

**Vermelho** — primeiro, o teste, antes de qualquer implementação existir:

```python
def test_arara_e_palindromo():
    assert eh_palindromo("arara") == True

def test_casa_nao_e_palindromo():
    assert eh_palindromo("casa") == False
```

Rodar esses testes agora falharia (nem existe a função `eh_palindromo` ainda) — esse é o estado
"vermelho".

**Verde** — a implementação mais simples que faz os dois testes passarem:

```python
def eh_palindromo(texto):
    return texto == texto[::-1]
```

Rodando os testes novamente, ambos passam: `"arara"` lido ao contrário continua `"arara"`
(`True`), e `"casa"` ao contrário vira `"asac"`, diferente do original (`False`) — o estado "verde".
A partir daqui, o próximo passo do ciclo (refatorar) poderia, por exemplo, adicionar tratamento para
maiúsculas ou espaços, sempre rodando os testes existentes para garantir que nada quebrou.

## Tirou dúvida?

Se travar em algum ponto desta aula, descreva o contexto exato do que você já entendeu e onde
travou. Copie e adapte o modelo abaixo:

> Estou estudando "Testes automatizados" do meu curso de programação. Contexto: a aula explica a
> estrutura Arrange-Act-Assert de um teste, a pirâmide de testes (unitários, integração, e2e), e o
> ciclo TDD (vermelho-verde-refatorar). Minha dúvida/meu exercício: [descreva aqui exatamente onde
> travou].

## Quiz

### 1. O que a etapa "Assert" de um teste automatizado faz?

- [ ] Prepara os dados de entrada do teste
- [ ] Executa a função sendo testada
- [x] Verifica se o resultado obtido corresponde ao resultado esperado
- [ ] Registra o teste em um arquivo de log

> O assert é a verificação central: uma expressão que deve ser verdadeira se o código estiver
> correto; se for falsa, o teste falha, sinalizando um problema.

### 2. Por que testes unitários formam a base (a parte mais larga) da pirâmide de testes?

- [ ] Porque são os únicos testes que realmente importam
- [x] Porque são rápidos, isolados e baratos de rodar, sendo por isso os mais numerosos, enquanto testes de integração e e2e são mais lentos e frágeis
- [ ] Porque testes de integração e e2e não podem detectar bugs
- [ ] Porque a ordem da pirâmide não tem relação com quantidade

> Testes unitários rodam em milissegundos e não dependem de sistemas externos, permitindo que existam
> em grande quantidade; testes de integração e e2e envolvem mais partes reais do sistema, sendo mais
> lentos e propensos a falhas por motivos externos ao código testado.

### 3. Qual é a diferença entre um teste de integração e um teste unitário?

- [ ] Não há diferença, os termos são sinônimos
- [x] Um teste de integração verifica se várias partes do sistema funcionam corretamente juntas; um teste unitário verifica uma única função isolada
- [ ] Testes de integração são sempre mais rápidos que testes unitários
- [ ] Testes unitários só podem ser escritos em Python

> Testes unitários isolam uma única unidade de código; testes de integração verificam a interação real
> entre múltiplas partes do sistema, como uma função e um banco de dados.

### 4. Qual é a ordem correta do ciclo de TDD?

- [ ] Verde, vermelho, refatorar
- [x] Vermelho (teste falha), verde (código mínimo faz passar), refatorar (melhora o código com segurança)
- [ ] Refatorar, vermelho, verde
- [ ] TDD não segue uma ordem específica

> O ciclo começa escrevendo um teste que falha (vermelho, porque o código ainda não existe), depois
> escrevendo o mínimo de código para passar (verde), e só então melhorando a implementação
> (refatorar), sempre validando com os testes.

### 5. Qual é uma vantagem de ter uma boa suíte de testes automatizados ao refatorar código?

- [ ] Elimina completamente a necessidade de revisão de código
- [x] Permite reorganizar a estrutura interna do código com confiança, verificando a cada mudança que o comportamento externo continua correto
- [ ] Torna o código automaticamente mais rápido de executar
- [ ] Substitui a necessidade de controle de versão

> Testes atuam como uma rede de segurança: qualquer mudança que quebre um comportamento esperado é
> detectada imediatamente, dando confiança para reestruturar o código sem medo de introduzir
> regressões silenciosas.
