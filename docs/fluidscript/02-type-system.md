# FluidScript Type System Reference

FluidScript enforces strict compile-time and runtime type checking to prevent memory corruption, integer overflows, and type confusion vulnerabilities.

---

## 1. Value Types (Primitives)

### Integers
FluidScript provides fixed-width signed and unsigned integers:

| Type | Range | Description |
| :--- | :--- | :--- |
| `uint8` | $0$ to $255$ | Small counters, decimals |
| `uint16`| $0$ to $65,535$ | Timers, port configurations |
| `uint32`| $0$ to $4,294,967,295$ | Epochs, block intervals |
| `uint64`| $0$ to $2^{64}-1$ | High-precision timestamps |
| `uint128`| $0$ to $2^{128}-1$ | Intermediate math calculations |
| **`uint256`** | $0$ to $2^{256}-1$ | Standard token amounts, balances, currency |
| `int8` to `int256` | Negative to positive ranges | Relative price deltas, signed accounting |

> **Note on Overflow Protection**: All mathematical operators (`+`, `-`, `*`, `/`) in FluidScript are **overflow-checked by default**. If an operation overflows or underflows, execution reverts immediately without requiring SafeMath libraries.

### Boolean
- `bool`: Values `true` or `false`.
- Logical operators: `&&` (AND), `||` (OR), `!` (NOT).

### Addresses
- `address`: 32-byte cryptographic identifier.
- Supports literal `address(0)` for zero address checking.
- Interoperable with Bech32m representations (`xol1...`, `xolc1...`) and EVM hex (`0x...`).

```fluid
require(recipient != address(0), "Cannot send to zero address");
```

### Strings & Bytes
- `string`: UTF-8 encoded text string (e.g. `"XOLT Token"`).
- `bytes`: Dynamic byte array for raw call data, payload signatures.
- `bytes32`: 32-byte fixed array (hashes, roots, Merkle proofs).

---

## 2. Reference & Composite Types

### Hash Maps (`map<K, V>`)
Maps associate keys with values. In FluidScript, maps are declared in persistent storage:

```fluid
state persistent {
    // Single key to value
    balances: map<address, uint256>;

    // Nested map (Owner => Spender => Allowance)
    allowances: map<address, map<address, uint256>>;

    // Address whitelist / blacklist status
    isAuthorized: map<address, bool>;
}
```

Key lookups on non-existent keys return the default zero-value (`0`, `false`, `""`, or `address(0)`).

### Dynamic Arrays (`array<T>` / `T[]`)
Ordered collections of typed elements:

```fluid
let signers: address[] = [account1, account2, account3];
let count = signers.length;
```

### Structs
User-defined composite data records:

```fluid
struct StakePosition {
    owner: address;
    amount: uint256;
    startTime: uint256;
    rewardDebt: uint256;
    isActive: bool;
}

state persistent {
    stakes: map<uint256, StakePosition>;
}
```

---

## 3. Interfaces & Polymorphism

Interfaces declare callable function signatures of external contracts:

```fluid
interface IQSC20 {
    public balanceOf(account: address): uint256;
    public transfer(to: address, amount: uint256): bool;
}

// Interacting via interface
let token = IQSC20(tokenContractAddress);
let userBalance = token.balanceOf(msg.sender);
```

---

## 4. Explicit Type Conversions

Implicit conversions between incompatible types are disallowed to prevent precision loss. Type casts must be explicit:

```fluid
let smallValue: uint8 = 18;
let bigValue: uint256 = uint256(smallValue); // Explicit conversion

let rawBytes: bytes32 = keccak256("Hello, Xolix");
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
