import type { Camera, Point } from "./types";

export const MIN_ZOOM = 0.3;
export const MAX_ZOOM = 2.5;

export function createCamera(): Camera {
  return {
    x: 0,
    y: 0,
    zoom: 1,
  };
}

export function clampZoom(zoom: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));
}

export function screenToWorld(point: Point, camera: Camera): Point {
  return {
    x: (point.x - camera.x) / camera.zoom,
    y: (point.y - camera.y) / camera.zoom,
  };
}

export function worldToScreen(point: Point, camera: Camera): Point {
  return {
    x: point.x * camera.zoom + camera.x,
    y: point.y * camera.zoom + camera.y,
  };
}

export function panBy(camera: Camera, delta: Point): Camera {
  return {
    ...camera,
    x: camera.x + delta.x,
    y: camera.y + delta.y,
  };
}

export function zoomAt(
  camera: Camera,
  screenPoint: Point,
  zoomDelta: number,
): Camera {
  const nextZoom = clampZoom(camera.zoom * zoomDelta);
  const worldPoint = screenToWorld(screenPoint, camera);

  return {
    zoom: nextZoom,
    x: screenPoint.x - worldPoint.x * nextZoom,
    y: screenPoint.y - worldPoint.y * nextZoom,
  };
}
