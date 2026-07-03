import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShieldCheck,
  KeyRound,
  RefreshCcw,
  MonitorSmartphone,
  ScanEye,
  BellRing,
  Lock,
  ArrowRight,
  Menu,
  X,
  CheckCircle2,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const MotionNavLink = motion(NavLink);

// ---- Mock "live" session log data, mirrors the dashboard's activity feed ----
const LOG_LINES = [
  {
    tag: "POST",
    path: "/auth/login",
    status: 200,
    note: "session created · Chrome, Greater Noida",
  },
  {
    tag: "POST",
    path: "/auth/2fa/verify",
    status: 200,
    note: "OTP verified · email",
  },
  {
    tag: "POST",
    path: "/auth/refresh-token",
    status: 200,
    note: "token rotated · family #a12f",
  },
  {
    tag: "POST",
    path: "/auth/refresh-token",
    status: 401,
    note: "reuse detected · family revoked",
  },
  {
    tag: "GET",
    path: "/auth/sessions",
    status: 200,
    note: "3 active sessions returned",
  },
];

function LiveLog() {
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    if (visible >= LOG_LINES.length) return;
    const t = setTimeout(() => setVisible((v) => v + 1), 900);
    return () => clearTimeout(t);
  }, [visible]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      className="rounded-xl border border-emerald-500/15 bg-black/90 backdrop-blur-sm font-mono text-[13px] leading-relaxed shadow-[0_0_40px_-12px_rgba(16,185,129,0.35)]"
    >
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-2 text-xs text-white/40">session-log.stream</span>
      </div>
      <div className="space-y-2 px-4 py-4">
        <AnimatePresence initial={false}>
          {LOG_LINES.slice(0, visible).map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="flex flex-wrap items-baseline gap-x-2"
            >
              <span
                className={
                  l.status >= 400 ? "text-rose-400" : "text-emerald-400"
                }
              >
                {l.status}
              </span>
              <span className="text-white/50">{l.tag}</span>
              <span className="text-white/80">{l.path}</span>
              <span className="text-white/35">— {l.note}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {visible < LOG_LINES.length && (
          <div className="flex items-center gap-1 text-white/30">
            <span className="inline-block h-3 w-1.5 animate-pulse bg-emerald-400/60" />
            <span>listening…</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

const FEATURES = [
  {
    icon: RefreshCcw,
    title: "JWT rotation",
    body: "Every refresh issues a new token and retires the old one, so a stolen token has a short shelf life.",
  },
  {
    icon: ScanEye,
    title: "Reuse detection",
    body: "If a rotated-out token gets replayed, we catch it instantly and revoke the entire session family.",
  },
  {
    icon: MonitorSmartphone,
    title: "Session families",
    body: "Every login on every device is tracked as its own family, so you can see and end them individually.",
  },
  {
    icon: KeyRound,
    title: "Two-factor auth",
    body: "Email OTP verification adds a second check before anyone signs in, no authenticator app required.",
  },
  {
    icon: Lock,
    title: "Backup codes",
    body: "Single-use recovery codes get you back in if you ever lose access to your primary sign-in method.",
  },
  {
    icon: BellRing,
    title: "Real-time alerts",
    body: "New device sign-ins, password changes, and failed attempts show up the moment they happen.",
  },
];

const STEPS = [
  {
    step: "Sign in",
    detail: "Credentials are checked and a short-lived access token is issued.",
  },
  {
    step: "Verify",
    detail:
      "A one-time code confirms it's really you before the session opens.",
  },
  {
    step: "Rotate",
    detail: "Each refresh swaps your token for a new one and retires the last.",
  },
  {
    step: "Watch",
    detail:
      "A reused or stolen token trips the alarm and shuts the family down.",
  },
];

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const featureGrid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const featureItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function AuthLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const howRef = useRef(null);
  const lineRef = useRef(null);
  const stepRefs = useRef([]);
  stepRefs.current = [];

  const addStepRef = (el) => {
    if (el && !stepRefs.current.includes(el)) stepRefs.current.push(el);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ambient blobs drift slowly, forever
      gsap.to(blob1Ref.current, {
        x: 50,
        y: 30,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(blob2Ref.current, {
        x: -40,
        y: -35,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Connector line draws as the "how it works" section scrolls into view
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: {
            trigger: howRef.current,
            start: "top 75%",
            end: "bottom 55%",
            scrub: true,
          },
        },
      );

      // Each step circle lights up emerald as it's reached
      stepRefs.current.forEach((el) => {
        const circle = el.querySelector("[data-circle]");
        gsap.fromTo(
          circle,
          {
            borderColor: "rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.4)",
          },
          {
            borderColor: "rgba(52,211,153,0.6)",
            color: "rgb(110,231,183)",
            duration: 0.4,
            ease: "power1.out",
            scrollTrigger: { trigger: el, start: "top 82%" },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="dark min-h-screen w-full bg-black text-white antialiased">
      <style>{`
        .grain::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* Ambient backdrop, drifted by GSAP */}
      <div className="pointer-events-none fixed inset-0 grain overflow-hidden">
        <div
          ref={blob1Ref}
          className="absolute left-1/2 top-[-10%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[140px]"
        />
        <div
          ref={blob2Ref}
          className="absolute bottom-[-15%] right-[-10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[140px]"
        />
      </div>

      <div className="relative">
        {/* Nav */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-400/30">
              <ShieldCheck
                className="h-4.5 w-4.5 text-emerald-400"
                strokeWidth={2.25}
              />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">
              AuthApp
            </span>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-white/60 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <a href="#how" className="transition hover:text-white">
              How it works
            </a>
            <a href="#" className="transition hover:text-white">
              Docs
            </a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <NavLink
              to="/auth/login"
              className="text-sm text-white/70 transition hover:text-white"
            >
              Sign in
            </NavLink>
            <MotionNavLink
              to="/auth/register"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-[#052b1e] transition-colors hover:bg-emerald-400"
            >
              Create account
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </MotionNavLink>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </motion.header>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mx-6 mb-4 overflow-hidden rounded-xl border border-white/10 bg-white/5 text-sm md:hidden"
            >
              <div className="flex flex-col gap-3 p-4">
                <a href="#features" className="text-white/70">
                  Features
                </a>
                <a href="#how" className="text-white/70">
                  How it works
                </a>
                <a href="#" className="text-white/70">
                  Docs
                </a>
                <hr className="border-white/10" />
                <NavLink to="/auth/login" className="text-left text-white/70">
                  Sign in
                </NavLink>
                <NavLink
                  to="/auth/register"
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-center font-medium text-[#052b1e]"
                >
                  Create account
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero */}
        <section className="mx-auto grid max-w-6xl gap-14 px-6 pb-24 pt-10 md:grid-cols-2 md:items-center md:pt-16">
          <motion.div variants={heroContainer} initial="hidden" animate="show">
            <motion.div
              variants={heroItem}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs text-emerald-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Reuse detection active on every session
            </motion.div>
            <motion.h1
              variants={heroItem}
              className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-[52px]"
            >
              Sign-in you don't
              <br />
              have to think twice about.
            </motion.h1>
            <motion.p
              variants={heroItem}
              className="mt-5 max-w-md text-[15px] leading-relaxed text-white/55"
            >
              AuthApp handles the parts of authentication that are easy to get
              wrong — token rotation, stolen-session detection, and recovery —
              so you can sign in once and trust it's still you on every device.
            </motion.p>
            <motion.div
              variants={heroItem}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <MotionNavLink
                to="/auth/register"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-medium text-[#052b1e] transition-colors hover:bg-emerald-400"
              >
                Create your account
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </MotionNavLink>
              <MotionNavLink
                to="/auth/login"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/5"
              >
                Sign in
              </MotionNavLink>
            </motion.div>
            <motion.div
              variants={heroItem}
              className="mt-9 flex items-center gap-6 text-xs text-white/35"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> No password reuse
                across services
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Free to start
              </span>
            </motion.div>
          </motion.div>

          <LiveLog />
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="mb-12 max-w-lg"
          >
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-400/80">
              What's included
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Everything an account needs to defend itself.
            </h2>
          </motion.div>

          <motion.div
            variants={featureGrid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title}
                variants={featureItem}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="group relative bg-black p-7"
              >
                <Icon
                  className="h-5 w-5 text-emerald-400/90"
                  strokeWidth={1.75}
                />
                <h3 className="mt-4 text-[15px] font-medium">{title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/45">
                  {body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* How it works */}
        <section id="how" ref={howRef} className="mx-auto max-w-6xl px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
            className="mb-12 max-w-lg"
          >
            <span className="text-xs font-medium uppercase tracking-wider text-emerald-400/80">
              The refresh cycle
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              What happens behind one sign-in.
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-0 right-0 top-[17px] hidden h-px bg-white/10 md:block" />
            <div
              ref={lineRef}
              className="absolute left-0 right-0 top-[17px] hidden h-px bg-emerald-400/70 md:block"
              style={{ transform: "scaleX(0)" }}
            />
            <div className="grid gap-10 md:grid-cols-4 md:gap-6">
              {STEPS.map((s, i) => (
                <div key={s.step} ref={addStepRef} className="relative">
                  <div
                    data-circle
                    className="relative z-10 mb-4 flex h-9 w-9 items-center justify-center rounded-full border bg-black text-sm"
                  >
                    {i + 1}
                  </div>
                  <h4 className="text-[15px] font-medium">{s.step}</h4>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/45">
                    {s.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto max-w-6xl px-6 pb-24"
        >
          <div className="relative overflow-hidden rounded-2xl border border-emerald-400/15 bg-gradient-to-br from-emerald-500/10 to-transparent px-8 py-14 text-center md:py-16">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Create an account to see your dashboard.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/50">
              Sign in or sign up to view your sessions, activity, and security
              settings.
            </p>
            <div className="mt-7 flex justify-center gap-4">
              <MotionNavLink
                to="/auth/register"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-medium text-[#052b1e] transition-colors hover:bg-emerald-400"
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </MotionNavLink>
              <MotionNavLink
                to="/auth/login"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-lg border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/5"
              >
                Sign in
              </MotionNavLink>
            </div>
          </div>
        </motion.section>

        <footer className="mx-auto max-w-6xl px-6 pb-10 text-xs text-white/30">
          © {new Date().getFullYear()} AuthApp. Built for accounts that get
          attacked.
        </footer>
      </div>
    </div>
  );
}
