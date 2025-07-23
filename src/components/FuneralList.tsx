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
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerPage = 6; // Always show 6 cards

  useEffect(() => {
    // If there are more than 6 funerals, start carousel
    if (funerals.length > cardsPerPage) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + cardsPerPage) % funerals.length);
      }, 10000); // Change slide every 10 seconds
      return () => clearInterval(interval);
    } else {
      setCurrentIndex(0); // Reset index if not enough for carousel
    }
  }, [funerals, cardsPerPage]);

  const displayedFunerals = funerals.slice(currentIndex, currentIndex + cardsPerPage);

  if (displayedFunerals.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-sm rounded-[clamp(1rem,2vw,3rem)] p-[clamp(1rem,2vw,3rem)] text-center w-full h-full flex items-center justify-center">
          <p className="text-white font-lato font-black text-[clamp(1rem,1.5vw,2rem)]">
            Nenhum velório acontecendo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-[clamp(0.5rem,1.5vh,1rem)] h-full">
      {displayedFunerals.map((funeral, index) => (
        <FuneralCard 
          key={`${funeral.nome}-${index}`}
          funeral={funeral} 
          className="h-full"
        />
      ))}
    </div>
  );
};