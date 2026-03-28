"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, Trash2, X } from "lucide-react";

export default function NewEvent() {
    const router = useRouter();

    const handleReset = () => {
        localStorage.removeItem("camperoTeams");
        localStorage.removeItem("camperoTimes");
        router.push("/");
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <Card className="text-center p-8 border-danger/20 shadow-red-500/10">
                <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6"><AlertTriangle className="w-10 h-10 text-danger" /></div>
                <h2 className="text-2xl font-bold mb-3 text-secondary-900 dark:text-white">¿Iniciar Nuevo Evento?</h2>
                <p className="text-secondary-500 dark:text-secondary-400 mb-8 leading-relaxed">
                    Esta acción eliminará todos los equipos y tiempos registrados de forma permanente.
                    <br /><span className="font-bold text-danger mt-2 block">¡No se puede deshacer!</span>
                </p>
                <div className="flex flex-col gap-3">
                    <Button variant="danger" onClick={handleReset} className="w-full py-4 shadow-red-500/20"><Trash2 className="w-5 h-5 mr-2" />Sí, eliminar todo</Button>
                    <Button variant="ghost" onClick={() => router.push("/")} className="w-full"><X className="w-5 h-5 mr-2" />Cancelar</Button>
                </div>
            </Card>
        </div>
    );
}
