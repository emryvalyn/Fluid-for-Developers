# Getting Started with FLUID and FluidScript

This guide is the recommended onboarding path for developers who want to understand XOLIX FLUID and the native FluidScript language.

## 1. Understand the system
XOLIX FLUID blends several ideas:
- a native smart contract language: FluidScript (`.fls`)
- EVM compatibility for Solidity deployment and Web3 tooling
- capability-based security and native upgrade patterns
- protocol-level state and contract safety rules

## 2. Learn the language model
FluidScript is designed as a native capability-aware language for blockchain execution. It introduces concepts such as:
- `state persistent` for persistent state
- `transaction` for executable logic
- `requires` for guard conditions
- `preflight` checks for security validation
- `atomic` execution blocks for deterministic state transitions
- `upgradeable` contract design patterns

## 3. Learn from examples
The repository includes example implementations in `fluid/contracts/`.
Try to study these in order:
1. `XolixNativeCoin.fls`
2. `GovernanceXolix.fls`
3. `QusdStablecoin.fls`
4. `XolixVaultManager.fls`
5. `XolixDaoTreasury.fls`

## 4. Read the specification files
The `fluid/specification` directory is the primary reference for the language. Start with:
- `language.md`
- `grammar.md`
- `type-system.md`
- `security.md`
- `capabilities.md`
- `upgrades.md`

## 5. Build a minimal example
Create a simple contract in `examples/`.
A minimal pattern looks like this:

```fluid
pragma fluid ^1.0;

contract SimpleVault fluid {
    state persistent {
        owner: address;
        map<address, uint256> balances;
    }

    transaction deposit(uint256 amount)
    requires amount > 0
    {
        preflight {
            Security.require_no_reentrancy();
        }

        atomic {
            balances[caller] += amount;
        }
    }
}
```

## 6. Understand the execution model
The repository describes a compiler pipeline:
- Source (`.fls`)
- Lexer and parser
- AST generation
- Type and capability checking
- Code generation for XLS bytecode

This makes FluidScript a deterministic, security-aware language for blockchain execution.

## 7. Learn the EVM ecosystem too
XOLIX FLUID is deliberately compatible with standard EVM workflows. Developers can continue using:
- Solidity
- MetaMask
- Hardhat
- Foundry
- Ethers.js
- Viem

This is important because XOLIX FLUID doesn't require abandoning the broader Ethereum ecosystem.

## 8. Beginner roadmap
- Week 1: Learn types, state, transactions, and contract shapes
- Week 2: Learn security, capabilities, and resource constraints
- Week 3: Understand upgrade safety and state compatibility
- Week 4: Build and test native .fls contracts

## 9. Key files in this repo
- `README.md`
- `docs/fluidscript/index.md`
- `fluid/README.md`
- `fluid/specification/language.md`
- `fluid/contracts/`

## 10. Recommended next step
Start by reading the FluidScript overview and then open one of the native example contracts.
