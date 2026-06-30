"use client";

import { useEffect } from "react";
import { createCamera } from "@/lib/canvas/camera";
import { useUIStore } from "@/lib/store/uiStore";

export function useKeyboard() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) {
        return;
      }

      if (event.key === "v") {
        useUIStore.getState().setActiveTool("select");
      }

      if (event.key === "n") {
        useUIStore.getState().setActiveTool("add-node");
      }

      if (event.key === " ") {
        event.preventDefault();
        useUIStore.getState().setActiveTool("pan");
      }

      if (event.key === "0") {
        useUIStore.getState().setCamera(createCamera());
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
