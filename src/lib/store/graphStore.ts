"use client";

import { useSyncExternalStore } from "react";
import type { CanvasState, Edge, Node, Point } from "@/lib/canvas/types";

type GraphState = Pick<CanvasState, "edges" | "nodes" | "selectedNodeId"> & {
  selectedNodeId: string | null;
};

type GraphListener = () => void;

const initialState: GraphState = {
  selectedNodeId: "node-1",
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
};

let state = initialState;
const listeners = new Set<GraphListener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(nextState: GraphState) {
  state = nextState;
  emit();
}

export const graphStore = {
  getState: () => state,
  subscribe(listener: GraphListener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  selectNode(nodeId: string | null) {
    setState({ ...state, selectedNodeId: nodeId });
  },
  addNode(position: Point, color = "#ffffff") {
    const nextId = `node-${state.nodes.length + 1}`;
    const node: Node = {
      id: nextId,
      label: `Node ${state.nodes.length + 1}`,
      color,
      x: position.x,
      y: position.y,
      width: 168,
      height: 68,
    };

    setState({
      ...state,
      selectedNodeId: node.id,
      nodes: [...state.nodes, node],
    });
  },
  moveNode(nodeId: string, delta: Point) {
    setState({
      ...state,
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              x: node.x + delta.x,
              y: node.y + delta.y,
            }
          : node,
      ),
    });
  },
  setEdges(edges: Edge[]) {
    setState({ ...state, edges });
  },
};

export function useGraphStore<T>(selector: (nextState: GraphState) => T) {
  return useSyncExternalStore(
    graphStore.subscribe,
    () => selector(graphStore.getState()),
    () => selector(initialState),
  );
}
