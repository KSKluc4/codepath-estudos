---
numero: 17
titulo: "Virtual envs e pip"
nivel: "avancado"
objetivo: "Isolar dependências de projetos com venv e gerenciar pacotes com pip."
duracao: 12
status: "completo"
---

## Conceito

Um ambiente virtual (`venv`) é uma instalação isolada do Python, própria de um projeto, separada do
Python "global" do sistema. Isso evita que projetos diferentes entrem em conflito por precisarem de
versões diferentes da mesma biblioteca. `pip` é o gerenciador de pacotes que instala bibliotecas
dentro desse ambiente (ou globalmente, se você não estiver usando um venv).

## Sintaxe

```bash
# Criar um ambiente virtual (cria uma pasta .venv com uma cópia isolada do Python)
python -m venv .venv

# Ativar o ambiente (o comando muda o terminal fica marcado com o nome do venv)
source .venv/bin/activate      # Linux/macOS
.venv\Scripts\activate         # Windows

# Instalar um pacote dentro do ambiente ativo
pip install requests

# Desativar o ambiente
deactivate
```

## Exemplos comentados

```bash
# Listar os pacotes instalados no ambiente atual
pip list

# Ver detalhes de um pacote específico
pip show requests

# Salvar todas as dependências do projeto em um arquivo (para outras pessoas reproduzirem)
pip freeze > requirements.txt

# Instalar todas as dependências listadas em requirements.txt
pip install -r requirements.txt

# Instalar uma versão específica de um pacote
pip install requests==2.31.0

# Atualizar um pacote já instalado
pip install --upgrade requests

# Desinstalar um pacote
pip uninstall requests
```

```text
# Um requirements.txt típico:
requests==2.31.0
flask==3.0.0
pytest==7.4.0
```

O fluxo comum ao começar em um projeto Python já existente é: clonar o repositório, criar um
ambiente virtual, ativá-lo e rodar `pip install -r requirements.txt` para instalar exatamente as
mesmas versões de dependências que o resto da equipe está usando.

## Exercício 1: Monte o fluxo de setup de um projeto novo

Escreva, em ordem, os comandos de terminal (Linux/macOS) necessários para: criar um ambiente
virtual chamado `.venv`, ativá-lo, e instalar as bibliotecas `flask` e `requests`.

### Solução

```bash
python -m venv .venv
source .venv/bin/activate
pip install flask requests
```

`pip install` aceita múltiplos pacotes na mesma chamada, separados por espaço. É importante criar
e ativar o ambiente virtual **antes** de instalar qualquer pacote, para garantir que ele fique
isolado do Python global do sistema.

## Exercício 2: Congele e reproduza dependências

Você acabou de instalar todas as bibliotecas que seu projeto precisa dentro de um ambiente
virtual ativo. Escreva o comando para gerar um `requirements.txt`, e o comando que outra pessoa
usaria, em uma máquina diferente, para instalar exatamente as mesmas dependências.

### Solução

```bash
# Na sua máquina, com o ambiente ativo e os pacotes já instalados:
pip freeze > requirements.txt

# Na máquina de outra pessoa, depois de clonar o projeto e criar/ativar o próprio venv:
pip install -r requirements.txt
```

`pip freeze` lista todos os pacotes instalados no ambiente atual, já com as versões exatas
(`nome==versao`), e `>` redireciona essa saída para um arquivo. `pip install -r arquivo.txt`
instala cada linha do arquivo como se fosse um comando `pip install` separado.

## Quiz

### 1. Qual é o principal motivo de usar um ambiente virtual (venv) por projeto?

- [ ] Deixar o código mais rápido
- [x] Isolar as dependências de cada projeto, evitando conflitos de versão entre eles
- [ ] É a única forma de instalar pacotes com pip
- [ ] Reduzir o tamanho do código-fonte

> Sem um ambiente virtual, todos os pacotes instalados com `pip` vão para o Python global do
> sistema. Se dois projetos precisarem de versões diferentes da mesma biblioteca, um vai quebrar o
> outro. Um venv por projeto resolve isso isolando completamente as dependências.

### 2. Para que serve o arquivo `requirements.txt`?

- [ ] É gerado automaticamente pelo Python, sem necessidade de comando
- [x] Lista as dependências do projeto (e suas versões), para serem reproduzidas em outra máquina
- [ ] Contém o código-fonte compilado do projeto
- [ ] Só é usado em projetos web

> `requirements.txt` é a forma padrão de documentar quais pacotes (e em quais versões) um projeto
> Python precisa. Qualquer pessoa pode reproduzir o ambiente exato rodando `pip install -r
> requirements.txt` depois de criar seu próprio venv.

### 3. O que o comando `pip freeze` faz?

- [ ] Impede que novos pacotes sejam instalados
- [x] Lista todos os pacotes instalados no ambiente atual, com suas versões exatas
- [ ] "Congela" (trava) a versão do Python em uso
- [ ] Remove todos os pacotes instalados

> `pip freeze` imprime cada pacote instalado no formato `nome==versao`. É comum redirecionar essa
> saída para um arquivo (`pip freeze > requirements.txt`) para documentar as dependências do
> projeto.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Virtual envs e pip" na trilha de Python do CodePath. Contexto: o capítulo
> explica como criar e ativar um ambiente virtual com venv, e como instalar/gerenciar pacotes com
> pip e requirements.txt. Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
