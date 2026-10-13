"use client";

import { useTheme } from "next-themes";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label="Toggle light and dark theme"
      title="Toggle light and dark theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <HiOutlineSun className="theme-sun" aria-hidden="true" focusable="false" />
      <HiOutlineMoon className="theme-moon" aria-hidden="true" focusable="false" />
    </button>
  );
}
