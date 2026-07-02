import { useState, useRef, useEffect } from "react";
import {
  AlertTriangle,
  Trash2,
  Mail,
  ShieldAlert,
  Loader2,
  ArrowLeft,
  RefreshCcw,
} from "lucide-react";

const CONFIRM_TEXT = "DELETE";
const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function DeleteAccountPage() {
  const [step, setStep] = useState(1); // 1: warning+confirm text, 2: otp, 3: deleted
  const [confirmText, setConfirmText] = useState("");
  const [reason, setReason] = useState("");

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const otpRefs = useRef([]);

  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSentTo, setOtpSentTo] = useState("");
  const [resendIn, setResendIn] = useState(0);

  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const canConfirm = confirmText === CONFIRM_TEXT;
  const otpValue = otp.join("");
  const otpComplete = otpValue.length === OTP_LENGTH;

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const handleSendOtp = async () => {
    setError("");
    setSendingOtp(true);
    try {
      // TODO: replace with real API call, e.g. userApi.requestDeleteOtp()
      await new Promise((res) => setTimeout(res, 1000));
      setOtpSentTo("p••••@example.com"); // TODO: use masked email from API response
      setStep(2);
      setResendIn(RESEND_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError("Failed to send OTP. Try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0) return;
    setError("");
    try {
      // TODO: replace with real API call
      await new Promise((res) => setTimeout(res, 800));
      setResendIn(RESEND_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(""));
      otpRefs.current[0]?.focus();
    } catch (err) {
      setError("Failed to resend OTP.");
    }
  };

  const handleOtpChange = (idx, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    setOtp((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
    if (value && idx < OTP_LENGTH - 1) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").trim().slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pasted)) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerifyAndDelete = async () => {
    if (!otpComplete) {
      setError("Enter the 6-digit code sent to your email.");
      return;
    }
    setError("");
    setVerifying(true);
    try {
      // TODO: replace with real API call, e.g. userApi.confirmDeleteAccount({ otp: otpValue, reason })
      await new Promise((res) => setTimeout(res, 1200));
      setStep(3);
      // TODO: clear auth tokens, redirect to logged-out/home page after a delay
    } catch (err) {
      setError("Invalid or expired code. Try again.");
    } finally {
      setVerifying(false);
    }
  };

  /* ---------- Step 3: Deleted confirmation ---------- */
  if (step === 3) {
    return (
      <div className="w-full max-w-lg mx-auto text-center py-16">
        <div className="w-14 h-14 rounded-2xl bg-red-500/15 flex items-center justify-center text-red-400 mx-auto mb-5">
          <Trash2 size={24} />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Account Deleted
        </h1>
        <p className="text-zinc-500 text-sm">
          Your account and all associated data have been permanently removed.
          You'll be redirected shortly.
        </p>
      </div>
    );
  }

  /* ---------- Step 2: OTP verification ---------- */
  if (step === 2) {
    return (
      <div className="w-full max-w-lg">
        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-1.5 text-sm text-zinc-500 active:text-zinc-300 sm:hover:text-zinc-300 transition mb-6"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Verify it's you
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            We sent a 6-digit code to{" "}
            <span className="text-zinc-300">{otpSentTo}</span>
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6">
          <div className="flex justify-center gap-2 sm:gap-3 mb-5">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (otpRefs.current[idx] = el)}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                onPaste={handleOtpPaste}
                inputMode="numeric"
                maxLength={1}
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg font-semibold bg-black border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-red-500/60 transition"
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-400 text-center mb-4">{error}</p>
          )}

          <button
            onClick={handleVerifyAndDelete}
            disabled={!otpComplete || verifying}
            className={`w-full flex items-center justify-center gap-2 text-sm font-medium px-5 py-3 rounded-xl transition ${
              otpComplete && !verifying
                ? "bg-red-500 text-white active:bg-red-400 sm:hover:bg-red-400"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            {verifying ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Trash2 size={15} />
            )}
            {verifying ? "Deleting Account..." : "Verify & Delete Account"}
          </button>

          <div className="text-center mt-4">
            {resendIn > 0 ? (
              <p className="text-xs text-zinc-500">
                Resend code in {resendIn}s
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-400 active:text-white sm:hover:text-white transition mx-auto"
              >
                <RefreshCcw size={12} />
                Resend Code
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Step 1: Warning + confirm ---------- */
  return (
    <div className="w-full max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          Delete Account
        </h1>
        <p className="text-zinc-500 text-xs sm:text-sm mt-1">
          Permanently delete your account and all associated data.
        </p>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 bg-red-500/10 border border-red-900/40 rounded-xl px-4 py-3.5 mb-6">
        <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-red-200/90 leading-relaxed">
          <p className="font-medium mb-1">This action is irreversible.</p>
          <ul className="list-disc pl-4 space-y-0.5 text-red-200/70">
            <li>All your projects, sessions, and data will be erased.</li>
            <li>
              Your username will be released and may be claimed by others.
            </li>
            <li>You will be immediately logged out of all devices.</li>
          </ul>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-5">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Why are you leaving?{" "}
            <span className="text-zinc-600">(optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Help us improve by sharing your reason..."
            className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/60 transition resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Type{" "}
            <span className="text-red-400 font-semibold">{CONFIRM_TEXT}</span>{" "}
            to confirm
          </label>
          <div className="relative">
            <ShieldAlert
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={CONFIRM_TEXT}
              className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-red-500/60 transition"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          onClick={handleSendOtp}
          disabled={!canConfirm || sendingOtp}
          className={`w-full flex items-center justify-center gap-2 text-sm font-medium px-5 py-3 rounded-xl transition ${
            canConfirm && !sendingOtp
              ? "bg-red-500 text-white active:bg-red-400 sm:hover:bg-red-400"
              : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
          }`}
        >
          {sendingOtp ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Mail size={15} />
          )}
          {sendingOtp ? "Sending Code..." : "Send Verification Code"}
        </button>
      </div>
    </div>
  );
}
