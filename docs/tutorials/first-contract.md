# FluidScript First Contract Tutorial

This tutorial walks you through writing a simple contract that demonstrates the core FluidScript concepts.

## Goal
Build a contract that:
- stores a message
- allows an owner to update it
- requires a non-empty message
- validates before mutation

## Step 1: start with a basic contract
```fluid
pragma fluid ^1.0;

contract HelloWorld fluid {
    state persistent {
        owner: address;
        message: string;
    }

    transaction setMessage(string newMessage)
    requires caller == owner && newMessage != ""
    {
        preflight {
            Security.require_no_reentrancy();
        }

        atomic {
            message = newMessage;
        }
    }
}
```

## Step 2: understand what each part does
- `state persistent` stores the owner and message
- `requires` ensures the caller is the owner and the message is not empty
- `preflight` checks execution safety before mutation
- `atomic` contains the actual state write

## Step 3: try a variation
Add a counter:

```fluid
pragma fluid ^1.0;

contract Counter fluid {
    state persistent {
        owner: address;
        uint256 count;
    }

    transaction increment()
    requires caller == owner
    {
        preflight {
            Security.require_no_reentrancy();
        }

        atomic {
            count += 1;
        }
    }
}
```

## Step 4: compare with Solidity
The same idea in Solidity would be a contract with a state variable and a function. FluidScript emphasizes:
- explicit state blocks
- preflight safety checks
- atomic mutation logic
- built-in protocol awareness

## Next tutorial
See `docs/tutorials/upgrade-safe-contract.md`.
