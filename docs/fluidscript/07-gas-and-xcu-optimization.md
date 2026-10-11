# Gas & XCU (Xolix Computational Units) Optimization

In the XOLIX network, execution costs are measured in **XCU (Xolix Computational Units)** rather than simple linear gas. Understanding the multidimensional structure of XCU allows developers to write gas-efficient, cost-effective smart contracts.

---

## 1. The Multidimensional XCU Structure

Unlike legacy blockchains that compress CPU, memory, and disk into a single gas scalar, XCU models four distinct computing resources:

$$\text{Total XCU} = \text{XCU}_{\text{CPU}} + \text{XCU}_{\text{StorageRead}} + \text{XCU}_{\text{StorageWrite}} + \text{XCU}_{\text{Bandwidth}}$$

| Component | Measures | Relative Cost | Optimization Strategy |
| :--- | :--- | :--- | :--- |
| **$\text{XCU}_{\text{CPU}}$** | Instruction execution & math | Low | Use standard algorithms, avoid recursion |
| **$\text{XCU}_{\text{StorageRead}}$** | Reading `state.*` variables | Moderate | Cache frequent reads into local variables |
| **$\text{XCU}_{\text{StorageWrite}}$**| Modifying `state.*` variables | **High** | Minimize repeated state writes per transaction |
| **$\text{XCU}_{\text{Bandwidth}}$** | Calldata bytes & return payloads | Moderate | Use packed parameters and tight structs |

---

## 2. Practical Gas Optimization Techniques

### A. Cache Storage Reads in Local Memory

❌ **Unoptimized (Multiple state reads):**
```fluid
public calculateBonus() {
    let bonus1 = (state.totalDeposits * 5) / 100;
    let bonus2 = (state.totalDeposits * 10) / 100;
    let bonus3 = (state.totalDeposits * 15) / 100;
}
```

✅ **Optimized (Single state read cached in stack):**
```fluid
public calculateBonus() {
    let total = state.totalDeposits; // Read once from storage
    let bonus1 = (total * 5) / 100;
    let bonus2 = (total * 10) / 100;
    let bonus3 = (total * 15) / 100;
}
```

---

### B. Group State Writes

Storage writes incur the highest XCU penalty because they permanently modify the blockchain's state trie. Always group writes and compute results locally first.

❌ **Unoptimized:**
```fluid
state.balance = state.balance - amount;
// ... complex intermediate logic ...
state.balance = state.balance + refund;
```

✅ **Optimized:**
```fluid
let finalBalance = state.balance - amount + refund;
state.balance = finalBalance; // Single write commit
```

---

### C. Zero-Gas Read Functions (`public view`)

Functions that only read contract state and do not modify persistent variables can be called off-chain via JSON-RPC `eth_call` completely free of charge (0 XCU).

Design your contracts so that frontends can query user positions, calculated prices, and metrics through view functions without spending gas.

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
