import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Smartphone, Monitor, ArrowLeft } from 'lucide-react';

export default function Header() {
    const { theme, toggleTheme, viewMode, toggleViewMode } = useTheme();
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-secondary-900/80 border-b border-secondary-200 dark:border-secondary-800 transition-colors duration-300">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {!isHome && (
                        <Link
                            to="/"
                            className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors text-secondary-600 dark:text-secondary-300"
                            title="Volver al inicio"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                    )}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-info rounded-full blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                            <img src={`${import.meta.env.BASE_URL}assets/horse-logo.png`} alt="Logo" className="relative h-10 w-10 object-contain" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-secondary-900 dark:text-white">
                            Aparte<span className="text-secondary-500">Campero</span>
                        </span>
                    </Link>
                </div>

                <div className="flex gap-2 items-center bg-secondary-100 dark:bg-secondary-800 p-1 rounded-xl">
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-lg transition-all duration-200 ${theme === 'dark'
                                ? 'bg-secondary-700 text-yellow-400 shadow-sm'
                                : 'text-secondary-500 hover:text-secondary-900'
                            }`}
                        title={theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={toggleViewMode}
                        className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'mobile'
                                ? 'bg-white dark:bg-secondary-600 text-primary-600 dark:text-white shadow-sm'
                                : 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-900'
                            }`}
                        title={viewMode === 'mobile' ? 'Vista PC' : 'Vista móvil'}
                    >
                        {viewMode === 'mobile' ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </header>
    );
}
