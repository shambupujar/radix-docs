---
title: "Transaction Overview"
---

# Transaction Overview

This section gives an overview of the structure, design and motivation of the Radix transaction model. If you are an integrator looking to build and submit transactions, we encourage you to read the [Transactions for Integrators](../../essentials/concepts/transactions.md).

## User Transactions

User Transactions are also known as “[Notarized](/docs/notary) Transactions”. At a high level, a user transaction contains: \* A [transaction intent](transaction-intents.md), and related signatures, including the signature of a notary. \* Zero or more [subintents](subintents.md), each with their related signatures.

Together, the transaction intents and subintents are known as the **intents** of a transaction. Each intent contains an intent header, a message, and a [manifest](/docs/transaction-manifest) which details a human-readable set of commands that will be executed.

## Structure

There are two structures to a transaction, discussed in separate articles: \* The tree-based [intent structure](intent-structure.md), with the transaction intent at the root, with sub-trees of subintents below. This structure is useful when thinking about how transactions execute, and when building transactions. \* The serialized [transaction structure](transaction-structure.md) where the subintents are flattened for easy serialization and for referencing by subintent index. This structure is useful for those debugging, or working on transaction parsers.

## Ledger Transactions

Transactions are committed by a node as a Ledger Transaction ([definition in code](https://github.com/radixdlt/radixdlt-scrypto/blob/main/radix-transactions/src/model/ledger_transaction.rs)). They capture three classes of transaction:

- User Transactions ([definition in code](https://github.com/radixdlt/radixdlt-scrypto/blob/main/radix-transactions/src/model/user_transaction.rs))
  - `NotarizedTransactionV1` was released at [Babylon](../../updates/protocol-updates/babylon-genesis.md), and only has support for a single transaction intent.
  - `NotarizedTransactionV2` was released at [Cuttlefish](../../updates/protocol-updates/cuttlefish.md) and added support for subintents, timestamp-based validity and tip specification in basis points.
- Protocol Update Transactions
  - “Flash” state updates
  - Executable transactions
- Validator Transactions
  - Round update transactions, which are typically short/simple transactions, but occasionally trigger epoch updates about every 5 minutes

Each ledger transaction has an associated `LedgerTransactionHash`, built as a hash on top of the hash of the transaction itself.

## Serialization and Preparation

Transactions have a canonical serialization in bytes, using [ManifestSbor](/docs/manifest-sbor), according to the [AnyTransaction](https://github.com/radixdlt/radixdlt-scrypto/blob/main/radix-transactions/src/model/any_transaction.rs) serialization.

In the Rust library, you can encounter a transaction in a few forms: \* Under creation, in a transaction builder, e.g. `TransactionBuilder::new_v2()` \* Its detailed model, e.g. `DetailedNotarizedTransactionV2` created from the builder \* Its normal model, e.g. `NotarizedTransactionV2` \* Its raw bytes, e.g. `RawUserTransaction` - a wrapper around the canonical serialization of the transaction \* Its prepared form, e.g. `PreparedUserTransaction` or `PreparedNotarizedTransactionV2` \* Its validated form, e.g. `ValidatedUserTransaction` or `ValidatedNotarizedTransactionV2` \* Its executable form, e.g. `ExecutableTransaction`

In order to get the hashes of a transaction, it must be prepared.

## Executable Transactions

When converted into an Executable, it includes:

- Configuration details, such as tip and costing details.
- Details for Transaction Validation:
  - The transaction and subintent hashes, for replay prevention
  - The combined min/max epoch and min/max timestamp across all intents in the transaction
- Execution details for the transaction intent and each subintent:
  - [Implicit Proofs](../authorization/advanced-accessrules.md) to add to the intent processor’s authorization zone when it’s created, e.g. from Signatures.
  - The intent’s manifest (blobs, instructions e.t.c) which are sent to the Intent Processor.
