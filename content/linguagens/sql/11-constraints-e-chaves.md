---
numero: 11
titulo: "Constraints e chaves"
nivel: "avancado"
objetivo: "Garantir integridade de dados com chaves primárias, estrangeiras e constraints."
duracao: 12
status: "completo"
---

## Conceito

Constraints (restrições) são regras que o banco de dados aplica automaticamente para impedir dados
inválidos ou inconsistentes — muito mais confiável do que validar tudo apenas na aplicação, já que
protegem os dados independentemente de qual sistema está escrevendo neles. As duas mais
fundamentais são a **chave primária** (identifica cada linha de forma única) e a **chave
estrangeira** (garante que uma referência a outra tabela seja válida).

## Sintaxe

```sql
CREATE TABLE funcionarios (
    id INTEGER PRIMARY KEY,
    departamento_id INTEGER,
    salario DECIMAL(10, 2) CHECK (salario >= 0),
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);
```

## Exemplos comentados

```sql
-- PRIMARY KEY: identifica cada linha de forma única. Implica NOT NULL + UNIQUE automaticamente
CREATE TABLE departamentos (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

-- FOREIGN KEY: garante que o valor da coluna existe como chave primária na tabela referenciada
CREATE TABLE funcionarios (
    id INTEGER PRIMARY KEY,
    departamento_id INTEGER,
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);
-- INSERT INTO funcionarios (id, departamento_id) VALUES (1, 999);
-- ERRO: departamento_id=999 não existe em departamentos — a foreign key impede dados órfãos

-- UNIQUE: impede valores duplicados na coluna (diferente de PRIMARY KEY, permite NULL)
CREATE TABLE funcionarios (
    id INTEGER PRIMARY KEY,
    email VARCHAR(100) UNIQUE
);

-- CHECK: valida uma condição customizada em cada linha
CREATE TABLE funcionarios (
    id INTEGER PRIMARY KEY,
    salario DECIMAL(10, 2) CHECK (salario >= 0),
    idade INTEGER CHECK (idade BETWEEN 16 AND 120)
);

-- NOT NULL: já visto, impede valores ausentes
CREATE TABLE produtos (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- Chave primária composta: quando a unicidade depende de MAIS de uma coluna junta
CREATE TABLE matriculas (
    aluno_id INTEGER,
    curso_id INTEGER,
    data_matricula DATE,
    PRIMARY KEY (aluno_id, curso_id) -- a combinação precisa ser única, não cada coluna sozinha
);

-- ON DELETE: define o que acontece com linhas filhas quando a linha pai é apagada
CREATE TABLE funcionarios (
    id INTEGER PRIMARY KEY,
    departamento_id INTEGER,
    FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
        ON DELETE SET NULL  -- se o departamento for apagado, departamento_id vira NULL
    -- outras opções: ON DELETE CASCADE (apaga os funcionários também) ou ON DELETE RESTRICT (impede apagar o departamento se houver funcionários)
);
```

## Exercício 1: Adicione uma constraint UNIQUE

Escreva um `CREATE TABLE` para `usuarios` com `id` (chave primária) e `email` (texto, obrigatório
e único).

### Solução

```sql
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE
);
```

Combinar `NOT NULL` e `UNIQUE` na mesma coluna garante que todo usuário tenha um e-mail
preenchido, e que nenhum e-mail se repita entre usuários diferentes — o banco rejeita
automaticamente qualquer `INSERT` que viole essas regras, sem depender de validação na aplicação.

## Exercício 2: Valide um intervalo com CHECK

Escreva um `CREATE TABLE` para `produtos` onde a coluna `desconto_percentual` só aceita valores
entre `0` e `100` (inclusive), usando `CHECK`.

### Solução

```sql
CREATE TABLE produtos (
    id INTEGER PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    desconto_percentual INTEGER CHECK (desconto_percentual BETWEEN 0 AND 100)
);
```

`CHECK (desconto_percentual BETWEEN 0 AND 100)` rejeita qualquer `INSERT` ou `UPDATE` que tente
gravar um valor fora dessa faixa (como `-10` ou `150`) — a validação acontece no próprio banco,
protegendo a integridade dos dados mesmo se algum código da aplicação esquecer de validar antes de
enviar o comando.

## Quiz

### 1. O que uma `FOREIGN KEY` impede?

- [ ] Que a tabela tenha mais de uma coluna
- [x] Que uma coluna referencie um valor que não existe como chave primária na tabela referenciada
- [ ] Que a tabela seja apagada
- [ ] Que valores numéricos sejam negativos

> Uma chave estrangeira garante integridade referencial: o valor de `departamento_id` em
> `funcionarios`, por exemplo, só pode ser `NULL` ou um `id` que realmente exista na tabela
> `departamentos` — impedindo "referências órfãs" para dados inexistentes.

### 2. Qual a diferença entre `PRIMARY KEY` e `UNIQUE`?

- [ ] Não há diferença, são sinônimos
- [x] Uma tabela só pode ter UMA `PRIMARY KEY` (que também proíbe NULL); pode ter VÁRIAS colunas `UNIQUE` (que permitem NULL)
- [ ] `UNIQUE` só funciona com números
- [ ] `PRIMARY KEY` permite valores duplicados

> `PRIMARY KEY` combina unicidade com `NOT NULL` implícito, e identifica a linha de forma
> definitiva — só pode haver uma por tabela (embora possa envolver múltiplas colunas, como uma
> chave composta). `UNIQUE` também impede duplicatas, mas permite `NULL` (geralmente mais de uma
> vez, dependendo do banco) e uma tabela pode ter várias colunas `UNIQUE` diferentes.

### 3. O que `CHECK (salario >= 0)` faz?

- [ ] Ordena a tabela por salário
- [x] Rejeita qualquer INSERT ou UPDATE que tente gravar um salário negativo
- [ ] Calcula automaticamente o salário médio
- [ ] Remove salários negativos já existentes na tabela

> `CHECK` define uma condição booleana que toda linha precisa satisfazer. Qualquer tentativa de
> inserir ou atualizar uma linha que viole essa condição (como um salário negativo) é rejeitada
> pelo banco com um erro, antes mesmo de a linha ser gravada.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Constraints e chaves" na trilha de SQL do CodePath. Contexto: o capítulo explica
> PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK e as opções de ON DELETE. Minha dúvida/meu exercício:
> [descreva aqui exatamente onde travou].
