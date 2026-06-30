import { CanvasContainer } from "@/components/Canvas/CanvasContainer";
import { Toolbar } from "@/components/Toolbar/Toolbar";

export default function Home() {
  return (
    <main className="h-screen overflow-hidden bg-slate-100">
      <Toolbar />
      <div className="h-full pt-16">
        <CanvasContainer />
      </div>
    </main>
  );
}
