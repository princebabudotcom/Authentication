// cat > /home/claude/AppLayout.jsx << 'EOF'
import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bell,
  Activity,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  Users,
  KeyRound,
  Code2,
  Monitor,
} from "lucide-react";
import useAuth from "../context/auth/UseAuth";

const navItems = [
  {
    section: "Main",
    items: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/" },
      { name: "Notifications", icon: Bell, path: "/notifications" },
      { name: "Activity", icon: Activity, path: "/activity" },
    ],
  },
  {
    section: "Security",
    items: [
      { name: "Sessions", icon: Monitor, path: "/sessions" },
      { name: "Backup Codes", icon: KeyRound, path: "/backup-codes" },
      { name: "Connections", icon: Code2, path: "/connections" },
    ],
  },
  {
    section: "Admin",
    items: [{ name: "Users", icon: Users, path: "/users" }],
  },
];

const SideNavLink = ({ item, onClick }) => {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          isActive
            ? "bg-emerald-500 text-black"
            : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
        }`
      }
    >
      <div className="flex items-center gap-3">
        <Icon size={16} />
        <span>{item.name}</span>
      </div>
      <ChevronRight
        size={13}
        className="opacity-0 group-hover:opacity-50 transition"
      />
    </NavLink>
  );
};

const SidebarInner = ({ onClose, user, onLogout, navigate }) => (
  <div className="flex flex-col h-full">
    {/* Brand */}
    <div className="flex items-center gap-3 px-5 h-14 border-b border-zinc-800 shrink-0">
      <div className="relative w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
        <div className="absolute inset-0 rounded-xl bg-emerald-500/10 blur-sm" />
        <ShieldCheck size={15} className="relative text-emerald-400" />
      </div>
      <div>
        <p className="text-sm font-semibold text-white leading-none">AuthApp</p>
        <p className="text-[11px] text-zinc-500 mt-0.5">Secure Dashboard</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-900 hover:text-white transition"
        >
          <X size={16} />
        </button>
      )}
    </div>

    {/* Nav */}
    <nav className="flex-1 overflow-y-auto p-3 space-y-5">
      {navItems.map((section) => (
        <div key={section.section}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 px-3 mb-1.5">
            {section.section}
          </p>
          <div className="space-y-0.5">
            {section.items.map((item) => (
              <SideNavLink key={item.path} item={item} onClick={onClose} />
            ))}
          </div>
        </div>
      ))}
    </nav>

    {/* User footer */}
    <div className="shrink-0 border-t border-zinc-800 p-3 space-y-0.5">
      <NavLink
        to="/settings"
        onClick={onClose}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
            isActive
              ? "bg-zinc-900 text-white"
              : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
          }`
        }
      >
        <div className="w-7 h-7 rounded-full bg-zinc-800 overflow-hidden shrink-0 ring-1 ring-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-300">
          {user?.avatar ? (
            <img
              src={user.avatar.url}
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            (user?.fullName?.[0] ?? "U")
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate leading-none">
            {user?.fullName ?? "User"}
          </p>
          <p className="text-[11px] text-zinc-500 truncate mt-0.5">
            {user?.email ?? ""}
          </p>
        </div>
        <Settings size={13} className="shrink-0 opacity-40" />
      </NavLink>

      <button
        onClick={onLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-red-400 hover:bg-red-950/20 transition"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </div>
  </div>
);

export default function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout?.();
    navigate("/auth/login");
  };

  return (
    // Full viewport, nothing overflows at root
    <div className="h-screen w-screen flex overflow-hidden bg-black text-white">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-[220px] shrink-0 h-full bg-zinc-950 border-r border-zinc-800">
        <SidebarInner user={user} onLogout={handleLogout} navigate={navigate} />
      </aside>

      {/* ── Mobile overlay ── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[220px] bg-zinc-950 border-r border-zinc-800 transform transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarInner
          user={user}
          onLogout={handleLogout}
          navigate={navigate}
          onClose={() => setOpen(false)}
        />
      </aside>

      {/* ── Right side: topbar + scrollable content ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden shrink-0 flex items-center justify-between h-14 px-4 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setOpen(true)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-900 transition"
            >
              <Menu size={19} />
            </button>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="text-sm font-semibold">AuthApp</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NavLink
              to="/notifications"
              className="relative w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-900 transition"
            >
              <Bell size={17} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-zinc-950" />
            </NavLink>
            <NavLink
              to="/settings"
              className="w-7 h-7 rounded-full bg-zinc-800 overflow-hidden ring-1 ring-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-300"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar.url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                (user?.fullName?.[0] ?? "U")
              )}
            </NavLink>
          </div>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 sm:p-7">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
