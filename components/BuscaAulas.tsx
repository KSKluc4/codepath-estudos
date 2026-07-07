"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLessons } from "@/lib/lessons-context";
import { useChapters } from "@/lib/chapters-context";

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

interface Resultado {
  key: string;
  href: string;
  titulo: string;
  badge: string;
}

export default function BuscaAulas() {
  const { lessons } = useLessons();
  const { chapters, getTrackMeta } = useChapters();
  const [query, setQuery] = useState("");
  const [focado, setFocado] = useState(false);

  const resultados = useMemo(() => {
    const termo = normalize(query.trim());
    if (!termo) return [];

    const deAulas: Resultado[] = lessons
      .filter((l) => normalize(l.titulo).includes(termo))
      .map((l) => ({
        key: `aula-${l.slug}`,
        href: `/aula/${l.slug}`,
        titulo: l.titulo,
        badge: `Mês ${l.mes}`,
      }));

    const deCapitulos: Resultado[] = chapters
      .filter((c) => normalize(c.titulo).includes(termo))
      .map((c) => ({
        key: `capitulo-${c.slug}`,
        href: `/linguagens/${c.trilha}/${c.capitulo}`,
        titulo: c.titulo,
        badge: getTrackMeta(c.trilha)?.nome ?? c.trilha,
      }));

    return [...deAulas, ...deCapitulos].slice(0, 8);
  }, [query, lessons, chapters, getTrackMeta]);

  return (
    <div className="position-relative">
      <div className="input-group">
        <span className="input-group-text bg-body-tertiary border-secondary-subtle">
          <i className="bi bi-search" />
        </span>
        <input
          type="search"
          className="form-control bg-body-tertiary border-secondary-subtle"
          placeholder="Buscar aula ou capítulo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocado(true)}
          onBlur={() => setTimeout(() => setFocado(false), 150)}
          aria-label="Buscar aula ou capítulo"
        />
      </div>
      {focado && query.trim() && (
        <div
          className="list-group position-absolute top-100 start-0 end-0 mt-1 shadow-lg busca-resultados"
          style={{ zIndex: 1050 }}
        >
          {resultados.length === 0 && (
            <span className="list-group-item bg-body-tertiary text-body-secondary small">
              Nenhum resultado encontrado.
            </span>
          )}
          {resultados.map((r) => (
            <Link
              key={r.key}
              href={r.href}
              className="list-group-item list-group-item-action bg-body-tertiary d-flex justify-content-between align-items-center"
              onClick={() => setQuery("")}
            >
              <span className="small">{r.titulo}</span>
              <span className="badge text-bg-secondary">{r.badge}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
