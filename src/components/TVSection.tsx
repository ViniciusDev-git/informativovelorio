import { VideoPlayer } from "./VideoPlayer";

interface TVSectionProps {
  videoUrl?: string;
}

export const TVSection = ({ 
  videoUrl = "/videos/video3.mp4" 
}: TVSectionProps) => {
  return (
    <div className="w-full h-full bg-black">
      <VideoPlayer 
        videoUrl={videoUrl}
        className="w-full h-full"
      />
    </div>
  );
};
