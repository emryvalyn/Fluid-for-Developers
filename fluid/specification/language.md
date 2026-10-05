# FluidScript Specification: language.md

This file is the core language reference for FluidScript.

## 1. Language structure
A typical FluidScript contract includes:
- metadata
- state
- capability definitions
- invariants
- transactions
- upgrade policy

## 2. Data model
FluidScript supports explicit native types such as:
- `address`
- `uint256`
- `string`
- `bool`
- `bytes`
- `map<K,V>`
- `capability`
- `resource`

## 3. Contract execution model
The execution model is based on:
- validation before mutation
- atomic state application
- security-aware transaction guards
- deterministic behavior across execution contexts

## 4. Design goals
The language is intended to be:
- readable
- explicit
- upgrade-aware
- deterministic
- safe by design

## 5. Practical example
```fluid
pragma fluid ^1.0;

contract XolixToken fluid upgradeable {
    state persistent {
        owner: address;
        total_supply: uint256;
        map<address, uint256> balances;
    }

    transaction mint(address to, uint256 amount)
    requires caller == owner && amount > 0
    {
        preflight {
            Security.require_no_reentrancy();
        }

        atomic {
            balances[to] += amount;
            total_supply += amount;
        }
    }
}
```

This is the kind of pattern developers should study when learning the language.
