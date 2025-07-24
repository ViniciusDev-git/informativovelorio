import { VideoPlayer } from "./VideoPlayer";

interface TVSectionProps {
  videoUrl?: string;
}

export const TVSection = ({ 
  videoUrl = "/videos/video3.mp4" 
}: TVSectionProps) => {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-10 pointer-events-none"
        style={{
          backgroundImage: "url('/images/logo-background.svg')",
          backgroundSize: 'contain',
          backgroundPosition: 'center'
        }}
      />
      <div className="relative z-10 w-full h-full">
        <VideoPlayer 
          videoUrl={videoUrl}
          className="w-full h-full object-scale-down"
        />
      </div>
    </div>
  );
};
