"use client";

import { useCallback } from "react";

const STORAGE_KEY = "cs-theme";

export function useTheme() {
  const toggleTheme = useCallback(() => {
    const apply = () => {
      const html = document.documentElement;
      const isDark = html.getAttribute("data-theme") === "dark";

      if (isDark) {
        html.removeAttribute("data-theme");
        localStorage.setItem(STORAGE_KEY, "light");
      } else {
        html.setAttribute("data-theme", "dark");
        localStorage.setItem(STORAGE_KEY, "dark");
      }
    };

    if (!document.startViewTransition) {
      apply();
      return;
    }
    document.startViewTransition(apply);
  }, []);

  return { toggleTheme };
}

