---
title: "Non-Fungible Display"
---

# Non-Fungible Display

This article covers the recommendations for how “non-fungibles” (individual units of non-fungible resources) are displayed to a user, and covers display of their global id and their data.

You may also wish to see the [advice on displaying fungible and non-fungible resource addresses](../../reference/resource-address-display.md), for when you wish to display the address of a non-fungible resource without a specific local id.

## Non-fungible global id “address” display

Non-fungible resources are special in that each NFT “unit” also has its own unique identity. We call these individual units **non-fungibles**.

We can refer to a non-fungible by its unique **non-fungible global ID**. This ID has two parts:

- The **resource address** of the resource manager it belongs to
- A **non-fungible local ID** that is unique within that set of resources.

These two parts of the global ID are concatenated as a single string, separated by a colon, to make it easy for users to read and copy-paste them in a wallet, explorer, or exchange UI. When put together, a full non-fungible global ID (using a string type non-fungible local ID) looks something like:

:::note
`resource_1qlq38wvrvh5m4kaz6etaac4389qtuycnp89atc8acdfi:<ticket_19206>`
:::


This is the full global ID used to look up a specific non-fungible in, say, the Radix Dashboard; the non-fungible local ID `ticket_19206` alone is not enough. This is because, for example, there could be a different resource that also includes a `ticket_19206`. The local ID is only unique *within the set of non-fungibles of that specific non-fungible resource*.

Non-fungible local IDs are defined by the creator and are of one of a few supported types. All non-fungibles of a given non-fungible resource use the same type of local ID. Each type is indicated by a special local ID format:

| Type | Indicated by | Example local ID |
|----|----|----|
| String (`[A-Za-z0-9_]{1,64}`) | `< >` | `<my_cool_nft_32423>` |
| Integer (Any U64) | `# #` | `#203478274#` |
| Bytes (1 to 64 bytes, displayed in hexadecimal) | `[ ]` | `[deadbeef]` |
| RUID (32 random bytes) | `{ }` | `{0000000000000000-0000000000000000-0000000000000000-0000000000000000}` can be displayed shortened as `{0534…1422}` |

When a non-fungible is shown in the Radix Wallet, Dashboard or your dApps, it may often be shown as a member of the top-level resource (manager). In cases like this, it’s acceptable to identify the non-fungible to the user by its non-fungible local ID alone. It may even be presented to the user as its “ID” for simplicity. But when the user clicks a copy link for an individual non-fungible’s address, the whole global ID should be copied – combining the resource global ID and local ID as shown above. Unlike resource addresses, the non-fungible’s local ID portion should not generally be abbreviated since it may often be intended to be readable by users. An example display for a user might look like:

:::note[Dallas Mavericks Tickets]
(`reso…​8acdfi`)

:::note
12/25/22 - Seat 13B (`ticket_19206`) 12/25/22 - Seat 13C (`ticket_19207`)
:::

:::


However, if it is necessary to show a non-fungible global ID on its own (without the context of the associated resource manager), it is acceptable to display the address in abbreviated form like this (although this would be an unusual case):

:::note[Dallas Mavericks Tickets]
, 12/25/22 - Seat 13B (`reso…​8acdfi:<ticket_19206>`)
:::


The exception to showing local IDs in full is the RUID type of local ID. Since these are very long and not particularly human readable, it is acceptable to abbreviate them, using a 4…4 format. So for example, a non-fungible’s global ID might be shown – abbreviating both resource portion and local ID portion – as follows:

:::note
`reso…8acdfi:{0534…1422}`
:::


## Non-fungible data display

See [displaying non-fungible data](non-fungible-data-for-wallet-display.md).
