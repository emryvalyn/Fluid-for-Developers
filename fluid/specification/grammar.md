# FluidScript Grammar

This file documents the foundational syntax of FluidScript.

## General structure
```fluid
pragma fluid ^1.0;

contract MyContract fluid upgradeable {
    state persistent {
        owner: address;
    }

    transaction transfer(address to, uint256 amount)
    requires amount > 0
    {
        preflight {
            Security.require_no_reentrancy();
        }

        atomic {
            // state updates
        }
    }
}
```

## Grammar concepts
- `pragma` declares the language version.
- `contract` declares a contract definition.
- `state persistent` declares persistent on-chain state.
- `transaction` declares executable contract logic.
- `requires` declares preconditions.
- `preflight` runs safety checks before mutation.
- `atomic` defines deterministic mutation logic.
- `upgradeable` marks contract upgrade support.

## Example declarations
```fluid
state persistent {
    owner: address;
    total_supply: uint256;
    map<address, uint256> balances;
}
```

## Notes
This grammar is intentionally designed to be readable, deterministic, and security-aware. It aims to support upgrade-safe contract execution with explicit capability and safety semantics.
