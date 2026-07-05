"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useLessons } from "@/lib/lessons-context";

function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export default function BuscaAulas() {
  const { lessons } = useLessons();
  const [query, setQuery] = useState("");
  const [focado, setFocado] = useState(false);

  const resultados = useMemo(() => {
    const termo = normalize(query.trim());
    if (!termo) return [];
    return lessons.filter((l) => normalize(l.titulo).includes(termo)).slice(0, 8);
  }, [query, lessons]);

  return (
    <div className="position-relative">
      <div className="input-group">
        <span className="input-group-text bg-body-tertiary border-secondary-subtle">
          <i className="bi bi-search" />
        </span>
        <input
          type="search"
          className="form-control bg-body-tertiary border-secondary-subtle"
          placeholder="Buscar aula por título..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocado(true)}
          onBlur={() => setTimeout(() => setFocado(false), 150)}
          aria-label="Buscar aula por título"
        />
      </div>
      {focado && query.trim() && (
        <div
          className="list-group position-absolute top-100 start-0 end-0 mt-1 shadow-lg busca-resultados"
          style={{ zIndex: 1050 }}
        >
          {resultados.length === 0 && (
            <span className="list-group-item bg-body-tertiary text-body-secondary small">
              Nenhuma aula encontrada.
            </span>
          )}
          {resultados.map((r) => (
            <Link
              key={r.slug}
              href={`/aula/${r.slug}`}
              className="list-group-item list-group-item-action bg-body-tertiary d-flex justify-content-between align-items-center"
              onClick={() => setQuery("")}
            >
              <span className="small">{r.titulo}</span>
              <span className="badge text-bg-secondary">Mês {r.mes}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
