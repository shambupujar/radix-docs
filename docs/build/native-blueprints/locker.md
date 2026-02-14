---
title: "Calling the `instantiate_simpl` function on the locker package to create a"
---

## Introduction

The locker package, and the account locker blueprint in particular, offer a new pattern for applications to handle account deposits in a way that doesn’t fail due to account deposit settings, does not require authorized depositor or user badges, and allows applications to not keep track of claims or resources that they owe to users. This comes from the fact that accounts on the network can potentially reject deposits that do not align with their account deposit rules.

One solution to enable direct account deposits is the [authorized depositor badge concept](../../integrate/exchange-integration-guide/worked-example-2-tracking-deposits-any-account.md#authorized-depositors). However, authorized depositor badges are not ideal for all use cases, as they require prior coordination between the recipient and the application wishing to send tokens to them.

Asset bridges are a good example of a case where it’s important that the depositor has a guaranteed way of being able to make sure that the intended recipient can get their tokens, regardless of whether they’ve pre-authorized the bridge. Refunds on cross-network bridging are not always possible, and most bridges are built around the notion of a “fire-and-forget” pattern where the asset is sent on the receiving network and there is no follow-up to handle failure cases. However, it’s equally important that Radix users who have configured their accounts to restrict depositing to not be bothered by unexpected tokens showing up.

While the above example is on bridges, the above set of problems and the solutions presented in this document generalize to any application which is interested in sending resources to accounts who may not be currently configured to receive them, without doing any special bookkeeping for the failed deposits.

This document is on the locker package that contains blueprints that allow for resources to be stored within them and claimed if a claim check is successful. This package currently contains a single blueprint: the `AccountLocker` blueprint. Other blueprints can be added in the future that perform checks other than reading and asserting against the owner’s role.

`AccountLocker` components allow for an administrator of a component to deposit resources, specify who can claim the resources, and users can then claim these resources. At claim time, the blueprint checks if the caller can demonstrate owner powers over the account by reading the owner role of the account and asserting against it. If the assertion passes, then the caller has owner powers over the account and the resources can be returned to them. Otherwise, the claim fails. Account lockers are also able to first attempt to deposit the resources into the claimant’s account and store them in the account locker if the account deposit fails due to account deposit rules. Resources stored in the account locker can potentially be recovered by an administrator if they have not been claimed and that power could be given up at instantiation time.

## Use Cases

The account locker blueprint is generally useful for any application that needs to deposit resources directly into accounts where some of those deposits can fail and not want to do any additional bookkeeping on the failed deposits such as keeping them to be claimed later and issuing a user claim badge or asking users to add the application’s authorized depositor badge to their account. It allows applications to first attempt the deposit into accounts and then store them in their (the application) locker if the deposit fails where they can be claimed later on. This section has some concrete use cases for this blueprint.

- **Airdrops:** In a similar way to bridges and exchanges, airdrop transactions can potentially fail if the account deposit rules do not allow for the airdrop. Historically, if the airdrop was of substantial value, then the airdropper would need to keep track of failed airdrops off-ledger to attempt them later. This adds complexity to what is a conceptually simple operation. The account locker blueprint with its `airdrop` method simplifies airdrops drastically where the blueprint will first attempt to deposit the resources into the accounts and if the deposit fails then it will store them in the account locker for the account owners to claim them.
- **Exchanges:** Some accounts might have their deposit rules configured to not allow resources that they don’t currently have any of. This can lead some exchange withdrawal transactions to fail since the deposits are rejected by the user. To overcome this, an exchange might choose to setup an account locker such that any deposits rejected by the account are deposited into the account locker for the account to claim them at a later point. This eliminates the chance of exchange transactions failing due to account deposit rules and is much easier to setup compared to authorized depositor badges.
- **Bridges:** The account locker blueprint can be useful to bridges when assets are being sent to the Radix network. A bridge would first attempt to deposit the resources directly into the account and if that deposit fails they can store them in their locker so they can be claimed by the account owner later on. This approach removes the friction that comes with authorized depositor badges and user claim badges.

## Features

The features of the `AccountLocker` blueprint are as follows:

- An account-first design with an interface optimized for use with the native account blueprint.
- The ability for an administrator (called the `storer`) to deposit resources into their locker component.
- The ability for an administrator (called the `recoverer`) to forcefully withdraw resources from their locker component.
- The ability for an administrator (called the `recoverer`) to give up their ability to forcefully withdraw resources from the locker component.
- The ability for a user to claim resources destined to their account.
- The ability for the locker blueprint to determine if the claim is allowed to go forward or not by reading and asserting against the owner role of the account.

The functionality provided by the account locker blueprint is perhaps better explained by the state machine seen below:

<p align="center">


</p>

This state machine represents the movement of resources between an account, the worktop, and an account locker component. The resources start in an account and could be withdrawn to the worktop.

If the `store` method is called by the `storer` role then the resources move from the worktop and into the locker component to be stored and returned to the claimant when they request to claim. If the `try_direct_send` flag was set to `true` then the locker attempts to deposit them into the destination (claimant) account. The deposit will be done using `try_deposit_or_refund` meaning that if the deposit fails the resources will be refunded back to the locker. In such cases, the locker will store the resources to be claimed later on.

Resources leave the locker and go to the worktop by calling the `claim` or `recover` methods. The `claim` method is callable by users to claim the resources that are locked for them in the account locker while the `recover` method is callable by the `recoverer` role to recover resources that have been stored in the account locker but have not been claimed. The ability for resources to be recovered can be given up by setting the `recoverer` and `recoverer_updater` roles to `AccessRule::DenyAll`. Once the resources are back in the worktop they can be deposited into the account or perhaps even back into the locker.

## Roles

This section defines the different roles that exist on the account locker blueprint, their capabilities, and their upgradeability.

| Role Name | Capabilities | Update |
|----|----|----|
| Owner | The owner role is not given any explicit capabilities aside from the implicit ability to update metadata on the component. | This is determined by the instantiator of the component and whether they pass in an `OwnerRole::Updatable` or `OwnerRole::Fixed` when instantiating the component. |
| `storer` | An administrator role with the authority to store resources in the locker for a specific account to claim. | Updatable by the `storer_updater` role. |
| `storer_updater` | Controls who can update the `storer` role access rule. | It can update itself. |
| `recoverer` | An administrator role with the authority to forcefully withdraw (recover) any assets previously deposited into the locker out of it. | Updatable by the `recoverer_updater` role. |
| `recoverer_updater` | Controls who can update the `recoverer` role access rule. | It can update itself. |

## State

The state of the account locker blueprint has no fields and just has a single collection where the key is the claimant account address and the value is a `KeyValueStore<ResourceAddress, Vault>`.

## Interface

The interface of the `AccountLocker` has an account-first interface where all of the methods and functions take in a `Global<Account>` and not just a `ComponentAddress`.

### Functions

<table>

<tr>

<td>

Name
</td>

<td>

<code>instantiate</code>
</td>

</tr>

<tr>

<td>

Type
</td>

<td>

Function
</td>

</tr>

<tr>

<td>

Callable By
</td>

<td>

Anyone
</td>

</tr>

<tr>

<td>

Description
</td>

<td>

This function instantiates a new account locker returning a <code>Global\<AccountLocker\></code> back to the caller configured based on the passed arguments.
</td>

</tr>

<tr>

<td>

Events
</td>

<td>

None
</td>

</tr>

<tr>

<td>

Arguments
</td>

<td>

<ul>

<li>

<code>owner_role: OwnerRole</code> - The definition of the role that owns the instantiated component. As described in the “Roles” section, the owner role is not given any powers aside from the implicit metadata roles.
</li>

<li>

<code>storer_role: AccessRule</code> - The access rule to assign to the role that can deposit resources into the account locker for user accounts to claim at a later point.
</li>

<li>

<code>storer_updater_role: AccessRule</code> - The access rule to assign to the role that can update the <code>AccessRule</code> controlling who can deposit resources into the account locker component.
</li>

<li>

<code>recoverer_role: AccessRule</code> - The access rule to assign to the role that can forcefully withdraw resources out of the account locker component.
</li>

<li>

<code>recoverer_updater_role: AccessRule</code> - The access rule to assign to the role that can forcefully withdraw resources out of the account locker component.
</li>

<li>

<code>address_reservation: Option\<GlobalAddressReservation\></code> - An optional address reservation to use when globalizing the account locker component.
</li>

</ul>

</td>

</tr>

<tr>

<td>

Returns
</td>

<td>

<code>Global\<AccountLocker\></code> - A reference to the global account locker component instantiated in this function.
</td>

</tr>



<table>

<tr>

<td>

Name
</td>

<td>

<code>instantiate_simple</code>
</td>

</tr>

<tr>

<td>

Type
</td>

<td>

Function
</td>

</tr>

<tr>

<td>

Callable By
</td>

<td>

Anyone
</td>

</tr>

<tr>

<td>

Description
</td>

<td>

<p>

This function instantiates a new account locker returning a <code>Global\<AccountLocker\></code> back to the caller configured based on the passed arguments.

This is a second constructor for the blueprint that is meant to be much simpler than the instantiate function. This creates a new admin badge resource and uses it as the owner, storer, storer_updater, recoverer, and recoverer_updater depending on whether the instantiator wishes to allow for forceful withdraws from the component.

If the <code>allow_recover</code> argument is set to true then the admin badge created in this function will be set as the recoverer and recoverer_updater role. Otherwise, if it’s set to false then those roles are set to <code>rule!(deny_all)</code> which effectively means that no one is allowed to forcefully withdraw resources from the account locker. Once a claim is deposited into it then it either gets claimed or stays there forever.

Under the hood, aside from the creation of the admin badge resource, this function will call <code>instantiate</code>.
</p>

    </td>

</tr>

<tr>

<td>

Events
</td>

<td>

None
</td>

</tr>

<tr>

<td>

Arguments
</td>

<td>

<ul>

<li>

<code>allow_recover: bool</code> - A boolean that controls whether forceful withdraws of resources in the account locker should be allowed for the admin badge created by this function. If true then the admin badge can withdraw any resources in the component, otherwise, no one can perform forceful withdraws.
</li>

</ul>

</td>

</tr>

<tr>

<td>

Returns
</td>

<td>

<ul>

<li>

<code>Global\<AccountLocker\></code> - A reference to the global account locker component instantiated in this function.
</li>

<li>

<code>Bucket</code> - A bucket containing the admin badge created in this function.
</li>

</ul>

</td>

</tr>



### Methods

#### `storer` Role Methods

This section contains the methods that are callable by the `storer` role which are: `store` and `airdrop`. These two methods perform the same functionality: Storing resources in the locker for users to claim and *potentially* first attempting to deposit the resources into the claimant’s account before storing them if a `try_direct_send` flag is set to `true`. The main difference between these two methods is that the `airdrop` method can be thought of as a batch version of `store` that provides an interface that makes airdrops simpler. Where `store` takes in a single claimant account, `airdrop` takes in *multiple* claimant accounts and distributes the passed bucket according to the specified amounts/ids and then calls `store` for each claimant and bucket.

<table>

<tr>

<td>

Name
</td>

<td>

<code>store</code>
</td>

</tr>

<tr>

<td>

Type
</td>

<td>

Method
</td>

</tr>

<tr>

<td>

Callable By
</td>

<td>

<code>storer</code> Role
</td>

</tr>

<tr>

<td>

Description
</td>

<td>

<p>

A privileged method that can be called only by the <code>storer</code> role to store some resources in the locker to be claimed by a particular account or attempt to deposit them into the claimant’s account.

If the account does not have any prior resources locked in the locker then a new <code>KeyValueStore\<ResourceAddress, Vault\></code> will be created for the account. Similarly, if a particular account and resource address pair does not have a corresponding vault then a new entry will be added to the aforementioned key-value store with a newly created vault.

The behavior of this method changes depending on the <code>try_direct_send</code> flag. When <code>true</code> this method will first attempt to deposit the resources into the account. If the deposit fails then the resources will be stored in the locker. Otherwise, if the flag is <code>false</code> then no deposit will be attempted and the resources will be stored in the locker for the account to claim.

This method emits a <code>StoreEvent</code> when resources are stored in the locker. In cases when a deposit is attempted and succeeds then no <code>StoreEvent</code> is emitted as nothing was stored in the locker.
</p>

    </td>

</tr>

<tr>

<td>

Events
</td>

<td>

A <code>StoreEvent</code> is emitted for each account claim stored in the locker. Any claims that were successfully deposited into their destination accounts will not have this event emitted for them.
</td>

</tr>

<tr>

<td>

Arguments
</td>

<td>

<ul>

<li>

<code>claimant: Global\<Account\></code> - A global account address of the account that can claim the stored resources. If true then the admin badge can withdraw any resources in the component, otherwise, no one can perform forceful withdraws.
</li>

<li>

<code>bucket: Bucket</code> - A bucket of resources to store in the account locker for the claimant account allowing them to claim it at a later point.
</li>

<li>

<code>try_direct_send: bool</code> - Controls whether this method will first attempt to deposit the resources into the claimant account or not. If <code>true</code> then a deposit into the account will be attempted.
</li>

</ul>

</td>

</tr>

<tr>

<td>

Returns
</td>

<td>

None
</td>

</tr>



<table>

<tr>

<td>

Name
</td>

<td>

<code>airdrop</code>
</td>

</tr>

<tr>

<td>

Type
</td>

<td>

Method
</td>

</tr>

<tr>

<td>

Callable By
</td>

<td>

<code>storer</code> Role
</td>

</tr>

<tr>

<td>

Description
</td>

<td>

<p>

A privileged method that can be called only by the <code>storer</code> role to perform an airdrop into some accounts.

This method takes in a single bucket of resources and a map of claimants and the amount that they’re to be given. The bucket is distributed among the claimants according to the amounts/ids specified for each claimant. The behavior then differs based on the <code>try_direct_send</code> flag. For each claimant and bucket if the <code>try_direct_send</code> flag is set to true then the locker component will first attempt to deposit the resources into the account and if the deposit fails then they will be stored in the locker.

Since this method distributes the bucket among the claimants there could potentially be some change at the end. In this case, a <code>Bucket</code> is returned from this method with that change.

If the <code>try_direct_send</code> flag is set to true some deposits might succeed and some might fail, in which case the ones that failed will be stored in the locker (not returned back to the caller). A <code>StoreEvent</code> is emitted for each claim that is stored in the locker meaning that ones that were successfully deposited into accounts won’t have events emitted for them.
</p>

    </td>

</tr>

<tr>

<td>

Events
</td>

<td>

A <code>StoreEvent</code> is emitted for each account claim stored in the locker. Any claims that were successfully deposited into their destination accounts will not have this event emitted for them.
</td>

</tr>

<tr>

<td>

Arguments
</td>

<td>

<ul>

<li>

<code>claimants: IndexMap\<Global\<Account\>, ResourceSpecifier\></code> - An <code>IndexMap</code> of all of the claimants and the amount or ids of resources that go to them.
</li>

<li>

<code>bucket: Bucket</code> - A bucket of resources. Ideally, the sum of all of the <code>ResourceSpecifier</code>s in the claimants should total up to what is in this bucket. If it does not, then some change is returned. This bucket will be split up across the claimants based on the specified <code>ResourceSpecifier</code>
</li>

<li>

<code>try_direct_send: bool</code> - Controls whether this method will first attempt to deposit the resources into the claimant account or not. If <code>true</code> then a deposit into the account will be attempted.
</li>

</ul>

</td>

</tr>

<tr>

<td>

Returns
</td>

<td>

<code>Option\<Bucket\></code> - A bucket of change of the unused resources.
</td>

</tr>



#### `recoverer` Methods

This section has an API reference for the methods that are callable by the `recoverer` role which are two methods: `recover` and `recover_non_fungibles`. Both of these two methods provide the same functionality: the ability for the `recoverer` role to forcefully withdraw resources from the account locker that they might have previously committed to the locker. This can be useful in many cases including airdropped resources that were not claimed within a specified period. The main difference between these two methods is the same as the difference between the `withdraw` and the `withdraw_non_fungibles` method on account: it’s whether the recovery will happen based on the amount or ids of resources.

<table>

<tr>

<td>

Name
</td>

<td>

<code>recover</code>
</td>

</tr>

<tr>

<td>

Type
</td>

<td>

Method
</td>

</tr>

<tr>

<td>

Callable By
</td>

<td>

<code>recoverer</code> Role
</td>

</tr>

<tr>

<td>

Description
</td>

<td>

<p>

A privileged method that can be called only by the <code>recoverer</code> role to forcefully withdraw resources from the account locker.

This method allows the <code>recoverer</code> role to recover or forcefully withdraw resources from the account locker. This might be useful in cases when the resources have been there for a while and have not been claimed. If the <code>recoverer</code> and <code>recoverer_updater</code> are set to <code>rule!(deny_all)</code> then no resources can be recovered from the account locker.

This method follows the behavior of the <code>withdraw</code> method on the account blueprint in terms of the fungible and non-fungible treatment. More specifically it allows for recovery of both fungible and non-fungible resources by amount.
</p>

    </td>

</tr>

<tr>

<td>

Events
</td>

<td>

A <code>RecoverEvent</code> is emitted when a claim is recovered.
</td>

</tr>

<tr>

<td>

Arguments
</td>

<td>

<ul>

<li>

<code>claimant: Global\<Account\></code> - A global account address of the account to forcefully withdraw resources from their claims.
</li>

<li>

<code>resource_address: ResourceAddress</code> - The address of the resource to forcefully withdraw.
</li>

<li>

<code>amount: Decimal</code> - The amount of resources to forcefully withdraw.
</li>

</ul>

</td>

</tr>

<tr>

<td>

Returns
</td>

<td>

<code>Bucket</code> - A bucket of the resources forcefully withdrawn.
</td>

</tr>



<table>

<tr>

<td>

Name
</td>

<td>

<code>recover_non_fungibles</code>
</td>

</tr>

<tr>

<td>

Type
</td>

<td>

Method
</td>

</tr>

<tr>

<td>

Callable By
</td>

<td>

<code>recoverer</code> Role
</td>

</tr>

<tr>

<td>

Description
</td>

<td>

<p>

A privileged method that can be called only by the <code>recoverer</code> role to forcefully withdraw resources from the account locker.

This method allows the <code>recoverer</code> role to recover or forcefully withdraw resources from the account locker. This might be useful in cases when the resources have been there for a while and have not been claimed. If the <code>recoverer</code> and <code>recoverer_updater</code> are set to <code>rule!(deny_all)</code> then no resources can be recovered from the account locker.
</p>

    </td>

</tr>

<tr>

<td>

Events
</td>

<td>

A <code>RecoverEvent</code> is emitted when a claim is recovered.
</td>

</tr>

<tr>

<td>

Arguments
</td>

<td>

<ul>

<li>

<code>claimant: Global\<Account\></code> - A global account address of the account to forcefully withdraw resources from their claims.
</li>

<li>

<code>resource_address: ResourceAddress</code> - The address of the resource to forcefully withdraw.
</li>

<li>

<code>ids: IndexSet\<NonFungibleLocalId\></code> - The set of non-fungible local ids to recover.
</li>

</ul>

</td>

</tr>

<tr>

<td>

Returns
</td>

<td>

<code>Bucket</code> - A bucket of the resources forcefully withdrawn.
</td>

</tr>



#### User Methods

This section has an API reference for the methods that are publicly callable on locker components which are the `claim` and `claim_non_fungibles` methods. Much like the `recoverer` role methods, the main difference between these two methods is the same as the difference between the `withdraw` and the `withdraw_non_fungibles` method on account: it’s whether the claim will happen based on the amount or ids of resources.

<table>

<tr>

<td>

Name
</td>

<td>

<code>claim</code>
</td>

</tr>

<tr>

<td>

Type
</td>

<td>

Method
</td>

</tr>

<tr>

<td>

Callable By
</td>

<td>

Anyone
</td>

</tr>

<tr>

<td>

Description
</td>

<td>

<p>

A public method called by the claimant to claim their resources from the account locker.

To determine if the claim is allowed to go through this method reads the claimant’s owner role and asserts against it. If the assertion is successful then the claim is allowed to go through, otherwise, the transaction fails.

If the owner check succeeds then the amount specified as an argument will be claimed from the vault associated with the passed claimant and resource address.

This method follows the behavior of the <code>withdraw</code> method on the account blueprint in terms of the fungible and non-fungible treatment. More specifically it allows for claiming of both fungible and non-fungible resources by amount.
</p>

    </td>

</tr>

<tr>

<td>

Events
</td>

<td>

A <code>ClaimEvent</code> is emitted when resources are claimed.
</td>

</tr>

<tr>

<td>

Arguments
</td>

<td>

<ul>

<li>

<code>claimant: Global\<Account\></code> - A global account address of the claimant.
</li>

<li>

<code>resource_address: ResourceAddress</code> - The address of the resource to claim.
</li>

<li>

<code>amount: Decimal</code> - The amount of resources to claim.
</li>

</ul>

</td>

</tr>

<tr>

<td>

Returns
</td>

<td>

<code>Bucket</code> - A bucket of the resources claimed.
</td>

</tr>



<table>

<tr>

<td>

Name
</td>

<td>

<code>claim_non_fungibles</code>
</td>

</tr>

<tr>

<td>

Type
</td>

<td>

Method
</td>

</tr>

<tr>

<td>

Callable By
</td>

<td>

Anyone
</td>

</tr>

<tr>

<td>

Description
</td>

<td>

<p>

A public method called by the claimant to claim their resources from the account locker.

To determine if the claim is allowed to go through this method reads the claimant’s owner role and asserts against it. If the assertion is successful then the claim is allowed to go through, otherwise, the transaction fails.

If the owner check succeeds then the amount specified as an argument will be claimed from the vault associated with the passed claimant and resource address.
</p>

    </td>

</tr>

<tr>

<td>

Events
</td>

<td>

A <code>ClaimEvent</code> is emitted when resources are claimed.
</td>

</tr>

<tr>

<td>

Arguments
</td>

<td>

<ul>

<li>

<code>claimant: Global\<Account\></code> - A global account address of the claimant.
</li>

<li>

<code>resource_address: ResourceAddress</code> - The address of the resource to claim.
</li>

<li>

<code>ids: IndexSet\<NonFungibleLocalId\></code> - The set of non-fungible local ids to claim.
</li>

</ul>

</td>

</tr>

<tr>

<td>

Returns
</td>

<td>

<code>Bucket</code> - A bucket of the resources claimed.
</td>

</tr>



#### Getter Methods

<table>

<tr>

<td>

Name
</td>

<td>

<code>get_amount</code>
</td>

</tr>

<tr>

<td>

Type
</td>

<td>

Method
</td>

</tr>

<tr>

<td>

Callable By
</td>

<td>

Anyone
</td>

</tr>

<tr>

<td>

Description
</td>

<td>

A public method that can be called by anyone to get the amount of resources currently available in a claimant’s vault.
</td>

</tr>

<tr>

<td>

Events
</td>

<td>

None
</td>

</tr>

<tr>

<td>

Arguments
</td>

<td>

<ul>

<li>

<code>claimant: Global\<Account\></code> - A global account address of the claimant.
</li>

<li>

<code>resource_address: ResourceAddress</code> - The address of the resource to get the amount of.
</li>

</ul>

</td>

</tr>

<tr>

<td>

Returns
</td>

<td>

<code>Decimal</code> - The amount of the resources in the vault.
</td>

</tr>



<table>

<tr>

<td>

Name
</td>

<td>

<code>get_non_fungible_local_ids</code>
</td>

</tr>

<tr>

<td>

Type
</td>

<td>

Method
</td>

</tr>

<tr>

<td>

Callable By
</td>

<td>

Anyone
</td>

</tr>

<tr>

<td>

Description
</td>

<td>

A public method that can be called by anyone to get the non-fungible local IDs of resources currently available in a claimant’s vault.
</td>

</tr>

<tr>

<td>

Events
</td>

<td>

None
</td>

</tr>

<tr>

<td>

Arguments
</td>

<td>

<ul>

<li>

<code>claimant: Global\<Account\></code> - A global account address of the claimant.
</li>

<li>

<code>resource_address: ResourceAddress</code> - The address of the resource to get the ids of.
</li>

<li>

<code>limit: u32</code> - An upper limit on the number of ids to return.
</li>

</ul>

</td>

</tr>

<tr>

<td>

Returns
</td>

<td>

<code>IndexSet\<NonFungibleLocalId\></code> - The set of the first <code>limit</code> non-fungible local ids in the vault.
</td>

</tr>



## Events

The structure of the events that can be emitted by the account locker blueprint is as follows:

``` rust
#[derive(ScryptoSbor, ScryptoEvent, Debug, Clone, PartialEq, Eq)]
pub struct StoreEvent {
    pub claimant: Global<Account>,
    pub resource_address: ResourceAddress,
    pub resources: ResourceSpecifier,
}

#[derive(ScryptoSbor, ScryptoEvent, Debug, Clone, PartialEq, Eq)]
pub struct RecoverEvent {
    pub claimant: Global<Account>,
    pub resource_address: ResourceAddress,
    pub resources: ResourceSpecifier,
}

#[derive(ScryptoSbor, ScryptoEvent, Debug, Clone, PartialEq, Eq)]
pub struct ClaimEvent {
    pub claimant: Global<Account>,
    pub resource_address: ResourceAddress,
    pub resources: ResourceSpecifier,
}

#[derive(Clone, Debug, ScryptoSbor, ManifestSbor, PartialEq, Eq)]
pub enum ResourceSpecifier {
    Fungible(Decimal),
    NonFungible(IndexSet<NonFungibleLocalId>),
}
```

As seen in the Interface section, three main event types are emitted by the account locker.

- `StoreEvent` - This is an event emitted when resources are stored in the account locker and is potentially emitted when calling the `store` and `airdrop` methods. It is only emitted for resources that were actually stored in the account locker, resources that were successfully deposited into accounts do not emit this event.
- `RecoverEvent` - This is an event emitted when resources are forcefully withdrawn from the account locker and is emitted when calling the `recover` and `recover_non_fungibles` methods.
- `ClaimEvent` - This is an event emitted when resources are claimed from the account locker and is emitted when calling the `claim` and `claim_non_fungible` methods.

The events should be reconcilable and the state of the account locker can be determined through events alone: \* **Fungible Resources:** Given a particular claimant account address and resource address the amount that the account locker has for it to claim can be determined by summing the `StoreEvent` for the claimant and resource and subtracting the `RecoverEvent` and `ClaimEvent` for the claimant and resource. \* **Non-Fungible Resources:** Given a particular claimant account address and resource address the non-fungible IDs that the account locker has for it to claim can be determined by **sequential** union and difference operations on the set of non-fungibles the locker has, in the order that the events were emitted. Before observing any events we start with an empty set of non-fungibles the locker has. `StoreEvent`s are union operations with the stored non-fungibles. `RecoverEvent`s and `ClaimEvent`s are difference operations with the stored non-fungibles.

Clients interested in reconciling the state of an account locker through events alone can find a reference implementation of state reconciliation in the account locker tests [here](https://github.com/radixdlt/radixdlt-scrypto/blob/2fe31d6ea6ef0434e706eb5196535fd31beeb9a2/radix-engine-tests/tests/blueprints/account_locker.rs#L2910-L2942). Although this example is in Rust, the logic is still the same as what is described above regardless of what the language is.

## Metadata

When a locker component is instantiated it comes with no metadata whatsoever. It’s the job of the owner role to add metadata to it as it sees fit. Standards-wise, a locker component would just need to have the typical `dapp_definition` metadata field that components have as described by the [“Metadata for Wallet Verification”](../metadata/metadata-for-verification.md) document.

The metadata standard of dApp definitions would change very slightly to accommodate for locker components:

1.  DApp definition accounts would have a new metadata field called `account_locker` of the type `GlobalAddress` which is the address of the account locker that the dApp is using.
2.  The address of the account locker must be added to the `claimed_entities` vector.

If the dApp does not wish to have an account locker then there is no need for the `account_locker` metadata field.

If a dApp only adds their account locker to the `claimed_entities` field of the dApp definition but does not add it to the `account_locker` field then the wallet will not be able to discover the account locker and it will not prompt the user to claim the resources they have in that account locker. If an account locker is in the `account_locker` field and not in the `claimed_entities` field then this creates an invalid two-way link where the account locker potentially claims the dApp but the dApp does not claim the account locker.

## Examples

### Airdrop from Manifest

Doing an airdrop using the account locker blueprint is simple and involves two main steps: the first step is instantiating a new account locker component from the account locker blueprint ([get the `locker_package` address](../../reference/well-known-addresses.md)) and the second is performing the airdrop by calling the `airdrop` method on the account locker. Notice that none of these steps require a custom Scrypto blueprint, the entire airdrop process and the potential user claims can be done through a series of transaction manifests.

To create a new account locker we will use the `instantiate_simple` method which will create a new admin badge and set it as the owner, storer, and potentially the recoverer of the account locker. This method takes a single argument which is `allow_recover` that is a boolean that controls whether the admin can recover resources that have not been claimed. Since some people might not claim their airdrops in time we will set the `allow_recover` flag to true in this example.

``` py
CALL_METHOD
    Address("component_sim1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxhkrefh")
    "lock_fee"
    Decimal("5000")
;

# Calling the `instantiate_simpl` function on the locker package to create a 
# new account locker.
CALL_FUNCTION
    Address("package_sim1pkgxxxxxxxxxlckerxxxxxxxxxx000208064247xxxxxxxxxpnfcn6")
    "AccountLocker"
    "instantiate_simple"
    # This flag controls whether recovery of resources (forceful withdraws) are
    # allowed or not. We're setting it to true here as we would like to be able 
    # to recover resources that are in the locker and have not been claimed for
    # a long time.
    true
;

# At this point, the above instruction has returned an admin badge back that 
# we should deposit into some account. We will need this admin badge later on
# to call the `airdrop` method and perform the airdrop.
CALL_METHOD
    Address("account_sim1c8m6h4yv2x9ca0wx5ddtl0nctqmjt2t740wfjgj9w8sdz82zf8ppcr")
    "try_deposit_batch_or_abort"
    Expression("ENTIRE_WORKTOP")
    Enum<0u8>()
;
```

When the above manifest is executed we get an account locker and account locker badge with the following addresses:

- Account Locker Component: `locker_sim1dpu34m92wkkua3l0gmnre543plaxrlzezgjdpn3t7zx2f7wswv5jeq`
- Account Locker Admin Badge: `resource_sim1t5cyx3cv33nlxrnqjrl2thgkm3pecvsvm4kccannxv5pq0ydckv9n9`.

We will airdrop some XRD from the faucet to users. To perform the airdrop we will first need to create a proof of the account locker admin badge to allow us to call the `airdrop` method. Then, we can take the resources from the worktop and pass them to the `airdrop` method alongside a map that describes the amount that should go to each user. We will be setting the `try_direct_send` flag to `true` so that the locker first attempts to deposit the resources into the user accounts and then stores them in the locker if the deposit fails. The following is the manifest we’re using to airdrop resources in this example:

``` py
CALL_METHOD
    Address("component_sim1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxhkrefh")
    "lock_fee"
    Decimal("5000")
;

# Creating a proof of the locker admin badge. This is required to be able to call the `airdrop`
# method on the account locker.
CALL_METHOD
    Address("account_sim1c8m6h4yv2x9ca0wx5ddtl0nctqmjt2t740wfjgj9w8sdz82zf8ppcr")
    "create_proof_of_amount"
    Address("resource_sim1t5cyx3cv33nlxrnqjrl2thgkm3pecvsvm4kccannxv5pq0ydckv9n9")
    Decimal("1")
;

# Getting some XRD from the faucet to deposit to the users and taking them from the worktop and into
# a bucket.
CALL_METHOD
    Address("component_sim1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxhkrefh")
    "free"
;
TAKE_ALL_FROM_WORKTOP
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    Bucket("bucket1")
;
CALL_METHOD
    Address("locker_sim1dpu34m92wkkua3l0gmnre543plaxrlzezgjdpn3t7zx2f7wswv5jeq")
    "airdrop"
    # A map of the accounts to airdrop resources to and the amount to airdrop. The following means
    # that we're airdropping to 5 accounts 1 XRD each.
    Map<Address, Enum>(
        Address("account_sim168fghy4kapzfnwpmq7t7753425lwklk65r82ys7pz2xzleehgpzql2") => Enum<0u8>(
            Decimal("1")
        ),
        Address("account_sim168xl3zsangfxv76ma08hfsrdqt546w8mttjy6h7q7stfnngpdu3se2") => Enum<0u8>(
            Decimal("1")
        ),
        Address("account_sim169490zsun80mg3y0j23ghccm2sw0a4f0rdshxnj2alqcj98c4haksj") => Enum<0u8>(
            Decimal("1")
        ),
        Address("account_sim16xgxu5za5du40x04e0ucxfwxquryrlaezjpvucr2vy26thckmerguq") => Enum<0u8>(
            Decimal("1")
        ),
        Address("account_sim16ypm9kwhamw67kpjhd5rcdpvy3s7levkvr537lpeppjwl6ju0z7k0c") => Enum<0u8>(
            Decimal("1")
        ),
    )
    # The bucket of XRD to split across the recipients.
    Bucket("bucket1")
    # This flag controls if the account locker should first attempt to deposit the resources in the
    # claimant accounts or not. When `true` a deposit will be attempted. If the deposit fails then
    # the resources will be stored in the account locker.
    true
;

# Any resources or change that remains will be deposited into our account.
CALL_METHOD
    Address("account_sim1c8m6h4yv2x9ca0wx5ddtl0nctqmjt2t740wfjgj9w8sdz82zf8ppcr")
    "try_deposit_batch_or_abort"
    Expression("ENTIRE_WORKTOP")
    Enum<0u8>()
;
```

### Programmatic Locker from Scrypto

This is another example that uses the account locker blueprint to build a gumball machine that, instead of returning the gumball token back, attempts to deliver it directly and falls back to storing it in an account locker that it controls, for the user to claim later.

``` rust
use scrypto::prelude::*;

#[blueprint]
mod gumball_machine {
    struct GumballMachine {
        /// The account locker that the gumball machine uses to send resource to
        /// users.
        account_locker: Global<AccountLocker>,

        /// A reference to the resource manager of the gumball resource.
        gumball_resource: ResourceManager,
    }

    impl GumballMachine {
        pub fn instantiate() -> Global<GumballMachine> {
            // For convenience we will be setting the global caller badge of
            // this component as the owner, storer, and recoverer of the account
            // locker and the owner and minter of the gumball resource. To do
            // this we must first allocate a global address to derive the global
            // caller badge from.
            let (
                gumball_machine_address_reservation,
                gumball_machine_component_address,
            ) = Runtime::allocate_component_address(
                GumballMachine::blueprint_id(),
            );
            let global_caller_badge_rule = rule!(require(global_caller(
                gumball_machine_component_address
            )));

            // Instantiating a new account locker component.
            let account_locker = Blueprint::<AccountLocker>::instantiate(
                OwnerRole::Updatable(global_caller_badge_rule.clone()),
                global_caller_badge_rule.clone(),
                global_caller_badge_rule.clone(),
                global_caller_badge_rule.clone(),
                global_caller_badge_rule.clone(),
                None,
            );

            // Creating a new resource that is only mintable by the gumball
            // machine.
            let resource_manager = ResourceBuilder::new_fungible(
                OwnerRole::Updatable(global_caller_badge_rule.clone()),
            )
            .divisibility(0)
            .mint_roles(mint_roles! {
                minter => global_caller_badge_rule.clone();
                minter_updater => global_caller_badge_rule;
            })
            .create_with_no_initial_supply();

            // Instantiate and globalize the component.
            Self {
                account_locker,
                gumball_resource: resource_manager,
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .with_address(gumball_machine_address_reservation)
            .globalize()
        }

        /// Calls `store` on the account locker with `try_direct_send` set to
        /// [`true`] meaning that it will first attempt ot deposit the resource
        /// in the specified destination account and if that fails it will store
        /// it in the locker.
        pub fn free(&mut self, destination_address: Global<Account>) {
            let bucket = self.gumball_resource.mint(1);
            self.account_locker.store(destination_address, bucket, true);
        }
    }
}
```
