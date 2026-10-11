# Transaction Lifecycle, Receipts & Error Codes

Understanding the end-to-end lifecycle of a XOLIX transaction ensures resilient dApp UX and reliable backend payment processors.

---

## 1. The Five Lifecycle States

```text
 1. PREFLIGHT ──> 2. PENDING (Mempool) ──> 3. INCLUDED ──> 4. CONFIRMED ──> 5. FINALIZED
 (Local Dry Run)   (AegisMesh Propagation)  (Mined in Block)  (1+ Blocks)    (BFT Epoch)
```

1. **Preflight**: Verified locally or via RPC sandbox against state invariants.
2. **Pending**: Broadcast to validator mempool via P2P gossip mesh.
3. **Included**: Packaged into a block proposal by the current slot leader.
4. **Confirmed**: Block committed with $\ge 1$ block depth.
5. **Finalized**: Achieved 2/3 BFT validator quorum consensus (irreversible).

---

## 2. Common Xolix Virtual Machine (XolixVM) Error Codes

When a transaction reverts or fails preflight, the node returns structured error identifiers:

| Error Code | Meaning | Remediation |
| :--- | :--- | :--- |
| **`FLD-AUTH-001`** | Caller lacks required capability (`@owner`, `@governance`). | Ensure `msg.sender` matches the state address variable. |
| **`FLD-REENTRANCY-001`** | Reentrancy lock active. | Prevent cross-contract recursive calls into the caller. |
| **`FLD-UPGRADE-001`** | Incompatible state schema detected during upgrade. | Append new variables to the end of state; do not reorder. |
| **`FLD-GAS-001`** | Out of XCU computational units. | Increase `resourceLimit` in the transaction parameters. |
| **`FLD-MATH-001`** | Arithmetic overflow or underflow. | Validate arithmetic bounds before subtraction or addition. |
| **`FLD-ASSERT-001`** | Assertion or `require()` precondition violated. | Inspect custom revert string for failed precondition. |

---

## 3. Recommended Frontend Transaction Pattern

```typescript
try {
  setTxStatus('Broadcasting...');
  const tx = await contract.write('transfer', recipient, amount);

  setTxStatus('Pending in mempool...');
  const receipt = await provider.waitForTransaction(tx.txHash, 1);

  if (receipt.status === 1) {
    setTxStatus('Confirmed!');
    showSuccessToast(`Success! View on Explorer: https://scan.xolix.io/tx/${tx.txHash}`);
  } else {
    setTxStatus('Failed on-chain');
    showErrorToast('Transaction reverted.');
  }
} catch (err: any) {
  if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
    setTxStatus('Canceled by user');
  } else {
    showErrorToast(err.message || 'Transaction submission error');
  }
}
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
