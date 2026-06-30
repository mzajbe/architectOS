import type { Node, Point } from "./types";

type Rect = Point & {
  width: number;
  height: number;
};

export function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function getNodeBounds(node: Node): Rect {
  return {
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
  };
}

export function getNodeCenter(node: Node): Point {
  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
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

export function hitTestNodes(point: Point, nodes: Node[]) {
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
