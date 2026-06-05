import { useEffect, useRef, useState } from "react";
import instance from "../../config/axiosConfig";
import { Link } from "react-router-dom";

export default function VerifyEmailPage() {
  const [step, setStep] = useState("send-otp");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [error, setError] = useState("");

  const inputRefs = useRef([]);

  useEffect(() => {
    if (step !== "verify-otp") return;
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, step]);

  const sendVerificationEmail = async () => {
    try {
      setLoading(true);
      setError("");

      await instance.post("/auth/send-verification-email");

      setStep("verify-otp");
      setSeconds(60);
    } catch (error) {
      console.log(error?.response?.data);
      setError(
        error?.response?.data?.message || "Failed to send verification email",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pasted.length !== 6) return;

    setOtp(pasted.split(""));
  };

  const verifyOtp = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await instance.post("/auth/verify-email", {
        otp: code,
      });

      setStep("verified");
    } catch (error) {
      setError(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setResending(true);

      await instance.post("/auth/send-verification-email");

      setSeconds(60);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const isComplete = otp.every(Boolean);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        {step === "send-otp" && (
          <>
            <h1 className="text-3xl font-bold text-white text-center">
              Verify Your Email
            </h1>

            <p className="text-zinc-400 text-center mt-4">
              Verify your email address to unlock all features.
            </p>

            <button
              onClick={sendVerificationEmail}
              disabled={loading}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-xl"
            >
              {loading ? "Sending..." : "Send Verification Email"}
            </button>
          </>
        )}

        {step === "verify-otp" && (
          <>
            <h1 className="text-3xl font-bold text-white text-center">
              Enter OTP
            </h1>

            <p className="text-zinc-400 text-center mt-4">
              Check your inbox and enter the 6-digit code.
            </p>

            <div
              className="flex justify-center gap-3 mt-8"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-14 bg-zinc-800 border border-zinc-700 rounded-xl text-center text-white text-xl focus:border-blue-500 focus:outline-none"
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mt-4">{error}</p>
            )}

            <button
              disabled={!isComplete || loading}
              onClick={verifyOtp}
              className="w-full mt-8 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-3 rounded-xl"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>

            <div className="text-center mt-6">
              {seconds > 0 ? (
                <p className="text-zinc-400 text-sm">
                  Resend OTP in {seconds}s
                </p>
              ) : (
                <button
                  onClick={resendOtp}
                  disabled={resending}
                  className="text-blue-500"
                >
                  {resending ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </div>
          </>
        )}

        {step === "verified" && (
          <>
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>

              <h1 className="text-3xl font-bold text-white">Email Verified</h1>

              <p className="text-zinc-400 mt-4">
                Your email has been successfully verified.
              </p>

              <Link
                to={`/`}
                className="w-full mt-8 bg-blue-600 text-white py-3 px-8 rounded-xl"
              >
                Continue
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
