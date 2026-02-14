---
title: "Address Description"
---

# Address Description

:::note
**>
Redirect!

**

This page should redirect to <a href="/v1/docs/concepts-addresses">Addresses</a>. Please click <a href="/v1/docs/concepts-addresses">Addresses</a>to go to the correct page.
:::


## High Level Overview

Radix Engine addresses are <a href="https://github.com/bitcoin/bips/blob/master/bip-0350.mediawiki" target="_blank">Bech32m</a> encoded, where they are made up of a Human Readable Part (HRP), separator, and a base32m encoded data part which includes a 6 character checksum of the HRP and data.







The human readable part is made up of two specifiers that are separated by an underscore ("\_"). These are:

- **Entity Specifier**: Specifies the type of entity that this address is for. As an example, in the case of the address being used to address an account component, the entity specifier would be "account". This makes it clear at first glance what the address is meant to be used for.

- **Network Specifier**: Specifies the network that the address is used for. This helps distinguish mainnet address from stokenet address, and so on; making it clear what network the address is use for.

The use of the Bech32m addressing scheme comes with a number of benefits:

- All addresses are now checksummed and therefore typographical errors can be detected and corrected.

- The entity specifier makes it clear what the address is meant to represent.

## Encoded Data

The data encoded in the Bech32m address is the byte representation of the address, which is an array of 30 bytes that is made up of two main parts:

1.  **Entity Byte**: This is the first byte in the address and it defines the type of entity being addressed.

2.  **Address Bytes**: These are the remaining 29 bytes in the array and they are the address of the entity.







The supported entity types and their entity byte representation are given in <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/main/radix-common/src/types/entity_type.rs" target="_blank">entity_type.rs</a>.

The byte-representation of addresses is lower-level concept and is not something that you will need to use on day-to-day basis.

## Entity Specifiers

Entity specifiers are the first part of the Bech32m HRPs used in Scrypto, they are used to specify the type of entity being addressed in a human readable way.

For example, `account_` or `resource_`. Any entity specifier starting with `internal_` is of a non-global "internal" entity, and can’t be interacted with directly, aside from very specific instances, such as vault recalls/freezes.

A full list of entity specifiers are given in <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/main/radix-common/src/address/hrpset.rs" target="_blank">hrpset.rs</a>.

## Network Specifiers

The address HRP contains a network specifier which is used to specify which network the entity is on. The table below contains all of the relevant network specifiers:



|                                |                   |
|:-------------------------------|:------------------|
| Network Name                   | Network Specifier |
| Mainnet                        | `rdx`             |
| Local Simulator                | `sim`             |
| Testnet with hex id `n`        | `tdx_n_`          |
| Stokenet (main public testnet) | `tdx_2_`          |



## Display of Resource Addresses and Non-Fungibles

Please see the Standards section for recommendations on [displaying resource addresses](resource-address-display.md) and [displaying non-fungibles](../build/resources/non-fungible-display.md) in UIs.
