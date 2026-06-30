"use client";

import { useGraphStore } from "@/lib/store/graphStore";
import { useUIStore } from "@/lib/store/uiStore";

export function DomOverlay() {
  const nodeCount = useGraphStore((state) => state.nodes.length);
  const selectedNodeId = useGraphStore((state) => state.selectedNodeId);
  const activeTool = useUIStore((state) => state.activeTool);
  const zoom = useUIStore((state) => Math.round(state.camera.zoom * 100));

  return (
    <div className="pointer-events-none absolute bottom-4 left-4 flex gap-2 text-xs font-medium text-slate-700">
      <span className="rounded-md border border-slate-200 bg-white/90 px-2.5 py-1 shadow-sm">
        {nodeCount} nodes
      </span>
      <span className="rounded-md border border-slate-200 bg-white/90 px-2.5 py-1 shadow-sm">
        {activeTool}
      </span>
      <span className="rounded-md border border-slate-200 bg-white/90 px-2.5 py-1 shadow-sm">
        {zoom}%
      </span>
      {selectedNodeId ? (
        <span className="rounded-md border border-slate-200 bg-white/90 px-2.5 py-1 shadow-sm">
          {selectedNodeId}
        </span>
      ) : null}
    </div>
  );
}
