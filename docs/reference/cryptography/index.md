---
title: "Cryptography"
---

# Cryptography

Scrypto provides a set of precompiled cryptographic primitives, which are executed natively (rather than within a WASM Virtual Machine) to reduce execution costs. Those primitives are implemented in a dedicated CryptoUtils module.

At the moment, the supported algorithms are:

- [**Keccak256**](keccak256.md)

- [**BLS12-381**](bls12-381.md)

:::note
Please note that CryptoUtils is only available after Anemone protocol update.
:::

