"use client";

import { useSyncExternalStore } from "react";
import { createCamera } from "@/lib/canvas/camera";
import type { Camera, CanvasState } from "@/lib/canvas/types";

type UIState = Pick<CanvasState, "activeTool" | "camera">;

type UIListener = () => void;

const initialState: UIState = {
  activeTool: "select",
  camera: createCamera(),
};

let state = initialState;
const listeners = new Set<UIListener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(nextState: UIState) {
  state = nextState;
  emit();
}

export const uiStore = {
  getState: () => state,
  subscribe(listener: UIListener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setActiveTool(activeTool: CanvasState["activeTool"]) {
    setState({ ...state, activeTool });
  },
  setCamera(camera: Camera) {
    setState({ ...state, camera });
  },
  resetCamera() {
    setState({ ...state, camera: createCamera() });
  },
};

export function useUIStore<T>(selector: (nextState: UIState) => T) {
  return useSyncExternalStore(
    uiStore.subscribe,
    () => selector(uiStore.getState()),
    () => selector(initialState),
  );
}
