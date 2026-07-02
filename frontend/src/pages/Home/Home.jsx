import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { NavLink } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Fingerprint,
  Activity,
  Smartphone,
  Star,
  Home,
  ListChecks,
  Bell,
  Settings,
  LogOut,
  Circle,
  Menu,
  X,
} from "lucide-react";
import useAuth from "../../context/auth/UseAuth";

const navItems = [
  { icon: Home, label: "Home", to: "/" },
  { icon: ListChecks, label: "Sessions", to: "/sessions" },
  { icon: Bell, label: "Notifications", to: "/notifications" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

const features = [
  {
    icon: KeyRound,
    title: "JWT auth",
    desc: "Access + refresh token rotation with reuse detection",
  },
  {
    icon: Fingerprint,
    title: "Device tracking",
    desc: "Session fingerprinting across every login",
  },
  {
    icon: Lock,
    title: "2FA security",
    desc: "OTP-based two factor verification flow",
  },
  {
    icon: Activity,
    title: "Live presence",
    desc: "Real-time online and offline status via sockets",
  },
  {
    icon: Smartphone,
    title: "Session control",
    desc: "View and revoke active sessions on any device",
  },
  {
    icon: ShieldCheck,
    title: "Account safety",
    desc: "Secure deletion and recovery with OTP checks",
  },
];

function Sidebar({ username = "Prince Kumar", open, onClose, logoutUser }) {
  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <>
      {/* Backdrop on mobile */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-60 shrink-0 flex-col justify-between border-r border-zinc-800 bg-zinc-950 px-4 py-6 transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="mb-8 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
              <span className="text-lg font-semibold">AuthCore</span>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-100 lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div>
          <button
            onClick={logoutUser}
            className="mb-3 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
          <div className="flex items-center gap-3 rounded-lg border border-zinc-800 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-400">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-100">
                {username}
              </p>
              <p className="text-xs text-zinc-500">Signed in</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

const onlineUsers = [
  { name: "Aarav Sharma", role: "Backend Dev", status: "online" },
  { name: "Priya Verma", role: "Frontend Dev", status: "online" },
  { name: "Rohan Mehta", role: "DevOps Engineer", status: "online" },
  { name: "Sneha Kapoor", role: "Full Stack Dev", status: "offline" },
  { name: "Vikram Singh", role: "QA Engineer", status: "offline" },
  { name: "Ananya Joshi", role: "UI/UX Designer", status: "online" },
];

function StatusDot({ status }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      {status === "online" && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
      )}
      <Circle
        className={`relative h-2.5 w-2.5 rounded-full ${
          status === "online"
            ? "fill-emerald-400 text-emerald-400"
            : "fill-zinc-600 text-zinc-600"
        }`}
      />
    </span>
  );
}

function UserRow({ user, index }) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-400">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-100">{user.name}</p>
          <p className="text-xs text-zinc-500">{user.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`text-xs ${
            user.status === "online" ? "text-emerald-400" : "text-zinc-500"
          }`}
        >
          {user.status === "online" ? "Online" : "Offline"}
        </span>
        <StatusDot status={user.status} />
      </div>
    </motion.div>
  );
}

const heroContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" },
  }),
};

function FeatureCard({ feature, index }) {
  const Icon = feature.icon;
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={cardVariants}
      whileHover={{ y: -4, borderColor: "rgba(16,185,129,0.4)" }}
      className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
    >
      <Icon className="mb-3 h-6 w-6 text-emerald-400" />
      <h3 className="mb-1 text-sm font-medium text-zinc-100">
        {feature.title}
      </h3>
      <p className="text-xs text-zinc-500">{feature.desc}</p>
    </motion.div>
  );
}

export default function HomePage() {
  const starsRef = useRef([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, logout } = useAuth();

  const logoutUser = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  const handleStarHover = (i) => {
    gsap.to(starsRef.current.slice(0, i + 1), {
      scale: 1.2,
      duration: 0.2,
      ease: "back.out(3)",
      yoyo: true,
      repeat: 1,
    });
  };

  return (
    <div className="flex min-h-screen bg-black text-zinc-100">
      <Sidebar
        username={user?.fullName}
        open={sidebarOpen}
        logoutUser={logoutUser}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 lg:ml-60">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-zinc-400 hover:text-zinc-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-lg font-semibold">Dashboard</span>
          </div>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400">
            Control panel
          </span>
        </header>

        {/* Big banner */}
        <section className="relative isolate overflow-hidden border-b border-zinc-800 px-6 py-16 sm:px-10 sm:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.16),transparent_55%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 -z-10 h-64 w-64 -translate-y-1/3 translate-x-1/3 rounded-full bg-emerald-500/20 blur-3xl"
          />

          <motion.div
            initial="hidden"
            animate="show"
            variants={heroContainer}
            className="relative z-10 mx-auto max-w-3xl text-center"
          >
            <motion.div
              variants={heroItem}
              className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Built for product-grade apps
            </motion.div>

            <motion.h1
              variants={heroItem}
              className="mb-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
            >
              Secure auth, real-time presence,
              <span className="block">all in one foundation</span>
            </motion.h1>

            <motion.p
              variants={heroItem}
              className="mx-auto mb-8 max-w-xl text-sm text-zinc-400 sm:text-base"
            >
              Everything you need to ship sign in, session handling, and live
              user tracking — without rebuilding it from scratch.
            </motion.p>

            <motion.div
              variants={heroItem}
              className="mb-12 flex flex-wrap items-center justify-center gap-3"
            >
              <button className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-emerald-400">
                View documentation
              </button>
              <button className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-500">
                View on GitHub
              </button>
            </motion.div>

            <motion.div
              variants={heroItem}
              className="mx-auto grid max-w-sm grid-cols-3 gap-2 border-t border-zinc-800 pt-8 sm:gap-4"
            >
              <div className="min-w-0">
                <p className="truncate text-xl font-semibold text-emerald-400 sm:text-2xl">
                  99.9%
                </p>
                <p className="text-[11px] text-zinc-500 sm:text-xs">Uptime</p>
              </div>
              <div className="min-w-0 border-x border-zinc-800">
                <p className="truncate text-xl font-semibold text-emerald-400 sm:text-2xl">
                  256-bit
                </p>
                <p className="text-[11px] text-zinc-500 sm:text-xs">
                  Token hashing
                </p>
              </div>
              <div className="min-w-0">
                <p className="truncate text-xl font-semibold text-emerald-400 sm:text-2xl">
                  {onlineUsers.filter((u) => u.status === "online").length}
                </p>
                <p className="text-[11px] text-zinc-500 sm:text-xs">
                  Online now
                </p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features + live users */}
        <section className="grid grid-cols-1 gap-6 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[1fr_320px]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} />
            ))}
          </div>

          <aside className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="mb-4 flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold">Active users</h2>
              <span className="text-xs text-zinc-500">
                {onlineUsers.filter((u) => u.status === "online").length} online
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {onlineUsers.map((user, i) => (
                <UserRow key={user.name} user={user} index={i} />
              ))}
            </div>
          </aside>
        </section>

        {/* Review / rate project */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="border-t border-zinc-800 px-4 py-12 sm:px-6 sm:py-14"
        >
          <div className="mx-auto max-w-md text-center">
            <h2 className="mb-2 text-xl font-semibold">Rate this project</h2>
            <p className="mb-4 text-sm text-zinc-500">
              Found this auth system useful? Leave a quick rating.
            </p>
            <div className="mb-4 flex justify-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  ref={(el) => (starsRef.current[i] = el)}
                  onMouseEnter={() => handleStarHover(i)}
                  className="h-6 w-6 cursor-pointer text-zinc-700 transition-colors hover:fill-emerald-400 hover:text-emerald-400"
                />
              ))}
            </div>
            <textarea
              placeholder="Share your feedback..."
              rows={3}
              className="mb-3 w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-emerald-500"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-black"
            >
              Submit review
            </motion.button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
