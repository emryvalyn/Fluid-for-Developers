# Fluid Native Contract Model

This document describes the native Fluid contract object model, which is distinct from EVM smart contracts.

## 1. What is a Native Fluid Contract?

A Fluid contract is a first-class object in the XOLIX protocol, not a smart contract running inside a virtual machine.

Fluid contracts have:
- Native storage and state management
- Native upgradeable architecture
- Native capability and permission system
- Native upgrade validation and simulation
- Compiler-enforced safety rules

This is different from EVM, where contracts are bytecode executed by the virtual machine.

## 2. The Fluid Contract Object Structure

```
FluidContract {
    metadata {
        name: string;
        version: string;
        author: address;
    }

    state persistent {
        // All contract state lives here
        owner: address;
        balances: map<address, uint256>;
        total_supply: uint256;
    }

    capabilities {
        // Permissions and actions
        transfer;
        mint;
        upgrade {
            authority: governance;
        }
    }

    invariants {
        // Rules that must always hold
        total_supply >= 0;
        balances[*] >= 0;
    }

    transactions {
        // Actions that can change state
        transfer(address to, uint256 amount) { ... }
        mint(address to, uint256 amount) { ... }
    }

    upgrade_policy {
        // How upgrades are controlled
        authority: governance;
        timelock: 72h;
        require_schema_compatibility: true;
    }
}
```

## 3. Persistent State

In a Fluid contract, state is semantic, not based on storage slots:

```fluid
state persistent {
    owner: address;           // Single value
    balances: map<address, uint256>;  // Map/dictionary
    total_supply: uint256;    // Single value
    metadata: struct {        // Structured data
        name: string;
        symbol: string;
    };
}
```

The compiler assigns stable identifiers to each state variable:

```
STATE_ID(owner) = 0x01
STATE_ID(balances) = 0x02
STATE_ID(total_supply) = 0x03
STATE_ID(metadata.name) = 0x04
STATE_ID(metadata.symbol) = 0x05
```

Physical storage layout is handled by XOLIX internally, not by the developer.

## 4. Transactions vs. Functions

Fluid contracts use "transactions" instead of "functions":

```fluid
transaction transfer(address to, uint256 amount)
requires {
    amount > 0;
    to != Address.zero;
    balances[caller] >= amount;
}
atomic {
    balances[caller] -= amount;
    balances[to] += amount;
}
```

A transaction is:
- A state-changing operation
- Atomic (all-or-nothing)
- Validated before execution
- Recorded on-chain

This is different from EVM, where all functions can change state or read-only depending on how they're called.

## 5. Capability-Based Security

Each contract defines what actions are possible:

```fluid
capabilities {
    transfer;        // Users can transfer
    mint;            // Only owner can mint
    upgrade {        // Only governance can upgrade
        authority: governance;
    }
    pause;           // Only admin can pause
    emergencyStop;   // Only security council
}
```

Capabilities are:
- Declared upfront
- Explicit in the contract definition
- Validated by the compiler
- Enforceable by the runtime

## 6. Permission Model

Permissions are checked in the `requires` block:

```fluid
transaction mint(address to, uint256 amount)
requires {
    caller == owner;              // Only owner
    amount > 0;
    to != Address.zero;
}
atomic {
    balances[to] += amount;
    total_supply += amount;
}
```

Permissions are:
- Explicitly stated
- Checked before state mutation
- Easy to audit and verify

## 7. Atomic Execution

State changes are atomic:

```fluid
atomic {
    balances[caller] -= amount;   // If this fails,
    balances[to] += amount;        // this doesn't execute
}
```

Either both operations succeed, or both fail. This prevents half-completed transfers or data inconsistency.

## 8. Invariant Preservation

Invariants are rules that must always hold:

```fluid
invariants {
    total_supply >= 0;            // Supply can't be negative
    sum(balances[*]) <= total_supply;  // Balances sum ≤ supply
    owner != address(0);          // Owner can't be null
}
```

Before and after each transaction, the runtime validates invariants.

If a transaction violates an invariant, it is rejected.

## 9. Type Safety

Fluid contracts have strict type definitions:

```fluid
state persistent {
    owner: address;           // 20-byte address
    balances: map<address, uint256>;  // key=address, value=uint256
    metadata: struct {        // Structured type
        name: string;
        symbol: string;
        decimals: uint8;
    };
}
```

Type mismatches are detected at compile time, not at runtime.

## 10. Contract Identity

Each Fluid contract has a unique, permanent identity:

```
XolixToken
├── Contract ID: xolc1q7k5m3v8n2c4y6p9r0s4d7f2g8h5j3k6w9z
├── Public Address: xolc1...
├── Owner: xol1...
├── Creation Block: 1,000
└── Creation Timestamp: 2026-01-01T00:00:00Z
```

The contract ID is permanent and does not change across upgrades.

## 11. Code Hash

Every version of the contract produces a deterministic code hash:

```
V1.0.0: sha256:a3d4c5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z
V1.1.0: sha256:b4e5d6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
V2.0.0: sha256:c5f6e7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z7a
```

Explorers and tools can verify which version is running.

## 12. Resource Policies

Fluid contracts can define resource limits:

```fluid
resource_policy {
    max_execution_time: 1000ms;
    max_storage_growth: 100MB;
    max_call_depth: 16;
}
```

The runtime enforces these limits to prevent resource exhaustion.

## 13. Comparison with EVM Contracts

| Aspect | EVM | Fluid |
|--------|-----|-------|
| Storage Model | Slot-based | Semantic state IDs |
| Upgrades | Proxy pattern (manual) | Native (built-in) |
| State Schema | Developer responsibility | Compiler-enforced |
| Invariants | Manual checks in code | Native validation |
| Type Safety | Solidity types | Fluid types (strict) |
| Permissions | Functions with modifiers | Capabilities (native) |
| Bytecode | EVM opcodes | XLS (Fluid bytecode) |
| Execution | EVM virtual machine | XOLIX native VM |

## 14. Compiler Output

When you compile a Fluid contract:

```bash
fluid build XolixToken.fls
```

The compiler produces:

```
XolixToken.xls              # Fluid bytecode
XolixToken.abi              # Contract interface
XolixToken.manifest         # Metadata and hashes
XolixToken.analysis.json    # Security/compatibility report
```

## 15. Developer Workflow

1. Write contract in FluidScript (`.fls` file)
2. Compile to XLS bytecode with `fluid build`
3. Test on testnet with `fluid deploy --testnet`
4. Deploy to mainnet with `fluid deploy --mainnet`
5. Upgrade with `fluid upgrade-check` and governance approval

## 16. What This Excludes

This document does not cover:
- Node infrastructure
- Consensus mechanisms
- Validator setup
- Private blockchain operations
- Unrelated tooling

This is focused on the native contract object model for third-party developers building on Fluid.
