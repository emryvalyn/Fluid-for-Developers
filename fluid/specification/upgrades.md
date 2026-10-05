# FluidScript Specification: upgrades.md

Upgrade safety is a core design concern in the XOLIX FLUID model.

## What upgrades mean
Fluid contracts are meant to preserve:
- contract identity
- state continuity
- upgrade governance rules
- schema compatibility checks

## Example
```fluid
upgrade_policy {
    authority: governance;
    timelock: 72h;
    require_schema_compatibility: true;
    require_simulation: true;
    require_invariant_validation: true;
}
```

## Upgrade process
1. Build new contract logic
2. Validate compatibility with previous state
3. Simulate the upgrade
4. Run invariant checks
5. Require governance approval
6. Enforce timelock
7. Activate the upgrade

## Important warning
Storage layout changes are dangerous. Upgrade safety should not be treated as a developer convenience; it is protocol-level design.
