"use client";

import { RefObject, useEffect, useState } from "react";
import { CanvasEngine } from "@/lib/canvas/engine";
import { useGraphStore } from "@/lib/store/graphStore";
import { useUIStore } from "@/lib/store/uiStore";

export function useCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
): CanvasEngine | null {
  const [engine, setEngine] = useState<CanvasEngine | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const canvasEngine = new CanvasEngine(canvas);

    const updateEngine = () => {
      const graphState = useGraphStore.getState();
      const uiState = useUIStore.getState();

      canvasEngine.updateState(
        graphState.nodes,
        graphState.edges,
        uiState.camera,
        uiState.selectedNodeId,
        uiState.draggingEdge,
      );
    };

    updateEngine();
    setEngine(canvasEngine);

    const unsubscribeGraph = useGraphStore.subscribe(updateEngine);
    const unsubscribeUI = useUIStore.subscribe(updateEngine);

    return () => {
      unsubscribeGraph();
      unsubscribeUI();
      canvasEngine.destroy();
      setEngine(null);
    };
  }, [canvasRef]);

  return engine;
}
