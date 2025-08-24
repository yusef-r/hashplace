import { useWalletContext } from '@/contexts/WalletContext';

/**
 * Simple hook to access wallet context
 */
export const useWallet = () => {
  return useWalletContext();
};