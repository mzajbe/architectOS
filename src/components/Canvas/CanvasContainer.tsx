"use client";

import { CanvasRenderer } from "@/components/Canvas/CanvasRenderer";
import { DomOverlay } from "@/components/Canvas/DomOverlay";
import { Toolbar } from "@/components/Toolbar/Toolbar";
import { useKeyboard } from "@/hooks/useKeyboard";

export function CanvasContainer() {
  useKeyboard();

  return (
    <main className="flex min-h-screen flex-col bg-white text-slate-950">
      <Toolbar />
      <section className="relative min-h-0 flex-1 overflow-hidden bg-slate-100">
        <CanvasRenderer />
        <DomOverlay />
      </section>
    </main>
  );
}
