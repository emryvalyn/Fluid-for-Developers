# Proxy-Free Upgrades & Schema Evolution

In traditional Ethereum smart contract architectures, making a contract upgradeable requires complex proxy patterns (ERC-1967 Transparent Proxies, UUPS, Diamond pattern). These patterns introduce serious risks:
- Storage collision vulnerabilities
- `delegatecall` injection attacks
- Higher gas costs per function invocation (proxy overhead)
- Complex tooling and error-prone deployment pipelines

**XOLIX FLUID completely replaces proxy mechanics with Native Protocol-Level Upgrades.**

---

## 1. How Proxy-Free Upgrades Work

In XOLIX, every deployed contract possesses two distinct components managed by the protocol ledger:

1. **Contract Identity & Storage (`xolc1...`)**: The permanent address and persistent state storage. This never changes.
2. **Logic Implementation Pointer**: A cryptographic hash pointing to the active compiled XLS bytecode.

```text
               User / Integrator
                       │ (Calls constant address xolc1q9f2...)
                       ▼
       ┌───────────────────────────────┐
       │   Contract Identity Ledger    │
       │   Address: xolc1q9f2...       │
       │   Persistent Storage State    │
       ├───────────────────────────────┤
       │ Implementation Pointer Hash:  │
       │ 0x8a7b... (V1 Logic)          │  ──> Updates to 0x3f1e... (V2 Logic)
       └───────────────┬───────────────┘      via Governance Proposal
                       │
                       ▼
       ┌───────────────────────────────┐
       │   Compiled XLS Bytecode       │
       │   (Executed directly by VM)   │
       └───────────────────────────────┘
```

When an upgrade occurs, **only the implementation pointer changes**. No proxy contracts, no delegatecalls, and zero storage relocation!

---

## 2. Defining an Upgrade Policy in FluidScript

Contracts marked with the `upgradeable` keyword can declare an explicit `upgrade_policy` block:

```fluid
contract LendingProtocol upgradeable {
    state persistent {
        owner: address;
        governance: address;
        totalDeposits: uint256;
    }

    upgrade_policy {
        authority: governance;            // Only @governance can authorize updates
        timelock: 172800;                 // 48-hour mandatory timelock delay
        require_schema_compatibility: true; // VM asserts state layout is strictly appended
        require_simulation: true;         // Preflight dry-run required before activation
    }
}
```

---

## 3. Schema Append-Only Rules

To maintain absolute storage safety when upgrading from V1 to V2:

### Permitted (Safe)
- Adding new state variables to the **end** of the `state persistent` block.
- Adding new public or private functions.
- Updating algorithm logic inside existing functions.

### Prohibited (Rejected by Compiler & VM)
- Removing existing state variables.
- Changing the type of an existing state variable (e.g., `uint256` to `string`).
- Reordering state variables.

```fluid
// V1 State Layout
state persistent {
    owner: address;
    totalSupply: uint256;
}

// V2 State Layout (VALID: strictly appended)
state persistent {
    owner: address;
    totalSupply: uint256;
    isPaused: bool;          // Safe: appended at the end
    feeBasisPoints: uint16;  // Safe: appended at the end
}
```

---

## 4. Upgrading Step-by-Step with the SDK

```typescript
import { FluidContractManager } from '@xolix/sdk';

const manager = new FluidContractManager(provider);

// 1. Simulate upgrade safety
const check = await manager.simulateUpgrade('xolc1q9f2...', newV2Bytecode);
if (!check.stateCompatibility) {
  throw new Error(`Upgrade unsafe: ${check.failureReason}`);
}

// 2. Submit upgrade proposal to governance timelock
const proposalTx = manager.buildUpgradeProposal('xolc1q9f2...', newV2Bytecode);
await governanceWallet.sendTransaction(proposalTx);

// 3. After 48h timelock expires, execute upgrade atomically
await governanceWallet.sendTransaction(manager.buildExecuteUpgrade('xolc1q9f2...'));
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
