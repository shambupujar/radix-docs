---
title: "Create Owned Components"
---

# Create Owned Components

In the last section we looked at a candy store package made up of several blueprints. This section will show how to do the same thing in a different way. We will still have a candy store component containing a gumball machine component. The difference this time, will be the gumball machine will be **owned** by the candy store.

There are two broad ways to modularise your components, each with distinct advantages.

1.  Global components: Like all the components from the previous sections, these are created at the global level and are accessible to all other components on the ledger.
2.  Owned components: Internal to other components, they are only accessible to their parent components.

:::note
**The scrypto package referenced in this section can be found in our [official examples here](https://github.com/radixdlt/official-examples/tree/main/step-by-step/16-candy-store-owned-modules**

.)
:::



## Global and Owned Components

All components are initially local. In this state they are not addressable by or accessible to others. To change this we globalize them. This is done after instantiation by first calling `prepare_to_globalize` (setting the component access rules and reserving an address) on the new component, then calling the `globalize` method like so:

``` rust
    .instantiate()
    .prepare_to_globalize(OwnerRole::None)
    .globalize();
```

Without these steps, to use a component it must be internal to another. This is done by adding the component in a parent component’s struct, with the wrapping `Owned` type, e.g.

``` rust
    struct CandyStore {
        gumball_machine: Owned<GumballMachine>,
    }
```

The owned component’s methods, can then be called by it’s parent, but no other components. e.g.

``` rust
    self.gumball_machine.buy_gumball(payment);
```

Let’s compare how this looks in our example packages.

<table>

<tr>

<td>

Package with Owned GumballMachine
</td>

<td>

Package with Global GumballMachine
</td>

</tr>

<tr>

<td>



</td>

<td>



</td>

</tr>



### Owned vs Global `GumballMachine`

The global `GumballMachine` is the same as from previous examples. The owned version is where we see several changes.

#### Restricted methods

<table>

<tr>

<td>

Owned
</td>

<td>

Global
</td>

</tr>

<tr>

<td>

- No method restrictions. This is now handled by the parent component.

  </td>

  <td>

``` rust
enable_method_auth! {
    methods {
        buy_gumball => PUBLIC;
        get_status => PUBLIC;
        set_price => restrict_to: [OWNER];
        withdraw_earnings => restrict_to: [OWNER];
        refill_gumball_machine => restrict_to: [OWNER];
}}
```

</td>

</tr>



#### Instantiation function start

<table>

<tr>

<td>

Owned
</td>

<td>

Global
</td>

</tr>

<tr>

<td>

- The parent component address is passed in.
- Only the new component is returned as there’s no owner badge.

``` rust
pub fn instantiate_gumball_machine(
   price: Decimal,
   parent_component_address:
    ComponentAddress,
) -> Owned<GumballMachine> {
```

</td>

<td>

- A component address reserved.
- Both the component and owner badge are returned.

``` rust
pub fn instantiate_gumball_machine(
  price: Decimal
) ->
   (Global<GumballMachine>, Bucket) {
      // reserve an address for the component
      let (
        address_reservation,
        component_address,
      ) =
         Runtime::allocate_component_address(
            GumballMachine::blueprint_id()
         );
```

</td>

</tr>



\#### Owner badge
<table>

<tr>

<td>

Owned
</td>

<td>

Global
</td>

</tr>

<tr>

<td>

- No owner badge. The parent component is the owner.

  </td>

  <td>

``` rust
let owner_badge = ...
```

</td>

</tr>



#### Gumball mint roles

<table>

<tr>

<td>

Owned
</td>

<td>

Global
</td>

</tr>

<tr>

<td>

``` rust
    .mint_roles(mint_roles! {
        minter => rule!(require(
              global_caller(
                  parent_component_address
            )));
        minter_updater => rule!(deny_all);
    })
```

</td>

<td>

``` rust
    .mint_roles(mint_roles! {
        minter => rule!(require(
            global_caller(
                component_address
            )));
        minter_updater => rule!(deny_all);
    })
```

</td>

</tr>



#### Instantiation function end

<table>

<tr>

<td>

Owned
</td>

<td>

Global
</td>

</tr>

<tr>

<td>

``` rust
    .instantiate()
```

</td>

<td>

``` rust
    .instantiate()
    .prepare_to_globalize(OwnerRole::Fixed(rule!(require(
        owner_badge.resource_address()
     ))))
    .with_address(address_reservation)
    .globalize();
```

</td>

</tr>



The owned version is simpler, as we’re able to remove much of the access and control code. The possible downside is the owned component no longer has a global address so cannot be accessed by components other than it’s owner, such as those in other packages. For some purposes this is ideal though.

### Owner vs Non-owner `CandyStore`

The `CandyStore` is globalized in both (this and the previous sections) version of our package. The code for its blueprint is simpler here, where it owns the `GumballMachine`. In this version there’s no need for a `GumballMachine` owner badge stored in this component. The only methods accessible on either blueprint are those of the `CandyStore`, so we restricted access to necessary methods on the `CandyStore` and we don’t need add restrictions to the `GumballMachine`. No method restrictions in the `GumballMachine` means no needs to hold the `GumballMachine` owner badge to pass proof of ownership to the `GumballMachine` to call it’s restricted methods. This is done with the `authorize_with_amount` method for the previous global `GumballMachine`, which we don’t have to use at all in this version.

#### Component state

<table>

<tr>

<td>

Owner (owned GumballMachine)
</td>

<td>

Non-owner (global GumballMachine)
</td>

</tr>

<tr>

<td>

``` rust
struct CandyStore {
    gumball_machine: Owned<GumballMachine>,
}
```

</td>

<td>

``` rust
struct CandyStore {
    gumball_machine: Global<GumballMachine>,
    gumball_machine_owner_badges: Vault,
}
```

</td>

</tr>



#### Address reservation

<table>

<tr>

<td>

Owner (owned GumballMachine)
</td>

<td>

Non-owner (global GumballMachine)
</td>

</tr>

<tr>

<td>

``` rust
let (address_reservation, component_address) =
    Runtime::allocate_component_address(
        CandyStore::blueprint_id()
    );
```

</td>

<td>

- None. The `GumballMachine` address and owner badge are used to restrict access to component methods and token behaviours.

  </td>

  </tr>

  

#### Gumball machine instantiation

<table>

<tr>

<td>

Owner (owned GumballMachine)
</td>

<td>

Non-owner (global GumballMachine)
</td>

</tr>

<tr>

<td>

``` rust
let gumball_machine =
    GumballMachine::instantiate_gumball_machine(
        gumball_price,
        component_address,
     );
```

</td>

<td>

``` rust
let (
       gumball_machine,
       gumball_machine_owner_badge,
     ) =
    GumballMachine::instantiate_gumball_machine(
        gumball_price
    );
```

</td>

</tr>



#### Globalizing

<table>

<tr>

<td>

Owner (owned GumballMachine)
</td>

<td>

Non-owner (global GumballMachine)
</td>

</tr>

<tr>

<td>

``` rust
    .instantiate()
    .prepare_to_globalize(
      OwnerRole::Fixed(rule!(require(
        owner_badge.resource_address()
     ))))
    .with_address(address_reservation)
    .globalize();
```

</td>

<td>

``` rust
    .instantiate()
    .prepare_to_globalize(
      OwnerRole::Fixed(rule!(require(
        owner_badge.resource_address()
     ))))
    .globalize();
```

</td>

</tr>



#### Calling restricted GumballMachine methods

<table>

<tr>

<td>

Owner (owned GumballMachine)
</td>

<td>

Non-owner (global GumballMachine)
</td>

</tr>

<tr>

<td>

``` rust
pub fn set_gumball_price(
    &mut self, new_price: Decimal
) {
    self.gumball_machine.set_price(
      new_price
    );
}
```

</td>

<td>

- To call a method on the GumballMachine we need to pass a proof that we have it’s owner badge.

``` rust
pub fn set_gumball_price(
      &mut self, new_price: Decimal
) {
  self.gumball_machine_owner_badges
    .as_fungible()
    .authorize_with_amount(
      1,
      || self.gumball_machine.set_price(
        new_price
    ));
}
```

</td>

</tr>

<table>

Owned components make for simpler code that is easier to read and maintain. But you will have to decide if removing global accessibility of some component works for your applications.

## Using the Candy Store

:::note
**Instructions on how to setup and use the multi-blueprint yourself can be found in the [Official Example GitHub repository](https://github.com/radixdlt/official-examples/tree/main/step-by-step/16-candy-store-owned-modules#using-the-candy-store**

)
:::


