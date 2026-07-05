import { MesMeta } from "./types";

export const MESES: MesMeta[] = [
  {
    mes: 1,
    nome: "Julho",
    titulo: "A Máquina",
    descricao:
      "Antes de escrever qualquer linha de código, entenda o que de fato acontece dentro de um computador: eletricidade, binário, lógica e o sistema operacional.",
    topicos: [
      "Binário",
      "Lógica booleana",
      "Portas lógicas",
      "CPU",
      "RAM vs disco",
      "Terminal/Bash",
      "Sistema operacional",
    ],
  },
  {
    mes: 2,
    nome: "Agosto",
    titulo: "Linguagem e Memória",
    descricao:
      "Mergulhe em C para entender memória de verdade: ponteiros, stack, heap e como o código vira um programa executável.",
    topicos: ["C", "Ponteiros", "Stack vs heap", "malloc", "Compilador"],
  },
  {
    mes: 3,
    nome: "Setembro",
    titulo: "Estruturas de Dados e Algoritmos",
    descricao:
      "As ferramentas que todo bom programador usa para resolver problemas com eficiência — e que caem em qualquer entrevista técnica.",
    topicos: [
      "Big O",
      "Arrays",
      "Listas ligadas",
      "Hash tables",
      "Árvores",
      "Grafos",
      "Padrões de entrevista",
    ],
  },
  {
    mes: 4,
    nome: "Outubro",
    titulo: "Sistemas e Redes",
    descricao:
      "Como computadores conversam entre si e como o sistema operacional gerencia tudo o que roda dentro dele.",
    topicos: ["TCP/IP", "DNS", "HTTP", "Processos", "Threads", "Linux"],
  },
  {
    mes: 5,
    nome: "Novembro",
    titulo: "Software de Verdade",
    descricao:
      "As práticas que separam código de estudante de código profissional: versionamento, testes, arquitetura e segurança.",
    topicos: [
      "Git avançado",
      "Testes",
      "Código limpo",
      "Arquitetura",
      "Bancos de dados",
      "Segurança",
    ],
  },
  {
    mes: 6,
    nome: "Dezembro",
    titulo: "Integração",
    descricao:
      "Junte tudo o que você aprendeu em um projeto final robusto e prepare-se para entrevistas técnicas.",
    topicos: ["Projeto final", "Preparação para entrevistas"],
  },
];

export function getMesMeta(mes: number): MesMeta | undefined {
  return MESES.find((m) => m.mes === mes);
}
