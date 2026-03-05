---
title: "Curves, Keys & Signatures"
---

# Curves, Keys & Signatures

The Babylon Radix network supports **ECDSA Secp256k1** and **Ed25519** for accounts and transaction signing.

The Babylon Radix network uses **Blake2b-256** as its primary hashing mechanism - but integrators should not need to use Blake2b themselves for transaction signing. Instead, the (offline) Radix Engine Toolkit provides you with the hash to sign.

If using **Secp256k1**: \* Signatures should be serialized as recoverable signatures of 65 bytes, with the recovery byte first, as: v \|\| r \|\| s \* There isn’t a de-facto convention for serialization of compact Secp256k1 signatures. \* On Olympia, DER/ASN.1 was used - the above format for Babylon is different - and more compact. \* Note that some libraries (such as libsecp256k1) have their own compact serialization and a few serialize it as reverse(r) \|\| reverse(s) \|\| v - an [example of the conversion of this format into the Radix format is here](https://gist.github.com/0xOmarA/01184ff98b155254392d277d753932ff) and we have some test vectors here for optionally testing your serialization.

- The public key is encoded as the standard 33-byte encoding for compressed Secp256k1 public keys (X coordinate and the sign byte)

If using **Ed25519**:

- Note that the message you sign will be the relevant transaction hash. As part of signing, Ed25519 will first use SHA-512 on this hash before signing with Curve25519. Typically this will happen implicitly, but some implementations require you using SHA-512 manually first.
- The signature is encoded as the standard 64-byte encoding for Ed25519 signatures.
- The public key is encoded as the standard 32-byte encoding for Ed25519 public keys.

We have some [test vectors here for verification](https://gist.github.com/0xOmarA/afcf19a09cb400d26cf11dafc03d1c53) of public key and signature serialization.
