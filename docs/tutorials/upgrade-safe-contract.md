# Upgrade-Safe Contract Tutorial

Upgrade safety is one of the most important ideas in the XOLIX FLUID design.

## Why upgrade safety matters
When contracts change over time, developers must be careful not to silently break the meaning of persistent state.

For example:
- changing `owner: address` into `owner: uint256` is a breaking schema change
- changing storage meaning without compatibility checks is dangerous

## Fluid approach
The repo describes a model where upgrade checks include:
- schema compatibility validation
- invariants validation
- governance approval
- timelocks
- simulation before activation

## Example upgrade policy
```fluid
contract UpgradeableToken fluid upgradeable {
    state persistent {
        owner: address;
        map<address, uint256> balances;
    }

    upgrade_policy {
        authority: governance;
        timelock: 72h;
        require_schema_compatibility: true;
        require_simulation: true;
        require_invariant_validation: true;
    }
}
```

## What to learn from this
When designing an upgradeable contract, ask:
- Is this state layout still compatible?
- Will old users still be able to interact correctly?
- Will governance be required before activation?
- Are invariants still valid after the upgrade?

## Practical rule
Do not treat upgrades as a simple code swap. Treat them as a protocol change with safety constraints.
