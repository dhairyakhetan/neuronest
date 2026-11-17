import { useCallback, useEffect, useState } from 'react';

/**
 * Tiny localStorage store with cross-component sync.
 * Everything in this prototype lives only in the visitor's browser.
 */
const PREFIX = 'neuronest:';
const listeners = new Map<string, Set<() => void>>();

export function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function write<T>(key: string, value: T) {
  try {
    if (value === undefined) localStorage.removeItem(PREFIX + key);
    else localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode etc.) — keep working in memory */
  }
  listeners.get(key)?.forEach((fn) => fn());
}

export function useStore<T>(key: string, initial: T): [T, (next: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => read(key, initial));

  useEffect(() => {
    const sync = () => setValue(read(key, initial));
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(sync);
    return () => {
      listeners.get(key)!.delete(sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(read(key, initial)) : next;
      write(key, resolved);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return [value, set];
}

export function exportAll(): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (k.startsWith(PREFIX)) out[k.slice(PREFIX.length)] = JSON.parse(localStorage.getItem(k)!);
    }
  } catch {
    /* ignore */
  }
  return out;
}

export function clearAll(keep: string[] = []) {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (k.startsWith(PREFIX) && !keep.includes(k.slice(PREFIX.length))) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
    keys.forEach((k) => listeners.get(k.slice(PREFIX.length))?.forEach((fn) => fn()));
  } catch {
    /* ignore */
  }
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export function timeAgo(ts: number): string {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((p) => p && !p.endsWith('.'))
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
}
