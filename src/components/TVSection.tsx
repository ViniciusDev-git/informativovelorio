import { VideoPlayer } from "./VideoPlayer";

interface TVSectionProps {
  videoUrl?: string;
}

export const TVSection = ({ videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" }: TVSectionProps) => {
  return (
    <div className="w-full h-full relative">
      {/* Logo de fundo com opacidade */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-10 pointer-events-none"
        style={{
          backgroundImage: "url('/public/images/logo-background.svg')"
        }}
      />
      
      {/* Video Player - Full container */}
      <div className="relative z-10 w-full h-full p-3 md:p-6">
        <VideoPlayer 
          videoUrl={videoUrl}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};
