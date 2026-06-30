import { getBezierCurve, isPointInRect, screenToWorld } from "./math";
import type { Camera, Edge, Node, Point } from "./types";

type Size = {
  width: number;
  height: number;
};

const GRID_SPACING = 32;
const NODE_RADIUS = 8;
const EMPTY_MESSAGE = "Click 'Add Node' or press 'N' to create your first node";

export class CanvasEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private camera: Camera;
  private nodes: Node[];
  private edges: Edge[];
  private selectedNodeId: string | null;
  private width = 1;
  private height = 1;
  private resizeHandler: () => void;

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas 2D context is not available.");
    }

    this.canvas = canvas;
    this.ctx = ctx;
    this.camera = { x: 0, y: 0, zoom: 1 };
    this.nodes = [];
    this.edges = [];
    this.selectedNodeId = null;
    this.resizeHandler = () => {
      this.resize();
      this.render();
    };

    this.resize();
    window.addEventListener("resize", this.resizeHandler);
  }

  updateState(
    nodes: Node[],
    edges: Edge[],
    camera: Camera,
    selectedNodeId: string | null,
  ): void {
    this.nodes = nodes;
    this.edges = edges;
    this.camera = camera;
    this.selectedNodeId = selectedNodeId;
    this.render();
  }

  hitTest(screenX: number, screenY: number): Node | null {
    const point = screenToWorld(screenX, screenY, this.camera);

    for (let index = this.nodes.length - 1; index >= 0; index -= 1) {
      const node = this.nodes[index];

      if (isPointInRect(point, node)) {
        return node;
      }
    }

    return null;
  }

  destroy(): void {
    window.removeEventListener("resize", this.resizeHandler);
  }

  private resize(): void {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.width = Math.max(1, Math.floor(rect.width));
    this.height = Math.max(1, Math.floor(rect.height));
    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private render(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawGrid();

    if (this.nodes.length === 0) {
      this.drawEmptyState();
    }

    this.ctx.save();
    this.ctx.translate(this.camera.x, this.camera.y);
    this.ctx.scale(this.camera.zoom, this.camera.zoom);
    this.drawEdges();
    this.drawNodes();
    this.ctx.restore();
  }

  private drawGrid(): void {
    const spacing = GRID_SPACING * this.camera.zoom;
    const offsetX = positiveModulo(this.camera.x, spacing);
    const offsetY = positiveModulo(this.camera.y, spacing);

    this.ctx.save();
    this.ctx.fillStyle = "rgba(100, 116, 139, 0.28)";

    for (let x = offsetX; x < this.width; x += spacing) {
      for (let y = offsetY; y < this.height; y += spacing) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 1, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    this.ctx.restore();
  }

  private drawEdges(): void {
    this.ctx.save();
    this.ctx.strokeStyle = "#64748b";
    this.ctx.lineWidth = 2 / this.camera.zoom;

    for (const edge of this.edges) {
      const from = this.nodes.find((node) => node.id === edge.fromNodeId);
      const to = this.nodes.find((node) => node.id === edge.toNodeId);

      if (!from || !to) {
        continue;
      }

      const start = getNodeCenter(from);
      const end = getNodeCenter(to);
      const { control1, control2 } = getBezierCurve(start, end);

      this.ctx.beginPath();
      this.ctx.moveTo(start.x, start.y);
      this.ctx.bezierCurveTo(
        control1.x,
        control1.y,
        control2.x,
        control2.y,
        end.x,
        end.y,
      );
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  private drawNodes(): void {
    for (const node of this.nodes) {
      const isSelected = node.id === this.selectedNodeId;

      this.ctx.save();
      this.ctx.shadowColor = "rgba(15, 23, 42, 0.14)";
      this.ctx.shadowBlur = 16;
      this.ctx.shadowOffsetY = 8;
      roundedRect(this.ctx, node.x, node.y, node.width, node.height, NODE_RADIUS);
      this.ctx.fillStyle = node.color;
      this.ctx.fill();

      this.ctx.shadowColor = "transparent";
      this.ctx.lineWidth = isSelected ? 3 / this.camera.zoom : 1 / this.camera.zoom;
      this.ctx.strokeStyle = isSelected ? "#2563eb" : "#cbd5e1";
      this.ctx.stroke();

      this.ctx.fillStyle = "#0f172a";
      this.ctx.font = "600 15px Arial, Helvetica, sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(
        node.label,
        node.x + node.width / 2,
        node.y + node.height / 2,
        node.width - 24,
      );

      this.ctx.restore();
    }
  }

  private drawEmptyState(): void {
    this.ctx.save();
    this.ctx.fillStyle = "rgba(15, 23, 42, 0.68)";
    this.ctx.font =
      "500 15px system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(EMPTY_MESSAGE, this.width / 2, this.height / 2);
    this.ctx.restore();
  }
}

export function renderGraph(
  ctx: CanvasRenderingContext2D,
  canvasSize: Size,
  camera: Camera,
  nodes: Node[],
  edges: Edge[],
  selectedNodeId: string | null,
) {
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
  drawGridLines(ctx, canvasSize, camera);

  ctx.save();
  ctx.translate(camera.x, camera.y);
  ctx.scale(camera.zoom, camera.zoom);

  edges.forEach((edge) => drawEdge(ctx, edge, nodes, camera));
  nodes.forEach((node) => drawNode(ctx, node, node.id === selectedNodeId, camera));

  ctx.restore();
}

function drawGridLines(
  ctx: CanvasRenderingContext2D,
  canvasSize: Size,
  camera: Camera,
) {
  const spacing = GRID_SPACING * camera.zoom;
  const offsetX = positiveModulo(camera.x, spacing);
  const offsetY = positiveModulo(camera.y, spacing);

  ctx.save();
  ctx.strokeStyle = "rgba(100, 116, 139, 0.18)";
  ctx.lineWidth = 1;

  for (let x = offsetX; x < canvasSize.width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasSize.height);
    ctx.stroke();
  }

  for (let y = offsetY; y < canvasSize.height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasSize.width, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawEdge(
  ctx: CanvasRenderingContext2D,
  edge: Edge,
  nodes: Node[],
  camera: Camera,
) {
  const from = nodes.find((node) => node.id === edge.fromNodeId);
  const to = nodes.find((node) => node.id === edge.toNodeId);

  if (!from || !to) {
    return;
  }

  const start = getNodeCenter(from);
  const end = getNodeCenter(to);
  const { control1, control2 } = getBezierCurve(start, end);

  ctx.save();
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 2 / camera.zoom;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, end.x, end.y);
  ctx.stroke();
  ctx.restore();
}

function drawNode(
  ctx: CanvasRenderingContext2D,
  node: Node,
  isSelected: boolean,
  camera: Camera,
) {
  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.14)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 8;
  roundedRect(ctx, node.x, node.y, node.width, node.height, NODE_RADIUS);
  ctx.fillStyle = node.color;
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.lineWidth = isSelected ? 3 / camera.zoom : 1 / camera.zoom;
  ctx.strokeStyle = isSelected ? "#2563eb" : "#cbd5e1";
  ctx.stroke();

  ctx.fillStyle = "#0f172a";
  ctx.font = "600 15px Arial, Helvetica, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(
    node.label,
    node.x + node.width / 2,
    node.y + node.height / 2,
    node.width - 24,
  );

  ctx.restore();
}

function getNodeCenter(node: Node): Point {
  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  };
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function positiveModulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}
