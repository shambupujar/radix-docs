---
title: "Overview"
---

# Overview

## Before running a node

Anyone can run a node and join it to the Radix Public Network.  However, before you jump in, it's important to understand a few things first!

### You do not need to run a node to use Radix

There is no need to run a node of your own in order to submit transactions or see information about things that are on the ledger. The Radix Wallet will, by default, use a free Gateway provided by the Radix Foundation, and you can freely use the <a href="https://dashboard.radixdlt.com">Dashboard</a> to investigate on-ledger stuff.

### There is no “mining” on Radix

Radix is a delegated proof-of-stake network. There’s no race to discover a magic hash, and spinning up a node won’t start earning you XRD.

### Only a subset of nodes participate in validation of transactions

Any node can be optionally registered as a validator, meaning that it will seek to be part of the consensus process which runs and commits new transactions. However, at each network epoch (about every 5 minutes), only the top 100 validators (ordered by amount of delegated stake) will constitute the active validator set. If you wish for your node to be a validator, you will have to amass a significant quantity of delegated stake.

Regardless of whether a node is in the validator set, it still keeps current with the network state, it can still accept transactions for submission and gossip them on, and it can still expose the Core API, which provides information about the current state.

## An Introduction to Radix Nodes

### What is a Radix Node?

The Radix Node (<a href="https://github.com/radixdlt/babylon-node" target="_blank">GitHub</a>) is the building block of Radix Network infrastructure. Nodes connect together to conduct consensus on transactions, maintain the ledger, and provide other useful functions.

Nodes can be deployed with various additional features sets. Typically, nodes are deployed for one of two distinct purposes:

- **Full Nodes**are nodes whose purpose is to handle queries for ledger state and history (e.g. check transaction status, list account transactions, etc). Typically full nodes are configured to maintain a complete transaction history, and have various optional additional indices turned on. They can also accept transaction submissions to the network.

- **Validator Nodes’** main goal is to collect enough stake to become Active Validators, participate in Consensus and collect the XRD rewards for doing so. At the same time, they can still provides full node’s query capabilities, depending on the configuration.

:::note
In case node’s built-in query capabilities turn out to be insufficient, we do provide a separate indexer software with a richer feature set: **Network Gateway**, which can be set up alongside Radix Node. Refer to the <a href="https://github.com/radixdlt/babylon-gateway">Network Gateway</a> section for details.
:::


All nodes on the Radix Network must maintain a complete ledger state, however there is a subset of nodes that, in addition to maintaining the complete state, actively participate in extending it (i.e. committing new transactions to the ledger). This process is called Consensus. Actors that participate in Consensus are called Active Validators and all of them constitute a Validator Set.

In order to become an Active Validator one must first<a href="/v1/docs/node-registering-as-a-validator" target="_blank">Register as a Validator</a>(after you’ve setup your node, of course)**.** Validators are represented by an on-ledger entity: Validator Component. Registration creates a new Validator Component entity and opens it to accept XRD token “stake” from delegators. A Validator Component can be (and practically always is) associated with a node on the network - a Validator Node.

A Validator that reaches the top 100 (by the amount of delegated stake) is included in the Validator Set for the given epoch and becomes an Active Validator. Their associated node is called Active Validator Node**.** All other Validators that have been Registered but didn’t make it to the top 100 are called Inactive Validators and their nodes Inactive Validator Nodes.





<img
src="https://cdn.document360.io/50e78792-5410-4ac9-aa43-4612b4d33953/Images/Documentation/validator_registration_flow.png" type="figure" />


<p>

The <em></em> lifecycle of a <em>Validator</em>
</p>







A complete overview of the network including different kinds of nodes has been presented on the diagram below:





<img
src="https://cdn.document360.io/50e78792-5410-4ac9-aa43-4612b4d33953/Images/Documentation/network_diagram.png" type="figure" />


Radix Network overview






### Next: [Node Installation and Basic Setup](node-setup/index.md)
