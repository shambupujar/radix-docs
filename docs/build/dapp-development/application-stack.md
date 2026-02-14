---
title: "dApp Development"
---

# dApp Development

## Introduction

The emerging field of Web3 (and, closely related, decentralized finance or “DeFi”) offers exciting opportunities for developers to build a new class of decentralized applications (or “dApps”) around meaningful and valuable digital assets and identity. The concept of the Web3 model is that users stay in control of what they own, who they are, what they share, and what they choose to bring with them to applications – and application builders like you create powerful new ways for those users and what they own to interact.

Whether we’re talking about a finance application that previously would have required access to trans-national banking infrastructure, or a game where users can take their characters and loot with them when they log off – Web3 and DeFi dApps should be able to simply do things better, and do things that were never possible before.

Much of this potential, however, has not yet been made practically accessible to developers due to shortcomings in existing Web3 and DeFi platforms.

Radix offers a decentralized platform and a set of tools that gives you the most purpose-built place to create this new generation of Web3 dApps. On Radix, digital assets are easy to create and manage, smart contract logic is intuitive to write and make safe, and the Radix Wallet enables seamless and powerful connections to users and their assets through your web interface.

To use the Radix platform and its tools, it’s important to understand the unique structure of a Radix dApp and how the pieces fit together.

## The Anatomy of a Radix dApp

Building your dApp means more than just building a simple website. That website will need to connect to users’ Radix Wallet, and it will likely want to connect to a Gateway for the Radix Network to get information on the state of accounts, assets, and smart contracts. You may want to build your own smart contract automation on the Radix Network to sit behind your web interface – or understand how to interact with smart contracts already deployed there by other developers. And like a traditional Web2 app, you may want a server-based portion of your application for things like user management or specialized business logic.

To understand the anatomy of a Radix dApp, we can split them into two broad categories: the **pure frontend dApp**, and the **full stack dApp**.

### Pure Frontend dApps

If you’ve previously built dApps on Ethereum, this type might be somewhat familiar; something like Uniswap would be in this category. If you’re new to Web3 and DeFi, this might seem a little strange.

Because decentralized ledger networks like Ethereum and Radix can store and run powerful asset automation in the form of “smart contracts”, a web application may simply provide a UI to those smart contracts and not use a traditional server-side backend at all. Of course such a dApp can have no traditional server-side user management. It can be thought of as just a program that the user runs locally in their web browser that talks to the wallet and the network only.

On Radix, this type of dApp is structured like so:







![pure_frontend_dapp.png](/img/pure_frontend_dapp.png)

**The portions in blue are existing things from Radix that you can make use of. The portions in green are your responsibility as a dApp developer.**

There are three major parts to this type of dApp:

1.  **The Radix Wallet** - You, the developer, don’t have to build anything at all here. It’s the place where users control their assets, and where they’ll give approval for things whenever the dApp wants to interact with their accounts, personas (logins + personal data), or assets.

2.  **The dApp Frontend** - This is your dApps’s user interface. It could be very lightweight (a simple UI) or quite heavy (a game built off-chain and is interacting with the Radix Network for in-game asset ownership). The Radix dApp Toolkit which provides a useful combined interface to a √ Connect Button, Wallet SDK, and Gateway SDK which makes it easy to handle user log ins in to your dApp, retrieve information to your dApp from their wallet, and automatically provide the user with seamless communication between the dApp and the wallet.

3.  **The Radix Network** - This is where all accounts and assets live. It is also where transactions can interact with smart contracts, which on Radix are called “components”. You might write your own components in Scrypto to run in that shared trustless network environment – or you might choose to interact with components deployed by others there. Your dApp may also want to access data about the current state of the network - things like how many tokens are in a given account, or what the status of a given component is. dApps can query the network using a Gateway endpoint.

If you’re thinking about building a pure frontend dApp, continue to [Building a Pure Frontend dApp section](building-a-frontend-dapp.md).

### Full Stack dApps

This type of dApp keeps everything we had in the pure frontend dApp, but introduces a traditional server-side backend for more complex applications and user-personalized experiences. Think of it as combining the richness of the best of Web2 applications with the Web3 superpowers of digital assets and personal control of data.

This type of dApp on Radix is structured like so:







![full_stack_dapp.png](/img/full_stack_dapp.png)

The new **dApp backend** part of the system has two new functions that interact with the Radix Network:

- **User Management** - This is where you keep track of users that login to your system so you can personalize their experience. Radix’s Persona logins allow simple one-tap no-password logins using the Radix Wallet with on-ledger Identities. ROLA (Radix Off-Ledger Authentication) makes this easy.

- **Asset Management** - This is something you might want if your dApp needs to directly submit transactions to the network itself rather than proposing transactions to a user’s Radix Wallet to sign and submit. Simple examples of this would be managing the dApps’ own internal reserves of tokens or configuring its components. Once again the Gateway SDK makes it simple to interact with a network Gateway for either queries needed by the backend, or to submit such transactions.

If you come from the Web2 world, this type of dApp may feel more familiar. It’s Web2, but with new superpowers:

- Your application can seamlessly interact with digital assets and asset-oriented smart contract logic on the Radix Network to create more valuable experiences and connections to other applications.

- Users have a secure, no-password mechanism to login using the Radix Wallet.

- Rather than having to store user personal data in your own database (both dangerous and objectionable to users), access personal data directly from the user’s Radix Wallet – with their permission, as needed.

If you’re ready to get started creating dApps on Radix, continue on to [Building your first Scrypto Component](../../integrate/radix-engine-toolkit/installation.md) and then [Building a Pure Frontend dApp](building-a-frontend-dapp.md) and [Building a Full System dApp](building-a-full-stack-dapp.md).
