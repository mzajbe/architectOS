"use client";

import { useEffect, useRef } from "react";
import type { PointerEvent, WheelEvent } from "react";
import { panBy, screenToWorld, zoomAt } from "@/lib/canvas/camera";
import { renderGraph } from "@/lib/canvas/engine";
import { hitTestNodes } from "@/lib/canvas/math";
import type { Point } from "@/lib/canvas/types";
import { graphStore, useGraphStore } from "@/lib/store/graphStore";
import { uiStore, useUIStore } from "@/lib/store/uiStore";
import { useCanvas } from "@/hooks/useCanvas";

type DragState =
  | {
      mode: "node";
      nodeId: string;
      lastPoint: Point;
    }
  | {
      mode: "pan";
      lastPoint: Point;
    }
  | null;

export function CanvasRenderer() {
  const { canvasRef, size } = useCanvas();
  const nodes = useGraphStore((state) => state.nodes);
  const edges = useGraphStore((state) => state.edges);
  const selectedNodeId = useGraphStore((state) => state.selectedNodeId);
  const activeTool = useUIStore((state) => state.activeTool);
  const camera = useUIStore((state) => state.camera);
  const dragState = useRef<DragState>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx || size.width === 0 || size.height === 0) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderGraph(ctx, size, camera, nodes, edges, selectedNodeId);
  }, [camera, canvasRef, edges, nodes, selectedNodeId, size]);

  const getCanvasPoint = (
    event: PointerEvent<HTMLCanvasElement> | WheelEvent<HTMLCanvasElement>,
  ): Point => {
    const rect = event.currentTarget.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);

    const screenPoint = getCanvasPoint(event);

    if (activeTool === "pan") {
      dragState.current = { mode: "pan", lastPoint: screenPoint };
      return;
    }

    const worldPoint = screenToWorld(screenPoint, camera);

    if (activeTool === "add-node") {
      graphStore.addNode({
        x: worldPoint.x - 84,
        y: worldPoint.y - 34,
      });
      uiStore.setActiveTool("select");
      return;
    }

    const hitNode = hitTestNodes(worldPoint, graphStore.getState().nodes);
    graphStore.selectNode(hitNode?.id ?? null);

    if (hitNode) {
      dragState.current = {
        mode: "node",
        nodeId: hitNode.id,
        lastPoint: screenPoint,
      };
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    const drag = dragState.current;

    if (!drag) {
      return;
    }

    const screenPoint = getCanvasPoint(event);
    const delta = {
      x: screenPoint.x - drag.lastPoint.x,
      y: screenPoint.y - drag.lastPoint.y,
    };

    if (drag.mode === "pan") {
      uiStore.setCamera(panBy(uiStore.getState().camera, delta));
    } else {
      const nextCamera = uiStore.getState().camera;
      graphStore.moveNode(drag.nodeId, {
        x: delta.x / nextCamera.zoom,
        y: delta.y / nextCamera.zoom,
      });
    }

    dragState.current = { ...drag, lastPoint: screenPoint };
  };

  const handlePointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    dragState.current = null;
  };

  return (
    <canvas
      className="block h-full w-full cursor-crosshair touch-none"
      onPointerCancel={handlePointerUp}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={(event) => {
        event.preventDefault();
        const point = getCanvasPoint(event);
        const factor = event.deltaY > 0 ? 0.92 : 1.08;
        uiStore.setCamera(zoomAt(uiStore.getState().camera, point, factor));
      }}
      ref={canvasRef}
    />
  );
}
