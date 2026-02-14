---
title: "Integrate with Radix FAQs"
---

# Integrate with Radix FAQs

## Using HD derivation compatible with the official Radix Wallet

If you wish to see accounts in the official Radix Wallet, you will need to derive the account addresses using the same derivation scheme from a seed phrase. This uses SLIP-10, as per [the RustDoc here](https://github.com/radixdlt/wallet-compatible-derivation/blob/e27de534a305561b1d7a9bbf8bc6c03c066d5425/crates/wallet_compatible_derivation/src/account_path.rs#L3).

A full reference implementation for educational purposes is available here: <https://github.com/radixdlt/wallet-compatible-derivation>

## Transitioning from the Olympia Javascript SDK

If you’re currently using Radix Olympia Javascript libraries for your HD derivation such as [@radixdlt/account](https://www.npmjs.com/package/@radixdlt/account), you can convert the in-memory private keys generated this way using the following:

``` rust
// Assuming you have these in scope:
const hdMasterSeed = //...
const derivationPath = //...
// Then the following generates a Babylon Private Key for in-memory signing:
const privateKey = PrivateKey.EcdsaSecp256k1(hdMasterSeed.masterNode().derive(derivationPath).privateKey.toString());
```

## Compiling the node from source

If you wish to compile the node from source, there is [some documentation here, under the RCnet-V1.0 release notes](https://github.com/radixdlt/babylon-node/releases/tag/rcnet-v1-c6360105d).
