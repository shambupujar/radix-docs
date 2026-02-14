---
title: "Transaction Notary"
---

# Transaction Notary

The concept of notarization was introduced at Babylon as a means to support seamless multi-signature transactions.

## How is it used?

In the [transaction structure](/docs/transaciton-structure): \* The transaction header defines a `notary_public_key`, and optionally whether the `notary_is_signatory`, which is an optimization so that the notary counts as a transaction intent signatory. \* This key must “notarize” the signed transaction intent to confirm the signatures are correct, by adding its own notary signature to the signed transaction intent. This creates the “notarized transaction” which can be submitted to the network as a user transaction.

## Who is the notary?

Generally there will be one party who is orchestrating the transaction construction/signing/submission process. This party is a natural notary. For example: \* In many self-sign scenarios, the wallet itself can be the notary, and make use of the `notary_is_signer` optimization. \* A custodian or signature-aggregator which orchestrates a threshold signature process could be a natural notary. \* In future wallet-to-wallet scenarios (e.g. recovery of an account using a contact as a recovery factor), one phone will act as a proposer/notary, and the contact will act as a simple transaction intent signer, and pass back an intent signature to be added to the transaction.

## Motivation for the notary concept

Compared to many other networks, the Babylon engine: \* Doesn’t have a clear “signer” or “fee payer” on a transaction. \* Is designed so that the presence/absence of signatures can cause the transaction to fail (via the [auth model](../authorization/index.md) and [implicit signature requirements](../authorization/advanced-accessrules.md)); but does not affect the execution of the transaction. \* In particular, you can’t read the signatories inside the transaction. \* This has benefits in terms of readability: the intent itself captures the content of the transaction. \* It allows makes preview more powerful and accurate: we can support flags to disable authorization without affecting control flow. \* In certain threshold signature scenarios with complicated authorization rules, there may be multiple combinations of signers which could correctly allow the transaction to be successful.

We wanted our transaction design to: \* Support sending concurrent transactions without worrying about interaction between these transactions where it wasn’t required (i.e. to avoid the “account nonce” feature) \* Prevent tampering of the signatures which could cause a transaction payload to fail unfairly and waste the fee

We also had other requirements for the transaction design (e.g. to avoid adding permanent bloat to the ledger state) - these further aspects of the design are captured in the [Transaction Tracker](transaction-tracker.md) reference.

The notary concept solves these problems: \* The notary signature prevents tampering of the intent signatures \* All standard signers agree that the notary key is given limited power over the transaction to control the signing and submission process

## What can the notary do?

The notary has the power/responsibility to: \* **Select a correct set of signatures** to include in the transaction. \* If the notary were malicious or incompetent, they could choose incorrect signatories which could cause the transaction to fail, and waste the fee, or they could choose too many signatories which would waste fees in transaction validation costs. \* **Finalize the transaction for submission**… or decide not to. \* **Attempt to invalidate the transaction** if it is stuck in the mempool post-submission and hasn’t been committed yet. \* This is *not yet supported* as of Cuttlefish, but the Transaction Tracker was designed with this in mind. \* For now, we advise transaction submitters to set a short expiry window with an epoch (cheap) or timestamp-based expiry (slightly more expensive).

## What can’t the notary do?

Due to the design of the Radix Engine, the presence/absence of the signatures shouldn’t have any direct bearing on the result of a successful transaction, only whether it succeeds or fails. A notary cannot: \* **Replay the transaction intent:** A notary is able to theoretically submit multiple submissions for the same intent. But these will all have the same transaction id (i.e. transaction intent hash), and the engine will guarantee only one of these will commit. \* **Affect the result of a successful transaction:** A notary can add the wrong signatures, or add cost to the transaction by adding more signatures, but apart from that, cannot cause the transaction to succeed with different behaviour. This is because the Radix Engine ensures that the exact identity of the signatures is not readable in the transaction (outside of an authorization assertion which would cause the transaction to reject/fail).
