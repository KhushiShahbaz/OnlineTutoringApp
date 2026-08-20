"use client";

import { useEffect } from "react";

const HEARTBEAT_INTERVAL_MS = 60_000;

/** Pings the presence heartbeat on mount and every minute while the tab is visible. */
export function usePresenceHeartbeat() {
  useEffect(() => {
    function ping() {
      if (document.visibilityState !== "visible") return;
      fetch("/api/presence/heartbeat", { method: "POST" }).catch(() => {});
    }

    ping();
    const interval = setInterval(ping, HEARTBEAT_INTERVAL_MS);
    document.addEventListener("visibilitychange", ping);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", ping);
    };
  }, []);
}
