// Script utilitário para gerar capítulos "em breve" da área Linguagens a partir de um manifesto.
// Não sobrescreve arquivos já existentes (então capítulos já escritos ficam intactos).
// Uso: node scripts/gerar-placeholders-linguagens.mjs
import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content", "linguagens");

const manifesto = {
  python: [
    { numero: 1, titulo: "Variáveis e tipos", nivel: "basico", duracao: 12, objetivo: "Declarar variáveis em Python e conhecer os tipos primitivos (int, float, str, bool)." },
    { numero: 2, titulo: "Strings", nivel: "basico", duracao: 12, objetivo: "Manipular texto em Python: fatiamento, métodos comuns e f-strings." },
    { numero: 3, titulo: "Listas", nivel: "basico", duracao: 12, objetivo: "Criar, percorrer e modificar listas, a estrutura de dados mais usada em Python." },
    { numero: 4, titulo: "Dicionários", nivel: "basico", duracao: 12, objetivo: "Guardar dados como pares chave-valor com dicionários." },
    { numero: 5, titulo: "Sets", nivel: "basico", duracao: 10, objetivo: "Usar conjuntos para armazenar valores únicos e operações de conjunto." },
    { numero: 6, titulo: "Condicionais", nivel: "basico", duracao: 10, objetivo: "Controlar o fluxo do programa com if, elif e else." },
    { numero: 7, titulo: "Loops", nivel: "basico", duracao: 12, objetivo: "Repetir tarefas com for e while, e controlar loops com break e continue." },
    { numero: 8, titulo: "Funções", nivel: "basico", duracao: 12, objetivo: "Definir funções reutilizáveis com parâmetros, valores padrão e retorno." },
    { numero: 9, titulo: "List comprehensions", nivel: "intermediario", duracao: 12, objetivo: "Criar listas de forma concisa com list comprehensions." },
    { numero: 10, titulo: "Arquivos", nivel: "intermediario", duracao: 12, objetivo: "Ler e escrever arquivos de texto com open() e o gerenciador de contexto with." },
    { numero: 11, titulo: "Erros e exceções", nivel: "intermediario", duracao: 12, objetivo: "Tratar erros com try/except e lançar exceções próprias." },
    { numero: 12, titulo: "Módulos", nivel: "intermediario", duracao: 10, objetivo: "Organizar código em módulos e importar bibliotecas padrão e próprias." },
    { numero: 13, titulo: "OOP básico", nivel: "intermediario", duracao: 15, objetivo: "Criar classes, instâncias, atributos e métodos em Python." },
    { numero: 14, titulo: "OOP avançado", nivel: "avancado", duracao: 15, objetivo: "Aplicar herança, polimorfismo e métodos especiais (dunder methods)." },
    { numero: 15, titulo: "Decorators", nivel: "avancado", duracao: 15, objetivo: "Entender e criar decorators para modificar o comportamento de funções." },
    { numero: 16, titulo: "Geradores", nivel: "avancado", duracao: 15, objetivo: "Criar iteradores preguiçosos com generators e a palavra-chave yield." },
    { numero: 17, titulo: "Virtual envs e pip", nivel: "avancado", duracao: 12, objetivo: "Isolar dependências de projetos com venv e gerenciar pacotes com pip." },
    { numero: 18, titulo: "Testes com pytest", nivel: "avancado", duracao: 15, objetivo: "Escrever testes automatizados para código Python usando pytest." },
    { numero: 19, titulo: "Dicas idiomáticas", nivel: "avancado", duracao: 12, objetivo: "Escrever Python mais 'pythônico': idiomas e boas práticas da comunidade." },
  ],
  javascript: [
    { numero: 1, titulo: "Variáveis (let/const)", nivel: "basico", duracao: 10, objetivo: "Declarar variáveis com let e const e entender escopo de bloco." },
    { numero: 2, titulo: "Tipos", nivel: "basico", duracao: 10, objetivo: "Conhecer os tipos primitivos de JavaScript e conversões entre eles." },
    { numero: 3, titulo: "Strings e template literals", nivel: "basico", duracao: 10, objetivo: "Manipular texto e interpolar valores com template literals." },
    { numero: 4, titulo: "Arrays e métodos (map/filter/reduce)", nivel: "basico", duracao: 15, objetivo: "Transformar coleções de forma funcional com map, filter e reduce." },
    { numero: 5, titulo: "Objetos", nivel: "basico", duracao: 12, objetivo: "Criar e manipular objetos, a estrutura central de dados em JS." },
    { numero: 6, titulo: "Funções e arrow functions", nivel: "basico", duracao: 12, objetivo: "Declarar funções tradicionais e arrow functions, e entender suas diferenças." },
    { numero: 7, titulo: "Destructuring", nivel: "basico", duracao: 10, objetivo: "Extrair valores de arrays e objetos com desestruturação." },
    { numero: 8, titulo: "DOM básico", nivel: "intermediario", duracao: 12, objetivo: "Selecionar e manipular elementos HTML a partir do JavaScript." },
    { numero: 9, titulo: "Eventos", nivel: "intermediario", duracao: 12, objetivo: "Reagir a interações do usuário com event listeners." },
    { numero: 10, titulo: "Promises", nivel: "intermediario", duracao: 12, objetivo: "Lidar com operações assíncronas usando Promises." },
    { numero: 11, titulo: "Async/await", nivel: "intermediario", duracao: 12, objetivo: "Escrever código assíncrono de forma linear com async/await." },
    { numero: 12, titulo: "Fetch", nivel: "intermediario", duracao: 12, objetivo: "Fazer requisições HTTP a partir do navegador com a Fetch API." },
    { numero: 13, titulo: "Módulos ES", nivel: "intermediario", duracao: 10, objetivo: "Organizar código em módulos com import/export." },
    { numero: 14, titulo: "Classes", nivel: "intermediario", duracao: 12, objetivo: "Modelar objetos com classes, construtores e herança em JavaScript." },
    { numero: 15, titulo: "Closures", nivel: "avancado", duracao: 15, objetivo: "Entender closures e como funções 'lembram' do escopo onde nasceram." },
    { numero: 16, titulo: "this", nivel: "avancado", duracao: 15, objetivo: "Entender como o valor de this é determinado em diferentes contextos." },
    { numero: 17, titulo: "TypeScript: tipos básicos", nivel: "avancado", duracao: 12, objetivo: "Adicionar tipos estáticos básicos a código JavaScript com TypeScript." },
    { numero: 18, titulo: "Interfaces", nivel: "avancado", duracao: 12, objetivo: "Descrever a forma de objetos com interfaces em TypeScript." },
    { numero: 19, titulo: "Generics", nivel: "avancado", duracao: 15, objetivo: "Escrever código reutilizável e type-safe com generics." },
    { numero: 20, titulo: "Narrowing", nivel: "avancado", duracao: 12, objetivo: "Refinar tipos em tempo de compilação com narrowing." },
    { numero: 21, titulo: "Configuração tsconfig", nivel: "avancado", duracao: 10, objetivo: "Configurar um projeto TypeScript com tsconfig.json." },
  ],
  c: [
    { numero: 1, titulo: "Estrutura de um programa", nivel: "basico", duracao: 10, objetivo: "Reconhecer as partes de um programa C: includes, main e compilação." },
    { numero: 2, titulo: "Tipos e variáveis", nivel: "basico", duracao: 12, objetivo: "Declarar variáveis com os tipos primitivos de C e seus tamanhos." },
    { numero: 3, titulo: "Operadores", nivel: "basico", duracao: 10, objetivo: "Usar operadores aritméticos, relacionais, lógicos e de atribuição em C." },
    { numero: 4, titulo: "Condicionais", nivel: "basico", duracao: 10, objetivo: "Controlar o fluxo com if, else e switch em C." },
    { numero: 5, titulo: "Loops", nivel: "basico", duracao: 10, objetivo: "Repetir instruções com for, while e do-while em C." },
    { numero: 6, titulo: "Funções", nivel: "basico", duracao: 12, objetivo: "Declarar e chamar funções em C, com protótipos e retorno." },
    { numero: 7, titulo: "Arrays", nivel: "intermediario", duracao: 12, objetivo: "Declarar e percorrer arrays de tamanho fixo em C." },
    { numero: 8, titulo: "Strings", nivel: "intermediario", duracao: 12, objetivo: "Manipular strings em C como arrays de char terminados em '\\0'." },
    { numero: 9, titulo: "Ponteiros básico", nivel: "intermediario", duracao: 15, objetivo: "Entender endereços de memória e os operadores & e * em C." },
    { numero: 10, titulo: "Ponteiros e arrays", nivel: "intermediario", duracao: 15, objetivo: "Ver a relação entre ponteiros e arrays na memória." },
    { numero: 11, titulo: "Ponteiros e funções", nivel: "intermediario", duracao: 12, objetivo: "Passar ponteiros como argumento para alterar valores fora da função." },
    { numero: 12, titulo: "Structs", nivel: "intermediario", duracao: 12, objetivo: "Agrupar dados relacionados em uma struct." },
    { numero: 13, titulo: "malloc e free", nivel: "avancado", duracao: 15, objetivo: "Alocar e liberar memória dinamicamente com malloc e free." },
    { numero: 14, titulo: "Arquivos", nivel: "avancado", duracao: 12, objetivo: "Ler e escrever arquivos em C com fopen, fprintf e fclose." },
    { numero: 15, titulo: "Pré-processador", nivel: "avancado", duracao: 10, objetivo: "Usar diretivas de pré-processador como #define e #ifdef." },
    { numero: 16, titulo: "Headers e múltiplos arquivos", nivel: "avancado", duracao: 12, objetivo: "Organizar um programa C em múltiplos arquivos .c e .h." },
    { numero: 17, titulo: "Erros comuns e debugging", nivel: "avancado", duracao: 12, objetivo: "Reconhecer e depurar os erros mais comuns de C: segfaults e vazamentos." },
  ],
  cpp: [
    { numero: 1, titulo: "Do C ao C++: o que muda", nivel: "basico", duracao: 12, objetivo: "Entender as principais diferenças de C++ sobre C: iostream, namespaces e compilação." },
    { numero: 2, titulo: "Tipos, referências e const", nivel: "basico", duracao: 12, objetivo: "Usar referências (&) como alternativa mais segura a ponteiros, e o qualificador const." },
    { numero: 3, titulo: "Funções: sobrecarga e parâmetros padrão", nivel: "basico", duracao: 10, objetivo: "Declarar múltiplas versões de uma função (overloading) e parâmetros com valor padrão." },
    { numero: 4, titulo: "Strings (std::string)", nivel: "basico", duracao: 10, objetivo: "Manipular texto com std::string, mais seguro que arrays de char de C." },
    { numero: 5, titulo: "std::vector e arrays", nivel: "basico", duracao: 12, objetivo: "Usar std::vector como array dinâmico, mais seguro e flexível que arrays de C." },
    { numero: 6, titulo: "Classes e objetos", nivel: "basico", duracao: 15, objetivo: "Definir classes, atributos e métodos, e instanciar objetos em C++." },
    { numero: 7, titulo: "Construtores e destrutores", nivel: "basico", duracao: 12, objetivo: "Inicializar e finalizar objetos com construtores e destrutores." },
    { numero: 8, titulo: "Encapsulamento", nivel: "intermediario", duracao: 12, objetivo: "Controlar acesso a membros de uma classe com public, private e protected." },
    { numero: 9, titulo: "Herança", nivel: "intermediario", duracao: 12, objetivo: "Reaproveitar código entre classes com herança em C++." },
    { numero: 10, titulo: "Polimorfismo e funções virtuais", nivel: "intermediario", duracao: 15, objetivo: "Usar funções virtuais para permitir polimorfismo entre classes derivadas." },
    { numero: 11, titulo: "Sobrecarga de operadores", nivel: "intermediario", duracao: 12, objetivo: "Redefinir operadores como + e == para tipos definidos pelo usuário." },
    { numero: 12, titulo: "STL: containers (map, set, list)", nivel: "intermediario", duracao: 15, objetivo: "Conhecer os containers mais usados da STL além do vector." },
    { numero: 13, titulo: "STL: algoritmos e iteradores", nivel: "intermediario", duracao: 12, objetivo: "Usar iteradores e algoritmos genéricos da STL como sort e find." },
    { numero: 14, titulo: "Exceções", nivel: "avancado", duracao: 12, objetivo: "Tratar erros em tempo de execução com try, catch e throw." },
    { numero: 15, titulo: "Templates de função e classe", nivel: "avancado", duracao: 15, objetivo: "Escrever código genérico reutilizável com templates." },
    { numero: 16, titulo: "Smart pointers", nivel: "avancado", duracao: 15, objetivo: "Gerenciar memória automaticamente com unique_ptr e shared_ptr." },
    { numero: 17, titulo: "RAII e gerenciamento de recursos", nivel: "avancado", duracao: 12, objetivo: "Entender RAII como o padrão central de gerenciamento de recursos em C++." },
    { numero: 18, titulo: "Move semantics e lambdas", nivel: "avancado", duracao: 15, objetivo: "Evitar cópias desnecessárias com move semantics e escrever funções anônimas com lambdas." },
  ],
  csharp: [
    { numero: 1, titulo: "Sintaxe básica e Hello World", nivel: "basico", duracao: 10, objetivo: "Escrever e rodar um primeiro programa em C#, com Console.WriteLine e tipos primitivos." },
    { numero: 2, titulo: "Variáveis e tipos", nivel: "basico", duracao: 10, objetivo: "Declarar variáveis com var e tipos explícitos, e entender value types vs reference types." },
    { numero: 3, titulo: "Strings e interpolação", nivel: "basico", duracao: 10, objetivo: "Manipular texto e interpolar valores com string interpolation ($)." },
    { numero: 4, titulo: "Condicionais e operadores", nivel: "basico", duracao: 10, objetivo: "Controlar fluxo com if/else/switch e operadores lógicos em C#." },
    { numero: 5, titulo: "Loops", nivel: "basico", duracao: 10, objetivo: "Repetir instruções com for, foreach e while em C#." },
    { numero: 6, titulo: "Arrays e List<T>", nivel: "basico", duracao: 12, objetivo: "Usar arrays de tamanho fixo e List<T> como coleção dinâmica." },
    { numero: 7, titulo: "Métodos", nivel: "basico", duracao: 12, objetivo: "Declarar métodos com parâmetros, valores padrão e retorno em C#." },
    { numero: 8, titulo: "Classes e objetos", nivel: "intermediario", duracao: 15, objetivo: "Definir classes, construtores e propriedades (get/set) em C#." },
    { numero: 9, titulo: "Herança e polimorfismo", nivel: "intermediario", duracao: 15, objetivo: "Reaproveitar e sobrescrever comportamento entre classes com herança e override." },
    { numero: 10, titulo: "Interfaces", nivel: "intermediario", duracao: 12, objetivo: "Definir contratos de comportamento com interfaces em C#." },
    { numero: 11, titulo: "Coleções e LINQ básico", nivel: "intermediario", duracao: 15, objetivo: "Usar Dictionary, List e consultas LINQ básicas sobre coleções." },
    { numero: 12, titulo: "Exceções", nivel: "intermediario", duracao: 12, objetivo: "Tratar erros com try/catch/finally e lançar exceções customizadas." },
    { numero: 13, titulo: "Generics", nivel: "avancado", duracao: 12, objetivo: "Escrever classes e métodos genéricos reutilizáveis e type-safe." },
    { numero: 14, titulo: "Async/await e Task", nivel: "avancado", duracao: 15, objetivo: "Escrever código assíncrono em C# com async/await e o tipo Task." },
    { numero: 15, titulo: "Nullable types", nivel: "avancado", duracao: 12, objetivo: "Trabalhar com valores nulos de forma segura usando nullable types e o operador ?." },
    { numero: 16, titulo: "Delegates e eventos", nivel: "avancado", duracao: 15, objetivo: "Tratar funções como valores com delegates, e reagir a eventos em C#." },
    { numero: 17, titulo: "LINQ avançado", nivel: "avancado", duracao: 15, objetivo: "Encadear operações LINQ como Where, Select e OrderBy sobre coleções." },
    { numero: 18, titulo: "Boas práticas e convenções", nivel: "avancado", duracao: 10, objetivo: "Aplicar convenções de nomenclatura e boas práticas idiomáticas em C#." },
  ],
  sql: [
    { numero: 1, titulo: "SELECT", nivel: "basico", duracao: 10, objetivo: "Consultar dados de uma tabela com SELECT." },
    { numero: 2, titulo: "WHERE", nivel: "basico", duracao: 10, objetivo: "Filtrar linhas de resultado com a cláusula WHERE." },
    { numero: 3, titulo: "ORDER BY", nivel: "basico", duracao: 8, objetivo: "Ordenar resultados de consulta com ORDER BY." },
    { numero: 4, titulo: "Funções agregadas", nivel: "basico", duracao: 10, objetivo: "Resumir dados com COUNT, SUM, AVG, MIN e MAX." },
    { numero: 5, titulo: "GROUP BY e HAVING", nivel: "intermediario", duracao: 12, objetivo: "Agrupar linhas e filtrar grupos com GROUP BY e HAVING." },
    { numero: 6, titulo: "JOINs (parte 1)", nivel: "intermediario", duracao: 12, objetivo: "Combinar tabelas com INNER JOIN e LEFT JOIN." },
    { numero: 7, titulo: "JOINs (parte 2)", nivel: "intermediario", duracao: 12, objetivo: "Explorar RIGHT JOIN, FULL JOIN e joins entre múltiplas tabelas." },
    { numero: 8, titulo: "Subqueries", nivel: "intermediario", duracao: 12, objetivo: "Escrever consultas aninhadas (subqueries) dentro de outras consultas." },
    { numero: 9, titulo: "INSERT, UPDATE e DELETE", nivel: "intermediario", duracao: 12, objetivo: "Modificar dados com INSERT, UPDATE e DELETE." },
    { numero: 10, titulo: "Criação de tabelas e tipos", nivel: "avancado", duracao: 12, objetivo: "Criar tabelas com CREATE TABLE e escolher tipos de dados adequados." },
    { numero: 11, titulo: "Constraints e chaves", nivel: "avancado", duracao: 12, objetivo: "Garantir integridade de dados com chaves primárias, estrangeiras e constraints." },
    { numero: 12, titulo: "Índices", nivel: "avancado", duracao: 10, objetivo: "Acelerar consultas com índices e entender seus custos." },
    { numero: 13, titulo: "Transações", nivel: "avancado", duracao: 12, objetivo: "Garantir atomicidade de operações com BEGIN, COMMIT e ROLLBACK." },
    { numero: 14, titulo: "Views", nivel: "avancado", duracao: 10, objetivo: "Criar consultas reutilizáveis com CREATE VIEW." },
    { numero: 15, titulo: "Boas práticas", nivel: "avancado", duracao: 12, objetivo: "Aplicar boas práticas de escrita e performance de SQL no dia a dia." },
  ],
  bash: [
    { numero: 1, titulo: "Navegação", nivel: "basico", duracao: 8, objetivo: "Navegar pelo sistema de arquivos com cd, pwd e ls." },
    { numero: 2, titulo: "Manipulação de arquivos", nivel: "basico", duracao: 10, objetivo: "Criar, copiar, mover e remover arquivos e diretórios pelo terminal." },
    { numero: 3, titulo: "Permissões", nivel: "basico", duracao: 10, objetivo: "Entender e alterar permissões de arquivos com chmod e chown." },
    { numero: 4, titulo: "Pipes e redirecionamento", nivel: "basico", duracao: 10, objetivo: "Encadear comandos com pipes e redirecionar entrada/saída." },
    { numero: 5, titulo: "Variáveis", nivel: "basico", duracao: 10, objetivo: "Declarar e usar variáveis em scripts Bash." },
    { numero: 6, titulo: "Condicionais", nivel: "intermediario", duracao: 12, objetivo: "Controlar fluxo em scripts com if, test e comparações." },
    { numero: 7, titulo: "Loops", nivel: "intermediario", duracao: 10, objetivo: "Repetir comandos com for e while em Bash." },
    { numero: 8, titulo: "Funções", nivel: "intermediario", duracao: 10, objetivo: "Organizar scripts em funções reutilizáveis." },
    { numero: 9, titulo: "Scripts", nivel: "intermediario", duracao: 10, objetivo: "Escrever e executar seus próprios scripts .sh." },
    { numero: 10, titulo: "Argumentos", nivel: "intermediario", duracao: 10, objetivo: "Ler argumentos de linha de comando dentro de um script." },
    { numero: 11, titulo: "grep, sed e awk básico", nivel: "avancado", duracao: 15, objetivo: "Buscar e transformar texto com grep, sed e awk." },
    { numero: 12, titulo: "find", nivel: "avancado", duracao: 12, objetivo: "Localizar arquivos por nome, tipo e data com find." },
    { numero: 13, titulo: "Processos", nivel: "avancado", duracao: 10, objetivo: "Gerenciar processos em execução com ps, kill e jobs." },
    { numero: 14, titulo: "Cron", nivel: "avancado", duracao: 10, objetivo: "Agendar tarefas recorrentes com crontab." },
    { numero: 15, titulo: "Dicas de produtividade no terminal", nivel: "avancado", duracao: 10, objetivo: "Atalhos, aliases e truques para ser mais rápido no terminal." },
  ],
};

function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

for (const [trilha, capitulos] of Object.entries(manifesto)) {
  const dir = path.join(CONTENT_DIR, trilha);
  fs.mkdirSync(dir, { recursive: true });

  for (const capitulo of capitulos) {
    const numeroFmt = String(capitulo.numero).padStart(2, "0");
    const fileName = `${numeroFmt}-${slugify(capitulo.titulo)}.md`;
    const filePath = path.join(dir, fileName);
    if (fs.existsSync(filePath)) continue;

    const conteudo = `---
numero: ${capitulo.numero}
titulo: "${capitulo.titulo.replace(/"/g, '\\"')}"
nivel: "${capitulo.nivel}"
objetivo: "${capitulo.objetivo.replace(/"/g, '\\"')}"
duracao: ${capitulo.duracao}
status: "em-breve"
---

## O que você vai encontrar aqui

${capitulo.objetivo}

Este capítulo de referência ainda está sendo escrito. Quando publicado, vai seguir o formato
padrão da área Linguagens: conceito, sintaxe, exemplos comentados, 1-2 exercícios práticos e um
quiz curto de fixação.
`;
    fs.writeFileSync(filePath, conteudo, "utf-8");
    console.log("Criado:", path.relative(process.cwd(), filePath));
  }
}
