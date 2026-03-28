"use client";

import { useData } from "@/contexts/DataContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatTimeDisplay } from "@/lib/utils";
import { Download, FileJson, FileSpreadsheet } from "lucide-react";

export default function ExportData() {
    const { teams, times } = useData();

    const getExportData = () => teams.map((team) => {
        const t = times[team.id] || {};
        const p1 = t.pass1 as { time: number; penalty: number; cows: number } | undefined;
        const p2 = t.pass2 as { time: number; penalty: number; cows: number } | undefined;
        return { Numero: team.category, Nombre: team.name, "Pasada 1 - Vacas": p1?.cows || 0, "Pasada 1 - Tiempo": p1 ? formatTimeDisplay((p1.time + p1.penalty) * 1000) : "00:00", "Pasada 2 - Vacas": p2?.cows || 0, "Pasada 2 - Tiempo": p2 ? formatTimeDisplay((p2.time + p2.penalty) * 1000) : "00:00", "Total Vacas": (p1?.cows || 0) + (p2?.cows || 0), "Total Tiempo": formatTimeDisplay(((p1 ? p1.time + p1.penalty : 0) + (p2 ? p2.time + p2.penalty : 0)) * 1000) };
    });

    const downloadJSON = () => {
        const data = getExportData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `aparte-campero-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
    };

    const downloadCSV = () => {
        const data = getExportData();
        if (!data.length) return;
        const headers = Object.keys(data[0]);
        const csv = [headers.join(","), ...data.map(r => headers.map(h => JSON.stringify(r[h as keyof typeof r])).join(","))].join("\n");
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        a.download = `aparte-campero-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-secondary-500/10 rounded-xl text-secondary-500"><Download className="w-8 h-8" /></div>
                <div><h2 className="text-3xl font-bold text-secondary-900 dark:text-white">Exportar Datos</h2><p className="text-secondary-500 dark:text-secondary-400">Descargar registros completos</p></div>
            </div>
            <Card className="text-center py-16">
                <div className="max-w-md mx-auto">
                    <div className="w-20 h-20 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-6"><Download className="w-10 h-10 text-secondary-400" /></div>
                    <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-3">Descargar Resultados</h3>
                    <p className="text-secondary-500 dark:text-secondary-400 mb-8">Obtén un archivo con todos los tiempos, equipos y resultados finales.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Button onClick={downloadJSON} variant="primary" className="flex items-center justify-center gap-2 py-4"><FileJson className="w-5 h-5" />Formato JSON</Button>
                        <Button onClick={downloadCSV} variant="success" className="flex items-center justify-center gap-2 py-4"><FileSpreadsheet className="w-5 h-5" />Formato CSV</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
