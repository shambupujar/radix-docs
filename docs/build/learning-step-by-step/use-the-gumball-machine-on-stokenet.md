---
title: "Use the Gumball Machine on Stokenet"
---

# Use the Gumball Machine on Stokenet

In the previous Step-by-Step section we allowed our gumball machine to mint its own gumballs. The blueprint still isn’t quite ready for us to publish on the ledger though. Currently anyone can mint gumballs, so let’s look at restricting it to the component’s methods. We’ll also add an icon for the gumball token, so it’s easily identifiable in wallets and explorers.

:::note
**The scrypto package referenced in this section can be found in our [official examples here](https://github.com/radixdlt/official-examples/tree/main/step-by-step/08-ledger-ready-gumball-machine**

.)
:::



## Virtual Badges

The Owner badge, like other badges we might make, is a resource. We make it the required evidence of ownership in one of the instantiation steps. In some cases it makes more sense to use a component’s own address instead of creating a badge. This is known as the **Virtual Badge** pattern.

:::note[The Virtual Badge pattern]
A component does not need to have its own badge to provide permission and perform authorized actions. Instead of a badge the component address itself can act as evidence to perform a action that requires permission.
:::



### Address Reservation

All components on the Radix ledger have a unique address assigned at instantiation, but the gumball token is defined inside the instantiate function. So we have access to the a component address inside the function before it’s complete, we need to reserve it. We do so right at the start of `instantiate_gumball_machine`.

``` rust
let (address_reservation, component_address) =
    Runtime::allocate_component_address(GumballMachine::blueprint_id());
```

This give us the `component_address` to use for the minter rule, and the `address_reservation` to apply to the component in the last instantiation step.

### Restricting Mint Roles

We update the minter rule to now require the component’s own address to mint new gumballs. Only the component and therefore it’s methods will be able to mint.

``` rust
.mint_roles(mint_roles! {
    minter => rule!(require(global_caller(component_address)));
    minter_updater => rule!(deny_all);
})
```

The `address_reservation` is applied in the last instantiation step, giving our component the address we reserved and same address as used to mint new gumballs.

``` rust
    .instantiate()
    .prepare_to_globalize(OwnerRole::Fixed(rule!(require(
        owner_badge.resource_address()
    ))))
    // Apply the address reservation
    .with_address(address_reservation)
    .globalize();
```

## Icons for Tokens

We now have one last thing to do before we publish the gumball machine. Outside of `resim` the token will be displayed in a variety of ways in dapps and wallets. So these can be more visually appealing we need to add an icon for the gumball token. This is done with just an extra metadata field called `icon_url`.

``` rust
   "icon_url" => Url::of("https://assets.radixdlt.com/icons/icon-gumball-pink.png"), locked;
```

URLs and strings are not treated the same in the Radix ledger and so we need to use the `Url` type. The `locked` keyword, as before, is used to prevent the icon URL from being changed after the component is instantiated.

We now have a blueprint we can publish on the ledger.

## Publishing the Package and Using the Gumball Machine

:::note
**The steps to build and publish the package, then use the Gumball Machine blueprint on the Stokenet test network are in our [official examples repo](https://github.com/radixdlt/official-examples/tree/main/step-by-step/08-ledger-ready-gumball-machine#publishing-the-gumball-machine**

.)
:::


