import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import PageLoader from "../components/Loader";
import NotFound from "../pages/Home/PageNotFound";

// ── Layouts ──
const PublicLayout = lazy(() => import("../App/PublicLayout"));
const AppLayout = lazy(() => import("../App/AppLayout"));
const SettingsLayout = lazy(() => import("../pages/Home/AccountSettings"));

// ── Auth pages ──
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const AuthLandingPage = lazy(() => import("../pages/auth/MainPage"));

// ── Main app pages ──
const Home = lazy(() => import("../pages/Home/Home"));
const VerfiyEmail = lazy(() => import("../pages/user/VerfiyEmail"));
const NotificationsPage = lazy(() => import("../pages/Home/Notifications"));

// ── Settings pages ──
const Profile = lazy(() => import("../pages/Home/Profile"));
const Sequrity = lazy(() => import("../pages/Home/Sequrity"));
const Passwords = lazy(() => import("../pages/settings/Passwords"));
const SessionsPage = lazy(() => import("../pages/settings/Sessions"));
const LoginHistoryPage = lazy(() => import("../pages/settings/LoginHistory"));
const BackupCodesPage = lazy(() => import("../pages/settings/BackupCodes"));
const ConnectionsPage = lazy(() => import("../pages/settings/Connections"));
const DeleteAccountPage = lazy(() => import("../pages/settings/DeleteAccount"));

// Wraps any lazy element in its own Suspense boundary so each route
// shows the loader independently while its chunk downloads, instead
// of one boundary blanking the whole app on every navigation.
const withSuspense = (Component) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <PublicRoute>{withSuspense(PublicLayout)}</PublicRoute>,
    children: [
      { path: "login", element: withSuspense(Login) },
      { path: "register", element: withSuspense(Register) },
      { path: "forgot-password", element: withSuspense(ForgotPassword) },
    ],
  },

  {
    path: "/landing",
    element: <PublicRoute>{withSuspense(PublicLayout)}</PublicRoute>,
    children: [{ index: true, element: withSuspense(AuthLandingPage) }],
  },

  // ── Main app: AppLayout renders ONCE, wraps only these ──
  {
    path: "/",
    element: <ProtectedRoute>{withSuspense(AppLayout)}</ProtectedRoute>,
    children: [
      { index: true, element: withSuspense(Home) },
      { path: "notifications", element: withSuspense(NotificationsPage) },
      { path: "user/verify-email", element: withSuspense(VerfiyEmail) },
    ],
  },

  // ── Settings: a SIBLING protected route, NOT nested inside AppLayout. ──
  // AppLayout never mounts here, so its sidebar never renders alongside
  // SettingsLayout's — no overlay, no z-index tricks, no opacity hacks.
  {
    path: "/settings",
    element: <ProtectedRoute>{withSuspense(SettingsLayout)}</ProtectedRoute>,
    children: [
      { index: true, element: withSuspense(Profile) },
      { path: "profile", element: withSuspense(Profile) },
      { path: "notifications", element: withSuspense(NotificationsPage) },
      { path: "security", element: withSuspense(Sequrity) },
      { path: "password", element: withSuspense(Passwords) },
      { path: "backup-codes", element: withSuspense(BackupCodesPage) },
      { path: "api-keys", element: <div>API Keys Page</div> },          
      { path: "sessions", element: withSuspense(SessionsPage) },
      { path: "devices", element: <div>Devices Page</div> },
      { path: "login-history", element: withSuspense(LoginHistoryPage) },
      { path: "developer", element: <div>Developer Settings</div> },
      { path: "github", element: <div>GitHub Integration</div> },
      { path: "connections", element: withSuspense(ConnectionsPage) },
      { path: "webhooks", element: <div>Webhooks Page</div> },
      { path: "database", element: <div>Database Settings</div> },
      { path: "appearance", element: <div>Appearance Settings</div> },
      { path: "export", element: <div>Export Data</div> },
      { path: "delete-account", element: withSuspense(DeleteAccountPage) },
    ],
  },

  // Catch-all route for 404 Not Found
  {
    path: "*",
    element: withSuspense(NotFound),
  },
]);

export default router;
