/**
 * 06-frontend-wallet-hook.tsx
 * Complete production-ready React / Next.js hook for dApp developers.
 * Handles connecting to XOLIX browser wallet (or MetaMask), detecting accounts,
 * switching networks to XOLIX Mainnet / Testnet, and sending transactions.
 */
import React, { useState, useEffect, useCallback } from 'react';

// Window Ethereum / Xolix type definition
declare global {
  interface Window {
    ethereum?: any;
    xolix?: any;
  }
}

export interface NetworkConfig {
  chainIdHex: string;
  chainIdDec: number;
  chainName: string;
  rpcUrl: string;
  explorerUrl: string;
  currencySymbol: string;
}

export const XOLIX_MAINNET: NetworkConfig = {
  chainIdHex: '0xafbe', // 44990
  chainIdDec: 44990,
  chainName: 'XOLIX FLUID Mainnet',
  rpcUrl: 'https://rpc.xolix.io',
  explorerUrl: 'https://scan.xolix.io',
  currencySymbol: 'XOLT'
};

export const XOLIX_TESTNET: NetworkConfig = {
  chainIdHex: '0xafbf', // 44991
  chainIdDec: 44991,
  chainName: 'XOLIX FLUID Testnet',
  rpcUrl: 'https://testnet-rpc.xolix.io',
  explorerUrl: 'https://scan.xolix.io/testnet',
  currencySymbol: 'tXOL'
};

export function useXolixWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProvider = useCallback(() => {
    return window.xolix || window.ethereum || null;
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      setError('No Web3 wallet detected. Please install Xolix Wallet or MetaMask.');
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      }

      const currentChainHex = await provider.request({ method: 'eth_chainId' });
      setChainId(parseInt(currentChainHex, 16));
    } catch (err: any) {
      setError(err?.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  }, [getProvider]);

  // Switch or Add Xolix Network
  const switchNetwork = useCallback(async (targetNetwork: NetworkConfig) => {
    const provider = getProvider();
    if (!provider) return;

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetNetwork.chainIdHex }]
      });
    } catch (switchError: any) {
      // Error 4902 indicates chain is not added yet; prompt user to add it
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: targetNetwork.chainIdHex,
                chainName: targetNetwork.chainName,
                rpcUrls: [targetNetwork.rpcUrl],
                blockExplorerUrls: [targetNetwork.explorerUrl],
                nativeCurrency: {
                  name: targetNetwork.currencySymbol,
                  symbol: targetNetwork.currencySymbol,
                  decimals: 18
                }
              }
            ]
          });
        } catch (addError: any) {
          setError(addError?.message || 'Failed to add Xolix network to wallet');
        }
      } else {
        setError(switchError?.message || 'Failed to switch network');
      }
    }
  }, [getProvider]);

  // Listen to account and chain change events
  useEffect(() => {
    const provider = getProvider();
    if (!provider || !provider.on) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null);
      } else {
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainHex: string) => {
      setChainId(parseInt(chainHex, 16));
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);

    return () => {
      if (provider.removeListener) {
        provider.removeListener('accountsChanged', handleAccountsChanged);
        provider.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [getProvider]);

  return {
    account,
    chainId,
    isConnecting,
    error,
    connectWallet,
    switchNetwork,
    isConnected: !!account
  };
}
