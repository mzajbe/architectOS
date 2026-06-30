"use client";

import { create } from "zustand";
import { clampZoom } from "@/lib/canvas/camera";
import type { Camera, CanvasState } from "@/lib/canvas/types";

type ActiveTool = CanvasState["activeTool"];

type UIStore = {
  camera: Camera;
  selectedNodeId: string | null;
  activeTool: ActiveTool;
  setCamera: (camera: Camera) => void;
  panCamera: (dx: number, dy: number) => void;
  zoomCamera: (delta: number, centerX: number, centerY: number) => void;
  setSelectedNodeId: (id: string | null) => void;
  setActiveTool: (tool: ActiveTool) => void;
};

const initialCamera: Camera = { x: 0, y: 0, zoom: 1 };

export const useUIStore = create<UIStore>((set) => ({
  camera: initialCamera,
  selectedNodeId: "node-1",
  activeTool: "select",
  setCamera: (camera) => set({ camera }),
  panCamera: (dx, dy) =>
    set((state) => ({
      camera: {
        ...state.camera,
        x: state.camera.x + dx,
        y: state.camera.y + dy,
      },
    })),
  zoomCamera: (delta, centerX, centerY) =>
    set((state) => {
      const nextZoom = clampZoom(state.camera.zoom + delta);
      const worldX = (centerX - state.camera.x) / state.camera.zoom;
      const worldY = (centerY - state.camera.y) / state.camera.zoom;

      return {
        camera: {
          zoom: nextZoom,
          x: centerX - worldX * nextZoom,
          y: centerY - worldY * nextZoom,
        },
      };
    }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setActiveTool: (tool) => set({ activeTool: tool }),
}));
