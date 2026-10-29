"use client";

import dynamic from "next/dynamic";
import { Component, ReactNode, useState, useSyncExternalStore } from "react";
import { BitEstado } from "@/lib/mascote";
import { useMovimentoReduzido } from "@/lib/useMediaQuery";
import BitSvg from "./BitSvg";

const Bit3D = dynamic(() => import("./Bit3D"), { ssr: false });

let suporteWebgl: boolean | undefined;

function temWebgl(): boolean {
  if (suporteWebgl === undefined) {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      suporteWebgl = gl !== null;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      suporteWebgl = false;
    }
  }
  return suporteWebgl;
}

function inscreverNada() {
  return () => {};
}

export function precarregarBit3D() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !temWebgl()) return;
  void import("./Bit3D");
}

class Limite3D extends Component<{ children: ReactNode }, { falhou: boolean }> {
  state = { falhou: false };

  static getDerivedStateFromError() {
    return { falhou: true };
  }

  render() {
    return this.state.falhou ? null : this.props.children;
  }
}

export default function BitMascote({
  estado = "idle",
  intensidade = 1,
  gatilho = 0,
  olhar = "esquerda",
  compacto = false,
  pausado = false,
  permitir3d = true,
}: {
  estado?: BitEstado;
  intensidade?: number;
  gatilho?: number;
  olhar?: "esquerda" | "cima";
  compacto?: boolean;
  pausado?: boolean;
  permitir3d?: boolean;
}) {
  const movimentoReduzido = useMovimentoReduzido();
  const webgl = useSyncExternalStore(inscreverNada, temWebgl, () => false);
  const [pronto, setPronto] = useState(false);
  // Sem WebGL ou com prefers-reduced-motion, fica o SVG 2D (que também é o "loading" do 3D)
  const usar3d = permitir3d && webgl && !movimentoReduzido;
  const mostrar3d = usar3d && pronto;

  return (
    <div className={`bit-mascote ${mostrar3d ? "bit-mascote-3d" : ""}`}>
      {!mostrar3d && <BitSvg estado={estado} />}
      {usar3d && (
        <Limite3D>
          <Bit3D
            estado={estado}
            intensidade={intensidade}
            gatilho={gatilho}
            olhar={olhar}
            compacto={compacto}
            pausado={pausado}
            onPronto={() => setPronto(true)}
          />
        </Limite3D>
      )}
    </div>
  );
}
