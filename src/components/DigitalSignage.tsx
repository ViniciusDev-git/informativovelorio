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

// Hook de filtro integrado
const useFuneralFilter = (funerals: FuneralData[]) => {
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
    <div 
      className="relative w-full min-h-screen overflow-hidden bg-gradient-animated"
    >
      {/* Subtle shimmer effect */}
      <div className="absolute inset-0 animate-shimmer-subtle pointer-events-none"></div>
      
      {/* TV 4K Layout (3840x2160) */}
      <div className="hidden 4k:block relative w-[3840px] h-[2160px] mx-auto scale-100">
        {/* Título Principal - TV 4K Position */}
        <div className="absolute top-[120px] left-[322px]">
          <h1 className="text-white font-lato font-black text-[148px] leading-none">
            Informativo de Velórios
          </h1>
        </div>

        {/* Logo Cortel - TV 4K Position */}
        <div className="absolute top-[74px] left-[2330px] w-[794px] h-[260px]">
          <img 
            src="/images/logo-cortel-branco.svg"
            alt="Cortel São Paulo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Funeral Cards Container - TV 4K */}
        <div className="absolute top-[380px] left-[161px] w-[1600px] h-[1404px]">
          <FuneralList funerals={activeFunerals} />
        </div>

        {/* Main Video Panel - TV 4K Position - AUMENTADO */}
        <div className="absolute top-[320px] left-[1880px] w-[1696px] h-[1524px]">
          <div 
            className="w-full h-full rounded-[130px] overflow-hidden"
          >
            <TVSection videoUrl={videoUrl} />
          </div>
        </div>

        {/* TV Cortel Footer Section - TV 4K Position - AJUSTADO */}
        <div className="absolute top-[1870px] left-[1880px] w-[1696px] flex flex-col items-center justify-center space-y-2">
          <h2 className="text-white font-lato font-black text-[56px]">
            TV CORTEL
          </h2>
          
          <img 
            src="/images/logo-parceiros.svg"
            alt="Parceiros"
            className="w-[1000px] h-[160px] object-contain"
          />
        </div>

        {/* Update indicator - TV 4K */}
        <div className="absolute bottom-[40px] left-[322px]">
          <p className="text-white/70 text-[28px]">
            Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
        </div>
      </div>
      
      {/* Desktop Layout (1920x1080) */}
      <div className="hidden xl:block 4k:hidden relative w-[1920px] h-[1080px] mx-auto">
        {/* Título Principal - Desktop Position */}
        <div className="absolute top-[60px] left-[161px]">
          <h1 className="text-white font-lato font-black text-[74px] leading-none">
            Informativo de Velórios
          </h1>
        </div>

        {/* Logo Cortel - Desktop Position */}
        <div className="absolute top-[37px] left-[1165px] w-[397px] h-[130px]">
          <img 
            src="/images/logo-cortel-branco.svg"
            alt="Cortel São Paulo"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Funeral Cards Container - Desktop */}
        <FuneralList funerals={activeFunerals} />

        {/* Main Video Panel - Desktop Position */}
        <div className="absolute top-[190px] left-[970px] w-[788px] h-[702px]">
          <div 
            className="w-full h-full rounded-[65px] overflow-hidden"
          >
            <TVSection videoUrl={videoUrl} />
          </div>
        </div>

        {/* TV Cortel Footer Section - Desktop Position */}
        <div className="absolute top-[905px] left-[970px] w-[788px] flex flex-col items-center justify-center space-y-1">
          <h2 className="text-white font-lato font-black text-[28px]">
            TV CORTEL
          </h2>
          
          <img 
            src="/images/logo-parceiros.svg"
            alt="Parceiros"
            className="w-[500px] h-[80px] object-contain"
          />
        </div>

        {/* Update indicator - Desktop */}
        <div className="absolute bottom-[20px] left-[161px]">
          <p className="text-white/70 text-sm">
            Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:block xl:hidden relative w-full h-screen p-6">
        {/* Header Section - Tablet */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white font-lato font-black text-4xl lg:text-5xl leading-tight">
            Informativo de<br />Velórios
          </h1>
          <img 
            src="/images/logo-cortel-branco.svg"
            alt="Cortel São Paulo"
            className="w-48 lg:w-60 h-auto object-contain"
          />
        </div>

        {/* Content Grid - Tablet */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Funeral Cards Section - Tablet */}
          <div className="order-2 lg:order-1">
            <div className="h-full relative">
              <FuneralList funerals={activeFunerals} />
            </div>
          </div>

          {/* Video Section - Tablet */}
          <div className="order-1 lg:order-2">
            <div 
              className="w-full h-full rounded-3xl overflow-hidden"
            >
              <TVSection videoUrl={videoUrl} />
            </div>
          </div>
        </div>

        {/* Footer - Tablet */}
        <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center">
          <p className="text-white/70 text-sm">
            Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
          <div className="flex items-center space-x-4">
            <h2 className="text-white font-lato font-black text-2xl">
              TV CORTEL
            </h2>
            <img 
              src="/images/logo-parceiros.svg"
              alt="Parceiros"
              className="w-32 h-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden relative w-full min-h-screen p-4">
        {/* Header Section - Mobile */}
        <div className="text-center mb-6">
          <img 
            src="/images/logo-cortel-branco.svg"
            alt="Cortel São Paulo"
            className="w-32 h-auto object-contain mx-auto mb-4"
          />
          <h1 className="text-white font-lato font-black text-2xl leading-tight">
            Informativo de Velórios
          </h1>
        </div>

        {/* Video Section - Mobile */}
        <div className="mb-6">
          <div 
            className="w-full aspect-video rounded-2xl overflow-hidden"
          >
            <TVSection videoUrl={videoUrl} />
          </div>
        </div>

        {/* Funeral Cards Section - Mobile */}
        <div className="mb-6">
          <FuneralList funerals={activeFunerals} />
        </div>

        {/* Footer - Mobile */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <h2 className="text-white font-lato font-black text-lg">
              TV CORTEL
            </h2>
            <img 
              src="/images/logo-parceiros.svg"
              alt="Parceiros"
              className="w-20 h-auto object-contain"
            />
          </div>
          <p className="text-white/70 text-xs">
            Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  );
};

