# Fluid Contract Audit Checklist

This checklist is intended for contract review before deployment to testnet or production.

## 1. Core design review
- Is the contract purpose clear?
- Is the state model explicit and minimal?
- Are ownership and permissions visible?
- Are validation rules clear and enforced?

## 2. Access control review
- Are privileged functions limited to the correct callers?
- Are authority checks strict and explicit?
- Are admin capabilities reviewable?
- Are ownership changes carefully controlled?

## 3. Validation review
- Are invalid inputs rejected early?
- Are zero-value and invalid-address checks present?
- Are requirements documented in plain language?
- Are assumptions kept simple and reviewable?

## 4. Mutation review
- Are all state mutations limited to clear `atomic` logic?
- Are there broad side effects within a single function?
- Are there accidental state changes outside the intended path?

## 5. Safety review
- Is reentrancy considered?
- Are function boundaries small and clear?
- Is behavior consistent under failure paths?
- Are invariants visible and testable?

## 6. Upgrade review
- Is the upgrade path documented?
- Is governance or admin authority for upgrades explicit?
- Are compatibility assumptions documented?
- Is the migration plan reviewed before activation?

## 7. Testnet review
- Was the contract tested for valid flows?
- Were error cases exercised?
- Were authorization updates tested?
- Were state values verified after mutation?

## 8. Final signoff rule
A contract should only move beyond testnet when:
- authority is known and explicit
- invalid inputs are rejected
- safety checks are understood
- upgrade assumptions are documented
- the logic is audit-friendly

## 9. Scope limitation
This checklist is for Fluid contract development only. It excludes:
- explorer app setup
- frontend engineering
- deployment and hosting infrastructure
- non-contract platform work
