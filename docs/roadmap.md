# Fluid Developer Roadmap

## Phase 1: Learn the language
- Read the overview docs
- Understand the core syntax
- Learn state, transactions, requires, preflight, and atomic blocks
- Review the security and upgrade docs

## Phase 2: Learn by example
- Study the example contracts in `fluid/contracts/`
- Review XolixNativeCoin, GovernanceXolix, QusdStablecoin, XolixVaultManager, and XolixDaoTreasury
- Compare the patterns across each contract
- Write small variations of the same approach

## Phase 3: Practice contract design
- Build a simple counter contract
- Build a token-style contract
- Add owner-only logic
- Add preflight validation
- Add upgrade policy thinking

## Phase 4: Learn the ecosystem
- Connect to XOLIX RPC endpoints
- Understand EVM compatibility
- Review wallet integration examples
- Learn how provider hooks work
- Read the developer portal docs

## Phase 5: Deploy and validate
- Compile a contract
- Deploy to a testnet or sandbox network
- Validate state behavior
- Verify wallet and RPC interaction
- Review logs and transaction output

## Phase 6: Production readiness
- Add governance and timelock rules
- Preserve state compatibility during upgrades
- Add invariants
- Run security reviews
- Prepare for mainnet deployment

## Phase 7: Advanced work
- Build multi-contract interactions
- Explore governance patterns
- Review upgrade safety workflows
- Study gas and resource constraints
- Integrate with broader XOLIX ecosystem tooling

## Recommended sequence
1. Read `docs/getting-started/README.md`
2. Read `docs/learn-fluid-in-30-minutes.md`
3. Read `docs/fluidscript/index.md`
4. Read `fluid/specification/language.md`
5. Read `fluid/specification/security.md`
6. Read `fluid/specification/upgrades.md`
7. Study `fluid/contracts/`
8. Write your own small contract

## Important note
The repo has strong conceptual and architectural guidance, but the actual compiler and deployment toolchain still needs full documentation before it is truly end-to-end developer-ready.
