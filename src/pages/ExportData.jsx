import React from 'react';
import { useData } from '../contexts/DataContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatTime } from '../utils/format';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';

export default function ExportData() {
    const { teams, times } = useData();

    const getExportData = () => {
        return teams.map(team => {
            const teamTimes = times[team.id] || {};
            const p1 = teamTimes.pass1;
            const p2 = teamTimes.pass2;
            const p3 = teamTimes.pass3;

            // Logic to pick best 2
            const allPasses = [
                p1 ? { ...p1, id: 1, total: p1.time + p1.penalty } : null,
                p2 ? { ...p2, id: 2, total: p2.time + p2.penalty } : null,
                p3 ? { ...p3, id: 3, total: p3.time + p3.penalty } : null
            ].filter(p => p !== null);

            const sortedPasses = [...allPasses].sort((a, b) => {
                if (b.cows !== a.cows) return b.cows - a.cows;
                return a.total - b.total;
            });

            const bestTwo = sortedPasses.slice(0, 2);
            const totalCows = bestTwo.reduce((acc, p) => acc + p.cows, 0);
            const totalTime = bestTwo.reduce((acc, p) => acc + p.total, 0);
            const usedPasses = bestTwo.map(p => p.id).sort().join(', ');

            return {
                Numero: team.number,
                Nombre: team.name,
                'Pasada 1 - Vacas': p1?.cows || 0,
                'Pasada 1 - Tiempo': p1 ? formatTime(p1.time + p1.penalty) : '00:00',
                'Pasada 2 - Vacas': p2?.cows || 0,
                'Pasada 2 - Tiempo': p2 ? formatTime(p2.time + p2.penalty) : '00:00',
                'Pasada 3 - Vacas': p3?.cows || 0,
                'Pasada 3 - Tiempo': p3 ? formatTime(p3.time + p3.penalty) : '00:00',
                'Pasadas Contabilizadas': usedPasses,
                'Total Vacas (2 mejores)': totalCows,
                'Total Tiempo (2 mejores)': formatTime(totalTime)
            };
        });
    };

    const downloadJSON = () => {
        const data = getExportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aparte-campero-resultados-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const downloadCSV = () => {
        const data = getExportData();
        if (data.length === 0) return;

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aparte-campero-resultados-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-secondary-500/10 rounded-xl text-secondary-500">
                    <Download className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-secondary-900 dark:text-white">Exportar Datos</h2>
                    <p className="text-secondary-500 dark:text-secondary-400">Descargar registros completos</p>
                </div>
            </div>

            <Card className="text-center py-16">
                <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Download className="w-10 h-10 text-secondary-400" />
                    </div>

                    <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-3">
                        Descargar Resultados
                    </h3>

                    <p className="text-secondary-500 dark:text-secondary-400 mb-8">
                        Obtén un archivo con todos los tiempos, equipos y resultados finales para su análisis o respaldo.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button onClick={downloadJSON} variant="primary" className="flex items-center justify-center gap-2 py-4">
                            <FileJson className="w-5 h-5" />
                            Formato JSON
                        </Button>
                        <Button onClick={downloadCSV} variant="success" className="flex items-center justify-center gap-2 py-4">
                            <FileSpreadsheet className="w-5 h-5" />
                            Formato CSV
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
