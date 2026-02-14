---
title: "Explain Your First Scrypto Project"
---

After using the Hello package in [Run Your First Scrypto Project](/learning-to-run-your-first-scrypto-project) I’m sure you’ll want to better understand what you just did. We give you a full explanation below, where you’ll get a more of a taste for of how asset-oriented programming with Scrypto for DeFi works.

You can find the Hello package code discussed here [on github](https://github.com/radixdlt/official-examples/tree/main/step-by-step/02-hello-token-explained), or by simply creating a new package with `scrypto new-package <PACKAGE_NAME>`.

The Hello package is a simple one blueprint package. The Scrypto component it creates gives out a Hello Token whenever it’s `free_token` method is called.

## File Structure

For every new Scrypto package, there are three main files/folders:

- The `src` folder, which contains all the source code;
- The `test` folder, which contains all the test code;
- The `Cargo.toml` configuration file. Cargo is the default package manager for Scrypto. It downloads all the dependencies, compiles source code, and makes a binary executable. This file specifies the dependencies and compile configuration.

## Blueprint

In the `src` folder, there is a `lib.rs` file, which contains our blueprint code.

:::note[Components, Blueprints and Packages]
A **blueprint** is the code that defines a single working part of our application. When it is instantiated it becomes an interactive **component** running in the Radix Engine.

One or multiple blueprints grouped together, ready to be instantiated are a **package**.
:::



We only have one blueprint in the package called `Hello`, which defines:

1.  The state structure of all `Hello` components; a single [vault](#buckets-vaults). A vault is a container for [resources](#resource-creation);
2.  A function `instantiate_hello`, which instantiates a `Hello` component;
3.  A method `free_token`, which returns a bucket of `HelloToken` (from the component vault) when called.

``` rust
use scrypto::prelude::*;

#[blueprint]
mod hello {
    // 1. The state structure of all `Hello` components
    struct Hello {
        sample_vault: Vault,
    }

    impl Hello {
        // 2. A function which instantiates a `Hello` component
        pub fn instantiate_hello() -> Global<Hello> {
            // --snip--
        }

        // 3. A method which returns a bucket of `HelloToken` when invoked
        pub fn free_token(&mut self) -> Bucket {
            // --snip--
        }
    }
}
```

### 1. Defining Component Structure

``` rust
    struct Hello {
        // A vault to store resources
        sample_vault: Vault,
    }
```

Every blueprint must start with a `struct` defining what is stored where in the component. The `struct` has the same name as the blueprint.

### 2. Instantiating a Component from a Package

``` rust
    pub fn instantiate_hello() -> Global<Hello> {
        // --snip--
    }
```

Blueprints need to have instantiate functions so they can be used to create components. This is usually named starting with `instantiate_` or `new_`. In our case the function is `instantiate_hello()`

#### Resource Creation \#

When a `Hello` component is instantiated, so is an initial supply of `HelloToken` resources.

:::note[Resources]
In Scrypto, assets like tokens and non-fungibles are not implemented as blueprints or components. Instead, they are types of **resources** that are configured and requested directly from the system.
:::



To create a new resource, we:

1.  Use the `ResourceBuilder` to create a new fungible resource;
2.  Specify the number of decimal places the resource can be divided into;
3.  Specifying the resource metadata, like name and symbol;
4.  Specifying the initial supply of the resource.
5.  Convert the bucket type returned from minting initial supply (here: `FungibleBucket`) to a more general `Bucket`.

``` rust
// 1. Define a new fungible resource with ResourceBuilder
let my_bucket: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
    // 2. Set the max number of decimal places to 18
    .divisibility(DIVISIBILITY_MAXIMUM)
    // 3. Set the metadata
    .metadata(metadata!{
        init {
            "name" => "Hello Token", locked;
            "symbol" => "HT", locked;
        }
    })
    // 4. Create the initial supply
    .mint_initial_supply(1000)
    // 5. Convert sub bucket type to Bucket.
    .into();
```

#### Buckets & Vaults \#

:::note[Buckets]
A **bucket** is a temporary container for resources.
:::



When a resource is created, it is in a bucket. As buckets only exist to move resources around we have to:

5.  Put the new resources in a **vault**.

``` rust
    // 5. Put the new resources in a vault
    sample_vault: Vault::with_bucket(my_bucket),
```

:::note[Vaults]
A **vault** is a permanent container for resources and where resources must be stored.
:::



#### Instantiation \#

Finally, we can instantiate a `Hello` component by:

6.  Calling `instantiate`
7.  Making the component available in the network by calling `globalize`

``` rust
Self {
        sample_vault: Vault::with_bucket(my_bucket),
    }
    // 6. Instantiate the component
    .instantiate()
    // 7. Make the component available in the network
    .prepare_to_globalize(OwnerRole::None)
    .globalize()
```

(The `OwnerRole` is explained in [Give the Gumball Machine an Owner](give-the-gumball-machine-an-owner.md))

This completes the `instantiate_hello` function which creates a new `HelloToken` definition with an initial supply of 1000, stores the 1000 tokens inside a state struct and instantiates a new component from that state.

### 3. Component Methods

``` rust
    pub fn free_token(&mut self) -> Bucket {
            // --snip--
    }
```

Methods can only be called on instantiated components, not blueprints. Our `Hello` component has one method, `free_token`, which first logs the component’s token balance then returns a `HelloToken`.

Logs are explained more in the [Logging section of these docs](../scrypto/logging.md). `free_token` uses the `info!` macro for logging:

``` rust
    info!(
        "My balance is: {} HelloToken. Now giving away a token!",
        self.sample_vault.amount()
    );
```

The method then returns a bucket of one token, ready to transfer to another component or account:

``` rust
    // Return 1 HelloToken, taken from the vault
    self.sample_vault.take(1)
```

The lack of `;` at the end of the line means that the result of the last expression is returned from the method. This also applies to the `instantiate_hello` function where the component is returned.

## Wrapping Up

That’s it! You now know how the `Hello` package works. The information here is the foundation for the rest of this [learning journey](index.md). The next step is to [Create Your First Custom Resource](/learning-to-create-your-first-custom-resource). Where we look in more detail at metadata, why to change it and how.

:::note
Let us know if you find any section helpful or not by clicking one of the buttons below ⬇. You can also let us know about a typo or outdated information using the same buttons.
:::


