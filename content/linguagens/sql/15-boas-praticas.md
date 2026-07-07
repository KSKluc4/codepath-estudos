---
numero: 15
titulo: "Boas práticas"
nivel: "avancado"
objetivo: "Aplicar boas práticas de escrita e performance de SQL no dia a dia."
duracao: 12
status: "completo"
---

## Conceito

Depois de conhecer a sintaxe, escrever SQL "bom" é sobre hábitos: consultas legíveis, seguras e
eficientes. Boa parte dos problemas de performance e dos incidentes graves em produção (como um
`DELETE` sem `WHERE`) vêm de hábitos simples que, uma vez internalizados, previnem a maioria dos
erros comuns.

## Sintaxe

```sql
-- Formatação legível: uma cláusula por linha, palavras-chave em maiúsculas
SELECT nome, salario
FROM funcionarios
WHERE departamento_id = 1
ORDER BY salario DESC;
```

## Exemplos comentados

```sql
-- 1. Evite SELECT * em código de produção — liste as colunas necessárias
-- Ruim:
SELECT * FROM funcionarios;
-- Melhor: mais rápido, mais claro, e não quebra se colunas forem adicionadas depois
SELECT id, nome, salario FROM funcionarios;

-- 2. Sempre teste UPDATE/DELETE com um SELECT usando a MESMA condição antes
SELECT * FROM funcionarios WHERE departamento_id IS NULL; -- confira primeiro
DELETE FROM funcionarios WHERE departamento_id IS NULL;    -- só então apague

-- 3. Use transações para operações compostas que precisam ser atômicas
BEGIN;
UPDATE contas SET saldo = saldo - 100 WHERE id = 1;
UPDATE contas SET saldo = saldo + 100 WHERE id = 2;
COMMIT;

-- 4. Prefira JOIN explícito (INNER JOIN ... ON) a WHERE implícito
-- Ruim (estilo antigo, fácil de esquecer a condição e gerar produto cartesiano):
SELECT f.nome, d.nome FROM funcionarios f, departamentos d WHERE f.departamento_id = d.id;
-- Melhor: intenção clara, difícil de esquecer a condição de junção
SELECT f.nome, d.nome FROM funcionarios f INNER JOIN departamentos d ON f.departamento_id = d.id;

-- 5. Nomeie parâmetros/consultas de forma que reflitam o domínio, não abreviações obscuras
-- Ruim: SELECT * FROM f WHERE s > 5000;
-- Melhor: SELECT * FROM funcionarios WHERE salario > 5000;

-- 6. Use índices nas colunas usadas em WHERE, JOIN e ORDER BY com frequência,
-- mas evite indexar tudo (custo de escrita, visto no capítulo de índices)

-- 7. Evite funções sobre a coluna filtrada em WHERE — isso geralmente impede o uso de índices
-- Ruim: impede o banco de usar um índice em data_contratacao
SELECT * FROM funcionarios WHERE YEAR(data_contratacao) = 2023;
-- Melhor: usa uma faixa de datas, que pode aproveitar um índice
SELECT * FROM funcionarios
WHERE data_contratacao >= '2023-01-01' AND data_contratacao < '2024-01-01';

-- 8. Use nomes de tabela/coluna em minúsculas com underscore (snake_case),
-- consistentemente — evita problemas de case-sensitivity entre bancos diferentes
CREATE TABLE pedidos_cliente ( ... ); -- não PedidosCliente ou pedidosCliente

-- 9. Sempre defina PRIMARY KEY e as FOREIGN KEYs relevantes — não deixe a
-- integridade dos dados depender só da disciplina da aplicação

-- 10. Comente consultas complexas para explicar o "porquê", não o "o quê"
-- Correto: explica uma decisão não óbvia
-- Exclui cancelados porque o relatório financeiro já soma pedidos válidos separadamente
SELECT * FROM pedidos WHERE status != 'cancelado';
```

## Exercício 1: Reescreva uma consulta insegura

O código abaixo é um risco em produção. Identifique o problema e reescreva de forma mais segura,
sem alterar a intenção (apagar funcionários inativos há mais de 2 anos).

```sql
DELETE FROM funcionarios;
```

### Solução

```sql
-- Primeiro, confira o que seria afetado:
SELECT * FROM funcionarios
WHERE ativo = FALSE AND data_desligamento < CURRENT_DATE - INTERVAL '2 years';

-- Só depois de confirmar visualmente, execute o DELETE com a MESMA condição:
DELETE FROM funcionarios
WHERE ativo = FALSE AND data_desligamento < CURRENT_DATE - INTERVAL '2 years';
```

`DELETE FROM funcionarios;` sem `WHERE` apaga a tabela inteira — um dos erros mais destrutivos e
comuns em SQL. A prática segura é sempre incluir a condição exata do que deve ser afetado, e
testá-la primeiro com um `SELECT` equivalente antes de rodar o comando destrutivo de verdade.

## Exercício 2: Substitua SELECT * por colunas explícitas

Reescreva a consulta abaixo para retornar apenas as colunas `nome` e `email`, em vez de todas as
colunas da tabela.

```sql
SELECT * FROM usuarios WHERE ativo = TRUE;
```

### Solução

```sql
SELECT nome, email FROM usuarios WHERE ativo = TRUE;
```

Listar apenas as colunas necessárias reduz a quantidade de dados transferidos (importante em
tabelas com muitas colunas ou colunas grandes, como texto longo), deixa a consulta mais clara
sobre sua real intenção, e evita que a consulta quebre inesperadamente se novas colunas forem
adicionadas à tabela no futuro.

## Quiz

### 1. Por que evitar `SELECT *` em consultas de produção?

- [ ] `SELECT *` é sempre um erro de sintaxe
- [x] Retorna colunas desnecessárias (desperdiçando banda/memória) e é frágil a mudanças futuras na estrutura da tabela
- [ ] `SELECT *` não funciona com JOIN
- [ ] Não há motivo real, é apenas uma preferência estética

> Listar colunas explicitamente deixa claro exatamente o que a consulta espera, evita transferir
> dados desnecessários, e protege contra quebras silenciosas se colunas forem adicionadas ou
> reordenadas na tabela no futuro.

### 2. Qual é a prática recomendada antes de rodar um `DELETE` ou `UPDATE` com uma condição complexa?

- [ ] Rodar diretamente, confiando na condição escrita
- [x] Rodar um `SELECT` com a mesma condição primeiro, para conferir exatamente quais linhas seriam afetadas
- [ ] Sempre remover o WHERE para simplificar
- [ ] Rodar o comando em um horário de menor movimento, sem outra verificação

> Substituir mentalmente `DELETE`/`UPDATE` por `SELECT *` com a mesma condição `WHERE` mostra
> exatamente quais linhas seriam impactadas — um hábito simples que evita a grande maioria dos
> incidentes de dados apagados ou alterados por engano.

### 3. Por que aplicar uma função sobre a coluna filtrada em `WHERE` (como `YEAR(data_contratacao) = 2023`) costuma ser uma prática ruim?

- [ ] Porque funções não são permitidas em SQL
- [x] Porque geralmente impede o banco de usar um índice naquela coluna, forçando um full table scan
- [ ] Porque sempre retorna resultado incorreto
- [ ] Porque só funciona com números

> Quando uma função é aplicada à coluna dentro do `WHERE`, o banco geralmente não consegue usar um
> índice existente naquela coluna (já que o índice foi construído sobre os valores originais, não
> sobre o resultado da função) — reescrever a condição como uma faixa de valores diretos (`>=` e
> `<`) preserva a capacidade de usar o índice.

## Tirou dúvida?

Se travar em algum ponto deste capítulo, descreva o contexto exato ao pedir ajuda. Copie e adapte
o modelo abaixo:

> Estou estudando "Boas práticas" na trilha de SQL do CodePath. Contexto: o capítulo explica
> hábitos recomendados como evitar SELECT *, testar DELETE/UPDATE com SELECT antes, usar
> transações e preservar o uso de índices. Minha dúvida/meu exercício: [descreva aqui exatamente
> onde travou].
