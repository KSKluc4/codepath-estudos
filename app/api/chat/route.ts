import Anthropic from "@anthropic-ai/sdk";
import { montarExplicacaoErro, montarExplicacaoExercicio, montarSystemPrompt } from "@/lib/mascot-context";

const MODELO_PADRAO = "claude-haiku-5-5";
const MAX_TOKENS = 1024;
const MAX_MENSAGENS = 20;
const MAX_CARACTERES_MENSAGEM = 2000;

function validarMensagens(valor: unknown): Anthropic.MessageParam[] | null {
  if (!Array.isArray(valor) || valor.length === 0) return null;

  const mensagens: Anthropic.MessageParam[] = [];
  for (const item of valor.slice(-MAX_MENSAGENS)) {
    if (typeof item !== "object" || item === null) return null;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || !content.trim()) continue;
    mensagens.push({ role, content: content.slice(0, MAX_CARACTERES_MENSAGEM) });
  }

  while (mensagens.length > 0 && mensagens[0].role !== "user") mensagens.shift();
  if (mensagens.length === 0 || mensagens[mensagens.length - 1].role !== "user") return null;
  return mensagens;
}

function erro(mensagem: string, status: number) {
  return Response.json({ erro: mensagem }, { status });
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return erro("Assistente indisponível: ANTHROPIC_API_KEY não configurada no servidor.", 503);
  }

  let corpo: {
    pathname?: unknown;
    messages?: unknown;
    perguntaIndex?: unknown;
    opcaoEscolhida?: unknown;
    exercicioIndex?: unknown;
    resposta?: unknown;
  };
  try {
    corpo = await request.json();
  } catch {
    return erro("Corpo da requisição inválido.", 400);
  }

  const pathname = typeof corpo.pathname === "string" ? corpo.pathname : "/";
  let system: string;
  let mensagens: Anthropic.MessageParam[];

  if (corpo.perguntaIndex !== undefined) {
    const explicacao = montarExplicacaoErro(pathname, corpo.perguntaIndex, corpo.opcaoEscolhida);
    if (!explicacao) return erro("Pergunta inválida.", 400);
    system = explicacao.system;
    mensagens = [{ role: "user", content: explicacao.pedido }];
  } else if (corpo.exercicioIndex !== undefined) {
    const explicacao = montarExplicacaoExercicio(pathname, corpo.exercicioIndex, corpo.resposta);
    if (!explicacao) return erro("Exercício inválido.", 400);
    system = explicacao.system;
    mensagens = [{ role: "user", content: explicacao.pedido }];
  } else {
    const validadas = validarMensagens(corpo.messages);
    if (!validadas) return erro("Mensagens inválidas.", 400);
    system = montarSystemPrompt(pathname);
    mensagens = validadas;
  }

  const client = new Anthropic();
  const stream = client.messages.stream({
    model: process.env.ANTHROPIC_MODEL || MODELO_PADRAO,
    max_tokens: MAX_TOKENS,
    output_config: { effort: "low" },
    system,
    messages: mensagens,
  });

  try {
    await stream.withResponse();
  } catch (e) {
    console.error("[api/chat] falha ao chamar a Anthropic:", e);
    if (e instanceof Anthropic.AuthenticationError) {
      return erro("Assistente indisponível: chave da Anthropic inválida.", 503);
    }
    if (e instanceof Anthropic.RateLimitError) {
      return erro("Muitas perguntas ao mesmo tempo. Tente de novo em instantes.", 429);
    }
    return erro("Assistente indisponível no momento.", 502);
  }

  const encoder = new TextEncoder();
  const corpoResposta = new ReadableStream({
    async start(controller) {
      try {
        for await (const evento of stream) {
          if (evento.type === "content_block_delta" && evento.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(evento.delta.text));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(encoder.encode("\n\nDesculpe, não consigo ajudar com isso."));
        }
        controller.close();
      } catch (e) {
        console.error("[api/chat] erro durante o streaming:", e);
        controller.error(e);
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(corpoResposta, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
