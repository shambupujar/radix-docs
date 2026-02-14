---
title: "Create Your First Non Fungible"
---

So far this series has only focused on fungible resources. This will be our first look at non-fungibles.

By making some small changes to our starting Hello template, we can create it with a non-fungible instead of a fungible resource. That resource can then be obtained with the same `free_token` method as we used in the original template.

:::note
**The code referenced in this section can be found in our [official examples here](https://github.com/radixdlt/official-examples/tree/main/step-by-step/12-hello-non-fungible**

.)
:::



## Non-Fungible Resources

Non-fungibles, like fungible resources, are native to Radix, so they behave as real world objects and have other behaviours guaranteed by the Radix Engine.

What makes them unique is that they *are* unique, meaning non-fungible tokens minted from the same resource manager are not interchangeable. This is in contrast to fungible resources, where any token from the same resource manager is identical and interchangeable. If fungible resources are like money, non-fungibles are like collectibles.

Non-fungibles have several different properties to fungibles on Radix. Firstly they have a unique identifier, their `NonFungibleLocalID`. This can be an integer, string, byte array or RUID (Radix Unique Identifier). It is used to identify the non-fungible within the collection’s resource address and must be of the same type throughout the same collection. e.g. a non-fungible collection of playing cards could all have integer local IDs, or all have string local IDs, but not some with integers and some with strings.

In our example we’ll use RUIDs, as the Radix Engine will make it easy and generate them for us. For the other types, we would need to specify them ourselves (see below).

Non-fungibles also have `NonFungibleData`, which can take the form of any data you require. Its structure will need to be defined outside of the blueprint. In our case the non-fungible data structure definition is just above the blueprint code.

## What’s Changed

To make the Hello example non-fungible, we need to make a few small changes to the Hello template created when you run `scrypto new-package hello`.

Firstly, we need to add our `NonFungibleData` structure in the form of the `Greeting` struct.

``` rust
#[derive(ScryptoSbor, NonFungibleData)]
pub struct Greeting {
    text: String,
}
```

Then we need to change our `HelloToken` resource to be non-fungible by changing the `ResourceBuilder` method used from `new_fungible` to `new_ruid_non_fungible`.

``` rust
  let my_bucket: Bucket = ResourceBuilder::new_ruid_non_fungible(OwnerRole::None)
```

:::note[Resource Builder methods]
`ResourceBuilder` methods include `new_ruid_non_fungible`, `new_integer_non_fungible`,`new_string_non_fungible` and `new_bytes_non_fungible`. These corresponding to their `NonFungibleLocalID` types of RUID (Radix Unique Identifier), integer, string or byte array.
:::



For clarity we also change the metadata so we have a new name and symbol for our resource.

``` rust
  .metadata(metadata! {
    init {
      "name" => "HelloNonFungible", locked;
      "symbol" => "HNF", locked;
    }
})
```

Finally, we need to mint our initial supply of non-fungibles. This is done by calling the `mint_initial_supply` method on our resource builder, but it now takes an array of `NonFungibleData` in the form described in our `Greeting` struct.

``` rust
  .mint_initial_supply(
    [
      Greeting { text: "Hello".into(), },
      Greeting { text: "Pleased to meet you".into(), },
      Greeting { text: "Welcome to Radix".into(), },
      Greeting { text: "Salutations".into(), },
      Greeting { text: "Hi there".into() },
    ]
  )
```

:::note[Non-RUID Non-Fungible Local IDs]
A `NonFungibleLocalID` must be specified for a **non-RUID** non-fungible (integer, string or bytes) when minting. To do this state the local ID before the `NonFungibleData` in a tuple. e.g. if we create our non-fungibles with integer local IDs like so:

``` rust
let my_bucket: Bucket = ResourceBuilder::new_integer_non_fungible(OwnerRole::None)
```

Then we would mint like this:

``` rust
  .mint_initial_supply([
    (
      // NonFungibleLocalID
      IntegerNonFungibleLocalId::new(1),
      // NonFungibleData
      Greeting {
        text: "Hello world!".into(),
      },
    ),
  ])
```
:::



## Running Hello Non-Fungible

:::note
**To run the updated Hello example, follow the steps described in our [official examples on GitHub](https://github.com/radixdlt/official-examples/tree/main/step-by-step/12-hello-non-fungible#running-the-example**

)
:::


