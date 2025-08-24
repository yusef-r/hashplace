import { useState, useCallback, useRef } from 'react';
import { TransferTransaction, Hbar, AccountId } from '@hashgraph/sdk';
import { useWallet } from './useWallet';
import { CANVAS_ACCOUNT_ID, MIRROR_NODE_URL, MEMO_PREFIX, CANVAS_SIZE } from '@/config/hedera';
import { useToast } from '@/hooks/use-toast';

export interface PixelData {
  x: number;
  y: number;
  color: string;
  timestamp?: number;
  owner?: string;
}

export interface CanvasState {
  [key: string]: PixelData; // key format: "x,y"
}

export interface UseCanvasReturn {
  canvasData: CanvasState;
  selectedPixel: { x: number; y: number } | null;
  selectedColor: string;
  isLoading: boolean;
  isSubmitting: boolean;
  setSelectedPixel: (pixel: { x: number; y: number } | null) => void;
  setSelectedColor: (color: string) => void;
  fetchCanvasState: () => Promise<void>;
  submitPixel: () => Promise<void>;
}

export const useCanvas = (): UseCanvasReturn => {
  const [canvasData, setCanvasData] = useState<CanvasState>({});
  const [selectedPixel, setSelectedPixel] = useState<{ x: number; y: number } | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#FF0000');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { hashconnect, accountId, pairingData, isConnected, sendTransaction } = useWallet();
  const { toast } = useToast();
  const lastFetchRef = useRef<number>(0);

  /**
   * Fetch canvas state from Hedera Mirror Node
   */
  const fetchCanvasState = useCallback(async () => {
    // Throttle requests to avoid spamming the mirror node
    const now = Date.now();
    if (now - lastFetchRef.current < 2000) {
      console.log('Throttling fetch request');
      return;
    }
    lastFetchRef.current = now;

    setIsLoading(true);
    try {
      console.log('Fetching canvas state from mirror node...');
      
      // Query transactions for the canvas account
      const response = await fetch(
        `${MIRROR_NODE_URL}/api/v1/transactions?account.id=${CANVAS_ACCOUNT_ID}&limit=1000&order=desc`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }
      
      const data = await response.json();
      const newCanvasData: CanvasState = {};
      
      // Process transactions to build canvas state
      if (data.transactions) {
        for (const transaction of data.transactions) {
          // Skip if no memo
          if (!transaction.memo_base64) continue;
          
          try {
            // Decode base64 memo
            const memoString = atob(transaction.memo_base64);
            
            // Check if it's a pixel placement memo
            if (!memoString.startsWith(MEMO_PREFIX)) continue;
            
            // Parse pixel data from memo
            const jsonPart = memoString.substring(MEMO_PREFIX.length + 1); // +1 for the separator
            const pixelData = JSON.parse(jsonPart);
            
            // Validate pixel data
            if (
              typeof pixelData.x === 'number' &&
              typeof pixelData.y === 'number' &&
              typeof pixelData.c === 'string' &&
              pixelData.x >= 0 && pixelData.x < CANVAS_SIZE &&
              pixelData.y >= 0 && pixelData.y < CANVAS_SIZE
            ) {
              const key = `${pixelData.x},${pixelData.y}`;
              
              // Only update if this is newer than existing pixel
              if (!newCanvasData[key] || transaction.consensus_timestamp > (newCanvasData[key].timestamp || 0)) {
                newCanvasData[key] = {
                  x: pixelData.x,
                  y: pixelData.y,
                  color: pixelData.c,
                  timestamp: transaction.consensus_timestamp,
                  owner: transaction.transfers?.[0]?.account || 'unknown',
                };
              }
            }
          } catch (error) {
            console.warn('Failed to parse transaction memo:', error);
          }
        }
      }
      
      setCanvasData(newCanvasData);
      console.log(`Loaded ${Object.keys(newCanvasData).length} pixels from mirror node`);
      
      toast({
        title: "Canvas Updated",
        description: `Loaded ${Object.keys(newCanvasData).length} pixels`,
      });
      
    } catch (error) {
      console.error('Failed to fetch canvas state:', error);
      toast({
        title: "Fetch Failed",
        description: "Could not load canvas data from mirror node",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Submit a pixel placement transaction
   */
  const submitPixel = useCallback(async () => {
    if (!isConnected || !sendTransaction || !selectedPixel) {
      toast({
        title: "Cannot Place Pixel",
        description: "Please connect your wallet and select a pixel",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting pixel placement...');
      
      // Create memo with pixel data
      const pixelMemo = {
        x: selectedPixel.x,
        y: selectedPixel.y,
        c: selectedColor,
      };
      
      const memoString = `${MEMO_PREFIX}:${JSON.stringify(pixelMemo)}`;
      
      // Create transfer transaction
      const transaction = new TransferTransaction()
        .addHbarTransfer(AccountId.fromString(accountId!), Hbar.fromTinybars(-1000)) // 0.00001 HBAR
        .addHbarTransfer(AccountId.fromString(CANVAS_ACCOUNT_ID), Hbar.fromTinybars(1000))
        .setTransactionMemo(memoString);

      // Convert transaction to bytes for HashConnect
      const transactionBytes = transaction.toBytes();

      // Sign and submit transaction
      const response = await sendTransaction({
        byteArray: transactionBytes,
        metadata: {
          accountToSign: accountId!,
          returnTransaction: false,
        },
      });

      console.log('Transaction submitted:', response);
      
      // Optimistically update local state
      const key = `${selectedPixel.x},${selectedPixel.y}`;
      setCanvasData(prev => ({
        ...prev,
        [key]: {
          x: selectedPixel.x,
          y: selectedPixel.y,
          color: selectedColor,
          timestamp: Date.now(),
          owner: accountId!,
        },
      }));
      
      toast({
        title: "Pixel Placed!",
        description: `Pixel placed at (${selectedPixel.x}, ${selectedPixel.y})`,
      });
      
      // Auto-refresh after a short delay to get the confirmed transaction
      setTimeout(() => {
        fetchCanvasState();
      }, 3000);
      
    } catch (error) {
      console.error('Failed to submit pixel:', error);
      toast({
        title: "Transaction Failed",
        description: "Could not place pixel. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [isConnected, sendTransaction, selectedPixel, selectedColor, accountId, toast, fetchCanvasState]);

  return {
    canvasData,
    selectedPixel,
    selectedColor,
    isLoading,
    isSubmitting,
    setSelectedPixel,
    setSelectedColor,
    fetchCanvasState,
    submitPixel,
  };
};