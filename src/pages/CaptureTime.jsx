import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatTime } from '../utils/format';
import { Play, Square, RotateCcw, Clock, AlertCircle } from 'lucide-react';

export default function CaptureTime() {
    const { teams, saveTime, times } = useData();
    const [selectedTeam, setSelectedTeam] = useState('');
    const [pass, setPass] = useState(1);
    const [cows, setCows] = useState(3);
    const [isRunning, setIsRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [penalty, setPenalty] = useState(0);
    const [message, setMessage] = useState(null);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    const handleStart = () => setIsRunning(true);

    const handleStop = () => setIsRunning(false);

    const handleReset = () => {
        setIsRunning(false);
        setSeconds(0);
        setPenalty(0);
    };

    const handleSave = () => {
        if (!selectedTeam) {
            setMessage({ type: 'error', text: 'Seleccione un equipo' });
            return;
        }

        // Verificar si ya existe un tiempo para esta pasada
        if (times[selectedTeam] && times[selectedTeam][`pass${pass}`]) {
            const errorMsg = `Ya existe un tiempo guardado para el Equipo ${selectedTeam} en la Pasada ${pass}. No se puede sobreescribir.`;
            alert(errorMsg);
            setMessage({ 
                type: 'error', 
                text: errorMsg
            });
            return;
        }

        const totalTime = seconds + penalty;
        saveTime(selectedTeam, pass, {
            cows,
            time: seconds,
            penalty
        });

        setMessage({
            type: 'success',
            text: `Tiempo guardado: ${formatTime(totalTime)} (${cows} vacas)`
        });

        handleReset();
        setTimeout(() => setMessage(null), 4000);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-info/10 rounded-xl text-info">
                    <PlayCircleIcon className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-secondary-900 dark:text-white">Toma de Tiempos</h2>
                    <p className="text-secondary-500 dark:text-secondary-400">Cronómetro en tiempo real</p>
                </div>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 ${message.type === 'error'
                        ? 'bg-red-50 text-red-700 border border-red-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    }`}>
                    <AlertCircle className="w-5 h-5" />
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="text-center py-12 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-info"></div>

                        <div className="text-[8rem] leading-none font-mono font-bold tracking-tighter text-secondary-900 dark:text-white mb-8 tabular-nums">
                            {formatTime(seconds)}
                        </div>

                        <div className="flex justify-center gap-4">
                            {!isRunning ? (
                                <Button onClick={handleStart} variant="success" size="lg" className="w-40 text-xl shadow-emerald-500/20">
                                    <Play className="mr-2 w-6 h-6" /> Iniciar
                                </Button>
                            ) : (
                                <Button onClick={handleStop} variant="danger" size="lg" className="w-40 text-xl shadow-red-500/20">
                                    <Square className="mr-2 w-6 h-6" /> Parar
                                </Button>
                            )}
                            <Button onClick={handleReset} variant="secondary" size="lg" className="w-40 text-xl" disabled={isRunning}>
                                <RotateCcw className="mr-2 w-6 h-6" /> Reset
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2 uppercase tracking-wider">Equipo</label>
                                <select
                                    value={selectedTeam}
                                    onChange={(e) => setSelectedTeam(e.target.value)}
                                    className="input-modern"
                                >
                                    <option value="">Seleccionar equipo</option>
                                    {teams.map(team => (
                                        <option key={team.id} value={team.id}>{team.number} - {team.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2 uppercase tracking-wider">Pasada</label>
                                <div className="flex bg-secondary-100 dark:bg-secondary-800 p-1 rounded-xl">
                                    {[1, 2, 3].map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPass(p)}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${pass === p
                                                    ? 'bg-white dark:bg-secondary-600 text-primary-600 dark:text-white shadow-sm'
                                                    : 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-900'
                                                }`}
                                        >
                                            Pasada {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <label className="block text-sm font-semibold text-center text-secondary-700 dark:text-secondary-300 mb-4 uppercase tracking-wider">Vacas Encerradas</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[0, 1, 2, 3].map(c => (
                                <button
                                    key={c}
                                    onClick={() => setCows(c)}
                                    className={`py-4 rounded-xl text-2xl font-bold transition-all border-2 ${cows === c
                                            ? 'border-success bg-success/10 text-success'
                                            : 'border-secondary-200 dark:border-secondary-700 text-secondary-400 hover:border-secondary-300'
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <label className="block text-sm font-semibold text-center text-secondary-700 dark:text-secondary-300 mb-4 uppercase tracking-wider">Penalizaciones</label>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {[5, 10, 15, 20].map(p => (
                                <button
                                    key={p}
                                    onClick={() => setPenalty(prev => prev + p)}
                                    className="py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition-colors"
                                >
                                    +{p}s
                                </button>
                            ))}
                        </div>

                        <div className="flex justify-between items-center p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg mb-4">
                            <span className="text-sm text-secondary-500">Total</span>
                            <span className="text-xl font-bold text-danger">+{penalty}s</span>
                        </div>

                        <button
                            onClick={() => setPenalty(0)}
                            className="w-full py-2 text-sm text-secondary-500 hover:text-secondary-700 transition-colors"
                        >
                            Resetear Penalizaciones
                        </button>
                    </Card>

                    <Button onClick={handleSave} className="w-full py-4 text-lg shadow-primary-500/20" disabled={isRunning}>
                        Guardar Tiempo
                    </Button>
                </div>
            </div>
        </div>
    );
}

function PlayCircleIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
    )
}
