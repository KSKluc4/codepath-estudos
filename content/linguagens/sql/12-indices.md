---
numero: 12
titulo: "Índices"
nivel: "avancado"
objetivo: "Acelerar consultas com índices e entender seus custos."
duracao: 10
status: "completo"
---

## Conceito

Sem um índice, o banco precisa examinar **cada linha** da tabela para encontrar as que satisfazem
um `WHERE` (um "full table scan") — lento em tabelas grandes. Um índice é uma estrutura de dados
auxiliar (geralmente uma árvore B) que permite ao banco localizar linhas rapidamente por uma
coluna, sem examinar a tabela inteira, de forma parecida com o índice remissivo no final de um
livro. O custo: todo índice ocupa espaço extra e desacelera um pouco `INSERT`/`UPDATE`/`DELETE`,
já que o índice também precisa ser atualizado.

## Sintaxe

```sql
CREATE INDEX idx_funcionarios_departamento ON funcionarios(departamento_id);

DROP INDEX idx_funcionarios_departamento;
```

## Exemplos comentados

```sql
-- Sem índice, esta consulta faria um "full table scan": examinaria TODAS as
-- linhas de funcionarios para encontrar as do departamento 1
SELECT * FROM funcionarios WHERE departamento_id = 1;

-- Criar um índice na coluna usada frequentemente em WHERE/JOIN acelera essa busca
CREATE INDEX idx_funcionarios_departamento ON funcionarios(departamento_id);

-- PRIMARY KEY e UNIQUE já criam um índice automaticamente — não é preciso
-- criar um índice manual extra para essas colunas
CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY,     -- já indexado automaticamente
    email VARCHAR(100) UNIQUE   -- também já indexado automaticamente
);

-- Índice composto: cobre consultas que filtram por VÁRIAS colunas juntas
CREATE INDEX idx_funcionarios_dept_cargo ON funcionarios(departamento_id, cargo);
-- útil para: WHERE departamento_id = 1 AND cargo = 'Gerente'
-- (a ORDEM das colunas no índice importa para quais consultas ele realmente acelera)

-- EXPLAIN mostra o plano de execução de uma consulta — revela se um índice está
-- sendo usado ou se o banco está fazendo um full table scan (sintaxe varia por banco)
EXPLAIN SELECT * FROM funcionarios WHERE departamento_id = 1;

-- Índices ajudam WHERE, JOIN e ORDER BY, mas têm custo:
-- 1. Ocupam espaço em disco adicional
-- 2. Toda escrita (INSERT/UPDATE/DELETE) precisa atualizar também os índices, ficando mais lenta
-- Por isso, não se cria índice em TODA coluna — só nas usadas com frequência em filtros/joins

-- Remover um índice que não está sendo útil
DROP INDEX idx_funcionarios_dept_cargo;
```

## Exercício 1: Crie um índice para acelerar buscas por e-mail

Escreva um `CREATE INDEX` para acelerar consultas do tipo
`SELECT * FROM usuarios WHERE email = '...'` em uma tabela `usuarios(id, nome, email)`.

### Solução

```sql
CREATE INDEX idx_usuarios_email ON usuarios(email);
```

Sem esse índice, cada busca por e-mail exigiria examinar todas as linhas de `usuarios` até
encontrar (ou não) a correspondência. Com o índice, o banco pode localizar a linha diretamente,
de forma muito mais rápida — especialmente perceptível conforme a tabela cresce.

## Exercício 2: Identifique quando um índice NÃO ajuda

Explique por que criar um índice na coluna `ativo` (do tipo `BOOLEAN`, com apenas os valores
`true`/`false`) de uma tabela com 1 milhão de linhas geralmente traz pouco benefício.

### Solução

Um índice é mais útil quando ajuda o banco a **eliminar rapidamente a maior parte das linhas**.
Se `ativo` só tem dois valores possíveis (`true`/`false`) e, digamos, 900.000 das 1.000.000 de
linhas são `true`, uma consulta `WHERE ativo = true` ainda precisaria acessar 90% da tabela — o
índice pouco ajuda a "descartar" linhas, e o banco pode até decidir ignorá-lo, preferindo um full
table scan direto. Índices funcionam melhor em colunas com muitos valores distintos (alta
"cardinalidade"), como `email` ou `id`, onde cada valor elimina a maior parte das outras linhas.

## Quiz

### 1. Qual o principal benefício de um índice?

- [ ] Reduz o espaço em disco ocupado pela tabela
- [x] Acelera consultas que filtram, ordenam ou fazem join por aquela coluna, evitando examinar a tabela inteira
- [ ] Torna todo INSERT mais rápido
- [ ] Garante que a coluna não aceite valores nulos

> Um índice permite ao banco localizar linhas relevantes sem examinar cada linha da tabela — como
> o índice remissivo de um livro, que evita ler o livro inteiro para achar um assunto específico.

### 2. Qual o principal custo de criar muitos índices em uma tabela?

- [ ] Índices não têm custo nenhum, sempre vale criar o máximo possível
- [x] Espaço em disco adicional, e mais lentidão em operações de escrita (INSERT/UPDATE/DELETE), já que os índices também precisam ser atualizados
- [ ] Índices tornam o SELECT mais lento
- [ ] Índices impedem o uso de JOIN

> Cada índice precisa ser mantido sincronizado com a tabela: toda vez que uma linha é inserida,
> atualizada ou removida, os índices relevantes também precisam ser atualizados — por isso criar
> índices em excesso (especialmente em colunas raramente consultadas) pode prejudicar mais do que
> ajudar.

### 3. Colunas com poucos valores distintos (baixa cardinalidade), como um campo booleano, geralmente se beneficiam muito de um índice?

- [ ] Sim, sempre
- [x] Não muito — como o índice não consegue "descartar" grande parte das linhas, o ganho é limitado
- [ ] Apenas se a tabela tiver menos de 10 linhas
- [ ] Colunas booleanas não podem ser indexadas

> Índices são mais eficazes quando ajudam a eliminar rapidamente a maioria das linhas irrelevantes.
> Uma coluna com poucos valores possíveis (como `true`/`false`) frequentemente ainda exige
> examinar uma fração grande da tabela mesmo usando o índice, tornando o ganho de performance
> pouco significativo comparado a colunas com muitos valores distintos.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Índices" na trilha de SQL do CodePath. Contexto: o capítulo explica CREATE
> INDEX, índices automáticos de PRIMARY KEY/UNIQUE, índices compostos e os custos de indexação.
> Minha dúvida/meu exercício: [descreva aqui exatamente onde travou].
