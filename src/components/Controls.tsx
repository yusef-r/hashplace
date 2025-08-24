import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Wallet, RefreshCw, Palette, Zap } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { DEFAULT_COLORS } from '@/config/hedera';

interface ControlsProps {
  selectedPixel: { x: number; y: number } | null;
  selectedColor: string;
  isLoading: boolean;
  isSubmitting: boolean;
  onColorChange: (color: string) => void;
  onRefresh: () => void;
  onSubmitPixel: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  selectedPixel,
  selectedColor,
  isLoading,
  isSubmitting,
  onColorChange,
  onRefresh,
  onSubmitPixel,
}) => {
  const { isConnected, accountId, connect, disconnect, isLoading: walletLoading } = useWallet();
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const handleColorChange = (color: any) => {
    onColorChange(color.hex);
  };

  const truncateAccountId = (id: string) => {
    return `${id.slice(0, 6)}...${id.slice(-4)}`;
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Wallet Connection */}
      <Card className="border-border bg-card neon-glow">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Wallet className="w-5 h-5 text-primary" />
            Wallet Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isConnected ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Connected:</span>
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  {truncateAccountId(accountId!)}
                </Badge>
              </div>
              <Button 
                onClick={disconnect} 
                variant="outline" 
                size="sm" 
                className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button 
              onClick={connect} 
              disabled={walletLoading}
              className="w-full bg-gradient-cyber text-primary-foreground hover:opacity-90 neon-glow"
            >
              {walletLoading ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Canvas Controls */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <RefreshCw className="w-5 h-5 text-primary" />
            Canvas Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={onRefresh} 
            disabled={isLoading}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground cyber-transition"
          >
            {isLoading ? 'Refreshing...' : 'Refresh Canvas'}
          </Button>
        </CardContent>
      </Card>

      {/* Color Picker */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Palette className="w-5 h-5 text-accent" />
            Color Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Color */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Selected Color:</span>
            <div 
              className="w-8 h-8 rounded border-2 border-border cursor-pointer hover:border-accent cyber-transition"
              style={{ backgroundColor: selectedColor }}
              onClick={() => setColorPickerOpen(true)}
            />
          </div>

          {/* Quick Colors */}
          <div className="grid grid-cols-5 gap-2">
            {DEFAULT_COLORS.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded border-2 cyber-transition hover:scale-110 ${
                  selectedColor === color ? 'border-accent' : 'border-border'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onColorChange(color)}
              />
            ))}
          </div>

          {/* Advanced Color Picker */}
          <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                Advanced Colors
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-border bg-popover">
              <ChromePicker
                color={selectedColor}
                onChange={handleColorChange}
                disableAlpha
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* Pixel Placement */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Zap className="w-5 h-5 text-accent" />
            Place Pixel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedPixel ? (
            <div className="space-y-3">
              <div className="text-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Position:</span>
                  <span className="font-mono text-primary">
                    ({selectedPixel.x}, {selectedPixel.y})
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Color:</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded border border-border"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <span className="font-mono text-xs">{selectedColor}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={onSubmitPixel}
                disabled={!isConnected || isSubmitting}
                className="w-full bg-gradient-cyber text-primary-foreground hover:opacity-90 neon-glow-accent disabled:opacity-50"
              >
                {isSubmitting ? 'Placing Pixel...' : 'Place Pixel (0.00001 HBAR)'}
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">
                Select a pixel on the canvas to place your art
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};