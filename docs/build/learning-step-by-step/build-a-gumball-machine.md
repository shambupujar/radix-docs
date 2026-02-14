---
title: "Build A Gumball Machine"
---

It’s time to take a look at our next Scrypto package. The Gumball Machine is a Radix favorite. Here we cover the creation of its simplest version, which allows users to purchase a gumball in exchange for XRD. This will be the basis for next few steps in our learning journey.

In addition to the most basic operation, this particular example allows the instantiator to set the price (in XRD) of gumballs, and allows callers to submit more than the exact price required. Callers will receive their change (if any) in addition to their tasty gumball. The Radix engine works out what change remains allowing us to easily return it with the bought gumball.

:::note[Example Code]
The Scrypto package referenced in this section can be found in [our official examples here](https://github.com/radixdlt/official-examples/tree/main/step-by-step/04-gumball-machine).

If you wish to clone the whole repository you can run

``` sh
git clone https://github.com/radixdlt/official-examples.git
```

To view this example move in to it’s directory

``` sh
cd official-examples/step-by-step/04-gumball-machine
```

then open in your chosen IDE or code editor. e.g. for VSCode run

``` sh
code .
```
:::



## Resources and Data

``` rust
struct GumballMachine {
  gumballs: Vault,
  collected_xrd: Vault,
  price: Decimal
}
```

Our gumball machine will hold two kinds of resources in vaults: the gumballs to be dispensed, and any XRD which has been collected as payment.

We’ll also need to maintain the price, which we’re using `Decimal` for. `Decimal` is a bounded type appropriate for use for resource quantities. In Scrypto, it has a fixed precision of 10<sup>-18</sup>, and a maximum value of 2<sup>96</sup>. Unless we’re selling spectacularly expensive gumballs, this should be fine. If we wanted an unbounded type to use for quantity, we could use `BigDecimal` instead.

## Getting Ready for Instantiation

In order to instantiate a new gumball machine, the only input we need from the caller is to set the price of each gumball. After creation, we’ll be returning the address of our new component, so we’ll set our function signature up appropriately:

``` rust
pub fn instantiate_gumball_machine(price: Decimal) -> ComponentAddress {
```

Within the `instantiate_gumball_machine` function, the first thing we need to do is create a new supply of gumballs which we intend to populate our new component with:

``` rust
let bucket_of_gumballs: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
   .divisibility(DIVISIBILITY_NONE)
   .metadata(metadata!(
      init {
         "name" => "Gumball", locked;
         "symbol" => "GUM", locked;
         "description" => "A delicious gumball", locked;
      }
   ))
   .mint_initial_supply(100)
   .into();
```

All that’s left is to populate our `GumballMachine` struct with our supply of gumballs, the user-specified price, and an empty Vault which we will force to contain XRD. Then we’ll instantiate it, which returns the address, and we’ll return that to the caller.

``` rust
Self {
   gumballs: Vault::with_bucket(bucket_of_gumballs),
   collected_xrd: Vault::new(XRD),
   price: price,
}
.instantiate()
.prepare_to_globalize(OwnerRole::None)
.globalize()
```

## Allowing Callers to Buy Gumballs

In order to sell a gumball, we just need the method caller to pass us in enough XRD to cover the price. We’ll return the purchased gumball, as well as giving back their change if they overpaid, so we actually need to return *two* buckets. This is easily accomplished by simply returning a tuple, giving us a method signature like this:

``` rust
pub fn buy_gumball(&mut self, mut payment: Bucket) -> (Bucket, Bucket) {
```

Note that we used `&mut self` because our reference to ourself must be mutable; we will be changing the contents of our vaults, if all goes well.

Accomplishing the actual mechanics of putting the XRD in our vault, taking a gumball out, and then returning the gumball as well as whatever is left in the caller’s input bucket are trivial:

``` rust
let our_share = payment.take(self.price);
self.collected_xrd.put(our_share);
(self.gumballs.take(1), payment)
```

Note that we didn’t have to check that the input bucket contained XRD…when we attempt to put tokens into our `collected_xrd` Vault (which was initialized to contain XRD), we’ll get a runtime error if we try to put in anything else and the transaction would not take place.

:::note[Unstored Tokens]
If tokens do not end up in a vault, you would need to confirm they are the correct resource by comparing the resource address with your desired address, e.g.

``` rust
assert_eq!(payment.resource_address(), XRD);
```

Transactions cannot complete with any remaining tokens not stored in vaults, so this is needed only when tokens are received and either transferred away again or burned in the same transaction.
:::



Similarly, we’ll get a runtime error if we try to take out a quantity matching the price, and find that there is insufficient quantity present.

Finally, if the user provided exactly the correct amount of XRD as input, when we return their `payment` bucket, it will simply contain quantity 0.

## Checking the Price and Amount of Gumballs

To check the price and availability of gumballs we have a method that returns both in a `Status` struct:

``` rust
pub fn get_status(&self) -> Status {
    Status {
        price: self.price,
        amount: self.gumballs.amount(),
    }
}
```

`Status` is a custom type that we’ve defined outside of our blueprint, above it in the same file in this case. So that it can work inside the blueprint we give it the `#[derive(ScryptoSbor)]` attribute.

``` rust
#[derive(ScryptoSbor)]
pub struct Status {
    pub price: Decimal,
    pub amount: Decimal,
}
```

The `#[derive(ScryptoSbor)]` attribute allows data to be encoded into and decoded from [Scrypto SBOR](/docs/sbor), the serialization data format required by the Radix Engine. This makes it required for all custom types.

## Using the Gumball Machine

:::note
**To try using the Gumball machine in the Radix Engine Simulator follow the instructions in [the official-examples repo](https://github.com/radixdlt/official-examples/blob/main/step-by-step/04-gumball-machine/README.md#using-the-gumball-machine**

.)
:::

 \## `resim` Makes Things Easy

To make things easy `resim` hides some steps from us, steps in the form of transaction manifests. A transaction manifest is a list of instructions that must be submitted to the network for the transaction to take place.

`resim` automatically generates and submits these manifest files for us. We will revisit this in later examples but, if you’d like to see these hidden manifest you can add the `--manifest` flag to the `resim` command.

Try it out with,

``` shell
resim call-method <COMPONENT_ADDRESS> buy_gumball --manifest manifest.rtm
```

This will output the manifest file to `manifest.rtm` in the current directory, where you can inspect it.

:::note
Let us know if you find any section helpful or not by clicking one of the buttons below ⬇. You can also let us know about a typo or outdated information using the same buttons.
:::


