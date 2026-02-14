---
title: "Asset-Oriented"
---

# Asset-Oriented

The entire Radix stack—from the execution environment, to the programming language, to the transaction model, to the wallet—is built to support the safe creation, storage, and interaction with native assets, which we call **resources**.

Resources are a first-class primitive in Radix, with guaranteed behaviors that are provided by the system, and powerful customizations available to developers. Resources intuitively follow the same behavior as real-world physical objects, and are transacted with in a physical manner. Resources can be placed in buckets and passed around or returned from a smart contract, just the same as you would with an integer or a string.

As we'll see in a later section, the transaction model is built around the orchestration of moving resources around between on-ledger components, in a way that the end-user can understand the consequences of signing a transaction, with the ability to easily add user-defined guarantees to outcomes.

Because resources are defined by the system and developers must specify the rules under which things like minting can occur, off-ledger clients like wallets and explorers can look at a given resource on-ledger and know things about how it behaves—without having to read any smart contract code—and notify users appropriately.

If you have developed on Ethereum-alikes where tokens are simply smart contracts which meet an interface standard, you are probably accustomed to baking logic directly into the code for your tokens. Programming doesn't work like that on Radix...business logic is strictly separate from the assets themselves, and you'll need to retrain your brain a bit. You'll be glad you did.
