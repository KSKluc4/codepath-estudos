"use client";

import { KeyboardEvent, PointerEvent, useState } from "react";
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

export function CardLacuna({
  item,
  estado,
  onSelecionar,
}: {
  item: ItemFila;
  estado: EstadoLicao;
  onSelecionar: (posicao: number) => void;
}) {
  if (item.card.tipo !== "lacuna") return null;
  const { exercicio } = item.card;
  const respondida = estado.fase === "feedback";
  const escolhida = estado.selecionada === null ? null : exercicio.opcoes[item.ordemOpcoes[estado.selecionada]];

  let preenchimento = escolhida ?? "\u00a0".repeat(6);
  let classeLacuna = escolhida ? "licao-lacuna-escolhida" : "";
  if (respondida) {
    preenchimento = exercicio.opcoes[exercicio.correta];
    classeLacuna = estado.acertou ? "licao-lacuna-certa" : "licao-lacuna-corrigida";
  }

  return (
    <>
      <div className="licao-card-rotulo">
        <i className={`bi ${item.repeticao ? "bi-arrow-repeat" : "bi-input-cursor-text"}`} />
        {item.repeticao ? "Revisão" : "Complete a lacuna"}
      </div>
      <h2 className="licao-card-titulo">Qual opção completa o código?</h2>
      <pre className="licao-codigo">
        <code>
          {exercicio.linhas.map((linha, i) =>
            i === exercicio.linha ? (
              <span key={i}>
                {linha.slice(0, exercicio.inicio)}
                <span className={`licao-lacuna ${classeLacuna}`}>
                  {preenchimento}
                  <span className="visually-hidden">{escolhida || respondida ? "" : "(lacuna)"}</span>
                </span>
                {linha.slice(exercicio.fim)}
                {"\n"}
              </span>
            ) : (
              <span key={i}>
                {linha}
                {"\n"}
              </span>
            )
          )}
        </code>
      </pre>
      <div className="licao-opcoes licao-opcoes-codigo">
        {item.ordemOpcoes.map((original, posicao) => {
          const correta = original === exercicio.correta;
          const selecionada = estado.selecionada === posicao;
          let classe = selecionada ? "licao-opcao-selecionada" : "";
          if (respondida && correta) classe = "licao-opcao-certa";
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
              <code className="licao-opcao-texto">{exercicio.opcoes[original]}</code>
            </button>
          );
        })}
      </div>
    </>
  );
}

function LinhaMontada({
  texto,
  posicao,
  total,
  bloqueada,
  onRetirar,
  onMover,
}: {
  texto: string;
  posicao: number;
  total: number;
  bloqueada: boolean;
  onRetirar: (posicao: number) => void;
  onMover: (de: number, para: number) => void;
}) {
  const [arrasto, setArrasto] = useState<{ inicio: number; deslocamento: number } | null>(null);

  // Arrastar com mouse ou dedo (pointer events): solta perto de outra linha para trocar de
  // lugar; um toque sem arrastar devolve a linha para o banco
  const aoApertar = (e: PointerEvent<HTMLButtonElement>) => {
    if (bloqueada || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setArrasto({ inicio: e.clientY, deslocamento: 0 });
  };
  const aoMover = (e: PointerEvent<HTMLButtonElement>) => {
    if (arrasto) setArrasto({ ...arrasto, deslocamento: e.clientY - arrasto.inicio });
  };
  const aoSoltar = (e: PointerEvent<HTMLButtonElement>) => {
    if (!arrasto) return;
    const { deslocamento } = arrasto;
    setArrasto(null);
    if (Math.abs(deslocamento) < 6) {
      onRetirar(posicao);
      return;
    }
    const altura = e.currentTarget.offsetHeight + 8;
    const destino = Math.min(total - 1, Math.max(0, posicao + Math.round(deslocamento / altura)));
    onMover(posicao, destino);
  };

  const aoTeclar = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (bloqueada) return;
    let destino: number | null = null;
    if (e.key === "ArrowUp") destino = posicao - 1;
    if (e.key === "ArrowDown") destino = posicao + 1;
    if (destino !== null) {
      e.preventDefault();
      e.stopPropagation();
      onMover(posicao, destino);
      const lista = e.currentTarget.closest("ol");
      const alvo = destino;
      requestAnimationFrame(() => lista?.children[alvo]?.querySelector("button")?.focus());
    } else if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      e.stopPropagation();
      onRetirar(posicao);
    }
  };

  return (
    <button
      type="button"
      className={`licao-linha licao-linha-montada ${arrasto ? "licao-linha-arrastando" : ""}`}
      style={arrasto ? { transform: `translateY(${arrasto.deslocamento}px)` } : undefined}
      disabled={bloqueada}
      aria-label={`Linha ${posicao + 1}: ${texto.trim()}. Setas movem, Delete devolve.`}
      onPointerDown={aoApertar}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      onPointerCancel={() => setArrasto(null)}
      onKeyDown={aoTeclar}
      onClick={(e) => {
        // Clique vindo do teclado (Enter/Espaço) devolve a linha; o do mouse já foi tratado
        if (e.detail === 0) onRetirar(posicao);
      }}
    >
      <i className="bi bi-grip-vertical licao-linha-alca" aria-hidden="true" />
      <code>{texto}</code>
    </button>
  );
}

export function CardMontar({
  item,
  estado,
  banco,
  onColocar,
  onRetirar,
  onMover,
}: {
  item: ItemFila;
  estado: EstadoLicao;
  banco: number[];
  onColocar: (linha: number) => void;
  onRetirar: (posicao: number) => void;
  onMover: (de: number, para: number) => void;
}) {
  if (item.card.tipo !== "montar") return null;
  const { exercicio } = item.card;
  const respondida = estado.fase === "feedback";
  const vagas = exercicio.linhas.length - estado.resposta.length;
  let classeMontagem = "licao-montagem";
  if (respondida) classeMontagem += estado.acertou ? " licao-montagem-certa" : " licao-montagem-errada";

  return (
    <>
      <div className="licao-card-rotulo">
        <i className={`bi ${item.repeticao ? "bi-arrow-repeat" : "bi-list-ol"}`} />
        {item.repeticao ? "Revisão" : "Monte o código"}
      </div>
      <h2 className="licao-card-titulo">Coloque as linhas na ordem certa</h2>
      <ol className={classeMontagem} aria-label="Sua resposta">
        {estado.resposta.map((linha, posicao) => (
          <li key={linha}>
            <LinhaMontada
              texto={exercicio.linhas[linha]}
              posicao={posicao}
              total={estado.resposta.length}
              bloqueada={respondida}
              onRetirar={onRetirar}
              onMover={onMover}
            />
          </li>
        ))}
        {Array.from({ length: vagas }, (_, i) => (
          <li key={`vaga-${i}`} className="licao-vaga" aria-hidden="true" />
        ))}
      </ol>
      {banco.length > 0 && (
        <div className="licao-banco" role="group" aria-label="Linhas para colocar">
          {banco.map((linha, n) => (
            <button
              key={linha}
              type="button"
              className="licao-linha"
              disabled={respondida}
              onClick={() => onColocar(linha)}
            >
              <kbd className="licao-opcao-tecla">{n + 1}</kbd>
              <code>{exercicio.linhas[linha]}</code>
            </button>
          ))}
        </div>
      )}
      {respondida && !estado.acertou && (
        <div className="licao-solucao">
          <div className="licao-card-rotulo">
            <i className="bi bi-check2-all" />
            Ordem certa
          </div>
          <pre className="licao-codigo">
            <code>{exercicio.linhas.join("\n")}</code>
          </pre>
        </div>
      )}
    </>
  );
}
