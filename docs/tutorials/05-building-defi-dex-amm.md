# Tutorial 5: Building a DeFi Automated Market Maker (AMM)

In this tutorial, you will build and deploy a decentralized constant-product ($x \cdot y = k$) liquidity pool on XOLIX FLUID that allows users to deposit liquidity, earn LP fees, and swap tokens.

---

## 1. AMM Invariants

The constant-product formula states:
$$(x + \Delta x \cdot (1 - \text{fee})) \cdot (y - \Delta y) = x \cdot y$$

Where:
- $x$: Reserve of Token A
- $y$: Reserve of Token B
- $\text{fee}$: 0.3% ($30$ basis points)

---

## 2. Deploying the Pool Contract

Using `examples/dex-amm-pool.fls`:

```typescript
import { JsonRpcProvider, XolixWallet, ContractFactory, XolixContract } from '@xolix/sdk';
import * as fs from 'fs';

async function main() {
  const provider = new JsonRpcProvider({ url: 'https://testnet-rpc.xolix.io' });
  const wallet = new XolixWallet(process.env.TESTNET_PRIVATE_KEY!, provider);

  const abi = JSON.parse(fs.readFileSync('./build/DexAmmPool.abi', 'utf8'));
  const bytecode = fs.readFileSync('./build/DexAmmPool.xls', 'utf8');

  const tokenAAddress = 'xolc1qtokenA...';
  const tokenBAddress = 'xolc1qtokenB...';

  const factory = new ContractFactory(abi, bytecode, wallet, false);
  const pool = await factory.deploy(tokenAAddress, tokenBAddress);
  console.log(`DEX AMM Pool deployed at: ${pool.address}`);
  await pool.waitForDeployment();

  // Add initial liquidity
  console.log('Adding initial liquidity...');
  const addLiqTx = await pool.write('addLiquidity', 1000n * 10n**18n, 2000n * 10n**18n);
  await provider.waitForTransaction(addLiqTx.txHash);
  console.log('Liquidity provision confirmed!');
}

main().catch(console.error);
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
