"use client";

import { CardLicao, EstadoLicao, ItemFila } from "@/lib/licao";
import CopyableHtml from "./CopyableHtml";

export function CardConceito({ card }: { card: Extract<CardLicao, { tipo: "conceito" }> }) {
  return (
    <>
      <div className="licao-card-rotulo">
        <i className="bi bi-book" />
        Conceito
        {card.totalPartes > 1 && (
          <span className="licao-card-parte">
            {card.parte}/{card.totalPartes}
          </span>
        )}
      </div>
      {card.titulo && <h2 className="licao-card-titulo">{card.titulo}</h2>}
      <CopyableHtml html={card.html} className="lesson-content licao-conteudo" />
    </>
  );
}

export function CardPergunta({
  item,
  estado,
  onSelecionar,
}: {
  item: ItemFila;
  estado: EstadoLicao;
  onSelecionar: (posicao: number) => void;
}) {
  if (item.card.tipo !== "pergunta") return null;
  const { pergunta } = item.card;
  const respondida = estado.fase === "feedback";

  return (
    <>
      <div className="licao-card-rotulo">
        <i className={`bi ${item.repeticao ? "bi-arrow-repeat" : "bi-patch-question"}`} />
        {item.repeticao ? "Revisão" : "Pergunta"}
      </div>
      <h2 className="licao-card-titulo" dangerouslySetInnerHTML={{ __html: pergunta.perguntaHtml }} />
      <div className="licao-opcoes">
        {item.ordemOpcoes.map((original, posicao) => {
          const opcao = pergunta.opcoes[original];
          const selecionada = estado.selecionada === posicao;
          let classe = selecionada ? "licao-opcao-selecionada" : "";
          if (respondida && opcao.correta) classe = "licao-opcao-certa";
          else if (respondida && selecionada) classe = "licao-opcao-errada";
          else if (respondida) classe = "licao-opcao-apagada";
          return (
            <button
              key={original}
              type="button"
              className={`licao-opcao ${classe}`}
              data-opcao
              aria-pressed={selecionada}
              disabled={respondida}
              onClick={() => onSelecionar(posicao)}
            >
              <kbd className="licao-opcao-tecla">{posicao + 1}</kbd>
              <span className="licao-opcao-texto" dangerouslySetInnerHTML={{ __html: opcao.html }} />
              {respondida && opcao.correta && <i className="bi bi-check-circle-fill ms-auto" />}
              {respondida && selecionada && !opcao.correta && <i className="bi bi-x-circle-fill ms-auto" />}
            </button>
          );
        })}
      </div>
    </>
  );
}

export function CardDesafio({
  card,
  solucaoVisivel,
  onRevelar,
}: {
  card: Extract<CardLicao, { tipo: "desafio" }>;
  solucaoVisivel: boolean;
  onRevelar: () => void;
}) {
  return (
    <>
      <div className="licao-card-rotulo licao-card-rotulo-desafio">
        <i className="bi bi-braces-asterisk" />
        Desafio opcional
      </div>
      <h2 className="licao-card-titulo">{card.exercicio.titulo}</h2>
      <CopyableHtml html={card.exercicio.enunciadoHtml} className="lesson-content licao-conteudo" />
      {solucaoVisivel ? (
        <div className="licao-solucao">
          <div className="licao-card-rotulo">
            <i className="bi bi-lightbulb" />
            Solução comentada
          </div>
          <CopyableHtml html={card.exercicio.solucaoHtml} className="lesson-content licao-conteudo" />
        </div>
      ) : (
        <div className="d-flex flex-wrap align-items-center gap-3 mt-3">
          <button type="button" className="btn btn-outline-primary" onClick={onRevelar}>
            <i className="bi bi-eye me-1" />
            Ver solução
          </button>
          <span className="small text-body-secondary">Não vale vida: tente resolver antes de abrir.</span>
        </div>
      )}
    </>
  );
}
