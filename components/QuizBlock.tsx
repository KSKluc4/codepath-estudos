"use client";

import { QuizPergunta } from "@/lib/types";
import { useProgress } from "@/lib/progress-context";

export default function QuizBlock({ slug, perguntas }: { slug: string; perguntas: QuizPergunta[] }) {
  const { quizAnswers, setQuizAnswer } = useProgress();

  if (perguntas.length === 0) return null;

  const respostas = quizAnswers[slug] ?? {};
  const acertos = perguntas.filter((p, i) => respostas[i] !== undefined && p.opcoes[respostas[i]]?.correta).length;
  const respondidas = Object.keys(respostas).length;

  return (
    <section className="mt-5">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h4 mb-0">
          <i className="bi bi-patch-question me-2 text-primary" />
          Quiz
        </h2>
        {respondidas > 0 && (
          <span className="badge text-bg-secondary">
            {acertos}/{respondidas} corretas
          </span>
        )}
      </div>

      {perguntas.map((pergunta, qIdx) => {
        const respostaSelecionada = respostas[qIdx];
        const respondida = respostaSelecionada !== undefined;
        const correta = respondida && pergunta.opcoes[respostaSelecionada]?.correta;

        return (
          <div className="card mb-3 quiz-card" key={qIdx}>
            <div className="card-body">
              <p className="fw-semibold mb-3">
                {qIdx + 1}.{" "}
                <span dangerouslySetInnerHTML={{ __html: pergunta.perguntaHtml }} />
              </p>
              <div className="d-flex flex-column gap-2">
                {pergunta.opcoes.map((opcao, oIdx) => {
                  const selecionada = respostaSelecionada === oIdx;
                  let extraClass = "";
                  if (respondida && selecionada) {
                    extraClass = opcao.correta ? "border-success" : "border-danger";
                  } else if (respondida && opcao.correta) {
                    extraClass = "border-success";
                  }
                  return (
                    <label
                      key={oIdx}
                      className={`form-check quiz-opcao p-2 rounded border ${extraClass}`}
                    >
                      <input
                        className="form-check-input me-2"
                        type="radio"
                        name={`quiz-${slug}-${qIdx}`}
                        checked={selecionada}
                        onChange={() => setQuizAnswer(slug, qIdx, oIdx)}
                      />
                      <span
                        className="form-check-label"
                        dangerouslySetInnerHTML={{ __html: opcao.html }}
                      />
                      {respondida && opcao.correta && (
                        <i className="bi bi-check-circle-fill text-success ms-2" />
                      )}
                      {respondida && selecionada && !opcao.correta && (
                        <i className="bi bi-x-circle-fill text-danger ms-2" />
                      )}
                    </label>
                  );
                })}
              </div>

              {respondida && (
                <div className={`alert ${correta ? "alert-success" : "alert-danger"} mt-3 mb-0`}>
                  <strong>{correta ? "Correto! " : "Não foi dessa vez. "}</strong>
                  <span dangerouslySetInnerHTML={{ __html: pergunta.explicacaoHtml }} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
