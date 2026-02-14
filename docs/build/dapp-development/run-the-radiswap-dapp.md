---
title: "Run The Radiswap Dapp"
---

The Radiswap dApp is the last example in the step-by-step learning journey. It takes the concepts learned in the previous sections and combines them with some new additions to make a single, more complex demonstration of what you can do with Scrypto. The Radiswap dApp is a decentralized exchange (DEX) that allows users to deposit and swap between two tokens.

:::note
**The scrypto package referenced in this section can be found in our [official examples here](https://github.com/radixdlt/official-examples/blob/main/step-by-step/21-radiswap-dapp**

.)
:::



## The Radiswap Scrypto Package

### Two Resource Pools

The Radiswap package is a customised wrapper around the standard TwoResourcePool native blueprint with the addition of a swap function. There are a range of [native pool blueprints](https://docs.radixdlt.com/docs/pool-component) available in the Radix Engine, and the TwoResourcePool is one of the most commonly used. It does what you would expect and holds two resources allowing users to deposit and withdraw from the pool in exchange for Pool Unit resources (often called LP tokens). This is a useful part of the functionality of many dApps and these functions are accessed with the `add_liquidity` and `remove_liquidity` methods. In our case the Radiswap blueprint extends the pool blueprint’s methods by also allowing users to swap between the two resources in the pool.

### The Swap Method

The `swap` method accepts an input amount of one resource and returns an output amount of the other resource.

``` rs
pub fn swap(&mut self, input_bucket: Bucket) -> Bucket {
```

The exchange rate is determined by comparing the size of the resource pools with a formula used in many automated market makers (AMMs), a constant product formula that looks like this:

    output_amount = input_amount * (output_reserves / (input_reserves + input_amount))

The [checked math](../scrypto/code-hardening.md#pay-special-attention-to-decimal-operations) version of this becomes:

``` rs
let output_amount = input_amount
                .checked_mul(output_reserves)
                .unwrap()
                .checked_div(input_reserves.checked_add(input_amount).unwrap())
                .unwrap();
```

If you aren’t familiar with the formula, you can find out more about it and how it’s used by looking up AMMs.

### Radiswap Component Instantiation

To instantiate a Radiswap component we need to provide 3 arguments:

- `owner_role` - what rule defines the component owner
- `resource_address1` - the first resource in the pool
- `resource_address2` - the second resource in the pool
- `dapp_definition_address` - the address of the dapp definition account

The first and last of these are new to us.

#### Customizing the Owner Role in a Transaction Manifest \#

The first is simply the full owner role declaration that we’ve been declaring in blueprints before, usually either as `OwnerRole::None` or using the `rule!` macro and some resource address, e.g.

``` rust
OwnerRole::Fixed(rule!(require(
                owner_badge.resource_address()
            )))
```

Now that we’ve made it an argument we’ll need to provide the full role in a transaction manifest when we instantiate the component. To do that we’ll use some new [Manifest Value Syntax](../transactions-manifests/manifest-value-syntax.md), instead of the `rule!` shorthand, that works for Scrypto but doesn’t in manifests. This will give us a function call that looks something like this:

    CALL_FUNCTION
        Address("<PACKAGE_ADDRESS>")
        "Radiswap"
        "new"
        Enum<OwnerRole::Fixed>(
            Enum<AccessRule::Protected>(
                Enum<AccessRuleNode::ProofRule>(
                    Enum<ProofRule::Require>(
                        Enum<ResourceOrNonFungible::Resource>(
                            Address("<OWNER_BADGE_ADDRESS>")
                        )
                    )
                )
            )
        )
        Address("<RESOURCE_ADDRESS_1>")
        Address("<RESOURCE_ADDRESS_2>")
        Address("<DAPP_DEFINITION_ADDRESS>")
    ;

Though for the rare case of no owner we could just put:

    CALL_FUNCTION
        Address("<PACKAGE_ADDRESS>")
        "Radiswap"
        "new"
    Enum<OwnerRole::None>()
        Address("<RESOURCE_ADDRESS_1>")
        Address("<RESOURCE_ADDRESS_2>")
        Address("<DAPP_DEFINITION_ADDRESS>")

#### Adding a Dapp Definition Account Address in a Transaction Manifest \#

The second new instantiation argument is the dapp definition account address. Adding a this address as an argument allows us to add it as metadata for the component now, rather than in the Developer Console later. In [Set Verification Metadata](../learning-step-by-step/set-verification-metadata.md) we customised our metadata in the [Developer Console](https://stokenet-console.radixdlt.com/configure-metadata), but if we already know what we want it to be, we can add it at instantiation, e.g.

``` rs
pub fn new(
      owner_role: OwnerRole,
      resource_address1: ResourceAddress,
      resource_address2: ResourceAddress,
      dapp_definition_address: ComponentAddress,
  ) -> Global<Radiswap> {

  // --snip--

  .instantiate()
  .prepare_to_globalize(owner_role.clone())
  .with_address(address_reservation)
  .metadata(metadata!(
      init {
          // --snip--
          "dapp_definition" => dapp_definition_address, updatable;
      }
  ))
  .globalize();
```

Adding the dapp definition account address as metadata in the instantiation manifest will look like this:

    CALL_FUNCTION
        Address("<PACKAGE_ADDRESS>")
        "Radiswap"
        "new"
        // --snip--
        Address("<DAPP_DEFINITION_ADDRESS>")
    ;

:::note[Updating Metadata]
You can find more information about setting and updating metadata in the [Entity Metadata](../metadata/entity-metadata.md#configuring-metadata-roles) section of the documentation.
:::



This changes the steps to instantiate the package component on Stokenet. You can find those updated steps in the [Using the Radiswap Front End on Stokenet](#using-the-radiswap-front-end-on-stokenet) Setup section below.

### Event Emission

[Events in Scrypto](../scrypto/events.md) are a way to communicate to off chain clients. They are emitted by the component and can be listened for to begin secondary actions with the [Gateway](../../integrate/network-apis/index.md#gateway-api) or [Core](../../integrate/network-apis/index.md#core-api) APIs. There are many events that already exist in the core components. You may have noticed these in transaction receipts on resim. In the Radiswap component we also emit *custom* events when different methods are called. For example a `SwapEvent`, which contains the amount of each resource swapped:

``` rs
#[derive(ScryptoSbor, ScryptoEvent)]
pub struct SwapEvent {
    pub input: (ResourceAddress, Decimal),
    pub output: (ResourceAddress, Decimal),
}
```

Is emitted whenever the `swap` method is called:

``` rs
pub fn swap(&mut self, input_bucket: Bucket) -> Bucket {
  // --snip--
  Runtime::emit_event(SwapEvent {
      input: (input_bucket.resource_address(), input_bucket.amount()),
      output: (output_resource_address, output_amount),
  });
```

For these events to be emitted successfully, they all need to be declared in a `#[events(...)]` attribute at the start of the blueprint:

``` rs
#[blueprint]
#[events(InstantiationEvent, AddLiquidityEvent, RemoveLiquidityEvent, SwapEvent)]
mod radiswap {
```

As no part of a transaction will succeed if any of it fails, events will not be emitted if the transaction does not complete successfully.

## The Radiswap Front End

The Radiswap front end is a single web page that allows anyone with a Radix Wallet to interact with Radiswap component on ledger. Its HTML defines several buttons and text inputs and runs the `client/main.js` script, where interactions with the Radix network and wallet take place.

These types of front end interactions were previously described in more detail in both the [Run Your First Front End Dapp](../learning-step-by-step/run-your-first-front-end-dapp.md) and [Run the Gumball Machine Front End dApp](../learning-step-by-step/run-the-gumball-machine-front-end-dapp.md) sections of the documentation. They are summarised again here.

In `client/main.js` we use the [radix-dapp-toolkit](dapp-toolkit.md) and [gateway-api-sdk](../../integrate/network-apis/gateway-sdk.md) to interact with the Radix network.

``` javascript
import {
  RadixDappToolkit,
  // --snip--
} from "@radixdlt/radix-dapp-toolkit";
import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
```

A connection to the Radix Wallet and Network is established using the Radix dApp Toolkit, Gatway API and a [Dapp Definition](dapp-definition-setup.md):

``` javascript
const dAppDefinitionAddress = "_YOUR_DAPP_DEFINITION_ACCOUNT_ADDRESS_";
// --snip--

// Create a dapp configuration object for the Radix Dapp Toolkit and Gateway API
const dappConfig = {
  networkId: RadixNetwork.Stokenet,
  applicationVersion: "1.0.0",
  applicationName: "Hello Token dApp",
  applicationDappDefinitionAddress: dAppDefinitionAddress,
};
// Instantiate Radix Dapp Toolkit to connect to the Radix wallet
const rdt = RadixDappToolkit(dappConfig);
// Instantiate Gateway API client to query the Radix network
const gatewayApi = GatewayApiClient.initialize(dappConfig);
```

With this and the Radiswap component address, the front end can then get information about the components state via the gateway API, e.g.

``` javascript
const componentDetails =
  await gatewayApi.state.getEntityDetailsVaultAggregated(componentAddress);
```

As well as connect to and request details from a Radix Wallet:

``` javascript
rdt.walletApi.setRequestData(DataRequestBuilder.accounts().exactly(1));
```

With a connection to the wallet established, the dapp can then use the transition manifests generation functions in the `client/manifests` directory to interact with the Radiswap component. For example, to swap resources in the pool:

``` javascript
import {
  // --snip--
  getSwapManifest,
} from "./manifests";

// --snip--

swapButton.onclick = async function () {
  const manifest = getSwapManifest({
    accountAddress: account.address,
    resourceAddress: swapTokenInput.value,
    amount: swapAmountInput.value,
    componentAddress,
  });

  const result = await rdt.walletApi.sendTransaction({
    transactionManifest: manifest,
    version: 1,
  });
  if (result.isErr()) throw result.error;
```

This covers most of the types of front end functionality, but [the commented code](https://github.com/radixdlt/official-examples/blob/main/step-by-step/21-radiswap-dapp/client/main.js) is waiting to be explored, if you’re looking for more detail.

## Using Radiswap

:::note[There are two described ways you can use Radiswap, both of which you’ll find instructions for in our official examples on Github.]
1. [**Using the Radiswap Scrypto package in `resim`**](https://github.com/radixdlt/official-examples/blob/main/step-by-step/21-radiswap-dapp#using-the-radiswap-scrypto-package-in-resim) will show you how to use Radiswap locally, in the Radix Engine Simulator 2. [**Using the Radiswap front end on Stokenet**](https://github.com/radixdlt/official-examples/tree/main/step-by-step/21-radiswap-dapp#using-the-radiswap-front-end-on-stokenet) shows you how to deploy the scrypto package to the test network, instantiate a new Radiswap component, then connect that to a useable locally running front end.
:::


