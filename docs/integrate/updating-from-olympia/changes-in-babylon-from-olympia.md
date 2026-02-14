---
title: "Changes in Babylon from Olympia"
---

# Changes in Babylon from Olympia

From an integration perspective, Babylon is very different from Olympia. The thing that will stay is the token balances: Babylon will start automatically when Olympia ends, with Olympia’s end state forming Babylon’s genesis. Token balances will be the same, controlled by the same keys, and validator stakes will stay. But integrating with Olympia requires a separation integration. Compared with Olympia, in Babylon:

- **The state model** is different:
  - State is stored under a key-value style account-model, in a tree-like structure - not a UTXO-model like in Olympia.
- **The addresses** are different:
  - They are encoded with Bech32m instead of Bech32 and use different human readable prefixes (HRPs). A Babylon account address will start with `account_rdx1_________`. The XRD address will also change.
  - Babylon supports both Secp256k1 **and** Ed25519 curves for key-pairs. We recommend Ed25519 to new integrators, as it has slightly cheaper fees, but you can safely continue to use Secp256k1 keys if you wish - as your Olympia keys will be Secp256k1.
  - The Radix Engine Toolkit will enable you to switch between Olympia Secp256k1 Account Addresses and Babylon Secp256k1 “virtual” Account Addresses, and derive a Babylon “virtual” Account Address from a Secp256k1 or Ed25519 public key.
- **The transaction model** is different:
  - The transaction is intent-based, supports offline construction, and does not contain UTXO identifiers - this makes it easy to construct and submit parallel transactions touching the same account (this was not possible in Olympia, where transactions would need to be serialized to prevent UTXO collisions).
  - The transaction header has a built-in epoch-based expiry mechanism, and will eventually support explicit cancellation.
  - Transaction replay prevention makes use of the transaction’s intent hash to guarantee the same intent cannot be committed twice.
  - Transaction construction uses the Radix Engine Toolkit, not the node, and can be done entirely offline.
- **The API surface** is different:
  - For exchange integrations involving fungible tokens and accounts, we believe the **Core API on the Node should be sufficient** - this means you should not need to run a Gateway.
  - We have designed a long-term support (LTS) subset of the Core API which is suitable for exchange integrations. It includes transaction submission, status and result reporting, account balance reads, and account fungible balance history.
- **The transaction construction flow** is different:
  - You will need to use the Radix Engine Toolkit for transaction construction.
  - The Radix Engine Toolkit will allow you to create your transaction, determine the necessary hash for you to sign, and create a notarized payload for submission to the network.
- **The “state version” in the transaction stream** will start again from 1:
  - You will likely want to store Babylon transaction records separately to Olympia transactions.
  - The epoch numbering however will not restart - the first Babylon epoch will be 1 more than the last Olympia epoch.
