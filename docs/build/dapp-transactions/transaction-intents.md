---
title: "Transaction Intents"
---

# Transaction Intents

Each transaction has a single transaction intent. Its **transaction id** is the hash of the transaction intent, and is typically encountered bech32-encoded starting with `txid_...`.

## Structure

For full details, see the [transaction structure](transaction-structure.md) article, but to summarize, a transaction intent contains: \* A transaction header, defining the notary and tip. \* Its intent core, including its: \* An intent header, capturing when it’s valid for \* An optional message \* Its [transaction manifest](/docs/transaction-manifest) \* Zero or more [subintents](subintents.md)

## Behaviour

Compared with subintents, the transaction intent is special: \* Only the transaction intent is allowed to lock a non-contingent fee, and only the transaction intent defines the tip. \* If a transaction execution fails after a fee is locked, then the transaction intent is recorded as a committed failure, and can never be committed again. Subintents by contrast can be committed zero or more times and still be committed successfully. \* If a notary is marked as a signatory, the notary only counts as a signatory of the transaction intent.
