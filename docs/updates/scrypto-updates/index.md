---
title: "Scrypto Updates"
---

# Scrypto Updates

## Allowances

The [primary authorization pattern](../../build/authorization/index.md) of Radix is based around the use of badges to demonstrate the ability that an actor is permitted to perform a certain action. To avoid abuse and unintended privilege escalation, badges can not be "re-used" by anything except what the actor is explicitly presenting them to. However, there are certain scenarios under which it makes sense for an actor to enable a particular action within a transaction, without caring to know who actually performs the action.  This will be supported by the creation of allowances, which are limited-use badges usable by anything within the transaction.

For example, if a creator of an NFT wants to charge an amount every time someone wishes to transfer one of their tokens, they can set the withdrawal rules of their non-fungible resource to require a particular badge to be present in order to withdraw. They can then place the badge permitting the withdrawal into a component which charges 10 ZOMBO to produce an allowance which permits a single withdrawal of a single token. In order to transfer the NFT, the user's transaction must pass the component 10 ZOMBO in order to then be able to withdraw it and send it on to someone else.

## Nested/Grouped NFTs

Enable the ability for NFTs to contain other NFTs, or be linked such that they travel together. This enables an enormous host of interesting use cases, but requires careful design to avoid undesirable use patterns (for example, avoiding the ability to circumvent withdrawal rules by placing a restricted NFT into an unrestricted "container" NFT). Design thinking will be shared with the community for feedback as it develops.

## Upgradeable Blueprints

Upgradability of smart contracts has been a thorny problem since the dawn of Ethereum, and this milestone is about enabling upgradability which allows creators to select what level of upgradability they desire, while informing potential consumers about what things the creator has the ability to change. To avoid any chance of unwelcome surprises for consumers, this work will *not* result in already-deployed blueprints and components becoming retroactively upgradeable.
