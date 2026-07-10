import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";

/* ------------------------------------------------------------------ *
 *  Global notification system
 *
 *  - NotificationProvider: wrap your app once, at the root.
 *  - useNotification(): call from ANY component to fire a popup.
 *  - Only ever one popup on screen. If a new one comes in while
 *    another is showing, it queues and plays right after.
 *
 *  NOTE: This provider has NO knowledge of sockets, auth, or where
 *  notifications come from. It only knows how to display them.
 *  Socket listening lives in AuthProvider — see notify.info() calls there.
 * ------------------------------------------------------------------ */

const NotificationContext = createContext(null);

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    ring: "ring-emerald-400/25",
    iconColor: "text-emerald-400",
    bar: "bg-emerald-400",
  },
  error: {
    icon: XCircle,
    ring: "ring-rose-400/25",
    iconColor: "text-rose-400",
    bar: "bg-rose-400",
  },
  warning: {
    icon: AlertTriangle,
    ring: "ring-amber-300/25",
    iconColor: "text-amber-300",
    bar: "bg-amber-300",
  },
  info: {
    icon: Info,
    ring: "ring-sky-400/25",
    iconColor: "text-sky-400",
    bar: "bg-sky-400",
  },
};

export function NotificationProvider({ children }) {
  const [current, setCurrent] = useState(null); // the one popup on screen
  const queueRef = useRef([]);
  const timerRef = useRef(null);

  const playNext = useCallback(() => {
    if (queueRef.current.length === 0) {
      setCurrent(null);
      return;
    }
    const next = queueRef.current.shift();
    setCurrent(next);
  }, []);

  const dismiss = useCallback(() => {
    clearTimeout(timerRef.current);
    setCurrent(null);
    setTimeout(playNext, 200);
  }, [playNext]);

  const notify = useCallback(
    (variant, title, description, opts = {}) => {
      const item = {
        id: Date.now() + Math.random(),
        variant,
        title,
        description,
        duration: opts.duration ?? 4000,
      };
      if (current) {
        queueRef.current.push(item);
      } else {
        setCurrent(item);
      }
    },
    [current],
  );

  const api = useRef({
    success: (title, description, opts) =>
      notify("success", title, description, opts),
    error: (title, description, opts) =>
      notify("error", title, description, opts),
    warning: (title, description, opts) =>
      notify("warning", title, description, opts),
    info: (title, description, opts) =>
      notify("info", title, description, opts),
  });
  api.current.success = (title, description, opts) =>
    notify("success", title, description, opts);
  api.current.error = (title, description, opts) =>
    notify("error", title, description, opts);
  api.current.warning = (title, description, opts) =>
    notify("warning", title, description, opts);
  api.current.info = (title, description, opts) =>
    notify("info", title, description, opts);

  useEffect(() => {
    if (!current) return;
    timerRef.current = setTimeout(dismiss, current.duration);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return (
    <NotificationContext.Provider value={api.current}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4 sm:justify-end sm:px-6">
        <AnimatePresence mode="wait">
          {current && (
            <Toast key={current.id} item={current} onClose={dismiss} />
          )}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

function Toast({ item, onClose }) {
  const { icon: Icon, ring, iconColor, bar } = VARIANTS[item.variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: -24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.96 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-xl border border-white/10 bg-black/95 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.6)] ring-1 backdrop-blur-sm ${ring}`}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <Icon
          className={`mt-0.5 h-5 w-5 shrink-0 ${iconColor}`}
          strokeWidth={2}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] font-medium text-white">{item.title}</p>
          {item.description && (
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-white/50">
              {item.description}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Dismiss notification"
          className="shrink-0 rounded-md p-1 text-white/30 transition hover:bg-white/5 hover:text-white/70"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: item.duration / 1000, ease: "linear" }}
        style={{ transformOrigin: "left" }}
        className={`h-0.5 w-full ${bar}`}
      />
    </motion.div>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      "useNotification must be used inside <NotificationProvider>",
    );
  }
  return ctx;
}
