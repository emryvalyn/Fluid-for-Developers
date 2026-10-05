# Fluid Developer FAQ

## What is XOLIX FLUID?
XOLIX FLUID is a blockchain platform designed to support both native FluidScript contracts and EVM-compatible Solidity contracts.

## What is FluidScript?
FluidScript is the native smart contract language used in the XOLIX FLUID ecosystem.

## Do I have to use FluidScript?
No. You can build with Solidity and standard EVM tooling if you prefer. FluidScript is the native option.

## What are the most important concepts?
- `state persistent`
- `transaction`
- `requires`
- `preflight`
- `atomic`
- `upgrade_policy`

## What is `state persistent`?
It declares persistent contract state stored on-chain.

## What is `requires`?
It is a precondition that blocks execution unless certain conditions are true.

## What is `preflight`?
It is a safety validation block run before mutation.

## What is `atomic`?
It is the state mutation block. The mutation is atomic and deterministic.

## What is an upgrade policy?
A policy that defines how a contract can be upgraded safely.

## Can I use EVM tooling?
Yes. XOLIX FLUID is designed to be compatible with Ethereum-standard tools.

## Is it realistic to learn this in 30 minutes?
You can learn the basics in 30 minutes. You can learn the production patterns over days or weeks.

## Where do I start?
Start with:
- `docs/learn-fluid-in-30-minutes.md`
- `docs/getting-started/README.md`
- `fluid/specification/language.md`
- `fluid/contracts/`

## What is still missing?
The real compiler/build/deploy toolchain is not fully documented in the repository yet. The conceptual language and architecture are present; the runtime tooling still needs additional implementation and documentation.
