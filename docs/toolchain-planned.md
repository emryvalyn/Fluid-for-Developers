# Planned Toolchain and Deployment Documentation

This page documents the main gaps that still exist in the developer learning path.

## What is still missing from the repo
The repository contains architecture and conceptual guidance, but not yet a complete end-to-end developer toolchain.

The missing items are:
- actual Fluid compiler command syntax
- build workflow for `.fls` files
- deployment workflow for contracts
- JSON-RPC usage examples for native Fluid tools
- testing framework and debugging docs
- compiler error reference
- upgrade simulation examples
- environment setup for local development
- end-to-end “hello world to deployed contract” tutorial

## Why this matters
Without the real compiler and deployment workflow, developers cannot fully build and deploy native Fluid contracts end-to-end.

## What the repo does contain
The repo does already include:
- developer architecture docs
- network configuration
- wallet integration guidance
- example native contract patterns
- security and upgrade concept docs
- FluidScript language overview

## Recommended next additions
The next major additions should include:
1. `fluid build` guide
2. `fluid test` guide
3. `fluid deploy` guide
4. local sandbox setup
5. hello-world deployment tutorial
6. common compiler error reference
7. debugging guide
8. upgrade simulation tutorial

## Honest status
This is a conceptual and architectural developer foundation, but not yet a complete runtime/tooling developer kit.

The missing pieces should be treated as planned work until the actual implementation is added to the repo.
