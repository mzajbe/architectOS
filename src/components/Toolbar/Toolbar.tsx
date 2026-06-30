"use client";

import { CursorArrowIcon, HandIcon, PlusIcon } from "@radix-ui/react-icons";
import type { ComponentType } from "react";
import type { CanvasState } from "@/lib/canvas/types";
import { useUIStore } from "@/lib/store/uiStore";

type Tool = {
  id: CanvasState["activeTool"];
  label: string;
  shortcut: string;
  Icon: ComponentType<{ className?: string }>;
};

const tools: Tool[] = [
  { id: "select", label: "Select", shortcut: "V", Icon: CursorArrowIcon },
  { id: "add-node", label: "Add Node", shortcut: "N", Icon: PlusIcon },
  { id: "pan", label: "Pan", shortcut: "H", Icon: HandIcon },
];

export function Toolbar() {
  const activeTool = useUIStore((state) => state.activeTool);
  const setActiveTool = useUIStore((state) => state.setActiveTool);

  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-16 items-center justify-center border-b border-slate-200 bg-white/95 shadow-sm shadow-slate-900/10 backdrop-blur">
      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-2 shadow-sm">
        {tools.map(({ Icon, id, label, shortcut }) => {
          const isActive = activeTool === id;
          const tooltip = `${label} (${shortcut})`;

          return (
            <button
              aria-label={tooltip}
              className={`grid h-10 w-10 place-items-center rounded-md border text-slate-700 outline-none transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                isActive
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-600/25 hover:bg-blue-700"
                  : "border-transparent hover:bg-slate-100 hover:text-slate-950 hover:shadow-sm"
              }`}
              key={id}
              onClick={() => setActiveTool(id)}
              title={tooltip}
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
