# Providers, JSON-RPC & Real-Time WebSockets

`JsonRpcProvider` and `WebSocketProvider` are the primary communication abstractions for reading chain data, listening to new blocks, and broadcasting transactions.

---

## 1. Initializing Providers

### HTTP Provider (Standard RPC)
```typescript
import { JsonRpcProvider } from '@xolix/sdk';

// Connect to Mainnet
const mainnetProvider = new JsonRpcProvider({
  url: 'https://rpc.xolix.io',
  timeoutMs: 15000
});

// Connect to Testnet
const testnetProvider = new JsonRpcProvider({
  url: 'https://testnet-rpc.xolix.io'
});
```

### WebSocket Provider (Real-Time Events)
```typescript
import { WebSocketProvider } from '@xolix/sdk';

const wsProvider = new WebSocketProvider('wss://ws.xolix.io');

// Listen to incoming blocks
wsProvider.on('block', (blockNumber) => {
  console.log(`New block mined: #${blockNumber}`);
});
```

---

## 2. Common Provider Methods

| Method | Return Type | Description |
| :--- | :--- | :--- |
| `getChainId()` | `Promise<number>` | Returns active chain ID (`44990` or `44991`). |
| `getBlockNumber()` | `Promise<number>` | Returns latest mined block height. |
| `getBalance(address)` | `Promise<bigint>` | Returns native coin balance in wei. |
| `getBalances(address)` | `Promise<Balances>` | Returns multi-token portfolio (`xolt`, `gxo`, `qusd`). |
| `getTransaction(txHash)`| `Promise<Tx>` | Fetches transaction metadata. |
| `waitForTransaction(txHash)` | `Promise<Receipt>` | Polls until transaction is confirmed in a block. |
| `simulatePreflight(signedTx)`| `Promise<Report>` | Executes node preflight simulation. |
| `getFeeData()` | `Promise<FeeData>` | Queries recommended gas price and base fee. |

---

## 3. Querying Multi-Token Balances

XOLIX nodes provide a native batch-balance endpoint, eliminating the need for multicall smart contracts:

```typescript
const balances = await provider.getBalances('xol1q7k50a2g...');

console.log(`XOLT: ${balances.xolt.toString()}`);
console.log(`GXO:  ${balances.gxo.toString()}`);
console.log(`QUSD: ${balances.qusd.toString()}`);
```

---

## 4. Waiting for Confirmations

```typescript
console.log('Waiting for block confirmation...');
const receipt = await provider.waitForTransaction(txHash, 1, 60000); // 1 confirmation, 60s timeout

if (receipt.status === 1) {
  console.log(`Transaction confirmed in Block #${receipt.blockNumber}`);
  console.log(`Gas / XCU Used: ${receipt.gasUsed}`);
} else {
  console.error('Transaction reverted on-chain!');
}
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
