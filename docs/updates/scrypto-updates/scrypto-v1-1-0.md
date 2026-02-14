---
title: "Scrypto v1.1.0"
---

# Scrypto v1.1.0

## Summary

Scrypto `v1.1.0` release is a version that targets the `Anemone` network, which introduces the following protocol updates: \* Second-precision network time \* BLS and Keccak256 cryptography \* Improved pool blueprints \* Reduced validator creation fee

## Latest Compatible Product Versions



By using the binaries, including libraries, CLIs and docker images you agree to the End User License Agreement. You can find all terms and conditions [here](https://uploads-ssl.webflow.com/6053f7fca5bf627283b582c2/65006e3d3a8002f9e834320c_radixdlt.com_genericEULA.pdf).



Engine, Node and Scrypto: \* Scrypto: [v1.1.0](https://github.com/radixdlt/radixdlt-scrypto/releases/tag/v1.1.0) on Github \* Radix Engine Toolkit Core: [v1.0.5](https://github.com/radixdlt/radix-engine-toolkit/releases/tag/v1.0.5) on Github \* Node: [v1.1.0](https://github.com/radixdlt/babylon-node/releases/tag/v1.1.0) on Github

App Building Tools: \* Gateway API: [ReDocly](https://radix-babylon-gateway-api.redoc.ly/) \| [Root URL](https://mainnet-gateway.radixdlt.com/) \| [Swagger](https://mainnet-gateway.radixdlt.com/swagger/index.html) \* dApp Toolkit: [1.4.3](https://www.npmjs.com/package/@radixdlt/radix-dapp-toolkit/v/1.0.0) on npm \* TypeScript Radix Engine Toolkit: [v1.0.3](https://www.npmjs.com/package/@radixdlt/radix-engine-toolkit/v/1.0.3) on npm \* ROLA Library for Node.js backends: [1.0.3](https://www.npmjs.com/package/@radixdlt/rola/v/1.0.3) on npm

Public Applications: \* Wallet: [Installation guide](https://wallet.radixdlt.com/) \* Connector Extension: [v1.3.4](https://github.com/radixdlt/connector-extension/releases/tag/v1.3.4) on Github \* Dashboard: [Mainnet](https://dashboard.radixdlt.com/) \| [Stokenet](https://stokenet-dashboard.radixdlt.com/) \* Mainnet Network ID: 1 (0x01) \* Stokenet Network ID: 2 (0x02)

## Changes from v1.0.1

### Second-precision Timestamp

Second-precision network timestamps are now available for Scrypto.

See the [rustdocs](https://docs.rs/scrypto/latest/scrypto/runtime/struct.Clock.html) of `Clock` for more.

### BLS12-381 and Keccak256 Cryptography

A new set of crypto APIs have been introduced. Using these APIs is much cheaper than doing the same computation within WASM.

For use guides, please refer to [Cryptography](../../reference/cryptography/index.md)

### Pool Blueprints Update

All native pool blueprints have been updated to use `PreciseDecimal` for internal computation. This significantly improves the accuracy of maths for all existing and new pools.

No interface has been changed.

### Validator Creation Fee Reduced

Not technically a Scrypto-related change, but it’s worth mentioning that the validator creation fee will be reduced to 100 USD once `Anemone` is activated.

### RESIM Improvements

Various enhancements to the `resim` CLI: - Show both the name and the symbol of a resource if available. - Make `address` optional for the `resim show` command - Check public and private keys provided to `resim set-default-account` - Support argument building for `FungibleBucket` and `NonFungibleBucket` - Fix the issue where `resim` doesn’t read the `.rpd` schema file correctly

### Scrypto Coverage Report

You can now run `scrypto coverage` to generate a coverage report of your Scrypto project.
