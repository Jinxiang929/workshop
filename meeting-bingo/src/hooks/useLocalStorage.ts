import { useCallback, useEffect, useState } from 'react';

/**
 * Persist a JSON-serializable value to localStorage under a versioned key.
 * On a version mismatch (or parse error) the stored value is discarded and the
 * initial value is used instead — guards against schema drift (plan §3).
 */
export function useLocalStorage<T>(
  key: string,
  version: number,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const storageKey = `${key}:v${version}`;

  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw === null) return initialValue;
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
      // Drop any older-version payloads so they can't be resurrected.
      for (let i = 0; i < version; i++) {
        localStorage.removeItem(`${key}:v${i}`);
      }
    } catch {
      // Storage unavailable / quota exceeded — ignore, app still works.
    }
  }, [storageKey, key, version, value]);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }, [storageKey]);

  return [value, setValue, clear];
}
