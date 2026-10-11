# QSC-20 Fungible Token Standard Specification

The **QSC-20** standard defines the canonical interface and behavior for fungible tokens on the XOLIX FLUID blockchain (equivalent to ERC-20 on Ethereum).

---

## 1. Interface Specification

```fluid
interface IQSC20 {
    public totalSupply(): uint256;
    public balanceOf(account: address): uint256;
    public allowance(owner: address, spender: address): uint256;
    public transfer(to: address, amount: uint256): bool;
    public approve(spender: address, amount: uint256): bool;
    public transferFrom(from: address, to: address, amount: uint256): bool;
}
```

---

## 2. Standard Implementation (`QSC20.fls`)

```fluid
// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.
version 1.0;

contract QSC20 {
    state persistent {
        owner: address;
        name: string;
        symbol: string;
        decimals: uint8;
        totalSupply: uint256;
        balances: map<address, uint256>;
        allowances: map<address, map<address, uint256>>;
    }

    constructor(tokenName: string, tokenSymbol: string, initSupply: uint256) {
        state.owner = msg.sender;
        state.name = tokenName;
        state.symbol = tokenSymbol;
        state.decimals = 18;
        state.totalSupply = initSupply;
        state.balances[msg.sender] = initSupply;
    }

    public totalSupply(): uint256 {
        return state.totalSupply;
    }

    public balanceOf(account: address): uint256 {
        return state.balances[account];
    }

    public allowance(tokenOwner: address, spender: address): uint256 {
        return state.allowances[tokenOwner][spender];
    }

    public transfer(to: address, amount: uint256): bool {
        require(state.balances[msg.sender] >= amount, "QSC20: Insufficient balance");
        
        state.balances[msg.sender] = state.balances[msg.sender] - amount;
        state.balances[to] = state.balances[to] + amount;
        
        return true;
    }

    public approve(spender: address, amount: uint256): bool {
        state.allowances[msg.sender][spender] = amount;
        return true;
    }

    public transferFrom(from: address, to: address, amount: uint256): bool {
        require(state.balances[from] >= amount, "QSC20: Insufficient balance");
        require(state.allowances[from][msg.sender] >= amount, "QSC20: Insufficient allowance");

        state.allowances[from][msg.sender] = state.allowances[from][msg.sender] - amount;
        state.balances[from] = state.balances[from] - amount;
        state.balances[to] = state.balances[to] + amount;

        return true;
    }

    @owner
    public mint(to: address, amount: uint256): bool {
        state.totalSupply = state.totalSupply + amount;
        state.balances[to] = state.balances[to] + amount;
        return true;
    }

    public burn(amount: uint256): bool {
        require(state.balances[msg.sender] >= amount, "QSC20: Insufficient balance to burn");
        state.balances[msg.sender] = state.balances[msg.sender] - amount;
        state.totalSupply = state.totalSupply - amount;
        return true;
    }
}
```

---

## 3. Key Differences from ERC-20

1. **Protocol Overflows Protected**: Subtractions and additions revert on overflow/underflow automatically without needing external libraries.
2. **Native Capability Decorator**: Administrative minting is decorated with `@owner`, eliminating modifier bugs.
3. **Bech32m Integration**: Transfers can accept native `xol1...` Bech32m addresses directly.

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
