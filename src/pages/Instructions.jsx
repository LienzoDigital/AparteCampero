import React from 'react';
import Card from '../components/ui/Card';
import { BookOpen, Users, PlayCircle, Timer, Trophy, Download, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Instructions() {
    const steps = [
        {
            icon: Users,
            title: '1. Registro de Equipos',
            description: 'Antes de comenzar la competencia, diríjase a la sección "Equipos". Ingrese el nombre de cada equipo. El sistema asignará un número correlativo automáticamente. Puede editar o eliminar equipos si es necesario.',
            color: 'text-primary-600',
            bg: 'bg-primary-600/10'
        },
        {
            icon: PlayCircle,
            title: '2. Toma de Tiempos (Cronómetro)',
            description: 'Para medir una corrida en vivo, use "Toma de Tiempos". Seleccione el equipo y el número de pasada (1, 2 o 3). Presione "Iniciar" al largar y "Parar" al encerrar. Indique la cantidad de vacas y sume penalizaciones si corresponde.',
            color: 'text-info',
            bg: 'bg-info/10'
        },
        {
            icon: Timer,
            title: '3. Registro Manual',
            description: 'Si ya tiene el tiempo medido externamente, use "Registro Manual". Podrá ingresar los minutos y segundos directamente, junto con las vacas encerradas y penalizaciones.',
            color: 'text-success',
            bg: 'bg-success/10'
        },
        {
            icon: Trophy,
            title: '4. Cálculo de Resultados',
            description: 'La aplicación calcula automáticamente el ranking basándose en las MEJORES 2 PASADAS de cada equipo. El criterio de desempate es: 1° Mayor cantidad de vacas totales, 2° Menor tiempo total acumulado.',
            color: 'text-warning',
            bg: 'bg-warning/10'
        },
        {
            icon: Download,
            title: '5. Exportar y Finalizar',
            description: 'Una vez finalizado el evento, puede descargar la planilla de resultados en formato CSV o JSON desde la sección "Exportar". Si desea iniciar un nuevo evento, use "Resetear" (esto borrará todos los datos).',
            color: 'text-secondary-500',
            bg: 'bg-secondary-500/10'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-primary-600/10 rounded-2xl text-primary-600">
                    <BookOpen className="w-10 h-10" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-secondary-900 dark:text-white tracking-tight">
                        Instrucciones de Uso
                    </h1>
                    <p className="text-secondary-500 dark:text-secondary-400 text-lg">
                        Guía paso a paso para la gestión de Aparte Campero
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {steps.map((step, index) => (
                    <Card key={index} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row gap-6 p-2">
                            <div className={`flex shrink-0 items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl ${step.bg} ${step.color}`}>
                                <step.icon className="w-8 h-8 md:w-10 md:h-10" />
                            </div>
                            <div className="flex-1 pr-4 py-2">
                                <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="mt-12 bg-gradient-to-br from-primary-600 to-info border-none p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-6 h-6" />
                        Tip Importante
                    </h2>
                    <p className="text-primary-100 text-lg max-w-2xl leading-relaxed">
                        Recuerde que el sistema <strong>protege los datos</strong>: no podrá sobreescribir un tiempo ya guardado para una misma pasada. 
                        Si cometió un error, utilice la opción "Editar" del menú principal para corregirlo.
                    </p>
                </div>
                {/* Decorative element */}
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </Card>

            <div className="mt-10 text-center">
                <button 
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-colors"
                >
                    Volver al Inicio <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
