---
title: "Metadata for Verification"
---

# Metadata for Verification

## Introduction

An important aspect of Radix metadata standards is the concept of a **dApp Definition**. This is an account which **acts as the unique on-ledger identifier for a decentralized application**.

The dApp definition provides information about the dApp, and is a hub to establish trusted two-way links with other entities (resources, components and packages) and websites which form part of the dApp. This allows the Radix wallet to give appropriate guidance to the user, for example by telling the user the dApps they are interacting with during transaction signing.

There is a <a href="https://console.radixdlt.com/configure-metadata">tool on the developer console</a> to help with setting up and validating the entity metadata. See the [dApp Definition Setup Guide](../dapp-development/dapp-definition-setup.md) for more information.

The resolved links are returned by the <a href="https://radix-babylon-gateway-api.redoc.ly/#operation/StateEntityDetails">/state/entity/details endpoint</a> on the [Gateway API](../../integrate/network-apis/index.md).

## Overview

The dApp definition account forms the “hub” in a hub-and-spoke model. It acts as a container for metadata, and also for different types of links, discussed in more depth below.

- **Direct Links** are links between a dApp and an entity, configured at each end with metadata.

- **Origin Links** are links between a dApp definition and an https origin. On the dApp definition side it is configured by metadata, and on the origin side it is configured with a `/.well-known/radix.json` file hosted at the root.

- **Blueprint Links** are indirect links between a dApp definition and all components instantiated from an approved blueprint.

- **Partner Links** are links between two different dApp definition accounts, configured at each end with metadata.

- The **Primary Locker** is a link from a dApp definition to a single [account locker](../native-blueprints/locker.md), and used by the wallet to auto-discover claims for the user’s accounts for dApps they have previously interacted with.



![image(76).png](/img/image-76-.png)

## Metadata Standards for Verification

The following details the various fields of metadata that should be configured on your on-ledger entities that make up your dApp – including the dApp Definition “hub”, and the various resource, component, and package “spokes”.

### dApp Definition Accounts

To start, the dApp Definition account is configured with information metadata, according to the [Metadata Standards for Wallet Display](metadata-for-wallet-display.md):

- The `name` field should be set to a `String`

- The `description` field should be set to a `String`

- The `icon_url` field should be set to a `Url`

- The `tags` field should be set to a `String[]`

The following metadata entries should then be set for verification purposes:



<table>
<colgroup>
<col />
<col />
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Metadata field</td>
<td>Type</td>
<td>Contents</td>
<td>Gateway &amp; Radix Wallet treatment</td>
</tr>
<tr>
<td><code>account_type</code></td>
<td><code>string</code></td>
<td>“dapp definition”</td>
<td>Indicates that the metadata of this account should be read as a dapp definition, including looking for the metadata below, rather than treated as a user account.</td>
</tr>
<tr>
<td><code>claimed_entities</code></td>
<td><code>Vec&lt;Address&gt;</code></td>
<td>Addresses of related entities.</td>
<td><ul>
<li><p>Claims ownership of packages, components, and resources - confirmed by the entity’s metadata pointing back to this dApp Definition address.</p></li>
<li><p><code>claimed_entities</code> <strong>beyond the first 100 set on this account may be ignored.</strong></p></li>
</ul></td>
</tr>
<tr>
<td><code>claimed_websites</code></td>
<td><code>Vec&lt;Origin&gt;</code></td>
<td>Origins (URLs without any path) of associated websites.</td>
<td><blockquote>
<p>Note that origin metadata values must not end with <code>/</code>.<br />
A <code>/</code> at the end of a url would cause an invalid origin error.</p>
</blockquote>
<ul>
<li><p>Claims ownership of websites - confirmed by looking up an expected <code>.well-known/radix.json</code> file at the claimed website origin.</p></li>
<li><p><code>claimed_websites</code> <strong>beyond the first 10 set on this account may be ignored.</strong></p></li>
</ul></td>
</tr>
<tr>
<td><code>dapp_definitions</code></td>
<td><code>Vec&lt;Address&gt;</code></td>
<td>dApp definition account addresses.</td>
<td><ul>
<li><p>Claims association with another dApp Definition - confirmed by that dApp Definition pointing back to this one in the same way. This is more of a “peer” association than it is “ownership”.</p></li>
<li><p><code>dapp_definitions</code> <strong>beyond the first 100 set on this resource may be ignored.</strong></p></li>
</ul></td>
</tr>
<tr>
<td><code>account_locker</code></td>
<td><code>Address</code></td>
<td>Primary Account Locker for the dApp</td>
<td><ul>
<li><p>Registers the given account locker as the primary account locker for the dApp.</p></li>
<li><p>The account locker should also be two-way linked to the dApp, using <code>claimed_entities</code> entry on the dApp definition, and <code>dapp_definition</code> entry on the account locker.</p></li>
<li><p>A correctly two-way-linked <code>account_locker</code> can be used by wallets to check for outstanding claims from dApps the user has previously interacted with.</p></li>
</ul></td>
</tr>
</tbody>




### Resources

:::note
**>
**Warning: Plural field name**

**

Unlike components and packages, a resource is permitted to link to multiple dApp definitions, so it uses the plural metadata name `dapp_definitions`
:::




<table>
<colgroup>
<col />
<col />
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Metadata field</td>
<td>Type</td>
<td>Contents</td>
<td>Gateway &amp; Radix Wallet treatment</td>
</tr>
<tr>
<td><code>dapp_definitions</code></td>
<td><code>Vec&lt;Address&gt;</code></td>
<td>dApp definition account address(es) that have claimed this as a related resource, to confirm the claim.</td>
<td><p>Defines a direct link to the dApp if the resource’s address is also present in the dApp Definition Account’s <code>claimed_entities</code> metadata.</p>
<p>Allows display of which dApp(s) this resource is associated with.</p>
<p><code>dapp_definitions</code> <strong>beyond the first 5 set on this resource may be ignored.</strong></p></td>
</tr>
</tbody>




### Packages



<table>
<colgroup>
<col />
<col />
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Metadata field</td>
<td>Type</td>
<td>Contents</td>
<td>Gateway &amp; Radix Wallet treatment</td>
</tr>
<tr>
<td><code>dapp_definition</code></td>
<td><code>Address</code></td>
<td>The dApp definition account address.</td>
<td>Defines a direct link to the dApp if the component’s address is also present in the dApp Definition Account’s <code>claimed_entities</code> metadata.</td>
</tr>
<tr>
<td><code>enable_blueprint_linking</code></td>
<td><code>Vec&lt;String&gt;</code></td>
<td>The names of blueprints in this package for which all components instantiated from that blueprint should be treated as being part of the dApp.</td>
<td><p>If the package is two-way linked to a dApp definition, then any components instantiated from the defined blueprint names are treated as being part of the dApp (unless they directly link to a different dApp).</p>
<p>dApp owners should only configure this for blueprints where they wish all such components to be associated with their dApp:</p>
<ul>
<li><p>Their constructors have used [function access rules](../authorization/assign-function-accessrules.md) to protect the constructor</p></li>
<li><p>The constructors are public, but regardless all such components can be treated as part of the dApp.</p></li>
</ul></td>
</tr>
</tbody>




### Components

#### Direct Link

A **direct link** can be defined between a dApp definition and a scrypto component or “[native component](../native-blueprints/index.md)” such as a pool, account, validator or access controller.



|  |  |  |  |
|:---|:---|:---|:---|
| Metadata field | Type | Contents | Gateway & Radix Wallet treatment |
| `dapp_definition` | `Address` | The dApp definition account address. | Defines a direct link to the dApp if the component’s address is also present in the dApp Definition Account’s `claimed_entities` metadata. |



#### Blueprint Link

A component is treated as having a **blueprint link** to a dApp definition if both:

- Its package is two-way linked to the dApp definition

- Its package has the `enable_blueprint_linking` metadata entry set to include the component’s blueprint name.

#### Resolved Link

The “resolved link” is the primary link shown for a dApp. It resolves as the direct link, if it exists; otherwise the blueprint link.

The resolved link is used by the wallet to show the associated dApps using transaction signing.

## Linking website to a dApp Definition

:::note
**>
**It is required by the Radix Wallet that a dApp Website have a correctly configured dApp Definition.**

**

In development, you can configure your wallet to developer mode to disable these checks
:::


### Linking a website origin back to a dApp Definition

To declare a website (or websites) as part of a dApp, the dApp Definition sets a `claimed_websites` metadata field (which should have a value of `Vec<Origin>`).

If more than one website is specified, the first website listed should be the preferred entry point for users. A client like the Radix Wallet might link to this first website if the full listing of websites is not shown.

For websites, the developer must create a `radix.json` file and expose it according to the <a href="https://www.rfc-editor.org/rfc/rfc8615" target="_blank">RFC 8615: Well-known URI standard</a> at `/.well-known/radix.json` under their origin. When a request is made by a given dApp defintion from an origin to the Radix wallet, the Radix wallet will read this file and check for a two-way link with the given dApp definition.

For example, if a dApp Definition metadata identified the origin `https://test.topradixdevs.io` it would look for confirmation of the link in an entry at `https://test.topradixdevs.io/.well-known/radix.json`

:::note
**>
**Origins and www**

**

A dApp Definition is connected to one or more “claimed_websites”. From these, the [origin](https://developer.mozilla.org/en-US/docs/Glossary/Origin) is extracted, and used for the below two-way verification. This follows the web security model of the [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy), where security-related data is sandboxed by origin.

Note in particular that `https://www.my-cool-radix-dapp.com` is a separate origin to `https://my-cool-radix-dapp.com` - if you wish to support users using both, you need to either:

- \(a\) Register both as claimed websites on your dApp Definition. The first in the list in the link will be the preferred link which is displayed to users.

- \(b\) Choose a canonical origin (e.g. with the `www.`), and set up a redirect from the other origin. Only the canonical origin needs to then be registered.

Typically (b) is a better choice as it fits better with the same-origin policy for other web security concerns, but (a) is also possible.
:::


A `radix.json` file for a domain hosting 2 dApps would be structured like this:

``` json
{
  "dApps":[
    {
      "dAppDefinitionAddress": "account_rdx1qluj95c7hduuvrt5jctcj059qfavznygcssrgnuk0k6q3cktjy"
    },
    {
      "dAppDefinitionAddress": "account_rdx1q7u4e5vry33qyddxpm0fhqspl5ruym7zx9kj9h0d52qsf4jc9p"
    }
  ]
}
```

Note, while this means that one domain can host multiple dApps, there is no enforcement of separation of these dApps – **it is assumed that each domain owner is in control of all dApps hosted on that domain**. Each dApp must be listed in the `radix.json` file at the root level of their domain to be considered valid, and it is up to each dApp to correctly declare which dApp Definition it is associated with under that domain.

Using this information on the website and on the dApp Definition, the Radix Wallet can verify that requests from websites are genuine. The Wallet will know each dApp by its dApp Definition address, and no website can falsely claim to be associated with a dApp Definition that it does not actually control.

### Gumball Club Example

- dApp URL is: <a href="https://gumball-club.radixdlt.com/">https://gumball-club.radixdlt.com/</a> which gives an origin of <a href="https://gumball-club.radixdlt.com">https://gumball-club.radixdlt.com</a>

- Well Known `radix.json` file: <a href="https://gumball-club.radixdlt.com/.well-known/radix.json">https://gumball-club.radixdlt.com/.well-known/radix.json</a>

- Dashboard Examples: <a href="https://dashboard.radixdlt.com/account/account_rdx12xuhw6v30chdkhcu7qznz9vu926vxefr4h4tdvc0mdckg9rq4afx9t/metadata">Current dApp Definition metadata</a> \| <a href="https://dashboard.radixdlt.com/transaction/txid_rdx15klz9t3rcczq4r62p2xv0x83we8rmqf6wxd5g474jc2s28k64w6sqw8dzk/details">Transaction which set up the claimed_websites</a>
