# FluidScript Capability Model

Capability-based security is one of the core concepts behind the FluidScript model.

## Purpose
Capabilities define what a caller or contract is allowed to do.

## Example
```fluid
capabilities {
    transfer;
    upgrade {
        authority: governance;
    }
}
```

## Why capabilities matter
Capabilities help enforce:
- least-privilege design
- protocol-level restrictions
- safe upgrade authorization
- clear contract boundaries

## Model
A capability belongs to a contract or execution path and restricts behavior based on:
- caller identity
- authorization level
- governance or policy check
- resource constraint

## Best practices
- keep permissions explicit
- avoid unconstrained admin functions
- combine capabilities with governance and timelocks
