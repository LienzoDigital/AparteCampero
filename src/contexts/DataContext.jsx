import React, { createContext, useContext, useEffect, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
    const [teams, setTeams] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('camperoTeams')) || [];
        } catch {
            return [];
        }
    });

    const [times, setTimes] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('camperoTimes')) || {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem('camperoTeams', JSON.stringify(teams));
    }, [teams]);

    useEffect(() => {
        localStorage.setItem('camperoTimes', JSON.stringify(times));
    }, [times]);

    const addTeam = (team) => {
        setTeams(prev => {
            const nextNumber = prev.length > 0 
                ? Math.max(...prev.map(t => parseInt(t.number) || 0)) + 1 
                : 1;
            return [...prev, { ...team, number: nextNumber.toString(), id: Date.now().toString() }];
        });
    };

    const updateTeam = (id, updatedTeam) => {
        setTeams(prev => prev.map(t => t.id === id ? { ...t, ...updatedTeam } : t));
    };

    const deleteTeam = (id) => {
        setTeams(prev => prev.filter(t => t.id !== id));
        // Also cleanup times? Maybe keep them for history or cleanup manually.
    };

    const saveTime = (teamId, passNumber, data) => {
        setTimes(prev => ({
            ...prev,
            [teamId]: {
                ...prev[teamId],
                [`pass${passNumber}`]: {
                    ...data,
                    timestamp: new Date().toISOString()
                }
            }
        }));
    };

    const getTeamTimes = (teamId) => {
        return times[teamId] || {};
    };

    return (
        <DataContext.Provider value={{
            teams,
            addTeam,
            updateTeam,
            deleteTeam,
            times,
            saveTime,
            getTeamTimes
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    return useContext(DataContext);
}
