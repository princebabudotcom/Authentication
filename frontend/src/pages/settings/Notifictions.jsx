import { useState } from "react";
import {
  Bell,
  Mail,
  MessageSquare,
  ShieldAlert,
  GitBranch,
  Smartphone,
  Megaphone,
  CheckCircle2,
} from "lucide-react";

const sections = [
  {
    title: "Account & Security",
    items: [
      {
        id: "login_alerts",
        icon: ShieldAlert,
        name: "New login alerts",
        desc: "Get notified when a new device signs into your account.",
        default: true,
      },
      {
        id: "security_updates",
        icon: Bell,
        name: "Security updates",
        desc: "Important alerts about password and security changes.",
        default: true,
      },
    ],
  },
  {
    title: "Activity",
    items: [
      {
        id: "comments",
        icon: MessageSquare,
        name: "Comments & mentions",
        desc: "When someone comments on or mentions you in a project.",
        default: true,
      },
      {
        id: "repo_activity",
        icon: GitBranch,
        name: "Repository activity",
        desc: "Pull requests, issues, and pushes on your repos.",
        default: false,
      },
    ],
  },
  {
    title: "Email",
    items: [
      {
        id: "email_digest",
        icon: Mail,
        name: "Weekly digest",
        desc: "A summary of your activity, sent every Monday.",
        default: true,
      },
      {
        id: "product_news",
        icon: Megaphone,
        name: "Product updates",
        desc: "News about new features and improvements.",
        default: false,
      },
    ],
  },
  {
    title: "Mobile",
    items: [
      {
        id: "push_notifications",
        icon: Smartphone,
        name: "Push notifications",
        desc: "Real-time alerts sent to your phone.",
        default: true,
      },
    ],
  },
];

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${
      checked ? "bg-emerald-500" : "bg-zinc-700"
    }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
        checked ? "translate-x-4" : ""
      }`}
    />
  </button>
);

export default function NotificationsPage() {
  const initial = {};
  sections.forEach((s) => s.items.forEach((i) => (initial[i.id] = i.default)));

  const [prefs, setPrefs] = useState(initial);
  const [saved, setSaved] = useState(false);

  const toggle = (id) => {
    setPrefs((p) => ({ ...p, [id]: !p[id] }));
    setSaved(false);
  };

  const handleSave = () => {
    // TODO: replace with real API call
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-xl font-semibold text-white tracking-tight">
          Notifications
        </h1>
        <p className="text-zinc-400 text-sm sm:text-sm mt-2">
          Choose what you want to be notified about.
        </p>
      </div>

      <div className="max-w-3xl space-y-8">
        {sections.map((section, sIdx) => (
          <div key={sIdx}>
            <h2 className="text-base sm:text-xl font-semibold text-white mb-3">
              {section.title}
            </h2>

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden">
              {section.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between gap-4 px-5 sm:px-4 py-3 ${
                      idx !== section.items.length - 1
                        ? "border-b border-zinc-800"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-emerald-400 shrink-0">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-medium text-white">
                          {item.name}
                        </h3>
                        <p className="text-sm sm:text-base text-zinc-500 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <Toggle
                      checked={prefs[item.id]}
                      onChange={() => toggle(item.id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Save bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {saved && (
            <span className="text-sm sm:text-base text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={16} />
              Preferences saved
            </span>
          )}
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-base font-medium bg-emerald-500 text-black active:bg-emerald-400 sm:hover:bg-emerald-400 transition"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
