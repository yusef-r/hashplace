import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Group } from 'react-konva';
import { CANVAS_SIZE, PIXEL_SIZE } from '@/config/hedera';
import { CanvasState } from '@/hooks/useCanvas';

interface CanvasProps {
  canvasData: CanvasState;
  selectedPixel: { x: number; y: number } | null;
  isLoading: boolean;
  onPixelClick: (x: number, y: number) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  canvasData,
  selectedPixel,
  isLoading,
  onPixelClick,
}) => {
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const canvasWidth = CANVAS_SIZE * PIXEL_SIZE;
  const canvasHeight = CANVAS_SIZE * PIXEL_SIZE;

  // Handle responsive canvas sizing
  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current && stageRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const scale = Math.min(1, containerWidth / canvasWidth);
        stageRef.current.width(canvasWidth * scale);
        stageRef.current.height(canvasHeight * scale);
        stageRef.current.scale({ x: scale, y: scale });
      }
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, [canvasWidth, canvasHeight]);

  const handleStageClick = (e: any) => {
    if (isLoading) return;
    
    const pos = e.target.getStage().getPointerPosition();
    const scale = stageRef.current?.scaleX() || 1;
    
    const x = Math.floor((pos.x / scale) / PIXEL_SIZE);
    const y = Math.floor((pos.y / scale) / PIXEL_SIZE);
    
    if (x >= 0 && x < CANVAS_SIZE && y >= 0 && y < CANVAS_SIZE) {
      onPixelClick(x, y);
    }
  };

  const renderPixels = () => {
    const pixels = [];
    
    // Render all pixels in the grid
    for (let x = 0; x < CANVAS_SIZE; x++) {
      for (let y = 0; y < CANVAS_SIZE; y++) {
        const key = `${x},${y}`;
        const pixelData = canvasData[key];
        const isSelected = selectedPixel && selectedPixel.x === x && selectedPixel.y === y;
        
        pixels.push(
          <Rect
            key={key}
            x={x * PIXEL_SIZE}
            y={y * PIXEL_SIZE}
            width={PIXEL_SIZE}
            height={PIXEL_SIZE}
            fill={pixelData ? pixelData.color : '#1a1a2e'}
            stroke={isSelected ? '#00ff88' : '#2d3748'}
            strokeWidth={isSelected ? 2 : 0.5}
            opacity={isLoading ? 0.6 : 1}
          />
        );
      }
    }
    
    return pixels;
  };

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-4xl mx-auto p-4 bg-card rounded-lg border border-border neon-glow"
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
          Hedera Place Canvas
        </h2>
        <p className="text-muted-foreground">
          Click on any pixel to select it, then choose a color and place your pixel!
        </p>
      </div>
      
      <div className="bg-canvas-bg rounded border border-pixel-grid pixel-grid overflow-hidden">
        <Stage
          ref={stageRef}
          width={canvasWidth}
          height={canvasHeight}
          onClick={handleStageClick}
        >
          <Layer>
            <Group>
              {renderPixels()}
            </Group>
          </Layer>
        </Stage>
      </div>
      
      {selectedPixel && (
        <div className="mt-4 p-3 bg-secondary rounded border border-border">
          <p className="text-sm text-foreground">
            Selected: <span className="text-primary font-mono">({selectedPixel.x}, {selectedPixel.y})</span>
          </p>
          {canvasData[`${selectedPixel.x},${selectedPixel.y}`] && (
            <p className="text-xs text-muted-foreground mt-1">
              Current color: {canvasData[`${selectedPixel.x},${selectedPixel.y}`].color}
            </p>
          )}
        </div>
      )}
      
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
          <div className="text-primary animate-pulse">Loading canvas...</div>
        </div>
      )}
    </div>
  );
};