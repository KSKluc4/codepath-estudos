import { Nivel } from "./types";

export const NIVEL_LABELS: Record<Nivel, string> = {
  basico: "Básico",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export const NIVEL_ORDEM: Nivel[] = ["basico", "intermediario", "avancado"];
