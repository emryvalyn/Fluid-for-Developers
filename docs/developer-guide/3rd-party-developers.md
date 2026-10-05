# XOLIX FLUID Developer Guide

This document is a developer-oriented guide to XOLIX FLUID and FluidScript.

## Network summary
XOLIX FLUID is a blockchain platform designed to support:
- native protocol features
- EVM compatibility
- native smart contract execution
- capability-aware contract behavior
- upgrade-safe chains and smart accounts

## Developer overview
The platform supports two main lanes:
1. EVM lane for Solidity and standard Web3 tooling
2. Native FluidScript lane for capability-driven smart contracts

## EVM lane
Mature tooling works with XOLIX FLUID through standard Ethereum-compatible APIs:
- MetaMask
- Hardhat
- Foundry
- Ethers.js
- Viem
- WebSocket and JSON-RPC clients

## Native FluidScript lane
FluidScript adds protocol-native semantics:
- `state persistent`
- `capabilities`
- `preflight`
- `atomic`
- `upgrade_policy`
- `requires`

## Example deployment pattern
```fluid
pragma fluid ^1.0;

import xolix.asset.*;
import xolix.security.*;

contract TokenSwap fluid upgradeable {
    state persistent {
        owner: address;
        map<address, uint256> balances;
    }

    transaction transfer(address to, uint256 amount)
    requires amount > 0 && balances[caller] >= amount
    {
        preflight {
            Security.require_no_reentrancy();
            Risk.require_below_threshold(caller, 0.75);
        }

        atomic {
            balances[caller] -= amount;
            balances[to] += amount;
        }
    }
}
```

## Recommended developer path
- Start with the getting started guide
- Read the language specification files
- Review the example contracts
- Build a small contract in the `examples/` folder
- Test capability and upgrade constraints

## Related files
- `docs/getting-started/README.md`
- `fluid/specification/*.md`
- `fluid/contracts/*.fls`
- `examples/`
