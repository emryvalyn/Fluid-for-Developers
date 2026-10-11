# Integrating React DApps with Wagmi v2 & Viem

For React and Next.js applications, [Wagmi](https://wagmi.sh/) and [Viem](https://viem.sh/) provide stateful React hooks and utilities.

---

## 1. Defining the XOLIX Chain in Viem

```typescript
// lib/chains.ts
import { defineChain } from 'viem';

export const xolixMainnet = defineChain({
  id: 44990,
  name: 'XOLIX FLUID Mainnet',
  nativeCurrency: {
    name: 'XOLT',
    symbol: 'XOLT',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.xolix.io'] },
  },
  blockExplorers: {
    default: { name: 'XolixScan', url: 'https://scan.xolix.io' },
  },
});

export const xolixTestnet = defineChain({
  id: 44991,
  name: 'XOLIX FLUID Testnet',
  nativeCurrency: {
    name: 'tXOL',
    symbol: 'tXOL',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.xolix.io'] },
  },
  blockExplorers: {
    default: { name: 'XolixScan Testnet', url: 'https://scan.xolix.io/testnet' },
  },
  testnet: true,
});
```

---

## 2. Wagmi Configuration (`wagmi.config.ts`)

```typescript
// lib/wagmi.ts
import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { xolixMainnet, xolixTestnet } from './chains';

export const config = createConfig({
  chains: [xolixMainnet, xolixTestnet],
  connectors: [injected()],
  transports: {
    [xolixMainnet.id]: http('https://rpc.xolix.io'),
    [xolixTestnet.id]: http('https://testnet-rpc.xolix.io'),
  },
});
```

---

## 3. Reading and Writing in React Components

```tsx
'use client';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { parseEther } from 'viem';

const TOKEN_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;

export function TokenDashboard() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();

  // Read User Balance
  const { data: balance } = useReadContract({
    abi: TOKEN_ABI,
    address: '0xYourTokenAddress...',
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const handleTransfer = () => {
    writeContract({
      abi: TOKEN_ABI,
      address: '0xYourTokenAddress...',
      functionName: 'transfer',
      args: ['0xRecipient...', parseEther('10.0')],
    });
  };

  if (!isConnected) return <p>Please connect your wallet.</p>;

  return (
    <div>
      <p>Your Balance: {balance ? balance.toString() : 'Loading...'}</p>
      <button onClick={handleTransfer}>Transfer 10 Tokens</button>
    </div>
  );
}
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
