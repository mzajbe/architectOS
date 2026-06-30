import type { Edge, Node } from "@/lib/canvas/types";

export const CANVAS_STORAGE_KEY = "architectos-canvas";

type StoredCanvas = {
  nodes: Node[];
  edges: Edge[];
};

export function saveCanvas(nodes: Node[], edges: Edge[]): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredCanvas = { nodes, edges };
  window.localStorage.setItem(CANVAS_STORAGE_KEY, JSON.stringify(payload));
}

export function loadCanvas(): StoredCanvas | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(CANVAS_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<StoredCanvas>;

    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
      return null;
    }

    return {
      nodes: parsed.nodes,
      edges: parsed.edges,
    };
  } catch {
    return null;
  }
}

export function clearCanvasStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(CANVAS_STORAGE_KEY);
}
