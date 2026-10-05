# Fluid Contract Developer Checklist

This checklist captures the minimum set of responsibilities for a developer working with XOLIX FLUID smart contracts.

## 1. Understand the language
Before writing contracts, review:
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
- `upgrade_policy`

## 2. Set up the environment
Use the public developer endpoints:

```env
NEXT_PUBLIC_XOLIX_RPC_URL=https://rpc.xolix.io
NEXT_PUBLIC_XOLIX_WS_URL=wss://ws.xolix.io
NEXT_PUBLIC_XOLIX_CHAIN_ID=44990
NEXT_PUBLIC_XOLIX_TESTNET_CHAIN_ID=44991
NEXT_PUBLIC_XOLIX_NETWORK_NAME=XOLIX FLUID
```

Use testnet first for learning and contract validation.

## 3. Connect a wallet
Use wallet tooling compatible with the EVM ecosystem, such as:
- wagmi
- viem
- RainbowKit
- ethers.js

This is only for wallet connection and reading or sending blockchain transactions.

## 4. Design the contract before coding
Every contract should define:
- state variables
- permissions and ownership rules
- validation conditions
- preflight safety checks
- atomic mutation logic
- upgrade policy when applicable

## 5. Review security requirements
Each contract should enforce:
- validation of all inputs
- strict ownership or authority checks
- reentrancy prevention
- explicit access control
- invariants where relevant

## 6. Prepare for upgrades
If the contract is upgradeable, define:
- governance or authority model
- timelock expectations
- compatibility checks
- simulation and invariant validation before activation

## 7. Validate on testnet
Before production:
- deploy on testnet
- confirm transaction flows
- verify ownership rules
- verify failure conditions
- verify state changes
- confirm upgrade safety design

## 8. Keep the contract minimal
Prefer:
- small, clear state models
- explicit validation logic
- deterministic execution paths
- readable transaction boundaries

Avoid:
- unclear permissions
- hidden state mutation
- duplicate validation paths
- unsafe upgrade assumptions

## 9. Typical contract architecture
A Fluid smart contract should normally include:
- state definition
- input validation
- administrative or permission checks
- preflight safety block
- mutation block
- upgrade policy if relevant

## 10. Production checklist
Before mainnet deployment, confirm:
- owner or authority rules are correct
- all validation conditions are explicit
- no unchecked external interaction paths exist
- state layout is safe and well understood
- upgrade plan is documented
- testnet validation is complete

## 11. What not to focus on here
This checklist excludes:
- explorer website setup
- browser frontend software engineering
- Firebase hosting and functions setup
- AI tooling
- unrelated app infrastructure

These are not required for writing and validating Fluid smart contracts.

## 12. Recommended sequence
1. Learn language basics
2. Read example contracts
3. Write a small contract
4. Validate local logic and invariants
5. Connect to testnet
6. Deploy test contract
7. Validate behavior
8. Review upgrade and security model
9. Move to production only after testnet confirmation
