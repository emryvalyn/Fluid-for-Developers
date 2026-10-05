# FluidScript Determinism and Execution Safety

Determinism is a key requirement in blockchain execution. FluidScript aims to ensure that contract behavior is predictable and reproducible.

## Deterministic execution principles
- no hidden randomness in contract logic
- same inputs produce same outputs
- transaction effects are applied in ordered, defined phases
- state mutations are atomic and reviewed before commit

## Example
```fluid
atomic {
    balances[caller] -= amount;
    balances[to] += amount;
}
```

The atomic block ensures the transitions are applied as a single deterministic state change.
