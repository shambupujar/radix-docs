---
title: "LTS Core API"
---

# LTS Core API

The Core API specification is [linked to here](https://radix-babylon-core-api.redoc.ly/).

The Core API is a JSON-RPC API on a Babylon node, conventionally exposed on port 3333. Each request to the Core API (except the) requires the network field, which requires you to enter the logical name of the network of the node, to ensure you are correctly configured. For debugging, you can query for that from the `/core/status/network-configuration` endpoint. The Typescript Core API SDK handles this for you.

In terms of API clients:

- We provide a Typescript Core API SDK on npm as [@radixdlt/babylon-core-api-sdk](https://www.npmjs.com/package/@radixdlt/babylon-core-api-sdk), with some [examples in the README](https://github.com/radixdlt/babylon-node/tree/main/sdk/typescript).
- *We don’t have current plans to provide Core API clients in other languages before mainnet launch*. You may be able to generate your own client from the Core API Open API schema, but many Open API generators are quite buggy, so it may be easier to write the models yourself.

Documentation on each endpoint is available on Redocly, through the [Core API specification link above](https://radix-babylon-core-api.redoc.ly/). We also provide worked examples of integrations below.

If there is functionality which you need and which is missing from the LTS Core API, please let us know and we may be able to add this.
