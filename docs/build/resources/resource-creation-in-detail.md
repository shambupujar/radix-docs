---
title: "Resource Creation In Detail"
---

## The `ResourceBuilder`

The `ResourceBuilder` is your utility for creating new resources. You have a number of resource creation methods to make things easy.

You can start using it like this `ResourceBuilder::new_` then complete the building process using either `create_with_no_initial_supply()` or `mint_initial_supply(..)`.

:::note
**>
What’s returned

**

It’s important to note that `create_with_no_initial_supply()` will return a `ResourceManager` where as `mint_initial_supply(..)` will return a bucket with the created supply of resources.
:::


### New Resource Methods



<table>
<colgroup>
<col />
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Method</td>
<td>Arguments</td>
<td>Returns</td>
</tr>
<tr>
<td><code>new_fungible()</code></td>
<td><code>owner_role</code> : <code>OwnerRole</code></td>
<td><code>InProgressResourceBuilder&lt;FungibleResourceType&gt;</code></td>
</tr>
<tr>
<td><code>new_string_non_fungible()</code></td>
<td><ul>
<li><p><code>owner_role</code> : <code>OwnerRole</code></p></li>
<li><p><code>&lt;NonFungibleData&gt;</code></p></li>
</ul></td>
<td><code>InProgressResourceBuilder&lt;NonFungibleResourceType&lt;StringNonFungibleLocalId, D&gt;&gt;</code></td>
</tr>
<tr>
<td><code>new_integer_non_fungible()</code></td>
<td><ul>
<li><p><code>owner_role</code> : <code>OwnerRole</code></p></li>
<li><p><code>&lt;NonFungibleData&gt;</code></p></li>
</ul></td>
<td><code>InProgressResourceBuilder&lt;NonFungibleResourceType&lt;IntegerNonFungibleLocalId, D&gt;&gt;</code></td>
</tr>
<tr>
<td><code>new_bytes_non_fungible()</code></td>
<td><ul>
<li><p><code>owner_role</code> : <code>OwnerRole</code></p></li>
<li><p><code>&lt;NonFungibleData&gt;</code></p></li>
</ul></td>
<td><code>InProgressResourceBuilder&lt;NonFungibleResourceType&lt;BytesNonFungibleLocalId, D&gt;&gt;</code></td>
</tr>
<tr>
<td><code>new_ruid_non_fungible()</code></td>
<td><ul>
<li><p><code>owner_role</code> : <code>OwnerRole</code></p></li>
<li><p><code>&lt;NonFungibleData&gt;</code></p></li>
</ul></td>
<td><code>InProgressResourceBuilder&lt;NonFungibleResourceType&lt;RUIDNonFungibleLocalId, D&gt;&gt;</code></td>
</tr>
</tbody>




Read the [Resource Behaviors](resource-behaviors.md) article for further customization options on the builder, including:

- Setting the `OwnerRole`

- Setting custom behaviours

- Setting divisibility for fungible resources

- Setting metadata

Here is an example creating a very simple fungible resource:

``` rust
let my_token: FungibleBucket = ResourceBuilder::new_fungible(OwnerRole::None)
    .metadata(metadata!(
        init {
            "name" => "My Token", locked;
            "symbol" => "TKN", locked;
        }
    ))
    .divisibility(DIVISIBILITY_NONE) // No decimals allowed
    .mint_initial_supply(100);
```

The Non-Fungible variants also require a struct of `NonFungibleData` as you can see below:

``` rust
// The top-level struct must derive NonFungibleData.
// Note that marking top-level fields as `#[mutable]` means that the data under
// that field can be updated by the `resource_manager.update_non_fungible_data(...)` method.
//
// All types referenced directly/indirectly also need to derive ScryptoSbor.
// To work with the Manifest Builder, we recommend all types also derive ManifestSbor.
#[derive(ScryptoSbor, ManifestSbor, NonFungibleData)]
struct GameData {
  team_one: String,
  team_two: String,
  section: String,
  seat_number: u16,
  #[mutable]
  promo: Option<String>,
}

#[blueprint]
mod nftblueprint {
    struct NftBlueprint {
    }

    impl NftBlueprint {
        pub fn create_game_nfts() {
            ResourceBuilder::new_integer_non_fungible::<GameData>(OwnerRole::None)
                .metadata(metadata! {
                     init {
                       "name" => "Mavs vs Lakers - 12/25/2023", locked;
                       "description" => "Tickets to the 2023 season of the Dallas Mavericks", locked;
                     }
                 )
                .create_with_no_initial_supply();
        }
    }
}
```

## The `ResourceManager`

When a resource is created on the Radix network, a “Resource Manager” with a unique address will be associated with it. This manager contains the data of this resource such as its type (fungible or non-fungible), its metadata and its supply among other things. It also allows people with the right authority to do actions on the resource like minting more tokens and updating its metadata. On this page, we will show you how to use the `ResourceManager` type that Scrypto offers and the various methods you can call on it.

### Methods available on ResourceManager

The `ResourceManager` offers many methods that we listed in the following tables.

#### Fetching resource information



|  |  |
|:---|:---|
| Method | Description |
| `get_metadata(key)` | Returns the metadata associated with the specified key. |
| `resource_type()` | Returns a ResourceType that is either non-fungible or fungible. |
| `total_supply()` | Returns the total supply of the resource. |
| `non_fungible_exists(NonFungibleLocalId)` | Returns whether a token with the specified non-fungible id was minted. |
| `get_non_fungible_data(NonFungibleLocalId)` | Returns the data associated with a particular non-fungible token of this resource. |



#### Applying actions

Provided that the correct authority is presented (more information about this [here](resource-behaviors.md)), you can apply the following actions to a resource.



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
<td><code>set_metadata(key, value)</code></td>
<td>Updates a metadata key associated with this resource.</td>
</tr>
<tr>
<td><code>mint(amount)</code></td>
<td><p>Mints an amount of fungible tokens.</p>
<p><strong>Note</strong>: The resource must be of the fungible type.</p></td>
</tr>
<tr>
<td><code>mint_non_fungible(&amp;id, data)</code></td>
<td><p>Mints a non-fungible token with the specified id and data.</p>
<p><strong>Note</strong>: The resource must be of the non-fungible type</p></td>
</tr>
<tr>
<td><code>update_non_fungible_data(&amp;id, field_name, new_data)</code></td>
<td>Updates a single field of the non-fungible data associated with a minted non-fungible token of the specified ID.</td>
</tr>
</tbody>




#### Updating resource flags

More information on access rules and resource flags [here](resource-behaviors.md).



|  |  |
|:---|:---|
| Method | Description |
| `set_mintable(access_rule)` | Sets the access rule for being able to update the `mintable` flag. |
| `lock_mintable()` | Locks the `mintable` flag. |
| `set_burnable(access_rule)` | Sets the access rule for being able to update the `burnable` flag. |
| `lock_burnable()` | Locks the `burnable` flag. |
| `set_withdrawable(access_rule)` | Sets the access rule for being able to update the `withdrawable` flag. |
| `lock_withdrawable()` | Locks the `withdrawable` flag. |
| `set_depositable(access_rule)` | Sets the access rule for being able to update the `depositable` flag. |
| `lock_depositable()` | Locks the `depositable` flag. |
| `set_recallable(access_rule)` | Sets the access rule for being able to update the `recallable` flag. |
| `lock_recallable()` | Locks the `recallable` flag. |
| `set_updatable_metadata(access_rule)` | Sets the access rule for being able to update the `updateable_metadata` flag. |
| `lock_updatable_metadata()` | Locks the `updateable_metadata` flag. |
| `set_updatable_non_fungible_data(access_rule)` | Sets the access rule for being able to update the `updateable_non_fungible_data` flag. |
| `lock_updatable_non_fungible_data()` | Locks the `updateable_non_fungible_data` flag. |



The owner role can be updated with `set_owner_role` and `lock_owner_role`.

## Related Rust docs

- <a href="https://docs.rs/scrypto/latest/scrypto/resource/resource_builder/struct.ResourceBuilder.html" target="_blank">ResourceBuilder</a>

- <a href="https://docs.rs/scrypto/latest/scrypto/resource/resource_manager/struct.ResourceManager.html" target="_blank">ResourceManager</a>

- <a href="https://docs.rs/scrypto/latest/scrypto/resource/resource_manager/struct.ResourceManagerStub.html" target="_blank">ResourceManagerStub</a>
