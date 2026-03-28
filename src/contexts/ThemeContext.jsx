import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('themePreference');
        return savedTheme || 'light';
    });

    const [viewMode, setViewMode] = useState(() => {
        const savedView = localStorage.getItem('viewModePreference');
        if (savedView) return savedView;
        return window.innerWidth < 992 ? 'mobile' : 'desktop';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('themePreference', theme);
    }, [theme]);

    useEffect(() => {
        document.body.classList.remove('mobile-view', 'desktop-view');
        document.body.classList.add(`${viewMode}-view`);
        localStorage.setItem('viewModePreference', viewMode);
    }, [viewMode]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const toggleViewMode = () => {
        setViewMode(prev => prev === 'mobile' ? 'desktop' : 'mobile');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, viewMode, toggleViewMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
