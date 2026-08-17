import { useSyncExternalStore } from "react";

export type StaffSession =
  | { role: "admin" }
  | { role: "teacher"; teacherId: string };

const STORAGE_KEY = "learninghub-staff-session";

let cachedRaw: string | null = null;
let cachedSession: StaffSession | null = null;

export function getStaffSession(): StaffSession | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedSession;

  cachedRaw = raw;
  try {
    cachedSession = raw ? (JSON.parse(raw) as StaffSession) : null;
  } catch {
    cachedSession = null;
  }
  return cachedSession;
}

export function setStaffSession(session: StaffSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStaffSession() {
  localStorage.removeItem(STORAGE_KEY);
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getServerSnapshot() {
  return null;
}

export function useStaffSession() {
  return useSyncExternalStore(subscribe, getStaffSession, getServerSnapshot);
}
