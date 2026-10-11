# Tutorial 3: Creating & Deploying a QSC-20 Fungible Token

In this tutorial, you will build and launch a custom fungible token following the official **QSC-20 standard** on XOLIX.

---

## 1. Writing Your Token (`contracts/XolixGem.fls`)

```fluid
version 1.0;

contract XolixGem {
    state persistent {
        owner: address;
        name: string;
        symbol: string;
        decimals: uint8;
        totalSupply: uint256;
        balances: map<address, uint256>;
        allowances: map<address, map<address, uint256>>;
    }

    constructor(initialSupply: uint256) {
        state.owner = msg.sender;
        state.name = "Xolix Gem Token";
        state.symbol = "XGEM";
        state.decimals = 18;
        state.totalSupply = initialSupply;
        state.balances[msg.sender] = initialSupply;
    }

    public name(): string { return state.name; }
    public symbol(): string { return state.symbol; }
    public decimals(): uint8 { return state.decimals; }
    public totalSupply(): uint256 { return state.totalSupply; }
    public balanceOf(account: address): uint256 { return state.balances[account]; }

    public transfer(to: address, amount: uint256): bool {
        require(state.balances[msg.sender] >= amount, "XGEM: Insufficient balance");
        state.balances[msg.sender] = state.balances[msg.sender] - amount;
        state.balances[to] = state.balances[to] + amount;
        return true;
    }

    public approve(spender: address, amount: uint256): bool {
        state.allowances[msg.sender][spender] = amount;
        return true;
    }

    public transferFrom(from: address, to: address, amount: uint256): bool {
        require(state.balances[from] >= amount, "XGEM: Insufficient balance");
        require(state.allowances[from][msg.sender] >= amount, "XGEM: Insufficient allowance");

        state.allowances[from][msg.sender] = state.allowances[from][msg.sender] - amount;
        state.balances[from] = state.balances[from] - amount;
        state.balances[to] = state.balances[to] + amount;
        return true;
    }

    @owner
    public mint(to: address, amount: uint256) {
        state.totalSupply = state.totalSupply + amount;
        state.balances[to] = state.balances[to] + amount;
    }
}
```

---

## 2. Compile and Deploy

```typescript
// scripts/deploy-token.ts
import { JsonRpcProvider, XolixWallet, ContractFactory, XolixUtils } from '@xolix/sdk';
import * as fs from 'fs';

async function main() {
  const provider = new JsonRpcProvider({ url: 'https://testnet-rpc.xolix.io' });
  const wallet = new XolixWallet(process.env.TESTNET_PRIVATE_KEY!, provider);

  const abi = JSON.parse(fs.readFileSync('./build/XolixGem.abi', 'utf8'));
  const bytecode = fs.readFileSync('./build/XolixGem.xls', 'utf8');

  const factory = new ContractFactory(abi, bytecode, wallet, false);

  // Deploy 10,000,000 XGEM tokens
  const initialSupply = XolixUtils.parseXOL('10000000.0');
  const token = await factory.deploy(initialSupply);

  console.log(`QSC-20 Token deployed at: ${token.address}`);
  await token.waitForDeployment();
  console.log(`Live on XolixScan: https://scan.xolix.io/testnet/token/${token.address}`);
}

main().catch(console.error);
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
