import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import NetworkError from "../../pages/Home/NetworkError";
import api from "../../config/axiosConfig"; // your existing axios instance (baseURL, auth header, etc.)

/* ------------------------------------------------------------------ *
 *  NetworkStatusProvider
 *
 *  Wrap your app once, at the root. It:
 *   1. Listens to every axios response via an interceptor.
 *   2. If a request fails with a genuine NETWORK error (server
 *      unreachable, DNS fail, CORS-blocked, timeout) — as opposed to
 *      a normal 4xx/5xx the server actually responded with — it
 *      swaps the whole app for <NetworkError />.
 *   3. Also listens to the browser's own online/offline events,
 *      since sometimes there's no failed request yet, just no wifi.
 *   4. Keeps the failed request's config so "Try again" can literally
 *      re-fire that exact request instead of just reloading the page.
 * ------------------------------------------------------------------ */

const NetworkStatusContext = createContext(null);

export function NetworkStatusProvider({ children }) {
  const [isDown, setIsDown] = useState(false);
  const lastFailedRequest = useRef(null);

  // ── 1 & 4: axios interceptor ──
  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response, // success — pass through untouched
      (error) => {
        const isNetworkError =
          !error.response && // server never responded at all
          (error.code === "ERR_NETWORK" ||
            error.code === "ECONNABORTED" ||
            error.message === "Network Error");

        if (isNetworkError) {
          lastFailedRequest.current = error.config; // remember it for retry
          setIsDown(true);
        }

        // Always re-throw so your normal .catch()/try-catch logic
        // elsewhere in the app still runs as expected.
        return Promise.reject(error);
      },
    );

    return () => api.interceptors.response.eject(interceptorId);
  }, []);

  // ── 2 & 3: real browser connectivity events ──
  useEffect(() => {
    const goOffline = () => setIsDown(true);
    const goOnline = () => {
      // Don't auto-clear instantly — let NetworkError's own retry
      // confirm the backend, not just the wifi, is reachable.
    };
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  // Called by NetworkError's retry button
  const retry = useCallback(async () => {
    if (!navigator.onLine) {
      throw new Error("still offline");
    }
    if (lastFailedRequest.current) {
      // Re-fire the exact request that failed
      await api.request(lastFailedRequest.current);
    } else {
      // No specific request to replay — just prove the API is reachable
      await api.get("/health");
    }
    setIsDown(false);
  }, []);

  return (
    <NetworkStatusContext.Provider value={{ isDown, retry }}>
      {isDown ? <NetworkError onRetry={retry} /> : children}
    </NetworkStatusContext.Provider>
  );
}

// Optional: lets any component check connectivity directly,
// e.g. to disable a "Save" button instead of letting it fail.
export function useNetworkStatus() {
  const ctx = useContext(NetworkStatusContext);
  if (!ctx)
    throw new Error(
      "useNetworkStatus must be used inside <NetworkStatusProvider>",
    );
  return ctx;
}
