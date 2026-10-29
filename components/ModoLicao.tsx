"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useProgress } from "@/lib/progress-context";
import { setModoLicaoAberto } from "@/lib/modo-licao";
import { calcularNivel } from "@/lib/xp";
import { FALAS, sortearFala } from "@/lib/bit-falas";
import { BitEstado } from "@/lib/mascote";
import {
  CardLicao,
  EstadoLicao,
  ItemFila,
  VIDAS_POR_LICAO,
  XP_POR_ACERTO,
  continuar,
  iniciarLicao,
  itemAtual,
  multiplicadorCombo,
  precisao,
  revelarSolucao,
  selecionarOpcao,
  verificarResposta,
} from "@/lib/licao";
import CopyableHtml from "./CopyableHtml";
import BitSvg from "./BitSvg";

export interface ProximaEtapa {
  href: string;
  rotulo: string;
}

interface Fala {
  texto: string;
  id: number;
}

function falaDoCard(item: ItemFila | undefined): string {
  if (!item) return "";
  if (item.card.tipo === "pergunta") return sortearFala(item.repeticao ? FALAS.repeticao : FALAS.pergunta);
  if (item.card.tipo === "desafio") return sortearFala(FALAS.desafio);
  return Math.random() < 0.4 ? sortearFala(FALAS.conceito) : "";
}

function estadoDoBit(estado: EstadoLicao): BitEstado {
  if (estado.fase === "fim") return "comemorando";
  if (estado.fase === "sem-vidas") return "triste";
  if (estado.fase === "feedback") return estado.acertou ? "comemorando" : "triste";
  return itemAtual(estado)?.card.tipo === "pergunta" ? "olhando" : "idle";
}

function CardConceito({ card }: { card: Extract<CardLicao, { tipo: "conceito" }> }) {
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

function CardPergunta({
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

function CardDesafio({
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

export default function ModoLicao({
  slug,
  titulo,
  cards,
  estadoInicial,
  proxima,
  onFechar,
}: {
  slug: string;
  titulo: string;
  cards: CardLicao[];
  estadoInicial: EstadoLicao;
  proxima?: ProximaEtapa;
  onFechar: () => void;
}) {
  const { xp: xpTotal, marcarConcluida, adicionarXp } = useProgress();
  const [estado, setEstado] = useState(estadoInicial);
  const [tentativa, setTentativa] = useState(0);
  const [fala, setFala] = useState<Fala>({ texto: FALAS.inicio[0], id: 0 });
  const [confirmandoSaida, setConfirmandoSaida] = useState(false);
  const [nivelAlcancado, setNivelAlcancado] = useState<number | null>(null);
  const corpoRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const item = itemAtual(estado);
  const emAndamento = estado.fase === "card" || estado.fase === "feedback";

  useEffect(() => {
    setModoLicaoAberto(true);
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      setModoLicaoAberto(false);
      document.body.style.overflow = overflowAnterior;
    };
  }, []);

  useEffect(() => {
    corpoRef.current?.scrollTo({ top: 0 });
    cardRef.current?.focus({ preventScroll: true });
  }, [estado.posicao, tentativa]);

  const falar = (texto: string) => setFala((atual) => ({ texto, id: atual.id + 1 }));

  const aoSelecionar = (posicao: number) => setEstado(selecionarOpcao(estado, posicao));

  const aoVerificar = () => {
    const proximo = verificarResposta(estado);
    if (proximo === estado) return;
    setEstado(proximo);
    if (proximo.acertou) {
      falar(proximo.combo >= 3 ? sortearFala(FALAS.combo, proximo.combo) : sortearFala(FALAS.acerto));
    } else {
      falar(sortearFala(proximo.vidas === 1 ? FALAS.ultimaVida : FALAS.erro));
    }
  };

  const aoContinuar = () => {
    const proximo = continuar(estado, Math.random);
    if (proximo === estado) return;
    setEstado(proximo);
    if (proximo.fase === "fim") {
      const nivelAntes = calcularNivel(xpTotal).nivel;
      const nivelDepois = calcularNivel(xpTotal + proximo.xp).nivel;
      setNivelAlcancado(nivelDepois > nivelAntes ? nivelDepois : null);
      marcarConcluida(slug);
      adicionarXp(proximo.xp);
      falar(sortearFala(FALAS.fim));
    } else if (proximo.fase === "sem-vidas") {
      falar(sortearFala(FALAS.semVidas));
    } else {
      falar(falaDoCard(itemAtual(proximo)));
    }
  };

  const tentarDeNovo = () => {
    setEstado(iniciarLicao(cards, Math.random));
    setTentativa((t) => t + 1);
    falar(sortearFala(FALAS.inicio));
  };

  const pedirSaida = () => {
    const temProgresso = estado.posicao > 0 || estado.fase === "feedback";
    if (emAndamento && temProgresso) setConfirmandoSaida(true);
    else onFechar();
  };

  const acaoPrincipal = () => {
    if (estado.fase === "feedback" || item?.card.tipo !== "pergunta") aoContinuar();
    else aoVerificar();
  };

  const aoTeclar = useEffectEvent((e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "Escape") {
      e.preventDefault();
      if (confirmandoSaida) setConfirmandoSaida(false);
      else pedirSaida();
      return;
    }
    if (confirmandoSaida || !emAndamento) return;

    const alvo = e.target as HTMLElement;
    if (alvo.closest("input, textarea, select, a")) return;
    if (/^[1-9]$/.test(e.key)) {
      aoSelecionar(Number(e.key) - 1);
      return;
    }
    // Enter em outros botões (ex.: "Ver solução") mantém o clique nativo
    const botao = alvo.closest("button");
    if (e.key === "Enter" && (!botao || botao.matches("[data-opcao], [data-acao-principal]"))) {
      e.preventDefault();
      acaoPrincipal();
    }
  });

  useEffect(() => {
    const ouvinte = (e: KeyboardEvent) => aoTeclar(e);
    window.addEventListener("keydown", ouvinte);
    return () => window.removeEventListener("keydown", ouvinte);
  }, []);

  const progresso = Math.round((estado.concluidos / Math.max(estado.total, 1)) * 100);
  const multiplicador = multiplicadorCombo(estado.combo);
  const pergunta = item?.card.tipo === "pergunta" ? item.card.pergunta : null;
  const opcaoCorreta = pergunta?.opcoes.find((o) => o.correta);
  const nivel = calcularNivel(xpTotal);
  const taxaAcerto = precisao(estado);

  let classeCard = `licao-card licao-card-${item?.card.tipo ?? "fim"}`;
  if (estado.fase === "feedback") classeCard += estado.acertou ? " licao-card-certo" : " licao-card-errado";

  let rotuloAcao = "Continuar";
  if (estado.fase === "card" && item?.card.tipo === "pergunta") rotuloAcao = "Verificar";
  if (estado.fase === "card" && item?.card.tipo === "desafio" && !estado.solucaoVisivel) rotuloAcao = "Pular desafio";

  let classeRodape = "licao-rodape";
  if (estado.fase === "feedback") classeRodape += estado.acertou ? " licao-rodape-certo" : " licao-rodape-errado";

  return createPortal(
    <div className="licao-overlay" role="dialog" aria-modal="true" aria-label={`Lição: ${titulo}`}>
      <header className="licao-topo">
        <button type="button" className="licao-btn-icone" onClick={pedirSaida} aria-label="Sair da lição">
          <i className="bi bi-x-lg" />
        </button>
        <div
          className="licao-progresso"
          role="progressbar"
          aria-label="Progresso da lição"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progresso}
        >
          <div className="licao-progresso-barra" style={{ width: `${progresso}%` }} />
        </div>
        <div className="licao-xp" title="XP ganho nesta lição">
          <i className="bi bi-lightning-charge-fill" />
          {estado.xp}
        </div>
        <div className="licao-vidas" aria-label={`${estado.vidas} de ${VIDAS_POR_LICAO} vidas`}>
          {Array.from({ length: VIDAS_POR_LICAO }, (_, i) => (
            <i key={i} className={`bi ${i < estado.vidas ? "bi-heart-fill" : "bi-heart licao-vida-perdida"}`} />
          ))}
        </div>
      </header>

      <div className="licao-corpo" ref={corpoRef}>
        <div className={`licao-palco ${emAndamento ? "" : "licao-palco-resultado"}`}>
          <div className="licao-principal">
            {emAndamento && estado.combo >= 2 && (
              <div className="licao-combo" key={estado.combo}>
                <i className="bi bi-fire" />
                {estado.combo} seguidas
                {multiplicador > 1 && <strong>×{multiplicador}</strong>}
              </div>
            )}

            {emAndamento && item && (
              <div key={`${tentativa}-${estado.posicao}`} ref={cardRef} tabIndex={-1} className={classeCard}>
                {item.card.tipo === "conceito" && <CardConceito card={item.card} />}
                {item.card.tipo === "pergunta" && (
                  <CardPergunta item={item} estado={estado} onSelecionar={aoSelecionar} />
                )}
                {item.card.tipo === "desafio" && (
                  <CardDesafio
                    card={item.card}
                    solucaoVisivel={estado.solucaoVisivel}
                    onRevelar={() => setEstado(revelarSolucao(estado))}
                  />
                )}
              </div>
            )}

            {estado.fase === "fim" && (
              <div className="licao-resultado">
                <h2 className="licao-resultado-titulo text-gradient">Lição concluída!</h2>
                <p className="text-body-secondary mb-4">{titulo}</p>
                <div className="licao-stats">
                  <div className="licao-stat licao-stat-xp">
                    <span className="licao-stat-rotulo">XP ganho</span>
                    <strong>+{estado.xp}</strong>
                  </div>
                  <div className="licao-stat">
                    <span className="licao-stat-rotulo">Precisão</span>
                    <strong>{taxaAcerto === null ? "—" : `${taxaAcerto}%`}</strong>
                  </div>
                  <div className="licao-stat">
                    <span className="licao-stat-rotulo">Combo máximo</span>
                    <strong>{estado.comboMax}</strong>
                  </div>
                </div>
                {nivelAlcancado && (
                  <div className="licao-nivel-up">
                    <i className="bi bi-stars" />
                    Você subiu para o nível {nivelAlcancado}!
                  </div>
                )}
                <div className="licao-nivel">
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="fw-semibold">Nível {nivel.nivel}</span>
                    <span className="text-body-secondary">
                      {Math.min(nivel.xpNoNivel, nivel.xpParaProximo)}/{nivel.xpParaProximo} XP
                    </span>
                  </div>
                  <div className="licao-progresso">
                    <div
                      className="licao-progresso-barra"
                      style={{ width: `${Math.min(100, (nivel.xpNoNivel / nivel.xpParaProximo) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
                  <button type="button" className="btn btn-outline-secondary btn-lg" onClick={onFechar}>
                    Voltar para o conteúdo
                  </button>
                  {proxima && (
                    <Link href={proxima.href} className="btn btn-licao btn-lg" onClick={onFechar}>
                      {proxima.rotulo}
                      <i className="bi bi-arrow-right ms-2" />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {estado.fase === "sem-vidas" && (
              <div className="licao-resultado">
                <i className="bi bi-heartbreak-fill licao-resultado-icone" />
                <h2 className="licao-resultado-titulo">Acabaram as vidas</h2>
                <p className="text-body-secondary">
                  Nada do seu progresso geral foi perdido. Na próxima tentativa as perguntas vêm em outra
                  ordem — e agora você já viu as explicações.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
                  <button type="button" className="btn btn-outline-secondary btn-lg" onClick={onFechar}>
                    Voltar para o conteúdo
                  </button>
                  <button type="button" className="btn btn-licao btn-lg" onClick={tentarDeNovo}>
                    <i className="bi bi-arrow-counterclockwise me-2" />
                    Tentar de novo
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="licao-bit" aria-live="polite">
            {fala.texto && (
              <div key={fala.id} className="licao-balao">
                {fala.texto}
              </div>
            )}
            <div className="licao-bit-figura">
              <BitSvg estado={estadoDoBit(estado)} />
            </div>
          </aside>
        </div>
      </div>

      {emAndamento && (
        <footer className={classeRodape}>
          <div className="licao-rodape-conteudo">
            <div className="licao-feedback" role="status">
              {estado.fase === "feedback" && pergunta && (
                <>
                  <div className="licao-feedback-titulo">
                    <i className={`bi ${estado.acertou ? "bi-check-circle-fill" : "bi-x-circle-fill"}`} />
                    {estado.acertou ? "Correto!" : "Não foi dessa vez"}
                    {estado.acertou && (
                      <span className="licao-xp-ganho">+{XP_POR_ACERTO * multiplicador} XP</span>
                    )}
                  </div>
                  {!estado.acertou && opcaoCorreta && (
                    <div className="licao-feedback-resposta">
                      Resposta certa: <span dangerouslySetInnerHTML={{ __html: opcaoCorreta.html }} />
                    </div>
                  )}
                  {pergunta.explicacaoHtml && (
                    <div
                      className="licao-feedback-explicacao"
                      dangerouslySetInnerHTML={{ __html: pergunta.explicacaoHtml }}
                    />
                  )}
                </>
              )}
              {estado.fase === "card" && item?.card.tipo === "pergunta" && (
                <span className="licao-dica">
                  Atalhos: <kbd>1</kbd>–<kbd>{item.ordemOpcoes.length}</kbd> escolhem, <kbd>Enter</kbd> verifica
                </span>
              )}
            </div>
            <div className="licao-rodape-acoes">
              <button
                type="button"
                className={`btn btn-lg ${estado.fase === "feedback" && !estado.acertou ? "btn-licao-errado" : "btn-licao"}`}
                data-acao-principal
                disabled={estado.fase === "card" && item?.card.tipo === "pergunta" && estado.selecionada === null}
                onClick={acaoPrincipal}
              >
                {rotuloAcao}
              </button>
            </div>
          </div>
        </footer>
      )}

      {confirmandoSaida && (
        <div className="licao-confirmar" role="alertdialog" aria-modal="true" aria-labelledby="licao-confirmar-titulo">
          <div className="licao-confirmar-caixa">
            <h2 id="licao-confirmar-titulo" className="h5 fw-bold">
              Sair da lição?
            </h2>
            <p className="text-body-secondary">O XP desta lição só é salvo quando você chega ao fim.</p>
            <div className="d-flex flex-wrap justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={onFechar}>
                Sair
              </button>
              <button type="button" className="btn btn-licao" autoFocus onClick={() => setConfirmandoSaida(false)}>
                Continuar estudando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
