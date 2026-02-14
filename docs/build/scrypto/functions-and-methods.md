---
title: "Functions And Methods"
---

Functions and methods form the primary part of the implementation of a blueprint; they define the behavior to accomplish specific tasks. Calls to functions and methods are also how transactions interact with blueprints and components on the Radix network.

## Functions

Functions are similar to what you think of as a "static function" in other languages. They do not depend on any internal state, and can be called directly on a blueprint. Typically, a blueprint offers at least one function that performs instantiation of a component.

Functions can have input parameters and return values, they just can’t have a reference to self.

Here’s an example of a function signature that instantiates a component:

``` rust
pub fn instantiate_my_component(init_count: u32) -> Global<Component> {
```

## Methods

Methods require a reference to `self`, and can read and modify internal state. Methods can only be called on components (blueprints don’t have internal state).

The first argument of a method is either &self or &mut self:

- With `&self`, the statements within the method can only read the component state

- With `&mut self`, the statements can read and write the component state

Some example method signatures:

``` rust
pub fn get_value(&self) -> u32 {
```

``` rust
pub fn update_value(&mut self, new_value: u32) {
```

## Visibility

All public functions and methods defined in a blueprint may be invoked by external entities via transactions or calls from other functions or methods. Methods are only invokable on an instantiated component.

To check what functions and methods are available on a blueprint deployed to your local simulator, run this command:

``` bash
resim export-abi <PACKAGE_ADDRESS> <BLUEPRINT_NAME>
```

#### Private functions and methods

You can create methods and functions that are only callable from within the blueprint itself by removing the `pub` keyword in front of the signature:

``` rust
use scrypto::prelude::*;

#[blueprint]
mod gumball_machine {
    struct GumballMachine {
        gumballs: Vault
    }

    impl GumballMachine {
        pub fn instantiate() -> Global<GumballMachine> {
            let bucket = ResourceBuilder::new_fungible()
                .divisibility(DIVISIBILITY_NONE)
                .mint_initial_supply(1000);

            Self {
                gumballs: Vault::with_bucket(bucket)
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .globalize()
        }

        // This is a public method meaning that it will be callable from outside
        pub fn free_gumball(&mut self) -> Bucket {
            self.print_vault_info();
            self.gumballs.take(1)
        }

        // This is a private method. You cannot call it with `resim call-method`.
        fn print_vault_info(&self) {
            info!("Amount of gumballs left: {}", self.gumballs.amount());
        }
    }
}
```

In this example, `print_vault_info()` can only be called from within this blueprint. It will not appear if you run `resim export-abi [package_address] GumballMachine`.
