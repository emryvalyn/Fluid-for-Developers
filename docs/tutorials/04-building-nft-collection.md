# Tutorial 4: Building a QSC-721 NFT Collection

In this tutorial, you will create, deploy, and mint a non-fungible token (NFT) collection with on-chain metadata and IPFS integration on XOLIX FLUID.

---

## 1. Writing `contracts/XolixPunks.fls`

```fluid
version 1.0;

contract XolixPunks {
    state persistent {
        owner: address;
        name: string;
        symbol: string;
        maxSupply: uint256;
        currentSupply: uint256;
        mintPrice: uint256;
        tokenOwners: map<uint256, address>;
        tokenURIs: map<uint256, string>;
    }

    constructor(collectionMax: uint256, price: uint256) {
        state.owner = msg.sender;
        state.name = "Xolix Punks";
        state.symbol = "XPUNK";
        state.maxSupply = collectionMax;
        state.mintPrice = price;
        state.currentSupply = 0;
    }

    public ownerOf(tokenId: uint256): address {
        require(state.tokenOwners[tokenId] != address(0), "XPUNK: Token does not exist");
        return state.tokenOwners[tokenId];
    }

    public tokenURI(tokenId: uint256): string {
        return state.tokenURIs[tokenId];
    }

    public mint(uri: string): uint256 {
        require(msg.value >= state.mintPrice, "XPUNK: Insufficient payment");
        require(state.currentSupply < state.maxSupply, "XPUNK: Collection sold out");

        state.currentSupply = state.currentSupply + 1;
        let newId = state.currentSupply;

        state.tokenOwners[newId] = msg.sender;
        state.tokenURIs[newId] = uri;

        return newId;
    }

    @owner
    public withdrawProceeds() {
        transferNative(state.owner, address(this).balance);
    }
}
```

---

## 2. Deploying and Minting

```typescript
import { JsonRpcProvider, XolixWallet, ContractFactory, XolixUtils } from '@xolix/sdk';
import * as fs from 'fs';

async function main() {
  const provider = new JsonRpcProvider({ url: 'https://testnet-rpc.xolix.io' });
  const wallet = new XolixWallet(process.env.TESTNET_PRIVATE_KEY!, provider);

  const abi = JSON.parse(fs.readFileSync('./build/XolixPunks.abi', 'utf8'));
  const bytecode = fs.readFileSync('./build/XolixPunks.xls', 'utf8');

  const factory = new ContractFactory(abi, bytecode, wallet, false);

  // Deploy 10,000 max supply at 0.1 XOLT per mint
  const nft = await factory.deploy(10000n, XolixUtils.parseXOL('0.1'));
  console.log(`NFT Collection deployed at: ${nft.address}`);
  await nft.waitForDeployment();

  // Mint Token #1
  const ipfsUri = 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi';
  const mintTx = await nft.write('mint', ipfsUri, { value: XolixUtils.parseXOL('0.1') });
  console.log(`Mint tx broadcast: ${mintTx.txHash}`);
}

main().catch(console.error);
```

---
*// Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved.*
