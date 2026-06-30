"use client";

import { IconButton } from "@/components/UI/IconButton";
import type { CanvasState } from "@/lib/canvas/types";
import { useUIStore } from "@/lib/store/uiStore";

const tools: Array<{ id: CanvasState["activeTool"]; label: string; icon: string }> = [
  { id: "select", label: "Select", icon: "/icons/select.svg" },
  { id: "add-node", label: "Add node", icon: "/icons/add-node.svg" },
  { id: "pan", label: "Pan", icon: "/icons/pan.svg" },
];

export function Toolbar() {
  const activeTool = useUIStore((state) => state.activeTool);
  const setActiveTool = useUIStore((state) => state.setActiveTool);

  return (
    <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-2">
        {tools.map((tool) => (
          <IconButton
            icon={tool.icon}
            isActive={activeTool === tool.id}
            key={tool.id}
            label={tool.label}
            onClick={() => setActiveTool(tool.id)}
          />
        ))}
      </div>
      <div className="ml-3 h-6 w-px bg-slate-300" />
      <span className="text-sm font-semibold text-slate-900">Architectos</span>
    </div>
  );
}
