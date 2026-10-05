# XOLIX FLUID - EVM Compatibility Layer

This document describes how XOLIX FLUID maintains EVM compatibility while adding native Fluid features for developers and dApp builders.

## 1. What is EVM compatibility?

XOLIX FLUID can execute:
- Standard Solidity smart contracts
- Ethereum JSON-RPC API calls
- Existing Web3 tools such as MetaMask, Hardhat, Ethers.js, and Wagmi
- EVM bytecode directly
- Standard Ethereum-compatible precompiles

This gives teams a familiar path for deployment and integration while preserving the native XOLIX Fluid model.

## 2. Two execution layers

XOLIX FLUID includes two parallel execution environments:

```
XOLIX FLUID Network
    │
    ├── Native Fluid Layer
    │   ├── FluidScript contracts
    │   ├── Fluid upgrade architecture
    │   ├── Native capability system
    │   └── Semantic state management
    │
    └── EVM Compatibility Layer
        ├── Solidity contracts
        ├── EVM bytecode execution
        ├── Ethereum JSON-RPC API
        ├── Standard precompiles
        └── Proxy shortcut patterns for compatibility
```

Both layers share:
- the same blockchain
- the same network state
- the same transaction lifecycle
- the same chain identity and gas accounting

## 3. EVM execution engine

The EVM runtime executes Ethereum opcodes deterministically:

```typescript
import { EVMRuntime } from './evm/runtime';

const evm = new EVMRuntime();
const result = await evm.executeTransaction({
    to: '0x7A91F4C82E6D3B9A1F0C7D5E8B42A6F3C91D0E27',
    data: '0x...',
    value: '0',
    from: '0x...',
});
```

The EVM runtime is:
- compatible with Ethereum execution semantics
- optimized for XOLIX network performance
- separate from the native Fluid layer
- useful for compatibility and migration

## 4. Native EVM precompiles

XOLIX FLUID includes standard Ethereum precompiles and additional XOLIX-specific ones.

| Address | Function |
|---------|----------|
| 0x01 | ECDSA public key recovery |
| 0x02 | SHA256 hash accelerator |
| 0x03 | RIPEMD160 hash accelerator |
| 0x04 | Identity pass-through |
| 0x05 | Modular exponentiation |
| 0x06 | BN256 addition |
| 0x07 | BN256 scalar multiplication |
| 0x08 | BN256 pairing check |
| 0x09 | Blake2F compression |
| 0x0a | XOLIX native QSC asset bridge adapter |

Precompile 0x0a is specific to XOLIX and is used for native bridge or compatibility logic.

## 5. JSON-RPC compatibility

XOLIX FLUID exposes standard Ethereum JSON-RPC endpoints.

Example:

```bash
curl -X POST https://rpc.xolix.io \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "eth_getBalance",
    "params": ["0x7A91F4C82E6D3B9A1F0C7D5E8B42A6F3C91D0E27", "latest"]
  }'
```

Common supported methods:
- `eth_call`
- `eth_sendRawTransaction`
- `eth_getBalance`
- `eth_getCode`
- `eth_getStorageAt`
- `eth_blockNumber`
- `eth_getBlockByNumber`
- `eth_gasPrice`
- `eth_estimateGas`
- `eth_getLogs`

## 6. Address format

XOLIX supports both native and EVM-style addresses.

### EVM-compatible addresses

```
0x7A91F4C82E6D3B9A1F0C7D5E8B42A6F3C91D0E27
```

This is a standard 20-byte Ethereum address and is familiar to wallets and tooling.

### Native XOLIX addresses

```
xol1q7k5m3v8n2c4y6p9r0s4d7f2g8h5j3k6w9z   (account)
xolc1q7k5m3v8n2c4y6p9r0s4d7f2g8h5j3k6w9z (contract)
```

Both address styles can exist in the XOLIX ecosystem, but the network should treat types consistently.

## 7. Wallet integration

Standard EVM wallets can work directly with XOLIX.

### MetaMask

Example network settings:

```
Network Name: XOLIX FLUID
RPC URL: https://rpc.xolix.io
Chain ID: 44990
Currency: XOL
```

### WalletConnect

WalletConnect works with EVM-compatible wallets and relays transactions to XOLIX.

```typescript
import { EthereumProvider } from '@walletconnect/ethereum-provider';

const provider = await EthereumProvider.init({
  projectId: 'YOUR_PROJECT_ID',
  chains: [44990],
  rpcMap: {
    44990: 'https://rpc.xolix.io',
  },
});
```

## 8. Deploying Solidity contracts

Developers can use familiar tooling:

### Hardhat

```javascript
module.exports = {
  networks: {
    xolix: {
      url: 'https://rpc.xolix.io',
      accounts: [process.env.PRIVATE_KEY],
      chainId: 44990,
    },
  },
};
```

### Ethers.js

```typescript
import { ethers } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://rpc.xolix.io');
const signer = new ethers.Wallet(privateKey, provider);

const contractFactory = new ethers.ContractFactory(ABI, BYTECODE, signer);
const contract = await contractFactory.deploy();
```

## 9. Gas and fees

XOLIX FLUID follows Ethereum-style gas accounting:

```
Transaction Fee = Gas Used × Gas Price
```

This helps developers reuse familiar tooling and accounting assumptions.

## 10. Testnet compatibility

XOLIX FLUID testnet remains compatible with standard deployment and wallet patterns:

```
Testnet RPC: https://testnet-rpc.xolix.io
Chain ID: 44991
```

This allows developers to validate scripts, wallet setup, and contract deployment before moving to production.

## 11. Native Fluid contracts and EVM contracts together

A hybrid dApp can interact with both contract environments.

```typescript
// EVM stablecoin contract
const usdcAddress = '0x...';
const usdc = new ethers.Contract(usdcAddress, ERC20ABI, signer);

// Native Fluid DEX contract
const dexAddress = 'xolc1...';

await usdc.approve(dexAddress, amount);
```

This helps teams migrate gradually without abandoning their existing EVM tooling.

## 12. Proxy upgrade patterns

Standard EVM proxy patterns can be used on XOLIX FLUID if needed:
- UUPS
- Transparent Proxy
- Beacon Proxy patterns

This provides a migration path for existing Solidity-based systems.

At the same time, Native Fluid contracts can use the built-in upgrade architecture to avoid manual proxy management.

## 13. Storage model compatibility

EVM storage is still supported:

```solidity
mapping(address => uint256) public balances;
```

However, Fluid-native storage is semantic and more developer-friendly:

```fluid
state persistent {
    balances: map<address, uint256>;
}
```

This means teams can choose the storage model that matches the contract style.

## 14. Event logs compatibility

Event logs remain queryable using standard Ethereum tooling:

```typescript
const logs = await provider.getLogs({
    address: '0x...',
    fromBlock: 'earliest',
    toBlock: 'latest',
    topics: ['0x...'],
});
```

This preserves compatibility with existing indexers, dashboards, and observers.

## 15. Why this matters for third-party developers

This compatibility layer matters because it allows developers to:
- reuse Solidity and EVM tooling
- use familiar wallet and contract deployment workflows
- add Fluid-native architecture where it adds real value
- migrate gradually without rewriting every integration layer

It reduces the cost of adoption while giving protocol builders a more robust native contract model.

## 16. Safety and scope

This document is intentionally limited to:
- EVM compatibility patterns
- Solidity tool compatibility
- wallet and transaction interoperability
- third-party developer onboarding

It does not cover:
- private validator operations
- internal consensus engineering
- infrastructure deployment details
- unrelated product or platform work

## 17. Summary

XOLIX FLUID is designed to be friendly to both:
- Solidity/EVM developers who want familiar tooling
- Fluid-native developers who want semantic state, capability checks, and native upgrade safety

This gives the network a pragmatic compatibility layer while keeping the native Fluid contract model available for future protocol design.
