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
      className={`w-full h-full rounded-2xl p-4 transition-all duration-1000 ${className || ''}`}
      style={{
        backgroundColor: '#dae0ea',
        ...style
      }}
    >
      {/* Nome do falecido - Responsive */}
      <h3 
        className="font-lato font-black text-lg md:text-xl lg:text-2xl xl:text-3xl leading-tight mb-2"
        style={{ 
          color: '#042453'
        }}
      >
        {funeral.nome}
      </h3>
      
      {/* Sala - Responsive */}
      <div className="mb-2">
        <span 
          className="font-lato font-black text-base md:text-lg lg:text-xl xl:text-2xl"
          style={{ 
            color: '#042453'
          }}
        >
          {funeral.sala}
        </span>
      </div>
      
      {/* Data e horário - Responsive */}
      <p 
        className="font-lato font-black text-sm md:text-base lg:text-lg xl:text-xl mb-2"
        style={{ 
          color: '#042453'
        }}
      >
        {formatDateTime()}
      </p>
      
      {/* Local de sepultamento - Responsive */}
      <p 
        className="font-lato font-black text-sm md:text-base lg:text-lg xl:text-xl leading-tight overflow-hidden"
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

