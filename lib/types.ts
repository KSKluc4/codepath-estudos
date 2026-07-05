export type LessonStatus = "completo" | "em-breve";

export interface QuizOpcao {
  html: string;
  correta: boolean;
}

export interface QuizPergunta {
  perguntaHtml: string;
  opcoes: QuizOpcao[];
  explicacaoHtml: string;
}

export interface Exercicio {
  titulo: string;
  enunciadoHtml: string;
  solucaoHtml: string;
}

export interface LessonFrontmatter {
  id: string;
  mes: number;
  numero: number;
  titulo: string;
  objetivo: string;
  duracao?: number;
  status: LessonStatus;
}

export interface Lesson extends LessonFrontmatter {
  slug: string;
  introHtml: string;
  exercicios: Exercicio[];
  quiz: QuizPergunta[];
}

export interface LessonSummary extends LessonFrontmatter {
  slug: string;
  temExercicios: boolean;
  temQuiz: boolean;
}

export interface MesMeta {
  mes: number;
  nome: string;
  titulo: string;
  descricao: string;
  topicos: string[];
}
