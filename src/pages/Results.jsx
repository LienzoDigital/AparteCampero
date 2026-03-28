import React from 'react';
import { useData } from '../contexts/DataContext';
import Card from '../components/ui/Card';
import { formatTime } from '../utils/format';
import { Trophy, Medal, Clock, CheckCircle } from 'lucide-react';

export default function Results() {
    const { teams, times } = useData();

    const calculateResults = () => {
        return teams.map(team => {
            const teamTimes = times[team.id] || {};
            const allPasses = [1, 2, 3].map(p => {
                const data = teamTimes[`pass${p}`];
                if (!data) return null;
                return { ...data, id: p, total: data.time + data.penalty };
            });

            // Filter valid and sort to find best 2
            const validPasses = allPasses.filter(p => p !== null);
            const sortedValid = [...validPasses].sort((a, b) => {
                if (b.cows !== a.cows) return b.cows - a.cows;
                return a.total - b.total;
            });

            const bestTwo = sortedValid.slice(0, 2);
            const bestTwoIds = bestTwo.map(p => p.id);

            const totalCows = bestTwo.reduce((acc, p) => acc + p.cows, 0);
            const totalTime = bestTwo.reduce((acc, p) => acc + p.total, 0);
            const completedPasses = validPasses.length;

            return {
                ...team,
                passes: allPasses,
                bestTwoIds,
                totalCows,
                totalTime,
                completedPasses
            };
        }).sort((a, b) => {
            if (b.totalCows !== a.totalCows) return b.totalCows - a.totalCows;
            return a.totalTime - b.totalTime;
        });
    };

    const results = calculateResults();

    const getRankIcon = (index) => {
        if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
        if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
        if (index === 2) return <Medal className="w-6 h-6 text-amber-700" />;
        return <span className="font-bold text-secondary-400">#{index + 1}</span>;
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary-500/10 rounded-xl text-primary-500">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-secondary-900 dark:text-white">Resultados</h2>
                        <p className="text-secondary-500 dark:text-secondary-400">Suma de las 2 mejores pasadas</p>
                    </div>
                </div>
                <div className="hidden md:block px-4 py-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg text-xs font-semibold text-secondary-600 dark:text-secondary-400 border border-secondary-200 dark:border-secondary-700 uppercase tracking-wider">
                    Mejores 2 de 3
                </div>
            </div>

            <div className="space-y-4">
                {results.map((team, index) => (
                    <Card key={team.id} className="p-0 overflow-hidden transition-all hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800">
                        <div className="flex flex-col">
                            {/* 1. Header: Team & Rank (Top) */}
                            <div className="p-4 sm:p-5 flex items-center justify-between bg-secondary-50 dark:bg-secondary-800/50 border-b border-secondary-100 dark:border-secondary-700">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-secondary-700 shadow-sm shrink-0">
                                        {getRankIcon(index)}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-base sm:text-lg font-bold text-secondary-900 dark:text-white uppercase tracking-tight truncate">
                                            {team.name}
                                        </div>
                                        <div className="text-[10px] font-semibold text-secondary-500 uppercase tracking-wider">
                                            Equipo {team.number}
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0 ${index === 0 ? 'bg-yellow-500/10 text-yellow-600' : 'bg-secondary-200 dark:bg-secondary-700 text-secondary-500'}`}>
                                    Puesto {index + 1}
                                </div>
                            </div>

                            {/* 2. Middle: Pass Details */}
                            <div className="p-4 sm:p-5 border-b border-secondary-100 dark:border-secondary-700 bg-white dark:bg-secondary-900">
                                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                                    {team.passes.map((passData, pIdx) => {
                                        const isBest = team.bestTwoIds.includes(pIdx + 1);
                                        return (
                                            <div key={pIdx} className={`relative flex flex-col items-center justify-center py-3 sm:py-4 px-1 rounded-2xl border-2 transition-all ${isBest 
                                                ? 'bg-primary-500/5 border-primary-500/20' 
                                                : 'bg-secondary-50/50 dark:bg-secondary-800/20 border-transparent opacity-30 grayscale'}`}>
                                                
                                                <div className={`mb-1 sm:mb-2 text-[9px] font-black uppercase tracking-widest ${isBest ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-400'}`}>
                                                    Pasada {pIdx + 1}
                                                </div>
                                                
                                                <div className="flex flex-col items-center">
                                                    <div className="text-base font-black text-secondary-900 dark:text-white leading-none mb-1">
                                                        {passData?.cows || 0} <span className="text-[10px] font-bold text-secondary-500">V</span>
                                                    </div>
                                                    <div className="text-[10px] font-mono font-bold text-secondary-500 tracking-tighter">
                                                        {formatTime(passData ? passData.time + passData.penalty : 0)}
                                                    </div>
                                                </div>

                                                {isBest && passData && (
                                                    <div className="absolute -top-1 -right-1 bg-primary-500 text-white rounded-full p-0.5 shadow-md">
                                                        <CheckCircle className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 3. Bottom: Final Result */}
                            <div className="p-4 sm:p-5 bg-gradient-to-r from-primary-500/5 to-info/5 dark:from-primary-500/10 dark:to-info/10">
                                <div className="flex items-center justify-between">
                                    <div>
                                       <div className="text-[10px] sm:text-xs font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-0.5">Resultado Final</div>
                                       <div className="text-[9px] sm:text-[10px] font-bold text-secondary-400 uppercase">Suma de las 2 mejores</div>
                                    </div>
                                    <div className="flex items-center gap-3 sm:gap-6">
                                        <div className="text-2xl sm:text-4xl font-black text-primary-600 dark:text-primary-400 flex items-baseline gap-1">
                                            {team.totalCows}
                                            <span className="text-[10px] sm:text-xs font-bold uppercase text-secondary-500">vacas</span>
                                        </div>
                                        <div className="h-6 sm:h-10 w-px bg-primary-500/20"></div>
                                        <div className="text-lg sm:text-2xl font-mono font-black text-secondary-800 dark:text-secondary-100">
                                            {formatTime(team.totalTime)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}

                {results.length === 0 && (
                    <div className="text-center py-12 text-secondary-500">
                        <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No hay resultados registrados aún.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
