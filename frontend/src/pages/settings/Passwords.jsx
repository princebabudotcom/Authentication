import { useEffect, useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  KeyRound,
  AlertTriangle,
  //   Chrome,
  GitCommit,
  Plus,
} from "lucide-react";
import userApi from "../../../api/user.api";
import useAuth from "../../context/auth/UseAuth";
import SettingsLoader from "../../components/PasswordLoader";

/* ── helpers ── */
const requirements = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One number", test: (v) => /[0-9]/.test(v) },
  { label: "One special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const strengthLabel = (n) =>
  n === 0
    ? null
    : n <= 1
      ? {
          text: "Weak",
          bar: "w-1/4",
          color: "bg-red-500",
          text_c: "text-red-400",
        }
      : n <= 3
        ? {
            text: "Medium",
            bar: "w-2/4",
            color: "bg-yellow-500",
            text_c: "text-yellow-400",
          }
        : {
            text: "Strong",
            bar: "w-full",
            color: "bg-emerald-500",
            text_c: "text-emerald-400",
          };

/* ── sub-components ── */
const SectionCard = ({
  title,
  desc,
  icon: Icon,
  iconColor = "text-emerald-400",
  iconBg = "bg-emerald-500/10",
  children,
}) => (
  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6">
    <div className="flex items-start gap-3 mb-5">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
      >
        <Icon size={17} className={iconColor} />
      </div>
      <div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {desc && (
          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{desc}</p>
        )}
      </div>
    </div>
    {children}
  </div>
);

const PasswordInput = ({
  label,
  value,
  onChange,
  show,
  setShow,
  placeholder,
  error,
}) => (
  <div>
    <label className="block text-xs sm:text-sm text-zinc-400 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <Lock
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
      />
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-black border rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none transition ${
          error
            ? "border-red-500"
            : "border-zinc-800 focus:border-emerald-500/60"
        }`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 active:text-zinc-300 sm:hover:text-zinc-300 transition"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
    {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
  </div>
);

const SavedNote = ({ show }) =>
  show ? (
    <p className="flex items-center gap-1.5 text-sm text-emerald-400 mt-4">
      <CheckCircle2 size={14} /> Saved successfully.
    </p>
  ) : null;

/* ── mock user state ── */
// In real app, pull from auth context

export default function PasswordPage() {
  // const { user } = useAuth();

  const [user, setUser] = useState({
    hasPassword: false,
    providers: [],
  });

  const isGoogleOnly = !user.hasPassword && user.providers.includes("google");

  const hasGitHub = user.providers.includes("github");
  const hasPassword = user.hasPassword;

  const [loading, setLoading] = useState(true);

  /* ── Set Password ── */
  const [setPass, setSetPass] = useState("");
  const [setPassConfirm, setSetPassConfirm] = useState("");
  const [showSetPass, setShowSetPass] = useState(false);
  const [showSetConfirm, setShowSetConfirm] = useState(false);
  const [settingPass, setSettingPass] = useState(false);
  const [savedSetPass, setSavedSetPass] = useState(false);
  const [setPassError, setSetPassError] = useState("");

  const setPassCount = requirements.filter((r) => r.test(setPass)).length;
  const setPassStrength = strengthLabel(setPassCount);

  const setPassMatches =
    setPassConfirm.length > 0 && setPass === setPassConfirm;

  const canSetPass = setPassCount === requirements.length && setPassMatches;

  useEffect(() => {
    const getProviders = async () => {
      try {
        const { data } = await userApi.OAuthProviders();

        setUser(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProviders();
  }, []);

  const handleSetPassword = async () => {
    if (!canSetPass) return;

    setSetPassError("");
    setSettingPass(true);

    try {
      await userApi.setPassword({
        password: setPass,
        confirmPassword: setPassConfirm,
      });

      setSavedSetPass(true);
      setSetPass("");
      setSetPassConfirm("");

      setTimeout(() => setSavedSetPass(false), 2000);
    } catch (error) {
      console.log(error.response);
      setSetPassError(
        error?.response?.data?.message || "Failed to set password. Try again.",
      );
    } finally {
      setSettingPass(false);
    }
  };

  /* ── change password ── */
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [savedChange, setSavedChange] = useState(false);
  const [changeErrors, setChangeErrors] = useState({});

  const nextPassCount = requirements.filter((r) => r.test(next)).length;
  const nextPassStrength = strengthLabel(nextPassCount);
  const nextMatches = confirm.length > 0 && next === confirm;
  const canChange =
    current.length > 0 && nextPassCount === requirements.length && nextMatches;

  const handleChangePassword = async () => {
    const errs = {};
    if (!current) errs.current = "Enter your current password.";
    if (nextPassCount < requirements.length)
      errs.next = "Password doesn't meet all requirements.";
    if (!nextMatches) errs.confirm = "Passwords do not match.";
    if (Object.keys(errs).length) {
      setChangeErrors(errs);
      return;
    }
    setChangeErrors({});
    setChangingPass(true);
    try {
      await userApi.changePassword({
        currentPassword: current,
        newPassword: next,
        confirmPassword: confirm,
      });
      setCurrent("");
      setNext("");
      setConfirm("");
      setSavedChange(true);
      setTimeout(() => setSavedChange(false), 2000);
    } catch {
      setChangeErrors({ api: "Failed to update password. Try again." });
    } finally {
      setChangingPass(false);
    }
  };

  if (loading) {
    return <SettingsLoader />;
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Password & Security
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm mt-1">
          Manage how you sign in to your account.
        </p>
      </div>

      {/* ── Sign-in methods card ── */}
      <SectionCard
        icon={ShieldCheck}
        title="Sign-in methods"
        desc="Ways you can currently sign in to your account."
      >
        <div className="space-y-2">
          {/* Google */}
          {user.providers.includes("google") && (
            <div className="flex items-center justify-between px-3.5 py-3 rounded-xl border border-zinc-800 bg-black">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 p-1.5">
                  <svg viewBox="0 0 48 48" className="w-full h-full">
                    <path
                      fill="#FFC107"
                      d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.197 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.347 4.337-17.694 10.691z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.141 35.091 26.715 36 24 36c-5.176 0-9.625-3.329-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.084 5.571.001-.001 6.19 5.238 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Google</p>
                  <p className="text-xs text-zinc-500">Connected via OAuth</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400">
                Active
              </span>
            </div>
          )}

          {/* GitHub */}
          {hasGitHub && (
            <div className="flex items-center justify-between px-3.5 py-3 rounded-xl border border-zinc-800 bg-black">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    // {...props}
                  >
                    <path d="M12 .297a12 12 0 0 0-3.794 23.39c.6.111.82-.261.82-.58v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.083-.729.083-.729 1.205.085 1.839 1.236 1.839 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.775.418-1.305.762-1.605-2.665-.304-5.466-1.332-5.466-5.931 0-1.311.469-2.382 1.236-3.221-.124-.303-.535-1.526.117-3.176 0 0 1.008-.322 3.301 1.23a11.48 11.48 0 0 1 6.006 0c2.291-1.552 3.297-1.23 3.297-1.23.654 1.65.243 2.873.119 3.176.77.839 1.234 1.91 1.234 3.221 0 4.61-2.804 5.624-5.476 5.921.43.371.814 1.102.814 2.222v3.293c0 .322.216.697.825.579A12.003 12.003 0 0 0 12 .297z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">GitHub</p>
                  <p className="text-xs text-zinc-500">Connected via OAuth</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400">
                Active
              </span>
            </div>
          )}

          {/* Password method */}
          {hasPassword && (
            <div className="flex items-center justify-between px-3.5 py-3 rounded-xl border border-zinc-800 bg-black">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                  <KeyRound size={16} className="text-zinc-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Password</p>
                  <p className="text-xs text-zinc-500">
                    Sign in with email & password
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400">
                Active
              </span>
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── SET password (Google-only accounts) ── */}
      {isGoogleOnly && (
        <SectionCard
          icon={Plus}
          title="Set a password"
          desc="Your account uses Google to sign in. Add a password to also sign in with your email."
          iconBg="bg-blue-500/10"
          iconColor="text-blue-400"
        >
          {/* Info banner */}
          <div className="flex items-start gap-2.5 bg-blue-500/10 border border-blue-900/40 rounded-xl px-4 py-3 mb-5">
            <AlertTriangle
              size={15}
              className="text-blue-400 shrink-0 mt-0.5"
            />
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Setting a password won't remove Google sign-in. Both methods will
              work.
            </p>
          </div>

          <div className="space-y-4">
            <PasswordInput
              label="New Password"
              value={setPass}
              onChange={(e) => setSetPass(e.target.value)}
              show={showSetPass}
              setShow={setShowSetPass}
              placeholder="Create a password"
            />

            {/* Strength */}
            {setPass.length > 0 && (
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-500">Strength</span>
                  <span className={setPassStrength?.text_c}>
                    {setPassStrength?.text}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${setPassStrength?.bar} ${setPassStrength?.color} transition-all duration-300`}
                  />
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {requirements.map((r, i) => {
                const ok = r.test(setPass);
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 text-xs ${ok ? "text-emerald-400" : "text-zinc-600"}`}
                  >
                    {ok ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {r.label}
                  </div>
                );
              })}
            </div>

            <PasswordInput
              label="Confirm Password"
              value={setPassConfirm}
              onChange={(e) => setSetPassConfirm(e.target.value)}
              show={showSetConfirm}
              setShow={setShowSetConfirm}
              placeholder="Re-enter password"
            />

            {setPassConfirm.length > 0 && (
              <p
                className={`text-xs flex items-center gap-1.5 ${setPassMatches ? "text-emerald-400" : "text-red-400"}`}
              >
                {setPassMatches ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <XCircle size={13} />
                )}
                {setPassMatches ? "Passwords match" : "Passwords do not match"}
              </p>
            )}

            {setPassError && (
              <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-4 py-2.5">
                {setPassError}
              </p>
            )}

            <div className="flex justify-end pt-1">
              <button
                onClick={handleSetPassword}
                disabled={!canSetPass || settingPass}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                  canSetPass && !settingPass
                    ? "bg-emerald-500 text-black active:bg-emerald-400 sm:hover:bg-emerald-400"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }`}
              >
                {settingPass ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <KeyRound size={14} />
                )}
                {settingPass ? "Setting..." : "Set Password"}
              </button>
            </div>

            <SavedNote show={savedSetPass} />
          </div>
        </SectionCard>
      )}

      {/* ── CHANGE password (accounts that already have one) ── */}
      {hasPassword && (
        <SectionCard
          icon={Lock}
          title="Change password"
          desc="Update your password regularly to keep your account secure."
        >
          <div className="space-y-4">
            <PasswordInput
              label="Current Password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              show={showCurrent}
              setShow={setShowCurrent}
              placeholder="Enter current password"
              error={changeErrors.current}
            />

            <PasswordInput
              label="New Password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              show={showNext}
              setShow={setShowNext}
              placeholder="Enter new password"
              error={changeErrors.next}
            />

            {/* Strength */}
            {next.length > 0 && (
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-500">Strength</span>
                  <span className={nextPassStrength?.text_c}>
                    {nextPassStrength?.text}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${nextPassStrength?.bar} ${nextPassStrength?.color} transition-all duration-300`}
                  />
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {requirements.map((r, i) => {
                const ok = r.test(next);
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 text-xs ${ok ? "text-emerald-400" : "text-zinc-600"}`}
                  >
                    {ok ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {r.label}
                  </div>
                );
              })}
            </div>

            <PasswordInput
              label="Confirm New Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              show={showConfirm}
              setShow={setShowConfirm}
              placeholder="Re-enter new password"
              error={changeErrors.confirm}
            />

            {confirm.length > 0 && (
              <p
                className={`text-xs flex items-center gap-1.5 ${nextMatches ? "text-emerald-400" : "text-red-400"}`}
              >
                {nextMatches ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <XCircle size={13} />
                )}
                {nextMatches ? "Passwords match" : "Passwords do not match"}
              </p>
            )}

            {changeErrors.api && (
              <p className="text-sm text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-4 py-2.5">
                {changeErrors.api}
              </p>
            )}

            <div className="flex justify-end pt-1">
              <button
                onClick={handleChangePassword}
                disabled={!canChange || changingPass}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                  canChange && !changingPass
                    ? "bg-emerald-500 text-black active:bg-emerald-400 sm:hover:bg-emerald-400"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                }`}
              >
                {changingPass ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ShieldCheck size={14} />
                )}
                {changingPass ? "Updating..." : "Update Password"}
              </button>
            </div>

            <SavedNote show={savedChange} />
          </div>
        </SectionCard>
      )}

      {/* ── No password yet banner (Google user who hasn't set one) ── */}
      {!hasPassword && !isGoogleOnly && (
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-900/40 rounded-xl px-4 py-3.5">
          <AlertTriangle
            size={16}
            className="text-yellow-400 shrink-0 mt-0.5"
          />
          <p className="text-sm text-yellow-200/80 leading-relaxed">
            You haven't set a password yet. Use the section above to add one.
          </p>
        </div>
      )}
    </div>
  );
}
