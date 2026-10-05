# Getting Started with Fluid

This section is your practical onboarding guide for the XOLIX FLUID ecosystem.

## 1. Learn the big picture
XOLIX FLUID is designed to support:
- a native FluidScript language
- EVM-compatible development
- security-aware contracts
- protocol-level upgrade safety

The repo is built around the idea that developers can write on the native side while still staying compatible with Ethereum tooling.

## 2. Read the overview docs
Start with:
- `README.md`
- `docs/fluidscript/index.md`
- `fluid/README.md`

## 3. Learn the core syntax
The main language concepts are:
- `pragma fluid`
- `contract`
- `state persistent`
- `transaction`
- `requires`
- `preflight`
- `atomic`
- `upgrade_policy`

## 4. Read the core specification files
Read these in order:
1. `fluid/specification/language.md`
2. `fluid/specification/type-system.md`
3. `fluid/specification/security.md`
4. `fluid/specification/capabilities.md`
5. `fluid/specification/contracts.md`
6. `fluid/specification/upgrades.md`

## 5. Study the examples
Example contracts are in `fluid/contracts/`.
Look at these one by one:
- `XolixNativeCoin.fls`
- `GovernanceXolix.fls`
- `QusdStablecoin.fls`
- `XolixVaultManager.fls`
- `XolixDaoTreasury.fls`

## 6. Write your own tiny contract
Use the example in `examples/hello-world.fls`.
From there, try:
- storing a counter
- adding deposit logic
- adding transfer logic
- adding owner-only functions

## 7. Learn how devs use the blockchain
The XOLIX FLUID docs also explain:
- provider hooks
- wallet setup
- JSON-RPC access
- EVM-compatible network configuration
- contract deployment patterns

This is important because developers may build with either:
- Solidity + EVM tooling
- native FluidScript + protocol APIs

## 8. Build a simple learning workflow
A good 4-step cycle is:
1. read the spec
2. inspect an example contract
3. write a small contract
4. test it conceptually against the security and upgrade rules

## 9. Best advice for new developers
Treat Fluid as a contract language with these traits:
- explicit state
- explicit transaction guards
- security-first design
- upgrade-aware development

Do not try to memorize everything at once. Learn the patterns first.
