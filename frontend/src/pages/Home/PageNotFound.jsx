import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black px-6 text-white">
      {/* Ambient backdrop, consistent with the rest of AuthApp */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-10%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex max-w-md flex-col items-center text-center"
      >
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-400/25">
          <ShieldAlert
            className="h-7 w-7 text-emerald-400"
            strokeWidth={1.75}
          />
        </div>

        <p className="font-mono text-sm tracking-[0.3em] text-emerald-400/70">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          This page isn't authenticated.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-white/50">
          There's no route here — the page may have moved, been renamed, or
          never existed. Your account and sessions are safe either way.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NavLink
            to="/"
            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-[#052b1e] transition hover:bg-emerald-400"
          >
            <Home className="h-4 w-4" />
            Back to dashboard
          </NavLink>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
