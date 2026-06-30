import { getNodeCenter } from "./math";
import type { Camera, Edge, Node } from "./types";

type Size = {
  width: number;
  height: number;
};

const NODE_RADIUS = 8;

export function renderGraph(
  ctx: CanvasRenderingContext2D,
  canvasSize: Size,
  camera: Camera,
  nodes: Node[],
  edges: Edge[],
  selectedNodeId: string | null,
) {
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
  drawGrid(ctx, canvasSize, camera);

  ctx.save();
  ctx.translate(camera.x, camera.y);
  ctx.scale(camera.zoom, camera.zoom);

  edges.forEach((edge) => drawEdge(ctx, edge, nodes));
  nodes.forEach((node) => drawNode(ctx, node, node.id === selectedNodeId));

  ctx.restore();
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  canvasSize: Size,
  camera: Camera,
) {
  const spacing = 32 * camera.zoom;
  const offsetX = camera.x % spacing;
  const offsetY = camera.y % spacing;

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
) {
  const from = nodes.find((node) => node.id === edge.fromNodeId);
  const to = nodes.find((node) => node.id === edge.toNodeId);

  if (!from || !to) {
    return;
  }

  const start = getNodeCenter(from);
  const end = getNodeCenter(to);
  const controlOffset = Math.max(80, Math.abs(end.x - start.x) * 0.35);

  ctx.save();
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.bezierCurveTo(
    start.x + controlOffset,
    start.y,
    end.x - controlOffset,
    end.y,
    end.x,
    end.y,
  );
  ctx.stroke();
  ctx.restore();
}

function drawNode(
  ctx: CanvasRenderingContext2D,
  node: Node,
  isSelected: boolean,
) {
  const { height, width, x, y } = node;

  ctx.save();
  ctx.shadowColor = "rgba(15, 23, 42, 0.14)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 8;
  roundedRect(ctx, x, y, width, height, NODE_RADIUS);
  ctx.fillStyle = node.color;
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.lineWidth = isSelected ? 3 : 1;
  ctx.strokeStyle = isSelected ? "#2563eb" : "#cbd5e1";
  ctx.stroke();

  ctx.fillStyle = "#0f172a";
  ctx.font = "600 15px Arial, Helvetica, sans-serif";
  ctx.textBaseline = "middle";
  ctx.fillText(node.label, x + 18, y + height / 2);

  ctx.restore();
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
