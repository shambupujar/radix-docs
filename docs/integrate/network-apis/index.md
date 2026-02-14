---
title: "Network APIs"
---

# Network APIs

## Main APIs

Radix currently offers a couple of few main APIs, targeted to different use cases.

### Core API

**Key Links:** <a href="https://radix-babylon-core-api.redoc.ly/"><strong>Full Core API Documentation</strong></a> **\|** <a href="/v1/docs/core-api-providers"><strong>Core API Providers</strong></a> **\|** <a href="https://www.npmjs.com/package/@radixdlt/babylon-core-api-sdk"><strong>Typescript Core API SDK</strong></a>

The Core API provides low-level and high-level abstractions, and includes:

- The long-term support “LTS” sub-api, designed for financial integrators.

- A usefully-abstracted but not comprehensive view of the current ledger state. This includes account balances, and other key native components.

- Transaction preview, submission + status flow

- A committed transaction stream, at varying abstraction levels

The Core API is exposed by [Radix nodes](/v1/docs/run-infrastructure). It is predominantly intended as a private API, but there [are some RPC providers offering it](core-api-providers.md) for public integrations.

### Gateway API

**Key Links:** <a href="https://radix-babylon-gateway-api.redoc.ly/"><strong>Full Gateway API Documentation</strong></a> **\|** <a href="/v1/docs/gateway-api-providers"><strong>Gateway API Providers</strong></a> **\|** <a href="https://www.npmjs.com/package/@radixdlt/babylon-gateway-api-sdk"><strong>Typescript Gateway API SDK</strong></a>

The Gateway API provides low-level and high-level abstractions, but is primarily intended for use by dApp website frontends and general network clients like dashboards. It can be used for:

- Reading the state of accounts or other components

- Transaction preview, submission + status flow; including managing of resubmissions on behalf of users

- A filterable committed transaction history

- Queries of historic ledger state

The Gateway API is exposed by the [Network Gateway](/v1/docs/run-infrastructure), and provided by [Gateway API Providers](gateway-api-providers.md).

### Engine State API

**Key Links:** <a href="https://radix-babylon-engine-state-api.redoc.ly/"><strong>Full Engine State API Documentation</strong></a>

The Engine State API allows for accessing the complete current state of the Engine ledger, at the abstraction of the engine.

- Compared to the Core API, it is fully comprehensive, but possibly harder to use, but has fewer, more general endpoints.

- It can be useful for some dApp developers looking to read current application state without running a Gateway, and at a cleaner abstraction level.

- It is useful for integrators to explore how the engine thinks about state.

The Engine State API is exposed by [Radix nodes](/v1/docs/run-infrastructure). The node has to be explicitly configured to enable this API. Details on how to configure the node <a href="https://github.com/radixdlt/babylon-node/releases/tag/v1.1.3.1">can be found in the v1.1.3.1 release notes</a>.

------------------------------------------------------------------------

## Community APIs

If the Core and Gateway APIs don’t currently meet your needs, members of the community have built their own APIs, which may have just the endpoint you’re looking for.

:::note
These are unvetted



Inclusion in this list does *not* imply endorsement or make any claims of correctness or stability. Please look at the individual service for more details, and judge for yourself if it fits your needs.

If you are are responsible for providing an API service and would like it to be included here, please get in touch on Discord or at hello@radixdlt.com.
:::


### RadixAPI

**Key Links:** <a href="https://radixapi.net/"><strong>Website</strong></a> **\|** <a href="https://t.me/radixapi"><strong>Telegram Channel</strong></a>

<a href="https://radixapi.net/">RadixAPI</a> provides additional <a href="https://docs.radixapi.net/">endpoints and functionality</a> to the official Gateway API to make it easier to obtain specific data. These include:

- Creating and verifying [ROLA](../../reference/rola-radix-off-ledger-auth.md) challenges

- Finding the owners of a fungible or non fungible resource

- Finding the owners of validator stake and pool unit tokens

- Receiving all transaction data via WebSocket

- …and more

------------------------------------------------------------------------

## Other APIs

### System API

**Key Links:** <a href="https://radix-babylon-system-api.redoc.ly/"><strong>Full System API Documentation</strong></a>

Radix Nodes also expose the System API, which can be used for debugging the node. Its <a href="https://radix-babylon-system-api.redoc.ly/">documentation is available on ReDocly here</a>.
