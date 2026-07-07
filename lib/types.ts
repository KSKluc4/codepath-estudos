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
  duvidaHtml: string;
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

export type Nivel = "basico" | "intermediario" | "avancado";

export interface ChapterFrontmatter {
  numero: number;
  titulo: string;
  nivel: Nivel;
  objetivo: string;
  duracao?: number;
  status: LessonStatus;
}

export interface Chapter extends ChapterFrontmatter {
  trilha: string;
  capitulo: string;
  slug: string;
  introHtml: string;
  exercicios: Exercicio[];
  quiz: QuizPergunta[];
  duvidaHtml: string;
}

export interface ChapterSummary extends ChapterFrontmatter {
  trilha: string;
  capitulo: string;
  slug: string;
  temExercicios: boolean;
  temQuiz: boolean;
}

export interface TrackMeta {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
}
