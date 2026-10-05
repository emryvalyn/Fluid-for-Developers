# Fluid for Developers

Welcome to Fluid for Developers — a beginner-friendly learning repo for the XOLIX FLUID blockchain and its native FluidScript language.

This repository was created to help developers learn:
- what XOLIX FLUID is
- how the FluidScript language works
- how to write native `.fls` contracts
- how to think in terms of state, transactions, security, and upgrades
- how to build on a blockchain that supports both EVM and native Fluid execution

## What is XOLIX FLUID?
XOLIX FLUID combines:
- a native FluidScript smart contract language
- EVM compatibility for Solidity and standard Web3 tooling
- capability-aware execution rules
- upgrade-safe contract design
- security-focused transaction patterns

It is designed for teams who want to build on a blockchain that supports both:
- standard Ethereum-style development
- native protocol-aware language features

## Why this repo exists
The original XOLIX FLUID infrastructure repo contains a lot of architecture, docs, and examples, but it is not yet a full beginner onboarding experience. This repo turns that into a learnable, structured path.

## Learning path
Start here:
1. `docs/getting-started/README.md`
2. `docs/learn-fluid-in-30-minutes.md`
3. `docs/fluidscript/index.md`
4. `fluid/specification/language.md`
5. `fluid/specification/security.md`
6. `examples/hello-world.fls`
7. `examples/upgradeable-token.fls`

## Repository structure
```text
Fluid-for-Developers/
├── README.md
├── docs/
│   ├── getting-started/
│   ├── learn-fluid-in-30-minutes.md
│   ├── fluidscript/
│   └── tutorials/
├── fluid/
│   ├── README.md
│   ├── specification/
│   ├── contracts/
│   └── standard-library/
├── examples/
├── glossary.md
├── roadmap.md
└── LICENSE
```

## The main idea behind Fluid
FluidScript is designed around a few principles:
- explicit persistent state
- transaction-based execution
- preflight safety checks
- atomic mutation logic
- upgrade-aware contract development
- capability and security enforcement

It is a language for writing blockchain logic that is meant to be deterministic, readable, and easier to reason about than low-level bytecode.

## First example
```fluid
pragma fluid ^1.0;

contract HelloWorld fluid {
    state persistent {
        string message;
    }

    transaction setMessage(string newMessage)
    requires newMessage != ""
    {
        preflight {
            Security.require_no_reentrancy();
        }

        atomic {
            message = newMessage;
        }
    }
}
```

## Developer roadmap
### Beginner
- Learn the syntax
- Understand state and transactions
- Write a minimal contract

### Intermediate
- Add security checks and capabilities
- Understand upgrade safety
- Work with native contract patterns

### Advanced
- Build production-grade contracts
- Add governance and upgrade policies
- Connect with EVM tooling and network infrastructure

## Next step
Open `docs/learn-fluid-in-30-minutes.md` and follow the guided path.
