"use client";

import { CursorArrowIcon, HandIcon, PlusIcon } from "@radix-ui/react-icons";
import type { ComponentType } from "react";
import type { CanvasState } from "@/lib/canvas/types";
import { useUIStore } from "@/lib/store/uiStore";

type Tool = {
  id: CanvasState["activeTool"];
  label: string;
  Icon: ComponentType<{ className?: string }>;
};

const tools: Tool[] = [
  { id: "select", label: "Select Tool", Icon: CursorArrowIcon },
  { id: "add-node", label: "Add Node Tool", Icon: PlusIcon },
  { id: "pan", label: "Pan Tool", Icon: HandIcon },
];

export function Toolbar() {
  const activeTool = useUIStore((state) => state.activeTool);
  const setActiveTool = useUIStore((state) => state.setActiveTool);

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-center border-b border-slate-200 bg-white/95 shadow-sm shadow-slate-900/10 backdrop-blur">
      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2 shadow-sm">
        {tools.map(({ Icon, id, label }) => {
          const isActive = activeTool === id;

          return (
            <button
              aria-label={label}
              className={`grid h-10 w-10 place-items-center rounded-md border text-slate-700 transition ${
                isActive
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-transparent hover:bg-slate-100 hover:text-slate-950"
              }`}
              key={id}
              onClick={() => setActiveTool(id)}
              title={label}
              type="button"
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>
    </header>
  );
}
