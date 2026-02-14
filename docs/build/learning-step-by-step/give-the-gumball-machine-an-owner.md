---
title: "Give the Gumball Machine an Owner"
---

# Give the Gumball Machine an Owner

Web3 concerns ownership, ownership of digital assets, the distributed ownership of decentralized systems, and more. On Radix, with our [asset oriented](../../essentials/asset-oriented.md) stack, we implicitly have an easy way to track asset ownership by possession. e.g. an asset is owned by a vault it sits in; a vault is owned by a component it’s a internal to. But a component and it’s blueprint don’t need to sit within another entity, so for these we declare an owner explicitly. We can then give the owner access to specific privileges and/or they can receive [royalties](../scrypto/using-royalties.md) when their component or blueprint is used.

Having defined owners works as a useful shortcut in our [Authorization Approach](../../essentials/authorization-approach.md). We’ll expand further on authorization in later Step-by-Step sections, but for now, think of an owner as the admin for that entity. Components and resources have owners. Being able to prove your an owner, with a [**badge**](../authorization/user-badge-pattern.md), can give you access to more of the component. Therefore, declaring who owners are gives you more power to decide who can use a component and how, and the Radix Engin enforces your decisions and guaranties their effects. We can use this to do things like withdraw the collected XRD in our gumball machine without worrying that anyone else can.

We keep track of ownership with [**badges**](#badges). Before we dig into what they are and how to use them, let’s look at what ownership means for our gumball machine?

## Ownership and Authorization

Each component on the radix ledger has an owner (though it may be set to None, `OwnerRole::None`). When writing a blueprint we can make proof of ownership required for individual method calls on the component. For our gumball machine that means, when it’s instantiated the instantiator will become the owner and will be the only account who can call some methods on that gumball machine component. We’ll choose changing the price of the gumballs and withdrawing the XRD from the machine as our owner restricted methods.

:::note
**You can see this applied in the [Gumball Machine with an Owner example](https://github.com/radixdlt/official-examples/tree/main/step-by-step/05-gumball-machine-with-owner**

in our official examples.)
:::



By using the `enable_method_auth!` macro at the top of our blueprint code we can decide which methods require proof of ownership and which are public. `restrict_to: [OWNER]` means that the method requires proof of ownership.

``` rust
`enable_method_auth!` {
        methods {
            buy_gumball => PUBLIC;
            get_status => PUBLIC;
            set_price => restrict_to: [OWNER];
            withdraw_earnings => restrict_to: [OWNER];
        }
    }
```

### Badges

Evidence of ownership is achieved with a **Badge**. A Badge can be any normal resource (fungible or non-fungible) who’s possession shows that the holder is the owner of a component.

Using a badge’s to prove ownership also makes it possible to transfer ownership between accounts.

:::note[Proofs]
[Proofs](../authorization/call-a-protected-method-function.md#proofs) are used to prove that a caller has a required badge. Proofs are a special type of resource that only exist for the length of the transaction. They allow a caller to prove that they have a resource without having to risk transferring a badge away and hoping that it is transferred back. A proof of resource is created from a vault (or bucket) and automatically added to the [Authorization Zone](../authorization/call-a-protected-method-function.md#the-authorization-zone) where methods will automatically check for any required proofs.
:::



We use a fungible resource for our owner badge:

``` rust
let owner_badge: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
              .metadata(metadata!(init{
                  "name" => "Gumball Machine Owner Badge", locked;
              }))
              .divisibility(DIVISIBILITY_NONE)
              .mint_initial_supply(1)
              .into();
```

By making it indivisible and giving it a fixed supply of 1, we make sure there can only be one owner.

We then make the `owner_badge` proof the evidence of ownership when the component is instantiated with a `require` rule:

``` rust
    .instantiate()
    .prepare_to_globalize(OwnerRole::Fixed(rule!(require(
        owner_badge.resource_address()
    ))))
    .globalize();
```

The Owner role is now fixed to (cannot be changed from) proof of the `owner_badge` resource.

The instantiated component and the `owner_badge` are then returned from the function:

``` rust
            (component, owner_badge)
```

Now, when an owner restricted method is called, the caller has to present a proof of the `owner_badge` or the transaction will fail.

### Restricted Methods

Now we can restrict methods to just the owner of the gumball machine, we’ve updated the blueprint from the [Build a Gumball Machine](build-a-gumball-machine.md) version. The two new methods are:

- `set_price` - Allows the owner to set the price of the gumballs.

  ``` rust
    pub fn set_price(&mut self, price: Decimal) {
        self.price = price
    }
  ```

- `withdraw_earnings` - Lets the owner withdraw any XRD collected in the gumball machine, from bought gumballs.

  ``` rust
    pub fn withdraw_earnings(&mut self) -> Bucket {
        self.collected_xrd.take_all()
    }
  ```

These additions are simple, but they start to show how we can use badges to control access to our components.

:::note
**To try out our new gumball machine and it’s owner badge, have a go by following [the instructions in the official-examples Github repo](https://github.com/radixdlt/official-examples/tree/main/step-by-step/05-gumball-machine-with-owner#using-the-gumball-machine-as-an-owner**

.)
:::



## Closing Thoughts

Hopefully you now have a grasp of how the Owner role works as a shortcut for a usage pattern where you have a single admin, as well as the basics of the authorization system in Scrypto. The tools and system shown here form the foundation of [method access limitation](../../reference/core-system-features/structure-roles-methods.md), allowing us to decide exactly who can do what with any component generated from our blueprints.

There’s still much more to the Scrypto authorisation system, some of which we’ll cover in the next part of the Learning Step-by-Step, [Make Your Gumball Machine Refillable](make-your-gumball-machine-refillable.md). If you’re keen to learn even more now though, you can go to the [Authorization](../../essentials/authorization-approach.md) section of these docs.

:::note
Let us know if you find any section helpful or not by clicking one of the buttons below ⬇
:::


