# FluidScript Overview

FluidScript (`.fls`) is the native language used by the XOLIX FLUID blockchain environment. It is designed to support:
- smart contract execution
- deterministic behavior
- security capabilities
- upgrade-safe contract design
- native protocol features alongside EVM compatibility

## Core principles
FluidScript is intended to ensure that contracts are:
- deterministic
- state-aware
- capability-checked
- secure by default
- compatible with upgrade and governance models

## Typical contract structure
```fluid
pragma fluid ^1.0;

contract XolixToken fluid upgradeable {
    metadata {
        name: "Xolix";
        version: "1.0.0";
    }

    state persistent {
        owner: address;
        balances: map<address, uint256>;
        total_supply: uint256;
    }

    capabilities {
        transfer;
        upgrade {
            authority: governance;
        }
    }

    invariants {
        total_supply >= 0;
        balances[*] >= 0;
    }
}
```

## Important language concepts
### state persistent
Persistent state is stored across transactions and across the lifecycle of the contract.

### transaction
A transaction is a callable operation that performs state changes under defined constraints.

### requires
Guard conditions determine whether a transaction is allowed to execute.

### preflight
Preflight checks validate security conditions such as:
- no reentrancy
- threshold checks
- capability validation
- risk gates

### atomic
Atomic sections are the critical execution blocks where state transitions occur deterministically.

### upgrade policy
Fluid contracts can include upgrade controls that enforce compatibility and governance checks before new logic is activated.

## Why FluidScript matters
FluidScript is intended to sit above low-level bytecode and provide a developer-friendly way to write contracts and protocol logic while keeping native execution safety in mind.

## Where to read next
- `fluid/README.md`
- `fluid/specification/language.md`
- `fluid/specification/security.md`
- `fluid/specification/upgrades.md`
- `fluid/contracts/`

## Example contract
```fluid
pragma fluid ^1.0;

contract TokenSwap fluid upgradeable {
    state persistent {
        owner: address;
        map<address, uint256> balances;
    }

    transaction transfer(address to, uint256 amount)
    requires amount > 0 && balances[caller] >= amount
    {
        preflight {
            Security.require_no_reentrancy();
        }

        atomic {
            balances[caller] -= amount;
            balances[to] += amount;
        }
    }
}
```
