"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLessons } from "@/lib/lessons-context";
import { useChapters } from "@/lib/chapters-context";
import { MASCOTE_NOME } from "@/lib/mascote";

interface Mensagem {
  role: "user" | "assistant";
  content: string;
}

const MSG_INDISPONIVEL = `O ${MASCOTE_NOME} está indisponível no momento. Tente de novo mais tarde!`;

function useTituloAtual(): string | undefined {
  const pathname = usePathname();
  const { getLessonSummary } = useLessons();
  const { getChapterSummary } = useChapters();

  const aula = pathname.match(/^\/aula\/([^/]+)\/?$/);
  if (aula) return getLessonSummary(aula[1])?.titulo;

  const capitulo = pathname.match(/^\/linguagens\/([^/]+)\/([^/]+)\/?$/);
  if (capitulo) return getChapterSummary(capitulo[1], capitulo[2])?.titulo;

  return undefined;
}

function BitSvg() {
  const gradienteId = `bit-gradiente-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <svg viewBox="0 0 64 72" className="mascote-svg" aria-hidden="true">
      <defs>
        <linearGradient id={gradienteId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" className="mascote-grad-a" />
          <stop offset="100%" className="mascote-grad-b" />
        </linearGradient>
      </defs>
      <ellipse className="mascote-sombra" cx="32" cy="68" rx="16" ry="3" />
      <g className="mascote-corpo">
        <line x1="32" y1="14" x2="32" y2="7" className="mascote-antena" />
        <circle cx="32" cy="5" r="3.2" className="mascote-led" />
        <rect x="8" y="14" width="48" height="46" rx="14" fill={`url(#${gradienteId})`} />
        <rect x="15" y="22" width="34" height="23" rx="8" className="mascote-tela" />
        <g className="mascote-olhos">
          <ellipse cx="25" cy="32" rx="3.4" ry="4" className="mascote-olho" />
          <ellipse cx="39" cy="32" rx="3.4" ry="4" className="mascote-olho" />
        </g>
        <path d="M27 39 Q32 42.5 37 39" className="mascote-boca" />
        <text x="32" y="55" textAnchor="middle" className="mascote-bits">
          01
        </text>
      </g>
    </svg>
  );
}

export default function MascotChat() {
  const pathname = usePathname();
  const titulo = useTituloAtual();
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [texto, setTexto] = useState("");
  const [carregando, setCarregando] = useState(false);
  const listaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listaRef.current?.scrollTo({ top: listaRef.current.scrollHeight });
  }, [mensagens, aberto]);

  useEffect(() => {
    if (aberto) inputRef.current?.focus();
  }, [aberto]);

  const saudacao = titulo
    ? `Oi! Eu sou o ${MASCOTE_NOME}. Vi que você está em “${titulo}”. Pode me perguntar qualquer dúvida sobre esse conteúdo!`
    : `Oi! Eu sou o ${MASCOTE_NOME}, o mascote do CodePath. Posso te ajudar com o curso de 6 meses, as trilhas de Linguagens ou qualquer dúvida de programação.`;

  const atualizarResposta = (content: string) =>
    setMensagens((atual) => [...atual.slice(0, -1), { role: "assistant", content }]);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const pergunta = texto.trim();
    if (!pergunta || carregando) return;

    const historico: Mensagem[] = [...mensagens, { role: "user", content: pergunta }];
    setMensagens([...historico, { role: "assistant", content: "" }]);
    setTexto("");
    setCarregando(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname, messages: historico }),
      });

      if (!res.ok || !res.body) {
        const dados = await res.json().catch(() => null);
        atualizarResposta(res.status === 429 && dados?.erro ? dados.erro : MSG_INDISPONIVEL);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let resposta = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        resposta += decoder.decode(value, { stream: true });
        atualizarResposta(resposta);
      }
      if (!resposta.trim()) atualizarResposta(MSG_INDISPONIVEL);
    } catch {
      atualizarResposta(MSG_INDISPONIVEL);
    } finally {
      setCarregando(false);
    }
  };

  const esperandoPrimeiroTexto = carregando && mensagens[mensagens.length - 1]?.content === "";

  return (
    <div className="mascote-wrapper">
      {aberto && (
        <div className="card mascote-painel shadow-lg" role="dialog" aria-label={`Chat com o ${MASCOTE_NOME}`}>
          <div className="card-header d-flex align-items-center gap-2">
            <span className="mascote-avatar">
              <BitSvg />
            </span>
            <div className="flex-grow-1 min-w-0">
              <div className="fw-bold text-gradient">{MASCOTE_NOME}</div>
              <div className="small text-body-secondary text-truncate">
                {titulo ? `Vendo: ${titulo}` : "Assistente do CodePath"}
              </div>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Fechar chat"
              onClick={() => setAberto(false)}
            />
          </div>

          <div className="card-body mascote-mensagens" ref={listaRef} aria-live="polite">
            <div className="mascote-msg mascote-msg-bot">{saudacao}</div>
            {mensagens.map((m, i) =>
              m.role === "assistant" && m.content === "" ? null : (
                <div key={i} className={`mascote-msg ${m.role === "user" ? "mascote-msg-user" : "mascote-msg-bot"}`}>
                  {m.content}
                </div>
              )
            )}
            {esperandoPrimeiroTexto && (
              <div className="mascote-msg mascote-msg-bot mascote-digitando" aria-label="Pensando">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>

          <form className="card-footer" onSubmit={enviar}>
            <div className="input-group">
              <input
                ref={inputRef}
                type="text"
                className="form-control"
                placeholder="Escreva sua dúvida..."
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                maxLength={2000}
                disabled={carregando}
              />
              <button type="submit" className="btn btn-primary" disabled={carregando || !texto.trim()} aria-label="Enviar">
                <i className="bi bi-send-fill" />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        type="button"
        className={`mascote-botao ${carregando ? "mascote-pensando" : ""}`}
        onClick={() => setAberto((a) => !a)}
        aria-label={aberto ? `Fechar chat com o ${MASCOTE_NOME}` : `Abrir chat com o ${MASCOTE_NOME}`}
        aria-expanded={aberto}
        title={`Pergunte ao ${MASCOTE_NOME}`}
      >
        <BitSvg />
      </button>
    </div>
  );
}
