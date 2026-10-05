# XOLIX FLUID Upgrade Safety Checklist

This page captures the core considerations for upgrade safety in Fluid contracts.

## 1. Upgradeability is a design decision
If a contract is upgradeable, the authority model and migration strategy must be explicit.

## 2. Define upgrade authority
Before writing upgrade logic, confirm:
- who can trigger an upgrade
- what checks are required before approval
- whether there is a timelock or governance gate
- whether emergency pause or rollback is required

## 3. Keep the state compatible
When upgrading a contract, ensure that:
- the new logic remains compatible with existing state
- key data fields are preserved
- storage assumptions remain valid
- no unintended resets or ownership changes occur

## 4. Validate invariants after upgrade
After upgrade, confirm that:
- ownership rules still hold
- balance and supply assumptions continue to hold
- governance and permission logic still match the design
- no contract state has been corrupted or partially migrated

## 5. Avoid upgrade surprises
Developers should review:
- migration timing
- authority to trigger migration
- emergency stop paths
- compatibility with previous transactions

## 6. Safety review pattern
Before upgrade approval, confirm:
- the change is intentional
- the authority to enact it is valid
- the state model is preserved
- a rollback or emergency path exists if necessary
- tests are run on testnet first

## 7. Practical rule
A contract should be upgrade-safe before anyone relies on it in production.

Upgrade safety is not a later step. It is part of the design from the start.

## 8. What this checklist excludes
This checklist does not cover:
- explorer app work
- frontend UI concerns
- app hosting concerns
- unrelated infrastructure tasks

It is focused only on upgrade safety for XOLIX FLUID contract developers.
