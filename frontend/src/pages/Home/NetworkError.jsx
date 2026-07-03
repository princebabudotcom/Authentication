import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, RefreshCw, CheckCircle2 } from "lucide-react";

/**
 * Full-screen network error state. Shows an animated "searching for
 * signal" visual, retries on demand, and auto-recovers the instant
 * the browser reports it's back online.
 *
 * Usage: render this in place of your app when a request fails with
 * a network error (e.g. fetch throws TypeError, or navigator.onLine
 * is false), and pass onRetry to re-run whatever fetch/route load failed.
 */
export default function NetworkError({ onRetry }) {
  const [status, setStatus] = useState("offline"); // offline | retrying | online
  const [attempt, setAttempt] = useState(0);

  const handleRetry = useCallback(async () => {
    setStatus("retrying");
    setAttempt((a) => a + 1);
    try {
      if (onRetry) {
        await onRetry();
      } else {
        // Default: just re-check the browser's own connectivity flag
        await new Promise((r) => setTimeout(r, 900));
      }
      if (navigator.onLine) {
        setStatus("online");
        setTimeout(() => window.location.reload(), 900);
      } else {
        setStatus("offline");
      }
    } catch {
      setStatus("offline");
    }
  }, [onRetry]);

  // Auto-recover the moment the browser regains connectivity
  useEffect(() => {
    const goOnline = () => handleRetry();
    window.addEventListener("online", goOnline);
    return () => window.removeEventListener("online", goOnline);
  }, [handleRetry]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black px-6 text-white">
      {/* Ambient backdrop, consistent with the rest of AuthApp */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-10%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[140px]" />
      </div>

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        {/* Radar / signal-search visual */}
        <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
          <AnimatePresence mode="wait">
            {status === "online" ? (
              <motion.div
                key="online"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-400/30"
              >
                <CheckCircle2
                  className="h-7 w-7 text-emerald-400"
                  strokeWidth={1.75}
                />
              </motion.div>
            ) : (
              <motion.div
                key="searching"
                className="relative flex h-full w-full items-center justify-center"
              >
                {/* Expanding ping rings — only while offline/retrying */}
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute h-14 w-14 rounded-full border border-rose-400/40"
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 2.4, opacity: 0 }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      delay: i * 0.7,
                      ease: "easeOut",
                    }}
                  />
                ))}
                <motion.div
                  animate={
                    status === "retrying"
                      ? { rotate: 360 }
                      : { x: [0, -2, 2, -2, 2, 0] }
                  }
                  transition={
                    status === "retrying"
                      ? { duration: 0.8, repeat: Infinity, ease: "linear" }
                      : { duration: 2.4, repeat: Infinity, repeatDelay: 1.4 }
                  }
                  className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 ring-1 ring-rose-400/30"
                >
                  {status === "retrying" ? (
                    <RefreshCw
                      className="h-6 w-6 text-rose-300"
                      strokeWidth={1.75}
                    />
                  ) : (
                    <WifiOff
                      className="h-6 w-6 text-rose-300"
                      strokeWidth={1.75}
                    />
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {status === "online" ? (
            <motion.div
              key="msg-online"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-2xl font-semibold tracking-tight">
                Back online
              </h1>
              <p className="mt-2 text-[14.5px] text-white/50">
                Reconnecting you now…
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="msg-offline"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-2xl font-semibold tracking-tight md:text-[28px]">
                Can't reach AuthApp
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-white/50">
                {status === "retrying"
                  ? "Checking your connection…"
                  : "Your sessions and data are safe — this is just a connection issue."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {status !== "online" && (
          <motion.button
            onClick={handleRetry}
            disabled={status === "retrying"}
            whileHover={{ scale: status === "retrying" ? 1 : 1.03 }}
            whileTap={{ scale: status === "retrying" ? 1 : 0.97 }}
            className="mt-8 flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-[#052b1e] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${status === "retrying" ? "animate-spin" : ""}`}
            />
            {status === "retrying" ? "Retrying…" : "Try again"}
          </motion.button>
        )}

        {attempt > 0 && status === "offline" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-xs text-white/30"
          >
            Attempt {attempt} failed — we'll also reconnect automatically once
            you're back online.
          </motion.p>
        )}
      </div>
    </div>
  );
}
