export type NodeKind = "idea" | "task" | "decision";

export type CanvasTool = "select" | "add-node" | "pan";

export type Point = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Rect = Point & Size;

export type CameraState = Point & {
  zoom: number;
};

export type GraphNode = {
  id: string;
  label: string;
  kind: NodeKind;
  position: Point;
  size: Size;
};

export type GraphEdge = {
  id: string;
  from: string;
  to: string;
  label?: string;
};

export type GraphSnapshot = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};
