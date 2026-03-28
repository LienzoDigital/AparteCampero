"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Smartphone, Monitor, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("desktop");

  useEffect(() => {
    setMounted(true);
    const savedView = localStorage.getItem("viewModePreference");
    if (savedView) setViewMode(savedView as "mobile" | "desktop");
    else setViewMode(window.innerWidth < 992 ? "mobile" : "desktop");
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("viewModePreference", viewMode);
      document.body.classList.remove("mobile-view", "desktop-view");
      document.body.classList.add(`${viewMode}-view`);
    }
  }, [viewMode, mounted]);

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "mobile" ? "desktop" : "mobile"));
  };

  const isHome = pathname === "/";

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {!isHome && (
            <Link
              href="/"
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              title="Volver al inicio"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
          )}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
              <img src="/assets/logo.svg" alt="Logo" className="relative h-10 w-10 object-contain" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white hidden sm:block">
              Aparte<span className="text-violet-600">Campero</span>
            </span>
          </Link>
        </div>

        <div className="flex gap-2 items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`p-2 rounded-lg transition-all duration-200 ${
              theme === "dark"
                ? "bg-slate-700 text-yellow-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
            title={theme === "dark" ? "Tema claro" : "Tema oscuro"}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleViewMode}
            className={`p-2 rounded-lg transition-all duration-200 ${
              viewMode === "mobile"
                ? "bg-white dark:bg-slate-600 text-violet-600 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
            }`}
            title={viewMode === "mobile" ? "Vista PC" : "Vista móvil"}
          >
            {viewMode === "mobile" ? (
              <Smartphone className="w-5 h-5" />
            ) : (
              <Monitor className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
