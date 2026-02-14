---
title: "Make Your Gumball Machine Refillable"
---

# Make Your Gumball Machine Refillable

Building on the previous Give the Gumball Machine an Owner section, in this one we’ll modify our first **behaviour** and give the machine the ability to **mint** more Gumball tokens. Using the updated behaviour we also add a new method for the owner to refill the gumball machine.

:::note
**The scrypto package referenced in this section can be found in our [official examples here](https://github.com/radixdlt/official-examples/tree/main/step-by-step/06-refillable-gumball-machine**

.)
:::



## Behaviours

Tokens in the Radix Engine have a collection of behaviours that define what they can and can’t do. Things like whether they can be withdrawn, burned, or minted. If we don’t select their values, they will be set to their defaults (withdrawable, none-burnable, none-mintable etc.). If we want to change these we can do so by adding the desired behaviours, along with the rules to update them, to the token when it’s first defined.

### Fixed Supply vs Mintable

By default tokens have a fixed supply. We need make the gumball resource mintable, so we can create more after the initial batch. Our token is made mintable by adding `mint_roles` to the `bucket_of_gumballs` in its initial definition.

``` rust
.mint_roles(mint_roles! {
    minter => rule!(allow_all);
    minter_updater => rule!(deny_all);
})
```

For now our minter rule allows anyone to mint new gumballs. We’ll look at restricting this in later examples (see [Use The Gumball Machine on Stokenet](./learning-to-use-the-gumball-machine-on-stokenet#virtual-badges)). We also need to decide on a rule for who can change the minter rule. For simplicity, we stop anyone from updating it.

### Resource Managers

Now our gumball resource is mintable, we need to have access to its resource manager to mint it. We can do this by adding a `ResourceManager` to our component’s state.

``` rust
struct GumballMachine {
    gum_resource_manager: ResourceManager,
    gumballs: Vault,
    collected_xrd: Vault,
    price: Decimal,
}
```

That also means we need to add the resource manager to the component at instantiation. We can do this with the `resource_manager` method on the bucket.

``` rust
let component = Self {
    gum_resource_manager: bucket_of_gumballs.resource_manager(),
    gumballs: Vault::with_bucket(bucket_of_gumballs),
    collected_xrd: Vault::new(XRD),
    price: price,
}
```

If we had no initial supply of gumballs, defining them would produce a resource manager instead of a bucket, which we could have used directly in the instantiation.

### New Methods

We’ve added just one new method to the gumball machine this time:

- `refill_gumball_machine` - Takes no arguments and refills the `gumballs` vault to 100 gumballs.

  ``` rust
    pub fn refill_gumball_machine(&mut self) {
        let gumball_amount = 100 - self.gumballs.amount();
        self.gumballs
            .put(self.gum_resource_manager.mint(gumball_amount));
    }
  ```

## Using the Refillable Gumball Machine

:::note
**Have a go at using the Refillable Gumball Machine by following the [instructions in the official-examples repo](https://github.com/radixdlt/official-examples/tree/main/step-by-step/06-refillable-gumball-machine#using-the-refillable-gumball-machine**

.)
:::


