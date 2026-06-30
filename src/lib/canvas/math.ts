import type { Camera, Node, Point, Port } from "./types";

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function screenToWorld(
  screenX: number,
  screenY: number,
  camera: Camera,
): Point {
  return {
    x: (screenX - camera.x) / camera.zoom,
    y: (screenY - camera.y) / camera.zoom,
  };
}

export function worldToScreen(
  worldX: number,
  worldY: number,
  camera: Camera,
): Point {
  return {
    x: worldX * camera.zoom + camera.x,
    y: worldY * camera.zoom + camera.y,
  };
}

export function isPointInRect(point: Point, rect: Rect): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

export function getBezierCurve(
  from: Point,
  to: Point,
): { control1: Point; control2: Point } {
  const offset = Math.max(80, Math.abs(to.x - from.x) * 0.35);

  return {
    control1: {
      x: from.x + offset,
      y: from.y,
    },
    control2: {
      x: to.x - offset,
      y: to.y,
    },
  };
}

export function getPortPosition(node: Node, port: Port): Point {
  switch (port.position) {
    case "left":
      return {
        x: node.x,
        y: node.y + node.height / 2,
      };
    case "right":
      return {
        x: node.x + node.width,
        y: node.y + node.height / 2,
      };
    case "top":
      return {
        x: node.x + node.width / 2,
        y: node.y,
      };
    case "bottom":
      return {
        x: node.x + node.width / 2,
        y: node.y + node.height,
      };
  }
}

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
