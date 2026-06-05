import { useState } from "react";
import useAuth from "../../context/auth/UseAuth";
import { Link } from "react-router-dom";

export default function HomePage() {
  const { logout, user } = useAuth();
  const [loader, setloader] = useState(false);

  const logoutUser = async () => {
    try {
      setloader(true);
      await logout();
    } catch (error) {
      setloader(false);
    } finally {
      setloader(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
          <h1 className="font-bold text-xl">AuthApp</h1>

          <div className="flex gap-6 text-zinc-400">
            <a href="/">Home</a>
            <a href="/profile">Profile</a>
            <a href="/settings">Settings</a>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
          <div className="w-16 h-16 rounded-full bg-zinc-700 flex items-center justify-center text-2xl font-bold">
            {user?.avatar ? (
              <img
                className="h-full w-full object-cover rounded-full"
                src={user?.avatar}
              />
            ) : (
              <div>{user?.fullName[0]}</div>
            )}
          </div>

          <h2 className="mt-4 text-xl font-semibold">{user?.fullName}</h2>

          <p className="text-zinc-400">{user?.email}</p>

          <div className="mt-6 space-y-2 text-sm">
            <p>Role: {user?.role}</p>
            <p>Joined: {user?.joined}</p>
          </div>

          <button
            onClick={logoutUser}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg"
          >
            {loader ? <div>Logout....</div> : <div>Logout</div>}
          </button>
        </div>

        {/* Main Section */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h2 className="text-2xl font-bold">Welcome Back 👋</h2>
            <p className="text-zinc-400 mt-2">
              You are successfully logged in.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h3 className="font-semibold mb-4">Quick Actions</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <button className="bg-zinc-800 p-3 rounded-lg">
                Edit Profile
              </button>

              <button className="bg-zinc-800 p-3 rounded-lg">
                Change Password
              </button>

              <button className="bg-zinc-800 p-3 rounded-lg">
                Security Settings
              </button>

              <button className="bg-zinc-800 p-3 rounded-lg">
                Notifications
              </button>

              {!user?.isEmailVerified && (
                <Link
                  to={`/user/verify-email`}
                  className="bg-zinc-800 p-3 rounded-lg text-center"
                >
                  Verify Email
                </Link>
              )}
            </div>
          </div>

          {/* Activity */}
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h3 className="font-semibold mb-4">Recent Activity</h3>

            <ul className="space-y-3 text-zinc-400">
              <li>✅ Login successful</li>
              <li>🔐 Password changed</li>
              <li>👤 Profile updated</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
