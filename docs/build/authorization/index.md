---
title: "Authorization"
---

# Authorization

Authorization is the process of giving a caller the ability to call a method or function. Traditional blockchains often use the caller's address for this purpose (like `msg.sender` in Solidity) and require the smart contract to implement custom authorization logic. Scrypto, on the other hand, provides a built-in system based on Badges, AccessRules, and Roles.

## Authorized Call Pattern

The basic pattern for calling a protected method or function consists of 3 steps:

1.  **Generate a Proof.** Proofs are created from buckets or vaults and act as “proof” that you have access to some amount of resources.

2.  **Push Proof onto the AuthZone.** Every caller has an AuthZone which is used to store proofs for the purpose of Authorization.

3.  **Call the Protected Method or Function.** Once a call is made a check is made against the method/function’s AccessRule(s) and what is in the caller’s AuthZone. If the two match, the caller will be able to continue with the call. Otherwise, the transaction will fail.

Here is an example flow of how this process may look:







![auth-flow.drawio (1).png](/img/auth-flow.drawio-1-.png)

In this example, the **Badge Holding Component** holds a resource used for auth (called a “badge”) and produces proofs of the held resource. The caller calls a method on this component to retrieve a proof of this resource. They can then push it onto their AuthZone, after which they may call a protected method.

## Manage Access to Functions and Methods with AccessRules

Managing who can access a function or method is done by assigning an **AccessRule** to that function or method in Scrypto. An `AccessRule` is a rule which defines whether or not the proofs contained in an AuthZone are sufficient to pass. A simple example of an AccessRule looks like:

``` rust
let some_resource_address: ResourceAddress = { .. };
let access_rule: AccessRule = rule!(require(some_resource_address));
```

`access_rule` in this case is a rule which only passes if the AuthZone contains a proof of `some_resource_address`.

The assignment of AccessRules to functions and methods is slightly different between the two. For functions, an AccessRule [is assigned directly to a given function](assign-function-accessrules.md). For methods, a role based access control system is used which [statically maps a set of roles to each method](../../reference/core-system-features/structure-roles-methods.md) and an [AccessRule is assigned to each role](assign-component-roles.md).

## Useful Auth Design Patterns

- [User Badge Pattern](user-badge-pattern.md)

- [Actor Virtual Badge Pattern](actor-virtual-badge-pattern.md)

- [The Withdraw Pattern](the-withdraw-pattern.md)

- [Transient Badge Pattern](transient-badge-pattern.md)
