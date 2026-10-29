"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Exercicio, QuizPergunta, SecaoConteudo } from "@/lib/types";
import { EstadoLicao, VIDAS_POR_LICAO, iniciarLicao, montarCards } from "@/lib/licao";
import BitSvg from "./BitSvg";
import { precarregarBit3D } from "./BitMascote";
import type { ProximaEtapa } from "./ModoLicao";

const ModoLicao = dynamic(() => import("./ModoLicao"), {
  ssr: false,
  loading: () => (
    <div className="licao-overlay licao-carregando">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Carregando lição...</span>
      </div>
    </div>
  ),
});

function precarregar() {
  void import("./ModoLicao");
  precarregarBit3D();
}

export default function ComecarLicao({
  slug,
  titulo,
  secoes,
  quiz,
  exercicios,
  proxima,
}: {
  slug: string;
  titulo: string;
  secoes: SecaoConteudo[];
  quiz: QuizPergunta[];
  exercicios: Exercicio[];
  proxima?: ProximaEtapa;
}) {
  const cards = useMemo(() => montarCards(secoes, quiz, exercicios), [secoes, quiz, exercicios]);
  const [estadoInicial, setEstadoInicial] = useState<EstadoLicao | null>(null);

  if (cards.length === 0) return null;

  const conceitos = cards.filter((c) => c.tipo === "conceito").length;
  const perguntas = cards.filter((c) => c.tipo === "pergunta").length;

  return (
    <>
      <div className="licao-cta mb-4">
        <span className="licao-cta-bit">
          <BitSvg />
        </span>
        <div className="flex-grow-1 min-w-0">
          <div className="fw-bold">Estude no modo lição</div>
          <div className="small text-body-secondary">
            {conceitos} cards curtos · {perguntas} {perguntas === 1 ? "pergunta" : "perguntas"} ·{" "}
            {VIDAS_POR_LICAO} vidas
          </div>
        </div>
        <button
          type="button"
          className="btn btn-licao btn-lg"
          onClick={() => setEstadoInicial(iniciarLicao(cards, Math.random))}
          onPointerEnter={precarregar}
          onFocus={precarregar}
        >
          <i className="bi bi-play-fill me-1" />
          Começar lição
        </button>
      </div>

      {estadoInicial && (
        <ModoLicao
          slug={slug}
          titulo={titulo}
          cards={cards}
          estadoInicial={estadoInicial}
          proxima={proxima}
          onFechar={() => setEstadoInicial(null)}
        />
      )}
    </>
  );
}
