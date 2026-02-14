---
title: "Buckets And Vaults"
---

Because Scrypto is about safe resource handling, we introduce the concept of resource containers. There are two types of resource containers: Buckets and Vaults.

- `Bucket` - A bucket is a temporary container used to move resources during a transaction; therefore, it only exist in the duration of the transaction.

- `Vault` - A vault is a permanent container and at the end of each transaction, all resources must be stored in a Vault.

Buckets are transient resource containers which are used to move resources from one vault to another. As such, buckets are dropped at the end of the transaction and the resource held by the bucket must be stored in a vault or burned.

``` rust
pub fn vault_to_vault(&mut self) {
  let bucket: Bucket = self.vault.take(dec!("1"));
  self.other_vault.put(bucket);
}
```

## Fungible/NonFungible

Buckets and vaults may be further categorized to be Fungible or NonFungible adding four more types of resource containers:

- `FungibleBucket` - A bucket containing an amount of some fungible resource.

- `NonFungibleBucket` - A bucket containing an amount of some non-fungible resource.

- `FungibleVault` - A vault containing an amount of some fungible resource.

- `NonFungibleVault`- A vault containing an amount of some non-fungible resource.

These more specific types allows one to call more specialized methods for the given resource type:

``` rust
pub fn display_non_fungibles(bucket: Bucket) -> Bucket {
  let non_fungible_bucket: NonFungibleBucket = bucket.as_non_fungible();
  println!("{:?}", non_fungible_bucket.non_fungibles());
  non_fungible_bucket.into()
}
```

Note that the above will panic if the passed in bucket is actually of fungible type.

## Buckets

Buckets and it’s Fungible/NonFungible variants are the main mechanism through which assets move. Below is a table of methods available to work with buckets.

### Bucket Methods



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Method</td>
<td>Description</td>
</tr>
<tr>
<td><code>.burn()</code></td>
<td>Burns (or destroys) the resource contained within the bucket</td>
</tr>
<tr>
<td><code>.create_proof_of_all()</code></td>
<td>Creates a <code>Proof</code> of all the resources in the bucket</td>
</tr>
<tr>
<td><code>.resource_address()</code></td>
<td>Returns the address of the resource stored in the bucket</td>
</tr>
<tr>
<td><code>.resource_manager()</code></td>
<td>Returns the <code>ResourceManager</code> of the resource contained within the bucket</td>
</tr>
<tr>
<td><code>.amount()</code></td>
<td>Returns the amount of tokens stored in the bucket</td>
</tr>
<tr>
<td><code>.is_empty()</code></td>
<td>Returns <code>true</code> if the <code>Bucket</code> is empty, <code>false</code> otherwise.</td>
</tr>
<tr>
<td><code>.put(bucket)</code></td>
<td>Take a <code>Bucket</code> and <code>put</code> its content into the bucket on which this method is called.</td>
</tr>
<tr>
<td><code>.take(amount)</code></td>
<td>Take a quantity of tokens and return a new <code>Bucket</code> containing them.</td>
</tr>
<tr>
<td><code>.take_advanced(amount, withdraw_strategy)</code></td>
<td>Take a quantity of tokens with a certain withdraw strategy and return a new <code>Bucket</code> containing them.</td>
</tr>
<tr>
<td><code>.drop_empty()</code></td>
<td>If the <code>Bucket</code> is empty, the <code>Bucket</code> is dropped. Otherwise, an error will be returned.</td>
</tr>
<tr>
<td><code>.as_fungible()</code></td>
<td><p>Convert the bucket into a <code>FungibleBucket</code>.</p>
<p><strong>Note</strong>: This method panics if the underlying resource is not a fungible resource.</p></td>
</tr>
<tr>
<td><code>.as_non_fungible()</code></td>
<td><p>Convert the bucket into a <code>NonFungibleBucket</code>.</p>
<p><strong>Note</strong>: This method panics if the underlying resource is not a non fungible resource.</p></td>
</tr>
<tr>
<td><code>.authorize_all(function)</code></td>
<td><p>Authorizes an action by putting the badges present in the Bucket on the AuthZone before running the specified function.</p>
<p>Note: more information about this here.</p></td>
</tr>
</tbody>




### FungibleBucket Methods

A `FungibleBucket` inherits all of the `Bucket` methods with the following additional methods:



|  |  |
|:---|:---|
| Method | Description |
| `.create_proof_of_amount(amount)` | Creates a `Proof` of a certain amount of the resources in the bucket. |
| `.authorize_with_amount(amount, function)` | Authorizes an action by putting a proof of certain amount present in the Bucket on the AuthZone before running the specified function. |



### NonFungibleBucket Methods

A `NonFungibleBucket` inherits all of the `Bucket` methods with the following additional methods:



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Method</td>
<td>Description</td>
</tr>
<tr>
<td><code>.non_fungibles()</code></td>
<td>Returns a vector containing the data of each NFT present in the bucket.</td>
</tr>
<tr>
<td><code>.take_non_fungibles(IndexSet&lt;NonFungibleLocalId&gt;)</code></td>
<td>Take multiple non-fungible tokens from the bucket. This returns a new <code>Bucket</code> with the specified NFTs.</td>
</tr>
<tr>
<td><code>.non_fungible()</code></td>
<td><p>Returns the data of the NFT that the bucket contains.</p>
<p><strong>Note</strong>: this method <strong>panics</strong> if the bucket does not contain <strong>exactly</strong> one NFT</p></td>
</tr>
<tr>
<td><code>.take_non_fungible(NonFungibleId)</code></td>
<td><p>Takes a specific NFT from the bucket and returns a new Bucket that contains it.</p>
<p><strong>Note</strong>: this method <strong>panics</strong> if the bucket does not contain <strong>exactly</strong> one NFT</p></td>
</tr>
</tbody>




## Vaults

Buckets are used to store resources while they are moving during a transaction. On the other hand, vaults are used to store resources for longer-term in-between transactions. The distinction between these two containers allows the system to make sure no resources are ever lost if, for example, someone is withdrawing tokens from their account but forgets to insert them into another vault.

The most straightforward way to illustrate the concept of vaults is with the account components. Each account component contains a vault for each resource type it owns, as seen in its state definition:

``` rust
struct Account {
  vaults: KeyValueStore<ResourceAddress, Vault>
}
```

When an account receives a new token (e.g. through a call to one of its deposit methods), it checks if it already instantiated a vault of this particular resource type. If a vault for the received resource type does not exist, one is created and the received tokens are stored in it.

You can visualize the vaults and resources present on an account component (or any component) by using the `resim show <component_address>` command as shown below.

``` bash
:::note
resim new-account
resim new-token-fixed --symbol BTC --name Bitcoin 21000000
resim show [account_address]
:::


Component: account_sim1q0esun0yw3y6h4glaea4fds5kzd3j0hayqxpec589m3s0kjz2g
Access Rules
State: Tuple(KeyValueStore("b825ef8e0e15fe71d85b7e3f4adb4c0c8bb9e9902fdb52ff4d7c73219c7d286403040000"))
Key Value Store: AccountComponent[03f30e4de47449abd51fee7b54b614b09b193efd200c1ce2872ee3][...]
├─ ResourceAddress("resource_sim1qzkcyv5dwq3r6kawy6pxpvcythx8rh8ntum6ws62p95sqjjpwr") => Vault("b825ef8e0e15fe71d85b7e3f4adb4c0c8bb9e9902fdb52ff4d7c73219c7d286405040000")
└─ ResourceAddress("resource_sim1qrgs0ge3nm2sh6fc09rtfgzcx4jfvk6uk77t9sqdu66qrs6z50") => Vault("93a0a362a5aa37e847e5b9a94343061ee6738f19ad81f5ce04b4558cd6fbd2f705040000")
Resources:
├─ { amount: 1000, resource address: resource_sim1qzkcyv5dwq3r6kawy6pxpvcythx8rh8ntum6ws62p95sqjjpwr, name: "Radix", symbol: "XRD" }
└─ { amount: 21000000, resource address: resource_sim1qrgs0ge3nm2sh6fc09rtfgzcx4jfvk6uk77t9sqdu66qrs6z50, name: "Bitcoin", symbol: "BTC" }
```

In the `Key Value Store` section, you can see the mapping between the resource addresses and their corresponding Vault. Resim then displays the resource list in a user-friendly format in the `Resources` section.

### Creating Vaults

In Scrypto, there are two main ways for creating a Vault:



|  |  |
|:---|:---|
| Function | Description |
| `Vault::new(ResourceAddress)` | This creates a new empty `Vault` that will be used to stored resources of the specified `ResourceAddress`. |
| `Vault::with_bucket(Bucket)` | This is a shortcut for creating a new `Vault` and inserting a `Bucket` of tokens inside. The `ResourceAddress` is inferred from the passed `Bucket`. |



Here is a simple example:

``` rust
use scrypto::prelude::*;

#[blueprint]
mod my_module {
    struct MyBlueprint {
        my_vault: Vault
    }

    impl MyBlueprint {
        pub fn instantiate(tokens: Bucket) -> Global<MyBlueprint> {
            Self {
                // Create a Vault from the provided bucket
                // and store in on the component state
                my_vault: Vault::with_bucket(tokens)
            }.instantiate().globalize()
        }
    }
}
```

:::note
Just like buckets have to be deposited into a vault by the end of a transaction, Vaults must be stored on a component state by the end of a transaction.
:::


### Vault Methods



|  |  |
|:---|:---|
| Method | Description |
| `.put(bucket)` | Deposits a `Bucket` into this vault |
| `.resource_address()` | Returns the address of the resource stored in the vault |
| `.resource_manager()` | Returns the `ResourceManager` of the resource contained within the vault |
| `.amount()` | Returns the amount of tokens stored in the vault |
| `.is_empty()` | Returns `true` if the vault is empty, `false` otherwise. |
| `.take(amount)` | Returns a `Bucket` containing the specified quantity of the resources present in the vault |
| `.take_non_fungible(NonFungibleId)` | Returns a `Bucket` with a NFT of the specified ID taken from the vault |
| `.take_all()` | Returns a `Bucket` containing all the resources present in the vault |
| `.authorize(function)` | Authorizes an action by putting the badges present in the vault on the AuthZone before running the specified function. |



### FungibleVault Methods

A `FungibleVault` inherits all of the `Vault` methods with the following additional methods:



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Method</td>
<td>Description</td>
</tr>
<tr>
<td><code>.lock_fee(amount)</code></td>
<td><p>Lock fee to pay for the transaction.</p>
<p><strong>Note</strong>: this panics if the vault contains a resource different than XRD.</p></td>
</tr>
<tr>
<td><code>.lock_contingent_fee(amount)</code></td>
<td><p>Lock fee to pay for the transaction, contingent on this transaction committing successfully</p>
<p><strong>Note</strong>: this panics if the vault contains a resource different than XRD.</p></td>
</tr>
<tr>
<td><code>.create_proof_of_amount(amount)</code></td>
<td>Creates a <code>Proof</code> of a certain amount of resources in the vault</td>
</tr>
<tr>
<td><code>.authorize_with_amount(amount)</code></td>
<td>Authorizes an action by putting a proof of certain amount present in the vault on the AuthZone before running the specified function.</td>
</tr>
</tbody>




### NonFungibleVault Methods

A `NonFungibleVault` inherits all of the `Vault` methods with the following additional methods:



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Method</td>
<td>Description</td>
</tr>
<tr>
<td><code>.non_fungible_local_ids(limit)</code></td>
<td>Returns a index-set containing the id of NFTs present in the vault. The maximum number of NFTs returned is defined by <code>limit</code></td>
</tr>
<tr>
<td><code>.contains_non_fungible(NonFungibleLocalId)</code></td>
<td>Returns <code>true</code> if the vault contains a given NonFungible, <code>false</code> otherwise</td>
</tr>
<tr>
<td><code>.non_fungibles()</code></td>
<td>Returns the <code>ResourceManager</code> of the resource contained within the vault</td>
</tr>
<tr>
<td><code>.take_non_fungibles(IndexSet&lt;NonFungibleLocalId&gt;)</code></td>
<td>Takes a set of NFTs from the vault and returns a <code>Bucket</code> with those NFTs.</td>
</tr>
<tr>
<td><code>.burn_non_fungibles(IndexSet&lt;NonFungibleLocalId&gt;)</code></td>
<td>Burns a set of NFTs from the vault</td>
</tr>
<tr>
<td><code>.non_fungible_local_id()</code></td>
<td><p>Returns the non fungible local id of the vault</p>
<p><strong>Note</strong>: this method <strong>panics</strong> if the bucket does not contain <strong>exactly</strong> one NFT</p></td>
</tr>
<tr>
<td><code>.non_fungible()</code></td>
<td><p>Returns the data of the NFT that the vault contains</p>
<p><strong>Note</strong>: this method <strong>panics</strong> if the bucket does not contain <strong>exactly</strong> one NFT</p></td>
</tr>
<tr>
<td><code>.take_non_fungible(NonFungibleId)</code></td>
<td>Takes a specific NFT from the vault and returns a new <code>Bucket</code> that contains it.</td>
</tr>
<tr>
<td><code>.create_proof_of_non_fungibles(IndexSet&lt;NonFungibleLocalId&gt;)</code></td>
<td>Creates a <code>Proof</code> of a set of NFTs from the vault</td>
</tr>
<tr>
<td><code>.authorize_with_non_fungibles(IndexSet&lt;NonFungibleLocalId&gt;)</code></td>
<td>Authorizes an action by putting a proof of a set of NonFungibles present in the vault on the AuthZone before running the specified function.</td>
</tr>
</tbody>



