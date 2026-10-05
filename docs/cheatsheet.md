# FluidScript Language Cheat Sheet

## Basic syntax
```fluid
pragma fluid ^1.0;

contract MyContract fluid upgradeable {
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

## Keywords
- `pragma` — language version
- `contract` — contract definition
- `state persistent` — permanent state
- `transaction` — callable execution
- `requires` — conditions
- `preflight` — safety checks
- `atomic` — mutation block
- `upgradeable` — upgrade-capable contract
- `upgrade_policy` — upgrade rules

## Common patterns
- owner-only actions: `requires caller == owner`
- numeric bounds: `requires amount > 0`
- safe mutation: use `preflight` + `atomic`
- upgrade safety: use `upgrade_policy`

## Developer mindset
- state must be explicit
- operators must be guarded
- safety must be checked before mutation
- upgrades should be validated before activation
