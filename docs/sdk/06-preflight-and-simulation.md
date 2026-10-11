# Preflight Simulation & Risk Auditing Engine

Before broadcasting high-value or complex transactions to the public mempool, developers and dApp frontends should run **Node Preflight Simulation**.

---

## 1. Why Preflight Matters

Traditional blockchains require transactions to fail on-chain to discover errors, costing users gas and leaving partial traces.

XOLIX nodes expose the `simulatePreflight` RPC method, which runs a dry-run execution against the live ledger state trie inside an isolated sandbox.

---

## 2. Using `provider.simulatePreflight`

```typescript
import { JsonRpcProvider, XolixWallet, XolixUtils } from '@xolix/sdk';

const provider = new JsonRpcProvider({ url: 'https://rpc.xolix.io' });
const wallet = new XolixWallet('YOUR_PRIVATE_KEY', provider);

// 1. Prepare raw transaction
const tx = {
  from: wallet.getNativeAddress(),
  recipient: 'xolc1qdexrouter0000000000000000000000000',
  value: XolixUtils.parseXOL('20.0'),
  data: '0x38ed1739...', // Swap function call
  resourceLimit: 150000,
  gasPrice: 1000000000n,
  nonce: await provider.getTransactionCount(wallet.address)
};

// 2. Sign transaction locally
const signedTx = await wallet.signTransaction(tx);

// 3. Send to Node Preflight Sandbox
const report = await provider.simulatePreflight(signedTx);

console.log('--- Preflight Report ---');
console.log('Transaction Valid?   :', report.isValid);
console.log('Risk Score (0.0 - 1.0):', report.riskScore);
console.log('Reentrancy Flagged?  :', !report.reentrancyCheck);
console.log('Estimated Total XCU  :', report.estimatedXCU.totalXCU);
```

---

## 3. Interpreting the Simulation Report

| Field | Type | Description |
| :--- | :--- | :--- |
| `isValid` | `boolean` | `true` if all assertions, capabilities, and balances pass. |
| `riskScore` | `number` | Float between `0.0` (benign) and `1.0` (critical danger). |
| `reentrancyCheck` | `boolean` | `true` if the contract execution stayed free of reentrancy locks. |
| `invariantsValid` | `boolean` | `true` if protocol state invariants were maintained. |
| `failureReason` | `string \| undefined` | Descriptive error message if `isValid` is `false`. |
| `estimatedXCU` | `object` | Multidimensional breakdown (`cpu`, `storageRead`, `storageWrite`, `bandwidth`). |

---

## 4. Frontend Risk Interceptor Pattern

In production dApps, use the simulation report to protect users before triggering wallet signatures:

```typescript
if (report.riskScore > 0.7) {
  showWarningModal("Warning: Node preflight flagged abnormal volatility or risk in this contract.");
} else {
  proceedWithBroadcast(signedTx);
}
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
