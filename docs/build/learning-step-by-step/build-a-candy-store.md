---
title: "Build a Candy Store"
---

# Build a Candy Store

This is a good opportunity to introduce another new blueprint. This time we’ll create a candy store with two products, candy tokens and chocolate egg non-fungibles that each have toys inside. We’re also going to have not just an owner role, but manager and staff roles too, so the store owner doesn’t have to run all the day to day of the store. This introduces a new concept, **authorization roles**, which we will provide an explanation for.

:::note
**The scrypto package referenced in this section can be found in our [official examples here](https://github.com/radixdlt/official-examples/tree/main/step-by-step/13-candy-store**

.)
:::



## Authorization Roles

Authorization in Scrypto is handled with roles. Each component has 2 predefined roles, the Owner role and the Self role. In previous examples, we used the Owner role to restrict access to multiple methods on our gumball machines. Here we’ll add two more custom roles, the Manger and the Staff roles.

### Adding Roles

Additional roles are defined in the `enable_method_auth!` macro at the top of the blueprint code. We add the manager and staff roles here:

``` rust
enable_method_auth! {
    roles {
        manager => updatable_by: [OWNER];
        staff => updatable_by: [manager, OWNER];
    },
```

The component methods can then be restricted to one or more roles:

``` rust
    methods {
        buy_candy => PUBLIC;
        buy_chocolate_egg => PUBLIC;
        get_prices => PUBLIC;
        set_candy_price => restrict_to: [manager, OWNER];
        set_chocolate_egg_price => restrict_to: [manager, OWNER];
        mint_staff_badge => restrict_to: [manager, OWNER];
        restock_store => restrict_to: [staff, manager, OWNER];
        withdraw_earnings => restrict_to: [OWNER];
    }
}
```

### Badge Creation

Along with the Owner badge we now need a Manger badge and a Staff badges. The Manger badge is just like the Owner badge, but with `name` and `symbol` metadata of `Manger Badge` and `MNG` respectively.

``` rust
let manager_badge: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
    .metadata(metadata!(
        init {
            "name" => "Manger Badge", locked;
            "symbol" => "MNG", locked;
        }
    ))
    .divisibility(DIVISIBILITY_NONE)    
    .mint_initial_supply(1)
    .into();
```

The Staff badge, as well as having it’s own `name` and `symbol`, is mintable in case we hire more staff.

To make it mintable we’ve set the minter rule to require the component address as proof. To do that we have to reserve an address for the component at the beginning of the instantiate function.

``` rust
let (address_reservation, component_address) =
    Runtime::allocate_component_address(CandyStore::blueprint_id());
```

The `component_address` can then be used in the `minter` rule.

``` rust
let staff_badge: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
    .metadata(metadata!(
        init {
            "name" => "Staff Badge", locked;
            "symbol" => "STAFF", locked;
        }
    ))
    .divisibility(DIVISIBILITY_NONE)
    .mint_roles(mint_roles! {
        // add component address to minter rule
        minter => rule!(require(global_caller(component_address)));
        minter_updater => rule!(deny_all);
    })
    .mint_initial_supply(2)
    .into();
```

This means that only the instantiated `CandyStore` component can mint the Staff badge, which can be done with the `mint_staff_badge` method called from the component.

This is the **Virtual Badge pattern** described in [Use the Gumball Machine on Stokenet](/learning-to-use-the-gumball-machine-on-stokenet).

The same minting rule is applied to our candy and chocolate egg tokens. This Scrypto code means that we’ll know that they must have come from our `buy_candy` and `buy_chocolate_egg` methods, as only the `CandyStore` component can mint them.

### Instantiation

Now we have these new roles and rules, we need to instantiate the component with rules stating which proofs are required to fulfil which roles. We also need to give the new component it’s address reserved at the beginning of the instantiation function.

``` rust
let component = Self {
                // --snip--
    }
    .prepare_to_globalize(OwnerRole::Fixed(rule!(require(
        owner_badge.resource_address()
    ))))
    // define required proofs for custom roles
    .roles(roles!(
        manager => rule!(require(manager_badge.resource_address()));
        staff => rule!(require(staff_badge.resource_address()));))
    // apply the address reservation to the component
    .with_address(address_reservation)
    .globalize();
```

## Candy Store Methods

Buying a chocolate egg works the same as buying a gumball in previouse sections. You provide a payment and if it is more than the cost of an egg, you get one chocolate egg and change.

``` rust
pub fn buy_chocolate_egg(&mut self, mut payment: Bucket) -> (Bucket, Bucket) {
```

Buying candy is a little different. You can buy as much candy as is currently in stock at once, if you have the tokens to pay for it. The payment is divided by the candy price and you receive that many candy tokens, plus any change. You get as much candy as you can afford for your XRD. Any change is returned with the candy

``` rust
pub fn buy_candy(&mut self, mut payment: Bucket) -> (Bucket, Bucket) {
```

:::note[Checked Math]
The `buy_candy` method uses checked mathematical operations to prevent overflow which might lock a component. It is **highly recommended** that you do the same in any Decimal calculations.

``` rs
   let candy_amount = payment
       .amount()
       .checked_div(self.candy_price)
       .unwrap()
       .checked_round(0, RoundingMode::ToZero)
       .unwrap();
```

See the [Decimal Overflows](../scrypto/code-hardening.md#pay-special-attention-to-decimal-operations) section of the docs for more information.
:::



There are also two methods to set the price of the candy and chocolate eggs. These are restricted to the manager and owner roles.

``` rust
pub fn set_candy_price(&mut self, new_price: Decimal) {
```

``` rust
pub fn set_chocolate_egg_price(&mut self, new_price: Decimal) {
```

Minting staff badges is also restricted to the manager and owner roles. The method returns the minted badge rather than storing it in the component.

``` rust
pub fn mint_staff_badge(&mut self) -> Bucket {
```

The `restock_store` method can be called by staff, manager or owner role holders. It now adds resources to two vaults, adding one of each type of egg and refilling the candy vault to 100.

``` rust
    pub fn restock_store(&mut self) {
        let candy_amount = 100 - self.candy.amount();
        self.candy
            .put(self.candy_resource_manager.mint(candy_amount));

        let eggs = [
            Egg { toy: Toy::Dinosaur },
            Egg { toy: Toy::Unicorn },
            Egg { toy: Toy::Dragon },
            Egg { toy: Toy::Robot },
            Egg { toy: Toy::Pony },
        ];
        
        // loop through eggs array
        for egg in eggs.iter() {
            self.chocolate_eggs.put(
                // mint a non-fungible for each egg
                self.chocolate_egg_resource_manager
                    .mint_ruid_non_fungible(egg.clone()),
            )
        }
```

## Using the Candy Store

:::(Info) (We’ve put instructions for using the Candy Store in our [official examples on GitHub](https://github.com/radixdlt/official-examples/tree/main/step-by-step/13-candy-store#using-the-candy-store))
