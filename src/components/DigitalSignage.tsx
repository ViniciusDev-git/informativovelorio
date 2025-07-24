// (sem alteração, pois não há manipulação direta do vídeo aqui)
import { useState, useEffect } from "react";
import { FuneralList } from "./FuneralList";
import { TVSection } from "./TVSection";

interface FuneralData {
  nome: string;
  sala: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  local_sepultamento: string;
}

interface DigitalSignageProps {
  videoUrl?: string;
  sheetsUrl?: string;
}

const mockFunerals: FuneralData[] = [
  // ... (dados mock)
];

const useFuneralFilter = (funerals: FuneralData[]) => {
  const [activeFunerals, setActiveFunerals] = useState<FuneralData[]>([]);
  const [expiredCount, setExpiredCount] = useState(0);

  const filterActiveFunerals = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const currentDateFormatted = `${year}-${month}-${day}`;

    const filtered = funerals.filter(funeral => {
      const funeralStartDateTime = `${funeral.data}T${funeral.hora_inicio}:00`;
      const funeralEndDateTime = `${funeral.data}T${funeral.hora_fim}:00`;

      const start = new Date(funeralStartDateTime);
      const end = new Date(funeralEndDateTime);

      return funeral.data === currentDateFormatted && now >= start && now <= end;
    });

    const sorted = filtered.sort((a, b) => {
      return a.hora_inicio.localeCompare(b.hora_inicio);
    });

    setActiveFunerals(sorted);
    setExpiredCount(funerals.length - sorted.length);
  };

  useEffect(() => {
    filterActiveFunerals();
  }, [funerals]);

  useEffect(() => {
    const interval = setInterval(filterActiveFunerals, 60000);
    return () => clearInterval(interval);
  }, [funerals]);

  return { activeFunerals, expiredCount };
};

export const DigitalSignage = ({ 
  videoUrl = "/videos/video3.mp4",
  sheetsUrl 
}: DigitalSignageProps) => {
  const [funerals, setFunerals] = useState<FuneralData[]>(mockFunerals);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { activeFunerals, expiredCount } = useFuneralFilter(funerals);

  useEffect(() => {
    const fetchFuneralData = async () => {
      try {
        console.log("Fetching funeral data from:", sheetsUrl || "mock data");
        setLastUpdate(new Date());
      } catch (error) {
        console.error("Error fetching funeral data:", error);
      }
    };

    fetchFuneralData();
    const interval = setInterval(fetchFuneralData, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [sheetsUrl]);

  return (
    <div 
      className="relative w-full min-h-screen overflow-hidden bg-gradient-animated"
    >
      {/* ... layout conforme original ... */}
    </div>
  );
};
