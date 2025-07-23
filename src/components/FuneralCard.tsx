import { cn } from "@/lib/utils";

interface FuneralData {
  nome: string;
  sala: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  local_sepultamento: string;
}

interface FuneralCardProps {
  funeral: FuneralData;
  className?: string;
  style?: React.CSSProperties;
}

export const FuneralCard = ({ funeral, className, style }: FuneralCardProps) => {
  // Format the date and time display
  const formatDateTime = () => {
    return `${funeral.data} - ${funeral.hora_inicio} às ${funeral.hora_fim}`;
  };

  return (
    <div
      className={cn(
        "w-full h-full rounded-[clamp(0.5rem,1.5vw,2rem)] p-[clamp(0.75rem,1.5vw,2rem)] transition-all duration-1000",
        className
      )}
      style={{
        backgroundColor: '#dae0ea',
        ...style
      }}
    >
      {/* Nome do falecido - Responsive */}
      <h3 
        className="font-lato font-black text-[clamp(1rem,1.8vw,2.5rem)] leading-tight mb-[clamp(0.25rem,0.5vh,0.5rem)]"
        style={{ 
          color: '#042453'
        }}
      >
        {funeral.nome}
      </h3>
      
      {/* Sala - Responsive */}
      <div className="mb-[clamp(0.25rem,0.5vh,0.5rem)]">
        <span 
          className="font-lato font-black text-[clamp(0.75rem,1.2vw,1.5rem)]"
          style={{ 
            color: '#042453'
          }}
        >
          {funeral.sala}
        </span>
      </div>
      
      {/* Data e horário - Responsive */}
      <p 
        className="font-lato font-black text-[clamp(0.625rem,1vw,1.25rem)] mb-[clamp(0.25rem,0.5vh,0.5rem)]"
        style={{ 
          color: '#042453'
        }}
      >
        {formatDateTime()}
      </p>
      
      {/* Local de sepultamento - Responsive */}
      <p 
        className="font-lato font-black text-[clamp(0.625rem,1vw,1.25rem)] leading-tight overflow-hidden"
        style={{ 
          color: '#042453',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}
      >
        {funeral.local_sepultamento}
      </p>
    </div>
  );
};