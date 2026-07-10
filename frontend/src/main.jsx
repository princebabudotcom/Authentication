import { createRoot } from "react-dom/client";
import "./index.css";
import { NotificationProvider } from "./context/notification/NotificationProvider.jsx";

import AuthProvider from "./context/auth/AuthProvider.jsx";
import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRoutes.jsx";
import { NetworkStatusProvider } from "./context/network/Networkstatusprovider.jsx";

createRoot(document.getElementById("root")).render(
  <NetworkStatusProvider>
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  </NetworkStatusProvider>,
);
