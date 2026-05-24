import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../App/PublicLayout";
import ProtectedRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import AppLayout from "../App/AppLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

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
        element: <div>Dashboard</div>,
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
