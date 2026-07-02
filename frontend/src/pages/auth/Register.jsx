import React, { useState } from "react";
import {
  User,
  AtSign,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import AuthApi from "../../../api/AuthApi";

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" className="w-[18px] h-[18px]">
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
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.59 2 12.253c0 4.53 2.865 8.37 6.839 9.727.5.094.682-.222.682-.494 0-.243-.009-.888-.014-1.743-2.782.617-3.369-1.37-3.369-1.37-.455-1.177-1.11-1.49-1.11-1.49-.908-.637.069-.624.069-.624 1.004.072 1.532 1.055 1.532 1.055.892 1.574 2.341 1.12 2.91.856.091-.664.35-1.119.636-1.376-2.22-.258-4.555-1.137-4.555-5.062 0-1.118.39-2.033 1.029-2.75-.103-.259-.446-1.3.098-2.71 0 0 .84-.276 2.75 1.05A9.303 9.303 0 0112 6.844a9.29 9.29 0 012.504.35c1.909-1.326 2.748-1.05 2.748-1.05.546 1.41.203 2.451.1 2.71.64.717 1.028 1.632 1.028 2.75 0 3.935-2.339 4.801-4.566 5.054.359.318.678.945.678 1.905 0 1.376-.012 2.485-.012 2.824 0 .274.18.592.688.492C19.138 20.62 22 16.78 22 12.253 22 6.59 17.523 2 12 2z"
    />
  </svg>
);

const InputField = ({ label, icon: Icon, error, children }) => (
  <div>
    <label className="text-sm text-zinc-300 mb-2 block">{label}</label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
      {children}
    </div>
    {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
  </div>
);

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim())
      newErrors.fullName = "Enter your full name to continue.";
    if (!formData.username.trim())
      newErrors.username = "Choose a username to continue.";
    else if (formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters.";
    if (!formData.email.trim())
      newErrors.email = "Enter your email address to continue.";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email))
      newErrors.email = "Enter a valid email address.";
    if (!formData.password.trim())
      newErrors.password = "Create a password to continue.";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setLoading(true);
      await AuthApi.register(formData);
      setSuccess("Account created. You can now sign in.");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        api:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full h-11 rounded-xl bg-black border pl-11 pr-4 text-sm outline-none transition ${
      errors[field]
        ? "border-red-500"
        : "border-zinc-800 focus:border-emerald-500/60"
    }`;

  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative w-full max-w-[380px]">
        {/* Logo */}
        <div className="flex justify-center mb-7">
          <div className="relative h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-emerald-500/10 blur-md" />
            <ShieldCheck size={20} className="relative text-emerald-400" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-7">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            Join in seconds. No credit card required.
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm">
          {/* Social */}
          <div className="space-y-2.5 mb-5">
            <button
              onClick={AuthApi.googleAuth}
              type="button"
              className="w-full h-11 bg-zinc-900 border border-zinc-800 active:bg-zinc-800 sm:hover:bg-zinc-800 sm:hover:border-zinc-700 transition rounded-xl flex items-center justify-center gap-3 text-sm font-medium"
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <button
              type="button"
              className="w-full h-11 bg-zinc-900 border border-zinc-800 active:bg-zinc-800 sm:hover:bg-zinc-800 sm:hover:border-zinc-700 transition rounded-xl flex items-center justify-center gap-3 text-sm font-medium"
            >
              <GitHubIcon />
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-zinc-950 px-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
                or register with email
              </span>
            </div>
          </div>

          {/* API Error */}
          {errors.api && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {errors.api}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5 text-sm text-emerald-400">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name + Username side by side on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Full name" icon={User} error={errors.fullName}>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Prince Kumar"
                  className={inputClass("fullName")}
                />
              </InputField>

              <InputField
                label="Username"
                icon={AtSign}
                error={errors.username}
              >
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="prince"
                  className={inputClass("username")}
                />
              </InputField>
            </div>

            <InputField label="Email" icon={Mail} error={errors.email}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass("email")}
              />
            </InputField>

            <InputField label="Password" icon={Lock} error={errors.password}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={`${inputClass("password")} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 active:text-zinc-300 sm:hover:text-zinc-300 transition"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </InputField>

            <p className="text-xs text-zinc-600 leading-relaxed">
              By creating an account you agree to our{" "}
              <NavLink
                to="/terms"
                className="text-zinc-400 sm:hover:text-white transition"
              >
                Terms of Service
              </NavLink>{" "}
              and{" "}
              <NavLink
                to="/privacy"
                className="text-zinc-400 sm:hover:text-white transition"
              >
                Privacy Policy
              </NavLink>
              .
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-emerald-500 text-black font-medium text-sm active:bg-emerald-400 sm:hover:bg-emerald-400 transition flex items-center justify-center disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create account"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-600 mt-6">
          Already have an account?{" "}
          <NavLink
            to="/auth/login"
            className="text-emerald-400 font-medium active:text-emerald-300 sm:hover:text-emerald-300 transition"
          >
            Sign in
          </NavLink>
        </p>
      </div>
    </div>
  );
}
