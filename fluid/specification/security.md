# FluidScript Specification: security.md

FluidScript is designed around explicit security controls.

## Core idea
Security should be part of the contract design, not an afterthought.

## Common checks
- reentrancy checks
- caller validation
- threshold conditions
- capability validation
- resource constraints

## Example
```fluid
transaction transfer(address to, uint256 amount)
requires amount > 0 && balances[caller] >= amount
{
    preflight {
        Security.require_no_reentrancy();
        Risk.require_below_threshold(caller, 0.75);
    }

    atomic {
        balances[caller] -= amount;
        balances[to] += amount;
    }
}
```

## Why this matters
Without guard checks, contract logic can be exploited during execution or when state updates occur in unsafe order.
