"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { BitEstado } from "@/lib/mascote";

export interface Bit3DProps {
  estado: BitEstado;
  intensidade: number;
  gatilho: number;
  olhar: "esquerda" | "cima";
  compacto: boolean;
  pausado: boolean;
  onPronto: () => void;
}

// Mesmas cores do SVG e de app/globals.css (--codepath-accent, --codepath-accent-2)
const COR_A = new THREE.Color("#5ec8f8");
const COR_B = new THREE.Color("#7ee3c3");
const COR_OURO = new THREE.Color("#f8d35e");
const COR_TELA = "#0b0f14";
const COR_BITS = "#062534";

const ALTURA_CABECA = 1.92;
const DURACAO_PULO = 0.62;

interface Pose {
  altura: number;
  flutuar: number;
  balanco: number;
  inclinarX: number;
  girarY: number;
  inclinarZ: number;
  olhoX: number;
  olhoY: number;
  abertura: number;
  sorriso: number;
  boca: number;
  led: number;
  ledOuro: number;
}

const POSE_BASE: Pose = {
  altura: 0,
  flutuar: 1,
  balanco: 1,
  inclinarX: 0,
  girarY: 0,
  inclinarZ: 0,
  olhoX: 0,
  olhoY: 0,
  abertura: 1,
  sorriso: 1,
  boca: 0,
  led: 1.2,
  ledOuro: 0,
};

function poseAlvo(estado: BitEstado, olhar: "esquerda" | "cima"): Pose {
  switch (estado) {
    case "olhando":
      return olhar === "esquerda"
        ? { ...POSE_BASE, balanco: 0.3, girarY: -0.42, inclinarX: 0.06, olhoX: -0.08 }
        : { ...POSE_BASE, balanco: 0.3, inclinarX: -0.28, olhoY: 0.07 };
    case "pensando":
      return { ...POSE_BASE, balanco: 0, inclinarZ: 0.06, olhoX: 0.08, olhoY: 0.08, sorriso: 0.3, led: 2, ledOuro: 1 };
    case "falando":
      return { ...POSE_BASE, balanco: 0.4, sorriso: 0.8, boca: 1 };
    case "comemorando":
      return { ...POSE_BASE, balanco: 0, abertura: 0.45, sorriso: 1.2, boca: 0.75, led: 2.4 };
    case "triste":
      return {
        ...POSE_BASE,
        altura: -0.12,
        flutuar: 0.35,
        balanco: 0.2,
        inclinarX: 0.3,
        olhoY: -0.06,
        abertura: 0.6,
        sorriso: -1,
        led: 0.3,
      };
    default:
      return POSE_BASE;
  }
}

function suavizar(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
}

function criarCabeca(): THREE.BufferGeometry {
  const geometria = new RoundedBoxGeometry(2, ALTURA_CABECA, 1.4, 6, 0.5);
  const posicoes = geometria.attributes.position;
  const cores = new Float32Array(posicoes.count * 3);
  const cor = new THREE.Color();
  // Gradiente diagonal (topo-esquerda → base-direita), igual ao linearGradient do SVG
  for (let i = 0; i < posicoes.count; i++) {
    const x = (posicoes.getX(i) + 1) / 2;
    const y = (ALTURA_CABECA / 2 - posicoes.getY(i)) / ALTURA_CABECA;
    cor.copy(COR_A).lerp(COR_B, THREE.MathUtils.clamp((x + y) / 2, 0, 1));
    cor.toArray(cores, i * 3);
  }
  geometria.setAttribute("color", new THREE.BufferAttribute(cores, 3));
  return geometria;
}

function criarTela(): THREE.BufferGeometry {
  const largura = 1.42;
  const altura = 0.96;
  const raio = 0.32;
  const [x0, x1, y0, y1] = [-largura / 2, largura / 2, -altura / 2, altura / 2];
  const forma = new THREE.Shape();
  forma.moveTo(x0 + raio, y0);
  forma.lineTo(x1 - raio, y0);
  forma.quadraticCurveTo(x1, y0, x1, y0 + raio);
  forma.lineTo(x1, y1 - raio);
  forma.quadraticCurveTo(x1, y1, x1 - raio, y1);
  forma.lineTo(x0 + raio, y1);
  forma.quadraticCurveTo(x0, y1, x0, y1 - raio);
  forma.lineTo(x0, y0 + raio);
  forma.quadraticCurveTo(x0, y0, x0 + raio, y0);
  return new THREE.ExtrudeGeometry(forma, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
    curveSegments: 10,
  });
}

function criarTexturaSombra(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradiente = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradiente.addColorStop(0, "rgba(0, 0, 0, 0.9)");
    gradiente.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradiente;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

function BitModelo({ estado, intensidade, gatilho, olhar }: Pick<Bit3DProps, "estado" | "intensidade" | "gatilho" | "olhar">) {
  const corpo = useRef<THREE.Group>(null);
  const cabeca = useRef<THREE.Group>(null);
  const olhos = useRef<THREE.Group>(null);
  const olhoEsquerdo = useRef<THREE.Mesh>(null);
  const olhoDireito = useRef<THREE.Mesh>(null);
  const boca = useRef<THREE.Group>(null);
  const bocaAberta = useRef<THREE.Mesh>(null);
  const led = useRef<THREE.MeshStandardMaterial>(null);
  const sombra = useRef<THREE.Mesh>(null);
  const sombraMaterial = useRef<THREE.MeshBasicMaterial>(null);

  const geometriaCabeca = useMemo(() => criarCabeca(), []);
  const geometriaTela = useMemo(() => criarTela(), []);
  const texturaSombra = useMemo(() => criarTexturaSombra(), []);

  useEffect(
    () => () => {
      geometriaCabeca.dispose();
      geometriaTela.dispose();
      texturaSombra.dispose();
    },
    [geometriaCabeca, geometriaTela, texturaSombra]
  );

  const animacao = useRef({
    pose: { ...POSE_BASE },
    estadoAnterior: estado,
    inicioEstado: 0,
    gatilho: undefined as number | undefined,
    pulo: null as { inicio: number; saltos: number; altura: number; giros: number } | null,
    proximaPiscada: 2,
    fimPiscada: 0,
  });

  useFrame((state, delta) => {
    const a = animacao.current;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.1);

    if (a.estadoAnterior !== estado) {
      a.estadoAnterior = estado;
      a.inicioEstado = t;
    }
    if (a.gatilho !== gatilho) {
      a.gatilho = gatilho;
      if (estado === "comemorando") {
        // Combo maior = mais pulos, mais alto e com giro
        a.pulo = { inicio: t, saltos: intensidade, altura: 0.22 + 0.1 * intensidade, giros: intensidade - 1 };
      }
    }

    const alvo = poseAlvo(estado, olhar);
    const pose = a.pose;
    for (const chave of Object.keys(alvo) as (keyof Pose)[]) {
      pose[chave] = THREE.MathUtils.damp(pose[chave], alvo[chave], 7, dt);
    }

    let saltoY = 0;
    let escalaX = 1;
    let escalaY = 1;
    let giro = 0;
    if (a.pulo) {
      const decorrido = t - a.pulo.inicio;
      const total = DURACAO_PULO * a.pulo.saltos;
      if (decorrido < total) {
        const u = (decorrido % DURACAO_PULO) / DURACAO_PULO;
        if (u < 0.18) {
          const k = Math.sin((u / 0.18) * Math.PI);
          escalaY = 1 - 0.14 * k;
          escalaX = 1 + 0.1 * k;
        } else if (u < 0.82) {
          const k = Math.sin(((u - 0.18) / 0.64) * Math.PI);
          saltoY = a.pulo.altura * k;
          escalaY = 1 + 0.07 * k;
          escalaX = 1 - 0.05 * k;
        } else {
          const k = Math.sin(((u - 0.82) / 0.18) * Math.PI);
          escalaY = 1 - 0.1 * k;
          escalaX = 1 + 0.07 * k;
        }
        giro = a.pulo.giros * Math.PI * 2 * suavizar(decorrido / total);
      } else if (decorrido > total + 1.4) {
        a.pulo = estado === "comemorando" ? { ...a.pulo, inicio: t } : null;
      }
    }

    let sacudida = 0;
    if (estado === "triste") {
      const e = t - a.inicioEstado;
      sacudida = Math.sin(e * 20) * 0.22 * Math.exp(-e * 4);
    }

    if (t > a.proximaPiscada) {
      a.fimPiscada = t + 0.12;
      a.proximaPiscada = t + 2.2 + Math.random() * 3;
    }
    const piscada = t < a.fimPiscada && estado !== "comemorando" ? 0.12 : 1;

    const flutuacao = Math.sin(t * 2.1) * 0.06 * pose.flutuar;
    const alturaTotal = pose.altura + flutuacao + saltoY;

    if (corpo.current) {
      corpo.current.position.y = -ALTURA_CABECA / 2 + alturaTotal + (estado === "falando" ? Math.sin(t * 9) * 0.015 : 0);
      corpo.current.scale.set(escalaX, escalaY, escalaX);
    }
    if (cabeca.current) {
      const pensando = estado === "pensando" ? Math.sin(t * 7) * 0.07 : 0;
      cabeca.current.rotation.set(
        pose.inclinarX,
        pose.girarY + Math.sin(t * 0.8) * 0.12 * pose.balanco + giro + sacudida,
        pose.inclinarZ + pensando + Math.sin(t * 0.6) * 0.03 * pose.balanco
      );
    }
    olhos.current?.position.set(pose.olhoX, 0.21 + pose.olhoY, 0.74);
    for (const olho of [olhoEsquerdo.current, olhoDireito.current]) {
      if (olho) olho.scale.y = 0.17 * pose.abertura * piscada;
    }

    if (boca.current) {
      const curva = Math.abs(pose.sorriso) < 0.25 ? Math.sign(pose.sorriso || 1) * 0.25 : pose.sorriso;
      boca.current.scale.y = 0.6 * curva;
    }
    if (bocaAberta.current) {
      const fala = 0.25 + 0.75 * Math.abs(Math.sin(t * 11)) * (0.65 + 0.35 * Math.sin(t * 3.3));
      bocaAberta.current.scale.y = Math.max(0.001, pose.boca * (estado === "falando" ? fala : 1));
    }

    if (led.current) {
      const pisca = estado === "pensando" ? 0.5 + 0.5 * Math.sin(t * 9) : 1;
      led.current.color.copy(COR_B).lerp(COR_OURO, pose.ledOuro * pisca);
      led.current.emissive.copy(led.current.color);
      led.current.emissiveIntensity = pose.led + (estado === "comemorando" ? 0.6 * Math.sin(t * 12) : 0);
    }

    const escalaSombra = 1 - Math.min(0.6, Math.max(0, alturaTotal) * 0.9);
    sombra.current?.scale.set(escalaSombra, escalaSombra, 1);
    if (sombraMaterial.current) sombraMaterial.current.opacity = 0.55 * escalaSombra;
  });

  return (
    <>
      <mesh ref={sombra} position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.6, 1.6]} />
        <meshBasicMaterial ref={sombraMaterial} map={texturaSombra} transparent depthWrite={false} />
      </mesh>

      <group ref={corpo}>
        <group ref={cabeca} position={[0, ALTURA_CABECA / 2, 0]}>
          <mesh geometry={geometriaCabeca}>
            <meshStandardMaterial vertexColors roughness={0.35} metalness={0.05} />
          </mesh>

          <mesh geometry={geometriaTela} position={[0, 0.15, 0.62]}>
            <meshStandardMaterial color={COR_TELA} emissive="#08202c" emissiveIntensity={0.5} roughness={0.25} metalness={0.2} />
          </mesh>

          <group ref={olhos}>
            {[-0.29, 0.29].map((x, i) => (
              <mesh key={x} ref={i === 0 ? olhoEsquerdo : olhoDireito} position={[x, 0, 0]} scale={[0.14, 0.17, 0.05]}>
                <sphereGeometry args={[1, 24, 16]} />
                <meshStandardMaterial color={COR_B} emissive={COR_B} emissiveIntensity={0.9} />
              </mesh>
            ))}
          </group>

          <group ref={boca} position={[0, -0.08, 0.73]}>
            <mesh rotation={[0, 0, Math.PI]}>
              <torusGeometry args={[0.2, 0.035, 8, 32, Math.PI]} />
              <meshStandardMaterial color={COR_A} emissive={COR_A} emissiveIntensity={0.6} />
            </mesh>
            <mesh ref={bocaAberta} position={[0, 0, -0.005]}>
              <circleGeometry args={[0.2, 24, Math.PI, Math.PI]} />
              <meshBasicMaterial color="#1f7fa8" />
            </mesh>
          </group>

          <group position={[0, -0.58, 0.68]} rotation={[0.2, 0, 0]}>
            <mesh position={[-0.08, 0, 0]} scale={[0.72, 1, 1]}>
              <torusGeometry args={[0.075, 0.024, 8, 24]} />
              <meshStandardMaterial color={COR_BITS} roughness={0.6} />
            </mesh>
            <mesh position={[0.08, 0, 0]}>
              <boxGeometry args={[0.04, 0.17, 0.04]} />
              <meshStandardMaterial color={COR_BITS} roughness={0.6} />
            </mesh>
            <mesh position={[0.055, 0.065, 0]} rotation={[0, 0, 0.7]}>
              <boxGeometry args={[0.06, 0.03, 0.04]} />
              <meshStandardMaterial color={COR_BITS} roughness={0.6} />
            </mesh>
          </group>

          <mesh position={[0, ALTURA_CABECA / 2 + 0.15, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.32, 12]} />
            <meshStandardMaterial color={COR_A} roughness={0.4} />
          </mesh>
          <mesh position={[0, ALTURA_CABECA / 2 + 0.37, 0]}>
            <sphereGeometry args={[0.13, 24, 16]} />
            <meshStandardMaterial ref={led} color={COR_B} emissive={COR_B} emissiveIntensity={1.2} />
          </mesh>
        </group>
      </group>
    </>
  );
}

export default function Bit3D({ compacto, pausado, onPronto, ...modelo }: Bit3DProps) {
  return (
    <Canvas
      className="bit-3d"
      flat
      dpr={[1, 2]}
      frameloop={pausado ? "never" : "always"}
      camera={{ position: [0, 0.9, compacto ? 5.6 : 6.4], fov: 30 }}
      onCreated={({ camera }) => {
        camera.lookAt(0, compacto ? 0.1 : 0.3, 0);
        onPronto();
      }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#bfe9ff", COR_TELA, 0.6]} />
      <directionalLight position={[2.5, 4, 5]} intensity={1.8} />
      <directionalLight position={[-4, 1, -3]} intensity={1.2} color={COR_B} />
      <BitModelo {...modelo} />
    </Canvas>
  );
}
