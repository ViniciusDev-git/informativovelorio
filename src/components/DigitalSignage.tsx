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

// Mock data for demonstration
const mockFunerals: FuneralData[] = [
  {
    nome: "Francisco Inerdacis",
    sala: "SALA C",
    data: "2025-07-24",
    hora_inicio: "07:00",
    hora_fim: "00:00",
    local_sepultamento: "Cemitério Araçá"
  },
  {
    nome: "Maria Santos Silva",
    sala: "SALA A",
    data: "2025-07-24",
    hora_inicio: "07:00",
    hora_fim: "00:00",
    local_sepultamento: "Cemitério da Consolação"
  },
  {
    nome: "João da Silva",
    sala: "SALA B",
    data: "2025-07-24",
    hora_inicio: "07:00",
    hora_fim: "00:00",
    local_sepultamento: "Cemitério São Paulo"
  },
  {
    nome: "Ana Costa Lima",
    sala: "SALA D",
    data: "2025-07-24",
    hora_inicio: "07:00",
    hora_fim: "00:00",
    local_sepultamento: "Cemitério Quarta Parada"
  },
  {
    nome: "Carlos Eduardo",
    sala: "SALA E",
    data: "2025-07-24",
    hora_inicio: "07:00",
    hora_fim: "00:00",
    local_sepultamento: "Cemitério Vila Alpina"
  },
  {
    nome: "Rosa Maria",
    sala: "SALA F",
    data: "2025-07-24",
    hora_inicio: "07:00",
    hora_fim: "00:00",
    local_sepultamento: "Cemitério Padre Miguel"
  },
  {
    nome: "Antonio Fernandes",
    sala: "SALA G",
    data: "2025-07-24",
    hora_inicio: "07:00",
    hora_fim: "00:00",
    local_sepultamento: "Cemitério Vila Formosa"
  }
];

// Hook de filtro integrado
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8 space-y-4 lg:space-y-0">
          <h1 className="text-white font-lato font-black text-3xl lg:text-5xl xl:text-6xl leading-tight text-center lg:text-left">
            Informativo de Velórios
          </h1>
          <img 
            src="/images/logo-cortel-branco.svg"
            alt="Cortel São Paulo"
            className="w-48 lg:w-60 xl:w-80 h-auto object-contain"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Funeral Cards Section */}
          <div className="order-2 xl:order-1">
            <FuneralList funerals={activeFunerals} />
          </div>

          {/* Video Section */}
          <div className="order-1 xl:order-2">
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
              <TVSection videoUrl={videoUrl} />
            </div>
            
            {/* TV Cortel Footer */}
            <div className="mt-6 text-center">
              <h2 className="text-white font-lato font-black text-2xl lg:text-3xl mb-4">
                TV CORTEL
              </h2>
              <img 
                src="/images/logo-parceiros.svg"
                alt="Parceiros"
                className="w-full max-w-md h-auto object-contain mx-auto"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center lg:text-left">
          <p className="text-white/70 text-sm lg:text-base">
            Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
};
