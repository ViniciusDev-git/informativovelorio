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
      className={`w-full h-full rounded-2xl p-3 transition-all duration-1000 ${className || ''}`}
      style={{
        backgroundColor: '#dae0ea',
        ...style
      }}
    >
      {/* Nome do falecido - Responsive */}
      <h3 
        className="font-lato font-black text-base md:text-lg xl:text-[20px] 4k:text-[40px] leading-tight mb-1"
        style={{ 
          color: '#042453'
        }}
      >
        {funeral.nome}
      </h3>
      
      {/* Sala - Responsive */}
      <div className="mb-1">
        <span 
          className="font-lato font-black text-sm md:text-base xl:text-[16px] 4k:text-[32px]"
          style={{ 
            color: '#042453'
          }}
        >
          {funeral.sala}
        </span>
      </div>
      
      {/* Data e horário - Responsive */}
      <p 
        className="font-lato font-black text-xs md:text-sm xl:text-[14px] 4k:text-[28px] mb-1"
        style={{ 
          color: '#042453'
        }}
      >
        {formatDateTime()}
      </p>
      
      {/* Local de sepultamento - Responsive */}
      <p 
        className="font-lato font-black text-xs md:text-sm xl:text-[14px] 4k:text-[28px] leading-tight overflow-hidden"
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

