"use client";

import { RefObject, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

export const RATE_OPTIONS = [0.75, 1, 1.25, 1.5] as const;
export type PlaybackState = "idle" | "playing" | "paused";

const STORAGE_KEY_RATE = "codepath.audioRate";
const STORAGE_KEY_VOICE = "codepath.audioVoiceURI";
const CODE_PLACEHOLDER = "Veja o exemplo de código na tela.";
const HEADING_PAUSE_MS = 450;
const KEEP_ALIVE_MS = 10000;

const BLOCK_TAGS = new Set(["H1", "H2", "H3", "H4", "H5", "H6", "P", "LI", "BLOCKQUOTE", "PRE"]);

interface Segment {
  element: HTMLElement;
  text: string;
  pauseBefore: boolean;
}

function isPortugueseVoice(voice: SpeechSynthesisVoice): boolean {
  return /^pt[-_]?(br|pt)/i.test(voice.lang);
}

function subscribeNever() {
  return () => {};
}

function getSupportedSnapshot(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function getSupportedServerSnapshot(): boolean {
  return false;
}

function readSavedRate(): number {
  if (typeof window === "undefined") return 1;
  const saved = Number(window.localStorage.getItem(STORAGE_KEY_RATE));
  return (RATE_OPTIONS as readonly number[]).includes(saved) ? saved : 1;
}

function containsBlock(el: Element): boolean {
  return Array.from(el.children).some(
    (child) => BLOCK_TAGS.has(child.tagName) || containsBlock(child)
  );
}

function collectSegments(root: HTMLElement): Segment[] {
  const segments: Segment[] = [];

  function pushSegment(el: HTMLElement) {
    if (el.tagName === "PRE") {
      segments.push({ element: el, text: CODE_PLACEHOLDER, pauseBefore: false });
      return;
    }
    const text = el.textContent?.replace(/\s+/g, " ").trim() ?? "";
    if (!text) return;
    segments.push({ element: el, text, pauseBefore: /^H[1-6]$/.test(el.tagName) });
  }

  function walk(node: Element) {
    for (const child of Array.from(node.children)) {
      if (BLOCK_TAGS.has(child.tagName) && !containsBlock(child)) {
        pushSegment(child as HTMLElement);
      } else {
        walk(child);
      }
    }
  }

  walk(root);
  return segments;
}

export function useLessonAudio(containerRef: RefObject<HTMLDivElement | null>, lessonKey: string) {
  const supported = useSyncExternalStore(
    subscribeNever,
    getSupportedSnapshot,
    getSupportedServerSnapshot
  );
  const [state, setState] = useState<PlaybackState>("idle");
  const [rate, setRate] = useState<number>(readSavedRate);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState<string>("");
  const [hasPortugueseVoice, setHasPortugueseVoice] = useState(true);

  const segmentsRef = useRef<Segment[]>([]);
  const indexRef = useRef(0);
  const generationRef = useRef(0);
  const stateRef = useRef<PlaybackState>("idle");
  const rateRef = useRef(rate);
  const voiceURIRef = useRef(voiceURI);
  const voicesRef = useRef(voices);
  const keepAliveRef = useRef<number | null>(null);

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);
  useEffect(() => {
    voiceURIRef.current = voiceURI;
  }, [voiceURI]);
  useEffect(() => {
    voicesRef.current = voices;
  }, [voices]);

  useEffect(() => {
    if (!supported) return;

    function loadVoices() {
      const all = window.speechSynthesis.getVoices();
      if (!all.length) return;
      const pt = all.filter(isPortugueseVoice);
      const list = pt.length ? pt : all;
      setVoices(list);
      setHasPortugueseVoice(pt.length > 0);

      const saved = window.localStorage.getItem(STORAGE_KEY_VOICE);
      if (saved && list.some((v) => v.voiceURI === saved)) {
        setVoiceURI(saved);
      } else {
        setVoiceURI(list[0].voiceURI);
      }
    }

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, [supported]);

  const clearHighlight = useCallback(() => {
    segmentsRef.current.forEach((s) => s.element.classList.remove("audio-reading-active"));
  }, []);

  const highlight = useCallback(
    (idx: number) => {
      clearHighlight();
      const seg = segmentsRef.current[idx];
      if (seg) {
        seg.element.classList.add("audio-reading-active");
        seg.element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    },
    [clearHighlight]
  );

  const stopKeepAlive = useCallback(() => {
    if (keepAliveRef.current !== null) {
      window.clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  }, []);

  const startKeepAlive = useCallback(() => {
    stopKeepAlive();
    keepAliveRef.current = window.setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, KEEP_ALIVE_MS);
  }, [stopKeepAlive]);

  const speakFromRef = useRef<(idx: number) => void>(() => {});

  const speakFrom = useCallback(
    (idx: number) => {
      const segs = segmentsRef.current;
      if (idx >= segs.length) {
        setState("idle");
        stateRef.current = "idle";
        clearHighlight();
        return;
      }

      const gen = generationRef.current;
      const seg = segs[idx];
      indexRef.current = idx;

      const startUtterance = () => {
        if (gen !== generationRef.current) return;
        const utterance = new SpeechSynthesisUtterance(seg.text);
        utterance.lang = "pt-BR";
        utterance.rate = rateRef.current;
        const voice = voicesRef.current.find((v) => v.voiceURI === voiceURIRef.current);
        if (voice) utterance.voice = voice;

        utterance.onend = () => {
          if (gen !== generationRef.current) return;
          speakFromRef.current(idx + 1);
        };
        utterance.onerror = () => {
          if (gen !== generationRef.current) return;
          speakFromRef.current(idx + 1);
        };

        highlight(idx);
        window.speechSynthesis.speak(utterance);
      };

      if (seg.pauseBefore) {
        window.setTimeout(startUtterance, HEADING_PAUSE_MS);
      } else {
        startUtterance();
      }
    },
    [clearHighlight, highlight]
  );

  useEffect(() => {
    speakFromRef.current = speakFrom;
  }, [speakFrom]);

  const play = useCallback(() => {
    if (!supported) return;

    if (stateRef.current === "paused") {
      window.speechSynthesis.resume();
      setState("playing");
      stateRef.current = "playing";
      startKeepAlive();
      return;
    }

    if (!segmentsRef.current.length && containerRef.current) {
      segmentsRef.current = collectSegments(containerRef.current);
    }
    if (!segmentsRef.current.length) return;

    generationRef.current += 1;
    window.speechSynthesis.cancel();
    setState("playing");
    stateRef.current = "playing";
    startKeepAlive();
    speakFrom(0);
  }, [containerRef, speakFrom, startKeepAlive, supported]);

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setState("paused");
    stateRef.current = "paused";
    stopKeepAlive();
  }, [stopKeepAlive, supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    generationRef.current += 1;
    window.speechSynthesis.cancel();
    setState("idle");
    stateRef.current = "idle";
    clearHighlight();
    stopKeepAlive();
  }, [clearHighlight, stopKeepAlive, supported]);

  const changeRate = useCallback(
    (newRate: number) => {
      setRate(newRate);
      rateRef.current = newRate;
      if (supported) window.localStorage.setItem(STORAGE_KEY_RATE, String(newRate));

      if (stateRef.current !== "idle") {
        generationRef.current += 1;
        window.speechSynthesis.cancel();
        const resumeIdx = indexRef.current;
        setState("playing");
        stateRef.current = "playing";
        speakFrom(resumeIdx);
      }
    },
    [speakFrom, supported]
  );

  const changeVoice = useCallback(
    (uri: string) => {
      setVoiceURI(uri);
      voiceURIRef.current = uri;
      if (supported) window.localStorage.setItem(STORAGE_KEY_VOICE, uri);

      if (stateRef.current !== "idle") {
        generationRef.current += 1;
        window.speechSynthesis.cancel();
        const resumeIdx = indexRef.current;
        setState("playing");
        stateRef.current = "playing";
        speakFrom(resumeIdx);
      }
    },
    [speakFrom, supported]
  );

  // Para a leitura ao trocar de aula ou desmontar o componente.
  useEffect(() => {
    return () => {
      generationRef.current += 1;
      segmentsRef.current = [];
      stopKeepAlive();
      if (supported) {
        clearHighlight();
        window.speechSynthesis.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonKey, supported]);

  return {
    supported,
    state,
    rate,
    voices,
    voiceURI,
    hasPortugueseVoice,
    play,
    pause,
    stop,
    changeRate,
    changeVoice,
  };
}
