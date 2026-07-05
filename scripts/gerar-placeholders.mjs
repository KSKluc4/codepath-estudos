// Script utilitário para gerar arquivos de aula "em breve" a partir de um manifesto.
// Uso: node scripts/gerar-placeholders.mjs
import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content", "aulas");

const manifesto = {
  1: [
    { numero: 5, titulo: "RAM vs Disco — como o computador guarda e lembra das coisas", duracao: 20, objetivo: "Entender a diferença entre memória volátil (RAM) e armazenamento permanente (disco/SSD), e por que essa diferença molda todo o design de software.", objetivos: ["Explicar por que a RAM é rápida e volátil, e o disco é lento e permanente", "Entender a hierarquia de memória (registradores, cache, RAM, disco)", "Relacionar isso com por que programas 'perdem' dados não salvos"] },
    { numero: 6, titulo: "Terminal e Bash — conversando com o computador por texto", duracao: 25, objetivo: "Aprender a usar o terminal e comandos básicos de Bash para navegar e manipular arquivos sem interface gráfica.", objetivos: ["Entender o que é um shell e por que ele existe", "Usar comandos básicos: cd, ls, pwd, mkdir, rm, cat", "Entender caminhos absolutos vs relativos"] },
    { numero: 7, titulo: "Sistema Operacional — o maestro por trás de tudo", duracao: 25, objetivo: "Entender o papel do sistema operacional como gerenciador de recursos: processos, memória, arquivos e dispositivos.", objetivos: ["Definir o que é um sistema operacional e por que ele é necessário", "Entender kernel vs espaço do usuário", "Ver como o SO gerencia múltiplos programas ao mesmo tempo"] },
    { numero: 8, titulo: "Projeto e revisão do Mês 1", duracao: 30, objetivo: "Consolidar os conceitos de binário, lógica, CPU e sistema operacional com um projeto prático de revisão.", objetivos: ["Revisar todos os tópicos do mês em um projeto integrado", "Montar um mapa mental da 'máquina' completa, do elétron ao SO"] },
  ],
  2: [
    { numero: 1, titulo: "Por que aprender C primeiro", duracao: 20, objetivo: "Entender por que C é a linguagem ideal para aprender como a memória e o hardware realmente funcionam.", objetivos: ["Contextualizar C na história da computação", "Entender a diferença entre linguagens de alto e baixo nível", "Preparar o ambiente de compilação (gcc)"] },
    { numero: 2, titulo: "Variáveis, tipos e memória em C", duracao: 25, objetivo: "Aprender como C representa variáveis na memória e quanto espaço cada tipo ocupa.", objetivos: ["Declarar variáveis com tipos primitivos (int, char, float, double)", "Entender o tamanho em bytes de cada tipo", "Usar sizeof para inspecionar a memória"] },
    { numero: 3, titulo: "Ponteiros — o endereço das coisas", duracao: 30, objetivo: "Entender o que são ponteiros, como declará-los e por que são centrais em C.", objetivos: ["Entender o operador & (endereço de) e * (desreferência)", "Declarar e usar ponteiros básicos", "Relacionar ponteiros com arrays"] },
    { numero: 4, titulo: "Stack vs Heap", duracao: 25, objetivo: "Entender as duas regiões de memória usadas por um programa em execução e quando cada uma é usada.", objetivos: ["Diferenciar alocação automática (stack) de manual (heap)", "Entender por que a stack é rápida e limitada", "Reconhecer estouro de pilha (stack overflow)"] },
    { numero: 5, titulo: "malloc, free e gerenciamento manual de memória", duracao: 30, objetivo: "Aprender a alocar e liberar memória manualmente em C, e os perigos de fazer isso errado.", objetivos: ["Usar malloc, calloc, realloc e free", "Entender vazamento de memória (memory leak)", "Entender ponteiros soltos (dangling pointers)"] },
    { numero: 6, titulo: "Como o compilador transforma texto em binário", duracao: 25, objetivo: "Entender as etapas de pré-processamento, compilação, montagem e linkagem que transformam código C em executável.", objetivos: ["Descrever as 4 etapas do processo de compilação", "Rodar gcc com flags para ver cada etapa", "Entender o que é um linker e por que ele existe"] },
    { numero: 7, titulo: "Projeto e revisão do Mês 2", duracao: 30, objetivo: "Consolidar C, ponteiros e memória com um projeto prático.", objetivos: ["Construir um pequeno programa em C usando alocação dinâmica", "Revisar stack, heap e ponteiros na prática"] },
  ],
  3: [
    { numero: 1, titulo: "Big O — medindo a velocidade dos algoritmos", duracao: 30, objetivo: "Aprender a notação Big O para comparar a eficiência de algoritmos independente do hardware.", objetivos: ["Entender o que Big O mede (tempo e espaço)", "Reconhecer O(1), O(log n), O(n), O(n log n), O(n²)", "Analisar a complexidade de trechos de código simples"] },
    { numero: 2, titulo: "Arrays e Strings", duracao: 25, objetivo: "Entender como arrays são armazenados na memória e as operações fundamentais sobre eles.", objetivos: ["Entender acesso indexado O(1) em arrays", "Comparar inserção/remoção em arrays estáticos e dinâmicos", "Manipular strings como arrays de caracteres"] },
    { numero: 3, titulo: "Listas ligadas", duracao: 30, objetivo: "Entender a estrutura de listas ligadas e quando preferi-las a arrays.", objetivos: ["Implementar uma lista ligada simples", "Comparar listas ligadas com arrays (trade-offs)", "Entender listas duplamente ligadas"] },
    { numero: 4, titulo: "Pilhas e Filas", duracao: 20, objetivo: "Entender as estruturas LIFO (pilha) e FIFO (fila) e seus casos de uso reais.", objetivos: ["Implementar uma pilha e uma fila", "Reconhecer aplicações reais (desfazer, histórico, filas de impressão)"] },
    { numero: 5, titulo: "Hash Tables", duracao: 30, objetivo: "Entender como hash tables alcançam busca em tempo O(1) e como colisões são tratadas.", objetivos: ["Entender função de hash e por que ela importa", "Explicar colisões e estratégias de resolução", "Usar hash tables para resolver problemas de contagem/busca"] },
    { numero: 6, titulo: "Árvores", duracao: 30, objetivo: "Entender árvores binárias, árvores de busca e por que estruturas hierárquicas são úteis.", objetivos: ["Implementar uma árvore binária de busca", "Entender percursos (in-order, pre-order, post-order)", "Relacionar árvores com problemas de busca eficiente"] },
    { numero: 7, titulo: "Grafos", duracao: 30, objetivo: "Entender grafos como modelo geral de relações e os algoritmos básicos de busca (BFS/DFS).", objetivos: ["Representar grafos com lista/matriz de adjacência", "Implementar busca em largura (BFS) e profundidade (DFS)", "Reconhecer problemas reais modelados como grafos"] },
    { numero: 8, titulo: "Padrões de entrevista técnica", duracao: 35, objetivo: "Aprender padrões recorrentes usados para resolver problemas de entrevistas técnicas com eficiência.", objetivos: ["Aplicar two pointers e sliding window", "Reconhecer quando usar recursão e backtracking", "Praticar problemas clássicos de entrevista"] },
    { numero: 9, titulo: "Projeto e revisão do Mês 3", duracao: 30, objetivo: "Consolidar estruturas de dados e algoritmos com problemas práticos integrados.", objetivos: ["Resolver um conjunto de problemas combinando as estruturas vistas no mês", "Revisar Big O de cada estrutura estudada"] },
  ],
  4: [
    { numero: 1, titulo: "Como a internet funciona (visão geral)", duracao: 25, objetivo: "Ter uma visão panorâmica de como dados viajam entre computadores pelo mundo.", objetivos: ["Entender o conceito de rede de computadores", "Visualizar a jornada de um pacote de dados", "Introduzir o modelo de camadas"] },
    { numero: 2, titulo: "TCP/IP", duracao: 30, objetivo: "Entender os protocolos fundamentais que permitem a comunicação confiável entre computadores.", objetivos: ["Diferenciar IP (endereçamento) de TCP (entrega confiável)", "Entender o three-way handshake", "Comparar TCP com UDP"] },
    { numero: 3, titulo: "DNS", duracao: 20, objetivo: "Entender como nomes de domínio são traduzidos para endereços IP.", objetivos: ["Explicar o papel do DNS na internet", "Entender a hierarquia de servidores DNS", "Rodar comandos de consulta DNS (nslookup/dig)"] },
    { numero: 4, titulo: "HTTP e HTTPS", duracao: 30, objetivo: "Entender o protocolo que move a web: requisições, respostas, métodos e status codes.", objetivos: ["Entender a estrutura de uma requisição/resposta HTTP", "Reconhecer métodos (GET, POST, PUT, DELETE) e status codes", "Entender por que HTTPS adiciona criptografia (TLS)"] },
    { numero: 5, titulo: "Processos", duracao: 25, objetivo: "Entender o que é um processo e como o sistema operacional gerencia múltiplos processos.", objetivos: ["Definir processo e diferenciar de programa", "Entender estados de um processo", "Usar comandos para inspecionar processos (ps, top)"] },
    { numero: 6, titulo: "Threads e concorrência", duracao: 30, objetivo: "Entender threads como unidades de execução dentro de um processo e os desafios da concorrência.", objetivos: ["Diferenciar processos de threads", "Entender condições de corrida (race conditions)", "Introduzir mecanismos básicos de sincronização"] },
    { numero: 7, titulo: "Linux na prática", duracao: 30, objetivo: "Aplicar conhecimentos de sistema operacional usando Linux como ambiente principal de desenvolvimento.", objetivos: ["Navegar no sistema de arquivos do Linux", "Gerenciar permissões de arquivos", "Instalar e gerenciar pacotes"] },
    { numero: 8, titulo: "Projeto e revisão do Mês 4", duracao: 30, objetivo: "Consolidar redes e sistemas com um projeto prático de diagnóstico de rede.", objetivos: ["Revisar a pilha TCP/IP, DNS e HTTP na prática", "Diagnosticar problemas comuns de conectividade"] },
  ],
  5: [
    { numero: 1, titulo: "Git avançado", duracao: 30, objetivo: "Ir além do básico de Git: branches, rebase e resolução de conflitos com confiança.", objetivos: ["Usar branches para organizar trabalho paralelo", "Entender rebase vs merge", "Resolver conflitos de merge com segurança"] },
    { numero: 2, titulo: "Testes automatizados", duracao: 30, objetivo: "Entender por que e como escrever testes automatizados para validar código continuamente.", objetivos: ["Diferenciar testes unitários, de integração e end-to-end", "Escrever testes unitários simples", "Entender TDD (desenvolvimento guiado por testes)"] },
    { numero: 3, titulo: "Código limpo", duracao: 25, objetivo: "Aprender princípios de código limpo para escrever software legível e fácil de manter.", objetivos: ["Nomear variáveis e funções com clareza", "Aplicar o princípio da responsabilidade única", "Reconhecer e evitar 'code smells' comuns"] },
    { numero: 4, titulo: "Arquitetura de software", duracao: 30, objetivo: "Entender padrões de arquitetura que organizam sistemas maiores de forma sustentável.", objetivos: ["Diferenciar camadas (apresentação, negócio, dados)", "Introduzir MVC e arquitetura em camadas", "Entender acoplamento e coesão"] },
    { numero: 5, titulo: "Bancos de dados (SQL e NoSQL)", duracao: 30, objetivo: "Entender os fundamentos de bancos relacionais e não-relacionais e quando usar cada um.", objetivos: ["Escrever consultas SQL básicas (SELECT, JOIN, WHERE)", "Entender normalização de dados", "Comparar bancos relacionais com NoSQL"] },
    { numero: 6, titulo: "Segurança básica", duracao: 25, objetivo: "Conhecer as vulnerabilidades mais comuns em aplicações web e como evitá-las.", objetivos: ["Reconhecer SQL Injection e XSS", "Entender boas práticas de autenticação e senhas", "Aplicar o princípio do menor privilégio"] },
    { numero: 7, titulo: "Projeto e revisão do Mês 5", duracao: 30, objetivo: "Consolidar práticas de engenharia de software com um projeto que aplica testes, arquitetura e banco de dados.", objetivos: ["Aplicar testes automatizados em um projeto pequeno", "Revisar princípios de código limpo e arquitetura"] },
  ],
  6: [
    { numero: 1, titulo: "Escolhendo o projeto final", duracao: 20, objetivo: "Definir o escopo de um projeto final que integre tudo o que foi estudado nos últimos 5 meses.", objetivos: ["Definir critérios para escolher um bom projeto final", "Escrever um mini-documento de escopo"] },
    { numero: 2, titulo: "Planejando a arquitetura do projeto", duracao: 25, objetivo: "Planejar a arquitetura técnica do projeto final antes de escrever código.", objetivos: ["Desenhar um diagrama simples de arquitetura", "Escolher tecnologias com justificativa"] },
    { numero: 3, titulo: "Construindo o projeto (parte 1)", duracao: 40, objetivo: "Implementar a primeira metade do projeto final aplicando boas práticas.", objetivos: ["Configurar o repositório e ambiente do projeto", "Implementar as funcionalidades essenciais (núcleo)"] },
    { numero: 4, titulo: "Construindo o projeto (parte 2)", duracao: 40, objetivo: "Finalizar a implementação do projeto final.", objetivos: ["Completar as funcionalidades restantes", "Refatorar aplicando código limpo"] },
    { numero: 5, titulo: "Testando e documentando", duracao: 25, objetivo: "Adicionar testes automatizados e documentação ao projeto final.", objetivos: ["Escrever testes para as partes críticas do projeto", "Escrever um README completo"] },
    { numero: 6, titulo: "Preparação para entrevistas técnicas", duracao: 30, objetivo: "Revisar os tópicos mais cobrados em entrevistas técnicas de programação.", objetivos: ["Revisar estruturas de dados e Big O", "Praticar explicar soluções em voz alta"] },
    { numero: 7, titulo: "Simulado de entrevista", duracao: 30, objetivo: "Simular uma entrevista técnica completa com perguntas de código e de sistema.", objetivos: ["Resolver um problema de código sob tempo", "Responder perguntas comportamentais comuns"] },
    { numero: 8, titulo: "Conclusão e próximos passos", duracao: 20, objetivo: "Encerrar o programa CodePath com um plano de continuidade de estudos.", objetivos: ["Revisar a jornada completa dos 6 meses", "Planejar os próximos passos de estudo e carreira"] },
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

for (const [mesStr, aulas] of Object.entries(manifesto)) {
  const mes = Number(mesStr);
  const dir = path.join(CONTENT_DIR, `mes-${mes}`);
  fs.mkdirSync(dir, { recursive: true });

  for (const aula of aulas) {
    const numeroFmt = String(aula.numero).padStart(2, "0");
    const fileName = `aula-${numeroFmt}-${slugify(aula.titulo)}.md`;
    const filePath = path.join(dir, fileName);
    if (fs.existsSync(filePath)) continue;

    const objetivosMd = aula.objetivos.map((o) => `- ${o}`).join("\n");
    const conteudo = `---
id: "m${mes}-a${aula.numero}"
mes: ${mes}
numero: ${aula.numero}
titulo: "${aula.titulo.replace(/"/g, '\\"')}"
objetivo: "${aula.objetivo.replace(/"/g, '\\"')}"
duracao: ${aula.duracao}
status: "em-breve"
---

## O que você vai aprender

${objetivosMd}

Esta aula ainda está sendo escrita. Quando publicada, vai seguir o mesmo formato das aulas
completas: explicação com analogias, exemplos práticos, exercícios comentados e um quiz de
fixação.
`;
    fs.writeFileSync(filePath, conteudo, "utf-8");
    console.log("Criado:", path.relative(process.cwd(), filePath));
  }
}
