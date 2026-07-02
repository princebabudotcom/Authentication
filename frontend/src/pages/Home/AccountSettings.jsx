import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  User,
  // Bell,
  Shield,
  Lock,
  // Smartphone,
  Monitor,
  // KeyRound,
  // Code2,
  // Link2,
  History,
  // Globe,
  Palette,
  // DatabaseZap,
  // Download,
  // FileCode2,
  Trash2,
  ChevronRight,
  // Database,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

const menu = [
  {
    title: "Account",
    items: [
      {
        name: "Profile",
        icon: User,
        path: "/settings",
      },
      {
        name: "Password",
        icon: Lock,
        path: "/settings/password",
      },
      {
        name: "Security",
        icon: Shield,
        path: "/settings/security",
      },
      {
        name: "Sessions",
        icon: Monitor,
        path: "/settings/sessions",
      },
      {
        name: "Login History",
        icon: History,
        path: "/settings/login-history",
      },
    ],
  },

  {
    title: "Preferences",
    items: [
      {
        name: "Appearance",
        icon: Palette,
        path: "/settings/appearance",
      },
    ],
  },

  {
    title: "Danger Zone",
    items: [
      {
        name: "Delete Account",
        icon: Trash2,
        path: "/settings/delete-account",
        danger: true,
      },
    ],
  },
];

export default function SettingsLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile Header */}

      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 border-b border-zinc-800 bg-black">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/`)}
            className="w-10 h-10 rounded-lg hover:bg-zinc-900 flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="text-lg font-semibold">Settings</h1>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 rounded-lg hover:bg-zinc-900 flex items-center justify-center"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Overlay */}

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
        />
      )}

      <div className="max-w-7xl mx-auto flex">
        {/* Desktop Sidebar */}

        <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-zinc-800 bg-black">
          <div className="h-16 flex items-center px-6 border-b border-zinc-800">
            <button
              onClick={() => navigate(`/`)}
              className="mr-3 w-9 h-9 rounded-lg hover:bg-zinc-900 flex items-center justify-center"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h2 className="font-semibold">Settings</h2>

              <p className="text-xs text-zinc-500">Manage Account</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {menu.map((section, id) => (
              <div key={id}>
                {/* Section Title */}

                <h3 className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {section.title}
                </h3>

                {/* Menu Items */}

                <div className="space-y-1">
                  {section.items.map((item, id) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        end={true}
                        key={id}
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `group flex items-center justify-between rounded-xl px-4 py-3 transition-all duration-200 ${
                            isActive
                              ? "bg-emerald-500 text-black"
                              : item.danger
                                ? "text-red-400 hover:bg-red-950/30"
                                : "text-zinc-300 hover:bg-zinc-900"
                          }`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} />

                          <span className="text-sm font-medium">
                            {item.name}
                          </span>
                        </div>

                        <ChevronRight
                          size={16}
                          className="opacity-40 group-hover:opacity-100 transition"
                        />
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar */}

        <aside
          className={`fixed top-0 left-0 z-50 h-full w-72 bg-black border-r border-zinc-800 transform transition-transform duration-300 lg:hidden ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-16 px-5 border-b border-zinc-800 flex items-center justify-between">
            <h2 className="font-semibold">Settings</h2>

            <button
              onClick={() => setOpen(false)}
              className="w-10 h-10 rounded-lg hover:bg-zinc-900 flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="p-4 space-y-6">
            {menu.map((section, sIdx) => (
              <div key={sIdx}>
                <h3 className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={idx}
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between rounded-xl px-4 py-3 transition ${
                            isActive
                              ? "bg-emerald-500 text-black"
                              : item.danger
                                ? "text-red-400 hover:bg-red-950/30"
                                : "hover:bg-zinc-900 text-zinc-300"
                          }`
                        }
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <ChevronRight size={16} />
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Content */}

        <main className="flex-1 min-h-screen">
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
