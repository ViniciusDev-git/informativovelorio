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
      // Configure video for kiosk mode
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      
      // Attempt to play the video
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.log("Video autoplay blocked:", error);
        }
      };

      playVideo();
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
        preload="metadata"
        style={{
          objectFit: 'cover',
          objectPosition: 'center'
        }}
        onError={(e) => {
          console.error('Video error:', e);
        }}
      >
        <source src={videoUrl} type="video/mp4" />
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-cortel-blue-dark to-cortel-blue-medium text-white">
          <div className="text-center p-4">
            <div className="w-8 h-8 md:w-12 md:h-12 border-2 md:border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2 md:mb-4"></div>
            <p className="text-sm md:text-xl font-medium">Carregando...</p>
          </div>
        </div>
      </video>
    </div>
  );
};