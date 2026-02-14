---
title: "Authorization Approach"
---

# Authorization Approach

The traditional blockchain security pattern of deciding access control based on who or what called you has lead to enormous sums of money lost to clever privilege escalation attacks on other crypto networks, so Radix was designed with a different model in mind.

Radix adopts a role-based access control pattern in which developers set the rules about which roles are able to perform certain actions (e.g., accessing an administrator-only method on a component, or minting more supply of a resource), and the system enforces that the proper role was met before permitting the action to occur.

**Badges **are the mechanism by which actors demonstrate that they are able to meet a role. Badges can be proofs of resources (like showing that you have access to a membership token), or they can be virtual things created automatically by the system (like a proof that a certain signature was present in the transaction).

Developers have fine-grained control over the roles they create, allowing them to choose whether they are updatable or immutable on an individual basis, and these settings are all visible to on- and off-ledger tools. This means consumers can understand the security pattern of an unfamiliar component or resource *without *having to delve into reading any code.

Unique in the crypto space, Radix's authorization model finally allows for a proper separation of concerns between your business logic and your access rules, giving your applications the flexibility to start with a simple control scheme and grow into something more complex later on—without having to hand-roll a bespoke solution, and without having to rely on the demonstrably dangerous "what's the source of this request" pattern which plagues the industry.
