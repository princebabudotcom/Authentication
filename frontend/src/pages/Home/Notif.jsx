import {
  Bell,
  ShieldCheck,
  Mail,
  KeyRound,
  Smartphone,
  CircleAlert,
  Trash2,
  CheckCheck,
  ArrowLeft,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      title: "New Login Detected",
      description: "Your account was accessed from Chrome on Windows.",
      time: "2 minutes ago",
      unread: true,
      icon: <ShieldCheck size={18} className="text-emerald-400" />,
    },
    {
      id: 2,
      title: "Password Changed",
      description: "Your password was updated successfully.",
      time: "1 hour ago",
      unread: false,
      icon: <KeyRound size={18} className="text-yellow-400" />,
    },
    {
      id: 3,
      title: "Email Verified",
      description: "Your email address has been verified.",
      time: "Yesterday",
      unread: false,
      icon: <Mail size={18} className="text-blue-400" />,
    },
    {
      id: 4,
      title: "Backup Codes Generated",
      description: "New backup codes were generated for your account.",
      time: "2 days ago",
      unread: true,
      icon: <ShieldCheck size={18} className="text-purple-400" />,
    },
    {
      id: 5,
      title: "New Device Added",
      description: "Android device has been added as a trusted device.",
      time: "4 days ago",
      unread: false,
      icon: <Smartphone size={18} className="text-cyan-400" />,
    },
    {
      id: 6,
      title: "Security Alert",
      description: "Multiple failed login attempts detected.",
      time: "1 week ago",
      unread: true,
      icon: <CircleAlert size={18} className="text-red-400" />,
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}

      <div className="sticky top-0 z-20 bg-black border-b border-zinc-800">
        <div className="flex items-center gap-3 h-16 px-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full hover:bg-zinc-900 flex items-center justify-center"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className="font-semibold text-lg">Notifications</h1>
            <p className="text-xs text-zinc-400">Stay updated</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Filters */}

        <div className="flex gap-3 mb-6">
          <button className="px-4 py-2 rounded-lg bg-emerald-500 text-black text-sm font-medium">
            All
          </button>

          <button className="px-4 py-2 rounded-lg border border-zinc-700 text-sm hover:bg-zinc-900">
            Unread
          </button>

          <button className="px-4 py-2 rounded-lg border border-zinc-700 text-sm hover:bg-zinc-900">
            Security
          </button>

          <button className="px-4 py-2 rounded-lg border border-zinc-700 text-sm hover:bg-zinc-900">
            Account
          </button>
        </div>

        {/* Notifications */}

        <div className="space-y-4">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`border rounded-xl p-5 transition hover:border-emerald-500 ${
                item.unread
                  ? "border-emerald-500 bg-emerald-500/5"
                  : "border-zinc-800 bg-zinc-950"
              }`}
            >
              <div className="flex justify-between gap-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-black border border-zinc-800 flex items-center justify-center">
                    {item.icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{item.title}</h3>

                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      )}
                    </div>

                    <p className="text-sm text-zinc-400 mt-1">
                      {item.description}
                    </p>

                    <p className="text-xs text-zinc-500 mt-3">{item.time}</p>
                  </div>
                </div>

                <button className="text-sm text-emerald-400 hover:text-emerald-300">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
