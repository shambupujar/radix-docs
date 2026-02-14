---
title: "Subintents"
---

# Subintents

A subintent (also known as a **pre-authorization** in the dApp/wallet [pre-authorization flow](/docs/preauthorizations)) can be thought of as being its own independent mini transaction: \* It has its own manifest, its own messages and its own intent header describing when it can be valid \* It has its own id, the hash of the subintent, and is typically encountered bech32-encoded starting with `subtxid_...`.

Subintents can only be committed as part of a transaction.

Each subintent has a parent, and zero or more of its own subintent children, as part of a transaction’s [intent structure](intent-structure.md). The intent structure article also explains how subintents can interact with their parents and children, through yielding and passing buckets.

## Execution

A subintent starts execution by being yielded to from its parent for the first time.

At the start of execution, and every time it [YIELDS](intent-structure.md#yielding) to a parent or child, it may end up with buckets on its worktop from the other intent.

In a valid transaction: \* Every subintent must end with a `YIELD_TO_PARENT`. \* Every `YIELD_TO_PARENT` instruction in a subintent must match with a corresponding `YIELD_TO_CHILD` in its parent (and vice versa).

These guarantee that in a successful execution, every subintent will be executed in its entirety.

### Self-contained Subintents

Sometimes, subintents can be considered by a wallet to be equivalent to a transaction manifest, because it doesn’t receive anything from its parent. This is known as it being “self-contained”, and allows the wallet to offer a better user experience using [conforming manifest classification](/docs/conforming-transaction-manifest-types) and preview.

This comes up in the “delegated fee payment” use case, where a dApp might pay to submit a transaction containing the user’s subintent, without interacting with it.

To be specific, a subintent is “self-contained” if it: \* Starts with a `ASSERT_WORKTOP_IS_EMPTY` \* This ensures the subintent receives no resources from its parent at the start of its execution \* Contains a body with no additional `YIELD_TO_PARENT` or `YIELD_TO_CHILD` instructions \* These are technical limitations which make it possible to use preview on the contents \* Finishes with a `YIELD_TO_PARENT` instruction with no arguments \* This ensures the subintent gives nothing to its parent

## Structure

For full details, see the [transaction structure](transaction-structure.md) article, but to summarize, a subintent contains an intent core, which includes: \* An intent header, capturing its validity constraints (e.g. min/max epoch and optionally a min/max proposer timestamp). The subintent can only be included in a transaction (and so can only be committed) during its validity window. \* An optional message \* Its [transaction manifest](/docs/transaction-manifest), including its instructions; blobs; and zero or more child subintent hashes

## Construction and Serialization

A subintent can be constructed with a **Partial Transaction Builder**. This can construct a `PartialTransaction` - a sub-tree of the [intent structure](intent-structure.md), with a subintent at the root. Typically layers are signed before being passed on to other layers, so the partial transaction builder typically outputs a `SignedPartialTransaction`, for use in the `signed_child` step of a parent transaction builder or partial transaction builder.

When passing subintents to an aggregator, they are also typically passed around as a `SignedPartialTransaction`. Or more specifically the canonically encoded raw bytes of a `SignedPartialTransaction`. This is available with `to_raw()` in Rust, or `to_payload_bytes()` in the toolkit.

A partial transaction builder is provided: \* In the [radix-transactions](../../integrate/rust-libraries/index.md) crate, if building in Rust. \* In the [radix-engine-toolkit](../../integrate/radix-engine-toolkit/index.md), if building in other UniFFI-based stacks. As of December 2024, it isn’t possible exposed in the Typescript Builder.

## Behaviour

Compared with transaction intents, a subintent behaves a little differently: \* A subintent cannot lock uncontingent fees (only contingent fees). This is the responsibility of the transaction intent. \* A subintent can be included in a transaction intent which is committed as a failure, and still be committed as a success in some other transaction intent after. This can be summarized as: “subintents are finalized only on success”.

## Aggregation & Matching

The network only has mempools for valid complete transactions, and does not concern itself with how subintents are combined together or “aggregated” into sensible complete transactions.

Aggregation is out-of-band of the protocol, and instead handled by dApps. We expect the wider ecosystem to launch aggregators and matches might be created on top of the subintent primitive supported by the network.
