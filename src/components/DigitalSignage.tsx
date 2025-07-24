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
    hora_fim: "10:00",
    local_sepultamento: "Cemitério Araçá"
  },
  {
    nome: "Maria Santos Silva",
    sala: "SALA A",
    data: "2025-07-24",
    hora_inicio: "09:00",
    hora_fim: "12:00",
    local_sepultamento: "Cemitério da Consolação"
  },
  {
    nome: "João da Silva",
    sala: "SALA B",
    data: "2025-07-24",
    hora_inicio: "14:00",
    hora_fim: "17:00",
    local_sepultamento: "Cemitério São Paulo"
  },
  {
    nome: "Ana Costa Lima",
    sala: "SALA D",
    data: "2025-07-24",
    hora_inicio: "16:00",
    hora_fim: "19:00",
    local_sepultamento: "Cemitério Quarta Parada"
  },
  {
    nome: "Carlos Eduardo",
    sala: "SALA E",
    data: "2025-07-24",
    hora_inicio: "08:00",
    hora_fim: "11:00",
    local_sepultamento: "Cemitério Vila Alpina"
  },
  {
    nome: "Rosa Maria",
    sala: "SALA F",
    data: "2025-07-24",
    hora_inicio: "13:00",
    hora_fim: "16:00",
    local_sepultamento: "Cemitério Padre Miguel"
  },
  {
    nome: "Antonio Fernandes",
    sala: "SALA G",
    data: "2025-07-24",
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
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      
      {/* ========== TV 8K Layout (7680x4320) ========== */}
      <div className="hidden 8k:block relative w-[7680px] h-[4320px] mx-auto scale-100">
        {/* Header */}
        <div className="absolute top-[240px] left-[644px]">
          <h1 className="text-white font-lato font-black text-[296px] leading-none">
            Informativo de Velórios
          </h1>
        </div>
        <div className="absolute top-[148px] left-[4660px] w-[1588px] h-[520px]">
          <img src="/images/logo-cortel-branco.svg" alt="Cortel São Paulo" className="w-full h-full object-contain" />
        </div>

        {/* Content */}
        <div className="absolute top-[760px] left-[322px] w-[3200px] h-[2808px]">
          <FuneralList funerals={activeFunerals} />
        </div>
        <div className="absolute top-[640px] left-[3760px] w-[3392px] h-[3048px]">
          <div className="w-full h-full rounded-[64px] overflow-hidden bg-black">
            <TVSection videoUrl={videoUrl} />
          </div>
        </div>

        {/* Footer */}
        <div className="absolute top-[3740px] left-[3760px] w-[3392px] flex flex-col items-center justify-center space-y-4">
          <h2 className="text-white font-lato font-black text-[112px]">TV CORTEL</h2>
          <img src="/images/logo-parceiros.svg" alt="Parceiros" className="w-[2000px] h-[320px] object-contain" />
        </div>
        <div className="absolute bottom-[80px] left-[644px]">
          <p className="text-white/70 text-[56px]">Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}</p>
        </div>
      </div>

      {/* ========== TV 4K Layout (3840x2160) ========== */}
      <div className="hidden 4k:block 8k:hidden relative w-[3840px] h-[2160px] mx-auto scale-100">
        {/* Header */}
        <div className="absolute top-[120px] left-[322px]">
          <h1 className="text-white font-lato font-black text-[148px] leading-none">
            Informativo de Velórios
          </h1>
        </div>
        <div className="absolute top-[74px] left-[2330px] w-[794px] h-[260px]">
          <img src="/images/logo-cortel-branco.svg" alt="Cortel São Paulo" className="w-full h-full object-contain" />
        </div>

        {/* Content */}
        <div className="absolute top-[380px] left-[161px] w-[1600px] h-[1404px]">
          <FuneralList funerals={activeFunerals} />
        </div>
        <div className="absolute top-[320px] left-[1880px] w-[1696px] h-[1524px]">
          <div className="w-full h-full rounded-[32px] overflow-hidden bg-black">
            <TVSection videoUrl={videoUrl} />
          </div>
        </div>

        {/* Footer */}
        <div className="absolute top-[1870px] left-[1880px] w-[1696px] flex flex-col items-center justify-center space-y-2">
          <h2 className="text-white font-lato font-black text-[56px]">TV CORTEL</h2>
          <img src="/images/logo-parceiros.svg" alt="Parceiros" className="w-[1000px] h-[160px] object-contain" />
        </div>
        <div className="absolute bottom-[40px] left-[322px]">
          <p className="text-white/70 text-[28px]">Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}</p>
        </div>
      </div>

      {/* ========== Large Desktop Layout (2560x1440) ========== */}
      <div className="hidden 2xl:block 4k:hidden relative w-[2560px] h-[1440px] mx-auto">
        {/* Header */}
        <div className="absolute top-[80px] left-[120px]">
          <h1 className="text-white font-lato font-black text-[96px] leading-none">
            Informativo de Velórios
          </h1>
        </div>
        <div className="absolute top-[50px] left-[1600px] w-[520px] h-[170px]">
          <img src="/images/logo-cortel-branco.svg" alt="Cortel São Paulo" className="w-full h-full object-contain" />
        </div>

        {/* Content */}
        <div className="absolute top-[250px] left-[120px] w-[800px] h-[1000px]">
          <FuneralList funerals={activeFunerals} />
        </div>
        <div className="absolute top-[250px] left-[1000px] w-[1400px] h-[900px]">
          <div className="w-full h-full rounded-[24px] overflow-hidden bg-black">
            <TVSection videoUrl={videoUrl} />
          </div>
        </div>

        {/* Footer */}
        <div className="absolute top-[1200px] left-[1000px] w-[1400px] flex flex-col items-center justify-center space-y-3">
          <h2 className="text-white font-lato font-black text-[40px]">TV CORTEL</h2>
          <img src="/images/logo-parceiros.svg" alt="Parceiros" className="w-[700px] h-[110px] object-contain" />
        </div>
        <div className="absolute bottom-[30px] left-[120px]">
          <p className="text-white/70 text-[18px]">Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}</p>
        </div>
      </div>

      {/* ========== Desktop Layout (1920x1080) ========== */}
      <div className="hidden xl:block 2xl:hidden relative w-[1920px] h-[1080px] mx-auto">
        {/* Header */}
        <div className="absolute top-[60px] left-[80px]">
          <h1 className="text-white font-lato font-black text-[64px] leading-none">
            Informativo de Velórios
          </h1>
        </div>
        <div className="absolute top-[40px] left-[1200px] w-[350px] h-[115px]">
          <img src="/images/logo-cortel-branco.svg" alt="Cortel São Paulo" className="w-full h-full object-contain" />
        </div>

        {/* Content */}
        <div className="absolute top-[180px] left-[80px] w-[600px] h-[750px]">
          <FuneralList funerals={activeFunerals} />
        </div>
        <div className="absolute top-[180px] left-[740px] w-[1100px] h-[650px]">
          <div className="w-full h-full rounded-[20px] overflow-hidden bg-black">
            <TVSection videoUrl={videoUrl} />
          </div>
        </div>

        {/* Footer */}
        <div className="absolute top-[870px] left-[740px] w-[1100px] flex flex-col items-center justify-center space-y-2">
          <h2 className="text-white font-lato font-black text-[32px]">TV CORTEL</h2>
          <img src="/images/logo-parceiros.svg" alt="Parceiros" className="w-[550px] h-[88px] object-contain" />
        </div>
        <div className="absolute bottom-[20px] left-[80px]">
          <p className="text-white/70 text-[16px]">Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}</p>
        </div>
      </div>

      {/* ========== Laptop Layout (1366x768) ========== */}
      <div className="hidden lg:block xl:hidden relative w-full h-screen p-6">
        <div className="max-w-[1300px] mx-auto h-full">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-white font-lato font-black text-4xl leading-tight">
              Informativo de<br />Velórios
            </h1>
            <img src="/images/logo-cortel-branco.svg" alt="Cortel São Paulo" className="w-48 h-auto object-contain" />
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-2 gap-6 h-[calc(100vh-180px)]">
            <div className="h-full">
              <FuneralList funerals={activeFunerals} />
            </div>
            <div className="flex flex-col h-full">
              <div className="flex-1 rounded-lg overflow-hidden bg-black mb-4">
                <TVSection videoUrl={videoUrl} />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-white font-lato font-black text-2xl">TV CORTEL</h2>
                <img src="/images/logo-parceiros.svg" alt="Parceiros" className="w-64 h-auto object-contain mx-auto" />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-4 left-6">
            <p className="text-white/70 text-sm">Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}</p>
          </div>
        </div>
      </div>

      {/* ========== Tablet Layout (768px - 1024px) ========== */}
      <div className="hidden md:block lg:hidden relative w-full h-screen p-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <img src="/images/logo-cortel-branco.svg" alt="Cortel São Paulo" className="w-40 h-auto object-contain mb-4" />
          <h1 className="text-white font-lato font-black text-3xl leading-tight">
            Informativo de Velórios
          </h1>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-6 h-[calc(100vh-200px)]">
          <div className="h-1/2">
            <div className="w-full h-full rounded-lg overflow-hidden bg-black">
              <TVSection videoUrl={videoUrl} />
            </div>
          </div>
          <div className="h-1/2">
            <FuneralList funerals={activeFunerals} />
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center">
          <p className="text-white/70 text-sm">Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}</p>
          <div className="flex items-center space-x-3">
            <h2 className="text-white font-lato font-black text-xl">TV CORTEL</h2>
            <img src="/images/logo-parceiros.svg" alt="Parceiros" className="w-24 h-auto object-contain" />
          </div>
        </div>
      </div>

      {/* ========== Mobile Layout (320px - 768px) ========== */}
      <div className="block md:hidden relative w-full min-h-screen p-4">
        {/* Header */}
        <div className="text-center mb-6">
          <img src="/images/logo-cortel-branco.svg" alt="Cortel São Paulo" className="w-28 h-auto object-contain mx-auto mb-4" />
          <h1 className="text-white font-lato font-black text-xl leading-tight">
            Informativo de Velórios
          </h1>
        </div>

        {/* Video Section */}
        <div className="mb-6">
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
            <TVSection videoUrl={videoUrl} />
          </div>
        </div>

        {/* Funeral Cards */}
        <div className="mb-6">
          <FuneralList funerals={activeFunerals} />
        </div>

        {/* Footer */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <h2 className="text-white font-lato font-black text-lg">TV CORTEL</h2>
            <img src="/images/logo-parceiros.svg" alt="Parceiros" className="w-16 h-auto object-contain" />
          </div>
          <p className="text-white/70 text-xs">Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}</p>
        </div>
      </div>

      {/* ========== Small Mobile Layout (< 375px) ========== */}
      <div className="block sm:hidden relative w-full min-h-screen p-3">
        {/* Header */}
        <div className="text-center mb-4">
          <img src="/images/logo-cortel-branco.svg" alt="Cortel São Paulo" className="w-24 h-auto object-contain mx-auto mb-3" />
          <h1 className="text-white font-lato font-black text-lg leading-tight">
            Informativo<br />de Velórios
          </h1>
        </div>

        {/* Video Section */}
        <div className="mb-4">
          <div className="w-full aspect-video rounded-md overflow-hidden bg-black">
            <TVSection videoUrl={videoUrl} />
          </div>
        </div>

        {/* Funeral Cards */}
        <div className="mb-4">
          <FuneralList funerals={activeFunerals} />
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-1">
            <h2 className="text-white font-lato font-black text-base">TV CORTEL</h2>
            <img src="/images/logo-parceiros.svg" alt="Parceiros" className="w-12 h-auto object-contain" />
          </div>
          <p className="text-white/70 text-xs">Atualizado às {lastUpdate.toLocaleTimeString('pt-BR')}</p>
        </div>
      </div>

    </div>
  );
};