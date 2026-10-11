# Production Security Audit Checklist (25 Points)

Before deploying any smart contract to XOLIX Mainnet (`Chain ID: 44990`), verify that your code satisfies this 25-point security audit checklist.

---

## 1. Access Control & Capabilities (Points 1–5)
- [ ] **1. Capability Integrity**: All sensitive administrative functions (`mint`, `setFee`, `emergencyPause`) are bound to explicit capability decorators (`@owner`, `@governance`).
- [ ] **2. Zero Address Guard**: Constructor and capability transfer functions reject `address(0)`.
- [ ] **3. Multisig / DAO Ownership**: For production deployments, `state.owner` is assigned to a multi-signature vault (`QSC-4900`) or Timelock governance, not an EOA single private key.
- [ ] **4. Two-Step Ownership Transfer**: Ownership handover implements a propose $\rightarrow$ accept two-step handshake.
- [ ] **5. No Capability Leaks**: Private helper subroutines do not expose internal capability variables to caller manipulation.

---

## 2. Reentrancy & Execution Safety (Points 6–10)
- [ ] **6. Preflight Reentrancy Lock**: State-modifying transactions executing external contract calls invoke `Security.require_no_reentrancy()` in preflight.
- [ ] **7. Checks-Effects-Interactions**: Storage state is updated before emitting external transfers or contract calls.
- [ ] **8. Native Transfer Validation**: Return values of `transferNative` are checked or asserted.
- [ ] **9. Denial of Service (DoS) Resistance**: Contracts do not iterate over unbounded external address arrays where one failing recipient blocks execution for all users.
- [ ] **10. Gas / XCU Headroom**: Functions running in loops are bounded to stay well within block XCU computation limits.

---

## 3. Math & Logic Integrity (Points 11–15)
- [ ] **11. Precision Loss Prevention**: Multiplication occurs before division (e.g. `(amount * fee) / 10000`).
- [ ] **12. Integer Overflow Checks**: Rely on native Fluid checked arithmetic; avoid unchecked casts.
- [ ] **13. Token Decimals Consistency**: Calculations account for token decimals (18 for standard QSC-20; 6 for USD stablecoins).
- [ ] **14. Strict Equality on Balance**: Contracts do not rely on strict equality (`balance == target`) which can be disrupted by unsolicited forced transfers.
- [ ] **15. Zero Amount Guards**: Functions assert that deposits, stakes, and transfers exceed zero.

---

## 4. Upgrade & Storage Safety (Points 16–20)
- [ ] **16. Upgrade Simulation Passed**: Ran `simulateUpgrade()` with the SDK and received `stateCompatibility: true`.
- [ ] **17. Append-Only Schema**: No existing persistent state variables were removed, reordered, or had their types modified.
- [ ] **18. Timelock Enforced**: Upgrade policies specify a mandatory delay (e.g. 48–72 hours) to give users advance notice.
- [ ] **19. Invariant Testing**: Invariants hold true after testing simulated state migrations.
- [ ] **20. Deprecation Signals**: Deprecated logic emits on-chain events notifying dApp frontends.

---

## 5. Network & Frontend Hygiene (Points 21–25)
- [ ] **21. Public Domain RPCs**: Frontends use canonical DNS endpoints (`https://rpc.xolix.io`), with zero exposed internal IP addresses.
- [ ] **22. Bech32m Checksum Validation**: Client code validates address checksums with `XolixUtils.isValidAddress()`.
- [ ] **23. Preflight Risk Interceptor**: Frontend runs `simulatePreflight()` before triggering wallet approvals.
- [ ] **24. Contract Verified on Explorer**: Source code is verified and public on `https://scan.xolix.io`.
- [ ] **25. Testnet Staging**: Contract was deployed and battle-tested on Testnet (`Chain ID: 44991`) with simulated adversarial conditions.

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
