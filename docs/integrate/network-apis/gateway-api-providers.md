---
title: "Gateway API Providers"
---

# Gateway API Providers

The following is a list of known [Gateway API](index.md) providers.

:::note[This list is not vetted]
Inclusion in this list does *not* imply endorsement or guarantees of API data accuracy or stability. Please look at the individual integrator for more details, to see if they fits your needs. If you provide a Gateway API service and would like included here, please get in touch on Discord or at hello@radixdlt.com.
:::



### Radix Foundation

The Radix Foundation runs an IP rate-limited Gateway API, the **Foundation Gateway**.

The Foundation Gateway Service is IP rate limited, with rate limits designed only for a user browsing a front-end dApp (with a relatively light request burden, think no more than ~40 requests per page load) alongside using the connect button and their wallet. Front-end dApps will need to use the Gateway responsibly to maintain a good user experience.

The exact rate limits imposed by the Foundation Gateway are dependent on the endpoint you are hitting and are subject to occasional tweaking. If you are using the Foundation Gateway, and are concerned about hitting rate limits, you likely want to find another provider. In particular, if you are building a back-end with large or user-driven request profiles, you will need to consider alternatives. You may get away with using the Core API and running your own Node, or using a Node RPC provider. Or, if you need the Gateway API, finding a Gateway API provider, or consider running them yourself.

The rate-limited Foundation Gateway is available at: \* Mainnet: <https://mainnet.radixdlt.com> ([Swagger](https://mainnet.radixdlt.com/swagger/)) \* Stokenet: <https://stokenet.radixdlt.com> ([Swagger](https://stokenet.radixdlt.com/swagger/))

### RadixAPI

**Key Links: [Website](https://radixapi.net/) \| [Telegram Channel](https://t.me/radixapi)**

[RadixAPI](https://radixapi.net/) offer Gateway access as well as additional endpoints / functionality covering lots of integrato and dApp use cases. For more detail, see: \* Their [Pricing](https://radixapi.net/pricing) and [Service Docs](https://docs.radixapi.net/) \* Their Swagger [API docs](https://api.radixapi.net/docs) - not that this doesn’t properly list the Gateway endpoints. All Gateway endpoints are supported under `/v1/gateway/mainnet/...`

### NowNodes

[NowNodes](https://nownodes.io/nodes) has added support for the Radix Gateway API (at `xrd-gateway.nownodes.io`).

Their [pricing plans are available here](https://nownodes.io/pricing) and include the option of a month-long free trial.

### Find a partner

Community dApps have partnered together to reduce the overhead of running their own Gateway. It’s worth asking in the community for more details.

### Run your own

[Running a gateway](/v1/docs/run-infrastructure) is relatively complex. It required more resources than a node, and more infrastructure. It also includes running a node, and will require keeping the infrastructure updated regularly along with the network’s protocol updates.
