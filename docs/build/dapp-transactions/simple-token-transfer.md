---
title: "Lock fees to pay for the transaction"
---

A very common example of a transaction manifest is transferring tokens from one account to another.

It's worth quickly seeing how to build the transaction manually as an example, but in practice:

- Most users will have this kind of transaction built for them by their wallet.

- Most integrators would use a tool like the [Radix Engine Toolkit](../../integrate/radix-engine-toolkit/manifest-builder.md) to build their transfer transactions.

## Contents of the transaction

In the manifest, first we need to call `lock_fee` to pay for the transaction.

Accounts are components, so even a token transfer happens by calling methods on the accounts of the sender and recipient, we therefore need to start by calling withdraw on our sender account.

We then need to call `deposit` on the recipient account, but first we need to put the resource we’d like to deposit in a bucket. We can do this by creating a named bucket from the worktop with the `TAKE_FROM_WORKTOP` command, and then using that named bucket in the following `deposit` call.

And conceptually that’s the manifest! But when building the transaction, we also need to consider authorization. To do that, we need to look at who can perform the [account methods](../native-blueprints/account.md):

- Unsurprisingly, only the **owner** of the account can call `lock_fee` and `withdraw`, so we need to ensure we provide proof we are the owner in the [auth zone](/v1/docs/transaction-processor). For pre-allocated accounts tied to a key pair, as commonly used by integrators, this will take the form of a “virtual signature proof” and mean we need to sign the transaction with the right key. For securified accounts, we will need to provide an owner proof from another component such as an [access controller](../native-blueprints/access-controller.md), which itself will require some combination of signature factors to allow us access.

- Perhaps surprisingly, the **owner** of the account is also required to call `deposit`. This is because `deposit` will always succeed, regardless of the [account’s resource deposit configuration](../native-blueprints/account.md), as it requires the owner to sign off on the transaction. The deposit method should be used for dApp interactions where the owner will be present at transaction signing time. If you’re building a transaction to transfer resources without the owner being present, you will instead need to use a method starting `try_deposit_*`, such as `try_deposit_or_abort`. For further information, see the detailed description of the [account methods](../native-blueprints/account.md).

## Building the Transfer Manifest Manually

We’ll start by using our account’s withdraw method to get 10 XRD from our account, which will return the XRD to the worktop. We’ll take it from the worktop and put it in a bucket, which we’ll then pass to the deposit method on the recipient’s account.

:::note
The snippets below uses examples using the Gumball Machine and Radiswap. If you are following along the examples on your own, with exception of the known addresses, your local resim will likely produce its own unique addresses from what is shown in the snippets below.
:::


``` bash
# Lock fees to pay for the transaction
CALL_METHOD
  Address("account_sim1qsw6l5leaj62zd38x8f6qhlue76f9lz0n2s49s3mzu8qczjhm2")
  "lock_fee"
  Decimal("10");

# Withdraw 10 XRD from account, which goes to the worktop
CALL_METHOD
  Address("account_sim1qsw6l5leaj62zd38x8f6qhlue76f9lz0n2s49s3mzu8qczjhm2")
  "withdraw"
  ResourceAddress("[xrd_address]")
  Decimal("10");

# Take 10 XRD from the worktop and put it in a bucket
TAKE_FROM_WORKTOP
  Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k")
  Decimal("10")
  Bucket("xrd");

# Try to deposit the bucket of XRD into the recipient's account. This will fail if they've disabled XRD deposits.
CALL_METHOD
  Address("account_sim1qsw6l5leaj62zd38x8f6qhlue76f9lz0n2s49s3mzu8qczjhm2")
  "try_deposit_or_abort"
  Bucket("xrd")
  None; # Don't provide any authorized depositor badge
```

If my account doesn’t actually have 10 XRD in it, then the transaction will fail on that first line.

We can make this transaction manifest even simpler by using batch deposit functionality with `Expression("ENTIRE_WORKTOP")`, which sweeps up everything on the worktop and allows it to be deposited to an `account`.

However - it's best to avoid using the Expression("ENTIRE_WORKTOP") command if you can help it - as the transaction cannot show up as well in wallets. Please see the guide on [conforming manifests](../transactions-manifests/index.md) for more information.

``` bash
# Lock fees to pay for the transaction
CALL_METHOD
  Address("account_sim1qsw6l5leaj62zd38x8f6qhlue76f9lz0n2s49s3mzu8qczjhm2")
  "lock_fee"
  Decimal("10");

# Withdraw 10 XRD from account, which goes to the worktop
CALL_METHOD
  Address("account_sim1qsw6l5leaj62zd38x8f6qhlue76f9lz0n2s49s3mzu8qczjhm2")
  "withdraw"
  Address("resource_sim1qyqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs6d89k")
  Decimal("10");

# Take everything from the worktop (currently 10 XRD) and attempt to deposit it into the recipient's account. This will fail if they've disabled XRD deposits.
CALL_METHOD
  Address("account_sim1qsw6l5leaj62zd38x8f6qhlue76f9lz0n2s49s3mzu8qczjhm2")
  "try_deposit_batch_or_abort"
  Expression("ENTIRE_WORKTOP")
  None; # Don't provide any authorized depositor badge
```

  
