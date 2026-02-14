---
title: "Resource Address Display"
---

# Resource Address Display

All types of assets issued on the Radix Network take the form of resources. This article covers the recommendations for how fungible and non-fungible resource addresses are displayed to the user, in websites and front-end applications.

You may also wish to read the specific guide on [displaying individual non-fungible global ids](../build/resources/non-fungible-display.md).

## Shortened display of Resource Addresses

Resources come in two kinds: **fungible** and **non-fungible**. By their nature, they function somewhat differently, and they are addressed differently.

Resources – whether fungibles (tokens) or non-fungibles (NFTs) – are defined by their resource manager. This is the thing that holds the behaviors, properties, and metadata that apply to all of the tokens and NFTs of that type.

We can refer to a resource (or its resource manager) by its unique **resource address**, which is generated automatically by the system.

A resource address looks something like this (see the [addresses](/v1/docs/addresses) article for full details): \> `resource_rdx1t4upr78guuapv5ept7d7ptekk9mqhy605zgms33mcszen8l9fac8vf`

As with all entity addresses, when displaying them for users, developers should abbreviate them in a consistent way. The standard is to abbreviate using the first 4 and last 6 characters separated by an ellipsis (4…​6). For example, a friendly list of resources for a user might show something like this:

:::note
Dallas Mavericks Tickets (`reso…​8acdfi`)
:::


But of course, when a user clicks a copy link for a resource address (even if abbreviated), the whole address should be always copied.

Any resource, fungible or non-fungible, may have metadata set on its resource manager. Metadata is a key-value store, with keys always being strings, and values being one of a set number of types. Metadata is where the creator can specify things like the name and symbol of a resource, and have it displayed in a wallet or explorer. Ultimately anything goes for metadata, but a standard set of recommended standards for metadata are provided, which the Radix Wallet adopts.

## Special Resource Classifications

The Radix Wallet, Dashboard, and dApps may show other kinds of resources, like “badges” or “pool units”. These are just special classifications of fungible or non-fungible resources, and so they aren’t addressed any differently than the above. The wallet or dashboard will be able to identify them with [special metadata](../build/metadata/metadata-for-wallet-display.md), and the Gateway may make it easy to view these special classifications for convenience.
