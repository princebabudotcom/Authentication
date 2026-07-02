import { useRef, useState } from "react";
import { Shield, Loader2, Check, Eye, EyeOff, ShieldCheck } from "lucide-react";
import userApi from "../../../api/user.api";

/**
 * Security page — nested under <AccountSettingsLayout /> at /settings/security.
 *
 * Endpoints to wire up:
 *   PATCH /api/auth/password          ({ currentPassword, newPassword })
 *   POST  /api/auth/2fa/send-otp      ()                 -> sends OTP to email/phone
 *   POST  /api/auth/2fa/verify-otp    ({ otp })           -> enables 2FA on success
 *   POST  /api/auth/2fa/disable       ({ otp })           -> optional, re-verify to disable
 */

function Field({ label, hint, children }) {
  return (
    <div className="grid grid-cols-1 gap-2 py-5 sm:grid-cols-3 sm:gap-6">
      <div>
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
      </div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-zinc-900 bg-zinc-950/60 p-6 sm:p-8">
      <div className="border-b border-zinc-900 pb-5">
        <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        )}
      </div>
      <div className="divide-y divide-zinc-900">{children}</div>
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 pr-10 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

function SaveButton({ onClick, status, label = "Save changes", disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || status === "loading"}
      className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {status === "loading" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {status === "success" && <Check className="h-3.5 w-3.5" />}
      {status === "loading"
        ? "Please wait..."
        : status === "success"
          ? "Done"
          : label}
    </button>
  );
}

/**
 * Android-style boxed OTP input.
 * Each digit gets its own box; typing auto-advances, backspace auto-retreats,
 * and pasting a full code fills every box at once.
 */
function OtpInput({ length = 6, value, onChange, disabled }) {
  const inputsRef = useRef([]);
  const digits = value
    .split("")
    .concat(Array(length).fill(""))
    .slice(0, length);

  function setDigit(index, char) {
    const next = [...digits];
    next[index] = char;
    onChange(next.join(""));
  }

  function handleChange(e, index) {
    const char = e.target.value.replace(/[^0-9]/g, "").slice(-1);
    setDigit(index, char);
    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e, index) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        setDigit(index, "");
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        setDigit(index - 1, "");
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, length);
    if (!pasted) return;
    onChange(pasted.padEnd(length, ""));
    const lastIndex = Math.min(pasted.length, length) - 1;
    inputsRef.current[lastIndex >= 0 ? lastIndex : 0]?.focus();
  }

  return (
    <div className="flex gap-2.5" onPaste={handlePaste}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className={`h-12 w-11 rounded-lg border bg-zinc-950 text-center text-lg font-semibold text-zinc-100 outline-none transition focus:ring-1 ${
            digit
              ? "border-emerald-500/60 focus:border-emerald-500 focus:ring-emerald-500/30"
              : "border-zinc-800 focus:border-emerald-500/50 focus:ring-emerald-500/30"
          } disabled:opacity-50`}
        />
      ))}
    </div>
  );
}

export default function SecurityPage() {
  // ---- Password change ----
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("idle");
  const [passwordError, setPasswordError] = useState("");

  async function handlePasswordChange() {
    setPasswordError("");
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordStatus("loading");
    try {
      const res = await userApi.changePassword({
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      });

      console.log(res.data);

      setPasswordStatus("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordStatus("idle"), 1500);
    } catch (error) {
      console.error(error.response);
      setPasswordStatus("error");
      setPasswordError(
        "Could not change password. Check your current password.",
      );
    }
  }

  // ---- 2FA enable flow: idle -> sending -> otp_sent -> verifying -> enabled ----
  const [twoFaStage, setTwoFaStage] = useState("idle"); // idle | sending | otp_sent | verifying | enabled
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendIn, setResendIn] = useState(0);

  function startResendTimer() {
    setResendIn(30);
    const interval = setInterval(() => {
      setResendIn((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  async function handleSendOtp() {
    setOtpError("");
    setTwoFaStage("sending");
    try {
      // const res = await fetch("/api/auth/2fa/send-otp", { method: "POST", credentials: "include" });
      // if (!res.ok) throw new Error("Failed to send OTP");

      await new Promise((r) => setTimeout(r, 600));
      setTwoFaStage("otp_sent");
      startResendTimer();
    } catch (err) {
      console.error(err);
      setTwoFaStage("idle");
      setOtpError("Could not send OTP. Try again.");
    }
  }

  async function handleVerifyOtp() {
    setOtpError("");
    if (otp.length !== 6) {
      setOtpError("Enter the 6-digit code.");
      return;
    }

    setTwoFaStage("verifying");
    try {
      // const res = await fetch("/api/auth/2fa/verify-otp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   credentials: "include",
      //   body: JSON.stringify({ otp }),
      // });
      // if (!res.ok) throw new Error("Invalid code");

      await new Promise((r) => setTimeout(r, 700));
      setTwoFaStage("enabled");
    } catch (err) {
      console.error(err);
      setTwoFaStage("otp_sent");
      setOtpError("Invalid or expired code. Try again.");
    }
  }

  function handleResend() {
    if (resendIn > 0) return;
    setOtp("");
    handleSendOtp();
  }

  return (
    <div className="space-y-6">
      {/* Password */}
      <SectionCard
        title="Password"
        description="Change the password used to sign in."
      >
        <Field label="Current password">
          <PasswordInput
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        <Field label="New password" hint="At least 8 characters">
          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        <Field label="Confirm new password">
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        {passwordError && (
          <p className="pt-4 text-xs text-red-400">{passwordError}</p>
        )}
        <div className="flex justify-end pt-6">
          <SaveButton
            onClick={handlePasswordChange}
            status={passwordStatus}
            label="Update password"
          />
        </div>
      </SectionCard>

      {/* 2FA */}
      <SectionCard
        title="Two-factor authentication"
        description="Add an extra verification step when signing in."
      >
        <Field label="Status">
          {twoFaStage === "enabled" ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-300">
              <ShieldCheck className="h-4 w-4" /> Two-factor authentication is
              enabled
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-400">
              <Shield className="h-4 w-4" /> Not enabled yet
            </div>
          )}
        </Field>

        {twoFaStage === "idle" && (
          <Field
            label="Enable 2FA"
            hint="We'll send a one-time code to verify it's you"
          >
            <button
              onClick={handleSendOtp}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400"
            >
              Send OTP
            </button>
          </Field>
        )}

        {twoFaStage === "sending" && (
          <Field label="Enable 2FA">
            <button
              disabled
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black opacity-60"
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending OTP...
            </button>
          </Field>
        )}

        {(twoFaStage === "otp_sent" || twoFaStage === "verifying") && (
          <Field
            label="Enter verification code"
            hint="Sent to your registered email"
          >
            <div className="space-y-3">
              <OtpInput
                value={otp}
                onChange={setOtp}
                disabled={twoFaStage === "verifying"}
              />
              {otpError && <p className="text-xs text-red-400">{otpError}</p>}
              <div className="flex items-center gap-4 pt-1">
                <button
                  onClick={handleVerifyOtp}
                  disabled={twoFaStage === "verifying"}
                  className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {twoFaStage === "verifying" && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  {twoFaStage === "verifying"
                    ? "Verifying..."
                    : "Verify & enable"}
                </button>
                <button
                  onClick={handleResend}
                  disabled={resendIn > 0}
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300 disabled:cursor-not-allowed disabled:text-zinc-600"
                >
                  {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
                </button>
              </div>
            </div>
          </Field>
        )}

        {twoFaStage === "enabled" && (
          <Field
            label="Disable 2FA"
            hint="You'll need to verify again to turn this off"
          >
            <button
              onClick={() => {
                setTwoFaStage("idle");
                setOtp("");
              }}
              className="rounded-lg border border-red-500/30 bg-red-500/5 px-3.5 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10"
            >
              Disable
            </button>
          </Field>
        )}
      </SectionCard>
    </div>
  );
}
