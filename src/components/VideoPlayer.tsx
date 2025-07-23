import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  className?: string;
}

export const VideoPlayer = ({ videoUrl, className }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true; // Adicionado para melhor compatibilidade em iOS
      video.preload = "auto"; // Alterado para 'auto' para carregar mais dados

      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.log("Video autoplay blocked or failed:", error);
          // Tentar reproduzir novamente após um pequeno atraso ou interação do usuário
          // Para TVs, geralmente não há interação do usuário, então o 'muted' e 'autoplay' são cruciais.
        }
      };

      // Tentar reproduzir quando o vídeo estiver pronto
      video.oncanplaythrough = () => {
        playVideo();
      };

      // Se o vídeo já estiver pronto, tentar reproduzir imediatamente
      if (video.readyState >= 3) { // HAVE_FUTURE_DATA ou HAVE_ENOUGH_DATA
        playVideo();
      }
    }
  }, [videoUrl]);

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-2xl overflow-hidden">
      <video
        ref={videoRef}
        className={`w-full h-full object-cover relative z-10 ${className}`}
        muted
        loop
        autoPlay
        playsInline
        preload="auto" // Mantido 'auto' aqui também
        style={{
          objectFit: 'cover',
          objectPosition: 'center'
        }}
        onError={(e) => {
          console.error('Video error:', e);
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        {/* Fallback content for browsers that do not support the video tag */}
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-cortel-blue-dark to-cortel-blue-medium text-white">
          <div className="text-center p-4">
            <div className="w-8 h-8 md:w-12 md:h-12 border-2 md:border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2 md:mb-4"></div>
            <p className="text-sm md:text-xl font-medium">Carregando vídeo...</p>
          </div>
        </div>
      </video>
    </div>
  );
};