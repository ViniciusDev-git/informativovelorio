import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  className?: string;
}

// Estados simplificados em enum para evitar conflitos
enum VideoState {
  LOADING = 'loading',
  PLAYING = 'playing',
  ERROR = 'error'
}

// Detectar se é Smart TV
const isSmartTV = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isTV = userAgent.includes('smart-tv') || 
               userAgent.includes('smarttv') || 
               userAgent.includes('tv') ||
               userAgent.includes('webos') ||
               userAgent.includes('tizen') ||
               (window.innerWidth >= 3840 && window.innerHeight >= 2160);
  
  return isTV;
};

export const VideoPlayer = ({ videoUrl, className }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoState, setVideoState] = useState<VideoState>(VideoState.LOADING);
  const [isTV] = useState(isSmartTV());
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset para loading
    setVideoState(VideoState.LOADING);

    // Configurações otimizadas para Smart TV vs Desktop
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = isTV ? "auto" : "metadata"; // Smart TVs precisam de preload completo
    
    // Configurações específicas para Smart TV
    if (isTV) {
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('x5-playsinline', 'true');
      video.setAttribute('x5-video-player-type', 'h5');
      video.setAttribute('x5-video-player-fullscreen', 'false');
    }

    // Timeout mais longo para Smart TVs
    const timeoutDuration = isTV ? 30000 : 15000;
    let loadTimeout: NodeJS.Timeout;

    const startTimeout = () => {
      loadTimeout = setTimeout(() => {
        console.warn("Video loading timeout");
        setVideoState(VideoState.ERROR);
      }, timeoutDuration);
    };

    const clearTimeoutSafe = () => {
      if (loadTimeout) {
        clearTimeout(loadTimeout);
      }
    };

    // Função de play simplificada
    const attemptPlay = async () => {
      try {
        clearTimeoutSafe();
        await video.play();
        setVideoState(VideoState.PLAYING);
        console.log("Video playing successfully");
      } catch (error) {
        console.error("Video play failed:", error);
        setVideoState(VideoState.ERROR);
      }
    };

    // Event listeners simplificados - apenas os essenciais
    const handleCanPlay = () => {
      console.log("Video can play");
      attemptPlay();
    };

    const handleError = (e: Event) => {
      console.error("Video error:", e);
      clearTimeoutSafe();
      setVideoState(VideoState.ERROR);
    };

    const handleLoadStart = () => {
      console.log("Video load started");
      setVideoState(VideoState.LOADING);
      startTimeout();
    };

    // Adicionar apenas os event listeners essenciais
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);

    // Para Smart TVs, tentar play imediato se já estiver pronto
    if (isTV && video.readyState >= 3) {
      attemptPlay();
    } else {
      startTimeout();
    }

    // Cleanup simplificado
    return () => {
      clearTimeoutSafe();
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [videoUrl, isTV]); // Removida dependência circular

  // Função de retry simplificada
  const handleRetry = () => {
    const video = videoRef.current;
    if (video) {
      setVideoState(VideoState.LOADING);
      video.load(); // Força reload do vídeo
    }
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center">
      {/* Vídeo sempre visível - sem transições problemáticas */}
      <video
        ref={videoRef}
        className={`relative z-10 ${className} w-full h-full`}
        muted
        loop
        autoPlay
        playsInline
        preload={isTV ? "auto" : "metadata"}
        style={{
          objectFit: 'scale-down',
          objectPosition: 'center',
          display: videoState === VideoState.PLAYING ? 'block' : 'none'
        }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Loading State - sem opacity transitions */}
      {videoState === VideoState.LOADING && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700 text-white z-20">
          <div className="text-center p-4">
            <div className="w-8 h-8 md:w-12 md:h-12 border-2 md:border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2 md:mb-4"></div>
            <p className="text-sm md:text-xl font-medium">Carregando vídeo...</p>
            <p className="text-xs md:text-sm text-white/70 mt-2">
              {isTV ? "Otimizando para Smart TV..." : "Aguarde um momento..."}
            </p>
          </div>
        </div>
      )}

      {/* Error State - simplificado */}
      {videoState === VideoState.ERROR && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900 to-red-700 text-white z-20">
          <div className="text-center p-4">
            <div className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-4 mx-auto">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <p className="text-sm md:text-xl font-medium mb-2">Erro ao carregar vídeo</p>
            <p className="text-xs md:text-sm text-white/70 mb-4">
              {isTV ? "Verifique a conexão da Smart TV" : "Verifique sua conexão"}
            </p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Debug info para desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-2 rounded z-30">
          <div>Estado: {videoState}</div>
          <div>Smart TV: {isTV ? 'Sim' : 'Não'}</div>
          <div>URL: {videoUrl}</div>
        </div>
      )}
    </div>
  );
};
