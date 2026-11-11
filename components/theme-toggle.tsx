"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <button className="rounded-full bg-white/50 p-2 text-stone-500 dark:bg-stone-800/50 dark:text-stone-400">
        <div className="h-5 w-5" />
      </button>
    );
  }

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <button
      onClick={toggleTheme}
      className="relative rounded-full border border-stone-200/50 bg-white/50 p-2 text-stone-500 shadow-sm transition-colors hover:bg-white hover:text-stone-900 dark:border-stone-700/50 dark:bg-stone-800/50 dark:text-stone-400 dark:hover:bg-stone-700 dark:hover:text-stone-100"
      title={`Current theme: ${theme}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
