"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent, WheelEvent } from "react";
import { clampZoom } from "@/lib/canvas/camera";
import { generateId, screenToWorld } from "@/lib/canvas/math";
import type { Camera, Point } from "@/lib/canvas/types";
import { useGraphStore } from "@/lib/store/graphStore";
import { useUIStore } from "@/lib/store/uiStore";
import { useCanvas } from "../../hooks/useCanvas";
import { useKeyboard } from "../../hooks/useKeyboard";

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
const ZOOM_ANIMATION_MS = 140;

export function CanvasContainer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engine = useCanvas(canvasRef);
  const activeTool = useUIStore((state) => state.activeTool);
  const dragState = useRef<DragState>(null);
  const zoomAnimationRef = useRef<number | null>(null);
  const [dragMode, setDragMode] = useState<"node" | "pan" | null>(null);
  const [hoveredPortId, setHoveredPortId] = useState<string | null>(null);

  useKeyboard();

  useEffect(() => {
    return () => {
      if (zoomAnimationRef.current !== null) {
        cancelAnimationFrame(zoomAnimationRef.current);
      }
    };
  }, []);

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
      setDragMode("pan");
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
        setDragMode("node");
      }
    }
  };

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    const drag = dragState.current;
    const screenPoint = getCanvasPoint(event);

    if (!drag) {
      const port = engine?.hitTestPort(screenPoint.x, screenPoint.y) ?? null;
      setHoveredPortId(port?.id ?? null);
      return;
    }

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
        setDragMode(null);
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
    setDragMode(null);
    setHoveredPortId(null);
    engine?.hitTestPort(Number.NaN, Number.NaN);
  };

  const animateZoom = (delta: number, center: Point) => {
    if (zoomAnimationRef.current !== null) {
      cancelAnimationFrame(zoomAnimationRef.current);
    }

    const { camera, setCamera } = useUIStore.getState();
    const fromCamera = camera;
    const targetCamera = getZoomTarget(camera, delta, center);
    const startedAt = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / ZOOM_ANIMATION_MS);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCamera({
        x: lerp(fromCamera.x, targetCamera.x, eased),
        y: lerp(fromCamera.y, targetCamera.y, eased),
        zoom: lerp(fromCamera.zoom, targetCamera.zoom, eased),
      });

      if (progress < 1) {
        zoomAnimationRef.current = requestAnimationFrame(tick);
      } else {
        zoomAnimationRef.current = null;
      }
    };

    zoomAnimationRef.current = requestAnimationFrame(tick);
  };

  const handleWheel = (event: WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();

    const point = getCanvasPoint(event);
    const delta = event.deltaY > 0 ? -0.12 : 0.12;

    animateZoom(delta, point);
  };

  const cursor =
    hoveredPortId
      ? "crosshair"
      : dragMode === "pan"
      ? "grabbing"
      : dragMode === "node"
        ? "grabbing"
        : activeTool === "pan"
          ? "grab"
          : activeTool === "add-node"
            ? "copy"
            : "default";

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
        cursor,
        touchAction: "none",
      }}
    />
  );
}

function getZoomTarget(camera: Camera, delta: number, center: Point): Camera {
  const zoom = clampZoom(camera.zoom + delta);
  const worldX = (center.x - camera.x) / camera.zoom;
  const worldY = (center.y - camera.y) / camera.zoom;

  return {
    zoom,
    x: center.x - worldX * zoom,
    y: center.y - worldY * zoom,
  };
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}
