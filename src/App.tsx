import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from '@/contexts/WalletContext';
import { Canvas } from '@/components/Canvas';
import { Controls } from '@/components/Controls';
import { useCanvas } from '@/hooks/useCanvas';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';

const queryClient = new QueryClient();

// Main Hedera Place component
const HederaPlace: React.FC = () => {
  const {
    canvasData,
    selectedPixel,
    selectedColor,
    isLoading,
    isSubmitting,
    setSelectedPixel,
    setSelectedColor,
    fetchCanvasState,
    submitPixel,
  } = useCanvas();

  // Auto-fetch canvas state on mount
  useEffect(() => {
    fetchCanvasState();
  }, [fetchCanvasState]);

  const handlePixelClick = (x: number, y: number) => {
    setSelectedPixel({ x, y });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
                Hedera Place
              </h1>
              <span className="text-sm text-muted-foreground border border-border px-2 py-1 rounded font-mono">
                TESTNET
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                asChild
              >
                <a 
                  href="https://hedera.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Hedera
                </a>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                asChild
              >
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  Code
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Collaborative Pixel Art on Hedera
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join the decentralized pixel art canvas! Connect your wallet, select a pixel, 
            choose your color, and place your mark on the Hedera blockchain. 
            Each pixel costs 0.001 HBAR and is permanently recorded.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Canvas - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Canvas
              canvasData={canvasData}
              selectedPixel={selectedPixel}
              isLoading={isLoading}
              onPixelClick={handlePixelClick}
            />
          </div>

          {/* Controls - Takes up 1 column */}
          <div className="lg:col-span-1">
            <Controls
              selectedPixel={selectedPixel}
              selectedColor={selectedColor}
              isLoading={isLoading}
              isSubmitting={isSubmitting}
              onColorChange={setSelectedColor}
              onRefresh={fetchCanvasState}
              onSubmitPixel={submitPixel}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">
              Built with ❤️ for the Hedera ecosystem
            </p>
            <p className="text-sm">
              This is a demonstration dApp showing collaborative pixel art on Hedera's distributed ledger
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <WalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HederaPlace />} />
            <Route path="*" element={<HederaPlace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </WalletProvider>
  </QueryClientProvider>
);

export default App;