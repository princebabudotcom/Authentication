import { ShieldCheck } from "lucide-react";

/**
 * Full-screen loader shown by <Suspense> while a lazy-loaded
 * route's JS chunk is still downloading. Kept intentionally
 * minimal and fast — it should never be on screen for long.
 */
export default function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-400/30">
          <ShieldCheck
            className="h-5 w-5 animate-pulse text-emerald-400"
            strokeWidth={2.25}
          />
        </div>
        <div className="h-0.5 w-24 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/3 animate-[loading_1.1s_ease-in-out_infinite] rounded-full bg-emerald-400" />
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}
