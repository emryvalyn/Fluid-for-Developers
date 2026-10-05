# Learn Fluid in 30 Minutes

This is the fastest path to understanding XOLIX FLUID and how to think about FluidScript.

## 0–5 minutes: What problem Fluid solves
XOLIX FLUID is built as a blockchain environment that can support both:
- Ethereum-compatible smart contracts through Solidity/EVM tooling
- native blockchain contracts written in FluidScript (`.fls`)

The big idea is that FluidScript is designed to be clearer and safer than writing directly against low-level execution. It introduces concepts like:
- persistent state
- transactions
- preflight safety checks
- atomic state changes
- upgrade-safe contract design

## 5–12 minutes: Core syntax
The basic FluidScript shape looks like this:

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

### What this means
- `pragma fluid ^1.0;` declares the language version
- `contract` starts a contract definition
- `state persistent` declares on-chain state that persists between calls
- `transaction` declares executable logic
- `requires` declares conditions for execution
- `preflight` runs validation before state mutation
- `atomic` defines the state update block

## 12–18 minutes: State and transactions
Think of a contract as a combination of:
- state: the data it stores
- transactions: the functions that mutate or read it

For example:

```fluid
state persistent {
    owner: address;
    total_supply: uint256;
    map<address, uint256> balances;
}
```

This is the contract memory of the blockchain application. It persists and is part of the chain state.

## 18–24 minutes: Security and capabilities
A major part of the XOLIX FLUID design is safety.

FluidScript encourages:
- guarding critical logic with `preflight`
- checking conditions before mutating state
- using capability-based restrictions
- preventing reentrancy and unsafe execution patterns

Example:

```fluid
preflight {
    Security.require_no_reentrancy();
    Risk.require_below_threshold(caller, 0.75);
}
```

This is how the language tries to make execution safer.

## 24–30 minutes: Upgrades and deployment mindset
Fluid contracts are designed to support upgrade-safe patterns.

The repo describes a model where:
- contract identity stays stable
- logic can change over time
- state compatibility must be checked
- governance and timelocks may enforce upgrade rules

Example:

```fluid
upgrade_policy {
    authority: governance;
    timelock: 72h;
    require_schema_compatibility: true;
    require_simulation: true;
}
```

That means developers do not think only in terms of one-off deployment. They think in terms of:
- persistent identity
- state safety
- upgrade planning
- compatibility checks

## The important mental model
A FluidScript contract is not just code. It is:
- state
- logic
- permissions
- security constraints
- upgrade policy

## What to do next
1. Read `docs/getting-started/README.md`
2. Open `fluid/specification/language.md`
3. Read one example contract in `fluid/contracts/`
4. Write your own small contract in `examples/`

## Your first mini challenge
Write a contract that:
- stores a `message`
- allows only the owner to change it
- checks that the message is not empty
- uses `preflight` and `atomic` blocks

That is the fastest way to learn the language.
