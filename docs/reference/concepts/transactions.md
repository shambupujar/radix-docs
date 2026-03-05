---
title: "Transactions"
---

# Transactions

This article explains how to interact with transactions as integrators. If you’re looking for a more complete overview of the structure, design and motivation of the Radix transaction model, see the [transaction overview](../../build/dapp-transactions/transaction-overview.md).

## Construction process

For most users, the transaction construction process will be handled in their mobile Radix Wallet.

Integrators wishing to construct transactions programmatically will need to integrate the Radix Engine Toolkit (RET) into their application for construction and finalization.

The RET has a Rust-native core, but a wrapper is provided in a number of different languages to make integration easier.

## Transaction versions

There are two versions of transactions supported on Radix: \* Transaction V1 launched at Babylon in September 2023. \* Transaction V2 launched at Cuttlefish in December 2024. It has added support for subintents, tips in basis points, and timestamp-based expiry.

As a programmatic integrator, you can use either. Much tooling (including the Typescript LTS toolkit) has better support for Transaction V1, and the rest of the guide assumes you’re using Transaction V1.

If your tooling supports building a Transaction V2, then it is easy to use instead of V1, and new functionality is opt-in.

## Transaction contents, hashes and identifiers

User transactions are formed of a core transaction “intent”, which is then signed by 0+ signatories, before being notarized. The output is called a notarized transaction. It is this notarized transaction payload which is submitted to the network.

More specifically, you can think of a transaction as a shell. The innermost layer is the **Transaction Intent** - which is the body of the transaction. It includes:

- A “header” with data such as the epoch window in which the transaction is valid, a message, and a nonce to allow for creation of duplicate intents. It also includes the **notary** public key which needs to sign the transaction before submission, and a flag which marks that the notary should count as a signer.
- A “[manifest](/docs/transaction-manifest)” which contains human-readable instructions for the transaction.
  - The LTS Toolkit has an easy builder to help you create a manifest for fungible transfers without learning about the manifest.
- Optionally, “blobs” - payloads which can be referenced from the manifest.

The RET can take this intent and create a summary of it: the “(transaction) **intent hash**”. The Radix Engine guarantees that each intent can be committed no more than once.

The **transaction identifier** or “**txid**” is the Bech32m encoded intent hash (sometimes called `intent_hash_bech32m` in the API). This is the identifier which should be shown to users, and can be linked to the dashboard, for example, an example of a mainnet transaction id, with explorer link is: [txid_rdx1763t9r3pq962lje83dkdhv4wkjpe92z5sqee56rp0l5k26lzrzjs0q5ugq](https://dashboard.radixdlt.com/transaction/txid_rdx1763t9r3pq962lje83dkdhv4wkjpe92z5sqee56rp0l5k26lzrzjs0q5ugq).

The next layer is the **Signed Transaction**. The intent hash can then be signed by 0 or more signatories, which is combined with the intent to form a signed transaction, which is summarized in a “**signed transaction hash**”.

The final layer is the **Notarized Transaction**. The signed transaction hash is signed by the notary, and combined into the notarized transaction, which is compiled and then submitted to the ledger. A notarized transaction can be summarized by a “**notarized transaction hash**”, also referred to as “(notarized) **payload hash**”.

:::note[Uniqueness of transactions]
Whilst the engine guarantees that an intent hash is only committed once, it is technically possible for a notary to sign multiple different, valid payloads with the same intent hash.

Whilst this would be abnormal behavior, it still needs to be handled by the node. Therefore endpoints which return details about an uncommitted intent (such as transaction status) will also return details for each payload that the node is aware of which contain this intent. Typically this will return only the one payload you’ve submitted.
:::



## Transaction notary

The notary is responsible for ensuring that the transaction has been signed by the right signers, before submitting it to the network.

In a later release, the notary will also be able to revoke pending submitted transactions which have not yet been committed (with a new, “cancel” transaction).

For typical single-signer transactions, the transaction header can be configured to include the notary as a signer, and **the notary can simply be the main signatory**, with 0 additional signatures required. This is cheaper than having a separate notary.

For more complex multi-signer transactions, the intended submitter would be the notary. Either this would be one of the signers, or it could be some third party orchestrator.

The notary only has the power to select the signatures and to submit or cancel the transaction. The engine has been designed to ensure that if an intent can be successfully submitted, its outcome is independent of which signatures were present. This means that even if a notary changes the signatures, it can only cause the transaction to fail (which rollback the result - minus fees), but can’t affect its result when it succeeds. Therefore it is safe to nominate third-parties (e.g. transaction orchestrators) as notaries, so long as you are happy with giving them the power to cause a transaction to fail or be cancelled if they include the wrong signatures or choose to cancel it.

## Transaction outcome

Once submitted to a node, a transaction payload can end up being either rejected or committed. The transaction status endpoint can be used to query the current status of a submitted transaction intent.

Transactions get rejected if they fail to pass certain criteria at the given time. A transaction payload can be marked as a:

- **Permanent Rejection** if it is never possible for it to be committed (eg it’s statically invalid, or only valid up until epoch 100 and it’s now epoch 101)
- **Temporary Rejection** if it still may be possible that the transaction payload could be committed.

A given intent typically is only part of one submitted notarized payload, but it’s possible for a notary to notarize and submit multiple payloads for the same intent.

The Radix Engine ensures that any intent can only be committed once.

A committed transaction is either committed with an outcome of “Success” or “Failure”:

- **Committed Failure** will result in fees being paid up until the failure point, but all other events and state changes will be discarded.
- **Committed Success** will result in all changes being committed, and fees being paid.

Only committed transactions appear in the transaction stream - rejected transactions by definition never make it into the history of the ledger.

Typically you will want to handle these in the following ways:

- **Temporary Rejection**: You may wish to wait or resubmit the same transaction (with the same transaction intent / transaction identifier).
  - ***Do NOT rebuild the transaction*** - if you submit a newly built/signed transaction, both transactions could be committed.
  - Be careful: the transaction may still be able to be committed successfully! For example - if not enough XRD is available to lock a fee in the account, the transaction will be marked as a temporary rejection. Because if the account is topped up, the transaction might still go through.
  - Eventually this transaction will be permanently rejected because its “max epoch” that was configured during transaction construction will have passed.
  - You may wish to tune the max epoch so that transactions permanently reject sooner. Each epoch lasts about 5 minutes.
- **Permanent Rejection** or **Committed Failure**: The transaction at this stage cannot be committed successfully. You will need to remedy the reason for failure - EG the account doesn’t have enough XRD to pay for fees - and then build/sign a new, replacement transaction - which will have a new transaction identifier.

To summarise:

- You are always safe to resubmit the same transaction (with the same transaction intent / transaction identifier) - each transaction intent can only be committed once.
- To prevent the risk of a duplicate commit, you should only rebuild and submit a replacement transaction if you’ve seen that the previous transaction was marked as either **Committed Failure** or **Permanent Rejection**.

## Transaction results

A transaction results in various outputs, notably:

- State updates to the current ledger state, including changes to resource balances.
  - Resource balances live in vaults under accounts/components.
  - Transaction outcomes returned by the LTS API automatically aggregates these balance changes under global accounts/components for you, to avoid you having to worry about separate vaults.
- Emitted events

The LTS sub-api of the Core API lets you query the balance changes in a transaction.

There is no such thing as a user “transaction type” such as a “transfer” - all user transactions make use of a **transaction manifest**, and could - eg - call DeFi components.

Instead - we encourage you to think about a transaction’s resulting **balance changes**.

For example:

- Any transaction which resulted in your account gaining balance should be interpreted as a deposit into your account.
- A transaction which results in (only) a withdrawal of resource R (and XRD fee payment) from one account and a deposit of that resource into another account could be interpreted as a simple transfer of resource R between those accounts, which could possibly be used to show a special display for the results of the transaction.

## Transaction handling

If a notarized transaction is submitted successfully to a node, the transaction will live in that node’s mempool, and be gossiped around the network. Hopefully it will end up in a validator’s mempool and be included in a proposal, and eventually committed.

*Commit times are typically a few seconds if the network is uncongested.*

If a transaction is no longer valid, it will drop out of the node’s mempool and the node will temporarily cache that the transaction is rejected, allowing the rejection to be returned from the transaction status API and preventing it from being added back into its mempool for a time.

If a transaction is submitted to a Gateway, it will attempt to resubmit the transaction to the network for a limited time.

The transaction status endpoints on the Core API are designed to give a very clear picture about the current status of a transaction intent, and the likelihood that the transaction will be able to be committed.

## Transaction expiry, nonce and cancellation

When transactions are built, in their header we have:

- **Valid from epoch** - from this epoch, the transaction will be valid
- **Valid before epoch** - at this epoch, the transaction will no longer be valid, and instead be **permanently rejected**
- **Notary signature**

Epochs are approximately 5 minutes long.

Typically:

- The valid from epoch is set to the current epoch
- The valid before epoch is set to N epochs above the current epoch - where N is small (eg N = 2 is the default in the LTS Toolkit). If N = 2 then the transaction will permanently reject between approximately 5-10 minutes after construction.

The transaction header also contains a nonce, which is to allow creating a new intent on the rare occasions where you wish to duplicate the same intent.

This nonce is **NOT like an ethereum nonce** and repeating the nonce **will NOT cancel the previous transaction**.

In future, we will support transaction cancellation via a special transaction that the notary can sign. But this will not be needed for launch as we expect commit times to be short until the network is saturated.

## Transaction messages

:::warning
Encrypted messages are not currently implemented in the official Radix wallet.
:::



These messages can either be:

- UTF-8 string
- Raw bytes
- Encrypted UTF-8 string
- Encrypted raw bytes

Messages have no length limit besides transaction size - although large transactions will cost more.

Encrypted messages can be encrypted for reading by multiple Ed25519 and/or Secp256k1 public keys.

These keys may either be:

- Included by the dApp in a wallet transaction request, or resolved from the metadata of a receiving account.
- Resolved by the sender’s wallet from the target account’s metadata for transfer transactions built by the wallet. Note - virtual account addresses only contain hashed public keys, which isn’t sufficient for encrypting messages. Instead an account owner will upload a public key as metadata against their account if they wish to receive encrypted messages.

## Transaction stream and state versions

Committed transactions are assigned a “resultant state version” which starts at 1 for the first transaction on the Babylon ledger and effectively acts as an auto-incrementing primary key for the Babylon committed transaction stream (with no gaps).

The Core and Gateway APIs include endpoints starting `/stream` - these endpoints operate over the ordered stream of committed transactions, by state version ascending - and let you query for ledger history, transaction-by-transaction.

*Note: Babylon state versions start from 1 again - so the Babylon transaction with state version 1321 is different from the Olympia transaction with state version 1321. These transaction histories should be stored separately.*

## Transaction fees

Fees are paid in XRD. XRD is stored in vaults, and during execution, a transaction must call “lock fee” against an XRD vault to reserve some XRD to pay the transaction fee.

*Transfer transactions constructed by the LTS Toolkit SimpleTransactionBuilder will include a lock fee instruction automatically against the sender’s account, so the sender’s account must contain some XRD before they can send transactions.*

Multiple vaults can lock a fee in a transaction - with the later vaults being used preferentially. This can allow dApp components to pay fees for the user - or for other accounts to pay fees on behalf of a different account (which would need a transaction with multiple signatures).

The transaction is granted a mini “loan” at the start of the transaction, during which it must lock a fee from an XRD vault. A transaction which doesn’t repay its loan in time will be rejected. If a transaction runs out of locked fee after the loan has been repaid, the transaction is marked as a committed failure. All changes (apart from fee payments) are rolled back.

The fee total comes from a number of places:

- Execution cost:
  - Engine calls and WASM execution
  - Reading and writing state.
    - This includes instantiation of virtual accounts which are created for the first time in your transaction via a deposit. This means that a transaction which deposits to a new virtual account will pay a higher fee than a transaction which deposits to an existing account.
  - Signature verification
  - And many other places
- Royalty cost:
  - Packages and Components can define royalties, which are paid to the package / component owner for using their code or component.
  - This enables package writers to get paid for their work, and allows components such as oracles to charge for providing a service.
- Tips:
  - A transaction may provide a tip multiplier - which can be used by validators to prioritise transactions if there is network contention.
  - The tip is defined in the transaction’s header.

For a full blog post on fees, see [How Fees Work in Babylon](https://www.radixdlt.com/blog/how-fees-work-in-babylon).
