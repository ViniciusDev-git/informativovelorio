mport { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  className?: string;
}

// Estados simplificados
enum VideoState {
  LOADING = 'loading',
  PLAYING = 'playing',
  ERROR = 'error'
}



export const VideoPlayer = ({ videoUrl, className }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoState, setVideoState] = useState<VideoState>(VideoState.LOADING);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;
  
  const getVideoUrl = () => {
    return videoUrl;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log("VideoPlayer Init:", {
      videoUrl: getVideoUrl(),
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: navigator.userAgent
    });

    setVideoState(VideoState.LOADING);

    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = "auto";
    video.crossOrigin = "anonymous";
    video.controls = false;

    const timeoutDuration = 30000;
    let loadTimeout: NodeJS.Timeout;

    const startTimeout = () => {
      clearTimeout(loadTimeout);
      loadTimeout = setTimeout(() => {
        console.warn("Video loading timeout", { retryCount });
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
        } else {
          setVideoState(VideoState.ERROR);
        }
      }, timeoutDuration);
    };

    const clearTimeoutSafe = () => {
      if (loadTimeout) {
        clearTimeout(loadTimeout);
      }
    };

    const attemptPlay = async () => {
      try {
        clearTimeoutSafe();
        await new Promise(resolve => setTimeout(resolve, 500));
        await video.play();
        setVideoState(VideoState.PLAYING);
        setRetryCount(0);
        console.log("Video playing successfully");
      } catch (error) {
        console.error("Video play failed:", error, { retryCount });
        
        if (retryCount < maxRetries) {
          console.log(`Retrying video playback (${retryCount + 1}/${maxRetries})`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        } else {
          setVideoState(VideoState.ERROR);
        }
      }
    };

    // Event listeners otimizados
    const handleCanPlay = () => {
      console.log("Video can play", { readyState: video.readyState });
      attemptPlay();
    };

    const handleLoadedData = () => {
      console.log("Video data loaded");
      if (video.readyState >= 2) {
        attemptPlay();
      }
    };

    const handleError = (e: Event) => {
      console.error("Video error:", e, { src: video.src });
      clearTimeoutSafe();
      
      if (retryCount < maxRetries) {
        console.log(`Retrying after error (${retryCount + 1}/${maxRetries})`);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 3000);
      } else {
        setVideoState(VideoState.ERROR);
      }
    };

    const handleLoadStart = () => {
      console.log("Video load started");
      setVideoState(VideoState.LOADING);
      startTimeout();
    };

    const handleWaiting = () => {
      console.log("Video waiting");
      // Não mudar estado para loading se já estiver playing
      if (videoState !== VideoState.PLAYING) {
        setVideoState(VideoState.LOADING);
      }
    };

    const handlePlaying = () => {
      console.log("Video playing");
      clearTimeoutSafe();
      setVideoState(VideoState.PLAYING);
    };

    // Adicionar event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    // Tentar play imediato se já estiver pronto
    if (video.readyState >= 3) {
      console.log("Video already ready, attempting play");
      attemptPlay();
    } else {
      startTimeout();
    }

    // Cleanup
    return () => {
      clearTimeoutSafe();
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, [videoUrl, retryCount]);

  // Função de retry manual
  const handleRetry = () => {
    console.log("Manual retry triggered");
    setRetryCount(0);
    setVideoState(VideoState.LOADING);
    const video = videoRef.current;
    if (video) {
      video.load();
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent">
      {/* Vídeo principal */}
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
          display: videoState === VideoState.PLAYING ? 'block' : 'none',
          backgroundColor: 'transparent'
        }}
      >
        <source src={getVideoUrl()} type="video/mp4" />
        {/* Fallback para navegadores que não suportam MP4 */}
        Seu navegador não suporta reprodução de vídeo.
      </video>

      {/* Loading State */}
      {videoState === VideoState.LOADING && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/90 to-blue-700/90 text-white">
          <div className="text-center p-4 max-w-md">
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg md:text-2xl font-medium mb-2">Carregando vídeo...</p>
            <p className="text-sm md:text-base text-white/80">
              Carregando vídeo...
            </p>
            {retryCount > 0 && (
              <p className="text-xs md:text-sm text-white/60 mt-2">
                Tentativa {retryCount + 1} de {maxRetries + 1}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {videoState === VideoState.ERROR && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900/90 to-red-700/90 text-white">
          <div className="text-center p-4 max-w-md">
            <div className="w-12 h-12 md:w-16 md:h-16 mb-4 mx-auto text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <p className="text-lg md:text-2xl font-medium mb-2">Erro ao carregar vídeo</p>
            <p className="text-sm md:text-base text-white/80 mb-4">
              Verifique sua conexão de rede.
            </p>
            <button 
              onClick={handleRetry}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg text-sm md:text-base transition-colors border border-white/30"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Debug info para desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs p-2 rounded z-50 max-w-xs">
          <div>Estado: {videoState}</div>
          <div>Retry: {retryCount}/{maxRetries}</div>
          <div>URL: {getVideoUrl()}</div>
          <div>Tela: {window.innerWidth}x{window.innerHeight}</div>
        </div>
      )}
    </div>
  );
};