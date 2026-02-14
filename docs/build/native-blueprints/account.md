---
title: "Do something with the owner badge, ideally create an access controller and deposit"
---

Unlike most blockchain platforms, an account on Radix are not simply associated with your public and private key. Instead, an account is a component, instantiated from a built-in account blueprint provided by the system which exist in the application layer. Even though accounts are implemented in the application layer, account components are unique in that they’re afforded some unique features that are not afforded to other normal components. As a result, accounts on Radix can contain resources and have special logic built into it.

## Account Authentication

An account has an owner which controls the account, and the owner of the account is able to:

- Lock a fee from the XRD vault that the account may hold to pay for transaction fees.

- Manage the account by withdrawing and depositing resources.

- Create proofs against resources that the account stores.

- Configure which deposits the account accepts and rejects.

Furthermore, account components have a security model which employs a Role Based Access Control (RBAC) model where there are pre-configured roles which are mapped to privileged methods that only these roles have access to. These are roles to delineate who is allowed to do what with the account.

The account blueprint has two pre-configured roles by default: `Owner` and `Securify`.

- The `Owner` role is given the ability to call all the privileged methods on the account (such as methods that withdraw and deposit resources or lock XRD for fee payment).

- The `Securify` role is the role that can call the appropriate methods that "securifies" the account. This allows to expand the accounts authorization model and enables things like multi-factor control. More information on account securificaton is provided in the [Account Securification](account.md#account-securification) section.

While the `Owner` can expand who is allowed to access their account by re-configuring the roles, by default at instantiation, both roles are associated to the owner.

The diagram below shows a complete list of the account methods and the roles that they map to, in other terms, it shows the roles that are authorized to call these methods. It also shows the mapping of the roles to the access rules. All the methods seen in the diagram below are explained in detail in the [API Reference](account.md#api-reference) section of the document.







![account-tree.png](/img/account-tree.png)

## How the Account Component Works

Use of Radix accounts is done through calls to component methods using the transaction manifest (as with any component).

For example, a simple transfer of 10 XRD tokens from Alice’s account to Bob’s is accomplished by creating a [transaction manifest](../learning-step-by-step/create-and-use-transaction-manifests.md) that describes these steps:

- Lock fees to pay for the transaction

- Call the `withdraw` method on Alice’s account component, requesting 10 XRD

- Take the returned tokens from the worktop and put them in a bucket

- Pass this bucket to the `try_deposit_or_x` method of Bob’s account component

As long as Alice’s account does in fact have 10 XRD to withdraw (and is authorized to withdraw from that component - more on this below), the 10 XRD are returned and deposited in Bob’s account (as long as Bob’s account is not configured to deny XRD). If any of these assumptions are incorrect, the whole transaction fails.

In this way, using a Radix-style account is intuitively like getting cash from your wallet when you want to pay for something.

## Account Addresses and Pre-allocation

There are two main types of account address:

- Addresses for **pre-allocated** accounts, which are implicitly instantiated via on-ledger interactions. These addresses encode either a `Secp256k1` or `Ed25519` public key hash, and at instantiation time, the initial `Owner` role is assigned to require a signature of the corresponding public key.

- Addresses for **explicitly-allocated** accounts.

The difference between these addresses is what happens if no account has been instantiated at that address yet. A pre-allocated account effectively already exists in a “virtual” state before it is instantiated, and the Core API and Gateway API return data for an un-instantiated pre-allocated account address in this “virtual” state, as if it already existed. The first time it is interacted with on ledger (say, because it receives a deposit), the account shell gets instantiated automatically. The transaction which interacts with that account for the first time pays additional fees to instantiate the account.

The following is the algorithm used to derive the pre-allocated account address associated with a public key. This method is also made available by the Radix Engine Toolkit:

- Take an Ecdsa compressed Secp256k1 public key, or the standard Ed25519 public key.

- Hash the public key through Blake2b with 256 bit digests.

- Construct a 30 byte array by setting the first byte to `0xD1` for a Secp256k1 public key or `0x51` for an Ed25519 public key, and then appending the last 29 bytes of the public key hash.

- Bech32m encode the above with the `account_\${network_specifier}` HRP where the network_specifier depends on the network that the address will be used for (see [addressing](/v1/docs/addressing-on-radix)).

## Account Metadata and Owner Keys

There are various standards for Account metadata:

- Accounts can be configured as a [dApp Definition with certain metadata](../metadata/metadata-for-verification.md)

- For user accounts, the `owner_keys` property is used for [ROLA](../../reference/rola-radix-off-ledger-auth.md) verification

- In the future, a new standard metadata property will be published for setting encryption keys for message encryption.

## Configuring Account Deposit Modes and Resource Preference Map

There are two types of deposits for two different sets of callers:

- Privileged methods such as `deposit` and `deposit_batch` which accepts all deposits and can **only be called by the account owner**.

- Unprivileged methods such as `try_deposit_or_abort`, `try_deposit_or_refund`, `try_deposit_batch_or_abort`, and `try_deposit_batch_or_refund` that are reserved for third-parties who wish to deposit resources to an account.

Because privileged `deposit*` methods can only be called by the account owner, third-parties who wish to deposit resources to an account are **required** to use `try_deposit*` methods. The `try_deposit*` methods are reserved to allow account owners to configure how resources deposited to their account by third-parties are treated. As such, there are two settings that the owner of an account component can set up to configure how resources deposited are treated: the **Resource Preference Map** and the **Account Deposit Mode**.

- The Resource Preference Map is a granular per resource configuration that account owners can specify.

- The Account Deposit Mode is a fall-back configuration which determines how resources deposited into an account are broadly treated.

The resource preference map is the primary and first place that the account looks at when determining if a resource can be deposited or not and always supersedes configurations within the account deposit mode or any other account state.

### Resource Preference Map

The account component contains a "*resource preference*" map in its state. This map stores the **preference configuration of each specific resource** and can be thought of as the “*allow list*” and “*deny list*”. Technically speaking, the resource preference map is defined in code as `KeyValueStore<ResourceAddress, ResourcePreference>` where each address of a resource (indicated by their `ResourceAddress`) is mapped to a `ResourcePreference` which is an enum variant of `Allowed` and `Disallowed`.

In summary:

- If the `ResourcePreference` for some resource is `Allowed` then it is guaranteed to be deposited into the account, if the `ResourcePreference` for some resource is `Disallowed` then its guaranteed to be rejected by the account component, no other state matters.

- A resource cannot be in the “*allow list*” and “*deny list*” at the same time since a `KeyValueStore` does not allow for duplicate entries with the same key, thus, a resource can only be: `Allowed`, `Disallowed`, or has no entry in the resource preferences map.

The resource preference map of an account component can be configured through the `set_resource_preference` and `remove_resource_preference` methods by the owner. It’s important to note that resources are not special-cased to this resource preference mapping. Any resource can be put as a `Allowed` resource and any resource can be put as a `Disallowed` resource. This means even XRD can be `Disallowed` from being deposited into an account through unprivileged deposit methods.

### Account Deposit Mode

When an account doesn’t have a specific resource configured in the resource preference map, the account component then uses a broader mechanism: account deposit mode. The account deposit mode is a default treatment of resource deposits that are not specified in the resource preference map. An account deposit mode can be configured in the following ways:

- **Accept**: If the account doesn’t have a preference for a particular resource then permit the deposit of the resource.

- **Reject**: If the account doesn’t have a preference for a particular resource then reject the deposit of the resource.

- **Allow Existing** (or XRD): If the account doesn’t have a preference for a particular resource then permit the deposit of the resource IF the account has ever held the resource before **or** the resource is XRD.

  - Any resource that the account has a vault for can be deposited into the account while in this mode even if the vault in the account is empty for that particular resource.

  - If the user wishes to make exceptions to this (to e.g. prevent XRD deposits, or deposits of a previously-held resource), they can configure these explicitly using the resource preference map.

The default deposit mode of an account can be configured through the `set_default_deposit_rule` method by the owner.

In summary:

- If a resource isn’t configured in the resource preference map then the account’s default deposit mode comes into the picture which can either be `Accept`, `Reject`, or `AllowExisting`.

### Authorized Depositors

With these account deposit configuration in mind, another feature to note is that the owner of an account can also specify authorized depositors. When owners specify authorized depositors to their account, the authorized depositors have special privileges which allows resource deposits into the account regardless of the account resource preferences and deposit mode setting. This effectively gives authorized depositors the same deposit privileges as the owner. Except of course the privileges starts and stops there and the owner can always revoke those privileges.

A small caveat is that, authorized depositors will still need to use `try_deposit*` methods even with their deposit privileges as the protected `deposit*` methods are only reserved for the owner.

When the owner wants to add an authorized depositor, they may do so by calling the `add_authorized_depositor` method. When calling this method, the owner can specify the `ResourceOrNonFungible` of an existing badge that the prospective authorized depositor may have or create one for the prospective authorized depositor to receive. The `ResourceOrNonFungible` is an input which accepts either a `ResourceAddress` if the badge used is a fungible resource or a `NonFungibleGlobalId` if the badge used is a non-fungible resource. Once specified, the badge will not be added to the account’s list of authorized depositor and the authorized depositor must have the badge present when making privileged deposits to the account.

For example, if the authorized depositor deposits a resource that have been specified as `Disallowed` in the resource preference map or that the account deposit mode is set to `Reject`, the account does the following:

1.  Check if the badge passed is in the account’s set of authorized depositors.

2.  Assert the presence of this badge in the auth zone.

3.  Permit the deposit.

The following is a complete flow chart showing the logic to determine if a deposit is allowed or not.







![account-deposit-flow-chart.png](/img/account-deposit-flow-chart.png)

## Account Securification

Owners of an account component are defined by the Owner role which is mapped to an access rule. By default, the access rule is configured to its key pairs derived from a seed phrase to control the account. Thereby, the process of securifying the account is to update the associated access rule of the Owner from its default setting to a new one which instead specifies a badge (otherwise known as an "owner badge") to control the account.

An account can be securified by calling the `securify` method on the account, this method returns a bucket that contains the account’s owner badge (which the Owner access rule is now updated to). This badge must then be stored somewhere, ideally in an access controller.

The `securify` method is only callable by the `Securify` role. When an account is first created, the `Securify` role is pre-configured to also be the `Owner`. However, after the account has been securified the `Securify` role is re-configured to `DenyAll`, meaning it can’t ever be changed again and the method can no longer be called.

Effectively, the securification process is the process of switching from signature mode (from key pairs) to badge mode, this is because the process changes the owner’s access rule from requiring a signature to requiring a badge instead. Switching the account authorization from signature mode to badge mode offers expanded authorization configuration for the owner as detailed in this article: <a href="https://www.radixdlt.com/blog/how-radix-multi-factor-smart-accounts-work-and-what-they-can-do" target="_blank">How Multi-Factor Radix Smart Accounts Work and What They Can Do</a>.

The securification process is an important process for the wallet. The wallet will have a dedicated flow for securifying accounts and creating an access controller to store the account’s owner badge into. The API Reference section contains an example of a manifest that securifies an account.

## Blueprint API - Function Reference

<a href="https://docs.rs/scrypto/1.2.0/scrypto/component/struct.Account.html" target="_blank">Account Component Rust Docs</a>

### Create



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
<td><strong>Callable by</strong></td>
<td>Public</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td>None</td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><ul>
<li><p><code>ComponentAddress</code>: The component address of the account component instantiated by this function.</p></li>
<li><p><code>Bucket</code>: A bucket containing the account owner badge associated with this account.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Creates a new global securified explicitly-allocated account and returns the <code>ComponentAddress</code> of the account and a <code>Bucket</code> of the account’s owner badge.</p>
<p>This function is used to create a new global securified explicitly-allocated account. It mints an owner badge and sets it as the owner role giving it the authority to call privileged methods on the account.</p></td>
</tr>
</tbody>




:::note
This function will never be called by the wallet for any of the wallet flows. It is documented here for the sake of completeness only. The wallet only creates pre-allocated accounts and none of the current flows include the use of explicitly-allocated accounts.
:::


**Transaction Manifest**

``` bash
CREATE_ACCOUNT;

TAKE_ALL_FROM_WORKTOP
    Address("\${account_owner_badge_address}")
    Bucket("owner_badge");

# Do something with the owner badge, ideally create an access controller and deposit 
# it there.
```

*Note that the transaction manifest above is not complete, more specifically, the account owner badge returned from the create function is not deposited anywhere in this manifest. Ideally, the account owner badge would be stored in an access controller.*

### Create Advanced



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>create_advanced</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Function</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td>Public</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><code>owner_role</code> - <code>OwnerRole</code>: The role definition of the account owner.</td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><code>ComponentAddress</code>: The component address of the account component instantiated by this function.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Creates a new global allocated account with the owner rule specified by the caller and returns the ComponenAddress of the account component.</p>
<p>While the create function automatically mints an owner badge and sets that as the owner role, this function allows the caller to specify the AccessRule associated with the owner role giving the caller more freedom on who can call privileged methods on the account.</p>
<p>This is useful for any application where the creator of the account wishes to have some kind of an m-of-n multi-signature account, a 1-of-n account, or an account whose owner is any arbitrarily complex AccessRule. An example of where this might be used is for exchanges which might want to have an account controlled by 4-of-6 signatures to ensure that a single compromised key does not result in the loss of funds. Most users of this function do not particularly need to have the multi-factor authentication and recovery logic of an access controller.</p></td>
</tr>
</tbody>




:::note
This function will never be called by the wallet for any of the wallet flows. It is documented here for the sake of completeness only. The wallet only creates pre-allocated accounts and none of the current flows include the use of global explicitly-allocated accounts.
:::


**Transaction Manifest**

``` bash
CREATE_ACCOUNT_ADVANCED
    Enum<OwnerRole::Updatable>(
        # Contrived example to show AccessRule configuration
        Enum<AccessRule::AllowAll>()
    );
```

## Component API - Method Reference

### Lock fee



|  |  |
|:---|:---|
| **Name** | `lock_fee` |
| **Type** | Method |
| **Callable by** | `Owner` role |
| **Arguments** | `amount` - `Decimal`: The amount of XRD to lock for fees. |
| **Returns** | None |
| **Description** | Locks some amount of XRD in fees from the account’s XRD vault. |



**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "lock_fee"
    Decimal("\${amount_of_xrd_to_lock_for_fees}");
```

### Lock contingent fee



|  |  |
|:---|:---|
| **Name** | `lock_contingent_fee` |
| **Type** | Method |
| **Callable by** | `Owner` role |
| **Arguments** | `amount` - `Decimal`: The amount of XRD to lock for fees. |
| **Returns** | None |
| **Description** | Locks some amount of XRD in fees from the account’s XRD vault which is contingent on the success of the transaction. If the transaction succeeds, then the locked XRD may be used for fees, if the transaction fails then the locked XRD is not used for fees. Because of this restriction, this fee doesn’t count towards payment during the transaction itself, so can’t be used on its own to pay the transaction fee during execution. |



**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "lock_contingent_fee"
    Decimal("\${amount_of_xrd_to_lock_for_fees}");
```

### Deposit



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>deposit</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td><code>Owner</code> role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><code>bucket</code> - <code>Bucket</code>: The bucket of resources to deposit into the account.</td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td>None</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Deposits a bucket of resources into the account.</p>
<p>This method is only callable by the account owner and does not do any of the checks discussed in the Account Deposit Modes section. It permits all deposits since it requires the owner authority to be present when calling it.</p>
<p>This method is intended to be used for transactions (such as dApp transactions) <strong>where the owner is present</strong>, and skips deposit mode checks. If building a transfer or deposit where the owner isn’t present, use <code>try_deposit_or_abort</code> instead. If the transaction needs to continue if the deposit doesn’t succeed (e.g. in an automated airdrop scenario), use <code>try_deposit_or_refund</code> instead.</p></td>
</tr>
</tbody>




**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "deposit"
    Bucket("some_bucket");
```

### Deposit batch



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>deposit_batch</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td><code>Owner</code> role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><code>buckets</code> - <code>Vec&lt;Bucket&gt;</code>: The buckets of resources to deposit into the account.</td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td>None</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Deposits multiple buckets of resources into the account.</p>
<p>This method is identical to <code>deposit</code> but deposits a vector of buckets instead of depositing a single bucket.</p>
<p>This method is intended to be used for transactions (such as dApp transactions) <strong>where the owner is present</strong>, and skips deposit mode checks. If building a transfer or deposit where the owner isn’t present, use <code>try_deposit_batch_or_abort</code> instead. If the transaction needs to continue if the deposit doesn’t succeed (e.g. in an automated airdrop scenario), use <code>try_deposit_batch_or_refund</code> instead.</p></td>
</tr>
</tbody>




**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "deposit_batch"
    Expression("ENTIRE_WORKTOP");
```

### Try deposit or abort



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>try_deposit_or_abort</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td>Public</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code>bucket</code> - <code>Bucket</code>: The bucket of resources to attempt to deposit into the account.</p></li>
<li><p><code>authorized_depositor_badge</code> - <code>Option&lt;ResourceOrNonFungible&gt;</code>: An optional parameter of authorized depositor badge to use for this deposit. If specified, then it will be checked and used if the deposit can’t go through without it.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td>None</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Attempts to deposit resources in the account, aborting the transaction if the deposit fails because the account has been configured to disallow the deposit.</p>
<p>This method is intended to be used for transfers or <strong>deposits where the owner isn’t present</strong>. If the owner is present, use <code>deposit</code> instead. If the transaction needs to continue if the deposit doesn’t succeed (e.g. in an automated airdrop scenario), use <code>try_deposit_or_refund</code> instead.</p></td>
</tr>
</tbody>




**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "try_deposit_or_abort"
    Bucket("some_bucket")
    None;
```

### Try deposit or refund



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>try_deposit_or_refund</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td><code>Owner</code> role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code>bucket</code> - <code>Bucket</code>: The bucket of resources to attempt to deposit into the account.</p></li>
<li><p><code>authorized_depositor_badge</code> - <code>Option&lt;ResourceOrNonFungible&gt;</code>: An optional parameter of authorized depositor badge to use for this deposit. If specified, then it will be checked and used if the deposit can’t go through without it.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><code>Option&lt;Bucket&gt;</code>: An optional bucket of resources. This is <code>Some</code> if the deposit failed and the bucket is being returned and <code>None</code> if the deposit succeeded.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Attempts to deposit resources in the account, refunding them returns them if the deposit fails.</p>
<p>This method attempts to deposit a bucket of resources into the account, if the account is configured to disallow deposits of this resource then they’re returned and refunded back as a bucket.</p>
<p>This method is intended to be used for automated airdrop scenarios where the owner isn’t present. If the owner is present, use <code>deposit</code> instead. For transfers, use <code>try_deposit_or_abort</code> instead.</p>
<p><strong>Using this method causes the manifest to be</strong> <a href="/v1/docs/conforming-transaction-manifest-types"><strong>non-conforming</strong></a><strong>.</strong></p></td>
</tr>
</tbody>




**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "try_deposit_or_refund"
    Bucket("some_bucket")
    None;
```

### Try deposit batch or abort



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>try_deposit_batch_or_abort</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td>Public</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code>buckets</code> - <code>Vec&lt;Bucket&gt;</code>: The buckets to attempt to deposit into the account.</p></li>
<li><p><code>authorized_depositor_badge</code> - <code>Option&lt;ResourceOrNonFungible&gt;</code>: An optional parameter of authorized depositor badge to use for this deposit. If specified, then it will be checked and used if the deposit can’t go through without it.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td>None</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Attempts to deposit buckets of resources into the account aborts the transaction if <strong>any</strong> of them can’t be deposited.</p>
<p>This method attempts to deposit buckets of resources into the account, if the account is configured to disallow deposit of <strong>any</strong> the resources then the transaction aborts.</p>
<p>This method is intended to be used for transfers or <strong>deposits where the owner isn’t present</strong>. If the owner is present, use <code>deposit_batch</code> instead. If the transaction needs to continue if the deposit doesn’t succeed (e.g. in an automated airdrop scenario), use <code>try_deposit_batch_or_refund</code> instead.</p></td>
</tr>
</tbody>




**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "try_deposit_batch_or_abort"
    Expression("ENTIRE_WORKTOP")
    None;
```

### Try deposit batch or refund



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>try_deposit_batch_or_refund</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td>Public</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code>buckets</code> - <code>Vec&lt;Bucket&gt;</code>: The buckets to attempt to deposit into the account.</p></li>
<li><p><code>authorized_depositor_badge</code> - <code>Option&lt;ResourceOrNonFungible&gt;</code>: An optional parameter of authorized depositor badge to use for this deposit. If specified, then it will be checked and used if the deposit can’t go through without it.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><code>Vec&lt;Bucket&gt;</code>: A vector of buckets which is empty if all the resources could be deposited and has the same length as the arguments if <strong>any</strong> of the resources could not be deposited.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Attempts to deposit buckets of resources into the account and refunds <strong>all</strong> of them if <strong>any</strong> of them can’t be deposited.</p>
<p>This method attempts to deposit buckets of resources into the account, if the account is configured to disallow deposit of <strong>any</strong> the resources then they’re <strong>all</strong> returned and refunded back as buckets.</p>
<p>This method is intended to be used for automated airdrop scenarios where the owner isn’t present. If the owner is present, use <code>deposit_batch</code> instead. For transfers, use <code>try_deposit_batch_or_abort</code> instead.</p>
<p><strong>Using this method causes the manifest to be</strong> <a href="/v1/docs/conforming-transaction-manifest-types"><strong>non-conforming</strong></a><strong>.</strong></p></td>
</tr>
</tbody>




**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "try_deposit_batch_or_refund"
    Expression("ENTIRE_WORKTOP")
    None;
```

### Withdraw



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>withdraw</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td><code>Owner</code> role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code>resource_address</code> - <code>ResourceAddress</code>: The resource address of the resource to withdraw from the account.</p></li>
<li><p><code>amount</code> - <code>Decimal</code>: The amount to withdraw from the account.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><code>Bucket</code>: A bucket of the withdrawn resources.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Withdraws resources from the account by amount.</p>
<p>This method withdraws a resource of the given address and amount from the account vaults and returns it in a <code>Bucket</code>.</p></td>
</tr>
</tbody>




**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "withdraw"
    Address("\${resource_address}")
    Decimal("\${amount}");
```

### Withdraw non-fungibles



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>withdraw_non_fungibles</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td><code>Owner</code> role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code>resource_address</code> - <code>ResourceAddress</code>: The resource address of the resource to withdraw from the account.</p></li>
<li><p><code>ids</code> - <code>BTreeSet&lt;NonFungibleLocalId&gt;</code>: The set of non-fungible local ids of the resource to withdraw from the account.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><code>Bucket</code>: A bucket of the withdrawn resources.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Withdraws resources from the account by <code>NonFungibleLocalIds</code>.</p>
<p>This method withdraws a resource of the given address and non-fungible local ids from the account vaults and returns it in a <code>Bucket</code>.</p></td>
</tr>
</tbody>




**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "withdraw_non_fungibles"
    Address("\${resource_address}")
    Array<NonFungibleLocalId>(NonFungibleLocalId("\${some_non_fungible_local_id}"));
```

### Lock fee and withdraw



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>lock_fee_and_withdraw</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td><code>Owner</code> role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code>amount_to_lock</code> - <code>Decimal</code>: The amount of XRD to lock for fees.</p></li>
<li><p><code>resource_address</code> - <code>ResourceAddress</code>: The resource address of the resource to withdraw from the account.</p></li>
<li><p><code>amount</code> - <code>Decimal</code>: The amount to withdraw from the account.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><code>Bucket</code>: A bucket of the withdrawn resources.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Locks some amount of XRD for fees and withdraws resources from the account by amount.</p>
<p>This is a composite method which calls both <code>lock_fee</code> and <code>withdraw</code> in a single call which makes this method slightly cheaper to use when we wish to lock some XRD for fees and also withdraw resources form the account.</p></td>
</tr>
</tbody>




**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "lock_fee_and_withdraw"
    Decimal("\${amount_of_xrd_to_lock_for_fees}")
    Address("\${resource_address}")
    Decimal("\${amount}");
```

### Lock fee and withdraw non-fungibles



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>lock_fee_and_withdraw_non_fungibles</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td><code>Owner</code> role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code>amount_to_lock</code> - <code>Decimal</code>: The amount of XRD to lock for fees.</p></li>
<li><p><code>resource_address</code> - <code>ResourceAddress</code>: The resource address of the resource to withdraw from the account.</p></li>
<li><p><code>ids</code> - <code>BTreeSet&lt;NonFungibleLocalId&gt;</code>: The set of non-fungible local ids of the resource to withdraw from the account.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><code>Bucket</code>: A bucket of the withdrawn resources.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Locks some amount of XRD for fees and withdraws resources from the account by non-fungible local ids</p>
<p>This is a composite method which calls both <code>lock_fee</code> and <code>withdraw_non_fungibles</code> in a single call which makes this method slightly cheaper to use when we wish to lock some XRD for fees and also withdraw resources form the account.</p></td>
</tr>
</tbody>




**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "lock_fee_and_withdraw_non_fungibles"
    Decimal("\${amount_of_xrd_to_lock_for_fees}")
    Address("\${resource_address}")
    Array<NonFungibleLocalId>(NonFungibleLocalId("\${some_non_fungible_local_id}"));
```

### Get balance



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>balance</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td>Public</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><code>resource_address</code> - <code>ResourceAddress</code>: The fungible or non-fungible resource address to read the balance of</li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><code>Decimal</code>: The total balance of the resource in the account</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Reads the total balance of the resource in the account. Returns zero if the resource isn’t present in the account.</p>
<p>First available at the [Cuttlefish](../../updates/protocol-updates/cuttlefish.md) protocol update.</p></td>
</tr>
</tbody>




**Scrypto**

``` rust
let account: Global<Account> = ...;
let balance = account.balance(resource_address);
```

### Get non-fungible local ids



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>non_fungible_local_ids</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td>Public</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code>resource_address</code> - <code>ResourceAddress</code>: The non-fungible resource address to read the non-fungible local ids of</p></li>
<li><p><code>limit</code> - <code>u32</code>: The total number of non-fungible ids to read</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><code>Vec&lt;NonFungibleLocalId&gt;</code>: A list of the top <code>limit</code> non-fungible local ids (or all that exist)</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Reads the non-fungible local ids in an account, up to some limit. Returns an empty list of the resource isn’t present in the account.</p>
<p>First available at the [Cuttlefish](../../updates/protocol-updates/cuttlefish.md) protocol update.</p></td>
</tr>
</tbody>




**Scrypto**

``` rust
let account: Global<Account> = ...;
let local_ids = account.non_fungible_local_ids(resource_address, 10);
```

### Has non-fungible



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>has_non_fungible</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td>Public</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code>resource_address</code> - <code>ResourceAddress</code>: The non-fungible resource address to check</p></li>
<li><p><code>local_id</code> - <code>NonFungibleLocalId</code>: The local id to check</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><code>bool</code>: Returns if the non-fungible local id is in the account</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Checks if the given non-fungible id is in the account.</p>
<p>First available at the [Cuttlefish](../../updates/protocol-updates/cuttlefish.md) protocol update.</p></td>
</tr>
</tbody>




**Scrypto**

``` rust
let account: Global<Account> = ...;
let is_present_in_account = account.has_non_fungible(resource_address, local_id);
```

### Create proof of amount



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>create_proof_of_amount</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td><code>Owner</code> role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code>resource_address</code> - <code>ResourceAddress</code>: The resource address of the resource to create a proof of.</p></li>
<li><p><code>amount</code> - <code>Decimal</code>: The amount of the resource to create a proof of.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><code>Proof</code>: A proof of the specified quantity and resource.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Creates a proof of the specified resource and amount.</p>
<p>This method creates a <code>Proof</code> of the resource and amount specified to the method and returns it.</p></td>
</tr>
</tbody>




**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "create_proof_of_amount"
    Address("\${resource_address}")
    Decimal("\${amount}");
```

### Create proof of non-fungibles



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>create_proof_of_non_fungibles</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td><code>Owner</code> role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code>resource_address</code> - <code>ResourceAddress</code>: The resource address of the resource to create a proof of.</p></li>
<li><p><code>ids</code> - <code>Array&lt;NonFungibleLocalId&gt;</code>: The set of non-fungible local ids of the resource to create a proof of.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><code>Proof</code>: A proof of the specified non-fungible local ids and resource.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Creates a proof of the specified resource of and non-fungible local ids.</p>
<p>This method creates a Proof of the resource and non-fungible local ids specified to the method and returns it.</p></td>
</tr>
</tbody>




**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "create_proof_of_non_fungibles"
    Address("\${resource_address}")
    Array<NonFungibleLocalId>(NonFungibleLocalId("\${some_non_fungible_local_id}"));
```

### Burn



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>burn</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td><code>Owner</code> role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code>resource_address</code> - <code>ResourceAddress</code>: The resource address of the resource to burn from the account.</p></li>
<li><p><code>amount</code> - <code>Decimal</code>: The amount of the resource to burn.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td>None</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>Burns the amount of the resource directly from the account’s vault.</td>
</tr>
</tbody>




**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "burn"
    Address("\${resource_address}")
    Decimal("\${amount}");
```

### Burn non-fungibles



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>burn_non_fungibles</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td><code>Owner</code> role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code>resource_address</code> - <code>ResourceAddress</code>: The resource address of the resource to burn.</p></li>
<li><p><code>ids</code> - <code>Array&lt;NonFungibleLocalId&gt;</code>: The set of non-fungible local ids of the resource to burn.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td>None</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td>Burns the non-fungibles of the resource directly from the account’s vault.</td>
</tr>
</tbody>




**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "burn_non_fungibles"
    Address("\${resource_address}")
    Array<NonFungibleLocalId>(NonFungibleLocalId("\${some_non_fungible_local_id}"));
```

### Set default deposit rule



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>set_default_deposit_rule</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td><code>Owner</code> role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><code>default</code> - <code>DefaultDepositRule</code>: Describes how the account should deal with resources that it does not have specific rules for. This could either be <code>Accept</code>, <code>Reject</code>, or <code>AllowExisting</code>.</td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td>None</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Sets the default deposit rule of the account</p>
<p>This method changes the default deposit rule of the account changing the behavior of how the account handles deposits from third-parties of resources that it does not have a specific rule for.</p></td>
</tr>
</tbody>




**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "set_default_deposit_rule"
    Enum<DefaultDepositRule::Accept>();
```

A more complete manifest example of this can be found <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/develop/radix-transactions/examples/account/deposit_modes.rtm" target="_blank">here</a>.

### Set resource preference



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>set_resource_preference</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td><code>Owner</code> role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><ul>
<li><p><code>resource_address</code> - <code>ResourceAddress</code>: The address of the resource to add a resource preference for.</p></li>
<li><p><code>resource_preference</code> - <code>ResourcePreference</code>: Describes how the account how deal with deposits of this resource. This is either <code>Allowed</code>, or <code>Disallowed</code>.</p></li>
</ul></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td>None</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Sets the resource preference of a resource.</p>
<p>This method sets and overrides the preference of the resource in the account.</p></td>
</tr>
</tbody>




**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "set_resource_preference"
    Address("\${resource_address}")
    Enum<ResourcePreference::Allowed>();
```

A more complete manifest example of this can be found <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/develop/radix-transactions/examples/account/deposit_modes.rtm" target="_blank">here</a>.

### Remove resource preference



|  |  |
|:---|:---|
| **Name** | `remove_resource_preference` |
| **Type** | Method |
| **Callable by** | `Owner` role |
| **Arguments** | `resource_address` - `ResourceAddress`: The address of the resource to add a resource preference for. |
| **Returns** | None |
| **Description** | Removes the preference of a resource making it use the default deposit rule instead. If no preference for this resource exists then nothing happens. |



**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "remove_resource_preference"
    Address("\${resource_address}");
```

### Add authorized depositor



|  |  |
|:---|:---|
| **Name** | `add_authorized_depositor` |
| **Type** | Method |
| **Callable by** | `Owner` role |
| **Arguments** | `badge` - `ResourceOrNonFungible`: The badge of the authorized depositor to add specified as a `ResourceOrNonFungible`. |
| **Returns** | None |
| **Description** | Adds an authorized depositor badge to the set of authorized depositors. |



**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "add_authorized_depositor"
    Enum<1u8>(Address("\${resource_address}"));
```

A more complete manifest example of this can be found <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/main/radix-transaction-scenarios/generated-examples/bottlenose/account_authorized_depositors/manifests/001--account-authorized-depositors-configure-accounts.rtm" target="_blank">here</a>.

### Remove authorized depositor



|  |  |
|:---|:---|
| **Name** | `remove_authorized_depositor` |
| **Type** | Method |
| **Callable by** | `Owner` role |
| **Arguments** | `badge` - `ResourceOrNonFungible`: The badge of the authorized depositor to remove specified as a `ResourceOrNonFungible`. |
| **Returns** | None |
| **Description** | Removes an authorized depositor badge to the set of authorized depositors. |



**Transaction Manifest**

``` bash
CALL_METHOD
    Address("\${account_component_address}")
    "remove_authorized_depositor"
    Enum<1u8>(Address("\${resource_address}"));
```

A more complete manifest example of this can be found <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/main/radix-transaction-scenarios/generated-examples/bottlenose/account_authorized_depositors/manifests/001--account-authorized-depositors-configure-accounts.rtm" target="_blank">here</a>.

### Securify



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code>securify</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable by</strong></td>
<td><code>Securify</code> role</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td>None</td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><code>Bucket</code>: A bucket containing the account owner badge associated with this account.</td>
</tr>
<tr>
<td><strong>Description</strong></td>
<td><p>Securifies the account, transitioning it from operating in signature mode to operating in badge mode.</p>
<p>This method securifies the account minting a new account owner badge and changing the account’s current owner access rule to a new access rule of the account owner badge and returns the minted owner badge. The returned badge then must be stored somewhere, ideally in an access controller.</p>
<p>This method is only callable by the <code>Securify</code> role. When an account is first instantiated, the <code>Securify</code> role requires the Owner authority. However, after the account has been securified the Securify role changes to being <code>DenyAll</code> such that securification can never happen again.</p></td>
</tr>
</tbody>




**Transaction Manifest**

``` bash
CALL_METHOD
    Account("\${account_component_address}")
    "securify";

TAKE_ALL_FROM_WORKTOP
    Address("\${account_owner_badge_address}")
    Bucket("owner_badge");

# Do something with the owner badge, ideally create an access controller and deposit
# it there.
```

*Note that the transaction manifest above is not complete, more specifically, the account owner badge returned from the securify method is not deposited anywhere in this manifest. Ideally, the account owner badge would be stored in an access controller.*
