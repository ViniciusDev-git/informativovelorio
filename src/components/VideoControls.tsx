import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VideoControlsProps {
  onVideoConfigChange: (config: VideoConfig) => void;
  initialConfig: VideoConfig;
}

export interface VideoConfig {
  width: string;
  height: string;
  objectFit: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  objectPosition: string;
}

export const VideoControls = ({ onVideoConfigChange, initialConfig }: VideoControlsProps) => {
  const [config, setConfig] = useState<VideoConfig>(initialConfig);
  const [isVisible, setIsVisible] = useState(false);

  const handleConfigChange = (key: keyof VideoConfig, value: string) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onVideoConfigChange(newConfig);
  };

  const resetToDefault = () => {
    const defaultConfig: VideoConfig = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center'
    };
    setConfig(defaultConfig);
    onVideoConfigChange(defaultConfig);
  };

  // Controle de visibilidade via teclado (Ctrl + V)
  useState(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  });

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-black/50 hover:bg-black/70 text-white text-xs px-2 py-1"
          size="sm"
        >
          Controles do Vídeo
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <Card className="bg-black/80 backdrop-blur-sm text-white border-white/20">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium">Controles do Vídeo</CardTitle>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-1 h-auto"
            >
              ✕
            </Button>
          </div>
          <p className="text-xs text-white/70">Pressione Ctrl+V para mostrar/ocultar</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Largura */}
          <div className="space-y-2">
            <Label htmlFor="width" className="text-xs">Largura</Label>
            <Input
              id="width"
              value={config.width}
              onChange={(e) => handleConfigChange('width', e.target.value)}
              placeholder="100%"
              className="bg-white/10 border-white/20 text-white text-xs h-8"
            />
          </div>

          {/* Altura */}
          <div className="space-y-2">
            <Label htmlFor="height" className="text-xs">Altura</Label>
            <Input
              id="height"
              value={config.height}
              onChange={(e) => handleConfigChange('height', e.target.value)}
              placeholder="100%"
              className="bg-white/10 border-white/20 text-white text-xs h-8"
            />
          </div>

          {/* Object Fit */}
          <div className="space-y-2">
            <Label className="text-xs">Ajuste do Vídeo</Label>
            <Select
              value={config.objectFit}
              onValueChange={(value) => handleConfigChange('objectFit', value)}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white text-xs h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="cover" className="text-white text-xs">Cover (Preencher)</SelectItem>
                <SelectItem value="contain" className="text-white text-xs">Contain (Ajustar)</SelectItem>
                <SelectItem value="fill" className="text-white text-xs">Fill (Esticar)</SelectItem>
                <SelectItem value="scale-down" className="text-white text-xs">Scale Down</SelectItem>
                <SelectItem value="none" className="text-white text-xs">None (Original)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Object Position */}
          <div className="space-y-2">
            <Label htmlFor="position" className="text-xs">Posição</Label>
            <Select
              value={config.objectPosition}
              onValueChange={(value) => handleConfigChange('objectPosition', value)}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white text-xs h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                <SelectItem value="center" className="text-white text-xs">Centro</SelectItem>
                <SelectItem value="top" className="text-white text-xs">Topo</SelectItem>
                <SelectItem value="bottom" className="text-white text-xs">Base</SelectItem>
                <SelectItem value="left" className="text-white text-xs">Esquerda</SelectItem>
                <SelectItem value="right" className="text-white text-xs">Direita</SelectItem>
                <SelectItem value="top left" className="text-white text-xs">Topo Esquerda</SelectItem>
                <SelectItem value="top right" className="text-white text-xs">Topo Direita</SelectItem>
                <SelectItem value="bottom left" className="text-white text-xs">Base Esquerda</SelectItem>
                <SelectItem value="bottom right" className="text-white text-xs">Base Direita</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botão Reset */}
          <Button
            onClick={resetToDefault}
            variant="outline"
            size="sm"
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs h-8"
          >
            Restaurar Padrão
          </Button>

          {/* Informações atuais */}
          <div className="text-xs text-white/70 space-y-1">
            <div>Largura: {config.width}</div>
            <div>Altura: {config.height}</div>
            <div>Ajuste: {config.objectFit}</div>
            <div>Posição: {config.objectPosition}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

