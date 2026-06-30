import type { GraphNode, Point, Rect } from "./types";

export function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function getNodeBounds(node: GraphNode): Rect {
  return {
    x: node.position.x,
    y: node.position.y,
    width: node.size.width,
    height: node.size.height,
  };
}

export function getNodeCenter(node: GraphNode): Point {
  return {
    x: node.position.x + node.size.width / 2,
    y: node.position.y + node.size.height / 2,
  };
}

export function pointInRect(point: Point, rect: Rect) {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

export function hitTestNodes(point: Point, nodes: GraphNode[]) {
  for (let index = nodes.length - 1; index >= 0; index -= 1) {
    const node = nodes[index];

    if (pointInRect(point, getNodeBounds(node))) {
      return node;
    }
  }

  return null;
}

export function cubicBezierPoint(
  start: Point,
  controlA: Point,
  controlB: Point,
  end: Point,
  t: number,
): Point {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;

  return {
    x:
      uu * u * start.x +
      3 * uu * t * controlA.x +
      3 * u * tt * controlB.x +
      tt * t * end.x,
    y:
      uu * u * start.y +
      3 * uu * t * controlA.y +
      3 * u * tt * controlB.y +
      tt * t * end.y,
  };
}
