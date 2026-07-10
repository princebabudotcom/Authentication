import { useRef } from "react";
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
  ArrowRight,
  Circle,
  Clock,
  Bell,
  Monitor,
  LogIn,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import useAuth from "../../context/auth/UseAuth";

/* ── mock data ── */
const stats = [
  {
    label: "Active sessions",
    value: "3",
    sub: "across devices",
    icon: Monitor,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Last sign-in",
    value: "2m",
    sub: "ago from this device",
    icon: LogIn,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    label: "Notifications",
    value: "5",
    sub: "unread alerts",
    icon: Bell,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    label: "Account age",
    value: "172d",
    sub: "since joining",
    icon: TrendingUp,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
];

const recentActivity = [
  {
    icon: LogIn,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Signed in",
    sub: "Chrome · Greater Noida",
    time: "2 min ago",
    status: "success",
  },
  {
    icon: ShieldCheck,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    title: "2FA verified",
    sub: "OTP via email",
    time: "2 min ago",
    status: "success",
  },
  {
    icon: Monitor,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    title: "New session started",
    sub: "Safari · iPhone 14",
    time: "4 hr ago",
    status: "success",
  },
  {
    icon: Lock,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    title: "Password changed",
    sub: "Settings · Web",
    time: "2 days ago",
    status: "warning",
  },
  {
    icon: Activity,
    color: "text-red-400",
    bg: "bg-red-500/10",
    title: "Failed sign-in attempt",
    sub: "Unknown device · Lagos",
    time: "3 days ago",
    status: "danger",
  },
];

const quickLinks = [
  {
    label: "Manage sessions",
    to: "/settings/sessions",
    icon: Monitor,
    desc: "View & revoke active logins",
  },
  {
    label: "Backup codes",
    to: "/settings/backup-codes",
    icon: KeyRound,
    desc: "Save emergency access codes",
  },
  {
    label: "Security settings",
    to: "/settings/security",
    icon: ShieldCheck,
    desc: "2FA, devices, and more",
  },
  {
    label: "Notifications",
    to: "/notifications",
    icon: Bell,
    desc: "Check recent alerts",
  },
];

const features = [
  {
    icon: KeyRound,
    title: "JWT rotation",
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
    desc: "OTP-based two-factor verification flow",
  },
  {
    icon: Activity,
    title: "Live presence",
    desc: "Real-time online/offline status via sockets",
  },
  {
    icon: Smartphone,
    title: "Session control",
    desc: "View and revoke sessions on any device",
  },
  {
    icon: ShieldCheck,
    title: "Account safety",
    desc: "Secure deletion and recovery with OTP checks",
  },
];

/* ── variants ── */
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  },
});

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

/* ── small components ── */
const StatusDot = ({ status }) => (
  <span className="relative flex h-2 w-2 shrink-0">
    {status === "online" && (
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
    )}
    <Circle
      className={`relative h-2 w-2 rounded-full ${status === "online" ? "fill-emerald-400 text-emerald-400" : "fill-zinc-600 text-zinc-600"}`}
    />
  </span>
);

const statusBadge = {
  success: "bg-emerald-500/15 text-emerald-400",
  warning: "bg-yellow-500/15 text-yellow-400",
  danger: "bg-red-500/15 text-red-400",
};

export default function HomePage() {
  const starsRef = useRef([]);
  const { user, isOnline } = useAuth();

  const handleStarHover = (i) => {
    gsap.to(starsRef.current.slice(0, i + 1), {
      scale: 1.3,
      duration: 0.2,
      ease: "back.out(3)",
      yoyo: true,
      repeat: 1,
    });
  };

  const firstName = user?.fullName?.split(" ")[0] ?? "there";
  const initials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("") ?? "U";

  return (
    <div className="w-full space-y-6 pb-10">
      {/* ── Welcome bar ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp(0)}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Good morning, {firstName} 👋
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Here's what's happening with your account today.
          </p>
        </div>
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-2xl self-start sm:self-auto">
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-xs font-semibold text-emerald-400 shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar.url}
                alt=""
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate leading-none">
              {user?.fullName ?? "User"}
            </p>
            <p className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-1.5">
              <StatusDot status={isOnline ? "online" : "offline"} />
              <span className={isOnline ? "text-emerald-400" : "text-zinc-600"}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Stats row ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              variants={fadeUp()}
              className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4"
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${s.bg}`}
              >
                <Icon size={15} className={s.color} />
              </div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs font-medium text-white mt-0.5">{s.label}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">{s.sub}</p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Recent activity + Quick links ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* Activity feed */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp(0.1)}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-white">
              Recent activity
            </h2>
            <NavLink
              to="/settings/login-history"
              className="text-xs text-zinc-500 hover:text-emerald-400 transition flex items-center gap-1"
            >
              View all <ArrowRight size={11} />
            </NavLink>
          </div>

          <div className="divide-y divide-zinc-800">
            {recentActivity.map((a, idx) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="flex items-center gap-3.5 px-5 py-3.5"
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${a.bg}`}
                  >
                    <Icon size={14} className={a.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white leading-snug">
                      {a.title}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">{a.sub}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusBadge[a.status]}`}
                    >
                      {a.status}
                    </span>
                    <p className="text-[11px] text-zinc-600 mt-1 flex items-center justify-end gap-1">
                      <Clock size={10} />
                      {a.time}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp(0.15)}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden self-start"
        >
          <div className="px-5 py-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-white">Quick access</h2>
          </div>
          <div className="divide-y divide-zinc-800">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-900 active:bg-zinc-900 transition group"
                >
                  <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 group-hover:border-emerald-500/40 transition">
                    <Icon
                      size={14}
                      className="text-zinc-400 group-hover:text-emerald-400 transition"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white leading-snug">
                      {link.label}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate">
                      {link.desc}
                    </p>
                  </div>
                  <ArrowRight
                    size={13}
                    className="text-zinc-700 group-hover:text-zinc-400 transition shrink-0"
                  />
                </NavLink>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ── Feature cards ── */}
      <motion.div initial="hidden" animate="show" variants={fadeUp(0.2)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">
            What's built in
          </h2>
          <span className="text-xs text-zinc-500">
            {features.length} features
          </span>
        </div>
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                variants={fadeUp(i * 0.05)}
                whileHover={{ y: -3, borderColor: "rgba(16,185,129,0.3)" }}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
                  <Icon size={15} className="text-emerald-400" />
                </div>
                <h3 className="text-sm font-medium text-white">{f.title}</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* ── Rate section ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={fadeUp(0.3)}
        className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6"
      >
        <div className="max-w-sm">
          <h2 className="text-base font-semibold text-white mb-1">
            Rate this project
          </h2>
          <p className="text-xs text-zinc-500 mb-4">
            Found this auth system useful? Leave a quick rating.
          </p>
          <div className="flex gap-1 mb-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                ref={(el) => (starsRef.current[i] = el)}
                onMouseEnter={() => handleStarHover(i)}
                className="h-6 w-6 cursor-pointer text-zinc-700 hover:fill-emerald-400 hover:text-emerald-400 transition-colors"
              />
            ))}
          </div>
          <textarea
            placeholder="Share your feedback (optional)..."
            rows={3}
            className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/60 transition resize-none mb-3"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-black text-sm font-medium hover:bg-emerald-400 transition"
          >
            <CheckCircle2 size={14} />
            Submit review
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
