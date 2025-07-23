import { useState, useEffect } from "react";
import { FuneralList } from "./FuneralList";
import { TVSection } from "./TVSection";
import { useFuneralFilter } from "../hooks/useFuneralFilter";

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

// Mock data for demonstration
const mockFunerals: FuneralData[] = [
  {
    nome: "Francisco Inerdacis",
    sala: "SALA C",
    data: "2025-07-23",
    hora_inicio: "07:00",
    hora_fim: "10:00",
    local_sepultamento: "Cemitério Araçá"
  },
  {
    nome: "Maria Santos Silva",
    sala: "SALA A",
    data: "2025-07-23",
    hora_inicio: "09:00",
    hora_fim: "12:00",
    local_sepultamento: "Cemitério da Consolação"
  },
  {
    nome: "João da Silva",
    sala: "SALA B",
    data: "2025-07-23",
    hora_inicio: "14:00",
    hora_fim: "17:00",
    local_sepultamento: "Cemitério São Paulo"
  },
  {
    nome: "Ana Costa Lima",
    sala: "SALA D",
    data: "2025-07-23",
    hora_inicio: "16:00",
    hora_fim: "19:00",
    local_sepultamento: "Cemitério Quarta Parada"
  },
  {
    nome: "Carlos Eduardo",
    sala: "SALA E",
    data: "2025-07-23",
    hora_inicio: "08:00",
    hora_fim: "11:00",
    local_sepultamento: "Cemitério Vila Alpina"
  },
  {
    nome: "Rosa Maria",
    sala: "SALA F",
    data: "2025-07-23",
    hora_inicio: "13:00",
    hora_fim: "16:00",
    local_sepultamento: "Cemitério Padre Miguel"
  },
  {
    nome: "Antonio Fernandes",
    sala: "SALA G",
    data: "2025-07-23",
    hora_inicio: "15:00",
    hora_fim: "18:00",
    local_sepultamento: "Cemitério Vila Formosa"
  }
];

export const DigitalSignage = ({ 
  videoUrl = "/videos/video3.mp4",
  sheetsUrl 
}: DigitalSignageProps) => {
  const [funerals, setFunerals] = useState<FuneralData[]>(mockFunerals);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { activeFunerals, expiredCount } = useFuneralFilter(funerals);

  // Simulate data fetching from Google Sheets
  useEffect(() => {
    const fetchFuneralData = async () => {
      try {
        // Here you would implement the Google Sheets API integration
        // For now, we're using mock data
        console.log("Fetching funeral data from:", sheetsUrl || "mock data");
        
        // Update timestamp
        setLastUpdate(new Date());
      } catch (error) {
        console.error("Error fetching funeral data:", error);
      }
    };

    // Initial fetch
    fetchFuneralData();

    // Set up interval for real-time updates (every 2 minutes)
    const interval = setInterval(fetchFuneralData, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [sheetsUrl]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-animated">
      {/* Layout Responsivo Universal */}
      <div className="relative w-full h-screen p-[2vw] flex flex-col">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-[2vh]">
          <h1 className="text-white font-lato font-black text-[clamp(2rem,4vw,6rem)] leading-tight">
            Informativo de Velórios
          </h1>
          <img 
            src="/images/logo-cortel-branco.svg"
            alt="Cortel São Paulo"
            className="w-[clamp(200px,20vw,400px)] h-auto object-contain"
          />
        </div>

        {/* Main Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-[2vw] min-h-0">
          {/* Funeral Cards Section */}
          <div className="flex flex-col">
            <FuneralList funerals={activeFunerals} />
          </div>

          {/* Video Section */}
          <div className="flex flex-col">
            <div 
              className="flex-1 rounded-[clamp(1rem,3vw,4rem)] overflow-hidden min-h-[40vh]"
              style={{ backgroundColor: '#dadfea' }}
            >
              <TVSection videoUrl={videoUrl} />
            </div>
            
            {/* TV Cortel Footer */}
            <div className="flex flex-col items-center justify-center mt-[1vh] space-y-[0.5vh]">
              <h2 className="text-white font-lato font-black text-[clamp(1rem,2vw,3rem)]">
                TV CORTEL
              </h2>
              <img 
                src="/images/logo-parceiros.svg"
                alt="Parceiros"
                className="w-[clamp(200px,25vw,500px)] h-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-[1vh]">
          <p className="text-white/70 text-[clamp(0.75rem,1.2vw,1.5rem)]">
            Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
};