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
  const [animatingCards, setAnimatingCards] = useState<{
    entering: FuneralData[];
    exiting: FuneralData[];
  }>({ entering: [], exiting: [] });

  // Configurações por breakpoint
  const getMaxCards = () => {
    if (typeof window === 'undefined') return 6;
    
    const width = window.innerWidth;
    if (width >= 7680) return 8; // 8K TV
    if (width >= 3840) return 6; // 4K TV
    if (width >= 2560) return 6; // Large Desktop
    if (width >= 1920) return 6; // Desktop
    if (width >= 1024) return 5; // Laptop
    if (width >= 768) return 4;  // Tablet
    if (width >= 375) return 3;  // Mobile
    return 2; // Small Mobile
  };

  const [maxCards, setMaxCards] = useState(getMaxCards());

  // Atualizar maxCards no resize
  useEffect(() => {
    const handleResize = () => {
      setMaxCards(getMaxCards());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Inicializar cards visíveis
  useEffect(() => {
    if (funerals.length === 0) {
      setVisibleCards([]);
      return;
    }

    setVisibleCards(funerals.slice(0, maxCards));
  }, [funerals, maxCards]);

  // Animação de rotação vertical (roda gigante)
  useEffect(() => {
    if (funerals.length <= maxCards) return;

    const interval = setInterval(() => {
      setVisibleCards(prevVisible => {
        if (prevVisible.length === 0) return [];

        // Encontrar índice atual no array completo
        const firstCardIndex = funerals.findIndex(f => f.nome === prevVisible[0].nome);
        
        // Calcular próximo índice (rotacionar por 1)
        const nextIndex = (firstCardIndex + 1) % funerals.length;
        
        // Preparar próximos cards
        const nextCards = [];
        for (let i = 0; i < maxCards; i++) {
          const cardIndex = (nextIndex + i) % funerals.length;
          nextCards.push(funerals[cardIndex]);
        }

        // Configurar animação
        const exitingCard = prevVisible[prevVisible.length - 1]; // Último card sai
        const enteringCard = nextCards[nextCards.length - 1]; // Novo card entra

        setAnimatingCards({
          exiting: [exitingCard],
          entering: [enteringCard]
        });

        // Limpar animação após completar
        setTimeout(() => {
          setAnimatingCards({ entering: [], exiting: [] });
        }, 800);

        return nextCards;
      });
    }, 4000); // Rotacionar a cada 4 segundos

    return () => clearInterval(interval);
  }, [funerals, maxCards]);

  // Card positions para diferentes layouts
  const getCardPositions = () => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1920;
    
    if (width >= 7680) { // 8K TV
      return Array.from({ length: 8 }, (_, i) => ({
        top: `${760 + (i * 350)}px`,
        left: '644px',
        width: '1496px',
        height: '320px'
      }));
    }
    
    if (width >= 3840) { // 4K TV
      return Array.from({ length: 6 }, (_, i) => ({
        top: `${380 + (i * 270)}px`,
        left: '322px',
        width: '748px',
        height: '238px'
      }));
    }
    
    if (width >= 2560) { // Large Desktop
      return Array.from({ length: 6 }, (_, i) => ({
        top: `${250 + (i * 160)}px`,
        left: '120px',
        width: '800px',
        height: '140px'
      }));
    }
    
    if (width >= 1920) { // Desktop
      return Array.from({ length: 6 }, (_, i) => ({
        top: `${180 + (i * 125)}px`,
        left: '80px',
        width: '600px',
        height: '110px'
      }));
    }

    return []; // Para layouts responsivos menores
  };

  const cardPositions = getCardPositions();

  if (funerals.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        {/* 8K TV */}
        <div className="hidden 8k:block absolute top-[1600px] left-[644px] w-[1496px] h-[400px]">
          <div className="bg-white/20 backdrop-blur-sm rounded-4xl p-16 text-center">
            <p className="text-white font-lato font-black text-6xl">
              Nenhum velório acontecendo
            </p>
          </div>
        </div>
        
        {/* 4K TV */}
        <div className="hidden 4k:block 8k:hidden absolute top-[800px] left-[322px] w-[748px] h-[400px]">
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-12 text-center">
            <p className="text-white font-lato font-black text-4xl">
              Nenhum velório acontecendo
            </p>
          </div>
        </div>
        
        {/* Large Desktop */}
        <div className="hidden 3xl:block 4k:hidden absolute top-[500px] left-[120px] w-[800px] h-[300px]">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 text-center">
            <p className="text-white font-lato font-black text-3xl">
              Nenhum velório acontecendo
            </p>
          </div>
        </div>
        
        {/* Desktop */}
        <div className="hidden xl:block 3xl:hidden absolute top-[400px] left-[80px] w-[600px] h-[200px]">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <p className="text-white font-lato font-black text-2xl">
              Nenhum velório acontecendo
            </p>
          </div>
        </div>
        
        {/* Responsive layouts */}
        <div className="block xl:hidden w-full">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <p className="text-white font-lato font-black text-lg md:text-xl lg:text-2xl">
              Nenhum velório acontecendo
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ========== 8K TV Layout ========== */}
      <div className="hidden 8k:block">
        {visibleCards.map((funeral, index) => {
          const position = cardPositions[index];
          if (!position) return null;

          const isExiting = animatingCards.exiting.some(f => f.nome === funeral.nome);
          const isEntering = animatingCards.entering.some(f => f.nome === funeral.nome);

          return (
            <div
              key={`8k-${funeral.nome}-${index}`}
              className={`absolute transition-all duration-800 ease-out ${
                isExiting ? 'animate-wheel-rotate-out' : 
                isEntering ? 'animate-wheel-rotate' : ''
              }`}
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
                height: position.height,
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <FuneralCard funeral={funeral} />
            </div>
          );
        })}
      </div>

      {/* ========== 4K TV Layout ========== */}
      <div className="hidden 4k:block 8k:hidden">
        {visibleCards.map((funeral, index) => {
          const position = cardPositions[index];
          if (!position) return null;

          const isExiting = animatingCards.exiting.some(f => f.nome === funeral.nome);
          const isEntering = animatingCards.entering.some(f => f.nome === funeral.nome);

          return (
            <div
              key={`4k-${funeral.nome}-${index}`}
              className={`absolute transition-all duration-800 ease-out ${
                isExiting ? 'animate-wheel-rotate-out' : 
                isEntering ? 'animate-wheel-rotate' : ''
              }`}
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
                height: position.height,
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <FuneralCard funeral={funeral} />
            </div>
          );
        })}
      </div>

      {/* ========== Large Desktop Layout ========== */}
      <div className="hidden 3xl:block 4k:hidden">
        {visibleCards.map((funeral, index) => {
          const position = cardPositions[index];
          if (!position) return null;

          const isExiting = animatingCards.exiting.some(f => f.nome === funeral.nome);
          const isEntering = animatingCards.entering.some(f => f.nome === funeral.nome);

          return (
            <div
              key={`3xl-${funeral.nome}-${index}`}
              className={`absolute transition-all duration-800 ease-out ${
                isExiting ? 'animate-wheel-rotate-out' : 
                isEntering ? 'animate-wheel-rotate' : ''
              }`}
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
                height: position.height,
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <FuneralCard funeral={funeral} />
            </div>
          );
        })}
      </div>

      {/* ========== Desktop Layout ========== */}
      <div className="hidden xl:block 3xl:hidden">
        {visibleCards.map((funeral, index) => {
          const position = cardPositions[index];
          if (!position) return null;

          const isExiting = animatingCards.exiting.some(f => f.nome === funeral.nome);
          const isEntering = animatingCards.entering.some(f => f.nome === funeral.nome);

          return (
            <div
              key={`xl-${funeral.nome}-${index}`}
              className={`absolute transition-all duration-800 ease-out ${
                isExiting ? 'animate-wheel-rotate-out' : 
                isEntering ? 'animate-wheel-rotate' : ''
              }`}
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
                height: position.height,
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <FuneralCard funeral={funeral} />
            </div>
          );
        })}
      </div>

      {/* ========== Responsive Layouts (Laptop, Tablet, Mobile) ========== */}
      <div className="block xl:hidden w-full h-full">
        
        {/* Laptop Layout */}
        <div className="hidden lg:block xl:hidden">
          <div className="space-y-4 h-full overflow-hidden">
            {visibleCards.map((funeral, index) => {
              const isExiting = animatingCards.exiting.some(f => f.nome === funeral.nome);
              const isEntering = animatingCards.entering.some(f => f.nome === funeral.nome);

              return (
                <div
                  key={`lg-${funeral.nome}-${index}`}
                  className={`transition-all duration-800 ease-out transform ${
                    isExiting ? 'animate-slide-up-out' : 
                    isEntering ? 'animate-slide-up' : ''
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '800px'
                  }}
                >
                  <FuneralCard funeral={funeral} className="h-20" />
                </div>
              );
            })}
            {funerals.length > maxCards && (
              <div className="text-center mt-4">
                <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                  <p className="text-white/70 text-sm font-lato">
                    +{funerals.length - maxCards} velórios adicionais
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tablet Layout */}
        <div className="hidden md:block lg:hidden">
          <div className="space-y-3 h-full overflow-hidden">
            {visibleCards.map((funeral, index) => {
              const isExiting = animatingCards.exiting.some(f => f.nome === funeral.nome);
              const isEntering = animatingCards.entering.some(f => f.nome === funeral.nome);

              return (
                <div
                  key={`md-${funeral.nome}-${index}`}
                  className={`transition-all duration-800 ease-out transform ${
                    isExiting ? 'animate-slide-up-out' : 
                    isEntering ? 'animate-slide-up' : ''
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '600px'
                  }}
                >
                  <FuneralCard funeral={funeral} className="h-18" />
                </div>
              );
            })}
            {funerals.length > maxCards && (
              <div className="text-center mt-3">
                <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1">
                  <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-pulse"></div>
                  <p className="text-white/70 text-xs font-lato">
                    +{funerals.length - maxCards} velórios adicionais
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="space-y-3 overflow-hidden">
            {visibleCards.map((funeral, index) => {
              const isExiting = animatingCards.exiting.some(f => f.nome === funeral.nome);
              const isEntering = animatingCards.entering.some(f => f.nome === funeral.nome);

              return (
                <div
                  key={`sm-${funeral.nome}-${index}`}
                  className={`transition-all duration-800 ease-out transform ${
                    isExiting ? 'animate-slide-up-out' : 
                    isEntering ? 'animate-slide-up' : ''
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '400px'
                  }}
                >
                  <FuneralCard funeral={funeral} className="h-16 sm:h-20" />
                </div>
              );
            })}
            {funerals.length > maxCards && (
              <div className="text-center mt-3">
                <div className="inline-flex items-center space-x-1 bg-white/10 rounded-full px-3 py-1">
                  <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
                  <p className="text-white/70 text-xs font-lato">
                    +{funerals.length - maxCards} mais
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
};