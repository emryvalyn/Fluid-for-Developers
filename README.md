# Fluid for Developers

Fluid for Developers is a curated learning repository for the XOLIX FLUID ecosystem and the native FluidScript language (`.fls`). It brings together the architecture, developer docs, language specs, examples, and contract patterns used across the XOLIX FLUID platform.

This repository is meant to help developers understand:
- the XOLIX FLUID architecture
- the native FluidScript language model
- security and capability rules
- upgrade-safe smart contract design
- how to build with EVM-compatible tooling and native Fluid contracts

## What is XOLIX FLUID?
XOLIX FLUID is a blockchain infrastructure and execution environment that combines:
- a native FluidScript execution model
- EVM compatibility for Solidity contracts
- upgrade-aware smart contract patterns
- security capabilities, state isolation, and protocol tooling

## Key developer entry points
- `docs/getting-started/README.md` — start here
- `docs/fluidscript/index.md` — language overview
- `fluid/README.md` — compiler and language toolchain
- `fluid/specification/` — language reference specs
- `fluid/contracts/` — example native contracts
- `examples/` — small learning examples

## Repository structure
```text
Fluid-for-Developers/
├── README.md
├── docs/
│   ├── getting-started/
│   ├── fluidscript/
│   └── developer-guide/
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

## Getting started
1. Read the developer onboarding guide.
2. Review the FluidScript overview.
3. Read the language specification files.
4. Open the example `.fls` contracts.
5. Start building a small contract in the examples folder.

## Example syntax
```fluid
pragma fluid ^1.0;

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
        }

        atomic {
            balances[caller] -= amount;
            balances[to] += amount;
        }
    }
}
```

## Developer learning path
### Beginner
- read `docs/getting-started/README.md`
- read `docs/fluidscript/index.md`
- read `fluid/specification/language.md`

### Intermediate
- read `type-system.md`
- read `security.md`
- read `capabilities.md`
- read `upgrades.md`

### Advanced
- review `fluid/contracts/*.fls`
- inspect the compiler and execution model documents
- build sample contracts in `examples/`
- test upgrade safety and capability rules

## Notes
This repository is an educational and developer-focused extraction of the XOLIX FLUID ecosystem. It is meant to provide a practical path for developers who want to understand and write FluidScript in a real blockchain environment.

## License
This repository is a developer learning fork assembled from XOLIX FLUID project materials and examples.
