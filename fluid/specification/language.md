# FluidScript Language Specification

FluidScript is a native smart contract language designed for security-aware, deterministic execution in the XOLIX FLUID ecosystem.

## Core syntax elements
- `pragma fluid ^1.0;`
- `contract Name fluid upgradeable { ... }`
- `state persistent { ... }`
- `transaction Name(...) requires ... { ... }`
- `preflight { ... }`
- `atomic { ... }`

## Contract lifecycle
1. Define contract metadata
2. Declare persistent state
3. Define capability rules
4. Define invariants
5. Define transactions
6. Apply upgrade policy

## Example
```fluid
pragma fluid ^1.0;

contract XolixToken fluid upgradeable {
    state persistent {
        owner: address;
        total_supply: uint256;
        map<address, uint256> balances;
    }

    transaction mint(address to, uint256 amount)
    requires amount > 0 && caller == owner
    {
        preflight {
            Security.require_no_reentrancy();
        }

        atomic {
            balances[to] += amount;
            total_supply += amount;
        }
    }
}
```

## Design goals
- readability
- explicit state control
- upgrade-aware development
- deterministic execution
- security-aware contract patterns
