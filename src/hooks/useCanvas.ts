"use client";

import { useEffect, useRef, useState } from "react";
import { CanvasEngine } from "@/lib/canvas/engine";

type Size = {
  width: number;
  height: number;
};

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<CanvasEngine | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;

    if (!canvas || !parent) {
      return;
    }

    const engine = new CanvasEngine(canvas);
    engineRef.current = engine;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));

      setSize({ width, height });
    };

    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(parent);

    return () => {
      observer.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  return { canvasRef, engineRef, size };
}
