# XOLIX FLUID: Developer Glossary of Terms

This glossary provides concise, authoritative definitions of key technical concepts, architectural components, and acronyms used throughout the XOLIX FLUID blockchain ecosystem.

---

### AegisMesh
The Byzantine Fault Tolerant (BFT) Proof-of-Stake consensus engine powering XOLIX. Features 2.0-second block finality, peer-to-peer gossip propagation, and dynamic validator rotation.

### Atomic Block (`atomic { ... }`)
A transaction execution phase guaranteed to commit state changes in a single all-or-nothing step. If any condition reverts during execution, the state trie rolls back to its exact pre-transaction state.

### Bech32m (BIP-350)
The error-correcting address encoding standard used by XOLIX. Employs a Reed-Solomon polynomial checksum that catches up to 4 substituted characters and up to 5 inserted/deleted characters. Distinguishes accounts (`xol1...`) from contracts (`xolc1...`).

### Capability (`@owner`, `@governance`)
Protocol-level permission decorators verified directly by the virtual machine *before* function bytecode executes. Prevents unauthorized function execution without wasting execution gas.

### Dual-Lane Architecture
The hybrid consensus execution model of XOLIX that operates both an EVM-compatible execution lane (for Solidity, Hardhat, MetaMask) and a Native FLUID lane (for `.fls`, XLS bytecode, capabilities) atop a unified state ledger.

### FluidScript (`.fls`)
The statically typed, capability-aware, contract-oriented language designed natively for the XOLIX blockchain. Compiles into XLS bytecode for execution on the `XolixVM`.

### Preflight (`preflight { ... }`)
The inspection phase of a Fluid transaction where invariants, reentrancy guards, and caller risk scores are evaluated prior to state mutation. Can be simulated off-chain via `simulatePreflight()` with zero gas cost.

### Proxy-Free Upgrades
The native protocol mechanism that allows contracts marked `upgradeable` to update their active logic pointer upon governance approval without relying on error-prone `delegatecall` proxy contracts (such as ERC-1967 or UUPS).

### QSC (Questdrium Standard Contract)
The official family of smart contract standards on XOLIX:
- **QSC-20**: Fungible Token standard (ERC-20 equivalent).
- **QSC-721**: Non-Fungible Token standard (ERC-721 equivalent).
- **QSC-352**: Semi-fungible / Compliance asset standard with on-chain KYC verification.
- **QSC-4900**: Multi-signature vault & treasury governance standard.

### Stealth Address (`xol1s...`)
A one-time, quantum-resistant privacy address generated for a recipient using dual-key elliptic-curve Diffie-Hellman (ECDH). Obfuscates the link between the sender and recipient on the public block explorer.

### XCU (Xolix Computational Units)
The multidimensional metric for measuring transaction execution cost on XOLIX. Encompasses CPU instruction execution, storage reads, storage writes, and network bandwidth.

### XolixVM
The native virtual machine executing XLS binary bytecode on validator nodes. Enforces native capabilities, subroutine locks, and invariant assertions.

### XOLT / XOL
The native utility and gas currency of the XOLIX blockchain, utilized for paying transaction fees (XCU), staking validator nodes, and participating in on-chain governance.

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
