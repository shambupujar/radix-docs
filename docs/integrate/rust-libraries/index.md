---
title: "Rust Libraries"
---

# Rust Libraries

Rust is used as a key part of the Radix stack, and is published to `crates.io` with each release.

There are a few Radix libraries which might be useful for integration or reference:

- The Engine Rust Libraries - which power the Radix Engine in the node, resim and resim
- The Radix Engine Toolkit core
- Wallet-compatible derivation
- Sargon

## Engine Rust Crates

These crates are published to `crates.io` at each protocol update.

All these crates inter-depend, so you must ensure you use the same version across all imported crates. These crates **don’t use standard semver** - we recommend explicitly **fixing the version for each protocol update, and manually updating**.

Key libraries include: \* [scrypto](https://crates.io/crates/scrypto) ([docs](https://docs.rs/scrypto/latest)) and [scrypto-test](https://crates.io/crates/scrypto-test) ([docs](https://docs.rs/scrypto-test/latest)) - The crates used to create and test scrypto applications. \* [radix-transactions](https://crates.io/crates/radix-transactions) ([docs](https://docs.rs/radix-transactions/latest)) - Builders and models for Radix transactions. Includes the: \* [ManifestBuilder](https://docs.rs/radix-transactions/latest/radix_transactions/builder/struct.ManifestBuilder.html) ([article](manifest-builder.md)) - A rust-native tool for building any [manifest](../../build/transactions-manifests/index.md). \* [TransactionV1Builder](https://docs.rs/radix-transactions/latest/radix_transactions/builder/struct.TransactionV1Builder.html) - For building V1 [Notarized Transactions](../../build/dapp-transactions/transaction-structure.md) \* [TransactionV2Builder](https://docs.rs/radix-transactions/latest/radix_transactions/builder/struct.TransactionV2Builder.html) - For building V2 [Notarized Transactions](../../build/dapp-transactions/transaction-structure.md) \* [SignedPartialTransactionV2Builder](https://docs.rs/radix-transactions/latest/radix_transactions/builder/type.SignedPartialTransactionV2Builder.html) - For building V2 [Signed Partial Transactions](../../build/dapp-transactions/transaction-structure.md), the recommended path to build subintents to build up a transaction \* [AnyTransaction](https://docs.rs/radix-transactions/latest/radix_transactions/model/enum.AnyTransaction.html) - an enum of all transactions and the canonical transaction serialization \* [AnyManifest](https://docs.rs/radix-transactions/latest/radix_transactions/model/enum.AnyManifest.html) - an enum of all manifests \* [AnyInstruction](https://docs.rs/radix-transactions/latest/radix_transactions/model/enum.AnyInstruction.html) - a type alias for the latest version of instructions - an enum of all possible instructions. \* [radix-common](https://crates.io/crates/radix-common) ([docs](https://docs.rs/radix-common/latest)) and [radix-rust](https://crates.io/crates/radix-rust) ([docs](https://docs.rs/radix-rust/latest)) - Various common Radix traits and types.

Most libraries have an expansive `prelude` which cover most of their key functionality, and is recommended to avoid import paths breaking between different versions.

There are also other crates, such as radix-engine, radix-engine-interface and many others. But these aren’t typically used as libraries by integrators.

## Rust Toolkit

The [toolkit core](https://github.com/radixdlt/radix-engine-toolkit) is built in Rust, but it isn’t published to `crates.io` and is mostly built to be exposed over UniFFI or WASM. It isn’t intended to be used directly.

We may more formally create a rust toolkit with a more stable API at some point, but for now we recommend using the Engine crates directly (notably, the [radix-transactions](https://crates.io/crates/radix-transactions) crate).

## Wallet compatible derivation

The [wallet-compatible-derivation](https://github.com/radixdlt/wallet-compatible-derivation) crate and CLI can be used to derive keys from mnemonics in the same manner as the official Radix Wallet, which enables creating a programmatic integration which can also be imported into a Radix wallet.

## Sargon

The [sargon](https://github.com/radixdlt/sargon) crate is a UniFFI library which forms the core of the official Android and iOS wallets.

It’s not intended to be consumed by anyone else, but might form a useful reference. It imports both the engine libraries and [toolkit core](https://github.com/radixdlt/radix-engine-toolkit).

## Babylon Node

The babylon node has a [rust-core](https://github.com/radixdlt/babylon-node/tree/main/core-rust), which might be a useful reference.
