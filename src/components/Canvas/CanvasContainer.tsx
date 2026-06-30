"use client";

import { useRef } from "react";
import type { MouseEvent, WheelEvent } from "react";
import { useCanvas } from "@/hooks/useCanvas";
import { useKeyboard } from "@/hooks/useKeyboard";
import { generateId, screenToWorld } from "@/lib/canvas/math";
import type { Point } from "@/lib/canvas/types";
import { useGraphStore } from "@/lib/store/graphStore";
import { useUIStore } from "@/lib/store/uiStore";

type DragState =
  | {
      mode: "pan";
      lastPoint: Point;
    }
  | {
      mode: "node";
      nodeId: string;
      lastPoint: Point;
    }
  | null;

const NODE_WIDTH = 168;
const NODE_HEIGHT = 68;

export function CanvasContainer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engine = useCanvas(canvasRef);
  const activeTool = useUIStore((state) => state.activeTool);
  const dragState = useRef<DragState>(null);

  useKeyboard();

  const getCanvasPoint = (
    event: MouseEvent<HTMLCanvasElement> | WheelEvent<HTMLCanvasElement>,
  ): Point => {
    const rect = event.currentTarget.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    const screenPoint = getCanvasPoint(event);
    const {
      activeTool: currentTool,
      camera,
      setActiveTool,
      setSelectedNodeId,
    } = useUIStore.getState();

    if (currentTool === "pan") {
      dragState.current = { mode: "pan", lastPoint: screenPoint };
      return;
    }

    if (currentTool === "add-node") {
      const worldPoint = screenToWorld(screenPoint.x, screenPoint.y, camera);
      const nodeId = generateId();
      const nodeCount = useGraphStore.getState().nodes.length;

      useGraphStore.getState().addNode({
        id: nodeId,
        x: worldPoint.x - NODE_WIDTH / 2,
        y: worldPoint.y - NODE_HEIGHT / 2,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        label: `Node ${nodeCount + 1}`,
        color: "#ffffff",
      });
      setSelectedNodeId(nodeId);
      setActiveTool("select");
      return;
    }

    if (currentTool === "select") {
      const hitNode = engine?.hitTest(screenPoint.x, screenPoint.y) ?? null;

      setSelectedNodeId(hitNode?.id ?? null);

      if (hitNode) {
        dragState.current = {
          mode: "node",
          nodeId: hitNode.id,
          lastPoint: screenPoint,
        };
      }
    }
  };

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const drag = dragState.current;

    if (!drag) {
      return;
    }

    const screenPoint = getCanvasPoint(event);
    const dx = screenPoint.x - drag.lastPoint.x;
    const dy = screenPoint.y - drag.lastPoint.y;

    if (drag.mode === "pan") {
      useUIStore.getState().panCamera(dx, dy);
    } else {
      const camera = useUIStore.getState().camera;
      const node = useGraphStore
        .getState()
        .nodes.find((currentNode) => currentNode.id === drag.nodeId);

      if (!node) {
        dragState.current = null;
        return;
      }

      useGraphStore.getState().updateNode(drag.nodeId, {
        x: node.x + dx / camera.zoom,
        y: node.y + dy / camera.zoom,
      });
    }

    dragState.current = { ...drag, lastPoint: screenPoint };
  };

  const stopDrag = () => {
    dragState.current = null;
  };

  const handleWheel = (event: WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();

    const point = getCanvasPoint(event);
    const delta = event.deltaY > 0 ? -0.08 : 0.08;

    useUIStore.getState().zoomCamera(delta, point.x, point.y);
  };

  return (
    <canvas
      className="block h-full w-full bg-slate-100"
      onMouseDown={handleMouseDown}
      onMouseLeave={stopDrag}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrag}
      onWheel={handleWheel}
      ref={canvasRef}
      style={{
        cursor: activeTool === "pan" ? "grab" : "crosshair",
        touchAction: "none",
      }}
    />
  );
}
