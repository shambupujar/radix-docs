---
title: "Scrypto v1.3.0"
---

# Scrypto v1.3.0

Scrypto `v1.3.0` adds support for the [cuttlefish](../protocol-updates/cuttlefish.md) protocol update.

:::note[Use the correct rust version]
Scrypto v1.3.0 should be used with `rustc 1.81` or below which can be installed with `rustup`.

Using 1.82.0 and higher will not work with the Cuttlefish engine because it builds WASM with new WASM exetensions which are not yet supported by the Radix execution environment.
:::



See [Scrypto v1.3.0 on docs.rs](https://docs.rs/scrypto/1.3.0) for full technical documentation.

## New Features

### Transaction V2 and Subintents

The headline feature of `cuttlefish` is [subintents](../../build/dapp-transactions/subintents.md), which function like mini transactions that can be embedded within other transactions. They are complete user intents which are signed separately and can be passed around off-ledger to be assembled with other intents into a complete transaction.

- To understand how subintents work, read about the [intent structure](../../build/dapp-transactions/intent-structure.md).
- To use subintents in your dApp, read about the [Pre-authorization Flow](../../build/dapp-transactions/pre-authorizations-subintents.md) which also covers some example use-cases.

Further documentation on working with subintents will follow in the next week. But to start you off, here’s an example of building a `NotarizedTransactionV2` with a subintent:

``` rust
let subintent = TransactionBuilder::new_partial_v2()
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
    .add_signed_child("child", subintent)
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
```

To build just a `TransactionManifestV2`, you can use the `new_v2()` method on `ManifestBuilder`, or to build a `SubintentManifestV2`, you can use the `new_subintent_v2()` method:

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

#### Subintent and Transaction building considerations

- Subintents can only commit successfully once, but can be committed inside failing transactions many times before that (this prevents someone maliciously failing your subintent permanently). To prevent issues with fee drainage, fees cannot be locked inside a subintent (contingent fees can however be locked). Therefore the root transaction intent must pay the fees from the transaction.
- Each transaction has one “transaction intent” and zero or more “non-root subintents”
  - Together, these are called the “intents” of a transaction.
  - The intents of a transaction form a conceptual tree, with the transaction intent at the root, and each intent can have zero or more subintent children.
  - All subintents in the transaction must be reachable from the root.
  - In the type model, the non-root subintents are stored into a normalized / flattened array. A subintent can therefore be addressed by its `SubintentHash`, and (in the context of a given transaction), by its `SubintentIndex`, which is its 0-based index into this array.
- Subintents must `YIELD_TO_PARENT` exactly as many times as their parent intent targets them with a `YIELD_TO_CHILD` (see below).
- Subintents must end with a `YIELD_TO_PARENT` instruction.
- Structural limits:
  - A transaction can only have an intent depth of 4 (a transaction intent root, and three additional levels of subintents)
  - A transaction can have a maximum of 32 total subintents, and 64 signatures across these subintents
  - Each manifest can have a maximum of 1000 instructions

#### V2 Preview

The `TransactionBuilder::new_v2()` can also be used to build a `PreviewTransactionV2`, with the `build_preview_transaction(transaction_intent_signer_public_keys)` method, which can be used before signing/notarizing. The `PreviewTransactionV2` can be used in the new preview-v2 API on the [Core API](https://radix-babylon-core-api.redoc.ly/#tag/Transaction/paths/~1transaction~1preview-v2/post) or [Gateway API](https://radix-babylon-gateway-api.redoc.ly/#operation/TransactionPreviewV2).

### New Manifest Instructions

:::note[Notes]
These instructions are only available in `V2` manifests, which is supported only by `SubintentManifestV2` and `TransactionManifestV2`. For the time being, the Radix Wallet will only support: \* Childless `SubintentManifestV2` stubs for pre-authorization requests \* `TransactionManifestV1` stubs for transaction requests Therefore the new instructions *cannot* currently be used when making transaction requests to the wallet.
:::



A brief overview of the new V2 instructions are as follows. Full detail and examples are given in the [manifest instructions article](../../build/transactions-manifests/manifest-instructions.md). Examples of subintent and transaction manifests can be found [here](https://github.com/radixdlt/radixdlt-scrypto/tree/main/radix-transaction-scenarios/generated-examples/cuttlefish/basic_subintents/manifests).

| Instruction | Description |
|----|----|
| `USE_CHILD` | A pseudo-instruction that must be at the start of a written manifest. It declares the children of the intent, by specifying their subintent hash, and giving them a name to be used in the rest of the manifest. |
| `VERIFY_PARENT` | Verifies that the parent intent’s auth zone satisfies the given access rule. This can be used for a counterparty check. For example, it can be used to require that the subintent is used by a particular dApp. |
| `YIELD_TO_PARENT` | Yields execution to the parent intent. This instruction takes any number of arguments. This can be used to pass buckets to this instruction. This instruction can also receive buckets onto the worktop. |
| `YIELD_TO_CHILD` | Yields execution to a child intent. This instruction takes any number of arguments. This can be used to pass buckets to this instruction. This instruction can also receive buckets onto the worktop. |
| `ASSERT_WORKTOP_IS_EMPTY` | Asserts that the worktop is empty. |
| `ASSERT_WORKTOP_RESOURCES_INCLUDE` | Asserts that the worktop contains the specified resources, with the given constraints for each resource. It may also return other resources. |
| `ASSERT_WORKTOP_RESOURCES_ONLY` | Asserts that the worktop contains *ONLY* the specified resources, with the given constraints for each resource. |
| `ASSERT_NEXT_CALL_RETURNS_INCLUDE` | Asserts that the next call returns the specified resources, with the given constraints for each resource. It may also return other resources. A call is any method or function call instruction, or a `YIELD_...` instruction. |
| `ASSERT_NEXT_CALL_RETURNS_ONLY` | Asserts that the next call returns *ONLY* the specified resources, with the given constraints for each resource. |
| `ASSERT_BUCKET_CONTENTS` | Asserts that the bucket’s contents meet the given constraints. |

### More Crypto Utils

More cryptographic primitive utilities have been added to the Radix Engine, available in [CryptoUtils](https://docs.rs/scrypto/1.3.0/scrypto/crypto_utils/struct.CryptoUtils.html) in Scrypto:

``` rust
CryptoUtils::blake2b_256_hash(&data);
CryptoUtils::ed25519_verify(&message, &pub_key, &signature);
CryptoUtils::secp256k1_ecdsa_verify(&hash, &pub_key, &signature);
CryptoUtils::secp256k1_ecdsa_verify_and_key_recover(&hash, &signature);
CryptoUtils::secp256k1_ecdsa_verify_and_key_recover_uncompressed(&hash, &signature);
```

### Getter Methods on Account Blueprint

New getter methods have been added to the [Account](../../build/native-blueprints/account.md) blueprint, allowing on-chain account balance lookup.

The [Account](https://docs.rs/scrypto/1.3.0/scrypto/component/struct.Account.html) stub has been updated with these new methods for easy access:

``` rust
fn balance(&self, resource_address: ResourceAddress) -> Decimal;

fn non_fungible_local_ids(
    &self,
    resource_address: ResourceAddress,
    limit: u32,
) -> Vec<NonFungibleLocalId>;

fn has_non_fungible(
    &self,
    resource_address: ResourceAddress,
    local_id: NonFungibleLocalId,
) -> bool;
```

## Code Changes

Some tweaks have been made to the various scrypto and engine libraries, which may need to be updated in your code.

Notably changes include the following. If you are hitting other compilation errors and need advice, please ask in the [dev-lounge channel on Discord](https://discord.com/channels/417762285172555786/803425066678222870) or the [Developer Telegram Channel](https://t.me/RadixDevelopers), and we can advise or update this article with more details.

### Renames to AccessRule models

- `AccessRuleNode` has been renamed to `CompositeRequirement`
- `ProofRule` has been renamed to `BasicRequirement`

We have updated this across the stack, although some APIs (e.g. the Core API and SBOR annotated programmatic JSON) may still refer to the old names in some places due to backwards-compatibility requirements. And the old names are still accepted as Enum descriptors in Manifest Value syntax.

See [advanced access rules](../../build/authorization/advanced-accessrules.md) for more information.

### Renames to “virtual” entity types and addresses

The old naming caused confusion, and these are now known as “pre-allocated” addresses. This has caused changes to the `EntityType` enum and various functions on entity type and `ComponentAddress`.

As an example, a “virtual account” can now be called an “uninstantiated pre-allocated account” if it’s yet to be instantiated on ledger, or an “instantiated pre-allocated account” once created.

We have updated this across the stack, although some APIs (e.g. Core API and SBOR annotated programmatic JSON) may still refer to “virtual” entity types due to their backwards-compatibility requirements.
