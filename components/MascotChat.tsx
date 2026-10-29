"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLessons } from "@/lib/lessons-context";
import { useChapters } from "@/lib/chapters-context";
import { MASCOTE_NOME } from "@/lib/mascote";
import { useModoLicaoAberto } from "@/lib/modo-licao";
import ZyreSvg from "./ZyreSvg";
import ZyreMascote, { precarregarZyre3D } from "./ZyreMascote";

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

export default function MascotChat() {
  const pathname = usePathname();
  const titulo = useTituloAtual();
  const modoLicaoAberto = useModoLicaoAberto();
  const [aberto, setAberto] = useState(false);
  const [usar3d, setUsar3d] = useState(false);
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
  let estadoZyre: "idle" | "pensando" | "falando" = "idle";
  if (esperandoPrimeiroTexto) estadoZyre = "pensando";
  else if (carregando) estadoZyre = "falando";

  return (
    <div className="mascote-wrapper" hidden={modoLicaoAberto}>
      {aberto && (
        <div className="card mascote-painel shadow-lg" role="dialog" aria-label={`Chat com o ${MASCOTE_NOME}`}>
          <div className="card-header d-flex align-items-center gap-2">
            <span className="mascote-avatar">
              <ZyreSvg />
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
        onClick={() => {
          setAberto((a) => !a);
          setUsar3d(true);
        }}
        onPointerEnter={precarregarZyre3D}
        onFocus={precarregarZyre3D}
        aria-label={aberto ? `Fechar chat com o ${MASCOTE_NOME}` : `Abrir chat com o ${MASCOTE_NOME}`}
        aria-expanded={aberto}
        title={`Pergunte ao ${MASCOTE_NOME}`}
      >
        <ZyreMascote estado={estadoZyre} compacto permitir3d={usar3d} pausado={modoLicaoAberto} />
      </button>
    </div>
  );
}
