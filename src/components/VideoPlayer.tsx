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

    // Tenta iniciar o vídeo automaticamente
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        // Autoplay iniciado com sucesso
        console.log("Vídeo iniciado automaticamente.");
      }).catch(error => {
        // Autoplay bloqueado, o usuário precisará interagir
        console.warn("Autoplay bloqueado pelo navegador:", error);
        
        // Adiciona um listener para iniciar o vídeo na primeira interação do usuário
        const handleUserInteraction = () => {
          video.play();
          document.removeEventListener('click', handleUserInteraction);
          document.removeEventListener('touchstart', handleUserInteraction);
        };
        
        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('touchstart', handleUserInteraction);
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
        style={{
          objectFit: 'scale-down',
          objectPosition: 'center',
          backgroundColor: 'transparent'
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        Seu navegador não suporta reprodução de vídeo.
      </video>
    </div>
  );
};
