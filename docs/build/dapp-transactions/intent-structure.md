---
title: "Intent Structure"
---

# Intent Structure

This article explains the tree-based structure of intents in a transaction. If you want to learn about the persisted structure of a transaction, read about the [Transaction Structure](transaction-structure.md) after reading this article.

## Intent Tree

In any transaction, there is a single [transaction intent](/docs/transaction-intent) and zero or more [subintents](subintents.md).

Together, these are called the intents of a transaction. In a valid transaction, these intents form a tree, with the transaction intent at the root, and subintents below, in layers.

Each intent has zero or more child subintents, and each subintent has a single unique parent.

<!-- https://whimsical.com/transaction-v2-diagrams-EcZ7sK8SoUDyVFEibhAUfe -->



## Interaction between intents

Each intent declares its children as pseudo-instructions as the start of its manifest:

``` bash
USE_CHILD
    NamedIntent("my_child")
    Intent("subtxid_sim1lh5la66jj3dwl69z2cjjf0hphaj90yl5l5xnd7s8mxx273tkhw2qer299e")
;
```

There are currently two ways intents can interact:

### Yielding

Intents can yield control to their direct child or parent. This passes control to that intent, and can also be used to pass buckets. These buckets end on the worktop of the other intent, before their execution is resumed.

The specific [manifest instructions](../transactions-manifests/manifest-instructions.md) are: \* Intents can use `YIELD_TO_CHILD NamedIntent("xxx") <zero or more args>;` to yield to their direct child. \* Subintents can use `YIELD_TO_PARENT <zero or more args>;` to yield to their direct parent.

For a transaction to be valid: \* Every `YIELD_TO_PARENT` instruction in a subintent must match with a corresponding `YIELD_TO_CHILD` in its parent (and vice versa). \* Every subintent must end with a `YIELD_TO_PARENT`.

This ensures that a successful transaction must have executed the content of every subintent in its entirety.

### Verifying the direct parent intent

Sometimes, when constructing a subintent, you only want it to be used by a particular counterparty. For example, it could be used by dApps to give users or regulated integrators guarantees who will consume the subintent.

This is where the “verify parent” check comes in. Subintents can use the `VERIFY_PARENT <access_rule>;` [manifest instruction](../transactions-manifests/manifest-instructions.md) to assert against the [auth zone](/docs/authzone) of the parent intent’s processor, which can see: \* Signatures of the parent intent (using a [signature requirement](../authorization/advanced-accessrules.md#signature-requirements)) \* Proofs (e.g. of badges) created during execution which are currently on the parent’s auth zone

## Limits

As of Cuttlefish, the following limits apply: \* A transaction can only have an intent depth of 4 (a transaction intent root, and three additional levels of subintents) \* A transaction can have a maximum of 32 total subintents, and 64 signatures across these subintents \* Each manifest can have a maximum of 1000 instructions

## Constructing transactions with multiple intents

To be able to construct transactions with multiple intents, it’s easiest to build up subtrees of the transaction.

These are represented by the following models (see also [Transaction Structure](transaction-structure.md)): \* A `PartialTransaction` as a subtree of a transaction, with a subintent root. It is a subintent-analogue of a `TransactionIntent` \* A `SignedPartialTransaction` as a `PartialTransaction`, with signatures for each subintent in the transaction. It is a subintent-analogue of a `SignedTransactionIntent`.

These can be constructed with a **Partial Transaction Builder**, available in the Rust code as `PartialTransactionV2Builder` or in the UniFFI toolkits.
