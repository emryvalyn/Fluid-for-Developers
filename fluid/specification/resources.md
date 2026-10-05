# FluidScript Resources and State Safety

FluidScript also includes resource-oriented and state-safety semantics that help define the execution profile of a contract.

## Resource examples
- execution budget
- gas/resource limits
- capability ownership
- state access limits

## Why resources matter
Resource rules protect the network from:
- runaway execution patterns
- governance misuse
- unbounded state growth
- unsafe contract behavior

## Best practice
Treat resource and state constraints as part of the contract interface rather than layer-specific implementation details.
