---
title: "Metadata"
---

# Metadata

Public networks like Ethereum and Radix offer a public commons where an unlimited variety of digital assets can be owned and transacted. [dApps, which are made of a combination of traditional websites and servers and on-network smart contract logic](../setting-up-for-development.md), bring these assets to life.

To make these assets and dApps meaningful and understandable to humans, we need some form of descriptive metadata.

On Ethereum, the ERC-20 token smart contract standard includes functions that return things like the token’s "name" and "symbol". A wallet can use these functions to get metadata allowing more informative display of tokens. However, this approach of having metadata fields set at a smart contract level (like the ERC-20 standard) is highly constraining. For example, it may make no sense for some kinds of tokens to have a "symbol". Additionally, there will certainly be new metadata fields we can apply for tokens or NFT which are useful for specific application purposes. This is not possible for ERC-20 token smart contracts without having to deploy an entirely new smart contract with the additional metadata fields.

Radix recognizes this need for metadata and makes it a universal platform feature. On Radix, creators of entities may specify specific access rules for who may modify metadata (or indeed if it may be changed at all). It is strongly recommended that creators retain the ability to update metadata so that they can take advantage of new standards in the future, or update metadata over the lifecycle of the application. This allows for entities on the Radix Network – such as Resources, Components, and Packages – have metadata set on them directly with flexibility. Radix does not limit what fields may be used. Developers may define and populate metadata fields on entities as they wish.

However, the need for standardization of metadata usage is highly desirable. Standardization of metadata can enable a client software (like the Radix Wallet), third party integrations, and dashboards to display tokens and NFTs much more richly and consistently. As a result, they can offer useful features that brings about a delightful user experience and interface by relying on the consistent use of metadata.

Going further, metadata is useful beyond just on-network entities. The full description of a Radix dApp typically includes not just a collection of resources and components on the Radix network, but also a website that hosts the dApp’s frontend. Below describes our current thinking in how metadata should be standardized.

## The Radix Wallet and Metadata Standards

The creators of the Radix Wallet propose a set of optional but strongly suggested standards of metadata usage for the Radix community to adopt as a starting point.

The Radix Wallet will be a champion consumer of these standards. Adopting these standards with your resources and dApps means that those things will enjoy the best possible presentation in the Radix Wallet - along with other clients and services that adopt similar rules of metadata presentation.

Resources and dApps that do not adhere to these standards will of course always still appear in the Radix Wallet. Whatever metadata is present will still be available for the user to see. But the Radix Wallet will look for metadata fields like "name" and "symbol" and treat those pieces of metadata specially.

The way the Radix Wallet make use of these standards may serve as a pattern for the usage by other clients.

There are two essential kinds of metadata in this standard:

- [Metadata that is set for special display in the wallet](metadata-for-wallet-display.md)

- [Metadata that allows the wallet to associate and verify the various parts of a dApp](metadata-for-verification.md)
