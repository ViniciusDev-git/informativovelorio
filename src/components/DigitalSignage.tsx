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

// Detecção robusta de Smart TV
const detectSmartTV = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // Verificações de User Agent para Smart TVs
  const tvUserAgents = [
    'smart-tv', 'smarttv', 'tv', 'webos', 'tizen', 
    'netcast', 'hbbtv', 'ce-html', 'opera tv'
  ];
  
  const isTVUserAgent = tvUserAgents.some(agent => userAgent.includes(agent));
  
  // Verificação de resolução (4K ou similar)
  const is4K = screenWidth >= 3840 || screenHeight >= 2160;
  
  // Verificação de proporção típica de TV
  const aspectRatio = screenWidth / screenHeight;
  const isTVAspectRatio = aspectRatio >= 1.7 && aspectRatio <= 1.8; // 16:9 aproximadamente
  
  return isTVUserAgent || (is4K && isTVAspectRatio);
};

export const DigitalSignage = ({ 
  videoUrl = "/videos/video3.mp4",
  sheetsUrl 
}: DigitalSignageProps) => {
  const [funerals, setFunerals] = useState<FuneralData[]>(mockFunerals);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { activeFunerals, expiredCount } = useFuneralFilter(funerals);
  
  // Detecção mais robusta de Smart TV
  const [isSmartTV, setIsSmartTV] = useState(false);
  const [screenInfo, setScreenInfo] = useState({
    width: 0,
    height: 0,
    ratio: 0
  });

  useEffect(() => {
    const updateScreenInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = width / height;
      
      setScreenInfo({ width, height, ratio });
      setIsSmartTV(detectSmartTV());
      
      // Log para debug
      console.log('Screen Detection:', {
        width,
        height,
        ratio: ratio.toFixed(2),
        userAgent: navigator.userAgent,
        isSmartTV: detectSmartTV()
      });
    };

    updateScreenInfo();
    window.addEventListener('resize', updateScreenInfo);
    
    return () => window.removeEventListener('resize', updateScreenInfo);
  }, []);

  // Simulate data fetching from Google Sheets
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
      {/* Subtle shimmer effect */}
      <div className="absolute inset-0 animate-shimmer-subtle pointer-events-none"></div>
      
      {/* Smart TV Layout (4K) - Versão Otimizada */}
      {isSmartTV && (
        <div className="relative w-full h-screen flex flex-col" style={{ minHeight: '2160px' }}>
          {/* Header Section - Smart TV */}
          <div className="flex justify-between items-start p-16 pt-20">
            <div className="flex-1">
              <h1 className="text-white font-lato font-black text-[148px] leading-none">
                Informativo de Velórios
              </h1>
            </div>
            <div className="w-[794px] h-[260px] ml-16">
              <img 
                src="/images/logo-cortel-branco.svg"
                alt="Cortel São Paulo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Content Section - Smart TV */}
          <div className="flex-1 flex px-16 gap-16">
            {/* Funeral Cards Container - Smart TV */}
            <div className="w-[1600px] flex-shrink-0">
              <FuneralList funerals={activeFunerals} />
            </div>

            {/* Main Video Panel - Smart TV */}
            <div className="flex-1 min-h-[1400px]">
              <div 
                className="w-full h-full rounded-[130px] overflow-hidden bg-black/10"
                style={{ minHeight: '1400px' }}
              >
                <TVSection videoUrl={videoUrl} />
              </div>
            </div>
          </div>

          {/* Footer Section - Smart TV */}
          <div className="px-16 pb-16">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/70 text-[28px]">
                  Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}
                </p>
                {/* Debug info para desenvolvimento */}
                {process.env.NODE_ENV === 'development' && (
                  <p className="text-white/50 text-[20px] mt-2">
                    Smart TV: {screenInfo.width}x{screenInfo.height} (Ratio: {screenInfo.ratio.toFixed(2)})
                  </p>
                )}
              </div>
              <div className="flex flex-col items-center space-y-2">
                <h2 className="text-white font-lato font-black text-[56px]">
                  TV CORTEL
                </h2>
                <img 
                  src="/images/logo-parceiros.svg"
                  alt="Parceiros"
                  className="w-[1000px] h-[160px] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Layout (1920x1080) - Para telas não-TV */}
      {!isSmartTV && (
        <div className="hidden xl:block relative w-[1920px] h-[1080px] mx-auto">
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
            <div className="w-full h-full rounded-[65px] overflow-hidden">
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
            {/* Debug info para desenvolvimento */}
            {process.env.NODE_ENV === 'development' && (
              <p className="text-white/50 text-xs mt-1">
                Desktop: {screenInfo.width}x{screenInfo.height}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tablet Layout */}
      <div className="hidden md:block xl:hidden relative w-full h-screen p-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          <div className="order-2 lg:order-1">
            <div className="h-full relative">
              <FuneralList funerals={activeFunerals} />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="w-full h-full rounded-3xl overflow-hidden">
              <TVSection videoUrl={videoUrl} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center">
          <p className="text-white/70 text-sm">
            Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}
          </p>
          <div className="flex items-center space-x-4">
            <h2 className="text-white font-lato font-black text-2xl">TV CORTEL</h2>
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

        <div className="mb-6">
          <div className="w-full aspect-video rounded-2xl overflow-hidden">
            <TVSection videoUrl={videoUrl} />
          </div>
        </div>

        <div className="mb-6">
          <FuneralList funerals={activeFunerals} />
        </div>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <h2 className="text-white font-lato font-black text-lg">TV CORTEL</h2>
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