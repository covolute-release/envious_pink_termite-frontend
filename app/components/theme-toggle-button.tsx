import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/theme-provider";
import { useEffect, useState } from "react";

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  // Ensure the component only renders on the client where `theme` is correctly initialized
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder or null on the server/initial client render
    return <div className="h-9 w-9 rounded-md p-2" />; // Matches button size
  }

  const toggle = () => {
    setTheme(theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "light" : "dark");
  };
  
  let currentEffectiveTheme = theme;
    if (theme === "system" && typeof window !== "undefined") {
      currentEffectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  }


  return (
    <button
      onClick={toggle}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-600 dark:text-neutral-400"
      aria-label="Toggle theme"
    >
      {currentEffectiveTheme === "light" ? (
        <Moon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
      ) : (
        <Sun className="h-5 w-5 text-gray-400 hover:text-gray-200" />
      )}
    </button>
  );
}