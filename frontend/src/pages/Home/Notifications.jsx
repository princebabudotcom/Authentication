import { useState, useEffect, useRef } from "react";
import {
  Bell,
  ShieldAlert,
  MessageSquare,
  Users,
  GitBranch,
  Activity,
  Megaphone,
  CheckCheck,
  Trash2,
  Clock,
  X,
  Loader2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { io } from "socket.io-client";

/* ── config ── */
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ── type config ── */
const typeConfig = {
  security: { icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/15" },
  mention: {
    icon: MessageSquare,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
  },
  follow: { icon: Users, color: "text-purple-400", bg: "bg-purple-500/15" },
  activity: {
    icon: GitBranch,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
  },
  system: { icon: Activity, color: "text-yellow-400", bg: "bg-yellow-500/15" },
  announcement: {
    icon: Megaphone,
    color: "text-pink-400",
    bg: "bg-pink-500/15",
  },
};

const filters = [
  { id: "all", label: "All" },
  { id: "security", label: "Security" },
  { id: "mention", label: "Mentions" },
  { id: "activity", label: "Activity" },
  { id: "follow", label: "Follows" },
  { id: "announcement", label: "Updates" },
];

/* ── mock seed (replace with GET /notifications on mount) ── */
const seedNotifications = [
  {
    _id: "n1",
    type: "security",
    title: "New sign-in detected",
    body: "Chrome on Windows · Greater Noida · 182.65.34.12",
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    read: false,
  },
  {
    _id: "n2",
    type: "mention",
    title: "Rahul mentioned you",
    body: '"Hey @prince, can you review this PR?"',
    createdAt: new Date(Date.now() - 18 * 60000).toISOString(),
    read: false,
  },
  {
    _id: "n3",
    type: "security",
    title: "Backup code used",
    body: "One of your backup codes was used to sign in.",
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    read: false,
  },
  {
    _id: "n4",
    type: "follow",
    title: "Amit started following you",
    body: "You have a new follower on your profile.",
    createdAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    read: true,
  },
  {
    _id: "n5",
    type: "activity",
    title: "Pull request merged",
    body: "PR #42 'Add OTP login flow' merged into main.",
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    read: true,
  },
  {
    _id: "n6",
    type: "system",
    title: "Scheduled maintenance",
    body: "Platform down 15 min on Sunday 3:00 AM IST.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  },
  {
    _id: "n7",
    type: "announcement",
    title: "New feature: OTP login",
    body: "Sign in with a one-time code sent to your email.",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    read: true,
  },
  {
    _id: "n8",
    type: "security",
    title: "Password changed",
    body: "Your account password was updated successfully.",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    read: true,
  },
];

/* ── time ago helper ── */
const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(seedNotifications);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [newToast, setNewToast] = useState(null);
  const socketRef = useRef(null);
  const toastTimer = useRef(null);

  /* ── fetch on mount (replace seed) ── */
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // TODO: const res = await userApi.getNotifications();
        // setNotifs(res.data.notifications);
        await new Promise((r) => setTimeout(r, 600)); // mock delay
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  /* ── socket.io real-time ── */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    // Server emits "notification" when a new one arrives for this user
    socket.on("notification", (newNotif) => {
      setNotifs((prev) => [newNotif, ...prev]);

      // Show toast
      clearTimeout(toastTimer.current);
      setNewToast(newNotif);
      toastTimer.current = setTimeout(() => setNewToast(null), 4000);
    });

    // Server emits "notification:read" when another tab marks one read
    socket.on("notification:read", (id) => {
      setNotifs((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
    });

    // Server emits "notification:deleted" when another tab deletes one
    socket.on("notification:deleted", (id) => {
      setNotifs((prev) => prev.filter((n) => n._id !== id));
    });

    return () => {
      socket.disconnect();
      clearTimeout(toastTimer.current);
    };
  }, []);

  /* ── derived ── */
  const unreadCount = notifs.filter((n) => !n.read).length;
  const visible =
    filter === "all" ? notifs : notifs.filter((n) => n.type === filter);

  /* ── actions ── */
  const markRead = async (id) => {
    setNotifs((p) => p.map((n) => (n._id === id ? { ...n, read: true } : n)));
    // TODO: await userApi.markNotificationRead(id);
    // Socket will emit "notification:read" to other tabs automatically
  };

  const markAllRead = async () => {
    setNotifs((p) => p.map((n) => ({ ...n, read: true })));
    // TODO: await userApi.markAllNotificationsRead();
  };

  const deleteNotif = async (id) => {
    setNotifs((p) => p.filter((n) => n._id !== id));
    // TODO: await userApi.deleteNotification(id);
  };

  const clearRead = () => {
    setNotifs((p) => p.filter((n) => !n.read));
    // TODO: await userApi.clearReadNotifications();
  };

  return (
    <div className="w-full max-w-9xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-black">
                {unreadCount}
              </span>
            )}
            {/* connection indicator */}
            <span
              title={connected ? "Real-time connected" : "Offline"}
              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border ${
                connected
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-zinc-900 border-zinc-800 text-zinc-500"
              }`}
            >
              {connected ? <Wifi size={10} /> : <WifiOff size={10} />}
              {connected ? "Live" : "Offline"}
            </span>
          </div>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white transition"
            >
              <CheckCheck size={13} />
              <span className="hidden sm:inline">Mark all read</span>
            </button>
          )}
          {notifs.some((n) => n.read) && (
            <button
              onClick={clearRead}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-950/20 transition"
            >
              <Trash2 size={13} />
              <span className="hidden sm:inline">Clear read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition ${
              filter === f.id
                ? "bg-emerald-500 text-black border-emerald-500"
                : "text-zinc-400 border-zinc-800 hover:bg-zinc-900"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-12 text-zinc-500 text-sm">
            <Loader2 size={16} className="animate-spin" />
            Loading notifications...
          </div>
        )}

        {!loading && visible.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
            <Bell size={30} className="mb-3 opacity-30" />
            <p className="text-sm">No notifications here.</p>
          </div>
        )}

        {!loading &&
          visible.map((notif, idx) => {
            const cfg = typeConfig[notif.type] ?? typeConfig.system;
            const Icon = cfg.icon;

            return (
              <div
                key={notif._id}
                onClick={() => !notif.read && markRead(notif._id)}
                className={`group relative flex items-start gap-3.5 px-4 sm:px-5 py-4 transition cursor-pointer ${
                  !notif.read
                    ? "bg-zinc-900/50 hover:bg-zinc-900"
                    : "hover:bg-zinc-900/30"
                } ${idx !== visible.length - 1 ? "border-b border-zinc-800" : ""}`}
              >
                {/* unread dot */}
                {!notif.read && (
                  <span className="absolute left-1.5 top-[22px] w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}

                {/* icon */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg}`}
                >
                  <Icon size={15} className={cfg.color} />
                </div>

                {/* content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm leading-snug ${notif.read ? "text-zinc-300" : "text-white font-medium"}`}
                  >
                    {notif.title}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2">
                    {notif.body}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-zinc-600">
                    <Clock size={10} />
                    {timeAgo(notif.createdAt)}
                  </div>
                </div>

                {/* delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotif(notif._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-950/30 transition mt-0.5"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
      </div>

      {/* Real-time toast */}
      {newToast &&
        (() => {
          const cfg = typeConfig[newToast.type] ?? typeConfig.system;
          const Icon = cfg.icon;
          return (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-start gap-3 p-4">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}
                >
                  <Icon size={14} className={cfg.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white leading-snug">
                    {newToast.title}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                    {newToast.body}
                  </p>
                </div>
                <button
                  onClick={() => setNewToast(null)}
                  className="shrink-0 text-zinc-500 hover:text-white transition"
                >
                  <X size={15} />
                </button>
              </div>
              {/* progress bar */}
              <div className="h-0.5 bg-emerald-500 animate-[shrink_4s_linear_forwards]" />
            </div>
          );
        })()}

      <style>{`
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
      `}</style>
    </div>
  );
}
