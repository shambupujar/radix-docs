---
title: "Tooling"
---

Transaction manifests are human-readable list of instruction that are followed by the Radix engine to transfer resources or otherwise change state.

See the [Transaction Manifest Model](../learning-step-by-step/create-and-use-transaction-manifests.md) and further reading on how to think about the transaction manifest and transaction layer.

## Concepts

### Fee payment

To run a transaction on the Radix network, you have to pay a fee depending on the number of instructions you are calling and the permanent storage used. You do this by locking XRD from a vault that will then be used to pay for the fee calculated at the end of a transaction. To lock a fee, you must call a method that essentially calls `.lock_fee(amount)` on a vault containing XRD. There is a method that do this on the Account component:

``` bash
CALL_METHOD
  Address("[account_component_address]")
  "lock_fee"
  Decimal("[amount]");
```

For testing purposes, on the local simulator, you can also call the `lock_fee` on the System component (address `component_sim1qftacppvmr9ezmekxqpq58en0nk954x0a7jv2zz0hc7q8utaxr`) so the fee payment comes from the system rather than your account.

You can read more about fees [here](../../reference/costing-limits/transaction-costing.md).

### The Worktop

Each transaction has a worktop that is a place that resources may be held during the transaction execution. Resources returned from component calls are automatically put onto the worktop. From there, the manifest may specify that resources on the worktop be put into named buckets so that those buckets may be passed as arguments to other component calls.

The manifest may also use `ASSERT` commands to check the contents of the worktop, causing the entire transaction to fail if not enough of the checked resource is present. This is useful to guarantee results of a transaction, even if you may be unsure of what a component may return.

Of course we know that all resources must be in a vault by the end of any transaction, so the transaction manifest creator must ensure that no resources are left hanging around the worktop or in buckets by the end of the manifest’s steps.

### The Authorization Zone

Another key concept is the authorization zone. The authorization zone acts somewhat similar to the worktop, but is used specifically for authorization. Rather than holding resources, the authorization zone holds proofs.

A proof is a special object that proves the possession of a given resource or resources. When a component method or blueprint function is called by the transaction manifest, the proofs currently in the transaction’s authorization zone are automatically used to validate against the authorization rules defined in that method/function’s role assignments. If this check fails, the transaction is aborted.

Proofs can enter the auth zone from two places:

- Signatures on the transaction are automatically added to the authorization zone as "virtual signature proofs". This, for example, is how you are able to call the withdraw method on a pre-allocated account component which is still set up to require a proof of a signature with its corresponding public key hash.

- Proofs can also be returned by calls to methods. They are automatically added to the authorization zone by the [transaction processor](/v1/docs/transaction-processor).

For more about proofs and authorization, please see the [Authorization Model](../authorization/authorization-model.md).

# Tooling

There are various tools for building transaction manifests for testing, learning and interacting with your components:

- For simulators / learning:

  - Use the Radix Engine Simulator `resim` - this allows running transactions to perform actions against a simulated ledger, and also supports outputting example manifests for any actions it can perform.

- For crafting more complex manifests:

  - Use the [Rust Manifest Builder](../../integrate/rust-libraries/manifest-builder.md) - this can allow building and outputting arbitrary manifests to a file easily, including complex manifests such as those creating Non Fungible Resources.

  - Use the [Manifest Instructions](manifest-instructions.md) as reference to write manifests manually.

- For front-end dApp builders:

  - Use template strings for simple manifests, or the <a href="https://github.com/radixdlt/radix-dapp-toolkit?tab=readme-ov-file#build-transaction-manifest">Typescript Radix Engine Toolkit</a> for more complex manifests - as per the docs in the <a href="https://github.com/radixdlt/radix-dapp-toolkit?tab=readme-ov-file#build-transaction-manifest">Radix dApp Toolkit</a>.

- For integrators looking to programmatically create manifests or transactions:

  - If writing in Rust, use the [Rust Manifest Builder](../../integrate/rust-libraries/manifest-builder.md).

  - If writing in other languages, use the [Radix Engine Toolkit](../../integrate/radix-engine-toolkit/manifest-builder.md).

## Using Radix Engine Simulator`resim`

The `resim` CLI supports basic method (or function) invocation transactions. Any transaction `resim` supports can be outputted as a transaction manifest without committing it to the simulated ledger.

To use the feature, add `--manifest <path>` flag to your `resim call-function` , `resim call-method` commands (or any other command that would create a transaction).

For example:

``` bash
resim call-function package_sim1qy2f2f63ddpw8x40m55ytpru428vk66edhdpvz60ljqsj5y7v8 Hello instantiate_hello --manifest out.rtm
```

will produce something like:

``` bash
CALL_METHOD
  Address("account_sim1qsw6l5leaj62zd38x8f6qhlue76f9lz0n2s49s3mzu8qczjhm2")
  "lock_fee"
  Decimal("10"); // #1
CALL_FUNCTION
  Address("package_sim1qy2f2f63ddpw8x40m55ytpru428vk66edhdpvz60ljqsj5y7v8")
  "Hello"
  "instantiate_hello"; // #2
CALL_METHOD
  Address("account_sim1qsw6l5leaj62zd38x8f6qhlue76f9lz0n2s49s3mzu8qczjhm2")
  "deposit_batch"
  Expression("ENTIRE_WORKTOP"); // #3
```

1.  To pay for the transaction fees, your transaction must contain a call to a method locking fees. For testing purposes, this example calls the lock_fee method on the System component. In practice, you would call the lock_fee method on your account’s component.

2.  This line calls the instantiate_hello function on the Hello blueprint

3.  This line takes all the resources present on the worktop, puts them in buckets and send them back into your account. In this case it’s not important since no resources are returned from the instantiate_hello function.

You can edit the auto-generated manifest to modify or add any other instructions you like.

## Using the Rust Manifest Builder

See<a href="/v1/docs/rust-manifest-builder">Rust Manifest Builder</a>.

## Writing Transaction Manifests Manually

Once you’re familiar enough with the transaction manifest syntax you can of course write manifest instructions from scratch. Please see the [full instruction list and specification](manifest-instructions.md) to learn more. It is also very common to use instructions that call methods on [Native Blueprints](../native-blueprints/index.md). You will find blueprint methods listed in their specification (e.g. [Account](../native-blueprints/account.md#blueprint-api-function-reference)) where you will also find links to their <a href="https://docs.rs/scrypto/1.2.0/scrypto/component/">Rust Docs</a>.

### Examples

#### "Composed" Multi-Component Transaction

Now let’s get a little more advanced by composing together calls to multiple components, using the resources returned from each to feed into the next.

We’ll take 1 XRD from our account, call another component to buy a gumball, and then swap that gumball in a Radiswap component for some other resources (we won’t check on what we got back; we’ll just deposit whatever it is back into our account).

First, we’ll use some placeholders for readability:

``` bash
# lock fees to pay for the transaction
CALL_METHOD
  Address("account_sim1qsw6l5leaj62zd38x8f6qhlue76f9lz0n2s49s3mzu8qczjhm2")
  "lock_fee"
  Decimal("10");

# withdraw 1 XRD from account, which goes to the worktop
CALL_METHOD
  Address("account_sim1qsw6l5leaj62zd38x8f6qhlue76f9lz0n2s49s3mzu8qczjhm2")
  "withdraw"
  Address("[xrd_address]")
  Decimal("1");

# take 1 XRD from the worktop and pass it to the gumball machine
TAKE_FROM_WORKTOP
  Address("[xrd_address]")
  Decimal("1")
  Bucket("xrd");
CALL_METHOD
  Address("component_sim1qve43kxmshr40xakn6akj5amzc3walsdyqdgr8ermncq8uvy97")
  "buy_gumball"
  Bucket("xrd");

# take all returned gumballs and do a radiswap
TAKE_FROM_WORKTOP
  Address("resource_sim1qye43kxmshr40xakn6akj5amzc3walsdyqdgr8ermncqzz5l6k")
  Decimal("1")
  Bucket("gumballs");
CALL_METHOD
  "swap"
  Address("component_sim1q0d9pmtn6xsrsqkdxlzyjrdnc9n94n9fma3jtrrehymst2rv4k")
  Bucket("gumballs");

# deposit everything into my account
CALL_METHOD
  Address("account_sim1qsw6l5leaj62zd38x8f6qhlue76f9lz0n2s49s3mzu8qczjhm2")
  "deposit_batch"
  Expression("ENTIRE_WORKTOP");
```

If you want to see the same transaction with some actual addresses from a local run, here you go:

``` bash
# lock fees to pay for the transaction
CALL_METHOD
  Address("account_sim1qsw6l5leaj62zd38x8f6qhlue76f9lz0n2s49s3mzu8qczjhm2")
  "lock_fee"
  Decimal("10");

# withdraw 1 XRD from account, which goes to the worktop
CALL_METHOD
  Address("account_sim1qsw6l5leaj62zd38x8f6qhlue76f9lz0n2s49s3mzu8qczjhm2")
  "withdraw"
  Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k")
  Decimal("1");

# take 1 XRD from the worktop and pass it to the gumball machine
TAKE_FROM_WORKTOP
  Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k")
  Decimal("1")
  Bucket("xrd");
CALL_METHOD
  Address("component_sim1qve43kxmshr40xakn6akj5amzc3walsdyqdgr8ermncq8uvy97")
  "buy_gumball"
  Bucket("xrd");

# take all returned gumballs and do a radiswap
TAKE_FROM_WORKTOP
  Address("resource_sim1qye43kxmshr40xakn6akj5amzc3walsdyqdgr8ermncqzz5l6k")
  Decimal("1")
  Bucket("gumballs");
CALL_METHOD
  Address("component_sim1q0d9pmtn6xsrsqkdxlzyjrdnc9n94n9fma3jtrrehymst2rv4k")
  "swap"
  Bucket("gumballs");

# deposit everything into my account
CALL_METHOD
  Address("account_sim1qsw6l5leaj62zd38x8f6qhlue76f9lz0n2s49s3mzu8qczjhm2")
  "deposit_batch"
  Expression("ENTIRE_WORKTOP");
```
