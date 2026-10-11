# Address Validation: BIP-350 Bech32m & EVM Interoperability

XOLIX implements the **BIP-350 Bech32m** address standard to protect users from sending tokens to unrecoverable destinations or incompatible network environments.

---

## 1. Why Bech32m?

1. **Typo Prevention**: Bech32m incorporates an advanced Reed-Solomon error-detecting checksum capable of catching up to 4 substituted characters and up to 5 inserted/deleted characters.
2. **Case Insensitive**: Eliminates mixed-case EIP-55 checksum errors in mobile scanning.
3. **Type-Aware Routing**: Distinct prefixes (`xol1`, `xolc1`, `xolv1`, `xolg1`) distinguish individual user wallets from smart contracts and validator staking nodes.

---

## 2. Address Validation in TypeScript / Frontend

Using `@xolix/sdk`:

```typescript
import { XolixUtils } from '@xolix/sdk';

// 1. Validate Address Checksum & Format
const userAddress = 'xol1q7k50a2g9876543210zyxwvu...';
const isValid = XolixUtils.isValidAddress(userAddress);

if (!isValid) {
  throw new Error("Invalid Xolix address! Please check the address for typos.");
}

// 2. Identify Address Category
const addressType = XolixUtils.parseAddressType(userAddress);
console.log(`Address category: ${addressType}`); 
// Possible returns: 'USER' | 'CONTRACT' | 'VALIDATOR' | 'GOVERNANCE' | 'STEALTH' | 'EVM'
```

---

## 3. Converting Between Formats

When interacting across dual lanes (e.g. MetaMask $\leftrightarrow$ Fluid Native):

```typescript
// Convert EVM 0x address to Native xol1 address
const nativeAddress = XolixUtils.evmToNative('0x4296bA188C15421B2c7308cfc2f0fFfa0C4FEA31');
console.log(nativeAddress); // "xol1..."

// Convert Native xol1 address to EVM 0x address
const evmAddress = XolixUtils.nativeToEvm('xol1...');
console.log(evmAddress); // "0x4296..."
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
