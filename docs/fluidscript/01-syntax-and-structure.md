# FluidScript Syntax, Structure & Lifecycle

FluidScript (`.fls`) is a statically typed, contract-oriented language compiled to XLS bytecode for the Xolix Virtual Machine (`XolixVM`). This guide provides a full reference of contract anatomy, execution flow, and syntax rules.

---

## 1. Anatomy of a Contract

Every FluidScript contract consists of four primary structural blocks:

```fluid
// 1. Version Pragma
version 1.0;

// 2. Contract Header & Modifiers (e.g. upgradeable)
contract VaultManager upgradeable {

    // 3. Persistent State Declaration Block
    state persistent {
        owner: address;
        governance: address;
        totalAssets: uint256;
        userBalances: map<address, uint256>;
    }

    // 4. Constructor (Runs strictly once upon deployment)
    constructor(govAddress: address) {
        state.owner = msg.sender;
        state.governance = govAddress;
        state.totalAssets = 0;
    }

    // 5. Public View Function (Zero gas, off-chain callable)
    public getBalance(account: address): uint256 {
        return state.userBalances[account];
    }

    // 6. Public Transaction (State mutation, consumes XCU)
    public deposit() {
        require(msg.value > 0, "Vault: Deposit must be positive");
        
        state.userBalances[msg.sender] = state.userBalances[msg.sender] + msg.value;
        state.totalAssets = state.totalAssets + msg.value;
    }

    // 7. Capability-Restricted Method
    @owner
    public emergencyPause() {
        // Only callable by state.owner
    }
}
```

---

## 2. Keywords & Core Declarations

| Keyword | Description |
| :--- | :--- |
| `version X.Y;` | Declares compiler specification version. |
| `contract Name` | Defines contract boundary. |
| `upgradeable` | Flags contract as capable of native logic pointer updates. |
| `state persistent` | Defines on-chain persistent storage layout. |
| `constructor` | Initialization logic executed strictly during deployment. |
| `public` | Method callable by external accounts and other contracts. |
| `private` | Method callable only within current contract scope. |
| `requires` / `require()` | Asserts boolean precondition; rolls back if condition fails. |
| `@capability` | Protocol-level access decorator (`@owner`, `@governance`). |
| `preflight` | Pre-mutation safety check block. |
| `atomic` | Guaranteed atomic execution block. |
| `let` | Local variable declaration within function scope. |
| `interface` | Defines external contract call interface. |
| `struct` | Custom compound data type. |

---

## 3. Global Context Variables (`msg`, `block`, `tx`)

Fluid contracts provide native global contextual properties:

### `msg` Object
- `msg.sender`: `address` of the immediate caller (user or contract).
- `msg.value`: `uint256` amount of native XOLT coins sent in transaction.
- `msg.data`: `bytes` payload passed in execution.

### `block` Object
- `block.timestamp`: `uint256` UNIX timestamp of current block.
- `block.number`: `uint256` current block height.
- `block.prevrandao`: `bytes32` entropy beacon from validator consensus.

### `tx` Object
- `tx.origin`: `address` of the external transaction signer.
- `tx.gasprice`: `uint256` price per XCU unit.

---

## 4. State vs. Local Variables

### Persistent Storage
Declared inside `state persistent { ... }`. Accessed via `state.variableName`. State reads and writes incur XCU storage gas fees.

### Local Variables
Declared inside functions with `let`:
```fluid
let fee = (amount * 3) / 1000;
let remaining = amount - fee;
```
Local variables exist strictly on the execution stack and are discarded when execution returns.

---

## 5. Control Flow

FluidScript supports standard deterministic control structures:

```fluid
// If-Else branching
if (amount > 1000) {
    applyDiscount();
} else {
    standardRate();
}

// Bounded For Loop (unbounded loops should be avoided to prevent gas limit exhaustion)
for (let i = 0; i < signers.length; i++) {
    verifySigner(signers[i]);
}
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
