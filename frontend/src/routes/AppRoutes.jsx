import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../App/PublicLayout";
import ProtectedRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import AppLayout from "../App/AppLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Home from "../pages/Home/Home";
import VerfiyEmail from "../pages/user/VerfiyEmail";
// import AccountSettings from "../pages/Home/AccountSettings";
// import ChangePassword from "../components/ChangePassword";
import Profile from "../pages/Home/Profile";
import Sequrity from "../pages/Home/Sequrity";
import SettingsLayout from "../pages/Home/AccountSettings";
import SessionsPage from "../pages/settings/Sessions";
import LoginHistoryPage from "../pages/settings/LoginHistory";
import BackupCodesPage from "../pages/settings/BackupCodes";
import NotificationsPage from "../pages/settings/Notifictions";
import DeleteAccountPage from "../pages/settings/DeleteAccount";
import ConnectionsPage from "../pages/settings/Connections";
import Passwords from "../pages/settings/Passwords";

const router = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <PublicRoute>
        <PublicLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },

  // Protected routes can be added here in the future
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "user/verify-email",
        element: <VerfiyEmail />,
      },
      {
        path: "settings",
        element: <SettingsLayout />,
        children: [
          {
            index: true,
            element: <Profile />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "notifications",
            element: <NotificationsPage />,
          },
          {
            path: "security",
            element: <Sequrity />,
          },
          {
            path: "password",
            element: <Passwords />,
          },
          {
            path: "backup-codes",
            element: <BackupCodesPage />,
          },
          {
            path: "api-keys",
            element: <div>API Keys Page</div>,
          },
          {
            path: "sessions",
            element: <SessionsPage />,
          },
          {
            path: "devices",
            element: <div>Devices Page</div>,
          },
          {
            path: "login-history",
            element: <LoginHistoryPage />,
          },
          {
            path: "developer",
            element: <div>Developer Settings</div>,
          },
          {
            path: "github",
            element: <div>GitHub Integration</div>,
          },
          {
            path: "connections",
            element: <ConnectionsPage />,
          },
          {
            path: "webhooks",
            element: <div>Webhooks Page</div>,
          },
          {
            path: "database",
            element: <div>Database Settings</div>,
          },
          {
            path: "appearance",
            element: <div>Appearance Settings</div>,
          },
          {
            path: "export",
            element: <div>Export Data</div>,
          },
          {
            path: "delete-account",
            element: <DeleteAccountPage />,
          },
        ],
      },
    ],
  },

  // Catch-all route for 404 Not Found

  {
    path: "*",
    element: (
      <div className="h-screen w-full bg-black text-white text-2xl font-mono flex items-center justify-center">
        404 Not Found
      </div>
    ),
  },
]);

export default router;
