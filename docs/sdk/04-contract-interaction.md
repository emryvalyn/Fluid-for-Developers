# Smart Contract Interactions: Reads, Writes & Events

The `XolixContract` class encapsulates interactions with smart contracts on both the Native Fluid Lane (`xolc1...`) and EVM Lane (`0x...`).

---

## 1. Initializing `XolixContract`

```typescript
import { XolixContract, JsonRpcProvider, XolixWallet } from '@xolix/sdk';

const provider = new JsonRpcProvider({ url: 'https://rpc.xolix.io' });
const wallet = new XolixWallet('YOUR_PRIVATE_KEY', provider);

// Human-readable ABI or Standard JSON ABI
const ABI = [
  'function name() view returns (string)',
  'function balanceOf(address account) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];

const contractAddress = 'xolc1q9m4e7...'; // Or 0x... for EVM lane
const contract = new XolixContract(contractAddress, ABI, wallet);
```

---

## 2. Calling View Functions (`contract.read`)

View functions read persistent state without altering the blockchain ledger. They execute locally against the node's state trie with **zero gas / 0 XCU consumed**.

```typescript
import { XolixUtils } from '@xolix/sdk';

// Read string property
const name = await contract.read('name');
console.log('Token Name:', name);

// Read balance with arguments
const balance = await contract.read('balanceOf', wallet.getNativeAddress());
console.log('Balance:', XolixUtils.formatXOL(balance), 'XOLT');
```

---

## 3. Broadcasting State Mutations (`contract.write`)

State-modifying functions consume XCU, create a signed transaction, and broadcast it to the network:

```typescript
import { XolixUtils } from '@xolix/sdk';

const recipient = 'xol1qrecipient00000000000000000000000000';
const amount = XolixUtils.parseXOL('10.0');

// Execute transfer
const tx = await contract.write('transfer', recipient, amount);
console.log(`Transaction broadcast! TxHash: ${tx.txHash}`);

// Wait for block inclusion
const receipt = await provider.waitForTransaction(tx.txHash);
console.log(`Confirmed in Block #${receipt.blockNumber}`);
```

---

## 4. Querying and Listening to Events

```typescript
// Query historical events
const filter = contract.filters.Transfer(wallet.getNativeAddress(), null);
const events = await contract.queryFilter(filter, -1000); // Past 1,000 blocks

events.forEach((evt) => {
  console.log(`Sent ${evt.args.value} to ${evt.args.to} in block ${evt.blockNumber}`);
});
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
