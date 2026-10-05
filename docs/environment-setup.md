# XOLIX FLUID Development Environment Setup

This file contains only the information needed for developers writing Fluid contracts and connecting to the XOLIX blockchain.

## Network configuration

Use the public XOLIX FLUID RPC endpoints when connecting wallets or clients.

### Mainnet
```env
NEXT_PUBLIC_XOLIX_RPC_URL=https://rpc.xolix.io
NEXT_PUBLIC_XOLIX_WS_URL=wss://ws.xolix.io
NEXT_PUBLIC_XOLIX_CHAIN_ID=44990
NEXT_PUBLIC_XOLIX_NETWORK_NAME=XOLIX FLUID
```

### Testnet
```env
NEXT_PUBLIC_XOLIX_RPC_URL=https://testnet-rpc.xolix.io
NEXT_PUBLIC_XOLIX_WS_URL=wss://ws-testnet.xolix.io
NEXT_PUBLIC_XOLIX_TESTNET_CHAIN_ID=44991
NEXT_PUBLIC_XOLIX_NETWORK_NAME=XOLIX FLUID Testnet
```

## Minimal environment variables
```env
NEXT_PUBLIC_XOLIX_RPC_URL=https://rpc.xolix.io
NEXT_PUBLIC_XOLIX_WS_URL=wss://ws.xolix.io
NEXT_PUBLIC_XOLIX_CHAIN_ID=44990
NEXT_PUBLIC_XOLIX_TESTNET_CHAIN_ID=44991
NEXT_PUBLIC_XOLIX_NETWORK_NAME=XOLIX FLUID
```

## What this is for
This configuration is only for:
- connecting wallets to XOLIX
- sending transactions
- reading blockchain state
- integrating with EVM-compatible tooling
- testing contract deployments

This is not for:
- explorer frontend setup
- Firebase deployment
- AI backend setup
- UI framework setup
- app hosting configuration

## Optional EVM tooling
If you are building EVM-compatible contracts or using standard Ethereum tooling, you can use:
- viem
- wagmi
- ethers.js
- Hardhat
- Foundry

These are optional for Fluid developers, especially if you are working in Solidity or EVM-compatible environments.

## Practical developer rule
For Fluid native development, focus on:
- language syntax
- state and transaction design
- security checks
- upgrade safety
- network connection and contract deployment

Do not add frontend or explorer infrastructure unless you are building a browser app around the chain.

## Recommended network choice
- Use testnet for learning and contract testing
- Use mainnet only for production deployment

## Summary
The only environment information that matters for smart contract development is:
- chain IDs
- RPC endpoints
- WebSocket endpoints
- wallet/network names

Everything else is not required for writing Fluid smart contracts.
