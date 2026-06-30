"use client";

import { useEffect } from "react";
import { uiStore } from "@/lib/store/uiStore";

export function useKeyboard() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) {
        return;
      }

      if (event.key === "v") {
        uiStore.setActiveTool("select");
      }

      if (event.key === "n") {
        uiStore.setActiveTool("add-node");
      }

      if (event.key === " ") {
        event.preventDefault();
        uiStore.setActiveTool("pan");
      }

      if (event.key === "0") {
        uiStore.resetCamera();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
