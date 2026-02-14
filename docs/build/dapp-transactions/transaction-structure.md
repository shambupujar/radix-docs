---
title: "Transaction Structure"
---

# Transaction Structure

This article covers the flattened structure of the transaction model and serialized transactions.

When building or executing a transaction, it is better to think in terms of its tree-based Intent Structure. We advise you to read about the [intent structure](intent-structure.md) first before reading this article.

## V1 User Transaction Structure

It is much the same as the V2 structure, except has no support for subintents, in particular: \* V1 transactions have a single intent. This was split into the transaction intent and intent core concepts in V2. \* V1 transactions have a single header. This was split into the single Transaction Header and per-intent Intent Header in V2.

## V2 User Transaction Structure

In the persisted structure, the subintents are flattened into an array. During validation, they are converted into a tree structure. When building transactions, you will build them up in this tree-based [intent structure](intent-structure.md).

Transaction hashes discussed below are built up in merklized layers, such that a transaction hash can be used to prove details about the content of a transaction without providing the full transaction.

<!-- https://whimsical.com/transaction-v2-diagrams-EcZ7sK8SoUDyVFEibhAUfe -->



### Notarized Transaction

The notarized transaction is the fully signed transaction, and is represented by its `NotarizedTransactionHash` (`notarizedtransaction_...`).

It contains: \* The signed transaction intent \* The notary’s signature of the signed intent hash. Note that the notary may or may not count as a signatory of the transaction, depending on the `notary_is_signatory` flag in the transaction header.

### Signed Transaction Intent

The signed transaction intent is represented by its `SignedTransactionIntentHash` (`signedintent_...`).

It contains: \* The transaction intent \* The signatures of the root transaction intent (of its transaction intent hash) \* A flattened array of signatures for each included subintent (of its subintent hash)

### Transaction Intent

The transaction intent is represented by its `TransactionIntentHash`, shown to users as the **transaction id** (`txid_...`). The Radix Engine guarantees each transaction intent can be committed at most once (as either a success or failure).

It contains: \* The transaction header, capturing: \* The `notary_public_key` which must notarize the transaction \* A flag `notary_is_signatory` which determines if the notary counts as a signatory of the root transaction intent core \* The `tip_basis_points` \* The root transaction intent core \* A flattened array of subintents, each containing just their intent core.

### Subintent

Each subintent is encapsulated by its `SubintentHash` (`subtxid_...`), sometimes shown to users as its **preauthorization id**.

The Radix Engine guarantees each subintent can be successfully committed at most once. It can be committed in a failing transaction zero or more times before that, but is unable to pay fees.

Each subintent only contains its intent core.

### Intent Core

An intent core is common to both the transaction intent and each subintent. A transaction can therefore contain one or more intent cores.

Each intent core contains: \* An intent header, capturing: \* The `network_id` which must match the network \* The `min_epoch_inclusive` and `max_epoch_exclusive` in which the intent can be committed \* An optional `min_proposer_timestamp_inclusive` and optional `max_proposer_timestamp_exclusive` between which the intent can be committed \* An `intent_discriminator`, typically set to a random number - which allows generating a new transaction id for what could otherwise be the same intent. \* An optional [message](../../essentials/concepts/transactions.md) \* The intent’s [manifest](/docs/transaction-manifest) \* One or more blobs (uninterpreted byte payloads which can be passed to smart contracts in the manifest) \* An array of the subintent hashes of each child \* A list of [instructions](../transactions-manifests/manifest-instructions.md), which can be represented in a human readable form

## V2 Partial Transaction Structure

When constructing transactions containing more than one intent, it’s typical to build them up in subtrees, according to their [intent structure](intent-structure.md).

In particular, there are two additional useful models:

### Signed Partial Transaction

A signed partial transaction is an equivalent of a signed transaction intent, but with a subintent root.

It contains: \* The root partial transaction \* The signatures of the root subintent (of its subintent hash) \* A flattened array of signatures for each included non-root subintent (of its subintent hash)

### Partial Transaction

A partial transaction is an equivalent of a transaction intent, but with a subintent root.

It contains: \* The root subintent \* A flattened array of non-root subintents
