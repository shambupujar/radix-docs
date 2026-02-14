---
title: "Running Infrastructure"
---

# Running Infrastructure

The infrastructure that underpins the Radix Network comes from a decentralized community that runs two types of software:

A **Core Node** is a direct participant in the Radix Network. The node can be deployed in different configurations to perform the role of a validator, synchronize the state of the network to offer data to clients, or push new transactions to the network for processing. The node exposes the Core API for reading low-level ledger state and submitting transactions. You can find more about running a node in the [Node guide](overview.md).

A **Network Gateway** does not directly connect to the Radix Network, but makes use of one or more Core Nodes and uses the Core API to interface to the network. A Gateway acts as a point of entry into the network for typical clients, serving requests about the ledger state and facilitating easy transaction building and submission onto the network. The Radix Wallet and Radix Dashboard connect to Gateways run by the Radix team that will also serve other requests publicly (at limited rate). But anyone may run a Gateway, and application developers are encouraged to do so to service their own application needs in production. You can find more about Network Gateways in the the [Network Gateway guide](network-gateway/index.md).
