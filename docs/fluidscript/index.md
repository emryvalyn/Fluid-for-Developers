# FluidScript Overview

FluidScript is the native smart contract language for the XOLIX FLUID ecosystem.

## What it is
FluidScript is intended for writing blockchain contracts that are:
- deterministic
- safety-aware
- stateful
- permission-aware
- upgrade-conscious

## Typical syntax
```fluid
pragma fluid ^1.0;

contract Example fluid upgradeable {
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

## Key concepts
### `state persistent`
This declares the contract's persistent data that lives on-chain.

### `transaction`
This is a callable function or operation.

### `requires`
This is the execution precondition. If false, the transaction is not allowed.

### `preflight`
This block runs safety checks before anything mutates state.

### `atomic`
This block executes the actual state mutation in a deterministic way.

## Why developers care
FluidScript is meant to help developers avoid:
- unguarded state mutation
- unclear permission logic
- accidental storage incompatibility during upgrades
- unsafe contract flow without validation

## Related docs
- `fluid/specification/language.md`
- `fluid/specification/security.md`
- `fluid/specification/upgrades.md`
- `fluid/specification/type-system.md`
