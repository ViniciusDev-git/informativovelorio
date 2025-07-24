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

// Detectar possíveis problemas de configuração da TV
const detectTVConfigIssues = () => {
  const issues = [];
  
  // Verificar memória disponível
  if ((performance as any).memory) {
    const memInfo = (performance as any).memory;
    if (memInfo.usedJSHeapSize > 50000000) { // 50MB
      issues.push('Alto uso de memória detectado');
    }
  }
  
  // Verificar WebGL (hardware acceleration)
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) {
    issues.push('WebGL não disponível - possível problema de aceleração de hardware');
  }
  
  // Verificar se há indicadores de Energy Saving ativo
  // (Isso é uma heurística baseada em mudanças de brilho)
  const brightness = window.screen?.brightness;
  if (brightness && brightness < 0.8) {
    issues.push('Possível Energy Saving Mode ativo');
  }
  
  return issues;
};

export const VideoPlayer = ({ videoUrl, className }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoState, setVideoState] = useState<VideoState>(VideoState.LOADING);
  const [isWebOS] = useState(detectWebOSTV());
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tvIssues] = useState(detectTVConfigIssues());
  
  const maxRetries = 5;
  const playTimeout = isWebOS ? 15000 : 7000;

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

  // Função para configurar vídeo otimizado para webOS
  const configureVideoForWebOS = (video: HTMLVideoElement) => {
    // Configurações básicas
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    
    if (isWebOS) {
      // Configurações específicas para webOS
      video.preload = "auto";
      video.crossOrigin = "anonymous";
      
      // Atributos específicos para webOS
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('x5-playsinline', 'true');
      video.setAttribute('playsinline', 'true');
      
      // Desabilitar controles nativos
      video.controls = false;
      video.disablePictureInPicture = true;
      
      // Configurações para evitar problemas de flickering
      video.style.willChange = 'auto'; // Evitar forçar compositing
      video.style.transform = 'translateZ(0)'; // Forçar layer de hardware
      
      // Configurações de buffer mais conservadoras
      if ('buffered' in video) {
        video.setAttribute('preload', 'auto');
      }
    } else {
      video.preload = "metadata";
    }
  };

  // Função principal de inicialização do vídeo
  const initializeVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    console.log('Initializing video:', {
      isWebOS,
      videoUrl: getAbsoluteVideoUrl(),
      retryCount,
      tvIssues
    });

    try {
      // Reset do estado
      setVideoState(VideoState.LOADING);
      setErrorMessage('');
      
      // Configurar vídeo
      configureVideoForWebOS(video);

      // Definir source
      const absoluteUrl = getAbsoluteVideoUrl();
      if (video.src !== absoluteUrl) {
        video.src = absoluteUrl;
      }

      // Para webOS, aguardar um pouco antes de carregar
      if (isWebOS) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Aguardar carregamento dos metadados
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.warn('Timeout ao carregar metadados do vídeo');
          reject(new Error('Timeout ao carregar metadados do vídeo'));
        }, playTimeout);

        const onLoadedMetadata = () => {
          console.log('loadedmetadata event fired');
          clearTimeout(timeout);
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
          video.removeEventListener('error', onError);
          resolve();
        };

        const onError = (e: Event) => {
          console.error('Error event during metadata load:', e);
          clearTimeout(timeout);
          video.removeEventListener('loadedmetadata', onLoadedMetadata);
          video.removeEventListener('error', onError);
          reject(new Error(`Erro ao carregar vídeo: ${(e as any).message || 'Erro desconhecido'}`));
        };

        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('error', onError);

        // Forçar carregamento se necessário
        if (video.readyState >= 1) {
          console.log('Video already has metadata, resolving immediately');
          onLoadedMetadata();
        } else {
          console.log('Loading video for metadata');
          video.load();
        }
      });

      setVideoState(VideoState.READY);
      console.log('Video is READY, attempting play...');
      
      // Para webOS, aguardar mais um pouco antes de tentar reproduzir
      if (isWebOS) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
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

    console.log('Attempting to play video...');
    try {
      // Verificar se o vídeo está pronto para reprodução
      if (video.readyState < 3) { // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
        console.log(`Video not ready for play (readyState: ${video.readyState}), waiting for canplay`);
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            console.warn('Timeout waiting for canplay event');
            reject(new Error('Vídeo não ficou pronto para reprodução (canplay timeout)'));
          }, playTimeout);

          const onCanPlay = () => {
            console.log('canplay event fired');
            clearTimeout(timeout);
            video.removeEventListener('canplay', onCanPlay);
            resolve();
          };

          video.addEventListener('canplay', onCanPlay);
          
          if (video.readyState >= 3) {
            console.log('Video already canplay, resolving immediately');
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
    console.error('Video error handler:', error);
    setErrorMessage(error.message || 'Erro desconhecido');
    
    if (retryCount < maxRetries) {
      console.log(`Tentando novamente (${retryCount + 1}/${maxRetries})`);
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 3000);
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
      console.log('Video waiting/buffering event');
    };

    const handlePlaying = () => {
      console.log('Video playing event');
      setVideoState(VideoState.PLAYING);
    };

    const handlePause = () => {
      console.log('Video paused event');
      // Para webOS, tentar retomar reprodução mais agressivamente
      if (videoState === VideoState.PLAYING && isWebOS) {
        console.log('Attempting to resume playback after unexpected pause (webOS)');
        setTimeout(() => {
          video.play().catch(err => console.error('Error resuming play:', err));
        }, 500);
      }
    };

    const handleStalled = () => {
      console.log('Video stalled event');
      // Para webOS, tentar recarregar mais rapidamente
      if (isWebOS) {
        console.log('Attempting to reload video after stalled event (webOS)');
        setTimeout(() => {
          if (video.readyState < 3) {
            video.load();
          }
        }, 1000);
      }
    };

    const handleEnded = () => {
      console.log('Video ended event, replaying...');
      video.play().catch(err => console.error('Error replaying video:', err));
    };

    // Event listener específico para webOS para detectar problemas de flickering
    const handleTimeUpdate = () => {
      if (isWebOS && video.currentTime > 0) {
        // Se o vídeo está reproduzindo normalmente, garantir que está visível
        if (videoState !== VideoState.PLAYING) {
          setVideoState(VideoState.PLAYING);
        }
      }
    };

    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('pause', handlePause);
    video.addEventListener('stalled', handleStalled);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('stalled', handleStalled);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoState, isWebOS]);

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
          objectFit: 'contain', // Usar 'contain' para evitar cortes
          objectPosition: 'center',
          display: videoState === VideoState.PLAYING ? 'block' : 'none',
          backgroundColor: 'transparent',
          // Configurações específicas para webOS para evitar flickering
          ...(isWebOS && {
            width: '100%',
            height: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            willChange: 'auto',
            transform: 'translateZ(0)'
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
            {tvIssues.length > 0 && isWebOS && (
              <div className="mt-4 text-xs text-yellow-200">
                <p>⚠️ Possíveis problemas detectados:</p>
                <ul className="text-left mt-1">
                  {tvIssues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>
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
              {isWebOS ? "Verifique as configurações da TV" : "Verifique sua conexão"}
            </p>
            {isWebOS && (
              <div className="text-xs text-yellow-200 mb-4">
                <p>💡 Dica: Verifique se Energy Saving Mode e TruMotion estão desabilitados nas configurações da TV</p>
              </div>
            )}
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
          {tvIssues.length > 0 && (
            <div className="mt-1 text-yellow-300">
              Issues: {tvIssues.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};