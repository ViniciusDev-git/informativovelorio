import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  className?: string;
}

export const VideoPlayer = ({ videoUrl, className }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Configurações para máxima compatibilidade
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;

    // Tenta iniciar o vídeo automaticamente
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log("Vídeo iniciado automaticamente.");
      }).catch(error => {
        console.warn("Autoplay bloqueado pelo navegador:", error);
        
        // Adiciona listeners para múltiplos tipos de interação
        const handleUserInteraction = () => {
          video.play().catch(console.error);
          // Remove todos os listeners após a primeira interação
          document.removeEventListener('click', handleUserInteraction);
          document.removeEventListener('touchstart', handleUserInteraction);
          document.removeEventListener('keydown', handleUserInteraction);
          document.removeEventListener('scroll', handleUserInteraction);
        };
        
        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('touchstart', handleUserInteraction);
        document.addEventListener('keydown', handleUserInteraction);
        document.addEventListener('scroll', handleUserInteraction);
      });
    }

    return () => {
      if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [videoUrl]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent">
      <video
        ref={videoRef}
        className={`${className} w-full h-full`}
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
        // Atributos adicionais para compatibilidade com diferentes navegadores
        webkit-playsinline="true"
        x5-playsinline="true"
        style={{
          objectFit: 'scale-down',
          objectPosition: 'center',
          backgroundColor: 'transparent',
          width: '100%',
          height: '100%'
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        Seu navegador não suporta reprodução de vídeo.
      </video>
    </div>
  );
};
