"use client";

import { useSyncExternalStore } from "react";

let aberto = false;
const listeners = new Set<() => void>();

export function setModoLicaoAberto(valor: boolean) {
  aberto = valor;
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function useModoLicaoAberto(): boolean {
  return useSyncExternalStore(subscribe, () => aberto, () => false);
}
