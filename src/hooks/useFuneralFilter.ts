import { useState, useEffect } from "react";

interface FuneralData {
  nome: string;
  sala: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  local_sepultamento: string;
}

export const useFuneralFilter = (funerals: FuneralData[]) => {
  const [activeFunerals, setActiveFunerals] = useState<FuneralData[]>([]);
  const [expiredCount, setExpiredCount] = useState(0);

  const filterActiveFunerals = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    const currentDate = now.toLocaleDateString('pt-BR'); // DD/MM/YYYY format

    const filtered = funerals.filter(funeral => {
      // Only show funerals for today
      if (funeral.data !== currentDate) return false;
      
      // Show funerals that haven't ended yet
      return funeral.hora_fim >= currentTime;
    });

    // Sort by start time to show earliest first
    const sorted = filtered.sort((a, b) => {
      return a.hora_inicio.localeCompare(b.hora_inicio);
    });

    setActiveFunerals(sorted);
    setExpiredCount(funerals.length - sorted.length);
  };

  // Filter on mount and when funerals change
  useEffect(() => {
    filterActiveFunerals();
  }, [funerals]);

  // Update every minute to check for expired funerals
  useEffect(() => {
    const interval = setInterval(filterActiveFunerals, 60000); // Every minute
    return () => clearInterval(interval);
  }, [funerals]);

  return { activeFunerals, expiredCount };
};