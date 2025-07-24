import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  className?: string;
}

export const VideoPlayer = ({ videoUrl, className }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset states
    setIsLoading(true);
    setHasError(false);

    // Configurações básicas do vídeo
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = "metadata"; // Mudança importante: apenas metadados

    // Timeout para carregamento
    const loadTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn("Video loading timeout");
        setHasError(true);
        setIsLoading(false);
      }
    }, 15000); // 15 segundos timeout

    const playVideo = async () => {
      try {
        await video.play();
        setIsLoading(false);
        console.log("Video started playing successfully");
      } catch (error) {
        console.error("Video autoplay failed:", error);
        
        if (retryCount < maxRetries) {
          console.log(`Retrying video playback (${retryCount + 1}/${maxRetries})`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 1000);
        } else {
          setHasError(true);
          setIsLoading(false);
        }
      }
    };

    // Event listeners
    const handleCanPlay = () => {
      console.log("Video can play");
      clearTimeout(loadTimeout);
      playVideo();
    };

    const handleLoadedData = () => {
      console.log("Video data loaded");
      setIsLoading(false);
    };

    const handleError = (e: Event) => {
      console.error("Video error:", e);
      clearTimeout(loadTimeout);
      setHasError(true);
      setIsLoading(false);
    };

    const handleLoadStart = () => {
      console.log("Video load started");
      setIsLoading(true);
    };

    const handleWaiting = () => {
      console.log("Video waiting for data");
      setIsLoading(true);
    };

    const handlePlaying = () => {
      console.log("Video is playing");
      setIsLoading(false);
    };

    // Adicionar event listeners
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    // Se o vídeo já estiver pronto
    if (video.readyState >= 3) {
      handleCanPlay();
    }

    // Cleanup
    return () => {
      clearTimeout(loadTimeout);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, [videoUrl, retryCount]);

  // Função para tentar novamente
  const handleRetry = () => {
    setRetryCount(0);
    setHasError(false);
    setIsLoading(true);
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center">
      <video
        ref={videoRef}
        className={`relative z-10 ${className} ${isLoading || hasError ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'scale-down',
          objectPosition: 'center'
        }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Loading State */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cortel-blue-dark to-cortel-blue-medium text-white z-20">
          <div className="text-center p-4">
            <div className="w-8 h-8 md:w-12 md:h-12 border-2 md:border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2 md:mb-4"></div>
            <p className="text-sm md:text-xl font-medium">Carregando vídeo...</p>
            <p className="text-xs md:text-sm text-white/70 mt-2">
              Aguarde, o vídeo está sendo processado
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900 to-red-700 text-white z-20">
          <div className="text-center p-4">
            <div className="w-8 h-8 md:w-12 md:h-12 mb-2 md:mb-4 mx-auto">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <p className="text-sm md:text-xl font-medium mb-2">Erro ao carregar vídeo</p>
            <p className="text-xs md:text-sm text-white/70 mb-4">
              Verifique sua conexão ou tente novamente
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
    </div>
  );
};
