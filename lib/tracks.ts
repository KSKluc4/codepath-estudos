import { TrackMeta } from "./types";

export const TRILHAS: TrackMeta[] = [
  {
    id: "python",
    nome: "Python",
    descricao:
      "Referência prática de Python: sintaxe, estruturas de dados, orientação a objetos e o ferramental do dia a dia.",
    icone: "bi-filetype-py",
    cor: "#4B8BBE",
  },
  {
    id: "javascript",
    nome: "JavaScript/TypeScript",
    descricao:
      "Do básico do navegador até tipos estáticos com TypeScript: a linguagem que roda em qualquer lugar.",
    icone: "bi-filetype-js",
    cor: "#F0DB4F",
  },
  {
    id: "c",
    nome: "C",
    descricao:
      "Referência de C para consultar quando precisar relembrar sintaxe, ponteiros ou gerenciamento de memória.",
    icone: "bi-c-circle-fill",
    cor: "#A78BFA",
  },
  {
    id: "cpp",
    nome: "C++",
    descricao:
      "C com orientação a objetos, templates e a STL: referência para quando C não é mais suficiente.",
    icone: "bi-plus-square-fill",
    cor: "#00599C",
  },
  {
    id: "csharp",
    nome: "C#",
    descricao:
      "Sintaxe, orientação a objetos, coleções e async/await no ecossistema .NET.",
    icone: "bi-filetype-cs",
    cor: "#9B4F96",
  },
  {
    id: "sql",
    nome: "SQL",
    descricao: "Consultas, joins e modelagem de bancos relacionais, direto ao ponto.",
    icone: "bi-filetype-sql",
    cor: "#34D399",
  },
  {
    id: "bash",
    nome: "Bash",
    descricao: "Comandos, scripts e automação de terminal para o dia a dia no Linux/macOS.",
    icone: "bi-terminal-fill",
    cor: "#FB923C",
  },
];

export function getTrackMeta(id: string): TrackMeta | undefined {
  return TRILHAS.find((t) => t.id === id);
}
