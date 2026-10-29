"use client";

import { useEffect, useEffectEvent } from "react";
import { Celebracao, dispensar, useCelebracoes } from "@/lib/celebracoes";
import { useProgress } from "@/lib/progress-context";
import { tocarSom } from "@/lib/sons";
import { dispararConfete } from "@/lib/confete";
import ZyreSvg from "./ZyreSvg";

const DURACAO_MS = 5200;

function Conteudo({ celebracao, streak }: { celebracao: Celebracao; streak: number }) {
  if (celebracao.tipo === "meta") {
    return (
      <>
        <div className="celebracao-titulo">Meta do dia batida!</div>
        <div className="celebracao-texto">
          {celebracao.xpHoje} XP hoje (meta de {celebracao.meta}) · sequência de {streak}{" "}
          {streak === 1 ? "dia" : "dias"}
        </div>
      </>
    );
  }
  return null;
}

export default function Celebracoes() {
  const fila = useCelebracoes();
  const { som, streak } = useProgress();
  const atual = fila[0];

  const anunciar = useEffectEvent((celebracao: Celebracao) => {
    if (som) tocarSom(celebracao.tipo);
    dispararConfete({ x: 0.5, y: 0.08, quantidade: 50, angulo: Math.PI / 2, abertura: Math.PI * 1.3, forca: 0.5 });
  });

  useEffect(() => {
    if (!atual) return;
    anunciar(atual);
    const timer = window.setTimeout(() => dispensar(atual.id), DURACAO_MS);
    return () => window.clearTimeout(timer);
  }, [atual]);

  return (
    <div className="celebracao-area" aria-live="polite">
      {atual && (
        <div key={atual.id} className={`celebracao celebracao-${atual.tipo}`} role="status">
          <span className="celebracao-zyre">
            <ZyreSvg estado="comemorando" />
          </span>
          <div className="flex-grow-1 min-w-0">
            <Conteudo celebracao={atual} streak={streak} />
          </div>
          <button
            type="button"
            className="btn-close btn-close-white flex-shrink-0"
            aria-label="Fechar aviso"
            onClick={() => dispensar(atual.id)}
          />
        </div>
      )}
    </div>
  );
}
