# FluidScript Type System

FluidScript is designed with a native, explicit type system that supports stable state and upgrade-safe contract logic.

## Core native types
- `address`
- `uint256`
- `bool`
- `string`
- `bytes`
- `capability`
- `resource`
- `event`

## Composite types
```fluid
map<address, uint256>
list<uint256>
struct Account {
    address owner;
    uint256 balance;
}
```

## State declarations
```fluid
state persistent {
    owner: address;
    map<address, uint256> balances;
    total_supply: uint256;
}
```

## Type rules
- state types must be deterministic
- storage layout impacts upgrade safety
- incompatible type changes should be rejected by the compiler or validation layer
- type compatibility is part of upgrade validation

## Why it matters
A strong type system helps avoid storage compatibility bugs and makes contract evolution safer.
