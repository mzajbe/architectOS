"use client";

import { useEffect, useRef } from "react";
import type { PointerEvent, WheelEvent } from "react";
import { renderGraph } from "@/lib/canvas/engine";
import { generateId, isPointInRect, screenToWorld } from "@/lib/canvas/math";
import type { Point } from "@/lib/canvas/types";
import { useGraphStore } from "@/lib/store/graphStore";
import { useUIStore } from "@/lib/store/uiStore";
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
  const activeTool = useUIStore((state) => state.activeTool);
  const camera = useUIStore((state) => state.camera);
  const selectedNodeId = useUIStore((state) => state.selectedNodeId);
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

    const worldPoint = screenToWorld(screenPoint.x, screenPoint.y, camera);

    if (activeTool === "add-node") {
      const nodeCount = useGraphStore.getState().nodes.length;
      const nextId = generateId();

      useGraphStore.getState().addNode({
        id: nextId,
        label: `Node ${nodeCount + 1}`,
        color: "#ffffff",
        x: worldPoint.x - 84,
        y: worldPoint.y - 34,
        width: 168,
        height: 68,
      });
      useUIStore.getState().setSelectedNodeId(nextId);
      useUIStore.getState().setActiveTool("select");
      return;
    }

    const hitNode = [...useGraphStore.getState().nodes]
      .reverse()
      .find((node) =>
        isPointInRect(worldPoint, {
          x: node.x,
          y: node.y,
          width: node.width,
          height: node.height,
        }),
      );
    useUIStore.getState().setSelectedNodeId(hitNode?.id ?? null);

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
      useUIStore.getState().panCamera(delta.x, delta.y);
    } else {
      const nextCamera = useUIStore.getState().camera;
      const node = useGraphStore
        .getState()
        .nodes.find((currentNode) => currentNode.id === drag.nodeId);

      if (!node) {
        return;
      }

      useGraphStore.getState().updateNode(drag.nodeId, {
        x: node.x + delta.x / nextCamera.zoom,
        y: node.y + delta.y / nextCamera.zoom,
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
        const delta = event.deltaY > 0 ? -0.08 : 0.08;
        useUIStore.getState().zoomCamera(delta, point.x, point.y);
      }}
      ref={canvasRef}
    />
  );
}
