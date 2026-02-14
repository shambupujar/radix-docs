---
title: "Productionize Your Code"
---

## Ensure That All Entities Have an Owner

All packages, components, and resources of an application should have an Owner role configured. The Owner role will be extremely important when new features are added to Scrypto and the Radix Engine. As an example, when the upgradeability feature is released it will be the Owner role that can upgrade components and packages. This is not limited to just upgradeability, some new features added to packages, components, and resources will require the Owner role. Additionally, the owner role is used as a default for some of the role assignments such as that of the metadata setter.

The following are some tips for the owner role:

- If a single badge is used as the owner role then it is important that this badge is accessible and that proofs can be generated from this badge and used in transactions. Thus, this badge should be stored in an [account](../native-blueprints/account.md) or an [access controller](../native-blueprints/access-controller.md). Storing this badge in a component with no way of creating proofs of the badge makes it essentially unusable for arbitrary transactions.

- Blueprint instantiation functions should take an `OwnerRole` as an argument and apply it recursively to everything that they create. As an example, the owner role passed should be the owner role of all created resources and instantiated components.

There are three variants of the `OwnerRole`:

- `OwnerRole::None`: This specifies that there is no owner role.

- `OwnerRole::Fixed`: This specifies an owner `AccessRule` and that it is fixed and *not* updatable. This is optimal for applications where it is guaranteed that there is no need for the owner rule to be updated.

- `OwnerRole::Updateable`: This specifies an owner `AccessRule` and that it is *not* fixed and can be updated by the owner itself. This is optimal for applications that wish to have a way of changing the owner `AccessRule` later on. This could allow applications to start with a simple owner rule and then make it more complex as the need arises.



Example



The following is an example of a pair blueprint in a decentralized exchange. This example shows an instantiation function which takes an `OwnerRole` and correctly propagates this owner role to all of the resources it creates and components that it instantiates. The result is a set of entities that all belong to the same owner.

``` rust
use scrypto::prelude::*;

#[blueprint]
mod pair {
    pub struct Pair {
        pub pool: Global<TwoResourcePool>,
        pub pool_manager: FungibleVault,
    }

    impl Pair {
        pub fn instantiate(
            owner_role: OwnerRole,
            resource_addresses: (ResourceAddress, ResourceAddress),
        ) -> (Global<Pair>, FungibleBucket) {
            // ✅ The owner role is propagated to all of the resources created
            // in the instantiation function that should belong to the same
            // owner.
            let pool_manager_badge =
                ResourceBuilder::new_fungible(owner_role.clone())
                    .divisibility(DIVISIBILITY_NONE)
                    .mint_initial_supply(1);
            let admin_badge = ResourceBuilder::new_fungible(owner_role.clone())
                .divisibility(DIVISIBILITY_NONE)
                .mint_initial_supply(1);

            // ✅ The owner role is propagated to all of the components created
            // in the instantiation function.
            let pool = Blueprint::<TwoResourcePool>::instantiate(
                owner_role.clone(),
                rule!(require(pool_manager_badge.resource_address())),
                resource_addresses,
                None,
            );

            // ✅ The owner role is used as the owner of the Pair being
            // instantiated.
            let pair = Self {
                pool,
                pool_manager: FungibleVault::with_bucket(pool_manager_badge),
            }
            .instantiate()
            .prepare_to_globalize(owner_role)
            .globalize();

            (pair, admin_badge)
        }
    }
}
```





## Ensure That The Metadata of Entities is Correctly Configured

### Adherence to The Metadata Standards

The Radix wallet and dashboard show various information to the user based on the metadata of packages, components, and resources. Currently, this is information such as the name, description, icon, and so on. However, it is not restricted to just that; the metadata is also used for two-way linking and could be used to construct a tree of related dApps and entities. Failure to set up the metadata correctly could result in two-way linking not being established correctly, the application not looking as it should in transactions, and various entities not looking as they should on the Radix dashboard and wallet. Additionally, misconfigured two-way links between the dApp definition and the dApp website could even result in transactions being rejected by the Radix wallet (if it is not operating in developer mode). Thus, it is important for application developers to adhere to the metadata standards used by the Radix wallet and dashboard and to ensure that all entities within an application adhere to them.

The primary standards and guides to follow are:

- [Metadata for Wallet Display](../metadata/metadata-for-wallet-display.md)

- [Metadata for Verification](../metadata/metadata-for-verification.md)

- [dApp Definition Setup](../dapp-development/dapp-definition-setup.md)

### Updatable Metadata

The metadata standard used by the wallet will continue to change and evolve as the Radix wallet evolves and as developers’ needs arise. Thus, the metadata of the various entities of an application must be updatable to allow application developers to adapt to such changes in the metadata standards. Failure to make the metadata updatable would mean that the application resources, components, and packages might not look right in the Radix wallet and dashboard.

## Ensure That Entities and Transactions Look Good in The Wallet And Dashboard

### Do The On-Ledger Entities Look Correct In The Dashboard?

- Do all of the on-ledger entities have correctly configured two-way linking?

### Do The Resources Look Correct In The Wallet and Dashboard?

- The Radix wallet and dashboard show the resource behavior (such as whether it can be minted, burned, etc…). Does the resource behavior seen there align with how this resource is expected to behave? Does it align with the rules it was configured with when it was created in the application blueprint or manifest?

- Is the metadata displayed for the resource on the Radix wallet and dashboard as expected? Is the name, symbol, description, tags, icon URL, and related dApps showing up correctly?

### Do The Manifests Look Correct In The Wallet?

- Does the wallet show the application manifests as being conforming or non-conforming? Conforming manifests are shown in the user-friendly user interface that shows the assets withdrawal and deposits, presented badges, as well as related dApps whereas non-conforming manifests are displayed as raw manifest strings. If the manifests are shown as non-conforming then they should adhere to the rules defined in the [Conforming Transaction Manifest Types](../transactions-manifests/index.md) document. Not all of the transaction types in that document are currently supported, a small number are. However, it serves as guidance for developers on how to write manifests that are recognized by the current and future versions of the wallet. The rules surrounding manifest types will continue to improve and the detection will get better. Eventually, transaction type detection will be in a place where users would very seldom encounter non-conforming manifests and most would refuse to sign non-conforming manifests. Thus, application developers should aim to make their manifests conform to the wallet rules to be displayed well to the users.

- Does the dApp information show up in the “using dApps” section of the transaction preview screen? If it does not then this could be because of a misconfigured dApp definition. Application developers should aim to have their dApps displayed correctly in the “using dApps” of the transaction preview screen as future versions of the wallet will warn the users when a new dApp is encountered there and when a dApp seems to be impersonating the name.

- Are deposits of a known amount shown as deposits of a guaranteed amount or does the wallet prompt the user to enter in guarantees? If it is the latter despite the deposit being of a known amount that can’t change at manifest runtime (e.g., transferring X resources between accounts A and B) then this might be due to the use of instructions like `TAKE_ALL_FROM_WORKTOP` or the use of `Expression("ENTIRE_WORKTOP")`. As a general rule of thumb, **always** use instructions with explicit amounts and IDs unless your application does not allow for it. This includes instructions such as `TAKE_FROM_WORKTOP`, `TAKE_NON_FUNGIBLES_FROM_WORKTOP`, and methods such as `try_deposit_or_abort` and `try_deposit_or_refund`.

### Do Non-Fungible Tokens Look Correct In The Wallet?

- Is all of the data expected to be shown to users shown to them in the Radix wallet? The wallet does not show all of the non-fungible data, it only shows fields of simple data types like strings, numbers, booleans, and so on but can not show more complex fields like arrays of addresses. Application developers should make sure that the fields they expect users would want to see are displayed in the wallet.

:::note
**>
Note

**

Display of non-fungible data is not currently implemented in the wallet.
:::


## Publish a Package Built Through the Deterministic Builder

The `scrypto build` command does not produce deterministic builds. This means that building the same package on different operating systems and processor architectures would not produce identical WASM files. If it is desirable to be able to verify published packages against their source code then the deterministic Scrypto builder should be used, more information can be found <a href="https://docs-babylon.radixdlt.com/main/scrypto/release_notes/migrating_from_0.12_to_1.0.html#_scrypto_builder_docker_image">here</a>.

The version of the builder used should be the same as that of the Scrypto dependency. Meaning, version X.Y.Z of the builder should be used if the package's Scrypto dependency is as follows:

``` ini
[dependencies]
scrypto = { git = "https://github.com/radixdlt/radixdlt-scrypto", tag = "vX.Y.Z" }
```

To build a package through the deterministic builder run the following commands:

``` plaintext
$ DOCKER_DEFAULT_PLATFORM=linux/amd64 docker pull radixdlt/scrypto-builder:v1.0.1
$ DOCKER_DEFAULT_PLATFORM=linux/amd64 docker run -v <path-to-scrypto-crate>:/src radixdlt/scrypto-builder:v1.0.1
```





Note



v1.0.1 in the above commands should be replaced with the version of the Scrypto dependency of the package being built. Each release of Scrypto has an associated version of the deterministic builder.





## Optimize The Size of Packages for Lower Fees

There are various ways of optimizing the fees for the users of an application. Perhaps the biggest and simplest of which is making the package WASM smaller. This makes the package cheaper to load into the memory of the Radix Engine and cheaper to invoke methods and functions on. There are many different ways to optimize the package size and some are easier than others. The following is a list of low-hanging fruits for size (thus fee) optimization.





Note



This section does not mention anything about the use of `wasm-opt` since it is now integrated into `scrypto build` as well as the deterministic Scrypto builder. It is no longer a separate step or command. This is available in v0.12.0 and higher of the Scrypto toolchain. To check which version of the Scrypto toolchain is installed run `scrypto --version`. Additionally, this section does not mention the use of the `--release` flag since `scrypto build` only produces release builds.





### Register Key-Value Store and Non-Fungible Data Types

Without the use of registered types, WASM packages need to have the ability to generate the SBOR schema of the types used in key-value stores and non-fungible data during runtime. However, the machinery for deriving SBOR schemas is quite heavy and increases the size of WASM modules by a non-trivial amount by adding a lot of code to them. Thus, pushing the requirement of schema generation from runtime to compile-time removes the need for the WASM modules to have the machinery for deriving SBOR schemas and reduces the size of the WASM modules. The registration of types allows for their schemas to be generated at compile-time and included in the Radix Package Definition (`.rpd`) file instead of being generated at runtime.



Example



The following example shows two blueprints: one of them does not use registered types and another that uses registered types. The WASM produced from the earlier is likely to be larger than that of the former.

``` rust
use scrypto::prelude::*;

#[derive(ScryptoSbor, NonFungibleData)]
pub struct Card {
    pub name: String,
}

// ⛔️ Incorrectly Configured
mod misconfigured {
    use super::*;

    #[blueprint]
    mod blueprint {
        struct Blueprint {
            key_value_store: KeyValueStore<u32, Card>,
        }

        impl Blueprint {
            pub fn instantiate() -> Global<Blueprint> {
                // ⛔️ Creates a non-fungible resource without using registered
                // types. The schema for this will be derived at run-time which
                // adds the schema derivation machinery into the WASM.
                let _non_fungible_resource =
                    ResourceBuilder::new_ruid_non_fungible::<Card>(
                        OwnerRole::None,
                    )
                    .create_with_no_initial_supply();

                // ⛔️ Creates a key-value store without using registered types.
                // The schema for this will be derived at run-time which adds
                // the schema derivation machinery into the WASM.
                let key_value_store = KeyValueStore::<u32, Card>::new();

                Self { key_value_store }
                    .instantiate()
                    .prepare_to_globalize(OwnerRole::None)
                    .globalize()
            }
        }
    }
}

// ✅ Correctly Configured
mod correctly_configured {
    use super::*;

    #[blueprint]
    // ✅ The types used in the KeyValueStore and the non-fungible resource are
    // both registered.
    #[types(Card, u32)]
    mod blueprint {
        struct Blueprint {
            key_value_store: KeyValueStore<u32, Card>,
        }

        impl Blueprint {
            pub fn instantiate() -> Global<Blueprint> {
                // ✅ Creates a non-fungible resource with a registered type.
                let _non_fungible_resource =
                    ResourceBuilder::new_ruid_non_fungible_with_registered_type::<Card>(OwnerRole::None)
                    .create_with_no_initial_supply();

                // ✅ Creates a KVStore with registered types.
                let key_value_store =
                    KeyValueStore::<u32, Card>::new_with_registered_type();

                Self { key_value_store }
                    .instantiate()
                    .prepare_to_globalize(OwnerRole::None)
                    .globalize()
            }
        }
    }
}
```





:::note
**>
Unit type

**

To add the unit type (`()`) to the `#[types()]` attribute, define it with `type Unit = ()`. e.g.

``` rust
    type Unit = () 

    #[blueprint]
    #[types(Card, u32, Unit)]
```
:::


### Use a Release Profile Optimized for Smaller Size

The release profile used for builds can have a large effect on the size of the produced WASM. The following release profile has been shown to provide consistently good results (especially when combined with `wasm-opt`):

``` plaintext
[profile.release]
opt-level = 'z'
lto = true
codegen-units = 1
panic = 'abort'
strip = true
overflow-checks = true
```
