# Integrating with Ethers.js (v5 & v6) & Web3.js

Developers utilizing [Ethers.js](https://docs.ethers.org/) can connect seamlessly to XOLIX FLUID RPC nodes.

---

## 1. Ethers.js v6 Setup

```typescript
import { ethers } from 'ethers';

// 1. Connect to Browser Provider (MetaMask or Xolix Extension)
const browserProvider = new ethers.BrowserProvider(window.ethereum);
const signer = await browserProvider.getSigner();
console.log('User address:', await signer.getAddress());

// 2. Or Connect to Headless JSON-RPC Node
const jsonRpcProvider = new ethers.JsonRpcProvider('https://rpc.xolix.io', {
  chainId: 44990,
  name: 'xolix'
});

// 3. Query Balance
const balance = await jsonRpcProvider.getBalance('0x4296bA...');
console.log('Balance in XOLT:', ethers.formatEther(balance));
```

---

## 2. Calling Smart Contracts with Ethers.js

```typescript
const contractAddress = '0xYourContractAddress...';
const abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)'
];

const contract = new ethers.Contract(contractAddress, abi, signer);

// Read (Zero Gas)
const userBalance = await contract.balanceOf(await signer.getAddress());
console.log('Tokens:', ethers.formatUnits(userBalance, 18));

// Write (Broadcast Transaction)
const tx = await contract.transfer('0xRecipient...', ethers.parseUnits('15.0', 18));
console.log('Tx Submitted:', tx.hash);

// Wait for 1 confirmation
const receipt = await tx.wait();
console.log('Confirmed in block:', receipt.blockNumber);
```

---

## 3. Web3.js Integration

```javascript
import Web3 from 'web3';

const web3 = new Web3('https://rpc.xolix.io');

const blockNumber = await web3.eth.getBlockNumber();
console.log('Latest block height:', blockNumber);
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
