# FluidScript Security Model

FluidScript is intended to operate under explicit security and capability rules.

## Core security ideas
- no reentrancy by default in critical paths
- explicit `preflight` validation
- capability-based permission checks
- upgrade constraints to prevent unsafe contract changes
- deterministic execution rules

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

## Security rules
- use `preflight` for safety checks
- minimize mutable state outside atomic blocks
- validate capability and access conditions before mutation
- enforce upgrade compatibility before activation

## Security tooling
The repo describes security, compile-time validation, and protocol-level checks such as:
- capability validation
- deterministic execution validation
- risk threshold simulation
- upgrade safety enforcement
