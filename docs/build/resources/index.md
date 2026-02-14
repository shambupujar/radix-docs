---
title: "Resources"
---

# Resources

Resources (sometimes referred to as tokens or assets) are special and are a crucial part of how Scrypto makes financial applications and transactions safer and more predictable. Resources are native to the Radix Engine, meaning the engine knows how resources are created and behaves, therefore enforces resource behaviors. For example, when resources are created they can only be moved from owner to owner, never copied or unintentionally destroyed or lost.

Resources must *always* be stored in *resource containers* – either a `Vault` or a `Bucket` – and Radix Engine enforces that no resource can ever be lost. In short, Radix Engine ensures that resources behave like "physical things" which is why they are used on Radix for all types of assets. Even the utility token of the Radix network, XRD, is a resource.







## Types of Resources

Scrypto offers two types of resources that developers can easily build: Fungible and NonFungible resources.







### Fungible Resources

A quantity of a fungible resources can be freely split into smaller quantities, and smaller quantities can be recombined. Typical tokens (including the XRD token), where no two tokens have an individual identity, are created as fungible resources. Example uses of fungible resources (but not limited to) include:

- Utility or governance tokens

- Stablecoins

- Fractionalized shares

- Liquidity provider tokens

- Tokenized representations of commodities

### NonFungible Resources

Non-fungible resources, each individual resource unit is uniquely addressable and not divisible. You can think of a non-fungible resource as a grouped set of individual tokens which have the same behavior, but where each unit is a standalone token with its own identity (and its own unique associated data). Here are some example use cases of non-fungible resources:

- Tickets to an event which have individual seat numbers

- Representations of unique numbered documents or products

- Deeds of ownership of property or other real assets

- Transactable unique debt positions or derivatives

## Resource Behaviors

Resources have [configurable behavior](resource-behaviors.md) which is intrinsically understood by the Radix engine and clearly communicated to consumers, such as wallets.

A developer is able to specify rules around things like who is able to mint more supply (if anyone), whether it requires special rights to deposit or withdraw it, and so forth. It is also possible to specify which of these rules can be changed after creation, and who is able to change those rules.

Please see the [Resource Creation](resource-creation-in-detail.md) and [Resource Behaviors](resource-behaviors.md) documentation for an explanation of how to define these rules, and examples of their usage.

## Resource Containers

Resources on Radix need to always be placed in some kind of resource containers. Resource containers, as the name suggest, hold resources. Each resource container can only hold one type of resource and the purpose of these resource containers are to properly move, secure, and account for the resources that are being transacted. There are two primary types of resource containers: `Bucket` and `Vault`, with specific types for `NonFungibleBucket`, `FungibleBucket`, `NonFungibleVault`, and `FungibleVault` accordingly.

- `Bucket` - Buckets are temporary containers and are used to move resources within a transaction; therefore, buckets can only exist in the duration of the transaction.

- `Vault` - Vaults are permanent containers where resources must live. Therefore, every transaction which use buckets to move resources must be transferred to a Vault by the end of a transaction.

We will go over in detail in a later section [Buckets and Vaults](buckets-and-vaults.md) and you can also see more details of the `Bucket` and `Vault` implementations in the Scrypto Rust docs:

- <a href="https://docs.rs/scrypto/latest/scrypto/blueprints/resource/struct.Bucket.html" target="_blank">scrypto::blueprints::resource::Bucket</a>

- <a href="https://docs.rs/scrypto/latest/scrypto/blueprints/resource/struct.Vault.html" target="_blank">scrypto::blueprints::resource::Vault</a>

## Scrypto Utilities

Scrypto offers a handful of utilities to conveniently create and manage resources.

- `ResourceBuilder` - The ResourceBuilder is used to create fungible and non-fungible resources.

- `ResourceManager` - When a resource is created, a ResourceManager is also created to manage and define resource behaviors.

We will go into more detail about the `ResourceBuilder` and `ResourceManager` in the next section [Resource Creation in Detail](resource-creation-in-detail.md).
