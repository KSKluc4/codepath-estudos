"use client";

import { useEffect, useRef } from "react";

export default function CopyableHtml({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const botoes: { btn: HTMLButtonElement; onClick: () => void }[] = [];

    container.querySelectorAll("pre").forEach((pre) => {
      pre.classList.add("code-block-wrapper");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-code-btn";
      btn.innerHTML = '<i class="bi bi-clipboard"></i>';
      btn.setAttribute("aria-label", "Copiar código");

      const onClick = () => {
        const codeEl = pre.querySelector("code");
        const texto = (codeEl ?? pre).textContent ?? "";
        navigator.clipboard.writeText(texto).then(() => {
          btn.innerHTML = '<i class="bi bi-check-lg"></i>';
          btn.classList.add("copied");
          setTimeout(() => {
            btn.innerHTML = '<i class="bi bi-clipboard"></i>';
            btn.classList.remove("copied");
          }, 1500);
        });
      };

      btn.addEventListener("click", onClick);
      pre.appendChild(btn);
      botoes.push({ btn, onClick });
    });

    return () => {
      botoes.forEach(({ btn, onClick }) => btn.removeEventListener("click", onClick));
    };
  }, [html]);

  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
