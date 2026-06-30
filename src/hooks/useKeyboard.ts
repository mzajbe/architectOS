"use client";

import { useEffect } from "react";
import { useGraphStore } from "@/lib/store/graphStore";
import { useUIStore } from "@/lib/store/uiStore";

export function useKeyboard() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const uiStore = useUIStore.getState();

      if (key === "v" || key === "1") {
        uiStore.setActiveTool("select");
      }

      if (key === "n" || key === "2") {
        uiStore.setActiveTool("add-node");
      }

      if (key === "h" || key === "3") {
        uiStore.setActiveTool("pan");
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        const selectedNodeId = uiStore.selectedNodeId;

        if (selectedNodeId) {
          event.preventDefault();
          useGraphStore.getState().deleteNode(selectedNodeId);
          uiStore.setSelectedNodeId(null);
        }
      }

      if (event.key === "Escape") {
        uiStore.setSelectedNodeId(null);
        uiStore.setActiveTool("select");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
