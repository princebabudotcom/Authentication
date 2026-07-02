import { ShieldCheck } from "lucide-react";

export default function AuthSkeletonLoader() {
  return (
    <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center px-6">
      {/* Logo mark with pulsing ring */}
      <div className="relative flex items-center justify-center mb-8">
        <span className="absolute h-20 w-20 rounded-full border-2 border-emerald-500/30 animate-ping" />
        <span className="absolute h-20 w-20 rounded-full border-2 border-zinc-800" />
        <div className="relative h-20 w-20 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
          <ShieldCheck size={28} className="text-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Text */}
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
          Securing your session
        </h1>
        <p className="text-sm text-zinc-500">
          Hang tight, we're verifying your credentials...
        </p>
      </div>

      {/* Skeleton bars mimicking content load */}
      <div className="w-full max-w-xs space-y-3">
        <div className="h-3 rounded-full bg-zinc-900 overflow-hidden relative">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />
        </div>
        <div className="h-3 rounded-full bg-zinc-900 w-4/5 overflow-hidden relative">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] [animation-delay:150ms] bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />
        </div>
        <div className="h-3 rounded-full bg-zinc-900 w-3/5 overflow-hidden relative">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] [animation-delay:300ms] bg-gradient-to-r from-transparent via-zinc-700/60 to-transparent" />
        </div>
      </div>

      {/* Bouncing dots */}
      <div className="flex items-center gap-1.5 mt-8">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:300ms]" />
      </div>

      {/* Shimmer keyframes (Tailwind v3 arbitrary animation) */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
