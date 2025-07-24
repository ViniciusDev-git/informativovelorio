import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  videoUrl: string;
  className?: string;
}

// Estados simplificados para melhor controle
enum VideoState {
  LOADING = 'loading',
  PLAYING = 'playing',
  ERROR = 'error',
  READY = 'ready'
}

// Detecção robusta de Smart TV webOS
const detectWebOSTV = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform?.toLowerCase() || '';
  
  // Verificações específicas para webOS
  const webOSIndicators = [
    'webos', 'netcast', 'smart-tv', 'smarttv',
    'lg', 'lgwebos', 'web0s'
  ];
  
  // Verificar User Agent
  const isWebOSUserAgent = webOSIndicators.some(indicator => 
    userAgent.includes(indicator)
  );
  
  // Verificar propriedades específicas do webOS
  const hasWebOSProperties = !!(
    (window as any).webOS || 
    (window as any).PalmSystem ||
    (window as any).webOSSystem
  );
  
  // Verificar características de TV
  const screenWidth = window.screen?.width || window.innerWidth;
  const screenHeight = window.screen?.height || window.innerHeight;
  const isLargeScreen = screenWidth >= 1920 && screenHeight >= 1080;
  const aspectRatio = screenWidth / screenHeight;
  const isTVAspectRatio = aspectRatio >= 1.5 && aspectRatio <= 2.0;
  
  // Verificar ausência de touch
  const hasNoTouch = !('ontouchstart' in window) && 
                     navigator.maxTouchPoints === 0;
  
  console.log('TV Detection:', {
    userAgent: userAgent.substring(0, 100),
    isWebOSUserAgent,
    hasWebOSProperties,
    screenSize: `${screenWidth}x${screenHeight}`,
    aspectRatio: aspectRatio.toFixed(2),
    hasNoTouch
  });
  
  return isWebOSUserAgent || hasWebOSProperties || 
         (isLargeScreen && isTVAspectRatio && hasNoTouch);
};

export const VideoPlayer = ({ videoUrl, className }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoState, setVideoState] = useState<VideoState>(VideoState.LOADING);
  const [isWebOS] = useState(detectWebOSTV());
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const maxRetries = 3;
  const playTimeout = isWebOS ? 10000 : 5000; // 10s para webOS, 5s para outros

  // Função para obter URL absoluta do vídeo
  const getAbsoluteVideoUrl = () => {
    if (videoUrl.startsWith('http')) {
      return videoUrl;
    }
    
    // Para webOS, sempre usar URL absoluta
    if (isWebOS) {
      const baseUrl = window.location.origin;
      return `${baseUrl}${videoUrl.startsWith('/') ? videoUrl : '/' + videoUrl}`;
    }
    
    return videoUrl;
  };

  // Função principal de inicialização do vídeo
  const initializeVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    console.log('Initializing video:', {
      isWebOS,
      videoUrl: getAbsoluteVideoUrl(),
      retryCount
    });

    try {
      // Reset do estado
      setVideoState(VideoState.LOADING);
      setErrorMessage('');
      
      // Configurações básicas
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = true;
      
      // Configurações específicas para webOS
      if (isWebOS) {
        video.preload = "auto";
        video.crossOrigin = "anonymous";
        
        // Atributos específicos para webOS
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('x5-playsinline', 'true');
        video.setAttribute('playsinline', 'true');
        
        // Desabilitar controles nativos
        video.controls = false;
        video.disablePictureInPicture = true;
        
        // Configurações de buffer para webOS
        if ('buffered' in video) {
          video.setAttribute('preload', 'auto');
        }
      } else {
        video.preload = "metadata";
      }

      // Definir source
      const absoluteUrl = getAbsoluteVideoUrl();
      if (video.src !== absoluteUrl) {
        video.src = absoluteUrl;
      }

      // Aguardar carregamento dos metadados
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout ao carregar metadados do vídeo'));
        }, playTimeout);

        const onLoadedMetadata = () => {
          clearTimeout(timeout);
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
          video.removeEventListener('error', onError);
          resolve();
        };

        const onError = (e: Event) => {
          clearTimeout(timeout);
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
          video.removeEventListener('error', onError);
          reject(new Error(`Erro ao carregar vídeo: ${(e as any).message || 'Erro desconhecido'}`));
        };

        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('error', onError);

        // Forçar carregamento se necessário
        if (video.readyState >= 1) {
          onLoadedMetadata();
        } else {
          video.load();
        }
      });

      setVideoState(VideoState.READY);

      // Tentar reproduzir
      await attemptPlay();

    } catch (error) {
      console.error('Erro na inicialização do vídeo:', error);
      handleVideoError(error as Error);
    }
  };

  // Função para tentar reproduzir o vídeo
  const attemptPlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      // Para webOS, aguardar um pouco antes de tentar play
      if (isWebOS) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Verificar se o vídeo está pronto
      if (video.readyState < 3) {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Vídeo não ficou pronto para reprodução'));
          }, playTimeout);

          const onCanPlay = () => {
            clearTimeout(timeout);
            video.removeEventListener('canplay', onCanPlay);
            resolve();
          };

          video.addEventListener('canplay', onCanPlay);
          
          if (video.readyState >= 3) {
            onCanPlay();
          }
        });
      }

      // Tentar reproduzir
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        await playPromise;
      }

      setVideoState(VideoState.PLAYING);
      setRetryCount(0);
      console.log('Vídeo reproduzindo com sucesso');

    } catch (error) {
      console.error('Erro ao reproduzir vídeo:', error);
      throw error;
    }
  };

  // Função para lidar com erros
  const handleVideoError = (error: Error) => {
    console.error('Video error:', error);
    setErrorMessage(error.message || 'Erro desconhecido');
    
    if (retryCount < maxRetries) {
      console.log(`Tentando novamente (${retryCount + 1}/${maxRetries})`);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 2000);
    } else {
      setVideoState(VideoState.ERROR);
    }
  };

  // Função de retry manual
  const handleRetry = () => {
    console.log('Retry manual iniciado');
    setRetryCount(0);
    setVideoState(VideoState.LOADING);
    setErrorMessage('');
    
    // Reinicializar vídeo
    setTimeout(() => {
      initializeVideo();
    }, 500);
  };

  // Effect principal
  useEffect(() => {
    if (!videoRef.current) return;

    initializeVideo();

    // Cleanup
    return () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    };
  }, [videoUrl, retryCount]);

  // Event listeners para monitoramento
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleWaiting = () => {
      console.log('Video waiting/buffering');
      if (videoState === VideoState.PLAYING) {
        // Não mudar estado se já estiver reproduzindo
        return;
      }
    };

    const handlePlaying = () => {
      console.log('Video playing event');
      setVideoState(VideoState.PLAYING);
    };

    const handlePause = () => {
      console.log('Video paused');
      // Tentar retomar reprodução se foi pausado inesperadamente
      if (videoState === VideoState.PLAYING) {
        setTimeout(() => {
          video.play().catch(console.error);
        }, 1000);
      }
    };

    const handleStalled = () => {
      console.log('Video stalled');
      // Tentar recarregar se travou
      setTimeout(() => {
        if (video.readyState < 3) {
          video.load();
        }
      }, 2000);
    };

    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('stalled', handleStalled);

    return () => {
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('stalled', handleStalled);
    };
  }, [videoState]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent">
      {/* Elemento de vídeo */}
      <video
        ref={videoRef}
        className={`${className} w-full h-full`}
        muted
        loop
        autoPlay
        playsInline
        preload={isWebOS ? "auto" : "metadata"}
        style={{
          objectFit: 'scale-down',
          objectPosition: 'center',
          display: videoState === VideoState.PLAYING ? 'block' : 'none',
          backgroundColor: 'transparent',
          // Configurações específicas para webOS
          ...(isWebOS && {
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%'
          })
        }}
        // Atributos específicos para webOS
        {...(isWebOS && {
          'webkit-playsinline': 'true',
          'x5-playsinline': 'true',
          'playsinline': 'true'
        })}
      >
        <source src={getAbsoluteVideoUrl()} type="video/mp4" />
        Seu navegador não suporta reprodução de vídeo.
      </video>

      {/* Estado de carregamento */}
      {(videoState === VideoState.LOADING || videoState === VideoState.READY) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/90 to-blue-700/90 text-white">
          <div className="text-center p-4 max-w-md">
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg md:text-2xl font-medium mb-2">
              {videoState === VideoState.READY ? 'Iniciando reprodução...' : 'Carregando vídeo...'}
            </p>
            <p className="text-sm md:text-base text-white/80">
              {isWebOS ? "Otimizando para webOS TV..." : "Aguarde um momento..."}
            </p>
            {retryCount > 0 && (
              <p className="text-xs md:text-sm text-white/60 mt-2">
                Tentativa {retryCount + 1} de {maxRetries + 1}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Estado de erro */}
      {videoState === VideoState.ERROR && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-900/90 to-red-700/90 text-white">
          <div className="text-center p-4 max-w-md">
            <div className="w-12 h-12 md:w-16 md:h-16 mb-4 mx-auto text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <p className="text-lg md:text-2xl font-medium mb-2">Erro ao carregar vídeo</p>
            <p className="text-sm md:text-base text-white/80 mb-2">
              {isWebOS ? "Problema na reprodução webOS TV" : "Verifique sua conexão"}
            </p>
            {errorMessage && (
              <p className="text-xs md:text-sm text-white/60 mb-4 font-mono">
                {errorMessage}
              </p>
            )}
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
          <div>webOS TV: {isWebOS ? 'Sim' : 'Não'}</div>
          <div>Retry: {retryCount}/{maxRetries}</div>
          <div>URL: {getAbsoluteVideoUrl().substring(0, 50)}...</div>
          <div>Tela: {window.innerWidth}x{window.innerHeight}</div>
          {videoRef.current && (
            <div>Ready: {videoRef.current.readyState}</div>
          )}
        </div>
      )}
    </div>
  );
};

