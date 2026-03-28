"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Team, Times } from "@/lib/types";

interface SaveTimeData {
  time: number;
  penalty: number;
  cows?: number;
}

interface DataContextType {
  teams: Team[];
  addTeam: (team: Omit<Team, "id">) => void;
  updateTeam: (id: string, updatedTeam: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  times: Times;
  saveTime: (teamId: string, passNumber: number, data: SaveTimeData) => void;
  getTeamTimes: (teamId: string) => Times[string];
  resetAll: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [times, setTimes] = useState<Times>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedTeams = localStorage.getItem("camperoTeams");
      const savedTimes = localStorage.getItem("camperoTimes");
      if (savedTeams) setTeams(JSON.parse(savedTeams));
      if (savedTimes) setTimes(JSON.parse(savedTimes));
    } catch (e) {
      console.error("Error loading data:", e);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("camperoTeams", JSON.stringify(teams));
    }
  }, [teams, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("camperoTimes", JSON.stringify(times));
    }
  }, [times, mounted]);

  const addTeam = (team: Omit<Team, "id">) => {
    setTeams((prev) => [...prev, { ...team, id: Date.now().toString() }]);
  };

  const updateTeam = (id: string, updatedTeam: Partial<Team>) => {
    setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedTeam } : t)));
  };

  const deleteTeam = (id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
  };

  const saveTime = (teamId: string, passNumber: number, data: SaveTimeData) => {
    setTimes((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [`pass${passNumber}`]: {
          ...data,
          total: data.time + data.penalty,
          timestamp: new Date().toISOString(),
        },
      },
    }));
  };

  const getTeamTimes = (teamId: string) => {
    return times[teamId] || {};
  };

  const resetAll = () => {
    setTeams([]);
    setTimes({});
    localStorage.removeItem("camperoTeams");
    localStorage.removeItem("camperoTimes");
  };

  return (
    <DataContext.Provider
      value={{
        teams,
        addTeam,
        updateTeam,
        deleteTeam,
        times,
        saveTime,
        getTeamTimes,
        resetAll,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
