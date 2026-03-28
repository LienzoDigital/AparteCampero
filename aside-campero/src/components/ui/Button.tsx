"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";

const variants = {
  primary: "bg-violet-600 hover:bg-violet-700 text-white shadow-lg",
  secondary: "bg-slate-600 hover:bg-slate-700 text-white shadow-lg",
  success: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg",
  danger: "bg-red-500 hover:bg-red-600 text-white shadow-lg",
  warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-lg",
  info: "bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg",
  outline: "border-2 border-slate-200 hover:border-violet-500 hover:text-violet-600 text-slate-600 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white dark:hover:border-violet-500 bg-transparent",
  ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
