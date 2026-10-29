"use client";

import dynamic from "next/dynamic";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo, useRef } from "react";
import { Exercicio, QuizPergunta, SecaoConteudo } from "@/lib/types";
import { VIDAS_POR_LICAO, montarCards } from "@/lib/licao";
import ZyreSvg from "./ZyreSvg";
import { precarregarZyre3D } from "./ZyreMascote";
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
  precarregarZyre3D();
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cards = useMemo(() => montarCards(secoes, quiz, exercicios), [secoes, quiz, exercicios]);
  const abriuPeloBotao = useRef(false);

  if (cards.length === 0) return null;

  // O modo lição fica na URL (?licao=1): o mapa abre direto nele e o "voltar" do
  // navegador fecha a lição
  const aberto = searchParams.get("licao") === "1";

  const abrir = () => {
    abriuPeloBotao.current = true;
    window.history.pushState(null, "", `${pathname}?licao=1`);
  };

  const fechar = () => {
    if (abriuPeloBotao.current) {
      abriuPeloBotao.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, "", pathname);
    }
  };

  const conceitos = cards.filter((c) => c.tipo === "conceito").length;
  const perguntas = cards.filter((c) => c.tipo === "pergunta").length;

  return (
    <>
      <div className="licao-cta mb-4">
        <span className="licao-cta-zyre">
          <ZyreSvg />
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
          onClick={abrir}
          onPointerEnter={precarregar}
          onFocus={precarregar}
        >
          <i className="bi bi-play-fill me-1" />
          Começar lição
        </button>
      </div>

      {aberto && (
        <ModoLicao
          slug={slug}
          titulo={titulo}
          cards={cards}
          proxima={proxima}
          onFechar={fechar}
        />
      )}
    </>
  );
}
