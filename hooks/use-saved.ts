import { useCallback, useSyncExternalStore } from "react";

const KEY = "mottle-saved";
const EMPTY: number[] = [];
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedIds: number[] = EMPTY;

function getSnapshot(): number[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      cachedIds = Array.isArray(parsed)
        ? parsed.filter((n): n is number => typeof n === "number")
        : EMPTY;
    } catch {
      cachedIds = EMPTY;
    }
  }
  return cachedIds;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

/** Saved combination ids, persisted in localStorage and shared across pages/tabs. */
export function useSaved() {
  const savedIds = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

  const toggle = useCallback((id: number) => {
    const current = getSnapshot();
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      return;
    }
    listeners.forEach((l) => l());
  }, []);

  return { savedIds, toggle };
}
