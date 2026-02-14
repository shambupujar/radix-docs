---
title: "Advanced External Calls"
---

From scrypto, you may wish to make calls to a method or blueprint function. This is known as an external, or cross-blueprint call. This allows a developer to create complex systems by composing various blueprints and components together.

An introduction to these ideas can be found in [Use External Blueprints](../learning-step-by-step/use-external-blueprints.md) and [Use External Components](../learning-step-by-step/use-external-components.md).

This document covers more combinations of use-cases.

## Calling a specific blueprint or global component of your package

First, you need to get some blueprint stub, `T`. A blueprint stub comes in two parts:

- It has an **interface** - a set of blueprint functions; and component method definitions.

- Some also have a **blueprint identity** - e.g. a package address and blueprint name. This is used by the engine to validate that you have the right object.

Currently, this blueprint stub type `T` can come from a few places. These will be covered in further detail in this article:

- Inside your current package, from another `#[blueprint]` macro.

- From the `extern_blueprint!` pseudo-macro inside the `#[blueprint]` definition of one of your components.

- Using the built-in `AnyComponent`, which has no pre-defined methods nor identity.

- *Soon, we’ll support other mechanisms to create these stubs, without hard-coding a blueprint address.*

For a blueprint stub type `T`, you can make external calls by using:

- `Blueprint<T>` to make function calls to a package with a known address. Specifically:

  - If `T` captures an identity, you don’t need to create a `Blueprint<T>`, you can just use it statically: `Blueprint::<T>::function_call(..)`

- `Global<T>` to make method calls to global components. It can also be used to update roles, metadata etc. Specifically:

  - You can create a `Global<T>` from an address, or more efficiently, you can save it to component state, or receive it in place of an address as a method/function argument.

  - If `T` captures a blueprint identity, receiving a `Global<T>` as an argument, returning it, saving it to state, or constructing it, will all trigger validations that the address has the given blueprint.

  - You can then use it to make calls. e.g. `Global::<T>::from(address).method_call(..)`.

- `Owned<T>` to make method calls to owned or internally mounted components.

  - This is created and used in the same way as `Global<T>`, however it represents unique ownership of the given component, rather than a shared reference to a global component.

  - An owned component does not have access rules, metadata etc, and can only be called directly by its owner.

Each of these can be used to make the corresponding typed function or method calls, but can also be used to make raw / untyped calls if needed.

## Using a blueprint from the same package

You might decide to combine multiple blueprints in the same package. This allows you to easily deploy complex inter-blueprint functionality to the ledger. In this section, you will learn how to call a blueprint from another one living in the same package.

Let’s say you have two blueprints: `CoffeeMachine` and `AlarmClock`. If you want to be able to instantiate a `CoffeeMachine` component and call its methods from one of the `AlarmClock`’s method/function you would create three files:

#### src/lib.rs

``` rust
// Import the blueprints that are part of the package
mod coffee_machine;
mod alarm_clock;
```

This `lib.rs` file is the starting point of all Scrypto packages. If you have only one blueprint in the package, you could write the logic directly in that file, like we saw previously. In our case, we will write the logic of the two blueprints in separate files. That’s why in `lib.rs` we are importing the two other files to include in our package (`coffee_machine` and `alarm_clock`) with the `mod` keyword.

#### src/coffee_machine.rs

``` rust
use scrypto::prelude::*;

#[blueprint]
mod coffee_machine {
    struct CoffeeMachine {}

    impl CoffeeMachine {
        pub fn new() -> Owned<CoffeeMachine> {
            Self{}.instantiate()
        }

        pub fn make_coffee(&self) {
            info!("Brewing coffee !");
        }
    }
}
```

1.  Here we need to return `Owned<CoffeeMachine>` which is magic syntax that the `#[blueprint]` macro allows.

2.  Also notice that we do not call the `globalize()` method after instantiation. This is because we want our component to be instantiated as a local or owned component. Having an owned component will only be accessible by our second blueprint that we are going to go through in the next section.

This file includes the logic for the `CoffeeMachine` blueprint. This blueprint offers a function to instantiate a component with an empty state that offers a `make_coffee()` method, which we will call from the `AlarmClock` blueprint.

#### src/alarm_clock.rs

``` rust
use scrypto::prelude::*;
use crate::coffee_machine::coffee_machine::*; // #1

#[blueprint]
mod alarm_clock {
    struct AlarmClock {
        // Store the coffee machine component
        coffee_machine: Owned<CoffeeMachine>
    }

    impl AlarmClock {
        pub fn new() -> Global<AlarmClock> {
            Self{
                coffee_machine: CoffeeMachine::new() // #2
            }
            .instantiate()
            .prepare_to_globaize(OwnerRole::None)
            .globalize()
        }

        pub fn try_trigger(&mut self) {
            assert!(Runtime::current_epoch() % 100 == 0, "It's not time to brew yet !");
            self.coffee_machine.make_coffee(); // #3
        }
    }
}
```

1.  Import the `CoffeeMachine` blueprint

2.  Instantiate a `CoffeeMachine` component from the blueprint

3.  Call methods on the component

First, this blueprint imports the `CoffeeMachine` Blueprint at the top of the file. Then, it instantiates a new `CoffeeMachine` component and stores it inside a newly instantiated `AlarmClock` component. Finally, in the `try_trigger` method, the CoffeeMachine’s `make_coffee` method is called.

## Using `extern_blueprint!`

:::note
**>
Watch out for Network Dependence

**

When creating packages containing static addresses through the `extern_blueprint!` pseudo-macro and `global_component!` pseudo-macro, the built WASM and Package Definition are network-dependent.

You will need to be careful to version your source files (or update the addresses in them) before building for different networks, and ensure that the resultant artifacts (WASM and .rpd files) are kept separate between networks.

There is a workaround for `extern_blueprint!` in the next section, but *we have plans in the near future to make this more intuitive.*
:::


The current implementation of the`extern_blueprint!`must live *inside* a`#[blueprint]` definition. It takes a package address, a blueprint name, and a blueprint interface and does a few things:

- It generates a stub type `T` for the external blueprint. This stub includes scrypto methods, and capture's the blueprint's identity (package address and blueprint name).

- It registers the external blueprint's package address as a static dependency of your `#[blueprint]`, so that the engine can allow your blueprint to call the external blueprint without having received or loading the package address at runtime. This package address is validated at package upload time. This is explained in more detail in the blue box below.

If the external blueprint requires any custom structs or enums, then you can copy their definitions verbatim from the source code for the blueprint, and referenced inside the macro (along with its derives).

The `global_component!{ .. }` pseudo-macro can similarly be used to register a static dependency on a fixed component address.

``` rust
// ===================================================================
// EXAMPLE 1 - capturing the functions on the GumballMachine blueprint
// ===================================================================
extern_blueprint! {
    "package_sim1p4kwg8fa7ldhwh8exe5w4acjhp9v982svmxp3yqa8ncruad4rv980g",
    GumballMachine {
        // Blueprint Functions
        fn instantiate_gumball_machine(price: Decimal) -> Global<GumballMachine>;

        // Component Methods
        fn get_price(&self) -> Decimal;
        fn buy_gumball(&mut self mut payment: Bucket) -> (Bucket, Bucket);
    }
}

// =======================================
// EXAMPLE 2 - Demonstrating a custom type
// =======================================

// Since the DepositResult enum is required by this blueprint, it needs to be defined outside of the
// extern_blueprint! macro, and then used in the function or method signatures.
// You can obtain the definition of the enum from the source code of the external blueprint.
#[Derive(ScryptoSbor)]
enum DepositResult { // #1
    Success,
    Failure
}

extern_blueprint! {
    "package_sim1p4kwg8fa7ldhwh8exe5w4acjhp9v982svmxp3yqa8ncruad4rv980g",
    CustomAccountComponentTarget as MyAccountComponentTarget { // Alias
        fn deposit(&mut self, b: Bucket) -> DepositResult;
        fn deposit_no_return(&mut self, b: Bucket);
        fn read_balance(&self) -> Decimal;
    }
}
```

:::note
**>
What is “node visibility”? What is a static dependency of a blueprint?

**

Registering an address as a *static dependency* allows the blueprint to make calls to it without receiving an error about a node reference not being visible. This error protects the engine against blueprints/components making calls to objects they have no right knowing about.

To prevent this error, the called global address needs to become visible to the call frame. This can be achieved in a few ways:

- The called address can be a static dependency of the current blueprint.

- The called address can be read from state.

- The called address can be passed in as an argument.
:::


### Calling a static component address with `global_component!`

Once the blueprint package or component is imported we can use the `global_component!` pseudo-macro to reference the `GumballMachine` component. Note that `global_component!` only works inside the `#[blueprint]` mod. This registers the given component address as a *static dependency* of the built package, which allows the package to make calls to the component without the component address being stored or passed into the component.

You can also just create a `Global<T>` at runtime by receiving it as an argument, reading it from state, or calling `address.into()`. This doesn’t require knowing a static address ahead-of-time.

``` rust
pub fn proxy_buy_gumball(&self, mut payment: Bucket) -> (Bucket, Bucket) {
    let gumball_component: Global<GumballMachine> = global_component!(
        GumballMachine,
        "component_sim1crtkvhxwuff6vk7weufhj9qsd8u7ekajz9zllmqd29mlm8mlxrvsru"
    );

    return gumball_component.buy_gumball(payment)
}
```

:::note
**>
A Note on Type Checking

**

The `global_component!` macro does not check if the component is of the blueprint type. Be sure to verify the blueprint info of the component on Radix Explorer before using it.
:::


### Workaround: Using `extern_blueprint!` without package checks

It’s quite common to want a typed interface definition in `Global<T>` - but not to have to write network-dependent code, deal with blueprint identity check errors, or have to drop to manually coded calls with `Global<AnyComponent>`.

We will have official support for this soon, but for the time being there is a slightly awkward workaround which can be used to use `Global<T>` from `extern_blueprint! { ... }` whilst avoiding the identity checks:

``` rust
use scrypto::prelude::*;

#[blueprint]
mod candy_store {
    extern_blueprint! {
        // 1. We use a native address which exists on every network here.
        //    The precise network doesn't matter, so we use the mainnet
        //    address for the package package. This will also add it as a
        //    static dependency, but that won't matter.
        "package_rdx1pkgxxxxxxxxxpackgexxxxxxxxx000726633226xxxxxxxxxpackge",
        GumballMachine {
            // Blueprint Functions
            fn instantiate_global(
                price: Decimal
            ) -> ( Global<GumballMachine>, Bucket);
            fn instantiate_owned(
                price: Decimal,
                component_address: ComponentAddress
            ) -> Owned<GumballMachine>;

            // Component Methods
            fn get_status(&self) -> Status;
            fn buy_gumball(&mut self, payment: Bucket) -> (Bucket, Bucket);
            fn set_price(&mut self, price: Decimal);
            fn withdraw_earnings(&mut self) -> Bucket;
            fn refill_gumball_machine(&mut self);
        }
    }

    pub struct CandyStore {
        // 2. Instead of using a `Global<GumballMachine>`, we just save a
        //    `ComponentAddress` in the state which means that we can avoid
        //    the blueprint identity assertions when state is saved.
        pub gumball_machine: ComponentAddress,
    }

    impl CandyStore {
        pub fn new() -> Global<Self> {
            todo!()
        }

        pub fn get_status_from_gumball_machine(&self) -> Status {
            // 2. We call the `gumball_machine` method which constructs a temporary
            //    `Global<GumballMachine>` for us
            let gumball_machine = self.gumball_machine();

            // 3. We call a method on the generated stub.
            let status = gumball_machine.get_status();
            
            // Print the output or do something with it.
            info!("{status:#?}");
        }

        // 2. We create a temporary `Global<GumballMachine>` using some unnatural
        //    methods which avoid any blueprint identity assertions.
        fn gumball_machine(&self) -> Global<GumballMachine> {
            Global::<GumballMachine>(GumballMachine {
                handle: ObjectStubHandle::Global(self.gumball_machine.into()),
            })
        }
    }
}
```

### Calling a component with an address from state

``` rust
struct MyGumballProxy {
    // Both of these store component addresses. The latter is validated by the engine upon saving that it matches the given package/blueprint. 
    gumball_machine_component_address: ComponentAddress,
    gumball_machine_component: Global<GumballMachine>,
}

impl MyGumballProxy {
    // ...
    pub fn proxy_buy_gumball(&self, mut payment: Bucket) -> (Bucket, Bucket) {
        let gumball_component: Global<GumballMachine> = self.gumball_machine_component_address.into();

        return gumball_component.buy_gumball(payment)
    }

    pub fn proxy_buy_gumball_2(&self, mut payment: Bucket) -> (Bucket, Bucket) {
        return self.gumball_machine_component.buy_gumball(payment)
    }
}
```

### Calling a dynamic component address

In the following example, the `gumball_component` parameter can be a component address. The engine verifies that the passed address belongs to a component whose blueprint matches (in this case, `GumballMachine` under `package_sim1p4kwg8fa7ldhwh8exe5w4acjhp9v982svmxp3yqa8ncruad4rv980g`).

``` rust
impl MyGumballProxy {
    // This is equivalent to proxy_buy_gumball_2, except the engine also validates the component's blueprint matches the package address/blueprint name in the external_blueprint definition.
    pub fn proxy_buy_gumball(&self, gumball_machine_component: Global<GumballMachine>, mut payment: Bucket) -> (Bucket, Bucket) {
        return gumball_machine_component.buy_gumball(payment)
    }

    // This is equivalent to proxy_buy_gumball, EXCEPT the engine does not validate that the gumball_machine_component matches the package address/blueprint in the external_blueprint definition.
    pub fn proxy_buy_gumball_2(&self, gumball_machine_component: ComponentAddress, mut payment: Bucket) -> (Bucket, Bucket) {
        let gumball_machine_component: Global<GumballMachine> = gumball_machine_component.into();

        return gumball_machine_component.buy_gumball(payment)
    }
}
```

### Calling a blueprint function

This can be done with `Blueprint<X>` where `X` is a Blueprint defined via `extern_blueprint!` or from another definition in the given package.

``` rust
struct MyGumballProxy {
    gumball_machine: Global<GumballMachine>,
}

impl MyGumballProxy {
    pub fn instantiate_proxy(price: Decimal) -> Global<MyGumballProxy> {
        // This can call the function on the GumballMachine blueprint
        // NOTE: The `extern_blueprint!` definition MUST be inside this #[blueprint] mod for the static depedency on the package to be picked up,
        //       and to avoid a reference error at runtime.
        let created_gumball_machine = Blueprint::<GumballMachine>::instantiate_gumball_machine(price);

        Self {
            gumball_machine: created_gumball_machine,
        }
        .instantiate()
        .prepare_to_globalize(OwnerRole::None)
        .globalize()
    }
}
```

## Calling a component with any blueprint

This can be done with `Global<AnyComponent>`, which doesn’t do any validation on the blueprint.

You can create this as `let component: Global<AnyComponent> = Global::from(component_address);`

However, be aware that you can’t currently easily add nice method calls. In the future we may add an ability to define interfaces without the blueprint validation. Please discuss this in the \#scrypto channel on Discord if this would be useful for you.

## Calling a package

Sometimes you want to read metadata from a package, or interact with a package as a package. For that, you can use the `Package` type (which behind the scenes is a type alias for `Global<PackageStub>`). This can be used like this:

``` rust
let my_package: Package = Runtime::package_address().into();
let my_package_description: String = my_package.get_metadata("description").unwrap().unwrap();
```

  
