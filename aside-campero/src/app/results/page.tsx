"use client";

import { useData } from "@/contexts/DataContext";
import { Card } from "@/components/ui/Card";
import { formatTimeDisplay } from "@/lib/utils";
import { Trophy, Medal, Clock } from "lucide-react";

interface TeamResult {
  id: string;
  name: string;
  category: string;
  cows1: number;
  time1: number;
  cows2: number;
  time2: number;
  totalCows: number;
  totalTime: number;
}

export default function Results() {
  const { teams, times } = useData();

  const calculateResults = (): TeamResult[] => {
    return teams
      .map((team) => {
        const teamTimes = times[team.id] || {};
        const pass1 = teamTimes.pass1;
        const pass2 = teamTimes.pass2;

        const cows1 = (pass1 as any)?.cows || 0;
        const cows2 = (pass2 as any)?.cows || 0;
        const totalCows = cows1 + cows2;

        const time1 = pass1 ? (pass1 as any).time + (pass1 as any).penalty : 0;
        const time2 = pass2 ? (pass2 as any).time + (pass2 as any).penalty : 0;
        const totalTime = time1 + time2;

        return {
          ...team,
          cows1,
          time1,
          cows2,
          time2,
          totalCows,
          totalTime,
        };
      })
      .sort((a, b) => {
        if (b.totalCows !== a.totalCows) return b.totalCows - a.totalCows;
        return a.totalTime - b.totalTime;
      });
  };

  const results = calculateResults();

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-700" />;
    return <span className="font-bold text-secondary-400">#{index + 1}</span>;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary-500/10 rounded-xl text-primary-500">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-secondary-900 dark:text-white">
            Resultados
          </h2>
          <p className="text-secondary-500 dark:text-secondary-400">
            Tabla de posiciones en tiempo real
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {results.map((team, index) => (
          <Card
            key={team.id}
            className="p-0 overflow-hidden transition-all hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800"
          >
            <div className="flex flex-col md:flex-row">
              <div className="p-6 flex items-center gap-4 min-w-[250px] bg-secondary-50 dark:bg-secondary-800/50 border-b md:border-b-0 md:border-r border-secondary-100 dark:border-secondary-700">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-secondary-700 shadow-sm">
                  {getRankIcon(index)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-secondary-500 uppercase tracking-wider">
                    Equipo {team.category}
                  </div>
                  <div className="text-xl font-bold text-secondary-900 dark:text-white">
                    {team.name}
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                    P1
                  </div>
                  <div>
                    <div className="text-sm text-secondary-500">
                      <span className="font-semibold text-secondary-900 dark:text-white">
                        {team.cows1}
                      </span>{" "}
                      vacas
                    </div>
                    <div className="text-xs font-mono text-secondary-400">
                      {formatTimeDisplay(team.time1)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                    P2
                  </div>
                  <div>
                    <div className="text-sm text-secondary-500">
                      <span className="font-semibold text-secondary-900 dark:text-white">
                        {team.cows2}
                      </span>{" "}
                      vacas
                    </div>
                    <div className="text-xs font-mono text-secondary-400">
                      {formatTimeDisplay(team.time2)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pl-4 border-l border-secondary-100 dark:border-secondary-700">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 leading-none">
                      {team.totalCows}{" "}
                      <span className="text-sm font-normal text-secondary-500">
                        vacas
                      </span>
                    </div>
                    <div className="text-sm font-mono font-medium text-secondary-600 dark:text-secondary-300 mt-1">
                      {formatTimeDisplay(team.totalTime)}
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
