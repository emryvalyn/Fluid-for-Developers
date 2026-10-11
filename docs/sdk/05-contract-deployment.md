# Programmatic Contract Deployment: `ContractFactory`

Deploying smart contracts programmatically can be done via `ContractFactory` for precompiled bytecode, or `FluidContractManager` for on-the-fly source compilation.

---

## 1. Deploying via `ContractFactory`

`ContractFactory` handles the deployment lifecycle, constructor argument packing, and deterministic address calculation.

```typescript
import { JsonRpcProvider, XolixWallet, ContractFactory } from '@xolix/sdk';
import * as fs from 'fs';

async function deploy() {
  const provider = new JsonRpcProvider({ url: 'https://testnet-rpc.xolix.io' });
  const wallet = new XolixWallet('YOUR_PRIVATE_KEY', provider);

  // Load ABI and compiled XLS or EVM bytecode
  const abi = JSON.parse(fs.readFileSync('./build/MyToken.abi', 'utf8'));
  const bytecode = fs.readFileSync('./build/MyToken.xls', 'utf8');

  // isEvm: false = Native Fluid Lane (xolc1...), true = EVM Lane (0x...)
  const factory = new ContractFactory(abi, bytecode, wallet, false);

  console.log('Broadcasting deployment transaction...');
  const contract = await factory.deploy(
    'My Fluid Token',
    'MFT',
    1000000n * 10n**18n // Initial supply constructor argument
  );

  console.log(`Contract deployment submitted! Address: ${contract.address}`);

  // Wait for block receipt
  const receipt = await contract.waitForDeployment();
  console.log(`Confirmed in Block #${receipt.blockNumber}`);
}

deploy();
```

---

## 2. In-Memory Compilation via `FluidContractManager`

For developer toolchains, test runners, or web IDEs, compile `.fls` source directly in memory:

```typescript
import { FluidContractManager, JsonRpcProvider } from '@xolix/sdk';

const provider = new JsonRpcProvider({ url: 'https://testnet-rpc.xolix.io' });
const manager = new FluidContractManager(provider);

const flsSource = `
version 1.0;
contract SimpleCounter {
    state persistent { count: uint256; }
    public increment() { state.count = state.count + 1; }
    public getCount(): uint256 { return state.count; }
}
`;

// Compiles directly to XLS bytecode and JSON ABI
const artifact = manager.compileSource(flsSource);
console.log('Bytecode size:', artifact.bytecode.length / 2, 'bytes');
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
