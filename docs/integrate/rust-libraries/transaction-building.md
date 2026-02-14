---
title: "Transaction Building"
---

# Transaction Building

You can use the [radix-transactions](https://docs.rs/radix-transactions/latest) crate to build transactions.

## Other languages

- The UniFFI [Radix Engine Toolkit](../radix-engine-toolkit/index.md) enables building transactions in other languages (e.g. Swift, Kotlin, Go, Python), with a similar API to the below.
- The Typescript Radix Engine Toolkit allows building v1 transactions, but does not have support for building v2 transactions as-of December 2024.

## Choosing the version to build

If starting your programmatic integration now, we recommend building [V2 transactions](../../build/dapp-transactions/transaction-overview.md) introduced at Cuttlefish.

Even if you don’t use subintents, they offer a few advantages over V1 transactions, including: \* Support for timestamp expiry. \* A collission-resistant intent discriminator. \* More flexible [instructions for assertions](../../build/transactions-manifests/manifest-instructions.md). \* A more user-friendly builder, which outputs a detailed transaction with hashes.

:::note[Building for the Wallet]
In the unlikely circumstance where you are using the Rust manifest builder to build a manifest stub which will be used in the dApp toolkit, note that at Cuttlefish launch, only v1 instructions are supported in the wallet for the `sendTransaction` action. v2 instructions are supported in the [pre-authorization flow](../../build/dapp-transactions/pre-authorizations-subintents.md) however.
:::



## Transaction V2

To build V2 transactions, you can use the [TransactionV2Builder](https://docs.rs/radix-transactions/latest/radix_transactions/builder/struct.TransactionV1Builder.html), along with the [ManifestBuilder](https://docs.rs/radix-transactions/latest/radix_transactions/builder/struct.ManifestBuilder.html).

You will need to integrate with the [Gateway API](/docs/gateway-api) or [Core API](/docs/core-api) to resolve the current epoch.

Support for external signers (e.g. HSMs) is available via implementing the (blocking/non-async) `Signer` trait. Note the [Curves, Keys, Signatures and Hashing](../../essentials/concepts/curves-keys-signatures.md) guide for the canonical serialization to use for keys and signatures.

You will likely want to read the documentation on [intent structure](../../build/dapp-transactions/intent-structure.md) before beginning.

### Configuration

``` rust
// The notary can be an ephemeral key (in which case, set notary_is_signatory as false)
// or a main signer key (in which case, set notary_is_signatory as true)
let notary = ...;
let signers = ...;
let notary_is_signatory = ...;
let tip_percentage = 0;
let network = NetworkDefinition::mainnet();
let current_epoch = /* source from Core API or Gateway API */;

// Recommended configuration
// The transaction will expire at the end of the next epoch (in 5-10 minutes time)
let intent_discriminator = rand::thread_rng().gen();
let start_epoch_inclusive = Epoch::of(current_epoch);
let end_epoch_exclusive = Epoch::of(current_epoch + 2);
```

### Using subintents

``` rust
/* Use an existing signed partial transaction, from e.g. the pre-authorization flow */
let signed_partial_transaction = SignedPartialTransactionV2::from_raw(RawSignedPartialTransaction::from_hex(hex));
let subintent_hash =  signed_partial_transaction
    .prepare(PreparationSettings::latest_ref())
    .expect("Child signed partial transaction could not be prepared")
    .subintent_hash();

/* OR build your own from a subintent manifest */
let signed_partial_transaction = TransactionBuilder::new_partial_v2()
    .intent_header(IntentHeaderV2 {
        network_id,
        start_epoch_inclusive,
        end_epoch_exclusive,
        intent_discriminator,
        min_proposer_timestamp_inclusive,
        max_proposer_timestamp_exclusive,
    })
    .manifest_builder(|builder| {
        builder
            .withdraw_from_account(account, XRD, 10)
            .take_all_from_worktop(XRD, "xrd")
            .yield_to_parent_with_name_lookup(|lookup| (lookup.bucket("xrd"),))
    })
    .sign(&signer_key)
    .build();
let subintent_hash = signed_partial_transaction.subintent_hash;
```

### Building a transaction

``` rust
let DetailedNotarizedTransactionV2 {
   transaction,
   raw,
   object_names,
   transaction_hashes,
} = TransactionBuilder::new_v2()
   .transaction_header(TransactionHeaderV2 {
       notary_public_key,
       notary_is_signatory,
       tip_basis_points,
   })
   .intent_header(IntentHeaderV2 {
       network_id,
       start_epoch_inclusive,
       end_epoch_exclusive,
       intent_discriminator,
       min_proposer_timestamp_inclusive,
       max_proposer_timestamp_exclusive,
   })
   .add_signed_child("child", signed_partial_transaction)
   // The manifest_builder method automatically registers the child hash, so you can avoid
   // avoid having to do `use_child("child", subintent_hash)` in the manifest
   .manifest_builder(
       |builder| {
           builder
               .yield_to_child("child", ())
               .deposit_entire_worktop(account)
       },
   )
   .sign(&signer_key)
   .notarize(&notary_key)
   .build();
   
let transaction_payload_hex = raw.to_bytes();

let transaction_intent_hash = transaction_hashes.transaction_intent_hash; // The transaction id
let transaction_id = transaction_intent_hash.to_string(&network);
```

### Building a manifest by itself

To build just a `TransactionManifestV2`, you can use the `new_v2()` method on `ManifestBuilder`, or to build a `SubintentManifestV2`, you can use the `new_subintent_v2()` method. Note that `yield_to_parent(..)` and `verify_parent(..)` are only available on subintent manifests:

``` rust
let transaction_manifest = ManifestBuilder::new_v2()
    .use_child("child", subintent_hash)
    .lock_standard_test_fee(account)
    .yield_to_child("child", ())
    .build();

let subintent_manifest = ManifestBuilder::new_subintent_v2()
    .yield_to_parent(())
    .build();
```

## Legacy Transaction V1

To build basic V1 transations, you can use the [TransactionV1Builder](https://docs.rs/radix-transactions/latest/radix_transactions/builder/struct.TransactionV1Builder.html), along with the [ManifestBuilder](manifest-builder.md).

You will need to integrate with the [Gateway API](/docs/gateway-api) or [Core API](/docs/core-api) to resolve the current epoch.

Support for external signers (e.g. HSMs) is available via implementing the (blocking/non-async) `Signer` trait. Note the [Curves, Keys, Signatures and Hashing](../../essentials/concepts/curves-keys-signatures.md) guide for the canonical serialization to use for keys and signatures.

``` rust
// The notary can be an ephemeral key (in which case, set notary_is_signatory as false)
// or a main signer key (in which case, set notary_is_signatory as true)
let notary = ...;
let signers = ...;
let notary_is_signatory = ...;
let tip_percentage = 0;
let network = NetworkDefinition::mainnet();
let current_epoch = /* source from Core API or Gateway API */;

// Recommended configuration
// The transaction will expire at the end of the next epoch (in 5-10 minutes time)
let intent_discriminator = rand::thread_rng().gen();
let start_epoch_inclusive = Epoch::of(current_epoch);
let end_epoch_exclusive = Epoch::of(current_epoch + 2);

let manifest = ManifestBuilder::new_v1()
    /** add instructions **/
    .build();
 
let builder = TransactionV1Builder::new()
    .header(TransactionHeaderV1 {
        network_id: network.id,
        start_epoch_inclusive,
        end_epoch_exclusive,
        nonce: intent_discriminator,
        notary_public_key: notary.public_key().into(),
        notary_is_signatory,
        tip_percentage,
    })
    .manifest(manifest)
    .multi_sign(&signers)
    .notarize(&notary);
    
let raw_transaction = builder.build().to_raw().unwrap();
let transation_bytes_hex = raw_transaction.to_hex();
let transaction_intent_hash = let subintent_hash =  raw_transaction
    .prepare(PreparationSettings::latest_ref())
    .expect("Transaction could not be prepared")
    .transaction_intent_hash();
let transaction_id = transaction_intent_hash.to_string(&network);
```
