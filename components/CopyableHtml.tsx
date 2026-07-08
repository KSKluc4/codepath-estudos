"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const CopyableHtml = forwardRef<HTMLDivElement, { html: string; className?: string }>(
  function CopyableHtml({ html, className }, forwardedRef) {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current as HTMLDivElement, []);

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
);

export default CopyableHtml;
