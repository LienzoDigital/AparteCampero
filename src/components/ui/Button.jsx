import React from 'react';
import { Link } from 'react-router-dom';

const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white shadow-lg shadow-secondary-500/30',
    success: 'bg-success hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30',
    danger: 'bg-danger hover:bg-red-600 text-white shadow-lg shadow-red-500/30',
    warning: 'bg-warning hover:bg-amber-500 text-white shadow-lg shadow-amber-500/30',
    info: 'bg-info hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/30',
    purple: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30', // Mapped to primary
    outline: 'border-2 border-secondary-200 hover:border-primary-500 hover:text-primary-600 text-secondary-600 dark:border-secondary-700 dark:text-secondary-300 dark:hover:text-white dark:hover:border-primary-500 bg-transparent',
    ghost: 'text-secondary-600 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-800',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
};

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    to,
    href,
    ...props
}) {
    const baseClasses = "inline-flex items-center justify-center rounded-xl transition-all duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
    const variantClasses = variants[variant] || variants.primary;
    const sizeClasses = sizes[size] || sizes.md;
    const classes = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={classes} {...props}>
                {children}
            </a>
        );
    }

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
}
