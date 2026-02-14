---
title: "Create and Use Transaction Manifests"
---

# Create and Use Transaction Manifests

In this Step-by-Step section there are no changes to the previous [Refillable Gumball Machine](/learning-to-make-your-gumball-machine-refillable) blueprint. Instead we focus on transaction manifests, what they do and how to use them.

:::note
**The scrypto package referenced in this section can be found in [our official examples here](https://github.com/radixdlt/official-examples/tree/main/step-by-step/07-gumball-machine-transaction-manifests**

.)
:::



## Transaction Manifests

Every transaction in the Radix Engine and Radix Engine Simulator (resim) has a manifest. Transaction manifests are lists of instructions that are followed by the engine. They are listed in order of execution in largely human readable language, so that in most cases we can see what a transaction will do without too much effort. If any step fails for any reason, the entire transaction fails and none of the steps are committed to the ledger on the network.

Here is an example of simple transaction manifest to transfer 10 XRD from one account to another:

``` rust
CALL_METHOD
    Address("account_sim1c956qr3kxlgypxwst89j9yf24tjc7zxd4up38x37zr6q4jxdx9rhma")
    "lock_fee"
    Decimal("5")
;
CALL_METHOD
  Address("account_sim1c956qr3kxlgypxwst89j9yf24tjc7zxd4up38x37zr6q4jxdx9rhma")
  "withdraw"
  Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
  Decimal("10")
;
CALL_METHOD
  Address("account_sim1c9yeaya6pehau0fn7vgavuggeev64gahsh05dauae2uu25njk224xz")
  "deposit_batch"
  Expression("ENTIRE_WORKTOP")
;
```

In the above:

- The first method call withdraws 10 XRD from an account leaving it on the transaction worktop

  > **The Transaction Worktop**
:::note
The transaction worktop is a temporary storage area for resources during a transaction. Withdrawn resources are automatically placed on the worktop. The transaction cannot be completed until all resources are deposited elsewhere and the worktop is clear.
:::



- The second method call deposits everything on the worktop (the 10 XRD) to another account

## Generating Transaction Manifests

Although you can write manifests by hand, it easier to use `resim` to generate them for you. With very few modifications they can then be used on the network as well as the simulator.

resim generates transaction manifests for us for each transaction, so we don’t have to create and apply them ourselves. Normally we don’t have access to them, but we can use the `--manifest <FILE_NAME>` flag to produce the manifest for a given transaction instead of run it. e.g.

``` sh
resim call-function package_sim1pk3cmat8st4ja2ms8mjqy2e9ptk8y6cx40v4qnfrkgnxcp2krkpr92 GumballMachine instantiate_gumball_machine 5 --manifest instantiate_gumball_machine.rtm
```

This will print the manifest to the file `instantiate_gumball_machine.rtm`, where we can view, modify or run it.

### Transaction Fees

Transactions in the Radix Engine require a small fee to pay for the resources used to run the transaction. The simulator has these too and you’ll see an amount reserved for the fee at the start of each transaction manifest. That looks something like this:

``` rust
CALL_METHOD
    Address("component_sim1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxhkrefh")
    "lock_fee"
    Decimal("5000")
;
```

This locks a fee for the transaction from the faucet, a component that will produce an endless supply of XRD whenever we need it. The `5000` value is high enough to cover any incurred fee and the unspent part is left with the component. This component, of course, does not exist on the main Radix network, so these fees have to be handled in different ways. The Radix Wallet can automatically add them for us, but if our transaction do not involve the Wallet we will need to `lock_fees` in manifest so they be processed. For now though, as we are working in the simulator, we do not have to worry.

## Transaction Manifests in `resim`

To run a transaction manifest in `resim` we can use the `run` command, e.g.

``` bash
resim run instantiate_gumball_machine.rtm
```

Performing transaction in this way allows us to run multiple of the same transaction, with a much shorter command.

## Using Transaction Manifests

:::note
**Try using the Gumball Machine transaction manifests yourself. Follow the instructions in [our official-examples repo](https://github.com/radixdlt/official-examples/tree/main/step-by-step/07-gumball-machine-transaction-manifests#using-transaction-manifests**

.)
:::


