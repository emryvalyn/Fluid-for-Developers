# Wallet and Provider Integration Model

This document explains the safe, public-facing way that third-party developers should understand wallet and provider integration for XOLIX FLUID.

## 1. Purpose of the provider layer

A provider layer gives applications a standard interface for:
- querying account balances
- sending transactions
- reading contract state
- monitoring events
- calling contract methods
- connecting wallets

This layer works across EVM-compatible tools and native Fluid behaviors.

## 2. Standard provider functions

A typical provider exposes methods like:

- `eth_call`
- `eth_sendRawTransaction`
- `eth_getBalance`
- `eth_getTransactionReceipt`
- `eth_getBlockByNumber`
- `eth_getLogs`
- `eth_estimateGas`

These methods allow wallets and apps to interact with contracts in a familiar way.

## 3. Wallet connection flow

A wallet connection generally follows:

```
App loads provider
    ↓
Wallet requests account access
    ↓
User approves connection
    ↓
Application reads chain state
    ↓
Application asks wallet to sign transactions
    ↓
Provider submits signed transaction to network
```

This model is the same used by many EVM dApps.

## 4. Provider hook concept

Provider hooks make it easier for frontends to work with blockchain state. Examples include:

- connection state hook
- latest block hook
- account balance hook
- contract read hook
- transaction submission hook
- websocket stream hook

The purpose is to simplify app logic and keep the UI in sync with chain activity.

## 5. WebSocket integration

A WebSocket layer can be used for:
- live block updates
- subscription to transaction events
- live smart contract event monitoring
- real-time UI updates without polling

The common design is to provide a streaming endpoint such as:

```
wss://rpc.xolix.io/ws
```

This is useful for dashboards, wallets, and live explorers.

## 6. Standard wallet compatibility

XOLIX FLUID supports standard EVM wallet patterns, including:
- MetaMask
- WalletConnect
- browser extension access
- transaction signing flows
- standard JSON-RPC calls

This means third-party developers can use familiar wallet integrations instead of building custom wallet logic from scratch.

## 7. Safety requirements for app developers

App builders should ensure:

- wallet connections are user-approved
- transaction payloads are reviewed before signing
- gas estimation is checked where possible
- event listeners are cleaned up correctly
- provider URLs come from trusted configuration
- provider state is validated before contract writes

## 8. Why this matters for third-party developers

The provider layer matters because it enables:
- quick onboarding of dApps
- standard wallet integration
- reduced custom code for blockchain communication
- compatibility with EVM tooling and patterns
- easier migration from other chains

This is a practical and safe thing for external developers to understand.

## 9. What this excludes

This document does not cover:
- private wallet infrastructure
- internal wallet backend setup
- proprietary signer architecture
- host infrastructure or node management

This is limited to the public-facing provider and wallet integration model.

## 10. Summary

The provider and wallet integration model is one of the most important public developer interfaces for Fluid.

It gives dApps a standard way to:
- connect wallets
- read network state
- sign transactions
- observe events
- handle live updates

This is safe and appropriate for third-party developers to know.
