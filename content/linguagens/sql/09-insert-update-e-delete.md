---
numero: 9
titulo: "INSERT, UPDATE e DELETE"
nivel: "intermediario"
objetivo: "Modificar dados com INSERT, UPDATE e DELETE."
duracao: 12
status: "completo"
---

## Conceito

Enquanto `SELECT` só lê dados, `INSERT`, `UPDATE` e `DELETE` são os comandos DML (Data
Manipulation Language) que efetivamente alteram o conteúdo das tabelas: inserir novas linhas,
atualizar linhas existentes, e remover linhas. Todos os três podem (e geralmente devem) usar
`WHERE` para controlar exatamente quais linhas são afetadas — esquecer o `WHERE` em um `UPDATE` ou
`DELETE` afeta a tabela **inteira**.

## Sintaxe

```sql
INSERT INTO funcionarios (nome, cargo, departamento_id, salario)
VALUES ('Eva', 'Estagiária', 2, 2500);

UPDATE funcionarios SET salario = 9000 WHERE nome = 'Ana';

DELETE FROM funcionarios WHERE nome = 'Eva';
```

## Exemplos comentados

```sql
-- INSERT: adiciona uma nova linha, especificando as colunas e os valores correspondentes
INSERT INTO funcionarios (nome, cargo, departamento_id, salario)
VALUES ('Eva', 'Estagiária', 2, 2500);

-- Inserir múltiplas linhas em um único comando
INSERT INTO funcionarios (nome, cargo, departamento_id, salario) VALUES
    ('Felipe', 'Analista', 3, 5800),
    ('Gabi', 'Designer', 2, 7000);

-- Colunas omitidas recebem o valor padrão (DEFAULT) ou NULL, se permitido
INSERT INTO funcionarios (nome, salario) VALUES ('Hugo', 6500);
-- cargo e departamento_id ficam NULL (assumindo que a tabela permite)

-- UPDATE: altera linhas EXISTENTES. SEM WHERE, atualiza TODAS as linhas da tabela!
UPDATE funcionarios
SET salario = 9000
WHERE nome = 'Ana';

-- Atualizar múltiplas colunas de uma vez
UPDATE funcionarios
SET cargo = 'Desenvolvedora Sênior', salario = salario * 1.1
WHERE nome = 'Ana';
-- salario = salario * 1.1: aumenta 10% sobre o valor ATUAL

-- UPDATE com condição baseada em outra tabela (subquery)
UPDATE funcionarios
SET salario = salario * 1.05
WHERE departamento_id = (SELECT id FROM departamentos WHERE nome = 'Engenharia');

-- DELETE: remove linhas. SEM WHERE, apaga TODAS as linhas da tabela!
DELETE FROM funcionarios WHERE nome = 'Eva';

-- Sempre teste antes: rode o mesmo WHERE com um SELECT para conferir o que será afetado
SELECT * FROM funcionarios WHERE departamento_id IS NULL; -- confira antes de...
DELETE FROM funcionarios WHERE departamento_id IS NULL;    -- ...apagar de fato

-- TRUNCATE remove TODAS as linhas de uma tabela de forma mais rápida que DELETE sem WHERE
-- (mas não pode ser filtrado, e em muitos bancos não pode ser desfeito com ROLLBACK)
-- TRUNCATE TABLE log_temporario;
```

## Exercício 1: Insira um novo funcionário

Escreva um comando `INSERT` que adiciona um funcionário chamado `"Ivo"`, cargo `"Suporte"`,
`departamento_id = 3` e `salario = 5000`.

### Solução

```sql
INSERT INTO funcionarios (nome, cargo, departamento_id, salario)
VALUES ('Ivo', 'Suporte', 3, 5000);
```

A lista de colunas entre parênteses depois do nome da tabela precisa corresponder, na mesma
ordem, aos valores listados em `VALUES` — omitir a lista de colunas (`INSERT INTO tabela VALUES
(...)`) funciona, mas é mais frágil, pois depende de conhecer exatamente a ordem de todas as
colunas da tabela.

## Exercício 2: Aumente o salário de um departamento

Escreva um comando `UPDATE` que aumenta em 8% o salário de todos os funcionários do departamento
com `id = 1`.

### Solução

```sql
UPDATE funcionarios
SET salario = salario * 1.08
WHERE departamento_id = 1;
```

`salario = salario * 1.08` lê o valor atual de `salario` de cada linha afetada e o multiplica por
`1.08` (aumento de 8%), atribuindo o resultado de volta à mesma coluna — o `WHERE departamento_id
= 1` garante que só funcionários daquele departamento específico sejam alterados, deixando os
demais intactos.

## Quiz

### 1. O que acontece ao rodar `UPDATE funcionarios SET salario = 5000;` SEM nenhum `WHERE`?

- [ ] Nada acontece, o comando é rejeitado
- [x] TODAS as linhas da tabela `funcionarios` têm o salário alterado para 5000
- [ ] Apenas a primeira linha é alterada
- [ ] Apenas linhas com salário atual maior que 5000 são alteradas

> Sem `WHERE`, `UPDATE` (assim como `DELETE`) se aplica a TODAS as linhas da tabela, sem exceção —
> um dos erros mais perigosos e comuns em SQL. É sempre recomendado testar a condição `WHERE`
> primeiro com um `SELECT` antes de rodar o `UPDATE`/`DELETE` de fato.

### 2. O que acontece com uma coluna que não é mencionada em um `INSERT`?

- [ ] O comando falha automaticamente
- [x] Recebe seu valor padrão (`DEFAULT`) definido na tabela, ou `NULL` se nenhum padrão existir e a coluna permitir nulo
- [ ] Recebe automaticamente o valor `0`
- [ ] A tabela inteira é recriada

> Se uma coluna não é listada (nem tem valor em `VALUES`), o banco usa o valor `DEFAULT`
> configurado na definição da tabela para aquela coluna (assunto do próximo capítulo), ou `NULL`
> se a coluna permitir valores nulos e não tiver um padrão definido — se a coluna for `NOT NULL`
> sem `DEFAULT`, o `INSERT` falha com erro.

### 3. Por que é uma boa prática rodar um `SELECT` com a mesma condição antes de um `DELETE`?

- [ ] Não faz diferença nenhuma
- [x] Permite conferir exatamente quais linhas seriam afetadas, antes de apagá-las de forma irreversível
- [ ] É obrigatório pelo padrão SQL
- [ ] Torna o DELETE mais rápido

> `DELETE` remove linhas permanentemente (a menos que dentro de uma transação não confirmada,
> assunto de um capítulo posterior). Rodar `SELECT * FROM tabela WHERE mesma_condicao;` antes
> mostra exatamente quais linhas seriam removidas, permitindo confirmar que a condição está
> correta antes de executar o `DELETE` de fato.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "INSERT, UPDATE e DELETE" na trilha de SQL do CodePath. Contexto: o capítulo
> explica como inserir, atualizar e remover linhas, e os riscos de esquecer o WHERE. Minha
> dúvida/meu exercício: [descreva aqui exatamente onde travou].
