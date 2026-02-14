---
title: "Build a Multi-Blueprint Package"
---

# Build a Multi-Blueprint Package

Up until now we’ve had packages of only one blueprint. In this section we will build a package with more. A candy store containing a single gumball machine (and nothing else) will be represented with blueprints that, when instantiated, will become two components.

There are two broad ways to do this, with distinct advantages. This section covers a version using only global components. The other version, using owned components, is covered in the next section.

:::note
**The scrypto package referenced in this section can be found in our [official examples here](https://github.com/radixdlt/official-examples/tree/main/step-by-step/15-candy-store-modules**

.)
:::



## Modular Packages

Using [several blueprints in one package](https://docs.radixdlt.com/docs/en/reusable-blueprints-pattern#small-modular-reusable-blueprints) is a common pattern with advantages of making it;

- easier to manage and upgrade parts of your application,
- more secure, by limiting the scope of each component,
- easier to test and debug,
- easier to reuse components in other packages.

For these reasons it’s normally a good idea to split your application into several blueprints each in their own file, though it’s not always necessary. This is done by placing each blueprint in it’s own file in the `src/` directory, alongside the `lib.rs` file. For example:

    src/
    ├── candy_store.rs
    ├── gumball_machine.rs
    └── lib.rs

`lib.rs` is the starting point of a scrypto package. Any blueprints modules in the package not in `lib.rs` it’s self must be added using the `mod` keyword, like so:

`rust lib.rs mod candy_store; mod gumball_machine;`

For a blueprint that directly uses another, we also need to import it into the blueprint’s file. For example, the `CandyStore` blueprint uses the `GumballMachine`, so we import it at the top of `candy_store.rs`, with the `use` keyword:

`rust candy_store.rs use crate::gumball_machine::gumball_machine::*;`

There are then two ways to for us to prepare our components to work together. We can globalize them, or we can make one owned by the other. Each requires a different setup to keep methods and tokens accessible and secure. Let’s look at the global version.

## Modular Package Blueprints

Our package has two blueprints, `CandyStore` and `GumballMachine`.



### The `GumBallMachine` blueprint

The global `GumballMachine` remains the same as in previous sections.

- Some of it’s methods are restricted to its owner in the `enable_method_auth!` macro at the top of the blueprint.

  `rust gumball_machine.rs enable_method_auth! {     methods {         buy_gumball => PUBLIC;         get_status => PUBLIC;         set_price => restrict_to: [OWNER];         withdraw_earnings => restrict_to: [OWNER];         refill_gumball_machine => restrict_to: [OWNER];     }     }`

- The component’s address is reserved for token access rules.

  `rust gumball_machine.rs pub fn instantiate_gumball_machine(price: Decimal) ->     (Global<GumballMachine>, Bucket) {         // reserve an address for the component         let (address_reservation, component_address) =             Runtime::allocate_component_address(                 GumballMachine::blueprint_id()             );`

- An owner badge is created. This will later be stored in the `CandyStore`, so it can call restricted methods on the `GumballMachine`.

  `rust gumball_machine.rs let owner_badge = ...`

- Mint roles are set using the components reserved address ensuring that only the `GumballMachine` can mint new tokens.

  `rust gumball_machine.rs     .mint_roles(mint_roles! {         minter => rule!(require(             global_caller(component_address)         ));         minter_updater => rule!(deny_all);     })`

- Proof of the owner badge is made the required authorization for ownership and the address reservation is applied to the new component.

  `rust gumball_machine.rs     .instantiate()     .prepare_to_globalize(OwnerRole::Fixed(rule!(require(         owner_badge.resource_address()     ))))     .with_address(address_reservation)     .globalize();`

### The `CandyStore` blueprint

Our `CandyStore` has been simplified in comparison to the last section, by removing the custom auth roles, candy and chocolate eggs. It now contains a `GumballMachine`, but it does now have some new complexity as it needs to hold the `GumballMachine` owner badge and pass proof of that ownership back to the `GumballMachine` when calling it’s restricted methods. This is done with the **`authorize_with_amount`** method.

- The component state holds the `GumballMachine` and a `Vault` containing the `GumballMachine` owner badge.

  `rust candy_store.rs struct CandyStore {     gumball_machine: Global<GumballMachine>,     gumball_machine_owner_badges: Vault, }`

- The gumball machine is instantiated as a part of the candy store’s own instantiate function.

  `rust candy_store.rs let (gumball_machine, gumball_machine_owner_badge) =     GumballMachine::instantiate_gumball_machine(         gumball_price     );`

- To call the `GumballMachine`’s public methods we can simply call them on the `CandyStore`’s internal `gumball_machine`.

  `rust candy_store.rs   pub fn buy_gumball(&mut self, mut payment: Bucket) -> (Bucket, Bucket) {     self.gumball_machine.buy_gumball(payment)   }`

- To call a restricted method on the `GumballMachine` we need to pass a proof that we have it’s owner badge by calling `authorize_with_amount` on the vault containing it.

  `rust candy_store.rs pub fn set_gumball_price(&mut self, new_price: Decimal) {     self.gumball_machine_owner_badges         .as_fungible()         .authorize_with_amount(             1,             || self.gumball_machine.set_price(new_price)         ); }` > **Authorize with Amount**
:::note
`authorize_with_amount` is a Vault method allows the use it’s contents as a proof for a function call. The amount of tokens used as the proof is specified by the first argument. The second argument is a closure (anonymous function) that will be called with the proof. For non-fungibles, the equivalent method is `authorize_with_non_fungibles`.
:::



## Using the Candy Store

:::note
**Instructions on how to setup and use the multi-blueprint yourself can be found in the [Official Example GitHub repository](https://github.com/radixdlt/official-examples/tree/main/step-by-step/15-candy-store-modules#using-the-candy-store**

.)
:::



## Final Thoughts

All the `CandyStore` methods correspond to ones on `GumballMachine`. This makes it little more than a wrapper for the `GumballMachine`. However, you can easily imagine a more complex example where the candy store contains multiple gumball machines, all instantiated from the same blueprint. It could even contain multiple types of products again, with blueprints for each category of product with similar properties. This type of modularity makes it easier to manage, expand and upgrade packages even as they grow in complexity.
