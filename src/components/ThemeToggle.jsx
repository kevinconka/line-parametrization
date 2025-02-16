"use client"

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun
        className="h-5 w-5 rotate-0 scale-100 transition-all text-gray-900 dark:text-gray-100 dark:-rotate-90 dark:scale-0"
      />
      <Moon
        className="absolute h-5 w-5 rotate-90 scale-0 transition-all text-gray-500 dark:text-gray-100 dark:hover:text-gray-300 dark:rotate-0 dark:scale-100"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
} 