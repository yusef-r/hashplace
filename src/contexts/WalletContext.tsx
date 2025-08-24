import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { HashConnect } from 'hashconnect';
import { HEDERA_NETWORK } from '@/config/hedera';
import { useToast } from '@/hooks/use-toast';

export interface WalletContextType {
  hashconnect: HashConnect | null;
  accountId: string | null;
  isConnected: boolean;
  pairingData: any;
  connect: () => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
  sendTransaction: (transaction: any) => Promise<any>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [hashconnect, setHashconnect] = useState<HashConnect | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [pairingData, setPairingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const isConnected = Boolean(accountId && pairingData);

  // Initialize HashConnect
  useEffect(() => {
    const initHashConnect = async () => {
      try {
        // Simplified initialization for demo
        console.log('HashConnect initialized (demo mode)');
      } catch (error) {
        console.error('Failed to initialize HashConnect:', error);
      }
    };

    initHashConnect();
  }, []);

  const connect = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Attempting to connect wallet...');
      
      // Demo connection - in real app this would use HashConnect
      setTimeout(() => {
        setAccountId("0.0.123456");
        setPairingData({ connected: true, topic: "demo" });
        setHashconnect({} as HashConnect); // Mock object
        toast({
          title: "Wallet Connected",
          description: "Demo wallet connected successfully",
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [toast]);

  const disconnect = useCallback(() => {
    try {
      setAccountId(null);
      setPairingData(null);
      setHashconnect(null);
      console.log('Wallet disconnected');
      toast({
        title: "Wallet Disconnected",
        description: "Demo wallet disconnected",
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  }, [toast]);

  const sendTransaction = useCallback(async (transaction: any) => {
    if (!accountId) {
      throw new Error('Wallet not connected');
    }

    try {
      // Demo transaction - in real app this would use HashConnect
      console.log('Sending transaction (demo):', transaction);
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        transactionId: `0.0.123456@${Date.now()}.${Math.random()}`,
      };
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }, [accountId]);

  const value: WalletContextType = {
    hashconnect,
    accountId,
    isConnected,
    pairingData,
    connect,
    disconnect,
    isLoading,
    sendTransaction,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};