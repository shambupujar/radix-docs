---
title: "Infrastructure & APIs"
---

# Infrastructure & APIs

## Babylon Nodes

The Babylon Radix Network is formed of [Babylon Nodes](https://github.com/radixdlt/babylon-node), connected into a Network.

Nodes run as a Java service, wrapping a natively-compiled core, written in Rust. This core includes the Babylon Radix Engine, which runs transactions, and state ledger storage, in Rocks DB.

The node’s APIs are:

- **Core API** - exposes transaction and state information from the node.
- **System API** - exposes information about system health and connections.
- **Prometheus API** - exposes metrics from the node in prometheus format.

[Documentation on Babylon Network APIs can be found here.](../../integrate/network-apis/index.md)

### Exchanges

For most exchanges, the [LTS sub-section **Core API** of a node](https://radix-babylon-core-api.redoc.ly/#tag/LTS) should be sufficient, and offers:

- Transaction Submission
- Transaction Status
- Streaming of committed transaction outcomes, including fungible balance changes
- Streaming of committed transaction outcomes, filtered to an individual account
- Reading of current account balance for 1 or all resources.

Exchanges will need to run their own Babylon full node/s. Documentation on [running a Babylon node may be found here](../../run/running-infrastructure.md).

## Network Gateway

Wallets and Dashboards use the [**Gateway API**](../../integrate/network-apis/index.md#gateway-api), which offers more complex APIs, which allow for more indexing and lookup of historic ledger state.

Running a Gateway is more expensive than a Babylon full node. Documentation on [running a Network Gateway can be found here](../../run/network-gateway/index.md)
