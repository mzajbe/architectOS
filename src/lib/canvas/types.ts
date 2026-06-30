export interface Point {
  x: number;
  y: number;
}

export interface Node {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  color: string;
}

export interface Port {
  id: string;
  nodeId: string;
  position: "left" | "right" | "top" | "bottom";
  type: "input" | "output";
}

export interface Edge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  fromPortId?: string;
  toPortId?: string;
}

export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export interface DraggingEdge {
  fromPort: Port;
  currentX: number;
  currentY: number;
}

export interface CanvasState {
  nodes: Node[];
  edges: Edge[];
  camera: Camera;
  selectedNodeId: string | null;
  activeTool: "select" | "add-node" | "pan";
  draggingEdge: DraggingEdge | null;
}
