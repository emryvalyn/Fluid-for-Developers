# Native Capabilities & Protocol Permissions

Access control is one of the leading sources of vulnerabilities in Web3 applications. In Solidity, developers often roll their own `onlyOwner` modifiers or rely on external libraries, which can be improperly inherited or omitted.

FluidScript introduces **Native Capabilities** directly into the virtual machine.

---

## 1. What are Capabilities?

A **Capability** is an execution guard defined as a language decorator (prefixed with `@`). When a method is decorated with a capability, the Xolix Virtual Machine verifies caller permissions **at the entry point of the call stack before executing any bytecode or consuming state gas**.

```fluid
contract TreasuryVault {
    state persistent {
        owner: address;
        governance: address;
        auditor: address;
    }

    // Accessible ONLY if msg.sender == state.owner
    @owner
    public setFeeRecipient(newRecipient: address) {
        // ...
    }

    // Accessible ONLY if msg.sender == state.governance
    @governance
    public reallocateReserves(amount: uint256) {
        // ...
    }

    // Accessible ONLY if msg.sender == state.auditor
    @auditor
    public triggerEmergencyAudit() {
        // ...
    }

    // Open to the public
    public getReserves(): uint256 {
        // ...
    }
}
```

---

## 2. Standard Native Capabilities

| Decorator | Binding State Variable | Description |
| :--- | :--- | :--- |
| **`@owner`** | `state.owner` | Primary administrative entity (contract creator or multisig). |
| **`@governance`**| `state.governance` | Protocol DAO or Timelock governance address. |
| **`@validator`** | `state.validator` / consensus | Reserved for consensus nodes and oracle feeds. |

---

## 3. How the VM Enforces Capabilities

In traditional EVM smart contracts:
1. Transaction payload is parsed.
2. Bytecode begins executing instructions.
3. Memory and storage are initialized.
4. Function checks `require(msg.sender == owner)`.
5. If invalid, the transaction reverts, but the user pays gas for all execution up to that point.

In **XolixVM with Capabilities**:
1. Node inspects function metadata table.
2. Checks `@owner` binding against `state.owner`.
3. If caller does not match, execution is **aborted immediately with error `FLD-AUTH-001: Caller lacks required capability`**.
4. Zero unnecessary gas is wasted inside the function body.

---

## 4. Transferring Capabilities

Because capabilities map directly to named state variables in `state persistent`, transferring a capability simply involves updating the corresponding address:

```fluid
@owner
public transferOwnership(newOwner: address) {
    require(newOwner != address(0), "Cannot transfer ownership to zero address");
    state.owner = newOwner;
}
```

Once `state.owner` is updated, the `@owner` decorator immediately recognizes the new address for all future transactions.

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
