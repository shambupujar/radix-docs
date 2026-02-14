---
title: "Conforming Manifest Types"
---

# Conforming Manifest Types

## Introduction

Transaction manifests make it possible for users to know the things that are important to them when signing. However, raw manifests are too complex for the average user to directly read and so the Radix Wallet, Radix Dashboard, and other client software show users a summarized transaction review UI for things they are about to sign.

Because manifests enable a virtually unlimited range of complex actions using potentially multiple Scrypto components, summarization may seem like a near-impossible task. Fortunately, the manifest’s security model means we can get all the information we need for the user-relevant parts of the transaction’s results by parsing only the manifest itself – not what happens within the Scrypto logic of component calls.

This is possible because, in the Radix transaction manifest model, movements of assets between the user’s account and other components happen in the transaction manifest itself. Scrypto components can just be treated as black boxes that accept resources and data as inputs, and return resources and data as outputs. We don’t really have to care about those inputs and outputs, because ultimately what matters to the user are the deposits, withdrawals, and other interactions with their accounts – not the details in between.

This means we can summarize the vast majority of transactions in normal use cases with a set of simple “transaction type” patterns of transaction manifest construction that focus on the things that matter to users. Each of those transaction types can have their own focused UI presentation in the wallet.

This document describes the list of transaction type patterns that the Radix Wallet plans to support and how they are identified. Developers can use this information to guide how they build transaction manifest stubs to send to user wallets to provide a smooth user experience.

## Wallet Handling of Manifests

The Radix Wallet will handle proposed transaction manifest stubs from dApps differently depending on its contents. Below are the different ways in which manifests may be handled.

### Conforming and Non-Conforming Manifests

The general principle of transaction types is this: If a given transaction is described by any of the transaction types described below, it is considered “**conforming**”. Otherwise, it is considered “**non-conforming**”.

- **Conforming manifests**, matching at least one of the transaction type patterns, can be easily summarized and presented in user-friendly UI by the Radix Wallet.

- **Non-conforming manifests** leave the wallet no choice but to fall back to an “advanced mode” that essentially displays the raw transaction manifest that is to be submitted to the network.

In advanced mode, the user still has the power to examine the transaction in advanced view in full detail, but the wallet is unable to summarize it elegantly like it can for conforming transactions. Developers are thus encouraged to avoid the pitfalls that would cause their transaction manifests to be non-conforming, and ensure their users have a good user experience when interacting with their dApps using the Radix Wallet.

Conforming manifests are not, however, intended to constrain transaction manifest construction to the point of limiting utility. Every reasonable use case we can think of (including complex multi-component composed transactions) can be served well by a conforming manifest, if the developer heeds some simple guidelines. In fact the vast majority of normal DeFi transactions are handled well by the “*general transaction*” type (see below) – most of the other types are intended to cover more unusual and specific things a user may need to only occasionally, or typically do only using the Radix Wallet itself.

More conforming transaction types may be added in the future, expanding the range of what Radix Wallet can present nicely to the user without falling back to a more raw presentation.

### Wallet-unacceptable Manifests

Radix Wallet expects to make its own additions to the manifest on the user’s behalf before signing and submitting it. These additions allow the user to assert their own control over their accounts, assets, and expected results of transactions. This means that there are some reserved manifest instructions that may cause a transaction to be considered unacceptable by the wallet and be rejected.

Parsing of transaction manifests, to see what transaction types they might match, occurs before the wallet makes its own additions. To be more accurate, parsing is done on a preview receipt of a transaction manifest stub submitted by a dApp to the wallet. The workflow is as follows:

1.  dApp sends a request to the wallet with a TX manifest stub

2.  Wallet performs a preview of this TX manifest stub, receiving a preview receipt

3.  Wallet analyzes this preview receipt (for a number of things, including transaction type)

4.  Wallet makes its own additions to the TX manifest stub, creating the final TX manifest

5.  TX manifest is signed, notarized, and submitted to the network

The additions the wallet will make include calling one of the user’s **accounts** to lock any required transaction fee and calling any of the user’s **access controllers** required in order to be authorized to make account calls that are included in the transaction.

dApps do not need to insert these instructions into the manifest stubs they create. Indeed **attempting to do so will generally be a reason for the wallet to reject them out of hand**. In fact many other method calls to accounts and access controllers are also grounds for rejection, if the transaction doesn’t conform to a transaction type that allows the wallet to summarize it clearly for the user. The following manifest instructions will cause a manifest stub to be rejected by the wallet if it is non-conforming:

- **Account** `lock fee` method calls

- **Account** or **Identity** `securify` method calls

- **Account** or **Identity** sets or locks of the `owner_keys` metadata field

- **Access Controller** method calls (all)

## Conforming Manifest Types

Below is the current list of conforming transaction manifest types.

These transaction manifest types are presented in *reverse priority* order. This is important because a transaction might match more than one type (particularly with the “*general transaction*” type which provides a flexible fallback for many types). This means that *the Radix Wallet should prefer transaction types that it supports that are lower down the list*. Transactions lower down the list are “*more specific*” - meaning that those summaries will be more informative than one further up the list that is more general.

For each type, we list the commands that are allowed in the manifest, assuming that anything not explicitly listed falls outside that type (other than the common manifest instructions listed above).

### 0) General Transaction (final fallback if no other types are matched)

The first type is the most general, providing a good summary for many kinds of transactions if nothing more specific is matched below.

The general transaction is intended to match just about any sort of typical arbitrary DeFi interaction, and summarize it in a way that tells the user what matters to them. The majority of transaction manifests built by dApps will be of the general transaction type.

**A general transaction may include any of these instructions in the transaction manifest stub:**

1.  Any number of withdrawals from account components

2.  Any number of calls to non-account components

3.  Any number of deposits to account components (either of defined quantity, or undefined)

4.  Any number of proofs produced from account components

If the transaction is made of these elements, it can be succinctly and consistently summarized in a view like this:







![general-transaction.png](/img/general-transaction.png)

Such a view encapsulates everything that matters to the user in such a transaction: They know what they lose, what they gain, what they’re interacting with, and what proofs of their own assets were required to accomplish it. Deposits that are of undefined quantity can be estimated (via transaction preview) and assert statements added to guardrail them.

The transaction might also include movements of assets between non-account components, but these details are safely ignored in the summary view because only the user’s own assets and accounts ultimately matter to them when deciding whether or not to sign.

Even though this transaction type is very flexible, there are still many manifest instructions that will cause it to fall out of the general transaction category. In some cases, a more specific transaction type (as listed below) might be required for certain instructions to be allowed in a conforming manifest.

Things that would fall outside the general transaction category include:

- Updates to metadata, access rules, or royalties

- Stake, unstake, or claim calls to validators

- Package deployments

#### Allowed instructions in General manifests

In addition to the transaction manifest instructions listed above, a variety of utility manifest instructions are allowed for the general transaction type, to make it as flexible as possible for normal dApp interactions. These do not affect user-relevant results and so they can be safely included without changing the nature of the normal user summary of a general transaction. The following instructions are allowed:

- All resource assertions (e.g. `ASSERT_WORKTOP_CONTAINS`)

- All bucket instructions except burning (e.g. `TAKE_FROM_WORKTOP`)

- All proof instructions (e.g. `PUSH_TO_AUTH_ZONE`)

- All function calls

- Most main-module method calls to accounts: withdraws, non-refund deposits, creating proofs and locking fees. The refund methods are disallowed because their deposit behaviour isn’t easy to present to the user.

- Public main-module method calls to validators: `stake`, `unstake` and `claim_xrd` *(although if you’re just doing this action, try to conform to the specific type for slightly better display in the wallet)*

- Standard main-module method calls to pools: `contribute` and `redeem` *(although if you’re just doing this action, try to conform to the specific type for slightly better display in the wallet)*

- All main-module method calls to scrypto components

- All main-module method calls to account lockers

- Allocating new addresses (`ALLOCATE_GLOBAL_ADDRESS`)

- Burning resources (`BURN_RESOURCE`)

#### Disallowed instructions in General manifests

The following instructions are disallowed:

- Calling methods on:

  - Packages (e.g. claiming package royalties)

  - Pools - `restricted_deposit` and `restricted_withdraw` as these are owner methods.

  - Validators - non-public methods

  - Access Controllers - instead, see the dedicated conforming manifest types below. *This will change soon, although calls to the Access Controller are still rejected instructions and can only be added by the wallet.*

  - Resources (e.g. mints)

- Calling non-main-module methods (`CALL_ROYALTY_METHOD`, `CALL_METADATA_METHOD`, `CALL_ROLE_ASSIGNMENT_METHOD`, `CALL_DIRECT_VAULT_METHOD` and [their associated aliases](manifest-instructions.md))

- Interacting with other intents (`YIELD_TO_PARENT`, `YIELD_TO_CHILD` and `VERIFY_PARENT`)

### 0.1) General Subintent

For [pre-authorization](../dapp-transactions/pre-authorizations-subintents.md) summaries to be shown in conforming form in the wallet, their manifest has to have a “General Subintent” type.

A manifest is classified as a General [Subintent](../dapp-transactions/subintents.md) if:

- It has at least one `YIELD_TO_PARENT` instruction.

- Each instruction is either a supported instruction in the General category, or `YIELD_TO_PARENT` or `VERIFY_PARENT`.

Note that a General Subintent is currently not allowed to have children itself.

#### Optimizing pre-authorization display in the wallet

The pre-authorization display focuses on statically guaranteed resource movements.

To optimize display of your manifest stub in the wallet, you should try to ensure that the static guarantees are very clear, by using certain [manifest instructions](manifest-instructions.md) to constrain what is possible.

- If your manifest is **self-contained**, and doesn’t interact with its parent, then the subintent is transaction-like and the wallet can give a best display using transaction rules and preview. To achieve this, start with `ASSERT_WORKTOP_IS_EMPTY`, end with an empty `YIELD_TO_PARENT` and contain no other subintent-only instructions.

- Otherwise, you will need to add assertion instructions to statically assert/constrain the resource deposits, to give your users more certainty.

These assertions are also crucial to ensure that your user’s expectations are met when the subintent is included in a transaction, and the user gets what they want.

Bear in mind that:

- At the start of the subintent, you may receive arbitrary resources from the parent intent

- At every dApp call and every YIELD, you may receive arbitrary resources from the parent intent

If you're not careful, users may see warnings like this, because they have approved a possible deposit of unspecified resources.

![Subintent warning](/img/Screenshot-2025-01-08-at-17.05.03.png)

There are a lots of patterns that can be used to constrain the [account](../native-blueprints/account.md) deposits. The following are some examples of possible structures for this:

- If you know an exact set of resources that will be deposited, then:

  - If you expect exact amounts, then create buckets with exact amounts with the `TAKE_FROM_WORKTOP` command

  - If you have a minimum bound on amounts, use `TAKE_ALL_FROM_WORKTOP` for a resource, and either:

    - Use `ASSERT_WORKTOP_CONTAINS <resource> <minimum amount>` to put a minimum bound on the worktop amount before the bucket is created

    - Use `ASSERT_BUCKET_CONTENTS` to put a minimum bound on the bucket once created (or more complicated bounds).

  - And then deposit *exact buckets* with `deposit [account] Bucket(...)` or `deposit_batch [account] Array<Bucket>(...)`

- Otherwise, if you have some flexibility in what gets deposited, and you have to use `deposit_batch [account] Expression("ENTIRE_WORKTOP")` then you will need to constrain things further. You have a couple of options. Either:

  - Use `ASSERT_WORKTOP_RESOURCES_ONLY` to constrain the resources to an allow list and attach bounds to them then deposit `Expression("ENTIRE_WORKTOP")`

  - Use `ASSERT_WORKTOP_RESOURCES_INCLUDE` to attach bounds to certain resources, but allow other resources to be present, and then deposit `Expression("ENTIRE_WORKTOP")`

### 1) Transfer

This type is when assets are being transferred from a user’s account directly to one or more other accounts, without any other component calls. Commonly this transaction type would be generated internal to the wallet itself with its own transfer feature, although it certainly could be generated by an external dApp.

**Allowed transaction manifest instructions:**

- Any number of withdrawals from a single account component (typically one owned by the user)

- Any number of deposits to any number of account components, all of defined quantity

That is all - meaning, among other things, that no non-account component calls are allowed.

With this type, the wallet is able to show a summary in an understandable style in terms of a “sender” and the assets to be received by one or more recipients, like this:







![transfer2.png](/img/transfer2.png)

### 1a) Simple Transfer

This is a sub-set of the Transfer type, intended specifically to allow very simple (but very common) 1-to-1 transfers of a single type of asset to be understood by **Ledger hardware wallet devices**. The treatment in the Radix Wallet is identical to the more general Transfer, but it has a more limited set of allowed transaction manifest commands for Ledger devices:

- A *single* withdrawal from an account component (typically one owned by the user) - either a withdrawal of a fungible resource or some number of non-fungibles of the same resource.

- A *single* create bucket by amount (whether fungible or non-fungible)

- A *single* deposit of that bucket to an account component

Again, no non-account component calls.

In this case, the Ledger device can show a summary with a simple To/From/Resource+Amount format. More complicated transfers will be treated by Ledger devices in the same way as other general transactions.

### 2) Contribute to Pool

**Allowed transaction manifest instructions:**

- Bucket creations

- Account methods to lock fee, non-refund deposit methods, and the `"withdraw"` method

- The `"contribute"` method on pools

- Resource assertions

### 3) Redeem from Pool

**Allowed transaction manifest instructions:**

- Bucket creations

- Account methods to lock fee, non-refund deposit methods, and the `"withdraw"` method

- The `"redeem"` method on pools

- Resource assertions

### 4) Stake to Validator

This type is when a user is directly staking XRD to one or more validator components, receiving liquid stake unit tokens as a result.

**Allowed transaction manifest instructions:**

- An ordered set of calls that withdraw a quantity of XRD from a user account, pass the full quantity of those XRD to a validator component’s stake method, and deposit the resulting liquid stake unit tokens back to that same account.

- One or more sets of the above, to support multiple stakes.

With this type, the wallet is able to show a summary of a set of stakes in a “staking X from account A, to validator B” style.

### 5) Unstake from Validator

This type is when a user is requesting an unstake of XRD from one or more validator components, receiving claim NFT(s) as a result.

**Allowed transaction manifest instructions:**

- An ordered set of calls that withdraw a quantity of LSU tokens from a user account, pass the full quantity of LSUs to a validator component’s unstake method, and deposit the resulting claim NFT back to that same account.

- One or more set of the above, to support multiple unstakes.

With this type, the wallet is able to show a summary of a set of unstakes in a “requesting unstake of X from validator A, to account B” style.

### 6) Claim Stake from Validator

This type is when a user is requesting an claim of unstaked XRD from one or more validator components.

**Allowed transaction manifest instructions:**

- An ordered set of calls that withdraw a single claim NFT from a user account, pass it to a validator component’s claim method, and deposit the resulting XRD back to that same account.

- One or more set of the above, to support multiple claims.

With this type, the wallet is able to show a summary of a set of claims in a “claiming X from validator A, to account B” style.

### 7) Update Account Deposit Settings

This type is when a user is updating the configuration settings of one or more of their own [accounts](../native-blueprints/account.md) that control if/how third-parties are able to deposit assets to them.

**Allowed transaction manifest instructions:**

- One or more calls to `set_default_deposit_rule` (choosing to set `Accept`, `Reject`, or `AllowExisting`)

- One or more calls to `set_resource_preference` (choosing to set `Allowed` or `Disallowed`) or `remove_resource_preference`

- One or more calls to `add_authorized_depositor` or `remove_authorized_depositor`

With this type, the wallet is able to show a description of settings to be changed, on a per-account basis. For example:

![Account Deposit Settings](/img/account-deposit-settings.png)




### 

## Possible future conforming types

- Deploy package

- Update metadata

- Update validator settings

- Claim component or package royalties

- Burn a held asset

- Coming with MFA support in the wallet, Access Controller actions, such as updating the account’s security configuration, recovery, locking and unlocking. These will only be usable by the wallet, and won’t be able to be created by dApps.
