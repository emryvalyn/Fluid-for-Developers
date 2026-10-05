# XOLIX FLUID Wallet Connection Basics

This guide covers only the minimal wallet connection setup relevant to Fluid developers.

## 1. What this is for
This is for:
- connecting a wallet to XOLIX
- reading on-chain state
- sending transactions
- interacting with deployed contracts
- testing contract behavior from a front-end or dev tool

This is not for:
- building the explorer website
- UI component design
- app hosting
- infrastructure deployment
- AI backend configuration

## 2. Required environment values
Use only the developer-facing network configuration:

```env
NEXT_PUBLIC_XOLIX_RPC_URL=https://rpc.xolix.io
NEXT_PUBLIC_XOLIX_WS_URL=wss://ws.xolix.io
NEXT_PUBLIC_XOLIX_CHAIN_ID=44990
NEXT_PUBLIC_XOLIX_TESTNET_CHAIN_ID=44991
NEXT_PUBLIC_XOLIX_NETWORK_NAME=XOLIX FLUID
```

Use testnet for early development and validation.

## 3. Standard EVM-compatible wallet libraries
Developers commonly use:
- `viem`
- `wagmi`
- `ethers.js`
- `@rainbow-me/rainbowkit`

These are useful for:
- connecting wallets
- reading chain metadata
- submitting transactions
- reading contract state
- calling contract methods

## 4. Minimum wallet integration pattern
At a high level, the flow is:
1. configure the chain metadata
2. connect the wallet provider
3. confirm the network is correct
4. read wallet address and balances
5. call contract methods or send transactions

Example concept:

```ts
const config = {
  chainId: 44990,
  rpcUrl: 'https://rpc.xolix.io',
};
```

This is a conceptual pattern only. Specific runtime setup should match your chosen client library and deployment environment.

## 5. Contract interaction principles
When interacting with a Fluid contract:
- confirm the correct network
- validate the contract address
- know the function signatures
- confirm the expected state transitions
- test invalid input before live usage

## 6. Recommended workflow
1. Build your contract logic
2. validate the design and security model
3. connect a test wallet
4. connect to testnet
5. test contract calls
6. review execution results
7. move to mainnet only after testnet validation

## 7. Important note
This file intentionally excludes:
- frontend-only app design
- explorer infrastructure
- hosting details
- AI tooling
- unrelated platform services

The topic here is limited to wallet connection and contract interaction for XOLIX FLUID developers.
