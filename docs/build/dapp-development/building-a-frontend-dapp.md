---
title: "Building a Frontend dApp"
---

# Building a Frontend dApp

## Overview

A Pure Frontend dApp is the simplest kind of dApp. It has no server backend portion at all – it is a website that connects to a user’s Radix Wallet, gets data from the Radix Network, and proposes transactions to the wallet.

For an overview of dApp types on Radix, see [What is a dApp on Radix](application-stack.md)?

It’s useful to start with the big picture of the various tools available to you, and how they connect together. The **green blocks** below are built by you and the **blue blocks** are existing tools for you to make use of.







Your dApp website project will likely include the [Radix dApp Toolkit](dapp-toolkit.md), which provides a useful combined interface to a √ Connect Button, Wallet SDK, and Gateway SDK. These tools provide a seamless way to facilitate the interaction between the user and your dApp with the Radix Wallet.

Let’s break each specific elements within the Radix dApp Toolkit:

**The √ Connect Button** provides a common, recognizable, Radix-branded UI "button" element that allows your users to easily see that they can connect their Radix Wallet to your website, and provide a familiar experience in doing so.

**The Wallet SDK** is the workhorse for interacting with the Radix Wallet. It provides an interface for making requests to the wallet for various data held there for the user, including account addresses and more – if the user permits it. It also provides an interface for submitting transactions to the Radix Wallet, which then asks the user to review and submit it.

**The Gateway SDK** is how your dApp can see what’s happening on the network and what the state of things there is. A common pattern would be to ask the Gateway for the resources held in an account address provided to your dApp by the user’s wallet (in response to a Wallet SDK request). Your dApp might use that to show how many tokens they have of a given type to interact with your dApp.

In addition to this, your frontend dApp may also have an "on-ledger backend" portion on the Radix Network itself. For example, you can build your own powerful automation for assets as a **component**, written in Scrypto. Moreover, you can create assets and tokens of your own as "resources", too. With this set up, third parties may have existing components and resources of their own on the Radix Network that can interact with your frontend as well.

After you’ve built your website, components, and resources that make up your dApp, you will need a way for the Radix wallet to understand the relationship between each piece. To do this, you can [set up a dApp Definition account](dapp-definition-setup.md). The dApp Definition account provides an on-ledger unique identifier that each parts of your dApp can point to, to establish each other’s relationship. This provides your users a rich experience to interacting with your dApp.

When users interact with your dApp, your dApp interacts with its components (and/or components created by others) by building a [transaction manifest](../learning-step-by-step/create-and-use-transaction-manifests.md). These transaction manifests are composed of the user’s intent which describe how assets move between user accounts and one or more components to perform potentially complex and powerful action. The transaction manifest is then submitted to the Radix Wallet (via Wallet SDK) for the user to review and accept - confirming their intentions.

To get a feel for how these three parts of the dApp interact, imagine a simple dApp that presents a gumball machine to the user where they can insert XRD tokens, and receive GUM tokens in return.

**To create the dApp**, the developer does the following:

- Requests the creation of a **GUM token as a “resource”** from the Radix network, setting metadata on it like symbol (GUM), name, description, etc. that allow it to be displayed nicely in the Radix Wallet. (No code needed here.)

- Creates and deploys to the Radix Network a `GumballMachine` **component (in Scrypto)** that accepts XRD and returns GUM from an internal supply.

- Creates and hosts a **dApp Frontend website** that graphically displays how many gumballs are available and lets the user connect their Radix Wallet to buy them.

The user flow might look like this:

1.  **The user** loads up the dApp Frontend website in their browser. As part of loading, the website sends a query to the Radix Network (via a Gateway) to find out how many GUM tokens are held in the `GumballMachine` component’s internal vault. The website uses this to build its display of the gumball machine.

2.  **The user** clicks the √ Connect button in the corner of the website, which automatically brings up a request (specified by the website) in their Radix Wallet app for the addresses of any accounts that they might want to buy gumballs from. The user selects 3 accounts and approves.

3.  **The website** updates to show the user as connected, and shows an account selector menu where they can pick which of their 3 accounts they want to buy a gumball from right now. The website queries the XRD balances on the accounts and sees that one of them has no XRD to spend, and so this account is grayed out.

4.  **The user** picks an account and clicks a Buy Gumball button on the website.

5.  **The website** builds a transaction manifest stub that specifies that 1 XRD should be withdrawn from the user’s account, this should be deposited to a `buy_gumball` method of the `GumballMachine` component, and whatever it returns should be deposited back to the user’s account. This transaction manifest is passed to the user’s Radix Wallet.

6.  **The Radix Wallet** shows a friendly view of the transaction to the user, showing 1 XRD leaving their account and (according to a simulation of the result) 1 GUM entering their account at the end. The wallet automatically adds a small network fee payment to the transaction.

7.  **The user**, satisfied with what has been proposed, clicks Approve in their Radix Wallet and the transaction is swiftly signed (to authorize the withdrawal of 1 XRD) and submitted to the Radix Network, where it is accepted and the result committed to the ledger.

8.  The transaction successful, **the website** shows an amusing animation of a gumball being dispensed – and the user will now see the GUM token in their wallet.

With a very simple system, the dApp has now performed a real exchange of digital assets with the user!

## Pure Frontend dApp Walkthrough

To see first-hand how to build a pure frontend dApp with these tools, see the following walkthrough on building a simple "gumball machine" dApp, including a Scrypto-based component, and a simple website that connects to the Radix Wallet and Radix Network:

<a href="https://github.com/radixdlt/scrypto-examples/tree/main/full-stack/dapp-toolkit-gumball-machine" target="_blank">Continue to gumball machine walkthrough on GitHub</a>
