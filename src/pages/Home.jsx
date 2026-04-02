import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Users, Timer, PlayCircle, Edit, Trophy, Download, ChevronRight, BookOpen } from 'lucide-react';

const menuItems = [
    {
        to: '/teams',
        label: 'Equipos',
        description: 'Gestión de participantes',
        icon: Users,
        color: 'text-primary-600',
        bg: 'bg-primary-600/10',
        border: 'border-primary-600/20',
        hover: 'hover:border-primary-600/50'
    },
    {
        to: '/capture-time',
        label: 'Toma de Tiempos',
        description: 'Cronómetro en tiempo real',
        icon: PlayCircle,
        color: 'text-info',
        bg: 'bg-info/10',
        border: 'border-info/20',
        hover: 'hover:border-info/50'
    },
    {
        to: '/register-time',
        label: 'Registro Manual',
        description: 'Carga de tiempos y penalizaciones',
        icon: Timer,
        color: 'text-success',
        bg: 'bg-success/10',
        border: 'border-success/20',
        hover: 'hover:border-success/50'
    },
    {
        to: '/results',
        label: 'Resultados',
        description: 'Tabla de posiciones y estadísticas',
        icon: Trophy,
        color: 'text-primary-500',
        bg: 'bg-primary-500/10',
        border: 'border-primary-500/20',
        hover: 'hover:border-primary-500/50'
    },
    {
        to: '/edit-times',
        label: 'Editar',
        description: 'Corregir tiempos guardados',
        icon: Edit,
        color: 'text-warning',
        bg: 'bg-warning/10',
        border: 'border-warning/20',
        hover: 'hover:border-warning/50'
    },
    {
        to: '/export-data',
        label: 'Exportar',
        description: 'Descargar datos en CSV/JSON',
        icon: Download,
        color: 'text-secondary-500',
        bg: 'bg-secondary-500/10',
        border: 'border-secondary-500/20',
        hover: 'hover:border-secondary-500/50'
    },
    {
        to: '/new-event',
        label: 'Resetear',
        description: 'Borrar todo y comenzar de nuevo',
        icon: Trash2,
        color: 'text-danger',
        bg: 'bg-danger/10',
        border: 'border-danger/20',
        hover: 'hover:border-danger/50'
    },
    {
        to: '/instructions',
        label: 'Instrucciones de Uso',
        description: 'Guía paso a paso',
        icon: BookOpen,
        color: 'text-primary-600',
        bg: 'bg-white dark:bg-secondary-800',
        border: 'border-primary-600/30',
        hover: 'hover:border-primary-600/60'
    }
];

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] py-8">
            <div className="text-center mb-12 space-y-2">
                <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-r from-primary-600 to-info bg-clip-text text-transparent">
                    Registro de Tiempos
                </h1>
                <p className="text-xl text-secondary-500 dark:text-secondary-400 font-light tracking-wide">
                    Aparte Campero
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl px-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className={`group relative flex flex-col p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${item.bg} ${item.border} ${item.hover} backdrop-blur-sm`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-white dark:bg-secondary-900 shadow-sm ${item.color}`}>
                                <item.icon className="w-8 h-8" />
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-secondary-400">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="mt-auto">
                            <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-1">
                                {item.label}
                            </h3>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">
                                {item.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
