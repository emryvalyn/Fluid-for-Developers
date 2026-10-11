# Preflight & Atomic Execution Engine

One of the foundational innovations of XOLIX FLUID is its **Two-Phase Transaction Engine**: `preflight` and `atomic`.

---

## 1. The Two-Phase Execution Model

Traditional blockchains combine validation and state mutation into a single execution stream. If a bug or reentrancy flaw occurs midway, intermediate state can leak or revert unpredictably.

FluidScript isolates execution into two clean boundaries:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. PREFLIGHT PHASE (Inspection & Assertion)                 │
│    • Validate reentrancy locks                              │
│    • Check account risk scores                              │
│    • Assert invariant preconditions                         │
│    • NO STATE MODIFICATIONS ALLOWED                         │
└──────────────────────────────┬──────────────────────────────┘
                               │ (All checks pass)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. ATOMIC PHASE (Mutation & Commit)                         │
│    • Update state balances & storage variables              │
│    • Transfer tokens or native assets                       │
│    • Emit events                                            │
│    • Guaranteed atomic commit (all-or-nothing rollback)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Writing Preflight and Atomic Blocks

```fluid
contract LiquidityPool {
    state persistent {
        owner: address;
        reserveA: uint256;
        reserveB: uint256;
        isLocked: bool;
    }

    transaction swap(uint256 amountIn)
    requires amountIn > 0
    {
        // PHASE 1: Preflight Safety Checks
        preflight {
            // Assert no cross-contract reentrancy
            Security.require_no_reentrancy();

            // Verify pool reserves invariant holds
            require(state.reserveA > 0 && state.reserveB > 0, "Pool drained");
        }

        // PHASE 2: Atomic State Mutation
        atomic {
            let amountOut = calculateOutput(amountIn, state.reserveA, state.reserveB);
            
            state.reserveA = state.reserveA + amountIn;
            state.reserveB = state.reserveB - amountOut;

            transferNative(msg.sender, amountOut);
        }
    }
}
```

---

## 3. Off-Chain Preflight Simulation via SDK

Before a user or dApp broadcasts a high-value transaction to the mempool, they can execute the preflight check locally against an RPC node using `@xolix/sdk`:

```typescript
import { JsonRpcProvider } from '@xolix/sdk';

const provider = new JsonRpcProvider({ url: 'https://rpc.xolix.io' });

// Simulate signed transaction against current block state
const simulation = await provider.simulatePreflight(signedTx);

if (!simulation.isValid) {
  console.error('Preflight rejected:', simulation.failureReason);
} else {
  console.log('Preflight passed! Estimated XCU:', simulation.estimatedXCU.totalXCU);
  await provider.broadcastTransaction(signedTx);
}
```

---

## 4. Reentrancy Protection by Default

In XolixVM, when `Security.require_no_reentrancy()` is evaluated in preflight, the execution context marks the contract identity as **LOCKED**. 

If any external contract call attempts to call back into any function of this contract before the initial execution thread completes, the VM automatically rejects the nested call with `FLD-REENTRANCY-001: Subroutine lock active`.

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
