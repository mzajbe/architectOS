"use client";

import { create } from "zustand";
import type { Edge, Node } from "@/lib/canvas/types";
import { clearCanvasStorage, loadCanvas, saveCanvas } from "@/lib/storage";

type GraphStore = {
  nodes: Node[];
  edges: Edge[];
  addNode: (node: Node) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  deleteNode: (id: string) => void;
  addEdge: (edge: Edge) => void;
  deleteEdge: (id: string) => void;
  clearCanvas: () => void;
};

const savedCanvas = loadCanvas();

export const useGraphStore = create<GraphStore>((set) => ({
  nodes: savedCanvas?.nodes ?? [],
  edges: savedCanvas?.edges ?? [],
  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),
  updateNode: (id, updates) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, ...updates } : node,
      ),
    })),
  deleteNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter(
        (edge) => edge.fromNodeId !== id && edge.toNodeId !== id,
      ),
    })),
  addEdge: (edge) =>
    set((state) => ({
      edges: [...state.edges, edge],
    })),
  deleteEdge: (id) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
    })),
  clearCanvas: () => {
    skipNextPersist = true;
    clearCanvasStorage();
    set({ nodes: [], edges: [] });
  },
}));

let persistTimer: ReturnType<typeof setTimeout> | null = null;
let skipNextPersist = false;

useGraphStore.subscribe((state) => {
  if (typeof window === "undefined") {
    return;
  }

  if (persistTimer) {
    clearTimeout(persistTimer);
  }

  persistTimer = setTimeout(() => {
    persistTimer = null;

    if (
      skipNextPersist &&
      state.nodes.length === 0 &&
      state.edges.length === 0
    ) {
      skipNextPersist = false;
      return;
    }

    skipNextPersist = false;
    saveCanvas(state.nodes, state.edges);
  }, 500);
});
