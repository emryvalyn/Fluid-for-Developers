<!-- Copyright (c) 2026 Questdrium Next-Gen Technologies R&D. Inc., All rights reserved. -->
# FluidScript (`.fls`) Language Compiler & Tooling Suite

## Overview
The `fluid/` module contains the compiler pipeline, standard library, lexer, parser, AST generator, type checker, and language tools for FluidScript (`.fls`), XOLIX FLUID's native capability-sensitive smart contract language.

## Compiler pipeline architecture
```text
    ┌────────────────┐
    │ Source (.fls)  │
    └───────┬────────┘
            │
            ▼
    ┌────────────────┐
    │ Lexer & Parser │  ──> Generates Tokens & AST
    └───────┬────────┘
            │
            ▼
    ┌────────────────┐
    │ Type & Capability│ ──> Validates capabilities & reentrancy guards
    │    Checker     │
    └───────┬────────┘
            │
            ▼
    ┌────────────────┐
    │ CodeGen Engine │  ──> Emits XLS Binary Bytecode (.xls)
    └────────────────┘
```

## Language specification folders
- `fluid/specification/grammar.md`
- `fluid/specification/type-system.md`
- `fluid/specification/security.md`
- `fluid/specification/capabilities.md`
- `fluid/specification/contracts.md`
- `fluid/specification/upgrades.md`

## Native smart contracts
The repo includes sample native FluidScript implementations:
- `XolixNativeCoin.fls`
- `GovernanceXolix.fls`
- `QusdStablecoin.fls`
- `XolixVaultManager.fls`
- `XolixDaoTreasury.fls`

## Tooling components
- `fluid/compiler/` — compiler pipeline
- `fluid/standard-library/` — reusable library support
- `fluid/stdlib/` — standard library modules
- `fluid/test-framework/` — testing support
- `fluid/language-server/` — IDE tooling support
- `fluid/linter/` — linting and validation
- `fluid/formatter/` — formatting tools
- `fluid/debugger/` — debugging tools
- `fluid/simulator/` — simulation environment
