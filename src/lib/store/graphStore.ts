"use client";

import { create } from "zustand";
import type { Edge, Node } from "@/lib/canvas/types";

type GraphStore = {
  nodes: Node[];
  edges: Edge[];
  addNode: (node: Node) => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  deleteNode: (id: string) => void;
  addEdge: (edge: Edge) => void;
  deleteEdge: (id: string) => void;
};

export const useGraphStore = create<GraphStore>((set) => ({
  nodes: [
    {
      id: "node-1",
      label: "Site Strategy",
      color: "#ffffff",
      x: 96,
      y: 112,
      width: 180,
      height: 72,
    },
    {
      id: "node-2",
      label: "Spatial Program",
      color: "#ffffff",
      x: 404,
      y: 88,
      width: 190,
      height: 72,
    },
    {
      id: "node-3",
      label: "Material Logic",
      color: "#f8fafc",
      x: 398,
      y: 240,
      width: 190,
      height: 72,
    },
  ],
  edges: [
    {
      id: "edge-1",
      fromNodeId: "node-1",
      toNodeId: "node-2",
    },
    {
      id: "edge-2",
      fromNodeId: "node-1",
      toNodeId: "node-3",
    },
  ],
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
}));
