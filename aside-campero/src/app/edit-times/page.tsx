"use client";

import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatTimeDisplay } from "@/lib/utils";
import { Edit2, Save, X, Clock } from "lucide-react";

export default function EditTimes() {
    const { teams, times, saveTime } = useData();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<{ teamId: string; pass: number; cows: number; minutes: number; seconds: number; penalty: number } | null>(null);

    const handleEdit = (teamId: string, pass: number, data: { time: number; penalty: number; cows: number }) => {
        setEditingId(`${teamId}-${pass}`);
        setEditData({ teamId, pass, cows: data.cows, minutes: Math.floor(data.time / 60), seconds: data.time % 60, penalty: data.penalty });
    };

    const handleSave = () => {
        if (!editData) return;
        saveTime(editData.teamId, editData.pass, { cows: editData.cows, time: editData.minutes * 60 + editData.seconds, penalty: editData.penalty });
        setEditingId(null);
        setEditData(null);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-warning/10 rounded-xl text-warning"><Edit2 className="w-8 h-8" /></div>
                <div><h2 className="text-3xl font-bold text-secondary-900 dark:text-white">Editar Tiempos</h2><p className="text-secondary-500 dark:text-secondary-400">Corregir registros existentes</p></div>
            </div>
            <div className="space-y-6">
                {teams.map((team) => {
                    const teamTimes = times[team.id] || {};
                    const hasTimes = teamTimes.pass1 || teamTimes.pass2;
                    if (!hasTimes) return null;
                    return (
                        <Card key={team.id} className="overflow-hidden">
                            <div className="border-b pb-4 mb-4"><h3 className="text-xl font-bold text-secondary-900 dark:text-white"><span className="text-secondary-400 mr-2">#{team.category}</span>{team.name}</h3></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2].map((pass) => {
                                    const passData = teamTimes[`pass${pass}`] as { time: number; penalty: number; cows: number } | undefined;
                                    const isEditingThis = editingId === `${team.id}-${pass}`;
                                    if (!passData && !isEditingThis) return <div key={pass} className="p-6 rounded-xl bg-secondary-50 dark:bg-secondary-800/50 border border-dashed text-center text-secondary-400 flex flex-col items-center justify-center min-h-[160px]"><Clock className="w-8 h-8 mb-2 opacity-50" />Pasada {pass}: Sin tiempo</div>;
                                    if (isEditingThis && editData) return (
                                        <div key={pass} className="p-6 rounded-xl bg-primary-50 dark:bg-primary-900/10 border border-primary-200 ring-2 ring-primary-500/20">
                                            <div className="flex justify-between items-center mb-4"><h4 className="font-bold text-primary-700 dark:text-primary-400">Editando Pasada {pass}</h4></div>
                                            <div className="space-y-4">
                                                <div><label className="block text-xs font-bold text-secondary-500 uppercase mb-1">Vacas</label><div className="flex gap-1">{[0, 1, 2, 3].map((c) => <button key={c} onClick={() => setEditData({ ...editData, cows: c })} className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-colors ${editData.cows === c ? "bg-success text-white" : "bg-white dark:bg-secondary-800 border text-secondary-600"}`}>{c}</button>)}</div></div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div><label className="block text-xs font-bold uppercase mb-1">Min</label><input type="number" value={editData.minutes} onChange={(e) => setEditData({ ...editData, minutes: parseInt(e.target.value) || 0 })} className="input-modern py-1 text-center" /></div>
                                                    <div><label className="block text-xs font-bold uppercase mb-1">Seg</label><input type="number" value={editData.seconds} onChange={(e) => setEditData({ ...editData, seconds: parseInt(e.target.value) || 0 })} className="input-modern py-1 text-center" /></div>
                                                </div>
                                                <div><label className="block text-xs font-bold uppercase mb-1">Penalización</label><input type="number" value={editData.penalty} onChange={(e) => setEditData({ ...editData, penalty: parseInt(e.target.value) || 0 })} className="input-modern py-1" /></div>
                                                <div className="flex gap-2 pt-2"><Button size="sm" onClick={handleSave} className="flex-1"><Save className="w-4 h-4 mr-1" /> Guardar</Button><Button size="sm" variant="ghost" onClick={() => { setEditingId(null); setEditData(null); }} className="flex-1"><X className="w-4 h-4 mr-1" /> Cancelar</Button></div>
                                            </div>
                                        </div>
                                    );
                                    return (
                                        <div key={pass} className="group relative p-6 rounded-xl bg-secondary-50 dark:bg-secondary-800/50 border hover:border-primary-200 transition-all">
                                            <div className="flex justify-between items-start mb-4"><h4 className="font-bold">Pasada {pass}</h4><button onClick={() => handleEdit(team.id, pass, passData!)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"><Edit2 className="w-4 h-4" /></button></div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between"><span className="text-sm text-secondary-500">Vacas</span><span className="font-bold">{passData!.cows}</span></div>
                                                <div className="flex justify-between"><span className="text-sm text-secondary-500">Tiempo</span><span className="font-mono">{formatTimeDisplay(passData!.time * 1000)}</span></div>
                                                <div className="flex justify-between"><span className="text-sm text-secondary-500">Penalización</span><span className="font-bold text-danger">+{passData!.penalty}s</span></div>
                                                <div className="pt-2 mt-2 border-t flex justify-between"><span className="font-bold">Total</span><span className="font-mono font-bold text-primary-600">{formatTimeDisplay((passData!.time + passData!.penalty) * 1000)}</span></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    );
                })}
                {teams.length === 0 && <div className="text-center py-12 text-secondary-500"><p>No hay equipos registrados.</p></div>}
            </div>
        </div>
    );
}
