"use client";

import { useSyncExternalStore } from "react";
import type { GraphEdge, GraphNode, GraphSnapshot, NodeKind, Point } from "@/lib/canvas/types";

type GraphState = GraphSnapshot & {
  selectedNodeId: string | null;
};

type GraphListener = () => void;

const initialState: GraphState = {
  selectedNodeId: "node-1",
  nodes: [
    {
      id: "node-1",
      label: "Site Strategy",
      kind: "idea",
      position: { x: 96, y: 112 },
      size: { width: 180, height: 72 },
    },
    {
      id: "node-2",
      label: "Spatial Program",
      kind: "task",
      position: { x: 404, y: 88 },
      size: { width: 190, height: 72 },
    },
    {
      id: "node-3",
      label: "Material Logic",
      kind: "decision",
      position: { x: 398, y: 240 },
      size: { width: 190, height: 72 },
    },
  ],
  edges: [
    {
      id: "edge-1",
      from: "node-1",
      to: "node-2",
    },
    {
      id: "edge-2",
      from: "node-1",
      to: "node-3",
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
  addNode(position: Point, kind: NodeKind = "idea") {
    const nextId = `node-${state.nodes.length + 1}`;
    const node: GraphNode = {
      id: nextId,
      label: `Node ${state.nodes.length + 1}`,
      kind,
      position,
      size: { width: 168, height: 68 },
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
              position: {
                x: node.position.x + delta.x,
                y: node.position.y + delta.y,
              },
            }
          : node,
      ),
    });
  },
  setEdges(edges: GraphEdge[]) {
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
