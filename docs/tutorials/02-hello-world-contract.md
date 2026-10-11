# Tutorial 2: Hello World — Zero to Deployed

In this hands-on tutorial, you will write, compile, and deploy your first native smart contract on the XOLIX FLUID Testnet.

---

## 1. Writing `contracts/HelloWorld.fls`

Create a file named `contracts/HelloWorld.fls`:

```fluid
// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc.
version 1.0;

contract HelloWorld {
    state persistent {
        owner: address;
        greeting: string;
        updateCount: uint256;
    }

    constructor(initialGreeting: string) {
        state.owner = msg.sender;
        state.greeting = initialGreeting;
        state.updateCount = 0;
    }

    public getGreeting(): string {
        return state.greeting;
    }

    public getUpdateCount(): uint256 {
        return state.updateCount;
    }

    public setGreeting(newGreeting: string) {
        require(newGreeting != "", "HelloWorld: Greeting cannot be empty");
        state.greeting = newGreeting;
        state.updateCount = state.updateCount + 1;
    }

    @owner
    public resetGreeting() {
        state.greeting = "Hello, XOLIX FLUID!";
    }
}
```

---

## 2. Compiling the Contract

Compile the source using the CLI:

```bash
npx fluid compile
```

Output:
```text
[Fluid Compiler] Compiling contracts/HelloWorld.fls...
[Fluid Compiler] Successfully created build/HelloWorld.xls (Bytecode) and build/HelloWorld.abi (ABI)
```

---

## 3. Writing the Deployment Script (`scripts/deploy.ts`)

Create `scripts/deploy.ts`:

```typescript
import { JsonRpcProvider, XolixWallet, ContractFactory } from '@xolix/sdk';
import * as fs from 'fs';

async function main() {
  const provider = new JsonRpcProvider({ url: 'https://testnet-rpc.xolix.io' });
  
  // Use private key with testnet funds
  const privateKey = process.env.TESTNET_PRIVATE_KEY || 'YOUR_PRIVATE_KEY';
  const wallet = new XolixWallet(privateKey, provider);

  console.log(`Deploying with account: ${wallet.getNativeAddress()}`);

  const abi = JSON.parse(fs.readFileSync('./build/HelloWorld.abi', 'utf8'));
  const bytecode = fs.readFileSync('./build/HelloWorld.xls', 'utf8');

  const factory = new ContractFactory(abi, bytecode, wallet, false);
  const contract = await factory.deploy("Hello, XOLIX Ecosystem!");

  console.log(`Contract deployed! Address: ${contract.address}`);

  const receipt = await contract.waitForDeployment();
  console.log(`Mined in block #${receipt.blockNumber}`);

  // Test read call
  const message = await contract.read('getGreeting');
  console.log(`On-chain greeting: "${message}"`);
}

main().catch(console.error);
```

---

## 4. Run the Deployment

```bash
npx ts-node scripts/deploy.ts
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
