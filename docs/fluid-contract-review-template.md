# Fluid Contract Review Template

Use this template to review a XOLIX FLUID contract before testnet or production deployment.

## 1. Contract overview
- Contract name:
- Purpose:
- Author(s):
- Intended network:
- Date reviewed:

## 2. State model review
- Are all state variables defined explicitly?
- Is state durable and necessary?
- Are there any hidden or implicit runtime values?
- Are state variables easy to reason about?

## 3. Authority review
- Who can call privileged functions?
- Are all authority checks explicit?
- Are all admin actions limited and reviewable?
- Is the owner or governance model clearly documented?

## 4. Input validation review
- Are all inputs validated?
- Are invalid addresses rejected?
- Are zero-value or empty-value cases handled?
- Are access checks separated from state mutation?

## 5. Safety review
- Are `preflight` checks used for safety conditions?
- Is reentrancy considered?
- Is the state change restricted to the minimum required scope?
- Are invariants obvious and preserved?

## 6. State mutation review
- Does the contract mutate state only in `atomic` sections?
- Are there clear boundaries between validation and mutation?
- Are there any side effects hidden in a transaction?

## 7. Upgrade review
- Is upgrade authority clearly defined?
- Are compatibility assumptions documented?
- Is the state migration model understood?
- Are upgrade checks reviewed before activation?

## 8. Testnet validation review
- Was the contract tested on testnet?
- Were error cases tested?
- Were permission checks tested?
- Were valid state changes confirmed?
- Were invalid input cases rejected?

## 9. Final risk assessment
- Risks identified:
- Severity:
- Mitigations:
- Reviewer signoff:

## 10. Approval rule
A contract should not move to production until the review identifies no unresolved high-risk issues.
