# Fluid Contract Upgrade Architecture

This document describes the native upgrade model for XOLIX FLUID contracts, which separates contract identity, state, and implementation.

## 1. Core Fluid Contract Model

A Fluid contract is a native XOLIX object with these components:

```
FluidContract
    ├── Contract ID (persistent)
    ├── Public Address (persistent)
    ├── Persistent State Root
    ├── State Schema
    ├── Current Implementation
    ├── Implementation History
    ├── Upgrade Policy
    ├── Capability Set
    ├── Resource Policy
    ├── Migration Policy
    └── Invariants
```

This is fundamentally different from manually building:
- Proxy contract
- Storage contract
- Logic contract
- Admin contract

Instead, XOLIX understands the entire structure as one native object.

## 2. Persistent Contract Identity

When a Fluid contract upgrades:

- The contract's public address remains the same
- The state root persists
- Only the implementation changes
- Users and applications do not need to migrate

Example:

```
Block 1000:
  XolixToken (xolc1...)
  Implementation: V1.0.0
  State: balances, total_supply, owner

Block 2000 (after governance approval):
  XolixToken (xolc1...) <- SAME ADDRESS
  Implementation: V2.0.0
  State: balances, total_supply, owner (UNCHANGED)
```

## 3. State Schema Compatibility

The most critical safety feature is automatic state schema validation.

When a developer proposes an upgrade, the compiler analyzes:

```
OLD STATE
owner: address
balances: map<address, uint256>
total_supply: uint256

NEW STATE
owner: address
balances: map<address, uint256>
total_supply: uint256
lastUpgradeTimestamp: uint256
```

The compiler produces:

```
UPGRADE ANALYSIS

✓ owner: address (unchanged)
✓ balances: map<address, uint256> (unchanged)
✓ total_supply: uint256 (unchanged)
✓ Existing types compatible
✓ Existing storage identifiers preserved

+ Added state:
    lastUpgradeTimestamp: uint256

✓ Append-only state change
✓ Existing interfaces preserved
✓ Capability permissions preserved
✓ Resource limits compatible

UPGRADE: SAFE
```

## 4. Incompatible Upgrade Rejection

If a developer attempts an unsafe change, the compiler rejects it immediately.

Example of dangerous change:

```
OLD STATE
owner: address

NEW STATE
owner: uint256  <- TYPE MISMATCH
```

The compiler produces:

```
FLD-UPGRADE-001

UPGRADE REJECTED

Existing state variable:
  owner: address

New implementation:
  owner: uint256

Reason:
  Incompatible state schema.
  The implementation cannot be deployed
  under the existing contract identity.
```

This prevents storage corruption and data loss.

## 5. Storage Schema Identifiers

Instead of raw storage slots, Fluid uses semantic state identifiers:

```fluid
state persistent {
    owner: address;
    balances: map<address, uint256>;
    total_supply: uint256;
}
```

The compiler generates stable state identifiers:

```
STATE_ID(owner)
STATE_ID(balances)
STATE_ID(total_supply)
```

Physical storage layout is an implementation detail of the XOLIX VM, not the developer's concern.

This makes upgrades much safer because changing the order of state variables does not corrupt data.

## 6. Upgrade Policies

Each Fluid contract defines its own upgrade authority and rules:

```fluid
upgrade_policy {
    authority: governance;
    timelock: 72h;
    require_schema_compatibility: true;
    require_simulation: true;
    require_invariant_validation: true;
}
```

Possible authorities:
- owner (single address)
- governance (DAO voting)
- multisig (N-of-M keys)
- security_council (emergency-only)

## 7. Timelocked Upgrades

The standard upgrade flow includes multiple safety gates:

```
Upgrade Proposal
    ↓
Compile New Implementation
    ↓
Static Security Analysis
    ↓
State Schema Compatibility Check
    ↓
Simulation on Snapshot of Chain State
    ↓
Invariant Validation
    ↓
Governance Approval (if required)
    ↓
Timelock (72 hours default)
    ↓
Final Validation Before Activation
    ↓
Atomic Upgrade Activation
```

If activation fails at any step, the contract remains on the previous implementation.

## 8. Upgrade Simulation

Before governance approves, developers can simulate the upgrade:

```typescript
const report = await simulateUpgrade(
    contractAddress,
    currentImplementation,
    proposedImplementation
);
```

The report contains:

```
FLUID UPGRADE REPORT

Contract: XolixToken
Current: V1.4.2
Proposed: V1.5.0

STATE COMPATIBILITY
    ✓ PASS

INTERFACE COMPATIBILITY
    ✓ PASS

CAPABILITY CHANGES
    + governance.pause

RESOURCE CHANGES
    -12% estimated execution cost

INVARIANT TESTS
    1,000,000 / 1,000,000 PASS

REENTRANCY ANALYSIS
    PASS

AUTHORIZATION ANALYSIS
    PASS

UPGRADE RESULT
    SAFE TO SCHEDULE
```

## 9. Deterministic Migration

If a new version requires data transformation, Fluid supports deterministic migrations:

```fluid
upgrade V2 → V3 {
    migration {
        balances → normalized_balances;
        old_fee → new_fee;
    }
}
```

The migration is:
- Defined in the contract
- Executed atomically by the protocol
- Validated against the new state schema
- Not a manual process requiring users to act

## 10. Upgrade History & Audit Trail

Every upgrade is recorded on-chain:

```
FluidUpgrade {
    contract_id: xolc1abc...;
    old_version: 1.0.0;
    new_version: 2.0.0;
    old_code_hash: sha256:...;
    new_code_hash: sha256:...;
    old_state_schema_hash: sha256:...;
    new_state_schema_hash: sha256:...;
    migration_hash: null;
    governance_proposal: ...;
    simulation_hash: sha256:...;
    authorization: governance(67%);
    activation_block: 18492100;
    activation_timestamp: 2026-10-05T21:30:00Z;
}
```

Users and auditors can verify exactly what changed and when.

## 11. Emergency Upgrades

Security councils can upgrade contracts with shorter timelocks for critical bugs:

```fluid
emergency_policy {
    enabled: true;
    authority: security_multisig(4,7);
    maximum_scope: security_patch;
    timelock: 6h;
}
```

But emergency authority is strictly limited:
- Can only fix security issues
- Cannot change normal business logic
- Still requires compatibility validation
- Still requires simulation
- Cannot be used for arbitrary upgrades

## 12. Contract Versioning

Fluid contracts maintain versioned implementation history:

```
XolixToken

Contract: xolc1abc...
Version: 4.2.1
Implementation: xolc1def...

Previous versions:
    4.2.0 (block 18,481,000)
    4.1.0 (block 18,200,000)
    4.0.0 (block 17,900,000)

Upgrade authority: DAO (governance)
Next scheduled upgrade: Block 18,592,100
```

Explorers and auditors can track the full version history.

## 13. Invariant Validation

Each contract defines invariants that must remain true:

```fluid
invariants {
    total_supply >= 0;
    sum(balances[*]) <= total_supply;
    owner != address(0);
}
```

Before activation, the upgrade validates that the new implementation preserves these invariants.

## 14. Comparison with EVM Proxy Patterns

Traditional EVM proxy upgrades (like OpenZeppelin UUPS):
- Require developers to manually maintain proxy/logic separation
- Require manual storage layout preservation
- Require developers to remember compatibility rules
- Errors can corrupt storage silently

Fluid native upgrades:
- Built into the protocol
- Compiler enforces compatibility
- Storage schema is semantic, not slot-based
- Incompatible changes are rejected at compile time
- Simulations validate before activation
- Governance and timelock are native

## 15. Developer Best Practices

When planning a Fluid contract upgrade:

1. Define the new state carefully
2. Verify backward compatibility with the schema checker
3. Run upgrade simulations on testnet
4. Test all new functionality
5. Review the upgrade report
6. Submit governance proposal with simulation results
7. Wait for timelock before activation
8. Monitor the first blocks after upgrade for anomalies

## 16. What This Excludes

This document does not cover:
- Node deployment
- Private infrastructure
- Raw blockchain consensus details
- Mining or validator setup
- Unrelated ecosystem tooling

This is focused only on contract upgrade safety and governance for third-party developers.
