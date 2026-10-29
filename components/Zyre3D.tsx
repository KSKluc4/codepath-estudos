"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useRef } from "react";
import { Canvas, ThreeElements, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ZyreEstado } from "@/lib/mascote";

export interface Zyre3DProps {
  estado: ZyreEstado;
  intensidade: number;
  gatilho: number;
  olhar: "esquerda" | "cima";
  compacto: boolean;
  pausado: boolean;
  onPronto: () => void;
}

// Mesma paleta do SVG e de app/globals.css (--codepath-accent, --codepath-accent-2)
const COR_PELO = "#5ec8f8";
const COR_CLARA = "#d9f5ff";
const COR_DETALHE = "#7ee3c3";
const COR_CONTORNO = "#0b2230";
const COR_OLHO = "#0b1e2b";

const CORES_CHAMA: Record<ZyreEstado, THREE.Color> = {
  idle: new THREE.Color("#7fd8ff"),
  olhando: new THREE.Color("#7fd8ff"),
  falando: new THREE.Color("#7fd8ff"),
  pensando: new THREE.Color("#f8d35e"),
  comemorando: new THREE.Color("#34d399"),
  triste: new THREE.Color("#a78bfa"),
};

const DURACAO_PULO = 0.62;
const ALTURA_CHAO = -1.3;

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
  orelhasCaidas: number;
  orelhasAtentas: number;
  caudaVelocidade: number;
  caudaAmplitude: number;
  caudaAltura: number;
  chama: number;
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
  orelhasCaidas: 0,
  orelhasAtentas: 0,
  caudaVelocidade: 3,
  caudaAmplitude: 0.28,
  caudaAltura: 0,
  chama: 1,
};

function poseAlvo(estado: ZyreEstado, olhar: "esquerda" | "cima"): Pose {
  switch (estado) {
    case "olhando":
      return {
        ...POSE_BASE,
        balanco: 0.3,
        orelhasAtentas: 1,
        caudaVelocidade: 4,
        ...(olhar === "esquerda"
          ? { girarY: -0.45, inclinarX: 0.05, olhoX: -0.06 }
          : { inclinarX: -0.3, olhoY: 0.06 }),
      };
    case "pensando":
      return {
        ...POSE_BASE,
        balanco: 0,
        inclinarZ: 0.28,
        olhoX: 0.05,
        olhoY: 0.06,
        sorriso: 0.2,
        caudaVelocidade: 1.4,
        caudaAmplitude: 0.15,
      };
    case "falando":
      return { ...POSE_BASE, balanco: 0.4, sorriso: 0.8, boca: 1, caudaVelocidade: 4 };
    case "comemorando":
      return {
        ...POSE_BASE,
        balanco: 0,
        abertura: 0.3,
        sorriso: 1.3,
        boca: 0.8,
        orelhasAtentas: 0.6,
        caudaVelocidade: 15,
        caudaAmplitude: 0.45,
        chama: 1.45,
      };
    case "triste":
      return {
        ...POSE_BASE,
        altura: -0.08,
        flutuar: 0.3,
        balanco: 0.2,
        inclinarX: 0.3,
        olhoY: -0.05,
        abertura: 0.6,
        sorriso: -1,
        orelhasCaidas: 1,
        caudaVelocidade: 1,
        caudaAmplitude: 0.08,
        caudaAltura: -0.55,
        chama: 0.6,
      };
    default:
      return POSE_BASE;
  }
}

function suavizar(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
}

interface Recursos {
  esfera: THREE.BufferGeometry;
  cone: THREE.BufferGeometry;
  chama: THREE.BufferGeometry;
  cauda: THREE.BufferGeometry;
  caudaContorno: THREE.BufferGeometry;
  gradiente: THREE.Texture;
  sombra: THREE.Texture;
  brilho: THREE.Texture;
}

function texturaRadial(centro: string): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const degrade = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    degrade.addColorStop(0, centro);
    degrade.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = degrade;
    ctx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

// A cauda sai das costas, vai para a direita e sobe (curva de Bézier)
const CURVA_CAUDA = new THREE.QuadraticBezierCurve3(
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0.62, -0.05, 0.05),
  new THREE.Vector3(0.72, 0.72, 0.1)
);

// Tubo ao longo da curva com o raio variando: fino na base, gordinho no meio (peluda)
function criarCauda(folga: number): THREE.BufferGeometry {
  const aneis = 24;
  const lados = 16;
  const tubo = new THREE.TubeGeometry(CURVA_CAUDA, aneis, 1, lados, false);
  const posicoes = tubo.attributes.position;
  const vertice = new THREE.Vector3();
  for (let i = 0; i <= aneis; i++) {
    const t = i / aneis;
    const centro = CURVA_CAUDA.getPointAt(t);
    const raio = 0.13 + 0.12 * Math.sin(Math.PI * Math.min(1, t * 1.15)) + folga;
    for (let j = 0; j <= lados; j++) {
      const k = i * (lados + 1) + j;
      vertice.fromBufferAttribute(posicoes, k).sub(centro).multiplyScalar(raio).add(centro);
      posicoes.setXYZ(k, vertice.x, vertice.y, vertice.z);
    }
  }
  tubo.computeVertexNormals();
  return tubo;
}

function criarRecursos(): Recursos {
  // 3 faixas de luz em vez de um degradê contínuo: é isso que dá o visual "toon"
  const gradiente = new THREE.DataTexture(new Uint8Array([110, 190, 255]), 3, 1, THREE.RedFormat);
  gradiente.minFilter = THREE.NearestFilter;
  gradiente.magFilter = THREE.NearestFilter;
  gradiente.needsUpdate = true;

  // Gota de fogo: perfil girado em torno do eixo Y, redondo embaixo e pontudo em cima
  const perfil = Array.from({ length: 17 }, (_, i) => {
    const t = i / 16;
    const raio = 0.17 * Math.sin(Math.PI * t) ** 0.7 * (1 - 0.55 * t);
    return new THREE.Vector2(raio, -0.14 + 0.46 * t);
  });

  return {
    esfera: new THREE.SphereGeometry(1, 32, 24),
    cone: new THREE.ConeGeometry(1, 1, 24),
    chama: new THREE.LatheGeometry(perfil, 24),
    cauda: criarCauda(0),
    caudaContorno: criarCauda(0.022),
    gradiente,
    sombra: texturaRadial("rgba(0, 0, 0, 0.9)"),
    brilho: texturaRadial("rgba(255, 255, 255, 0.85)"),
  };
}

const RecursosContext = createContext<Recursos | null>(null);

function useRecursos(): Recursos {
  const recursos = useContext(RecursosContext);
  if (!recursos) throw new Error("useRecursos deve ser usado dentro do Zyre3D");
  return recursos;
}

// Peça com sombreamento toon e contorno escuro (casco invertido: a mesma forma um pouco
// maior, desenhada só por dentro, aparece como borda ao redor da peça)
function Peca({
  forma,
  cor,
  contorno = 0.06,
  children,
  ...grupo
}: ThreeElements["group"] & { forma: "esfera" | "cone"; cor: string; contorno?: number; children?: ReactNode }) {
  const recursos = useRecursos();
  return (
    <group {...grupo}>
      <mesh geometry={recursos[forma]}>
        <meshToonMaterial color={cor} gradientMap={recursos.gradiente} />
      </mesh>
      {contorno > 0 && (
        <mesh geometry={recursos[forma]} scale={1 + contorno}>
          <meshBasicMaterial color={COR_CONTORNO} side={THREE.BackSide} />
        </mesh>
      )}
      {children}
    </group>
  );
}

function Plana({ cor, transparente, ...grupo }: ThreeElements["group"] & { cor: string; transparente?: number }) {
  const recursos = useRecursos();
  return (
    <group {...grupo}>
      <mesh geometry={recursos.esfera}>
        <meshBasicMaterial
          color={cor}
          transparent={transparente !== undefined}
          opacity={transparente ?? 1}
          depthWrite={transparente === undefined}
        />
      </mesh>
    </group>
  );
}

function Olho({ x, ...grupo }: ThreeElements["group"] & { x: number }) {
  return (
    <group position={[x, 0, 0]} {...grupo}>
      <Plana cor={COR_OLHO} scale={[0.17, 0.22, 0.1]} />
      <Plana cor={COR_DETALHE} position={[0, -0.045, 0.05]} scale={[0.115, 0.13, 0.07]} />
      <Plana cor="#ffffff" position={[-0.055, 0.075, 0.09]} scale={0.055} />
      <Plana cor="#ffffff" position={[0.05, -0.07, 0.09]} scale={0.026} />
    </group>
  );
}

function ZyreModelo({ estado, intensidade, gatilho, olhar }: Pick<Zyre3DProps, "estado" | "intensidade" | "gatilho" | "olhar">) {
  const recursos = useRecursos();
  const corpo = useRef<THREE.Group>(null);
  const tronco = useRef<THREE.Group>(null);
  const cabeca = useRef<THREE.Group>(null);
  const olhos = useRef<THREE.Group>(null);
  const olhoEsquerdo = useRef<THREE.Group>(null);
  const olhoDireito = useRef<THREE.Group>(null);
  const boca = useRef<THREE.Group>(null);
  const bocaAberta = useRef<THREE.Mesh>(null);
  const orelhaEsquerda = useRef<THREE.Group>(null);
  const orelhaDireita = useRef<THREE.Group>(null);
  const cauda = useRef<THREE.Group>(null);
  const chama = useRef<THREE.Group>(null);
  const fogo = useRef<THREE.MeshBasicMaterial>(null);
  const brilho = useRef<THREE.SpriteMaterial>(null);
  const luzChama = useRef<THREE.PointLight>(null);
  const sombra = useRef<THREE.Mesh>(null);
  const sombraMaterial = useRef<THREE.MeshBasicMaterial>(null);

  const animacao = useRef({
    pose: { ...POSE_BASE },
    corChama: CORES_CHAMA.idle.clone(),
    faseCauda: 0,
    estadoAnterior: estado,
    inicioEstado: 0,
    gatilho: undefined as number | undefined,
    pulo: null as { inicio: number; saltos: number; altura: number; giros: number } | null,
    proximaPiscada: 2,
    fimPiscada: 0,
    proximaOrelhada: 3,
    orelhada: { inicio: -10, lado: 1 },
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

    // De vez em quando uma orelha dá uma "mexidinha" rápida, como bicho de verdade
    if (t > a.proximaOrelhada) {
      a.orelhada = { inicio: t, lado: Math.random() < 0.5 ? -1 : 1 };
      a.proximaOrelhada = t + 2.5 + Math.random() * 4;
    }
    const orelhada = Math.max(0, Math.sin(((t - a.orelhada.inicio) / 0.25) * Math.PI)) * (t - a.orelhada.inicio < 0.25 ? 1 : 0);

    const flutuacao = Math.sin(t * 2.1) * 0.05 * pose.flutuar;
    const alturaTotal = pose.altura + flutuacao + saltoY;

    if (corpo.current) {
      corpo.current.position.y = ALTURA_CHAO + alturaTotal + (estado === "falando" ? Math.sin(t * 9) * 0.012 : 0);
      corpo.current.scale.set(escalaX, escalaY, escalaX);
      corpo.current.rotation.y = giro + sacudida * 0.5;
    }
    tronco.current?.scale.set(1, 1 + Math.sin(t * 2.6) * 0.02, 1);

    if (cabeca.current) {
      const pensando = estado === "pensando" ? Math.sin(t * 1.6) * 0.04 : 0;
      cabeca.current.rotation.set(
        pose.inclinarX,
        pose.girarY + Math.sin(t * 0.8) * 0.12 * pose.balanco + sacudida,
        pose.inclinarZ + pensando + Math.sin(t * 0.6) * 0.04 * pose.balanco
      );
    }
    olhos.current?.position.set(pose.olhoX, 0.4 + pose.olhoY, 0.6);
    for (const olho of [olhoEsquerdo.current, olhoDireito.current]) {
      if (olho) olho.scale.y = pose.abertura * piscada;
    }

    if (boca.current) {
      const curva = Math.abs(pose.sorriso) < 0.25 ? Math.sign(pose.sorriso || 1) * 0.25 : pose.sorriso;
      boca.current.scale.y = 0.7 * curva;
    }
    const fala = 0.25 + 0.75 * Math.abs(Math.sin(t * 11)) * (0.65 + 0.35 * Math.sin(t * 3.3));
    const abertura = pose.boca * (estado === "falando" ? fala : 1);
    bocaAberta.current?.scale.set(0.085, Math.max(0.001, 0.09 * abertura), 0.03);

    for (const [orelha, lado] of [
      [orelhaEsquerda.current, -1],
      [orelhaDireita.current, 1],
    ] as const) {
      if (!orelha) continue;
      const mexida = a.orelhada.lado === lado ? orelhada * 0.35 : 0;
      orelha.rotation.set(
        0.35 * pose.orelhasCaidas - 0.25 * pose.orelhasAtentas,
        0,
        -lado * (0.38 + 0.95 * pose.orelhasCaidas + mexida)
      );
    }

    if (cauda.current) {
      a.faseCauda += dt * pose.caudaVelocidade;
      const abano = Math.sin(a.faseCauda) * pose.caudaAmplitude;
      cauda.current.rotation.set(0, abano * 0.6, pose.caudaAltura + abano * 0.7);
    }

    a.corChama.lerp(CORES_CHAMA[estado], 1 - Math.exp(-6 * dt));
    const tremulacao = 1 + 0.06 * Math.sin(t * 13) + 0.04 * Math.sin(t * 21);
    let pulso = 1;
    if (estado === "pensando") pulso = 1 + 0.15 * Math.sin(t * 6);
    if (estado === "falando") pulso = 0.9 + 0.35 * abertura;
    const tamanhoChama = pose.chama * pulso;
    if (chama.current) {
      chama.current.scale.set(tamanhoChama, tamanhoChama * tremulacao, tamanhoChama);
      chama.current.rotation.z = Math.sin(t * 5) * 0.12;
    }
    fogo.current?.color.copy(a.corChama);
    if (brilho.current) {
      brilho.current.color.copy(a.corChama);
      brilho.current.opacity = 0.55 + 0.4 * (pulso - 1);
    }
    if (luzChama.current) {
      luzChama.current.color.copy(a.corChama);
      luzChama.current.intensity = 1.6 * tamanhoChama;
    }

    const escalaSombra = 1 - Math.min(0.6, Math.max(0, alturaTotal) * 0.9);
    sombra.current?.scale.set(escalaSombra, escalaSombra, 1);
    if (sombraMaterial.current) sombraMaterial.current.opacity = 0.55 * escalaSombra;
  });

  return (
    <>
      <mesh ref={sombra} position={[0.05, ALTURA_CHAO, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial ref={sombraMaterial} map={recursos.sombra} transparent depthWrite={false} />
      </mesh>

      <group ref={corpo}>
        <group ref={cauda} position={[0.35, 0.42, -0.25]}>
          <mesh geometry={recursos.cauda}>
            <meshToonMaterial color={COR_PELO} gradientMap={recursos.gradiente} />
          </mesh>
          <mesh geometry={recursos.caudaContorno}>
            <meshBasicMaterial color={COR_CONTORNO} side={THREE.BackSide} />
          </mesh>
          <Peca forma="esfera" cor={COR_CLARA} position={[0.72, 0.66, 0.1]} scale={0.16} contorno={0.14} />
          <group ref={chama} position={[0.72, 0.84, 0.1]}>
            <pointLight ref={luzChama} distance={2.4} decay={1.5} />
            <sprite scale={0.95}>
              <spriteMaterial ref={brilho} map={recursos.brilho} transparent depthWrite={false} />
            </sprite>
            <mesh geometry={recursos.chama}>
              <meshBasicMaterial ref={fogo} transparent opacity={0.95} />
            </mesh>
            <Plana cor="#ffffff" position={[0, -0.02, 0]} scale={0.065} transparente={0.9} />
          </group>
        </group>

        <group ref={tronco}>
          <Peca forma="esfera" cor={COR_PELO} position={[0, 0.62, 0]} scale={[0.62, 0.56, 0.58]} contorno={0.07} />
          <Peca forma="esfera" cor={COR_CLARA} position={[0, 0.56, 0.4]} scale={[0.4, 0.36, 0.2]} contorno={0} />
        </group>
        {[
          [-0.27, 0.1, 0.33],
          [0.27, 0.1, 0.33],
          [-0.42, 0.12, -0.12],
          [0.42, 0.12, -0.12],
        ].map((posicao) => (
          <Peca
            key={posicao.join()}
            forma="esfera"
            cor={COR_PELO}
            position={posicao as [number, number, number]}
            scale={[0.17, 0.12, 0.2]}
            contorno={0.18}
          />
        ))}

        <group ref={cabeca} position={[0, 1.42, 0]}>
          {[-1, 1].map((lado) => (
            <group key={lado} ref={lado < 0 ? orelhaEsquerda : orelhaDireita} position={[0.42 * lado, 0.72, -0.05]}>
              <Peca forma="cone" cor={COR_PELO} position={[0, 0.35, 0]} scale={[0.24, 0.7, 0.12]} contorno={0.07} />
              <Peca forma="cone" cor={COR_DETALHE} position={[0, 0.3, 0.07]} scale={[0.14, 0.46, 0.05]} contorno={0} />
            </group>
          ))}
          {[-1, 1].map((lado) => (
            <Peca
              key={lado}
              forma="cone"
              cor={COR_DETALHE}
              position={[0.2 * lado, 0.92, 0.16]}
              rotation={[-0.5, 0, -0.25 * lado]}
              scale={[0.085, 0.3, 0.085]}
              contorno={0.12}
            />
          ))}

          <Peca forma="esfera" cor={COR_PELO} position={[0, 0.18, 0]} scale={[0.82, 0.74, 0.74]} contorno={0.045} />
          {[-1, 1].map((lado) => (
            <Peca
              key={lado}
              forma="esfera"
              cor={COR_CLARA}
              position={[0.25 * lado, -0.1, 0.5]}
              scale={[0.25, 0.18, 0.2]}
              contorno={0}
            />
          ))}
          <Peca forma="esfera" cor={COR_CLARA} position={[0, -0.03, 0.6]} scale={[0.27, 0.2, 0.3]} contorno={0.05} />
          <Plana cor="#ff9ec7" position={[-0.56, 0.14, 0.5]} scale={[0.1, 0.065, 0.04]} transparente={0.75} />
          <Plana cor="#ff9ec7" position={[0.56, 0.14, 0.5]} scale={[0.1, 0.065, 0.04]} transparente={0.75} />

          <group ref={olhos}>
            <Olho x={-0.3} ref={olhoEsquerdo} />
            <Olho x={0.3} ref={olhoDireito} />
          </group>

          <Plana cor={COR_OLHO} position={[0, 0.05, 0.89]} scale={[0.075, 0.055, 0.05]} />
          <group ref={boca} position={[0, -0.08, 0.86]}>
            <mesh rotation={[0, 0, Math.PI]}>
              <torusGeometry args={[0.075, 0.016, 8, 24, Math.PI]} />
              <meshBasicMaterial color={COR_OLHO} />
            </mesh>
          </group>
          <mesh ref={bocaAberta} geometry={recursos.esfera} position={[0, -0.11, 0.85]}>
            <meshBasicMaterial color={COR_OLHO} />
          </mesh>
        </group>
      </group>
    </>
  );
}

function ZyreCena(props: Pick<Zyre3DProps, "estado" | "intensidade" | "gatilho" | "olhar">) {
  const recursos = useMemo(() => criarRecursos(), []);

  useEffect(
    () => () => {
      recursos.esfera.dispose();
      recursos.cone.dispose();
      recursos.chama.dispose();
      recursos.cauda.dispose();
      recursos.caudaContorno.dispose();
      recursos.gradiente.dispose();
      recursos.sombra.dispose();
    },
    [recursos]
  );

  return (
    <RecursosContext.Provider value={recursos}>
      <ZyreModelo {...props} />
    </RecursosContext.Provider>
  );
}

export default function Zyre3D({ compacto, pausado, onPronto, ...modelo }: Zyre3DProps) {
  return (
    <Canvas
      className="zyre-3d"
      flat
      dpr={[1, 2]}
      frameloop={pausado ? "never" : "always"}
      camera={{ position: [0.2, 0.9, compacto ? 5.6 : 6.4], fov: 30 }}
      onCreated={({ camera }) => {
        camera.lookAt(0.2, compacto ? 0.1 : 0.3, 0);
        onPronto();
      }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 4, 5]} intensity={2} />
      <directionalLight position={[-4, 1, -3]} intensity={0.8} color={COR_DETALHE} />
      <ZyreCena {...modelo} />
    </Canvas>
  );
}
