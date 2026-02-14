---
title: "Scrypto v1.2.0"
---

# Scrypto v1.2.0

Scrypto `v1.2.0` introduces various features and enhancements, targeting the `bottlenose` protocol update.

Starting from this version, Scrypto and Radix Engine crates are published to [crates.io](https://crates.io/).

### New Bottlenose Features

`Bottlenose` protocol update introduces two new features that can be used by Scrypto blueprints.

There is a new native blueprint `AccountLocker`, which makes sending resource to accounts easier. See [this doc](../../build/native-blueprints/locker.md) for more details. A corresponding stub is added to Scrypto library.

A new method `get_owner_role` is added to every global component. Here is an example of how to get the owner role of a component:

``` rust
let owner_role = global_component.get_owner_role();
```

### Radix CLIs

The `simulator` is rebranded to `radix-clis`, featuring the following tools: \* `resim` - A ledger simulator to play with Radix Engine features \* `scrypto` - A tool for creating, building and testing Scryto code \* `rtmc`/`rtmd` - Radix transaction manifest compiler and decompiler \* `scrypto-bindgen` - A tool for generating stubs for the blueprints of a package

Here is the **new** way of installing Radix CLIs:

``` bash
cargo install --force radix-clis@1.2.0
```

### Pretty Manifest Compilation Error

Radix CLI `rtmc` now prints pretty error message and highlights the problematic parts.



### New Scrypto Compiler Library

A new library `scrypto-compiler` is introduced to standardize everything around Scrypto compilation. This crate is used by Radix CLIs, `scrypto-builder` and `scrypto-test`, to provide consistent behavior. It is now available for public use.

### Scrypto Testing

Various enhancements are made to Scrypto testing libraries. \* `scrypto-unit` is merged into `scrypto-test` \* `TestRunner` is renamed to `LedgerSimulator` \* `TestEnvironmentBuilder` is introduced for configuring the environment prior to creation \* `SubstateDatabaseOverlay` is added to enable testing and simulation on top of a real Node database \* `Package` is renamed to `PackageFactory` \* Scrypto tests now can specify a `CompilerProfile`, indicating whether standard or fast Scrypto compilation should be used

### Manifest Builder

Two bug fixes for the `ManifestBuilder` utility \* Fixed the issue that `deposit_batch` consumes named buckets, [\#1702](https://github.com/radixdlt/radixdlt-scrypto/pull/1702) \* Fixed the issue that prevents creation of RUID NFTs, [\#1701](https://github.com/radixdlt/radixdlt-scrypto/pull/1701)
