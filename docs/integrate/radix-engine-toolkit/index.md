---
title: "Radix Engine Toolkit"
---

# Radix Engine Toolkit

:::note[Rust Radix Engine Toolkit Examples]
Example usage of the various Radix Engine Toolkit is provided in the [`experimental-examples` repository](https://github.com/radixdlt/experimental-examples/tree/main/radix-engine-toolkit).
:::



The Radix Engine Toolkit is a multi-language library that provides various Scrypto and Radix Engine types, functions, primitives, and concepts essential for building off-ledger applications in a particular language. If the low-level support of the Radix Engine Toolkit is not provided for a particular language then the development of off-ledger applications in that particular language is possible albeit difficult as different parts of the stack would need to be implemented by the author.

Radix Engine Toolkit wrappers are available in the following programming languages:

1.  TypeScript\[1\]
2.  Python
3.  Swift
4.  C#
5.  Kotlin

:::note[Rust Support]
The above list does not mention the Rust Radix Engine Toolkit for two reasons:

1.  The above is a list of the Radix Engine Toolkit *wrappers*. The Rust implementation is not a wrapper around any lower-level library.
2.  The objective of the Radix Engine Toolkit is to provide Scrypto and Radix Engine types, functions, primitives, and concepts to languages that do not have it; Rust already has an implementation in the form of the Scrypto and Radix Engine crates.
:::



## Functionality

The functionality provided by the Radix Engine Toolkit is limited to just off-ledger functionality. This means that the Radix Engine Toolkit can not be used for things such as querying the status of transactions or querying the account balance as they require knowledge of ledger state which the Radix Engine Toolkit does not have. However, the Radix Engine Toolkit can be used for things that do not require ledger state such as the construction of manifests and transactions and derivation of addresses.

The following is a list of the functionalities provided by the Radix Engine Toolkit:

- Transaction
  - Manifest Building
  - Construction
  - Compilation
  - Decompilation
  - Identifier Hashing
  - Static Validation
  - Address Extraction
- Execution Analysis
  - Transaction Types
- Derivation
  - Derivation of virtual account and identity addresses.
  - Olympia to Babylon account and resource address mapping.
  - Olympia address derivation.
  - Virtual signature non-fungible global IDs.
- Scrypto and Manifest SBOR
  - Decoding of SBOR payloads to string representations
  - (limited) Encoding of SBOR string representations.
- Events
  - Decoding of events emitted by native components into strongly typed models.
- Utils
  - Hashing

## Example Use Cases

The Radix Engine Toolkit and the Core/Gateway APIs are the two tools most non-Scrypto applications use and these two tools have different responsibilities and capabilities. The Radix Engine Toolkit is used for things that do not require ledger state while the Core and Gateway APIs are used when such ledger state is required. The following is a non-comprehensive table of examples of where the Radix Engine Toolkit and Core/Gateway APIs are used. It is meant to provide the reader with a rough idea about the start and end of the responsibilities of the Radix Engine Toolkit and the Core/Gateway APIs



| Tool | Example Use Case |
|------|------------------|
| **Radix Engine Toolkit** | Construction of manifests |
| **Radix Engine Toolkit** | Construction of Transactions |
| **Radix Engine Toolkit** | Signing of Transactions |
| **Core/Gateway API** | Submission of Transactions |
| **Core/Gateway API** | Checking of Transaction Status |
| **Core/Gateway API** | Streaming Transactions |
| **Core/Gateway API** | Getting the current Epoch for use in transaction construction |



The above comparison aside, the following list provides the reader with an idea of areas where the Radix Engine Toolkit can be used to help determine if the Radix Engine Toolkit is the right fit for them:

- When developing applications that need to be able to construct and sign transactions programmatically without the need to go through the wallet signing process. This may be needed by wallet developers, exchanges, custodians, bot developers, and other areas that rely on programmatic transactions. In a case like this, the Radix Engine Toolkit is often used in conjunction with either the Core or Gateway APIs.
- When developing frontend or backend services that need to understand SBOR, decode it, and present it in a human-readable way. One example of this may be an NFT marketplace that wishes to display the SBOR-encoded non-fungible data to users as human-readable data.
- When developing applications that need to be able to decompile transactions and show the manifest as well as the header and signature to users. One example of that would be dashboards and explorers which need to decompile transactions and display the manifest to the user.

Other use cases exist as well and they all revolve around the features in the [functionalities](index.md#functionality) section.

------------------------------------------------------------------------

\[1\] The TypeScript Radix Engine Toolkit is slightly different from the other toolkit wrappers and has a slightly different interface. More information about it can be found [here](https://github.com/radixdlt/typescript-radix-engine-toolkit).
