import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = "Email or username is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

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

      // Example API Request
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess("Login successful");
      console.log(formData);
    } catch (error) {
      setErrors({
        api: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-[360px] ">
        {/* Logo */}
        <div className="flex justify-center mb-7">
          <div className="h-11 w-11 rounded-2xl bg-white text-black flex items-center justify-center text-lg font-bold">
            A
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-7">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>

          <p className="text-sm text-zinc-400 mt-2">
            Login to continue to your account
          </p>
        </div>

        {/* Social Login */}
        <div className="space-y-2.5 mb-5">
          {/* Google */}
          <button
            type="button"
            className="w-full h-11 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition rounded-xl flex items-center justify-center gap-3 text-sm font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-[18px] h-[18px]"
            >
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
            Continue with Google
          </button>

          {/* GitHub */}
          <button
            type="button"
            className="w-full h-11 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition rounded-xl flex items-center justify-center gap-3 text-sm font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-[18px] h-[18px]"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.59 2 12.253c0 4.53 2.865 8.37 6.839 9.727.5.094.682-.222.682-.494 0-.243-.009-.888-.014-1.743-2.782.617-3.369-1.37-3.369-1.37-.455-1.177-1.11-1.49-1.11-1.49-.908-.637.069-.624.069-.624 1.004.072 1.532 1.055 1.532 1.055.892 1.574 2.341 1.12 2.91.856.091-.664.35-1.119.636-1.376-2.22-.258-4.555-1.137-4.555-5.062 0-1.118.39-2.033 1.029-2.75-.103-.259-.446-1.3.098-2.71 0 0 .84-.276 2.75 1.05A9.303 9.303 0 0112 6.844a9.29 9.29 0 012.504.35c1.909-1.326 2.748-1.05 2.748-1.05.546 1.41.203 2.451.1 2.71.64.717 1.028 1.632 1.028 2.75 0 3.935-2.339 4.801-4.566 5.054.359.318.678.945.678 1.905 0 1.376-.012 2.485-.012 2.824 0 .274.18.592.688.492C19.138 20.62 22 16.78 22 12.253 22 6.59 17.523 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>

          <div className="relative flex justify-center">
            <span className="bg-black px-3 text-xs uppercase text-zinc-500">
              or continue with email
            </span>
          </div>
        </div>

        {/* API Error */}
        {errors.api && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            <AlertCircle className="w-4 h-4" />
            {errors.api}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-4 rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-2 text-sm text-green-400">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">
              Email or Username
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />

              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Enter email or username"
                className={`w-full h-11 rounded-xl bg-zinc-900 border pl-11 pr-4 text-sm outline-none transition
                ${
                  errors.identifier
                    ? "border-red-500"
                    : "border-zinc-800 focus:border-zinc-600"
                }`}
              />
            </div>

            {errors.identifier && (
              <p className="text-red-400 text-xs mt-2">{errors.identifier}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">Password</label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={`w-full h-11 rounded-xl bg-zinc-900 border pl-11 pr-11 text-sm outline-none transition
                ${
                  errors.password
                    ? "border-red-500"
                    : "border-zinc-800 focus:border-zinc-600"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-400 text-xs mt-2">{errors.password}</p>
            )}
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-zinc-400">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="accent-white"
              />
              Remember me
            </label>

            <NavLink
              to={`/auth/forgot-password`}
              type="button"
              className="text-zinc-300 hover:text-white transition"
            >
              Forgot password?
            </NavLink>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-white text-black font-medium text-sm hover:opacity-90 transition flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-500 mt-7">
          Don&apos;t have an account?{" "}
          <NavLink to={`/auth/register`} className="text-white hover:underline">
            Sign up
          </NavLink>
        </p>
      </div>
    </div>
  );
}
