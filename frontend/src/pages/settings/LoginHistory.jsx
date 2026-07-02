import { useState } from "react";
import {
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from "lucide-react";

const history = [
  {
    id: "lh_1",
    device: "Chrome on Windows",
    type: "desktop",
    location: "Greater Noida, India",
    ip: "182.65.34.12",
    time: "Today, 10:42 AM",
    status: "success",
  },
  {
    id: "lh_2",
    device: "Safari on iPhone 14",
    type: "mobile",
    location: "Aligarh, India",
    ip: "103.21.45.88",
    time: "Yesterday, 8:15 PM",
    status: "success",
  },
  {
    id: "lh_3",
    device: "Unknown device",
    type: "desktop",
    location: "Lagos, Nigeria",
    ip: "41.203.12.77",
    time: "2 days ago, 3:02 AM",
    status: "failed",
  },
  {
    id: "lh_4",
    device: "Chrome on iPad",
    type: "tablet",
    location: "Lucknow, India",
    ip: "59.180.22.91",
    time: "4 days ago, 6:48 PM",
    status: "success",
  },
  {
    id: "lh_5",
    device: "Edge on Windows",
    type: "desktop",
    location: "New Delhi, India",
    ip: "117.98.12.4",
    time: "5 days ago, 11:20 AM",
    status: "suspicious",
  },
  {
    id: "lh_6",
    device: "Firefox on Android",
    type: "mobile",
    location: "Aligarh, India",
    ip: "103.21.45.90",
    time: "1 week ago, 9:05 AM",
    status: "success",
  },
];

const deviceIcon = (type) => {
  if (type === "mobile") return Smartphone;
  if (type === "tablet") return Tablet;
  return Monitor;
};

const statusConfig = {
  success: {
    label: "Success",
    color: "text-emerald-400 bg-emerald-500/15",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    color: "text-red-400 bg-red-500/15",
    icon: XCircle,
  },
  suspicious: {
    label: "Suspicious",
    color: "text-yellow-400 bg-yellow-500/15",
    icon: ShieldAlert,
  },
};

export default function LoginHistoryPage() {
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all" ? history : history.filter((h) => h.status === filter);

  const filters = [
    { id: "all", label: "All" },
    { id: "success", label: "Success" },
    { id: "failed", label: "Failed" },
    { id: "suspicious", label: "Suspicious" },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Login History</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Review recent sign-in activity on your account.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 max-w-3xl overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-full border transition ${
              filter === f.id
                ? "bg-emerald-500 text-black border-emerald-500"
                : "text-zinc-400 border-zinc-800 active:bg-zinc-900 sm:hover:bg-zinc-900"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* History list */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-3xl overflow-hidden">
        {filtered.map((entry, idx) => {
          const Icon = deviceIcon(entry.type);
          const status = statusConfig[entry.status];
          const StatusIcon = status.icon;

          return (
            <div
              key={entry.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 ${
                idx !== filtered.length - 1 ? "border-b border-zinc-800" : ""
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400 shrink-0">
                  <Icon size={16} className="sm:hidden" />
                  <Icon size={18} className="hidden sm:block" />
                </div>

                <div className="min-w-0">
                  <span className="text-sm font-medium text-white truncate block">
                    {entry.device}
                  </span>

                  <div className="flex items-center gap-2 sm:gap-3 mt-1.5 text-[11px] sm:text-xs text-zinc-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {entry.location}
                    </span>
                    <span className="hidden sm:inline">{entry.ip}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {entry.time}
                    </span>
                  </div>
                </div>
              </div>

              <span
                className={`self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${status.color}`}
              >
                <StatusIcon size={12} />
                {status.label}
              </span>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="px-5 py-10 text-center text-zinc-500 text-sm">
            No login activity found.
          </div>
        )}
      </div>
    </div>
  );
}
