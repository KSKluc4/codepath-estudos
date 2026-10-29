"use client";

import Link from "next/link";
import { MouseEvent, useEffect, useId, useRef, useState } from "react";
import { useLessons } from "@/lib/lessons-context";
import { useChapters } from "@/lib/chapters-context";
import { useProgress } from "@/lib/progress-context";
import { NIVEL_LABELS, NIVEL_ORDEM } from "@/lib/niveis";
import ZyreSvg from "./ZyreSvg";

type EstadoNo = "concluido" | "atual" | "disponivel" | "bloqueado" | "em-breve";

interface NoMapa {
  slug: string;
  rotulo: string;
  titulo: string;
  detalhe: string;
  href: string;
  estado: EstadoNo;
}

interface BlocoMapa {
  titulo: string;
  nos: NoMapa[];
}

// Coordenadas do caminho num "palco" de 320px; em telas menores tudo encolhe junto
const LARGURA = 320;
const ESPACO = 144;
const AMPLITUDE = 72;
const META_POPOVER = 132;
// Espaço no topo de cada bloco para o balão "Começar!" não invadir o divisor
const TOPO = 34;

const ICONES: Record<EstadoNo, string> = {
  concluido: "bi-check-lg",
  atual: "bi-star-fill",
  disponivel: "bi-book-half",
  bloqueado: "bi-lock-fill",
  "em-breve": "bi-hourglass-split",
};

function onda(indice: number): number {
  return Math.sin((indice * Math.PI) / 4);
}

function textoEstado(estado: EstadoNo, feminino: boolean): string {
  const fim = feminino ? "a" : "o";
  switch (estado) {
    case "concluido":
      return `Concluíd${fim}`;
    case "atual":
      return "Você está aqui";
    case "bloqueado":
      return `Bloquead${fim}`;
    case "em-breve":
      return "Em breve";
    default:
      return "Disponível";
  }
}

function caminho(pontos: { x: number; y: number }[]): string {
  return pontos
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const anterior = pontos[i - 1];
      const meio = (p.y - anterior.y) / 2;
      return `C ${anterior.x} ${anterior.y + meio}, ${p.x} ${p.y - meio}, ${p.x} ${p.y}`;
    })
    .join(" ");
}

function MapaCaminho({ blocos, feminino }: { blocos: BlocoMapa[]; feminino: boolean }) {
  const [aberto, setAberto] = useState<string | null>(null);
  const idBase = useId();
  const raizRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const raiz = raizRef.current;
    raiz?.querySelector<HTMLElement>(`[data-popover="${aberto}"] a, [data-popover="${aberto}"] button`)?.focus();

    const fecharFora = (e: PointerEvent) => {
      const alvo = e.target as HTMLElement;
      if (!alvo.closest(`[data-no="${aberto}"]`)) setAberto(null);
    };
    const fecharEsc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAberto(null);
      raiz?.querySelector<HTMLElement>(`[data-no="${aberto}"] .mapa-no-botao`)?.focus();
    };
    document.addEventListener("pointerdown", fecharFora);
    document.addEventListener("keydown", fecharEsc);
    return () => {
      document.removeEventListener("pointerdown", fecharFora);
      document.removeEventListener("keydown", fecharEsc);
    };
  }, [aberto]);

  const alternar = (e: MouseEvent, slug: string) => {
    // Ctrl/Cmd+clique continua abrindo o link em outra aba
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setAberto((atual) => (atual === slug ? null : slug));
  };

  const inicios = blocos.map((_, b) => blocos.slice(0, b).reduce((total, bloco) => total + bloco.nos.length, 0));

  return (
    <div className="mapa" ref={raizRef}>
      {blocos.map((bloco, b) => {
        const altura = bloco.nos.length * ESPACO + TOPO;
        const inicio = inicios[b];
        const pontos = bloco.nos.map((_, j) => ({
          x: LARGURA / 2 + onda(inicio + j) * AMPLITUDE,
          y: TOPO + j * ESPACO + ESPACO / 2,
        }));
        const ultimoFeito = bloco.nos.findLastIndex((no) => no.estado === "concluido" || no.estado === "atual");
        const concluidos = bloco.nos.filter((no) => no.estado === "concluido").length;
        const tituloId = `${idBase}-bloco-${b}`;

        return (
          <section className="mapa-bloco" key={bloco.titulo} aria-labelledby={tituloId}>
            <div className="mapa-divisor">
              <h2 id={tituloId}>{bloco.titulo}</h2>
              <span>
                {concluidos}/{bloco.nos.length}
              </span>
            </div>

            <div className="mapa-palco" style={{ height: altura }}>
              <svg
                className="mapa-linha"
                viewBox={`0 0 ${LARGURA} ${altura}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path d={caminho(pontos)} className="mapa-linha-base" vectorEffect="non-scaling-stroke" />
                {ultimoFeito > 0 && (
                  <path
                    d={caminho(pontos.slice(0, ultimoFeito + 1))}
                    className="mapa-linha-feita"
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </svg>

              <ol className="mapa-nos">
                {bloco.nos.map((no, j) => {
                  const { x, y } = pontos[j];
                  const ladoZyre = x > LARGURA / 2 ? "esquerda" : "direita";
                  const deslocamentoPopover = Math.min(Math.max(x, META_POPOVER), LARGURA - META_POPOVER) - x;
                  const popoverId = `${idBase}-popover-${no.slug}`;
                  const estaAberto = aberto === no.slug;
                  const rotuloAcessivel = `${no.rotulo}: ${no.titulo} (${textoEstado(no.estado, feminino)})`;
                  const conteudoBotao = (
                    <>
                      <i className={`bi ${ICONES[no.estado]}`} aria-hidden="true" />
                      <span className="visually-hidden">{rotuloAcessivel}</span>
                    </>
                  );

                  return (
                    <li
                      key={no.slug}
                      data-no={no.slug}
                      className={`mapa-no mapa-no-${no.estado} ${estaAberto ? "mapa-no-aberto" : ""}`}
                      style={{ left: `${(x / LARGURA) * 100}%`, top: y }}
                    >
                      {no.estado === "atual" && (
                        <>
                          <span className="mapa-balao" aria-hidden="true">
                            Começar!
                          </span>
                          <span className={`mapa-zyre mapa-zyre-${ladoZyre}`} aria-hidden="true">
                            <ZyreSvg estado="olhando" />
                          </span>
                        </>
                      )}

                      {no.estado === "bloqueado" ? (
                        <button
                          type="button"
                          className="mapa-no-botao"
                          aria-expanded={estaAberto}
                          aria-controls={popoverId}
                          onClick={(e) => alternar(e, no.slug)}
                        >
                          {conteudoBotao}
                        </button>
                      ) : (
                        <Link
                          href={no.href}
                          className="mapa-no-botao"
                          aria-expanded={estaAberto}
                          aria-controls={popoverId}
                          onClick={(e) => alternar(e, no.slug)}
                        >
                          {conteudoBotao}
                        </Link>
                      )}
                      <span className="mapa-no-rotulo" aria-hidden="true">
                        {no.rotulo}
                      </span>

                      {estaAberto && (
                        <div
                          id={popoverId}
                          data-popover={no.slug}
                          className="mapa-popover"
                          role="dialog"
                          aria-label={no.titulo}
                          style={{ marginLeft: deslocamentoPopover }}
                        >
                          <span className="mapa-popover-seta" style={{ marginLeft: -deslocamentoPopover }} />
                          <div className="mapa-popover-detalhe">{no.detalhe}</div>
                          <div className="mapa-popover-titulo">{no.titulo}</div>
                          {no.estado === "bloqueado" ? (
                            <p className="small text-body-secondary mb-0">
                              Conclua a aula anterior para desbloquear. Dá para liberar tudo em{" "}
                              <Link href="/configuracoes">Configurações</Link>.
                            </p>
                          ) : (
                            <div className="d-grid gap-2">
                              {no.estado !== "em-breve" && (
                                <Link href={`${no.href}?licao=1`} className="btn btn-licao">
                                  <i className="bi bi-play-fill me-1" />
                                  Começar lição
                                </Link>
                              )}
                              <Link href={no.href} className="btn btn-outline-secondary">
                                <i className="bi bi-book me-1" />
                                Ler conteúdo
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Carregando() {
  return (
    <div className="d-flex justify-content-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  );
}

export function MapaMes({ mes }: { mes: number }) {
  const { lessons, isUnlocked } = useLessons();
  const { hidratado, isCompleted } = useProgress();
  if (!hidratado) return <Carregando />;

  const aulas = lessons.filter((l) => l.mes === mes);
  const atual = aulas.find((l) => l.status === "completo" && !isCompleted(l.slug) && isUnlocked(l.slug));
  // Não há semanas no conteúdo: o mês é dividido em até 4 semanas na ordem das aulas
  const porSemana = Math.ceil(aulas.length / 4);

  const blocos: BlocoMapa[] = [];
  aulas.forEach((aula, i) => {
    let estado: EstadoNo = "disponivel";
    if (aula.status === "em-breve") estado = "em-breve";
    else if (isCompleted(aula.slug)) estado = "concluido";
    else if (!isUnlocked(aula.slug)) estado = "bloqueado";
    else if (aula.slug === atual?.slug) estado = "atual";

    const semana = Math.floor(i / porSemana);
    blocos[semana] ??= { titulo: `Semana ${semana + 1}`, nos: [] };
    blocos[semana].nos.push({
      slug: aula.slug,
      rotulo: `Aula ${aula.numero}`,
      titulo: aula.titulo,
      detalhe: [`Aula ${aula.numero}`, aula.duracao && `${aula.duracao} min`].filter(Boolean).join(" · "),
      href: `/aula/${aula.slug}`,
      estado,
    });
  });

  return <MapaCaminho blocos={blocos} feminino />;
}

export function MapaTrilha({ trilha }: { trilha: string }) {
  const { chapters } = useChapters();
  const { hidratado, isCompleted } = useProgress();
  if (!hidratado) return <Carregando />;

  const capitulos = chapters.filter((c) => c.trilha === trilha);
  // Nas Linguagens não há bloqueio: o "atual" é o primeiro capítulo ainda não concluído
  const atual = capitulos.find((c) => c.status === "completo" && !isCompleted(c.slug));

  const blocos: BlocoMapa[] = NIVEL_ORDEM.map((nivel) => ({
    titulo: NIVEL_LABELS[nivel],
    nos: capitulos
      .filter((c) => c.nivel === nivel)
      .map((c) => {
        let estado: EstadoNo = "disponivel";
        if (c.status === "em-breve") estado = "em-breve";
        else if (isCompleted(c.slug)) estado = "concluido";
        else if (c.slug === atual?.slug) estado = "atual";
        return {
          slug: c.slug,
          rotulo: `Cap. ${c.numero}`,
          titulo: c.titulo,
          detalhe: [`Capítulo ${c.numero}`, NIVEL_LABELS[c.nivel], c.duracao && `${c.duracao} min`]
            .filter(Boolean)
            .join(" · "),
          href: `/linguagens/${c.trilha}/${c.capitulo}`,
          estado,
        };
      }),
  })).filter((bloco) => bloco.nos.length > 0);

  return <MapaCaminho blocos={blocos} feminino={false} />;
}
