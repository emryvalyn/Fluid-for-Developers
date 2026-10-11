# Multi-Contract Interactions, Interfaces & Factories

Fluid contracts are designed to interoperate smoothly across contracts without relying on cumbersome, unsafe low-level assembly or manual ABI packing.

---

## 1. Calling External Contracts via Interfaces

To call another deployed Fluid contract, declare an `interface` containing the target function signatures and cast the target address:

```fluid
// 1. Declare target interface
interface IQSC20 {
    public balanceOf(account: address): uint256;
    public transfer(to: address, amount: uint256): bool;
    public transferFrom(from: address, to: address, amount: uint256): bool;
}

contract PaymentSplitter {
    state persistent {
        owner: address;
        tokenAddress: address;
    }

    constructor(token: address) {
        state.owner = msg.sender;
        state.tokenAddress = token;
    }

    public payout(recipient1: address, recipient2: address, totalAmount: uint256) {
        let half = totalAmount / 2;

        // Instantiate interface
        let token = IQSC20(state.tokenAddress);

        // Execute external calls
        let success1 = token.transferFrom(msg.sender, recipient1, half);
        require(success1, "Payout 1 failed");

        let success2 = token.transferFrom(msg.sender, recipient2, half);
        require(success2, "Payout 2 failed");
    }
}
```

---

## 2. On-Chain Contract Factories (`create`)

FluidScript provides the `create` operator to deploy a new child contract dynamically from within another contract:

```fluid
contract ChildVault {
    state persistent {
        creator: address;
        vaultName: string;
    }

    constructor(name: string) {
        state.creator = msg.sender;
        state.vaultName = name;
    }
}

contract VaultFactory {
    state persistent {
        owner: address;
        deployedVaults: map<uint256, address>;
        vaultCount: uint256;
    }

    constructor() {
        state.owner = msg.sender;
        state.vaultCount = 0;
    }

    public createVault(name: string): address {
        // Deploy new instance of ChildVault
        let newVaultAddress = create ChildVault(name);

        state.vaultCount = state.vaultCount + 1;
        state.deployedVaults[state.vaultCount] = newVaultAddress;

        return newVaultAddress;
    }
}
```

When `create` is executed:
- The node generates a deterministic `xolc1...` contract address derived from the factory contract's address and its deployment nonce.
- The child contract's constructor runs immediately with the provided parameters.
- The new contract address is returned and can be stored in state.

---

## 3. Cross-Lane EVM Interoperability

XOLIX is dual-lane. A Fluid contract on the Native Lane can call an EVM Solidity contract on the EVM Lane seamlessly. 

The XolixVM includes built-in ABI translation precompiles:
- Fluid types are serialized to standard ABI byte representations.
- EVM return data is deserialized back into Fluid native types.

Developers interact with Solidity contracts using the exact same interface syntax!

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
