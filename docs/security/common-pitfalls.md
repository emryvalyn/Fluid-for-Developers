# Common Smart Contract Pitfalls & Security Mitigations

This reference highlights the top vulnerabilities encountered in decentralized applications and details how FluidScript prevents or mitigates them.

---

## 1. Reentrancy Attacks

### The Vulnerability
An external contract call hands control over to an untrusted contract, which re-enters the caller before balances are decremented, draining funds.

### The Fluid Mitigation
FluidScript introduces the native `preflight` reentrancy lock:
```fluid
preflight {
    Security.require_no_reentrancy();
}
```
The Xolix Virtual Machine flags the caller execution thread. Any recursive entry reverts at the VM boundary before any instructions run.

---

## 2. Storage Collision During Upgrades

### The Vulnerability
In EVM proxy patterns, adding a state variable in the wrong slot or altering inheritance order overwrites existing storage slots, corrupting balances or stealing ownership.

### The Fluid Mitigation
Fluid contracts avoid proxies entirely. The VM strictly enforces **Append-Only Schema Validation**. When an upgrade proposal is submitted, the node verifies that every existing variable in `state persistent` remains byte-for-byte identical in type and index. If a type or position changed, the proposal is rejected at compiler and node level.

---

## 3. Flash Loan Invariant Manipulation

### The Vulnerability
An attacker borrows millions in liquidity, temporarily distorts AMM spot prices, and exploits a lending protocol or vault that relies on instantaneous reserves.

### The Fluid Mitigation
Always query time-weighted average prices (TWAP) or oracle feeds (`XolixPriceOracle`) rather than instantaneous AMM reserves:
```fluid
// Safe Oracle Query
let price = oracle.getTwapPrice(tokenA, tokenB, 1800); // 30-minute TWAP
```

---

## 4. Front-Running & MEV Slippage

### The Vulnerability
Transactions broadcast with zero slippage protection (`amountOutMin = 0`) can be sandwiched by MEV searchers.

### The Fluid Mitigation
Always enforce tight slippage limits in user transactions:
```fluid
transaction swap(uint256 amountIn, uint256 minAmountOut) {
    let out = calculateOutput(amountIn);
    require(out >= minAmountOut, "DEX: Slippage limit exceeded");
    // ...
}
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
