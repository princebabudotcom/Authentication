import React, { useRef, useState } from "react";
import { ArrowLeft, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const inputsRef = useRef([]);

  // OTP Input Handling
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1);

    setOtp(updatedOtp);

    // Auto Focus Next
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Backspace Focus
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const otpCode = otp.join("");

    if (otpCode.length !== 6) return;

    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!passwords.password || passwords.password.length < 6) {
      return;
    }

    if (passwords.password !== passwords.confirmPassword) {
      return;
    }

    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      alert("Password reset successful");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="w-full min-h-screen px-5 py-6 sm:flex sm:items-center sm:justify-center">
        {/* Container */}
        <div className="w-full max-w-[360px] sm:max-w-[380px]">
          {/* Back Button */}
          <button className="mb-6 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-8 mt-2">
            <div className="h-11 w-11 rounded-2xl bg-white text-black flex items-center justify-center text-lg font-bold">
              V
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-[26px] font-semibold tracking-tight">
              Verify OTP
            </h1>

            <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
              Enter the 6 digit code sent to your email
            </p>
          </div>

          {/* OTP Form */}
          <form className="space-y-6">
            {/* OTP Inputs */}
            <div className="flex items-center justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-center text-lg font-semibold outline-none focus:border-white transition"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-white text-black font-medium text-sm hover:opacity-90 transition flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Verify OTP"
              )}
            </button>

            {/* Resend */}
            <button
              type="button"
              className="w-full text-sm text-zinc-500 hover:text-white transition"
            >
              Resend OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
