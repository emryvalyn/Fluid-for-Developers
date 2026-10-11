# DApp Browser Wallet Integration (EIP-1193 & MetaMask / Xolix Wallet)

This guide walks frontend developers through connecting browser wallets to the XOLIX FLUID network via the standard `window.ethereum` or `window.xolix` provider injection.

---

## 1. Requesting Wallet Connection

```javascript
async function connectWallet() {
  const provider = window.xolix || window.ethereum;
  if (!provider) {
    alert("Please install Xolix Wallet or MetaMask!");
    return;
  }

  try {
    const accounts = await provider.request({
      method: 'eth_requestAccounts'
    });
    console.log("Connected account:", accounts[0]);
    return accounts[0];
  } catch (error) {
    if (error.code === 4001) {
      console.log("User rejected the connection request.");
    } else {
      console.error("Connection failed:", error);
    }
  }
}
```

---

## 2. Programmatic Network Switching & Adding XOLIX

Prompt users to switch to the official XOLIX network, automatically adding the chain parameters if it is not already in their wallet:

```javascript
const XOLIX_MAINNET_PARAMS = {
  chainId: '0xafbe', // 44990 in hex
  chainName: 'XOLIX FLUID Mainnet',
  nativeCurrency: {
    name: 'XOLT',
    symbol: 'XOLT',
    decimals: 18
  },
  rpcUrls: ['https://rpc.xolix.io'],
  blockExplorerUrls: ['https://scan.xolix.io']
};

async function switchToXolix() {
  const provider = window.xolix || window.ethereum;
  if (!provider) return;

  try {
    // Attempt switch
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: XOLIX_MAINNET_PARAMS.chainId }]
    });
  } catch (switchError) {
    // Error 4902 means the chain has not been added to the wallet yet
    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [XOLIX_MAINNET_PARAMS]
        });
      } catch (addError) {
        console.error("Failed to add network:", addError);
      }
    } else {
      console.error("Failed to switch network:", switchError);
    }
  }
}
```

---

## 3. Handling Account & Chain Events

Maintain synchronized UI state when the user switches accounts or networks inside their wallet extension:

```javascript
const provider = window.xolix || window.ethereum;

if (provider && provider.on) {
  provider.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      console.log("User disconnected wallet");
    } else {
      console.log("Switched account to:", accounts[0]);
    }
  });

  provider.on('chainChanged', (chainIdHex) => {
    console.log("Switched chain to:", parseInt(chainIdHex, 16));
    // Recommended practice: reload window on chain change
    window.location.reload();
  });
}
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
