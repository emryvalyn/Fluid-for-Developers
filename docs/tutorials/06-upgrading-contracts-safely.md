# Tutorial 6: Upgrading Contracts Safely Without Proxies

In this tutorial, you will walk through the full lifecycle of upgrading a deployed native Fluid contract from Version 1 to Version 2 without proxies.

---

## 1. Initial State (Version 1)

Assume you deployed `VaultV1`:

```fluid
version 1.0;

contract VaultV1 upgradeable {
    state persistent {
        owner: address;
        governance: address;
        totalDeposits: uint256;
    }

    constructor(gov: address) {
        state.owner = msg.sender;
        state.governance = gov;
        state.totalDeposits = 0;
    }
}
```

---

## 2. Designing Version 2 (Strict Append-Only Rule)

You need to add an emergency pause flag and a yield fee variable:

```fluid
version 1.0;

contract VaultV2 upgradeable {
    state persistent {
        owner: address;
        governance: address;
        totalDeposits: uint256;
        // APPENDED: Safe schema extensions
        isPaused: bool;
        yieldFeeBasisPoints: uint16;
    }

    public setYieldFee(fee: uint16) {
        state.yieldFeeBasisPoints = fee;
    }
}
```

---

## 3. Simulating Upgrade Compatibility

Before proposing to governance, run the dry-run simulation using the SDK:

```typescript
import { FluidContractManager, JsonRpcProvider } from '@xolix/sdk';
import * as fs from 'fs';

async function main() {
  const provider = new JsonRpcProvider({ url: 'https://testnet-rpc.xolix.io' });
  const manager = new FluidContractManager(provider);

  const deployedAddress = 'xolc1qvault00000000000000000000000000000000';
  const v2Bytecode = fs.readFileSync('./build/VaultV2.xls', 'utf8');

  // Verify compatibility against live state trie
  const report = await manager.simulateUpgrade(deployedAddress, v2Bytecode);

  console.log('--- Upgrade Simulation ---');
  console.log('State Compatibility Valid?:', report.stateCompatibility);
  
  if (!report.stateCompatibility) {
    console.error('Upgrade will fail! Reason:', report.failureReason);
    return;
  }

  console.log('Safe to proceed! Submit upgrade proposal to Timelock governance.');
}

main();
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
