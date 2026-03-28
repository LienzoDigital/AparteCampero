import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-md rounded-2xl p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
