import { useEffect, useState } from "react";
import {
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Clock,
  LogOut,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import userApi from "../../../api/user.api";
import useAuth from "../../context/auth/UseAuth";

/* ---------- Helpers to parse real session data ---------- */

// Parse browser/os/device-type from userAgent when browser/os/device fields are empty
const parseUserAgent = (ua = "") => {
  let browser = "Unknown Browser";
  let os = "Unknown OS";
  let type = "desktop";

  if (/edg/i.test(ua)) browser = "Edge";
  else if (/chrome/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua)) browser = "Safari";
  else if (/firefox/i.test(ua)) browser = "Firefox";

  if (/windows/i.test(ua)) os = "Windows";
  else if (/mac os/i.test(ua)) os = "macOS";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ios/i.test(ua)) os = "iOS";
  else if (/linux/i.test(ua)) os = "Linux";

  if (/mobile|android|iphone/i.test(ua)) type = "mobile";
  else if (/ipad|tablet/i.test(ua)) type = "tablet";

  return { browser, os, type };
};

const deviceIcon = (type) => {
  if (type === "mobile") return Smartphone;
  if (type === "tablet") return Tablet;
  return Monitor;
};

// Relative time formatter: "Active now", "5 minutes ago", "2 days ago"
const timeAgo = (dateStr) => {
  if (!dateStr) return "Unknown";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "Active now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
};

// Normalize a raw session document from the API into display-ready shape
const normalizeSession = (raw, currentSessionId) => {
  const parsed = parseUserAgent(raw.userAgent);
  return {
    id: raw._id,
    device:
      raw.device ||
      `${raw.browser || parsed.browser} on ${raw.os || parsed.os}`,
    type: parsed.type,
    location: raw.location || "Unknown location",
    ip: raw.ipAddress === "::1" ? "localhost" : raw.ipAddress,
    lastActive: timeAgo(raw.lastActiveAt),
    current: raw._id === currentSessionId,
    isRevoked: raw.isRevoked,
  };
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);
  const [revokingAll, setRevokingAll] = useState(false);

  const { user } = useAuth();

  const getAllSessions = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAllSessions();
      const raw = res.data?.history || [];
      // Current session id is usually returned by the backend (e.g. res.data.currentSessionId)
      const currentSessionId = res.data?.currentSessionId;

      // console.log(res.data.history[0].user, user._id);

      const normalized = raw
        .filter((s) => !s.isRevoked) // hide already-revoked sessions
        .map((s) => normalizeSession(s, currentSessionId))
        // show current session first
        .sort((a, b) => (b.current ? 1 : 0) - (a.current ? 1 : 0));

      setSessions(normalized);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSessions();
  }, []);

  const handleRevoke = async (id) => {
    setRevokingId(id);
    try {
      await userApi.revokeSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.log(error.response);
    } finally {
      setRevokingId(null);
    }
  };

  const handleRevokeAll = async () => {
    setRevokingAll(true);
    try {
      await userApi.revokeAllSessions();
      setSessions((prev) => prev.filter((s) => s.current));
    } catch (error) {
      console.log(error);
    } finally {
      setRevokingAll(false);
    }
  };

  const otherSessionsCount = sessions.filter((s) => !s.current).length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6 max-w-3xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Sessions</h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Manage devices that are currently logged into your account.
          </p>
        </div>

        {otherSessionsCount > 0 && (
          <button
            onClick={handleRevokeAll}
            disabled={revokingAll}
            className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium px-4 py-2.5 sm:py-2 rounded-xl border border-red-900/50 text-red-400 active:bg-red-950/40 sm:hover:bg-red-950/30 transition disabled:opacity-50 w-full sm:w-auto"
          >
            {revokingAll ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <LogOut size={14} />
            )}
            Revoke All Others
          </button>
        )}
      </div>

      {/* Sessions list */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-3xl overflow-hidden">
        {loading && (
          <div className="px-5 py-10 flex items-center justify-center gap-2 text-zinc-500 text-sm">
            <Loader2 size={16} className="animate-spin" />
            Loading sessions...
          </div>
        )}

        {!loading &&
          sessions.map((session, idx) => {
            const Icon = deviceIcon(session.type);
            return (
              <div
                key={session.id}
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 ${
                  idx !== sessions.length - 1 ? "border-b border-zinc-800" : ""
                }`}
              >
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400 shrink-0">
                    <Icon size={16} className="sm:hidden" />
                    <Icon size={18} className="hidden sm:block" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white truncate">
                        {session.device}
                      </span>
                      {String(session.user) === String(user._id) && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center gap-1 shrink-0">
                          <ShieldCheck size={10} />
                          This device
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 mt-1.5 text-[11px] sm:text-xs text-zinc-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {session.location}
                      </span>
                      <span className="hidden sm:inline">{session.ip}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {session.lastActive}
                      </span>
                    </div>
                  </div>
                </div>

                {!session.current && (
                  <button
                    onClick={() => handleRevoke(session.id)}
                    disabled={revokingId === session.id}
                    className="text-xs font-medium px-3 py-2 rounded-lg text-zinc-400 active:bg-red-950/30 sm:hover:text-red-400 sm:hover:bg-red-950/20 transition disabled:opacity-50 flex items-center justify-center gap-1.5 self-end sm:self-auto w-full sm:w-auto border border-zinc-800 sm:border-none"
                  >
                    {revokingId === session.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <LogOut size={13} />
                    )}
                    {session.user === user._id ? "Current" : "Revoke"}
                  </button>
                )}
              </div>
            );
          })}

        {!loading && sessions.length === 0 && (
          <div className="px-5 py-10 text-center text-zinc-500 text-sm">
            No active sessions.
          </div>
        )}
      </div>
    </div>
  );
}
