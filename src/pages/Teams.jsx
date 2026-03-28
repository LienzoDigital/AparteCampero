import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Trash2, Edit2, Users, Plus } from 'lucide-react';

export default function Teams() {
    const { teams, addTeam, updateTeam, deleteTeam } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [currentTeam, setCurrentTeam] = useState({ id: '', name: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            updateTeam(currentTeam.id, { name: currentTeam.name });
            setIsEditing(false);
        } else {
            addTeam({ name: currentTeam.name });
        }
        setCurrentTeam({ id: '', name: '' });
    };

    const handleEdit = (team) => {
        setCurrentTeam({ id: team.id, name: team.name });
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar este equipo?')) {
            deleteTeam(id);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentTeam({ id: '', name: '' });
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary-600/10 rounded-xl text-primary-600">
                    <Users className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-secondary-900 dark:text-white">Equipos</h2>
                    <p className="text-secondary-500 dark:text-secondary-400">Gestión de participantes</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <h3 className="text-lg font-bold mb-6 text-secondary-900 dark:text-white flex items-center gap-2">
                            {isEditing ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            {isEditing ? 'Editar Equipo' : 'Nuevo Equipo'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-secondary-500 uppercase mb-1">
                                    Nombre del Equipo
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={currentTeam.name}
                                    onChange={(e) => setCurrentTeam({ ...currentTeam, name: e.target.value })}
                                    className="input-modern"
                                    placeholder="Nombre..."
                                />
                            </div>

                            <div className="pt-2 flex gap-2">
                                <Button type="submit" className="flex-1">
                                    {isEditing ? 'Actualizar' : 'Agregar'}
                                </Button>
                                {isEditing && (
                                    <Button type="button" variant="ghost" onClick={handleCancel}>
                                        Cancelar
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {teams.map((team, idx) => (
                            <Card key={team.id} className="group hover:border-primary-200 dark:hover:border-primary-800 transition-all">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-xs font-bold text-secondary-400 uppercase mb-1">Equipo {idx + 1}</div>
                                        <div className="text-lg font-bold text-secondary-900 dark:text-white">{team.name}</div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(team)}
                                            className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(team.id)}
                                            className="p-2 text-danger hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        {teams.length === 0 && (
                            <div className="col-span-full text-center py-12 text-secondary-500 bg-secondary-50 dark:bg-secondary-800/50 rounded-2xl border border-dashed border-secondary-200 dark:border-secondary-700">
                                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No hay equipos registrados.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
