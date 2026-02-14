---
title: "Authorization Model"
---

# Authorization Model

(BELOW IS DRAFT - FINISH IT BEFORE PUBLISHING!)

## Overview

- Motivation: Authorization should be easy to reason about
- Motivation: Low-trust - One-hop rule and why

## Defining Auth

### Access rules

### Roles

## Resolving Access Rules

### Assertions

Method authorization and inline assertions An access rule can be thought of as an immediate inline assertion before the method begins.

### Global and Local Frames

Include: \* When a new global frame starts (Module calls) \* When a new local frame starts (including to Vaults)

### Implicit Proofs

https://docs.radixdlt.com/docs/advanced-accessrules

## Future Additions

- Allowances - as a way to avoid one-hop rule
- Delegated Authorization - as a way to avoid one-hop rule

\## Further Information

The implementation of is discussed in the [developer-focused documentation here](https://radix-engine-docs.radixdlt.com//native/auth/system_module.html).
