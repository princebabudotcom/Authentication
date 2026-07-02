import { useState } from "react";
import {
  Link2,
  Unlink,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";

/* ---------- Brand SVG icons ---------- */

const GitHubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.29-1.68-1.29-1.68-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.74.4-1.26.72-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .98-.31 3.2 1.18a11.1 11.1 0 0 1 5.83 0c2.22-1.49 3.2-1.18 3.2-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.42.36.78 1.07.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .31.21.67.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

const GoogleIcon = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3.01h3.86c2.26-2.09 3.56-5.17 3.56-8.87Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.86-3.01c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11A11.997 11.997 0 0 0 12 24Z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.28A7.18 7.18 0 0 1 4.89 12c0-.79.14-1.56.38-2.28V6.61H1.27A11.96 11.96 0 0 0 0 12c0 1.93.46 3.76 1.27 5.39l4-3.11Z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.61l4 3.11C6.22 6.86 8.87 4.75 12 4.75Z"
    />
  </svg>
);

const SlackIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M9.5 14.5a1.5 1.5 0 1 1-3 0v-5a1.5 1.5 0 1 1 3 0v5Z"
      fill="#36C5F0"
    />
    <path d="M5 9.5a1.5 1.5 0 1 1 0-3h5a1.5 1.5 0 1 1 0 3H5Z" fill="#36C5F0" />
    <path
      d="M14.5 9.5a1.5 1.5 0 1 1 3 0v5a1.5 1.5 0 1 1-3 0v-5Z"
      fill="#2EB67D"
    />
    <path
      d="M19 14.5a1.5 1.5 0 1 1 0 3h-5a1.5 1.5 0 1 1 0-3h5Z"
      fill="#2EB67D"
    />
    <path
      d="M14.5 5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-1.5 1.5h-1.5V5Z"
      fill="#ECB22E"
    />
    <path
      d="M9.5 5a1.5 1.5 0 1 0-3 0v5a1.5 1.5 0 0 0 1.5 1.5h1.5V5Z"
      fill="#ECB22E"
      transform="translate(5.5 -5) rotate(90)"
    />
    <path
      d="M5 14.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 1.5-1.5v-1.5H5Z"
      fill="#E01E5A"
    />
    <path
      d="M9.5 19a1.5 1.5 0 1 1-3 0v-5a1.5 1.5 0 0 1 1.5-1.5h1.5V19Z"
      fill="#E01E5A"
    />
  </svg>
);

const FigmaIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path
      d="M8.5 24a3.5 3.5 0 0 1 0-7H12v3.5A3.5 3.5 0 0 1 8.5 24Z"
      fill="#0ACF83"
    />
    <path
      d="M5 13.5A3.5 3.5 0 0 1 8.5 10H12v7H8.5A3.5 3.5 0 0 1 5 13.5Z"
      fill="#A259FF"
    />
    <path
      d="M5 6.5A3.5 3.5 0 0 1 8.5 3H12v7H8.5A3.5 3.5 0 0 1 5 6.5Z"
      fill="#F24E1E"
    />
    <path d="M12 3h3.5a3.5 3.5 0 1 1 0 7H12V3Z" fill="#FF7262" />
    <path d="M19 13.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 1 1 7 0Z" fill="#1ABCFE" />
  </svg>
);

const initialConnections = [
  {
    id: "github",
    name: "GitHub",
    desc: "Sync repositories and show contribution activity.",
    Icon: GitHubIcon,
    connected: true,
    account: "princebabudotcom",
    iconBg: "bg-zinc-800 text-white",
  },
  {
    id: "google",
    name: "Google",
    desc: "Sign in and sync your Google account.",
    Icon: GoogleIcon,
    connected: true,
    account: "prince@gmail.com",
    iconBg: "bg-white",
  },
  {
    id: "slack",
    name: "Slack",
    desc: "Get notifications and updates in your workspace.",
    Icon: SlackIcon,
    connected: false,
    account: null,
    iconBg: "bg-zinc-900",
  },
  {
    id: "figma",
    name: "Figma",
    desc: "Import designs and embed prototypes.",
    Icon: FigmaIcon,
    connected: false,
    account: null,
    iconBg: "bg-zinc-900",
  },
];

export default function ConnectionsPage() {
  const [connections, setConnections] = useState(initialConnections);
  const [loadingId, setLoadingId] = useState(null);
  const [confirmDisconnect, setConfirmDisconnect] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const handleConnect = async (id) => {
    setLoadingId(id);
    try {
      // TODO: redirect to OAuth provider, e.g. window.location.href = `/api/oauth/${id}`
      await new Promise((res) => setTimeout(res, 1000));
      setConnections((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, connected: true, account: `user_${id}@example.com` }
            : c,
        ),
      );
      showToast("Connected successfully.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDisconnect = async (id) => {
    setLoadingId(id);
    try {
      // TODO: replace with real API call, e.g. userApi.disconnectProvider(id)
      await new Promise((res) => setTimeout(res, 800));
      setConnections((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, connected: false, account: null } : c,
        ),
      );
      setConfirmDisconnect(null);
      showToast("Disconnected.");
    } finally {
      setLoadingId(null);
    }
  };

  const connectedCount = connections.filter((c) => c.connected).length;

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Connections
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm mt-1">
          Manage third-party services linked to your account.{" "}
          <span className="text-zinc-600">({connectedCount} connected)</span>
        </p>
      </div>

      {/* Connections list */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
        {connections.map((conn, idx) => {
          const { Icon } = conn;
          const isLoading = loadingId === conn.id;

          return (
            <div
              key={conn.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 ${
                idx !== connections.length - 1 ? "border-b border-zinc-800" : ""
              }`}
            >
              <div className="flex items-start sm:items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 p-2 ${conn.iconBg}`}
                >
                  <Icon className="w-full h-full" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      {conn.name}
                    </span>
                    {conn.connected && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                        <CheckCircle2 size={10} />
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    {conn.connected ? conn.account : conn.desc}
                  </p>
                </div>
              </div>

              {conn.connected ? (
                <button
                  onClick={() => setConfirmDisconnect(conn.id)}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl border border-zinc-800 text-zinc-400 active:bg-red-950/30 sm:hover:text-red-400 sm:hover:bg-red-950/20 transition disabled:opacity-50 shrink-0"
                >
                  {isLoading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Unlink size={13} />
                  )}
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(conn.id)}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl bg-emerald-500 text-black active:bg-emerald-400 sm:hover:bg-emerald-400 transition disabled:opacity-60 shrink-0"
                >
                  {isLoading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Link2 size={13} />
                  )}
                  Connect
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Help link */}
      <a
        href="#"
        className="flex items-center gap-1.5 text-xs text-zinc-500 active:text-zinc-300 sm:hover:text-zinc-300 transition mt-4"
      >
        <ExternalLink size={12} />
        Learn more about connected apps
      </a>

      {/* Disconnect confirm modal */}
      {confirmDisconnect && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center px-4 z-50">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 max-w-sm w-full">
            <h3 className="text-base font-semibold text-white mb-1.5">
              Disconnect{" "}
              {connections.find((c) => c.id === confirmDisconnect)?.name}?
            </h3>
            <p className="text-sm text-zinc-500 leading-relaxed mb-5">
              You'll need to reconnect this service to use related features
              again.
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => setConfirmDisconnect(null)}
                className="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 active:bg-zinc-900 sm:hover:bg-zinc-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDisconnect(confirmDisconnect)}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl bg-red-500 text-white active:bg-red-400 sm:hover:bg-red-400 transition"
              >
                <Unlink size={14} />
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 z-50">
          <CheckCircle2 size={15} className="text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
