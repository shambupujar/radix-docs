---
title: "Fungible Resource Manager"
---

# Fungible Resource Manager

This document offers a description of the design and implementation of the Fungible Resource Manager blueprint. Additionally, this document provides an API reference for all its methods, functions and events.

## Background

In Radix, a Resource is a native concept used to implement use-cases typically associated with “tokens” or “assets”. You can learn more about its high-level design at [Resources](index.md).

A “Fungible Resource” is a kind of Resource operating on arbitrary quantities, which can be split and combined freely (i.e. its units do not have distinct identity nor individual metadata). [Detailed behaviors](resource-behaviors.md) of all units of a specific Fungible Resource is defined by its Fungible Resource Manager. This includes the rules for:

- the Resource’s maximum divisibility,

- minting and burning the Resource’s units,

- freezing and recalling the Resource from Vaults,

- tracking the Resource’s total supply.

Many functionalities of a Fungible Resource are implemented by Fungible Vault, Fungible Bucket and Fungible Proof, which are separate Native Blueprints (covered in detail by their respective documentation pages). The sections below focus on the `FungibleResourceManager` Blueprint itself.

## Optional Features

Not every Fungible Resource needs to satisfy the same set of use-cases. For this reason, the set of blueprint Features which can be optionally present on a `FungibleResourceManager` instance is quite broad:

- `track_total_supply` - whether the total supply of the Resource should be tracked,

- `vault_freeze` - whether a Vault holding the Resource can ever be frozen,

- `vault_recall` - whether the Resource can ever be recalled from a Vault,

- `mint` - whether more of the Resource (above initial supply) can ever be minted,

- `burn` - whether the Resource can ever be burned.

## On-ledger State

The `FungibleResourceManager` blueprint defines two fields:

- `divisibility`, holding an integer in the inclusive range `[0, 18]`, denoting a number of decimal places that the Resource can be split into. In other words: a precision of fixed-point fractional operations performed on the Resource’s amounts.

- `total_supply` (only present if the `track_total_supply` Feature is enabled), holds an automatically-maintained amount of all units in circulation at any moment (i.e. minted so far and not burned yet).

## API Reference

### Functions

#### `create`

Defines a new fungible Resource (i.e. creates its Manager).



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>create</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Function</td>
</tr>
<tr>
<td><strong>Callable By</strong></td>
<td>Public</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><p><code>owner_role</code> - <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/01c421e4a5583f3c191f685fc322c1524600a911/radix-engine-interface/src/blueprints/resource/role_assignment.rs#L215">OwnerRole</a>: The owner’s access rule (possibly <code>None</code>).</p>
<p><code>track_total_supply</code> - <code>bool</code>: Whether to enable the supply-tracking [feature](../native-blueprints/validator.md#optional-features).</p>
<p><code>divisibility</code> - <code>u8</code>: The Resource unit’s divisibility (see its [definition](../native-blueprints/validator.md#onledger-state)).</p>
<p><code>resource_roles</code> - <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/01c421e4a5583f3c191f685fc322c1524600a911/radix-engine-interface/src/blueprints/resource/fungible/fungible_resource_manager.rs#L16">FungibleResourceRoles</a>: The set of rules for all roles, including the optional ones (which cause their respective [features](../native-blueprints/validator.md#optional-features) to be enabled).</p>
<p><code>metadata</code> - <code>ModuleConfig&lt;MetadataInit&gt;</code>: Configuration of metadata roles and the initial metadata values.</p>
<p><code>address_reservation</code> - <code>Option&lt;GlobalAddressReservation&gt;</code>: An optional reservation of the global address.</p></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><code>ResourceAddress</code>: A de-facto identifier of the newly-created Resource; its Manager’s address.</td>
</tr>
</tbody>




#### `create_with_initial_supply`

Defines a new fungible Resource (i.e. creates its Manager) in the same way as [create](../native-blueprints/validator.md#create) does, and simultaneously mints the requested amount.

This variant is useful e.g. for creating a fixed supply of a non-mintable Resource.



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>create_with_initial_supply</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Function</td>
</tr>
<tr>
<td><strong>Callable By</strong></td>
<td>Public</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><p><code>owner_role</code> - <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/01c421e4a5583f3c191f685fc322c1524600a911/radix-engine-interface/src/blueprints/resource/role_assignment.rs#L215">OwnerRole</a>: The owner’s access rule (possibly <code>None</code>).</p>
<p><code>track_total_supply</code> - <code>bool</code>: Whether to enable the supply-tracking [feature](../native-blueprints/validator.md#optional-features).</p>
<p><code>divisibility</code> - <code>u8</code>: The Resource unit’s divisibility (see its [definition](../native-blueprints/validator.md#onledger-state)).</p>
<p><code>initial_supply</code> - <code>Decimal</code>: The amount to initially mint.</p>
<p><code>resource_roles</code> - <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/01c421e4a5583f3c191f685fc322c1524600a911/radix-engine-interface/src/blueprints/resource/fungible/fungible_resource_manager.rs#L16">FungibleResourceRoles</a>: The set of rules for all roles, including the optional ones (which cause their respective [features](../native-blueprints/validator.md#optional-features) to be enabled).</p>
<p><code>metadata</code> - <code>ModuleConfig&lt;MetadataInit&gt;</code>: Configuration of metadata roles and the initial metadata values.</p>
<p><code>address_reservation</code> - <code>Option&lt;GlobalAddressReservation&gt;</code>: An optional reservation of the global address.</p></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><p>A tuple containing:</p>
<p><code>ResourceAddress</code>: A de-facto identifier of the newly-created Resource; its Manager’s address.</p>
<p><code>FungibleBucket</code>: A bucket with the entire initially-minted supply of the Resource.</p></td>
</tr>
</tbody>




### Methods

#### `mint`

Creates the requested amount of the Resource.

Note: the `mint` [feature](../native-blueprints/validator.md#optional-features) must be enabled on the Resource Manager.



|                 |                                                          |
|:----------------|:---------------------------------------------------------|
| **Name**        | `mint`                                                   |
| **Type**        | Method                                                   |
| **Callable By** | Public - requires the `minter` role.                     |
| **Arguments**   | `amount` - `Decimal`: An amount to mint.                 |
| **Returns**     | `FungibleBucket`: A bucket with the newly-minted amount. |



#### `burn`

Destroys the given bucket of the Resource.

Note: the `burn` [feature](../native-blueprints/validator.md#optional-features) must be enabled on the Resource Manager.



|  |  |
|:---|:---|
| **Name** | `burn` |
| **Type** | Method |
| **Callable By** | Public - requires the `burner` role. |
| **Arguments** | `bucket` - `FungibleBucket`: A bucket with the amount to burn. |
| **Returns** | Nothing |



#### `package_burn`

Destroys the given bucket of the Resource, in the same way as `burn` does. This is an internal method needed to allow burning Resources from a Vault.

Note: the `burn` [feature](../native-blueprints/validator.md#optional-features) must be enabled on the Resource Manager.



|  |  |
|:---|:---|
| **Name** | `package_burn` |
| **Type** | Method |
| **Callable By** | Own package only. |
| **Arguments** | `bucket` - `FungibleBucket`: A bucket with the amount to burn. |
| **Returns** | Nothing |



#### `create_empty_vault`

Creates a new empty Vault tailored for storing the managed Resource and supporting the features configured on this Resource Manager.



|                 |                                          |
|:----------------|:-----------------------------------------|
| **Name**        | `create_empty_vault`                     |
| **Type**        | Method                                   |
| **Callable By** | Public                                   |
| **Arguments**   | None                                     |
| **Returns**     | `Own`: The address of the created Vault. |



#### `create_empty_bucket`

Creates a new empty Fungible Bucket tailored for holding the managed Resource.



|                 |                                       |
|:----------------|:--------------------------------------|
| **Name**        | `create_empty_bucket`                 |
| **Type**        | Method                                |
| **Callable By** | Public                                |
| **Arguments**   | None                                  |
| **Returns**     | `FungibleBucket`: The created Bucket. |



#### `get_resource_type`

Queries the managed Resource’s type.



|  |  |
|:---|:---|
| **Name** | `get_resource_type` |
| **Type** | Method |
| **Callable By** | Public |
| **Arguments** | None |
| **Returns** | `ResourceType`: For a fungible Resource Manager this will always be `ResourceType::Fungible`, containing the Resource’s [configured](../native-blueprints/validator.md#onledger-state) `divisibility`. |



#### `get_total_supply`

Queries the total amount of all units of this Resource currently in circulation.

Note: the `track_total_supply` [feature](../native-blueprints/validator.md#optional-features) must be enabled on the Resource Manager.



|                 |                                     |
|:----------------|:------------------------------------|
| **Name**        | `get_total_supply`                  |
| **Type**        | Method                              |
| **Callable By** | Public                              |
| **Arguments**   | None                                |
| **Returns**     | `Decimal`: The total supply amount. |



#### `amount_for_withdrawal`

Converts the input amount to an actual withdrawal amount, taking the Resource’s [configured](../native-blueprints/validator.md#onledger-state) `divisibility` and the given rounding mode into account.



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>amount_for_withdrawal</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable By</strong></td>
<td>Public</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><p><code>request_amount</code> - <code>Decimal</code>: The approximate, requested amount.</p>
<p><code>withdraw_strategy</code> - <code>WithdrawStrategy</code>:</p>
<ul>
<li><p>either <code>Exact</code>, which returns the <code>request_amount</code> unchanged,</p></li>
<li><p>or one of the <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/01c421e4a5583f3c191f685fc322c1524600a911/radix-engine-common/src/math/rounding_mode.rs#L16">RoundingMode</a>s to be applied.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><code>Decimal</code>: The actual, withdrawable amount.</td>
</tr>
</tbody>




#### `drop_empty_bucket`

Drops the given empty Fungible Bucket.

Note: passing a non-empty Bucket will result in an error.



|                 |                                                  |
|:----------------|:-------------------------------------------------|
| **Name**        | `drop_empty_bucket`                              |
| **Type**        | Method                                           |
| **Callable By** | Public                                           |
| **Arguments**   | `bucket` - `FungibleBucket`: The bucket to drop. |
| **Returns**     | Nothing                                          |



### Events

A `FungibleResourceManager` component instance can be a source of the following events:

#### `VaultCreationEvent`

``` rust
{
  // The ID of the created Vault.
  vault_id: NodeId
}
```

Emitted when a new Vault for the managed Resource is created (i.e. on `create_empty_vault` API call).

#### `MintFungibleResourceEvent`

``` rust
{
  // The minted amount.
  amount: Decimal,
}
```

Emitted when some amount of the managed Resource is minted (i.e. on the explicit `mint` API call, but also on `create_with_initial_supply`).

#### `BurnFungibleResourceEvent`

``` rust
{
  // The burned amount.
  amount: Decimal
}
```

Emitted when some amount of the managed Resource is burned (i.e. on the explicit `burn/package_burn` API calls, but also internally when burning the transaction fees).
