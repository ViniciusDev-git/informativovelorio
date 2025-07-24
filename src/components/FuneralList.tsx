import { useState, useEffect } from "react";
import { FuneralCard } from "./FuneralCard";

interface FuneralData {
  nome: string;
  sala: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  local_sepultamento: string;
}

interface FuneralListProps {
  funerals: FuneralData[];
}

export const FuneralList = ({ funerals }: FuneralListProps) => {
  const [visibleCards, setVisibleCards] = useState<FuneralData[]>([]);

  // Card positions for desktop (absolute positioning) - 6 cards
  const desktopCardPositions = [
    { top: '190px', left: '161px', width: '374px', height: '119px' },
    { top: '325px', left: '161px', width: '374px', height: '119px' },
    { top: '460px', left: '161px', width: '374px', height: '119px' },
    { top: '595px', left: '161px', width: '374px', height: '119px' },
    { top: '730px', left: '161px', width: '374px', height: '119px' },
    { top: '865px', left: '161px', width: '374px', height: '119px' }
  ];

  // Card positions for TV 4K (absolute positioning) - 6 cards (doubled proportions)
  const tv4kCardPositions = [
    { top: '380px', left: '322px', width: '748px', height: '238px' },
    { top: '650px', left: '322px', width: '748px', height: '238px' },
    { top: '920px', left: '322px', width: '748px', height: '238px' },
    { top: '1190px', left: '322px', width: '748px', height: '238px' },
    { top: '1460px', left: '322px', width: '748px', height: '238px' },
    { top: '1730px', left: '322px', width: '748px', height: '238px' }
  ];

  useEffect(() => {
    if (funerals.length === 0) {
      setVisibleCards([]);
      return;
    }

    // Initialize with first 6 cards
    setVisibleCards(funerals.slice(0, 6));
  }, [funerals]);

  useEffect(() => {
    if (funerals.length <= 6) return; // No rotation needed

    const interval = setInterval(() => {
      setVisibleCards(prevVisible => {
        if (prevVisible.length === 0) return [];
        
        // Find current position in the full list
        const firstCardIndex = funerals.findIndex(f => f.nome === prevVisible[0].nome);
        
        // Calculate next starting index (rotate by 1)
        const nextIndex = (firstCardIndex + 1) % funerals.length;
        
        // Get next 6 cards (wrapping around if needed)
        const nextCards = [];
        for (let i = 0; i < 6; i++) {
          const cardIndex = (nextIndex + i) % funerals.length;
          nextCards.push(funerals[cardIndex]);
        }
        
        return nextCards;
      });
    }, 6000); // Rotate every 6 seconds
    
    return () => clearInterval(interval);
  }, [funerals]);

  if (funerals.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        {/* TV 4K layout */}
        <div className="hidden 4k:block absolute top-[800px] left-[322px] w-[748px] h-[400px]">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-12 text-center">
            <p className="text-white font-lato font-black text-4xl">
              Nenhum velório acontecendo
            </p>
          </div>
        </div>
        
        {/* Desktop layout */}
        <div className="hidden xl:block 4k:hidden absolute top-[400px] left-[161px] w-[374px] h-[200px]">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <p className="text-white font-lato font-black text-xl">
              Nenhum velório acontecendo
            </p>
          </div>
        </div>
        
        {/* Tablet/Mobile layout */}
        <div className="block xl:hidden w-full">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <p className="text-white font-lato font-black text-lg md:text-xl">
              Nenhum velório acontecendo
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* TV 4K Layout - Absolute Positioning */}
      <div className="hidden 4k:block">
        {visibleCards.map((funeral, index) => {
          const position = tv4kCardPositions[index];
          if (!position) return null;

          return (
            <div
              key={`4k-${funeral.nome}-${index}`}
              className="absolute transition-all duration-1000 ease-in-out"
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
                height: position.height,
              }}
            >
              <FuneralCard funeral={funeral} />
            </div>
          );
        })}
      </div>

      {/* Desktop Layout - Absolute Positioning */}
      <div className="hidden xl:block 4k:hidden">
        {visibleCards.map((funeral, index) => {
          const position = desktopCardPositions[index];
          if (!position) return null;

          return (
            <div
              key={`${funeral.nome}-${index}`}
              className="absolute transition-all duration-1000 ease-in-out"
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
                height: position.height,
              }}
            >
              <FuneralCard funeral={funeral} />
            </div>
          );
        })}
      </div>

      {/* Tablet/Mobile Layout - Responsive Grid */}
      <div className="block xl:hidden w-full">
        {/* Mobile Layout */}
        <div className="block md:hidden space-y-3">
          {visibleCards.slice(0, 3).map((funeral, index) => (
            <div
              key={`mobile-${funeral.nome}-${index}`}
              className="transition-all duration-1000 ease-in-out"
            >
              <FuneralCard funeral={funeral} className="h-24" />
            </div>
          ))}
          {visibleCards.length > 3 && (
            <div className="text-center">
              <p className="text-white/70 text-sm font-lato">
                +{visibleCards.length - 3} velórios adicionais
              </p>
            </div>
          )}
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:block xl:hidden">
          <div className="grid grid-cols-1 gap-3 h-full">
            {visibleCards.slice(0, 4).map((funeral, index) => (
              <div
                key={`tablet-${funeral.nome}-${index}`}
                className="transition-all duration-1000 ease-in-out"
              >
                <FuneralCard funeral={funeral} className="h-20 lg:h-24" />
              </div>
            ))}
            {visibleCards.length > 4 && (
              <div className="text-center">
                <p className="text-white/70 text-sm font-lato">
                  +{visibleCards.length - 4} velórios adicionais
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};