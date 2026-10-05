# FluidScript Contract Model

Fluid contracts are designed as stateful, upgrade-aware smart contracts with explicit lifecycle and safety properties.

## Contract structure
```fluid
contract MyContract fluid upgradeable {
    state persistent {
        owner: address;
    }

    transaction setOwner(address newOwner)
    requires caller == owner
    {
        preflight {
            Security.require_no_reentrancy();
        }

        atomic {
            owner = newOwner;
        }
    }
}
```

## Elements
- `metadata` for static descriptive information
- `state persistent` for storage
- `capabilities` for allowed operations
- `invariants` for correctness checks
- `transaction` for callable logic
- `upgrade_policy` for governance and activation rules

## Design goal
The contract model is built to support upgrade-aware behavior without losing state identity or creating unsafe storage mismatches.
