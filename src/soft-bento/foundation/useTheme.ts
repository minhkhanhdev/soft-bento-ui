import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface UseThemeOptions {
  storageKey?: string;
  defaultDark?: boolean;
}

/**
 * Synchronizes Soft Bento light/dark mode across `[data-theme]`, CSS `color-scheme`,
 * `<meta name="theme-color">`, and `localStorage` without hardcoding hex colors.
 */
export function useTheme(options: UseThemeOptions = {}) {
  const { storageKey = 'soft-bento-theme', defaultDark = false } = options;

  const [dark, setDark] = useState<boolean>(() => {
    if (typeof document === 'undefined') return defaultDark;
    const preset = document.documentElement.dataset.theme;
    if (preset === 'dark') return true;
    if (preset === 'light') return false;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
    } catch {
      /* Storage access is optional. */
    }
    return defaultDark;
  });

  useEffect(() => {
    const mode: ThemeMode = dark ? 'dark' : 'light';
    const root = document.documentElement;
    root.dataset.theme = mode;
    root.style.colorScheme = mode;

    const canvasColor = getComputedStyle(root).getPropertyValue('--canvas').trim();
    if (canvasColor) {
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', canvasColor);
    }

    try {
      localStorage.setItem(storageKey, mode);
    } catch {
      /* Device preference persistence is optional. */
    }
  }, [dark, storageKey]);

  return {
    dark,
    theme: (dark ? 'dark' : 'light') as ThemeMode,
    setDark,
    toggleDark: () => setDark(prev => !prev),
  };
}
