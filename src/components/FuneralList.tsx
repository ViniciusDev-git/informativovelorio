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

  useEffect(() => {
    if (funerals.length === 0) {
      setVisibleCards([]);
      return;
    }
    setVisibleCards(funerals.slice(0, 5));
  }, [funerals]);

  useEffect(() => {
    if (funerals.length <= 5) return; // No rotation needed

    const interval = setInterval(() => {
      setVisibleCards(prevVisible => {
        if (prevVisible.length === 0) return [];
        
        const firstCardIndex = funerals.findIndex(f => f.nome === prevVisible[0].nome);
        const nextIndex = (firstCardIndex + 1) % funerals.length;
        
        const nextCards = [];
        for (let i = 0; i < 5; i++) {
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
      <div className="flex items-center justify-center h-full w-full">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center w-full max-w-md">
          <p className="text-white font-lato font-black text-xl">
            Nenhum velório acontecendo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-y-4">
        {visibleCards.map((funeral, index) => (
          <FuneralCard key={index} funeral={funeral} />
        ))}
      </div>
    </div>
  );
};