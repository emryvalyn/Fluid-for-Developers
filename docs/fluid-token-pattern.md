# XOLIX FLUID Token Contract Pattern

This page describes a minimal conceptual pattern for a token-style contract in XOLIX FLUID.

## 1. Purpose
A token contract should clearly define:
- total supply
- account balances
- transfer rules
- ownership or mint authority
- validation of invalid balances or amounts

## 2. Basic state model
```fluid
state persistent {
    owner: address;
    total_supply: uint256;
    map<address, uint256> balances;
}
```

This is the foundation for any token-like contract:
- a canonical total supply
- per-account balances
- explicit owner or mint authority

## 3. Minting pattern
```fluid
transaction mint(address to, uint256 amount)
requires caller == owner && amount > 0 && to != address(0)
{
    preflight {
        Security.require_no_reentrancy();
    }

    atomic {
        balances[to] += amount;
        total_supply += amount;
    }
}
```

Key principles:
- mint authority must be explicit
- no minting without a valid recipient
- no zero-value minting
- total supply must remain consistent

## 4. Transfer pattern
```fluid
transaction transfer(address to, uint256 amount)
requires amount > 0 && balances[caller] >= amount && to != address(0)
{
    preflight {
        Security.require_no_reentrancy();
    }

    atomic {
        balances[caller] -= amount;
        balances[to] += amount;
    }
}
```

Key principles:
- negative or zero values are rejected
- sender must have sufficient balance
- recipient must be valid
- state remains consistent after the mutation

## 5. Validation checklist
Before production, every token-style contract should confirm:
- the owner or mint authority is explicit
- total supply remains consistent with balances
- invalid or zero transfers are rejected
- zero-address transfers are rejected
- reentrancy safety is considered
- the transaction logic remains easy to audit

## 6. Common token risks
The most common issues are:
- hidden mint authority
- balance mismatches
- invalid zero-address handling
- broad or unclear permissions
- unsafe state mutation patterns

## 7. Good authoring pattern
A token contract should follow this order:
1. define state
2. define ownership or authority
3. validate inputs
4. validate permission and safety
5. update state atomically
6. review invariants

## 8. Invariant thinking
A token contract should maintain basic invariants such as:
- total supply must reflect the balance sum in the intended model
- unauthorized callers cannot mint or burn
- transfer operations must maintain balance consistency
- invalid input must reject cleanly

## 9. Recommended beginner exercise
Build a small token contract with:
- owner-only minting
- transfer validation
- explicit balance tracking
- reentrancy safety in `preflight`
- atomic updates only

This is the cleanest way to practice the Fluid authoring model without overcomplicating the contract.

## 10. What this page intentionally excludes
This page does not cover:
- explorer UI implementation
- app hosting
- Blockchain node deployment details
- unrelated infrastructure

It is focused only on how to author a token-style Fluid contract responsibly.
