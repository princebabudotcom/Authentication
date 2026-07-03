import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  User,
  Shield,
  Lock,
  Monitor,
  History,
  Palette,
  Trash2,
  ChevronRight,
  ArrowLeft,
  Menu,
  X,
} from "lucide-react";

const menu = [
  {
    title: "Account",
    items: [
      { name: "Profile", icon: User, path: "/settings" },
      { name: "Password", icon: Lock, path: "/settings/password" },
      { name: "Security", icon: Shield, path: "/settings/security" },
      { name: "Sessions", icon: Monitor, path: "/settings/sessions" },
      { name: "Login History", icon: History, path: "/settings/login-history" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { name: "Appearance", icon: Palette, path: "/settings/appearance" },
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

const NavItems = ({ onClose }) => (
  <nav className="p-3 space-y-5">
    {menu.map((section, sIdx) => (
      <div key={sIdx}>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 px-3 mb-1.5">
          {section.title}
        </p>
        <div className="space-y-0.5">
          {section.items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={idx}
                end={item.path === "/settings"}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all ${
                    isActive
                      ? "bg-emerald-500 text-black"
                      : item.danger
                        ? "text-red-400 hover:bg-red-950/30"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={15} />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <ChevronRight
                  size={13}
                  className="opacity-0 group-hover:opacity-50 transition"
                />
              </NavLink>
            );
          })}
        </div>
      </div>
    ))}
  </nav>
);

export default function SettingsLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    /*
      This layout now renders on its own — a sibling route to AppLayout,
      not nested inside it (see AppRouter). AppLayout's sidebar never
      mounts here, so this is simply THE sidebar for /settings/*, fixed
      to the viewport, full height, with the outlet as the only
      independently-scrolling region next to it.
    */
    <div className="min-h-screen bg-black text-white">
      {/* ── Mobile overlay ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-56 bg-zinc-950 border-r border-zinc-800 flex flex-col transform transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-800 shrink-0">
          <p className="text-sm font-semibold text-white">Settings</p>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-900 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          <NavItems onClose={() => setOpen(false)} />
        </div>
      </aside>

      {/* ── Desktop settings sidebar — fixed, full height, only sidebar on this route ── */}
      <aside className="hidden lg:flex flex-col w-52 shrink-0 border-r border-zinc-800 bg-zinc-950 fixed top-0 left-0 h-screen overflow-hidden">
        <div className="shrink-0 h-14 flex items-center gap-2.5 px-4 border-b border-zinc-800">
          <button
            onClick={() => navigate("/")}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-800 hover:text-white transition"
          >
            <ArrowLeft size={15} />
          </button>
          <div>
            <p className="text-sm font-semibold text-white leading-none">
              Settings
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5">Manage account</p>
          </div>
        </div>

        {/* Scrollable nav (scrolls only if the menu itself is taller than the screen) */}
        <div className="flex-1 overflow-y-auto">
          <NavItems onClose={() => {}} />
        </div>
      </aside>

      {/* ── Settings content — offset by the fixed sidebar's width, scrolls independently ── */}
      <div className="flex flex-col min-w-0 min-h-screen bg-black lg:ml-52">
        {/* Mobile bar */}
        <div className="lg:hidden shrink-0 flex items-center justify-between h-12 px-4 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-900 transition"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-white">Settings</span>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-900 transition"
          >
            <Menu size={17} />
          </button>
        </div>

        {/* Independently scrollable outlet */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 sm:p-7 max-w-3xl">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
