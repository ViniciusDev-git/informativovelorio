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
    
    // Padronizar o formato da data para YYYY-MM-DD
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const currentDateFormatted = `${year}-${month}-${day}`;

    const filtered = funerals.filter(funeral => {
      // Comparar com a data formatada e incluir hora_inicio
      const funeralStartDateTime = `${funeral.data}T${funeral.hora_inicio}:00`;
      const funeralEndDateTime = `${funeral.data}T${funeral.hora_fim}:00`;

      const start = new Date(funeralStartDateTime);
      const end = new Date(funeralEndDateTime);

      // Verifica se o velório é para o dia atual E se a hora atual está entre a hora de início e fim
      return funeral.data === currentDateFormatted && now >= start && now <= end;
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