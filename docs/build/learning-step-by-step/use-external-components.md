---
title: "Use External Components"
---

# Use External Components

With the right access, components on the Radix ledger can contact and call methods on global components instantiated from other packages. This section shows us how to make those external calls with our now very familiar Candy Store and Gumball Machine components.

:::note
**The scrypto package referenced in this section can be found in our [official examples here](https://github.com/radixdlt/official-examples/tree/main/step-by-step/18-candy-store-external-component**

.)
:::



## External Components

There are [many methods to use external components in Scrypto](https://docs.radixdlt.com/docs/cross-blueprint-calls#calling-a-specific-blueprint-or-global-component-of-your-package). Here we show you one of the simpler of these ways. There are two main steps:

First, we use the `extern_blueprint!` macro to import the external blueprint into our own. This process is the same as in the previous section, but this time we won’t instantiate the external component in our package.

``` rust
extern_blueprint! {
        // import the GumballMachine package from the ledger using its package address
        "<YOUR_GUMBALL_MACHINE_PACKAGE_ADDRESS>",
        GumballMachine {
            // --snip--
        }
    }
```

Second, we store the external component’s address (and owner badge for non public method calls) in our in our new component’s state.

``` rust
struct CandyStore {
        gumball_machine_owner_badge: Vault,
        gumball_machine_address: Global<GumballMachine>,
    }
```

The important part here is the address is stored as the component’s type, `Global<GumballMachine>`. Component types are all addresses in the Radix Engine. By applying the type, we can now call the methods on the external component described in our `extern_blueprint!` macro, e.g.

``` rust
    pub fn buy_gumball(&mut self, payment: Bucket) -> (Bucket, Bucket) {
        // buy a gumball
        self.gumball_machine_address.buy_gumball(payment)
    }
```

This combination of importing the external blueprint and storing the component address in our component’s state allows us to call an external component’s methods from within our component.



## Authorizing Calls Between Components

In previous sections, this logic is abstracted away in the `authorize_with_amount` method. Here we explain and see the process in more detail.

When we call restricted methods in one component from another, we need to prove we have authorization for the inner component. Proving ownership of badges only works per component or resource. This is to avoid the possibility of accidentally escalating permissions by providing unintended authorization. This means that when one method calls another method requiring authorization on a separate component, a proof needs to be placed on a local authorization zone for the second component. e.g.

``` rust
pub fn set_gumball_price(&mut self, new_price: Decimal) {
    // create a proof of the gumball machine owner badge
    let gumball_machine_owner_badge_proof = self
        .gumball_machine_owner_badge
        .as_fungible()
        .create_proof_of_amount(1);
    // place the proof on the local auth zone, so methods called within this method are authorized by it
    LocalAuthZone::push(gumball_machine_owner_badge_proof);
    // set the gumball machine's price, authorized by the gumball machine owner badge proof.
    self.gumball_machine_address.set_price(new_price);
}
```

The proof is created so the badge doesn’t need to be removed from its vault and passed around. It can be placed wherever we need to prove ownership of the badge and only exists for the duration of the transaction. More about proofs and the Authorization Zone can be found in the [Call a Protected Method/Function documentation section](../authorization/call-a-protected-method-function.md).

## Using the Candy Store and External Gumball Machine

:::note
**You can try external cross component calls for yourself by following the instructions in the [official examples GitHub here](https://github.com/radixdlt/official-examples/tree/main/step-by-step/18-candy-store-external-component#using-the-candy-store-and-external-gumball-machine**

)
:::


