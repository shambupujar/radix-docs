---
title: "State Model Introduction"
---

# State Model Introduction

Ledger data is stored in small versioned chunks called substates. **Substates** contain programmatic information which is encoded in a custom encoding called “**SBOR**” (Scrypto binary object representation). This can be converted to/from JSON with the Radix Engine Toolkit.

Substates are stored under objects called **entities**. Entities have addresses - for example, an Account has an address starting `account_rdx1___`. Entities which can be accessed directly are called **global** entities. Some entities are owned by other entities - these entities are called **internal**, and their addresses always start with the prefix `internal_`.

Some important entities are as follows:

## Resources / Resource Managers

Resource Managers are definitions of “resources” - which are the Radix ledger’s representation of assets. All resources have a global entity address starting `resource_`.

Resources can be “**fungible**” or “**non-fungible**”. Fungible resources have a **divisibility** which by default is in units of 10-18 but can be 10-n for some other integer 0 \<= n \<= 18. Resource quantities are represented using Decimal numbers (fixed point), unlike Olympia and most other networks where whole numbers are always used. That is, if an account has 11.5 XRD in it, it will be seen as 11.5 XRD in the API, not as 11500000000000000000 XRD subunits.

Non-fungible resources have a **non-fungible id type** - one of:

- Number - displayed as `#123#`
- String - displayed as `<name>`
- Bytes - displayed in hex as `[deadbeef]`
- UUID - displayed as `{b36f5b3f-835b-406c-980f-7788d8f13c1b}`

Non-fungible resources also have a schema for data which is attached against each non-fungible id.

## Vaults

Vaults store resources on ledger. They are always owned by another entity. They have an internal entity address starting `internal_vault_`.

## Accounts

Accounts are used by users to store resources - and expose methods that allow resources to be deposited to them. Global accounts have an address starting `account_`.

Whilst accounts can be created like any other component, most accounts start as a **virtual account**, associated with a public key, but not yet created on ledger. When a deposit is made (or they are otherwise first interacted with), a small fee is paid and the account is instantiated, with the public key as the controller of the account.

Note that accounts can have their ownership rules updated by their owner. So even virtual accounts which start being controlled by the corresponding key pair may be changed to no longer be controlled by that key pair.

In particular, accounts can turn into smart accounts ([see RadFi](https://www.radixdlt.com/radfi)), by turning them into “account-owner-badge-controlled” and depositing that badge into an access controller - this allows complex multi-factor controls, and allows for the keys to be changed. Most accounts created by users will eventually end up as smart accounts.

## Packages and Components

DApps have their code deployed in Packages. These packages can be instantiated as Components, and can be interacted with in the manifest just like accounts.

All packages have a global entity address starting `package_`.

In fact, Accounts actually are components - although they use a “native” package, built into the Radix Engine.
