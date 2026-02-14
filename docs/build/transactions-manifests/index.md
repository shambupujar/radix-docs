---
title: "Transactions & Manifests"
---

# Transactions & Manifests

A manifest (also known as a “transaction manifest” or “intent manifest”) is the main part of each [intent](../dapp-transactions/transaction-overview.md) in a transaction.

## Overview

Manifests are human readable and composable. They make it possible to compose multiple actions to be executed atomically by describing a sequence of component calls and movements of resources between components. In short, full atomic composability becomes possible directly in transactions. Manifests can also describe the use of badges for authorization to components, payment of transaction fees, and checks on resources amounts to provide guaranteed results for the user.

Manifests are human-readable so that developers or client software (such as [the Radix Wallet](../../use/radix-wallet-overview.md)) can understand what they are signing. When it’s time to submit, the transaction manifest is translated into a binary representation and cryptographically signed to create a [final transaction](../dapp-transactions/transaction-overview.md) that may be efficiently sent to the network and processed by the Radix Engine.

## Structure

A manifest is a grouping of the following parts of an [intent core](../dapp-transactions/transaction-structure.md) (in a [transaction intent](../dapp-transactions/transaction-intents.md) or [subintent](../dapp-transactions/subintents.md)):

- [Manifest Instructions](manifest-instructions.md) which will be executed by the [Intent Processor](/docs/transaction-processor) in the Radix Engine

- Blobs (efficiently encoded byte payloads which can be passed into method/function calls)

- Zero or more<a href="/docs/intent-structure">child subintent</a>hashes

- \[System Transactions Only\] Preallocated addresses

These are combined with an intent header and optional message to form an intent core.

## Manifest Types

See:

- [Conforming Manifest Types](index.md) for details on how the wallet displays manifests.

- [dApp Transactions](../dapp-transactions/index.md) for examples and details on creating transactions, tailored towards dApp builders.
