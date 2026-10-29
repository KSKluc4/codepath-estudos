"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useProgress } from "@/lib/progress-context";
import { useMediaQuery, useMovimentoReduzido } from "@/lib/useMediaQuery";
import { setModoLicaoAberto } from "@/lib/modo-licao";
import { calcularNivel } from "@/lib/xp";
import { FALAS, sortearFala } from "@/lib/zyre-falas";
import { Som, tocarSom } from "@/lib/sons";
import { dispararConfete } from "@/lib/confete";
import { ZyreEstado, MASCOTE_NOME } from "@/lib/mascote";
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
import ZyreMascote from "./ZyreMascote";
import { CardConceito, CardDesafio, CardPergunta } from "./LicaoCards";

export interface ProximaEtapa {
  href: string;
  rotulo: string;
}

interface Fala {
  texto: string;
  id: number;
}

interface Explicacao {
  status: "pensando" | "escrevendo" | "pronta";
  texto: string;
}

const MSG_SEM_EXPLICACAO = `O ${MASCOTE_NOME} não conseguiu responder agora. Leia a explicação aqui embaixo e siga em frente!`;

function falaDoCard(item: ItemFila | undefined): string {
  if (!item) return "";
  if (item.card.tipo === "pergunta") return sortearFala(item.repeticao ? FALAS.repeticao : FALAS.pergunta);
  if (item.card.tipo === "desafio") return sortearFala(FALAS.desafio);
  return Math.random() < 0.4 ? sortearFala(FALAS.conceito) : "";
}

function estadoDoZyre(estado: EstadoLicao, explicacao: Explicacao | null, falando: boolean): ZyreEstado {
  if (explicacao?.status === "pensando") return "pensando";
  if (explicacao?.status === "escrevendo") return "falando";
  if (estado.fase === "fim") return "comemorando";
  if (estado.fase === "sem-vidas") return "triste";
  if (estado.fase === "feedback") return estado.acertou ? "comemorando" : "triste";
  if (falando) return "falando";
  return itemAtual(estado)?.card.tipo === "pergunta" ? "olhando" : "idle";
}

export default function ModoLicao({
  slug,
  titulo,
  cards,
  proxima,
  onFechar,
}: {
  slug: string;
  titulo: string;
  cards: CardLicao[];
  proxima?: ProximaEtapa;
  onFechar: () => void;
}) {
  const pathname = usePathname();
  const { xp: xpTotal, marcarConcluida, adicionarXp, som, setSom, xpHoje, metaDiaria } = useProgress();
  const telaLarga = useMediaQuery("(min-width: 992px)");
  const movimentoReduzido = useMovimentoReduzido();
  const [estado, setEstado] = useState(() => iniciarLicao(cards, Math.random));
  const [tentativa, setTentativa] = useState(0);
  const [fala, setFala] = useState<Fala>({ texto: FALAS.inicio[0], id: 0 });
  const [falando, setFalando] = useState(true);
  const [reacao, setReacao] = useState(0);
  const [explicacao, setExplicacao] = useState<Explicacao | null>(null);
  const [confirmandoSaida, setConfirmandoSaida] = useState(false);
  const [nivelAlcancado, setNivelAlcancado] = useState<number | null>(null);
  const corpoRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const zyreRef = useRef<HTMLElement>(null);
  const pedidoRef = useRef<AbortController | null>(null);

  const item = itemAtual(estado);
  const emAndamento = estado.fase === "card" || estado.fase === "feedback";

  useEffect(() => {
    setModoLicaoAberto(true);
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      setModoLicaoAberto(false);
      document.body.style.overflow = overflowAnterior;
      pedidoRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!falando) return;
    const timer = window.setTimeout(() => setFalando(false), 1400);
    return () => window.clearTimeout(timer);
  }, [falando, fala.id]);

  useEffect(() => {
    corpoRef.current?.scrollTo({ top: 0 });
    cardRef.current?.focus({ preventScroll: true });
  }, [estado.posicao, tentativa]);

  const tocar = (efeito: Som) => {
    if (som) tocarSom(efeito);
  };

  const falar = (texto: string) => {
    setFala((atual) => ({ texto, id: atual.id + 1 }));
    setFalando(texto !== "");
  };

  const cancelarExplicacao = () => {
    pedidoRef.current?.abort();
    pedidoRef.current = null;
    setExplicacao(null);
  };

  const pedirExplicacao = async () => {
    if (item?.card.tipo !== "pergunta" || estado.selecionada === null || explicacao) return;
    const controle = new AbortController();
    pedidoRef.current = controle;
    setExplicacao({ status: "pensando", texto: "" });
    zyreRef.current?.scrollIntoView({ block: "nearest", behavior: movimentoReduzido ? "auto" : "smooth" });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pathname,
          perguntaIndex: item.card.indice,
          opcaoEscolhida: item.ordemOpcoes[estado.selecionada],
        }),
        signal: controle.signal,
      });
      if (!res.ok || !res.body) {
        const dados = await res.json().catch(() => null);
        setExplicacao({ status: "pronta", texto: res.status === 429 && dados?.erro ? dados.erro : MSG_SEM_EXPLICACAO });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let texto = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        texto += decoder.decode(value, { stream: true });
        setExplicacao({ status: "escrevendo", texto });
      }
      setExplicacao({ status: "pronta", texto: texto.trim() ? texto : MSG_SEM_EXPLICACAO });
    } catch {
      if (!controle.signal.aborted) setExplicacao({ status: "pronta", texto: MSG_SEM_EXPLICACAO });
    }
  };

  const aoSelecionar = (posicao: number) => setEstado(selecionarOpcao(estado, posicao));

  const aoVerificar = () => {
    const proximo = verificarResposta(estado);
    if (proximo === estado) return;
    setEstado(proximo);
    if (proximo.acertou) {
      const subiuMultiplicador = multiplicadorCombo(proximo.combo) > multiplicadorCombo(estado.combo);
      tocar(subiuMultiplicador ? "combo" : "acerto");
      if (subiuMultiplicador) {
        const card = cardRef.current?.getBoundingClientRect();
        if (card) {
          dispararConfete({
            x: (card.right - 60) / window.innerWidth,
            y: card.top / window.innerHeight,
            quantidade: 40,
            forca: 0.6,
          });
        }
      }
      setReacao((r) => r + 1);
      falar(proximo.combo >= 3 ? sortearFala(FALAS.combo, proximo.combo) : sortearFala(FALAS.acerto));
    } else {
      tocar("erro");
      let falas = FALAS.erro;
      if (proximo.vidas === 1) falas = FALAS.ultimaVida;
      if (proximo.vidas === 0) falas = FALAS.ultimoErro;
      falar(sortearFala(falas));
    }
  };

  const aoContinuar = () => {
    const proximo = continuar(estado, Math.random);
    if (proximo === estado) return;
    cancelarExplicacao();
    setEstado(proximo);
    if (proximo.fase === "fim") {
      setReacao((r) => r + 1);
      tocar("fim");
      dispararConfete({ x: 0.5, y: 0.35, quantidade: 140, abertura: Math.PI * 1.6 });
      dispararConfete({ x: 0, y: 0.9, angulo: -Math.PI / 3, abertura: 0.6, quantidade: 70, forca: 1.4 });
      dispararConfete({ x: 1, y: 0.9, angulo: (-2 * Math.PI) / 3, abertura: 0.6, quantidade: 70, forca: 1.4 });
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
    cancelarExplicacao();
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
        <button
          type="button"
          className="licao-btn-icone"
          onClick={(e) => {
            setSom(!som);
            // Clique com mouse não deve "prender" o Enter neste botão (Enter = continuar)
            if (e.detail > 0) e.currentTarget.blur();
          }}
          aria-pressed={som}
          aria-label={som ? "Desligar sons" : "Ligar sons"}
          title={som ? "Desligar sons" : "Ligar sons"}
        >
          <i className={`bi ${som ? "bi-volume-up-fill" : "bi-volume-mute-fill"}`} />
        </button>
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
                <div className="licao-nivel">
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="fw-semibold">
                      <i className="bi bi-bullseye me-1" />
                      Meta de hoje
                    </span>
                    <span className="text-body-secondary">
                      {xpHoje >= metaDiaria ? "cumprida!" : `faltam ${metaDiaria - xpHoje} XP`} · {xpHoje}/{metaDiaria}
                    </span>
                  </div>
                  <div className="licao-progresso">
                    <div
                      className="licao-progresso-barra licao-progresso-meta"
                      style={{ width: `${Math.min(100, (xpHoje / metaDiaria) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
                  <button type="button" className="btn btn-outline-secondary btn-lg" onClick={onFechar}>
                    Voltar para o conteúdo
                  </button>
                  {proxima && (
                    <Link href={proxima.href} replace className="btn btn-licao btn-lg">
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

          <aside className="licao-zyre" ref={zyreRef} aria-live="polite">
            {explicacao ? (
              <div className="licao-balao licao-balao-explicacao">
                {explicacao.status === "pensando" ? (
                  <span className="mascote-digitando" aria-label="Pensando">
                    <span />
                    <span />
                    <span />
                  </span>
                ) : (
                  explicacao.texto
                )}
              </div>
            ) : (
              fala.texto && (
                <div key={fala.id} className="licao-balao">
                  {fala.texto}
                </div>
              )
            )}
            <div className="licao-zyre-figura">
              <ZyreMascote
                estado={estadoDoZyre(estado, explicacao, falando)}
                intensidade={estado.fase === "fim" ? 3 : multiplicador}
                gatilho={reacao}
                olhar={telaLarga ? "esquerda" : "cima"}
              />
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
              {estado.fase === "feedback" && !estado.acertou && (
                <button
                  type="button"
                  className="btn btn-lg licao-btn-explica"
                  disabled={explicacao !== null}
                  onClick={pedirExplicacao}
                >
                  <i className="bi bi-stars me-2" />
                  {MASCOTE_NOME}, me explica
                </button>
              )}
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
