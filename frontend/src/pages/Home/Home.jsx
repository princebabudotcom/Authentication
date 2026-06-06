import { useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../context/auth/UseAuth";

import {
  User,
  Mail,
  Shield,
  Calendar,
  Settings,
  Lock,
  Activity,
  Bell,
  LogOut,
  BadgeCheck,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(false);

  const logoutUser = async () => {
    try {
      setLoading(true);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    {
      title: "Edit Profile",
      icon: User,
      path: "/profile",
    },
    {
      title: "Change Password",
      icon: Lock,
      path: "/change-password",
    },
    {
      title: "Account Settings",
      icon: Settings,
      path: "/settings",
    },
    {
      title: "Activity Logs",
      icon: Activity,
      path: "/logs",
    },
    {
      title: "Notifications",
      icon: Bell,
      path: "/notifications",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-lg bg-zinc-950/80 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">Auth Dashboard</h1>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-zinc-800">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center font-bold">
                  {user?.fullName?.[0]}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* EMAIL VERIFICATION */}
        {!user?.isEmailVerified && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-yellow-400 font-semibold flex items-center gap-2">
                <AlertTriangle size={18} />
                Email Not Verified
              </h3>

              <p className="text-zinc-400 mt-1">
                Verify your email address to secure your account.
              </p>
            </div>

            <Link
              to="/user/verify-email"
              className="px-5 py-2 rounded-xl bg-yellow-500 text-black font-medium"
            >
              Verify Email
            </Link>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* PROFILE CARD */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-28 w-28 rounded-full overflow-hidden ring-4 ring-zinc-800">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-zinc-800 flex items-center justify-center text-4xl font-bold">
                    {user?.fullName?.[0]}
                  </div>
                )}
              </div>

              <h2 className="mt-5 text-2xl font-bold">{user?.fullName}</h2>

              <div className="flex items-center gap-2 mt-2">
                <Mail size={16} className="text-zinc-500" />
                <span className="text-zinc-400 text-sm">{user?.email}</span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                {user?.isEmailVerified ? (
                  <>
                    <BadgeCheck size={18} className="text-green-500" />
                    <span className="text-green-500 text-sm">
                      Verified Account
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={18} className="text-yellow-500" />
                    <span className="text-yellow-500 text-sm">
                      Verification Pending
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="bg-zinc-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Shield size={16} />
                  Role
                </div>

                <p className="font-medium mt-2">{user?.role || "User"}</p>
              </div>

              <div className="bg-zinc-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Calendar size={16} />
                  Member Since
                </div>

                <p className="font-medium mt-2">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              onClick={logoutUser}
              disabled={loading}
              className="w-full mt-6 bg-red-600 hover:bg-red-700 transition rounded-xl py-3 flex items-center justify-center gap-2"
            >
              <LogOut size={18} />

              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {/* WELCOME */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8">
              <h2 className="text-3xl font-bold">Welcome Back 👋</h2>

              <p className="mt-2 text-blue-100">
                Manage your account settings, security and profile information.
              </p>
            </div>

            {/* ACTIONS */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <h3 className="text-xl font-semibold mb-5">Quick Actions</h3>

              <div className="grid md:grid-cols-2 gap-4">
                {actions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <Link
                      key={action.title}
                      to={action.path}
                      className="group bg-zinc-800/60 hover:bg-zinc-800 transition rounded-2xl p-5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <Icon size={22} />

                        <span>{action.title}</span>
                      </div>

                      <ChevronRight
                        size={18}
                        className="group-hover:translate-x-1 transition"
                      />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ACTIVITY */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <h3 className="text-xl font-semibold mb-5">Recent Activity</h3>

              <div className="space-y-4 font-mono text-sm">
                <div className="flex gap-4">
                  <span className="text-zinc-500">22:31:04</span>

                  <span className="text-green-500">SUCCESS</span>

                  <span>Login successful</span>
                </div>

                <div className="flex gap-4">
                  <span className="text-zinc-500">22:34:22</span>

                  <span className="text-blue-500">INFO</span>

                  <span>Profile updated</span>
                </div>

                <div className="flex gap-4">
                  <span className="text-zinc-500">22:40:15</span>

                  <span className="text-yellow-500">SECURITY</span>

                  <span>Password changed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
