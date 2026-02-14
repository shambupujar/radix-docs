---
title: "Metadata for Wallet Display"
---

# Metadata for Wallet Display

## Introduction

These metadata standards are intended to assist clients like the Radix Wallet, Radix Dashboard, exchanges, and more, to display useful information about the assets a user holds, and the on-ledger things a user interacts with, like dApps, components, and blueprints.

Developers can feel free to add and use whatever metadata they like, but these standards are recommended as a “least common denominator” standard for the basic attributes that the Radix Wallet and any other client would expect to be present in a standard way.

**In short, if you set these things on the things you create, you can be sure of having clear and excellent presentation for users.**

## Resources

Metadata set on tokens and NFTs helps identify those assets and provide customized presentation to wallet users.

Note that, for NFTs, this is metadata set on the NFT resource itself (or “resource manager”) that refers to all individual non-fungibles that belong to that resource. Separate standards for setting data on individual non-fungibles is below.



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
<td>Intended Use</td>
<td>Radix Wallet Treatment</td>
</tr>
<tr>
<td><code>name</code></td>
<td><code>string</code></td>
<td>Simple name of the asset as intended to be displayed, with capitals.</td>
<td><ul>
<li><p>Shown as primary readable identifier for token if symbol is not present (for nonfungible tokens), and as a more complete human-readable name of the token.</p>
<ul>
<li><p>eg. <code>Bitcoin</code></p></li>
<li><p>eg. <code>Dallas Mavericks Tickets</code></p></li>
</ul></li>
<li><p><strong>May be truncated after 32 characters.</strong></p></li>
</ul></td>
</tr>
<tr>
<td><code>symbol</code> (fungible resources only)</td>
<td><code>string</code></td>
<td><ul>
<li><p>A short unique identifier, often used on exchanges or to label an amount of the token (eg. 2.503 BTC).</p></li>
<li><p>No more than 5 characters.</p></li>
<li><p>Alphanumeric, all caps, no whitespace.</p></li>
</ul></td>
<td><ul>
<li><p>Shown all-caps as most-preferred singular method of identifying fungible tokens. Symbol is ignored for non-fungible resources</p>
<ul>
<li>eg. <code>BTC</code>.</li>
</ul></li>
<li><p>The wallet will display the symbol all-caps.</p></li>
<li><p><strong>Symbols not conforming to the intended string format may be ignored.</strong></p></li>
<li><p><strong>May be truncated after 5 characters.</strong></p></li>
</ul></td>
</tr>
<tr>
<td><code>description</code></td>
<td><code>string</code></td>
<td>Summarized description of the asset and its purpose as intended to be displayed, with capitals.</td>
<td><ul>
<li><p>Not shown as a primary readable identifier for the token - but listed under the detailed information for the token.</p>
<ul>
<li><p>eg. <code>Open source P2P money</code>.</p></li>
<li><p>eg. <code>Your NFT tickets to see the Dallas Mavericks at the American Airlines Center</code>.</p></li>
</ul></li>
<li><p>Intended to provide a short, simple description in the context of a "get info" style screen. As with other metadata fields, no formatting is supported. Line breaks, extra whitespace, and other types of formatting tags should not be used - they may either be shown explicitly as text or ignored.</p></li>
<li><p><strong>May be truncated after 256 characters.</strong></p></li>
</ul></td>
</tr>
<tr>
<td><code>tags</code></td>
<td><code>Vec&lt;string&gt;</code></td>
<td><ul>
<li><p>List of descriptive tags for the resource.</p></li>
<li><p>Alphanumeric, no caps, dashes for spaces, no whitespace.</p></li>
</ul></td>
<td><ul>
<li><p>The wallet will allow the user to choose which tags are meaningful to them, and display these tags on resources and allow grouping by them.</p>
<ul>
<li>eg. <code>badge</code>, <code>gaming</code>, <code>loan-positions</code>, <code>PFP</code></li>
</ul></li>
<li><p>The wallet will default to showing the badge tag (indicating an asset that is intended to be used for authorization). It will show a warning when the user is viewing a transaction that would transfer away a resource tagged badge.</p></li>
<li><p>All other tags will be for the user to opt-in to see flagged on their resources in a given account.</p></li>
<li><p>The wallet will default to showing the <code>badge</code> tag (indicating an asset that is intended to be used for authorization). All other tags will be for the user to opt-in to see flagged on their resources in a given account.</p></li>
<li><p>Tags not conforming to the intended string format may be ignored.</p></li>
<li><p>Dashes in tags may be replaced by spaces for friendly display for users.</p></li>
<li><p><strong>May be truncated after 16 characters.</strong></p></li>
<li><p><code>tags</code> <strong>beyond the first 100 set on this resource may be ignored.</strong></p></li>
</ul></td>
</tr>
<tr>
<td><code>icon_url</code></td>
<td><code>URL</code></td>
<td><ul>
<li><p>Location of image to be used to represent the token.</p></li>
<li><p>Should be designed for expected presentation as a circle</p></li>
</ul></td>
<td><ul>
<li><p>Shown as a primary visual identifier for the token in various places, if present. A placeholder is used if nothing set.</p></li>
<li><p>The wallet will load and scale this image for specific presentation, cropping it into a 1:1 circle.</p></li>
<li><p>Supported types: JPG, PNG, GIF, WEBP, SVG</p></li>
<li><p>Images without proper filename extensions or of format other than PNG, JPG, GIF, WEBP, or SVG format may be ignored.</p></li>
<li><p><strong>Note</strong>: A later expansion of the metadata standard may include the ability to specify more - such as different images for different sizes and usage, explicit mutability and aspect ratio, and verifiable hashes. We start with a simple single URL field standard for now, which the Radix Wallet will always intend to support, and will expand the standard (and its adoption in the Radix Wallet) from developer community feedback.</p></li>
</ul></td>
</tr>
<tr>
<td><code>info_url</code></td>
<td><code>URL</code></td>
<td>Direct link to an informational webpage.</td>
<td>If provided, the wallet will present this URL that may route users to an informational webpage about the token in the detailed page view of the token.</td>
</tr>
</tbody>




## Non-fungible Data Standards

Non-fungible data is not technically metadata, but often displayed similarly. These are captured via the [non-fungible data standards](../resources/non-fungible-data-for-wallet-display.md).

## Components and Blueprint Packages

Unlike most of the metadata standards, the fields here are not primarily intended for use in the wallet, but rather for use by network browsing and searching interfaces such as the Radix Dashboard, or perhaps future Scrypto code browsing and discovery services. It might be used along with other non-metadata information about the component or package, such as the methods available or royalty fees charged for its usage.



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
<td>Intended Use</td>
<td>Radix Wallet Treatment</td>
</tr>
<tr>
<td><code>name</code></td>
<td><code>string</code></td>
<td>Simple name of the component as intended to be displayed, with capitals.</td>
<td><ul>
<li><p>eg. <code>AwesomeOracle Price/Weather</code></p></li>
<li><p><strong>May be truncated after 32 characters.</strong></p></li>
</ul></td>
</tr>
<tr>
<td><code>description</code></td>
<td><code>string</code></td>
<td>Summarized description of the component and its usage as intended to be displayed, with capitals</td>
<td><ul>
<li><p>eg. <code>Official AwesomeOracle component providing data about asset prices and weather conditions.</code></p></li>
<li><p>Intended to provide a short, simple description in the context of a "get info" style screen. As with other metadata fields, no formatting is supported. Line breaks, extra whitespace, and other types of formatting tags should not be used - they may either be shown explicitly as text or ignored.</p></li>
<li><p><strong>May be truncated after 256 characters.</strong></p></li>
</ul></td>
</tr>
<tr>
<td><code>tags</code></td>
<td><code>Vec&lt;string&gt;</code></td>
<td><ul>
<li><p>List of descriptive tags for the component.</p></li>
<li><p>Alphanumeric, no caps, dashes for spaces, no whitespace.</p></li>
</ul></td>
<td><ul>
<li><p>eg. <code>oracle</code>, <code>price</code>, <code>weather</code></p></li>
<li><p>Tags not conforming to the intended string format may be ignored.</p></li>
<li><p>Dashes in tags may be replaced by spaces for friendly display for users.</p></li>
<li><p><strong>May be truncated after 16 characters.</strong></p></li>
<li><p><code>tags</code> <strong>beyond the first 100 set on this resource may be ignored.</strong></p></li>
</ul></td>
</tr>
</tbody>




## Special Native Components and Resources

The Radix Network includes a selection of native blueprints from which users can instantiate native components with known and trustable behavior. Some of these components also mint their own associated resources.

Below are the metadata standards a developer should consider to customize how these components and resources are presented in the Radix Wallet and other clients.

[Metadata standards for verification](metadata-for-verification.md) may also be applied to these components and resources.

### “Account” (for users) system component metadata

Accounts are the elemental holder of resources. The wallet interacts with them directly, or wraps them in an access controller component, which works by holding the owner badge issued by the account.

No metadata is expected to be set on simple account components for users.

### “Account” (for dApp definitions) system components metadata

In addition to user accounts in the wallet, accounts may be used as repositories for metadata that define the collection of things that make up a “dApp” so that they have a single on-ledger identity that they may be registered to, and recognized by in the wallet. This registration is done by this component claiming ownership of other components, packages, resources, and more – and those entities in turn confirming that claim by setting metadata that points to this account’s address.

This is an account because this component may also need to hold resources of various types (in particular badges).



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
<td>Intended Use</td>
<td>Radix Wallet Treatment</td>
</tr>
<tr>
<td><code>name</code></td>
<td><code>string</code></td>
<td>Simple name of the dApp as intended to be displayed, with capitals.</td>
<td><ul>
<li><p>e.g. <code>CollaboFi</code></p></li>
<li><p>Intended to provide a short, simple description in the context of a "get info" style screen. As with other metadata fields, no formatting is supported. Line breaks, extra whitespace, and other types of formatting tags should not be used - they may either be shown explicitly as text or ignored.</p></li>
<li><p><strong>May be truncated after 32 characters.</strong></p></li>
</ul></td>
</tr>
<tr>
<td><code>description</code></td>
<td><code>string</code></td>
<td>Summarized description of the dApp as intended to be displayed, with capitals.</td>
<td><ul>
<li><p>eg. <code>CollaboFi is a platform for collaborative community and creative crowdfunding.</code></p></li>
<li><p><strong>May be truncated after 256 characters.</strong></p></li>
</ul></td>
</tr>
<tr>
<td><code>tags</code></td>
<td><code>Vec&lt;string&gt;</code></td>
<td><ul>
<li><p>List of descriptive tags for the dApp.</p></li>
<li><p>Alphanumeric, no caps, dashes for spaces, no whitespace.</p></li>
</ul></td>
<td><ul>
<li><p>eg. <code>dao</code>, <code>marketplace</code>, <code>music</code>, <code>art</code></p></li>
<li><p><strong>Add clear, concise tags</strong> to improve the discoverability of your dApp in Wallet’s dApp Directory.</p></li>
<li><p><strong>May be truncated after 16 characters.</strong></p></li>
<li><p><code>tags</code> <strong>beyond the first 100 set on this resource may be ignored.</strong></p></li>
</ul></td>
</tr>
<tr>
<td><code>icon_url</code></td>
<td><code>URL</code></td>
<td><ul>
<li><p>Location of image to be used to represent the dApp.</p></li>
<li><p>Should be designed for expected presentation as a square.</p></li>
</ul></td>
<td><ul>
<li><p>Shown as a primary visual identifier for the dApp in various places, if present. A placeholder is used if nothing set.</p></li>
<li><p>The wallet will load and scale this image for specific presentation, cropping it into a 1:1 square.</p></li>
<li><p>Supported types: JPG, PNG, GIF, WEBP, SVG</p></li>
<li><p>Images without proper filename extensions or of format other than PNG, JPG, GIF, WEBP, or SVG format may be ignored.</p></li>
<li><p><strong>Note</strong>: A later expansion of the metadata standard may include the ability to specify more - such as different images for different sizes and usage, explicit mutability and aspect ratio, and verifiable hashes. We start with a simple single URL field standard for now, which the Radix Wallet will always intend to support, and will expand the standard (and its adoption in the Radix Wallet) from developer community feedback.</p></li>
</ul></td>
</tr>
<tr>
<td><code>dapp_category</code></td>
<td>string</td>
<td><p>One of:</p>
<ul>
<li><p>defi</p></li>
<li><p>utility</p></li>
<li><p>dao</p></li>
<li><p>nft</p></li>
<li><p>meme</p></li>
</ul></td>
<td><ul>
<li><p>Used to categorize the dApp in Wallet’s dApp Directory.</p></li>
<li><p><strong>Optional Field.</strong> Use this to override the default category configured during the dApp’s initial listing in dApp Directory.</p>
<p></p></li>
</ul></td>
</tr>
</tbody>




### “Identity” system component metadata

This system component is specifically intended to be used as a repository for a public key that can be used for web3 login verification as part of the ROLA system. The Radix Wallet creates and associates an identity component with each Persona that a user creates there to be used for web3 logins. The Identity component holds no resources. The login mechanism is designed to be pseudo-anonymous, therefore there is little reason for general metadata to be stored here (and there is good reason to not store data there).

Identities have no standard metadata fields.

### “Validator” system component metadata

A validator node-runner will instantiate a system Validator component that holds its stake and allows its owner to define various pieces of metadata that might be visible on a staking dashboard or the Radix Wallet. Other more functional aspects of Validator configuration, such as setting the validator’s fee, are set via component methods, not metadata.



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
<td>Intended Use</td>
<td>Radix Wallet Treatment</td>
</tr>
<tr>
<td><code>name</code></td>
<td><code>string</code></td>
<td>Simple name of the validator as intended to be displayed, with capitals.</td>
<td><ul>
<li><p>eg. <code>Prime Stake</code></p></li>
<li><p><strong>May be truncated after 32 characters.</strong></p></li>
</ul></td>
</tr>
<tr>
<td><code>description</code></td>
<td><code>string</code></td>
<td>Summarized description of the validator as intended to be displayed, with capitals.</td>
<td><ul>
<li><p>eg. <code>Your top choice for reliable, community-driven Radix Network validation.</code></p></li>
<li><p>Intended to provide a short, simple description in the context of a "get info" style screen. As with other metadata fields, no formatting is supported. Line breaks, extra whitespace, and other types of formatting tags should not be used - they may either be shown explicitly as text or ignored.</p></li>
<li><p><strong>May be truncated after 256 characters.</strong></p></li>
</ul></td>
</tr>
<tr>
<td><code>icon_url</code></td>
<td><code>URL</code></td>
<td><ul>
<li><p>Location of image to be used to represent the validator (not to be confused with individual non-fungibles).</p></li>
<li><p>Should be designed for expected presentation as a square.</p></li>
</ul></td>
<td><ul>
<li><p>Shown as a primary visual identifier for the validator in various places, if present. A placeholder is used if nothing set.</p></li>
<li><p>The wallet will load and scale this image for specific presentation, cropping it into a 1:1 square.</p></li>
<li><p>Supported types: JPG, PNG, GIF, WEBP, SVG</p></li>
<li><p>Images without proper filename extensions or of format other than PNG, JPG, GIF, WEBP, SVG format may be ignored.</p></li>
<li><p><strong>Note</strong>: A later expansion of the metadata standard may include the ability to specify more - such as different images for different sizes and usage, explicit mutability and aspect ratio, and verifiable hashes. We start with a simple single URL field standard for now, which the Radix Wallet will always intend to support, and will expand the standard (and its adoption in the Radix Wallet) from developer community feedback.</p></li>
</ul></td>
</tr>
<tr>
<td><code>info_url</code></td>
<td><code>URL</code></td>
<td>Direct link to an informational webpage.</td>
<td>If provided, the wallet will present this URL that may route users to an informational webpage about the token in the detailed page view of the token.</td>
</tr>
</tbody>




### "Liquid Staking Unit" and "Stake Claim" resources for Validators

Validator components automatically mint liquid stake unit tokens and stake claim NFTs. It is not expected for the validator node-runner to set any metadata for these resources, and the Radix Wallet will show validator information taken from the validator component metadata as above.

### “Pool” component metadata

A developer who wishes to use a pool will instantiate one from a [native Pool blueprint](../native-blueprints/pool.md), and they will have the ability to set metadata on it as they wish.

The metadata standards for pool components are the same as those for other components above.

### "Pool Unit" resource metadata

Pool components automatically mint pool unit tokens. Instantiators of pool components will also be given the ability to set the metadata on this resource as they wish.

The metadata standards for these resources are the same as [other resources above](metadata-for-wallet-display.md#resources).
