# Quickstart: Build & Deploy in 10 Minutes

This quickstart guide walks you through writing, compiling, and deploying your very first Fluid smart contract using the official `@xolix/sdk` in under 10 minutes.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher
- **NPM**: v9.0.0 or higher
- **TypeScript**: Installed globally or locally

Verify in terminal:
```bash
node -v
npm -v
```

---

## 2. Initialize Your Project

Create a directory and install the required development dependencies:

```bash
mkdir xolix-quickstart && cd xolix-quickstart
npm init -y

# Install the official Xolix SDK and TypeScript tooling
npm install @xolix/sdk ethers
npm install --save-dev typescript ts-node @types/node
npx tsc --init
```

---

## 3. Write Your Contract (`HelloWorld.fls`)

Create a `HelloWorld.fls` file:

```fluid
// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc.
version 1.0;

contract HelloWorld {
    state persistent {
        owner: address;
        message: string;
    }

    constructor(initialMessage: string) {
        state.owner = msg.sender;
        state.message = initialMessage;
    }

    // Zero-gas public read method
    public getMessage(): string {
        return state.message;
    }

    // State mutation method (requires XCU gas)
    public setMessage(newMessage: string) {
        require(newMessage != "", "HelloWorld: Message cannot be empty");
        state.message = newMessage;
    }

    // Privileged method protected by native capability
    @owner
    public resetMessage() {
        state.message = "Hello, XOLIX FLUID!";
    }
}
```

---

## 4. Deploy with TypeScript Script (`deploy.ts`)

Create `deploy.ts`:

```typescript
import { JsonRpcProvider, XolixWallet, FluidContractManager, ContractFactory } from '@xolix/sdk';
import * as fs from 'fs';

async function main() {
  // 1. Connect to Public Testnet RPC
  const provider = new JsonRpcProvider({ url: 'https://testnet-rpc.xolix.io' });

  // 2. Load Deployer Wallet (Generate or restore with private key)
  const wallet = XolixWallet.createRandom(provider);
  console.log(`Deployer Address: ${wallet.getNativeAddress()}`);
  console.log(`Deployer Private Key: ${wallet.privateKey}`);

  // 3. Read & Compile Contract
  const sourceCode = fs.readFileSync('./HelloWorld.fls', 'utf8');
  const manager = new FluidContractManager(provider);
  const artifact = manager.compileSource(sourceCode);

  console.log(`Compilation successful! Generated XLS bytecode: ${artifact.bytecode.slice(0, 24)}...`);

  // 4. Deploy using ContractFactory
  const factory = new ContractFactory(artifact.abi, artifact.bytecode, wallet, false);
  console.log('Deploying HelloWorld contract to XOLIX Testnet...');
  
  const contract = await factory.deploy('Welcome to XOLIX!');
  console.log(`\n Contract Deployed Successfully!`);
  console.log(`Address: ${contract.address}`); // e.g. xolc1...

  // 5. Read State (Zero Gas)
  const greeting = await contract.read('getMessage');
  console.log(`Read on-chain state: "${greeting}"`);
}

main().catch(console.error);
```

---

## 5. Execute Deployment

Run your deployment script:

```bash
npx ts-node deploy.ts
```

Output:
```text
Deployer Address: xol1q8k7...
Compilation successful! Generated XLS bytecode: 0x464c5301...
Deploying HelloWorld contract to XOLIX Testnet...

 Contract Deployed Successfully!
Address: xolc1q9f2p...
Read on-chain state: "Welcome to XOLIX!"
```

Congratulations! You have written, compiled, deployed, and verified your first native smart contract on XOLIX FLUID.

---

## Next Steps
- Dive into [FluidScript Syntax & Structure](../fluidscript/01-syntax-and-structure.md)
- Learn how to build [Fungible QSC-20 Tokens](../standards/QSC20-fungible-tokens.md)
- Connect frontends with [DApp Wallet Integration](../dapps/01-wallet-integration.md)
