# XOLIX FLUID Developer Path

This is the minimal developer route for learning and building with XOLIX FLUID.

## 1. Learn the language fundamentals
Read these in order:
- `docs/getting-started/README.md`
- `docs/learn-fluid-in-30-minutes.md`
- `docs/fluidscript/index.md`
- `fluid/specification/language.md`
- `fluid/specification/security.md`
- `fluid/specification/upgrades.md`

Focus on:
- `state persistent`
- `transaction`
- `requires`
- `preflight`
- `atomic`
- upgrade policy

## 2. Learn the contract structure
Every Fluid contract should define:
- persistent state
- validation rules
- access control
- preflight safety checks
- atomic state mutation
- upgrade policy where needed

## 3. Set up the dev environment
Use only the network information required for contract interaction:

```env
NEXT_PUBLIC_XOLIX_RPC_URL=https://rpc.xolix.io
NEXT_PUBLIC_XOLIX_WS_URL=wss://ws.xolix.io
NEXT_PUBLIC_XOLIX_CHAIN_ID=44990
NEXT_PUBLIC_XOLIX_TESTNET_CHAIN_ID=44991
NEXT_PUBLIC_XOLIX_NETWORK_NAME=XOLIX FLUID
```

Use testnet first.

## 4. Connect a wallet
Use standard EVM-compatible wallet tooling if needed:
- wagmi
- viem
- RainbowKit
- ethers.js

This is only for wallet and transaction connection, not frontend app building.

## 5. Write your first contract
Start with:
- a minimal counter
- an owner-gated update
- a validation-based transfer
- a preflight + atomic pattern

## 6. Validate security
Every contract should enforce:
- explicit input checks
- permission checks
- reentrancy prevention
- clear state transitions
- upgrade-aware design

## 7. Validate on testnet
Before production:
- deploy to testnet
- test ownership rules
- test invalid input
- test state changes
- validate upgrade expectations

## 8. Production readiness
Before mainnet:
- review authority model
- review upgrade policy
- validate state assumptions
- ensure input constraints are explicit
- verify all invariants

## 9. What is not required
This path deliberately excludes:
- explorer website setup
- frontend UI engineering
- Firebase setup
- AI backend tooling
- app hosting configuration
- non-contract infrastructure

These are not needed for writing dynamic, secure Fluid smart contracts.

## 10. Recommended beginner flow
1. Learn the language
2. Write a small contract
3. Add validation
4. Add access control
5. Add safety checks
6. Test on testnet
7. Review upgrade patterns
8. Move to production only after validation

This is the cleanest and most focused developer route for XOLIX FLUID.
