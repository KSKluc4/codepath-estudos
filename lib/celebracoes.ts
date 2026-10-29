"use client";

import { useSyncExternalStore } from "react";

export type Celebracao =
  | { id: number; tipo: "meta"; xpHoje: number; meta: number }
  | { id: number; tipo: "conquista"; conquistaId: string };

// Omit distribuído pela união: cada tipo de celebração perde só o id
type SemId<T> = T extends unknown ? Omit<T, "id"> : never;

const VAZIA: Celebracao[] = [];
let fila: Celebracao[] = VAZIA;
let proximoId = 1;
const listeners = new Set<() => void>();

function avisar() {
  listeners.forEach((listener) => listener());
}

export function celebrar(celebracao: SemId<Celebracao>) {
  fila = [...fila, { ...celebracao, id: proximoId++ } as Celebracao];
  avisar();
}

export function dispensar(id: number) {
  fila = fila.filter((c) => c.id !== id);
  avisar();
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function useCelebracoes(): Celebracao[] {
  return useSyncExternalStore(subscribe, () => fila, () => VAZIA);
}
