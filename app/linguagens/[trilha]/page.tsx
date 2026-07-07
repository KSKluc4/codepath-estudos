import { notFound } from "next/navigation";
import Link from "next/link";
import { getChapterSummaries } from "@/lib/chapters";
import { getTrackMeta, TRILHAS } from "@/lib/tracks";
import { NIVEL_LABELS, NIVEL_ORDEM } from "@/lib/niveis";
import ChapterCard from "@/components/ChapterCard";

export function generateStaticParams() {
  return TRILHAS.map((t) => ({ trilha: t.id }));
}

export default async function TrilhaPage({ params }: { params: Promise<{ trilha: string }> }) {
  const { trilha: trilhaParam } = await params;
  const trilha = getTrackMeta(trilhaParam);
  if (!trilha) notFound();

  const capitulos = getChapterSummaries().filter((c) => c.trilha === trilha.id);

  return (
    <div className="container-fluid" style={{ maxWidth: 1100 }}>
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item">
            <Link href="/">Dashboard</Link>
          </li>
          <li className="breadcrumb-item">
            <Link href="/linguagens">Linguagens</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {trilha.nome}
          </li>
        </ol>
      </nav>

      <div className="mb-4 d-flex align-items-start gap-3">
        <span
          className="track-icon"
          style={{ backgroundColor: `${trilha.cor}22`, color: trilha.cor, width: "3.25rem", height: "3.25rem", fontSize: "1.7rem" }}
        >
          <i className={`bi ${trilha.icone}`} />
        </span>
        <div>
          <h1 className="h3 fw-bold mb-2">{trilha.nome}</h1>
          <p className="text-body-secondary mb-0" style={{ maxWidth: 700 }}>
            {trilha.descricao}
          </p>
        </div>
      </div>

      {NIVEL_ORDEM.map((nivel) => {
        const doNivel = capitulos.filter((c) => c.nivel === nivel);
        if (doNivel.length === 0) return null;
        return (
          <section className="mb-5" key={nivel}>
            <h2 className="h5 fw-semibold mb-3">{NIVEL_LABELS[nivel]}</h2>
            <div className="row g-3">
              {doNivel.map((capitulo) => (
                <div className="col-12 col-sm-6 col-lg-4" key={capitulo.slug}>
                  <ChapterCard chapter={capitulo} />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
