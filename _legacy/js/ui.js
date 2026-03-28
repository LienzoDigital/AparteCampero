// ui.js - Versión optimizada para header compacto

document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeViewMode();
    setupTooltips();
    adjustHeaderElements();
});

// ======================
// FUNCIONES PRINCIPALES
// ======================

function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('themePreference') || 'light';
        setTheme(savedTheme === 'dark');
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function initializeViewMode() {
    const viewToggle = document.getElementById('viewToggle');
    if (viewToggle) {
        const savedView = localStorage.getItem('viewModePreference');
        const isMobile = savedView ? savedView === 'mobile' : window.innerWidth < 992;
        setViewMode(isMobile);
        viewToggle.addEventListener('click', toggleViewMode);
    }
}

// ======================
// FUNCIONES DE CONFIGURACIÓN
// ======================

function setTheme(isDark) {
    document.body.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('light-theme', !isDark);
    localStorage.setItem('themePreference', isDark ? 'dark' : 'light');
    updateThemeIcon();
}

function setViewMode(isMobile) {
    document.body.classList.toggle('mobile-view', isMobile);
    document.body.classList.toggle('desktop-view', !isMobile);
    localStorage.setItem('viewModePreference', isMobile ? 'mobile' : 'desktop');
    updateViewIcon();
}

// ======================
// ACTUALIZACIÓN DE ICONOS
// ======================

function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const isDark = document.body.classList.contains('dark-theme');
    const icon = themeToggle.querySelector('img');
    if (icon) {
        icon.src = isDark ? 'img/sun.svg' : 'img/moon.svg';
        icon.alt = isDark ? 'Tema claro' : 'Tema oscuro';
    }
    themeToggle.title = isDark ? 'Tema claro' : 'Tema oscuro';
}

function updateViewIcon() {
    const viewToggle = document.getElementById('viewToggle');
    if (!viewToggle) return;
    
    const isMobile = document.body.classList.contains('mobile-view');
    const icon = viewToggle.querySelector('img');
    if (icon) {
        icon.src = isMobile ? 'img/laptop.svg' : 'img/phone.svg';
        icon.alt = isMobile ? 'Vista PC' : 'Vista móvil';
    }
    viewToggle.title = isMobile ? 'Vista PC' : 'Vista móvil';
}

// ======================
// FUNCIONES DE UTILIDAD
// ======================

function toggleTheme() {
    setTheme(!document.body.classList.contains('dark-theme'));
}

function toggleViewMode() {
    setViewMode(!document.body.classList.contains('mobile-view'));
}

function setupTooltips() {
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(el => new bootstrap.Tooltip(el));
}

function adjustHeaderElements() {
    const header = document.querySelector('header');
    if (header) {
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.padding = '0.5rem 1rem';
        
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.style.height = '40px';
        }
        
        const themeSwitcher = document.querySelector('.theme-switcher');
        if (themeSwitcher) {
            themeSwitcher.style.display = 'flex';
            themeSwitcher.style.gap = '0.5rem';
            themeSwitcher.style.alignItems = 'center';
        }
    }
    
    // Ajustar tamaño de íconos SVG
    const icons = document.querySelectorAll('.icon-svg');
    icons.forEach(icon => {
        icon.style.width = '1em';
        icon.style.height = '1em';
    });
}

// ======================
// INTERFAZ PÚBLICA
// ======================

window.UI = {
    toggleTheme,
    toggleViewMode,
    adjustHeaderElements
};