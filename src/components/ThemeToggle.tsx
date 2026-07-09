"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { Moon, Sun, Monitor, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return <div className="w-[60px] h-10" />;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isLight = currentTheme === "light";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full glass hover:bg-[var(--glass-bg-color)] transition-all"
        aria-label="Toggle Theme"
      >
        <motion.div
          initial={false}
          animate={{ rotate: isLight ? 180 : 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 10 }}
        >
          {isLight ? <Sun className="w-5 h-5 text-amber-500 drop-shadow-md" /> : <Moon className="w-5 h-5 text-neon-blue drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
        </motion.div>
        <ChevronDown className={`w-3 h-3 text-[var(--fg-color)] opacity-60 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-40 py-2 rounded-2xl glass shadow-2xl z-50 overflow-hidden"
          >
            {[
              { id: "light", icon: Sun, label: "Light", color: "text-amber-500" },
              { id: "dark", icon: Moon, label: "Dark", color: "text-neon-blue" },
              { id: "system", icon: Monitor, label: "System", color: "text-[var(--fg-color)] opacity-70" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold tracking-wide transition-colors hover:bg-[var(--glass-border-color)] ${theme === t.id ? "text-[var(--fg-color)]" : "text-[var(--fg-color)] opacity-60"}`}
              >
                <t.icon className={`w-4 h-4 ${t.color}`} />
                {t.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
