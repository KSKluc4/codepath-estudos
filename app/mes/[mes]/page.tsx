import { notFound } from "next/navigation";
import Link from "next/link";
import { getLessonSummaries } from "@/lib/lessons";
import { getMesMeta, MESES } from "@/lib/months";
import LessonCard from "@/components/LessonCard";

export function generateStaticParams() {
  return MESES.map((m) => ({ mes: String(m.mes) }));
}

export default async function MesPage({ params }: { params: Promise<{ mes: string }> }) {
  const { mes: mesParam } = await params;
  const mesNum = Number(mesParam);
  const mesMeta = getMesMeta(mesNum);
  if (!mesMeta) notFound();

  const lessons = getLessonSummaries().filter((l) => l.mes === mesNum);

  return (
    <div className="container-fluid" style={{ maxWidth: 1100 }}>
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb small">
          <li className="breadcrumb-item">
            <Link href="/">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Mês {mesMeta.mes}
          </li>
        </ol>
      </nav>

      <div className="mb-4">
        <p className="text-primary text-uppercase small fw-semibold mb-1">{mesMeta.nome} de 2026</p>
        <h1 className="h3 fw-bold mb-2">
          Mês {mesMeta.mes} — {mesMeta.titulo}
        </h1>
        <p className="text-body-secondary mb-3" style={{ maxWidth: 700 }}>
          {mesMeta.descricao}
        </p>
        <div className="d-flex flex-wrap gap-2">
          {mesMeta.topicos.map((topico) => (
            <span key={topico} className="badge text-bg-secondary fw-normal">
              {topico}
            </span>
          ))}
        </div>
      </div>

      <div className="row g-3">
        {lessons.map((lesson) => (
          <div className="col-12 col-sm-6 col-lg-4" key={lesson.slug}>
            <LessonCard lesson={lesson} />
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-between mt-4">
        {mesNum > 1 ? (
          <Link href={`/mes/${mesNum - 1}`} className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-arrow-left me-1" /> Mês {mesNum - 1}
          </Link>
        ) : (
          <span />
        )}
        {mesNum < 6 && (
          <Link href={`/mes/${mesNum + 1}`} className="btn btn-outline-secondary btn-sm">
            Mês {mesNum + 1} <i className="bi bi-arrow-right ms-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
