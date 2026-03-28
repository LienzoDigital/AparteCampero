"use client";

import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Timer, AlertCircle } from "lucide-react";

export default function RegisterTime() {
    const { teams, saveTime } = useData();
    const [selectedTeam, setSelectedTeam] = useState("");
    const [pass, setPass] = useState(1);
    const [cows, setCows] = useState(3);
    const [minutes, setMinutes] = useState("");
    const [seconds, setSeconds] = useState("");
    const [penalty, setPenalty] = useState(0);
    const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeam) {
            setMessage({ type: "error", text: "Seleccione un equipo" });
            return;
        }
        const totalSeconds = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
        saveTime(selectedTeam, pass, { cows, time: totalSeconds, penalty });
        setMessage({ type: "success", text: "Tiempo guardado" });
        setMinutes(""); setSeconds(""); setPenalty(0);
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-success/10 rounded-xl text-success"><Timer className="w-8 h-8" /></div>
                <div>
                    <h2 className="text-3xl font-bold text-secondary-900 dark:text-white">Registro Manual</h2>
                    <p className="text-secondary-500 dark:text-secondary-400">Carga de tiempos y penalizaciones</p>
                </div>
            </div>
            {message && <div className={`p-4 mb-6 rounded-xl flex items-center gap-3 ${message.type === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}><AlertCircle className="w-5 h-5" />{message.text}</div>}
            <Card>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 uppercase">Equipo</label>
                            <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} className="input-modern" required>
                                <option value="">Seleccionar equipo</option>
                                {teams.map((team) => <option key={team.id} value={team.id}>{team.category} - {team.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2 uppercase">Pasada</label>
                            <div className="flex bg-secondary-100 dark:bg-secondary-800 p-1 rounded-xl">
                                {[1, 2].map((p) => <button key={p} type="button" onClick={() => setPass(p)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${pass === p ? "bg-white dark:bg-secondary-600 text-primary-600 shadow-sm" : "text-secondary-500"}`}>Pasada {p}</button>)}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-3 uppercase">Vacas Encerradas</label>
                        <div className="grid grid-cols-4 gap-3">
                            {[0, 1, 2, 3].map((c) => <button key={c} type="button" onClick={() => setCows(c)} className={`py-3 rounded-xl text-xl font-bold transition-all border-2 ${cows === c ? "border-success bg-success/10 text-success" : "border-secondary-200 text-secondary-400"}`}>{c}</button>)}
                        </div>
                    </div>
                    <div className="p-6 bg-secondary-50 dark:bg-secondary-800/50 rounded-2xl border">
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div><label className="block text-xs font-semibold mb-1 uppercase">Minutos</label><input type="number" min="0" max="59" value={minutes} onChange={(e) => setMinutes(e.target.value)} className="input-modern text-center text-2xl font-mono" placeholder="00" /></div>
                            <div><label className="block text-xs font-semibold mb-1 uppercase">Segundos</label><input type="number" min="0" max="59" value={seconds} onChange={(e) => setSeconds(e.target.value)} className="input-modern text-center text-2xl font-mono" placeholder="00" /></div>
                        </div>
                        <div><label className="block text-xs font-semibold mb-2 uppercase">Penalizaciones</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {[5, 10, 15, 20].map((p) => <button key={p} type="button" onClick={() => setPenalty((prev) => prev + p)} className="px-4 py-2 rounded-lg bg-white dark:bg-secondary-700 border text-danger hover:bg-red-50 text-sm font-medium">+{p}s</button>)}
                                <button type="button" onClick={() => setPenalty(0)} className="px-4 py-2 rounded-lg bg-secondary-200 text-secondary-600 text-sm font-medium">Reset</button>
                            </div>
                            <div className="text-right font-bold text-danger">Total: {penalty}s</div>
                        </div>
                    </div>
                    <Button type="submit" className="w-full text-lg py-4">Guardar Tiempo</Button>
                </form>
            </Card>
        </div>
    );
}
