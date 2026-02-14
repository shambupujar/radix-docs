---
title: "Pre-authorizations & Subintents"
---

# Pre-authorizations & Subintents

Pre-authorizations (the user-facing name for [subintents](subintents.md)) allow a partial transaction to be authorized by one actor such that it can then become a part of a larger atomic transaction. That larger transaction can then be submitted to the network by another actor. They are a powerful tool which can be used for a wide number of new use cases.

Pre-authorizations launched on mainnet at the [Cuttlefish](../../updates/protocol-updates/cuttlefish.md) protocol update in December 2024.

## Introduction to Pre-authorization

<!--
NOTE:
I've purposefully added alternative spellings below, so that the site search finds this article when you search without the dash!
-->

This video introduces the pre-authorization / preauthorization / preauth concept, and covers other information in this page. 

## Pre-authorization Flow

The following diagram compares the standard transaction request flow with the pre-authorization request flow covered in this article. In the dApp toolkit these are initiated with [sendTransaction](https://github.com/radixdlt/radix-dapp-toolkit/blob/main/packages/dapp-toolkit/README.md#sendtransaction) and [sendPreAuthorizationRequest](https://github.com/radixdlt/radix-dapp-toolkit/blob/develop/packages/dapp-toolkit/README.md#preauthorization-requests) respectively.

<!-- https://whimsical.com/dapp-wallet-request-model-roadmap-2VDXWwR8uHne5PEp2dwen1 -->



The pre-authorization flow happens in four parts: 1. **Pre-authorization request:** A dApp front-end uses the [dApp toolkit](../dapp-development/dapp-toolkit.md) to send a [pre-authorization request](https://github.com/radixdlt/radix-dapp-toolkit/blob/main/packages/dapp-toolkit/README.md#preauthorization-requests) to the wallet which includes a [subintent](subintents.md) manifest stub, an expiry schedule and an optional message. \* A subintent manifest stub must not include any fee locks - these are included by the [transaction intent](/docs/transaction-intent). \* The Radix Wallet currently requires that pre-authorizations do not have children of their own - all [interaction with other subintents](intent-structure.md) must go through its parent. \* At execution time, a subintent does not start running until it is yielded to from its parent. The parent may pass the subintent buckets immediately, which end up on its starting worktop. \* A subintent manifest *must* end with a `YIELD_TO_PARENT` instruction, and *may* include additional intermediate yields, if it needs to run logic before/after interaction with the rest of the transaction. \* If possible, it’s recommended to *first withdraw/yield buckets* and then *deposit buckets at the end*. This allows the most liquidity/flexibility in the rest of the transaction. \* The manifest stub should include `ASSERT_...` instructions to ensure that the user ends up with at least the resources they expect. 2. **User review and signing:** The wallet shows a pre-authorization review for the user, and if they sign, passes it back to the dApp as a hex-encoded `SignedPartialTransaction` (which just contains a single signed subintent with no children). \* If the subintent is [self-contained](subintents.md), it is shown with a preview-style review, which allows the user to add their own guarantees. \* If the subintent has a [“GeneralSubintent” classification](docs/conforming-manifest-types#01-general-subintent) then it displays statically-computable bounds on the user’s account withdrawals and deposits. The wallet may add access controller calls to access the provided wallets, but will otherwise not change the manifest. The dApp developer will likely need to tweak the `ASSERT_...` instructions to ensure the bounds are as the user expects. These is detailed guidance on this under the [GeneralSubintent](docs/conforming-manifest-types#01-general-subintent) conforming manifest type. 3. **Propagation:** The dApp front-end is then responsible for relaying the signed partial transaction to a back-end service which can build it into a transaction and submit it. \* Depending on the use case, this may be the dApp’s own backend, or it may be to a specific external intent matcher (such as Anthic) or a more general subintent aggregator/solver (which doesn’t exist as of Cuttlefish launch). \* Note that the subintent aggregation and propagation is out-of-band of the network. The network mempools only operate with transactions. \* Each subintent aggregation service may have their own requests for metadata the dApp provides. Some may request that the manifest stub contains a `VERIFY_PARENT` instruction to ensure only their aggregator can be used. 4. **Transaction construction and submission:** The subintent aggregator finds/creates other intents to work with the subintent(s) it receives, builds up the transaction using a v2 partial transaction builder / transaction builder, previews the resulting transaction, and if happy, notarizes it and submits it to the network. \* The [v2 (partial) transaction builders](../../integrate/rust-libraries/transaction-building.md) are available in the [v1.3.0+ rust radix-transactions crate](../../integrate/rust-libraries/index.md) or in a variety of UniFFI [Radix Engine Toolkits](../../integrate/radix-engine-toolkit/index.md). As of December 2024, they are not yet available in the Typescript Radix Engine Toolkit. \* A v2 preview transaction can be created from the transaction builder, and previewed with the v2 preview endpoint on the [Core API](https://radix-babylon-core-api.redoc.ly/#tag/Transaction/paths/~1transaction~1preview-v2/post) or [Gateway API](https://radix-babylon-gateway-api.redoc.ly/#operation/TransactionPreviewV2).

## Use Cases

### Delegated Fees

In this use case, a dApp wishes to unconditionally pay fees for a user’s interaction with their dApp, so that e.g. the user is not required to have any XRD in their account.

The dApp acts as the subintent aggregator, in order to pay fees for a user’s subintent: 1. The dApp sends the user a pre-authorization request with a subintent manifest to interact with their app, much like a transaction request. \* To get a typical preview-based review experience where the user can set guarantees, the subintent manifest stub should ideally be [self-contained](subintents.md). If not, the user will get a static review based on guaranteed deposit amounts. 1. The dApp backend would then: \* Decompile the subintent to verify it is doing exactly what the dApp expects and so the dApp is comfortable paying fees for the user \* Wrap it in a transaction intent, where the transaction intent locks a fees from the dApp account \* Preview the transaction to ensure it is valid (e.g. that the user has the claimed resources) \* Sign/notarize with keys for the dApp account \* Submit the transaction to the network

<!-- https://whimsical.com/dapp-wallet-request-model-roadmap-2VDXWwR8uHne5PEp2dwen1 -->



### User Badge Deposit

A dApp wishes to deposit a user badge to a user’s account [where they *may* have configured their account to reject deposits of new resources](../native-blueprints/account.md).

In this case, the dApp acts as the subintent aggregator and: 1. Proposes a subintent manifest stub which: \* Receives the dApp badge at the start of execution \* Deposits it to their account \* Optionally it may also add a `VERIFY_PARENT` so that the user has confidence that this manifest can only be used by the dApp itself. \* YIELDs back to parent to finish. Optionally it can also withdraw and a small bucket of XRD back to the dApp in the YIELD, to cover fee costs. 1. The dApp front-end then passes the signed partial transaction to their backend, for checking, wrapping, signing and submitting, as per the delegated fee payment use case.

<!-- https://whimsical.com/dapp-wallet-request-model-roadmap-2VDXWwR8uHne5PEp2dwen1 -->



### Intent-based partial trades

In this use case, a dApp wishes to allow a user to take one side of a trade, possibly involving interacting with their dApp. They can their share the subintent with an aggregation network which can hopefully find the other side of the trade for the user.

1.  A dApp proposes a subintent which:
    - Withdraws resources from a user’s account
    - Optionally interacts with a dApp component, and/or `VERIFY_PARENT` to ensure only certain subintent aggregator/s can be used
    - Calls `YIELD_TO_PARENT` with some buckets of resources (including some fee payment)
    - Deposits explicit returned buckets from the YIELD back to the user’s account
2.  This subintent can be passed to an external subintent aggregator network to be paired with other subintents/intents which can “take the other side” of the trade.

#### Anthic example

To take [Anthic](https://www.anthic.io/) ([primer blog](https://www.radixdlt.com/blog/introducing-anthic-the-first-intent-based-dex-on-radix/) \| [integration docs](https://docs.anthic.io/integration/dex/example)) as a particular example:

1.  Any DEX dApp can integrate Anthic. They call to the [Trade API](https://docs.anthic.io/api/trade_api/) to get details and the current order book in order to construct a transaction as per the [worked example](https://docs.anthic.io/integration/dex/example#compute-limit-order).
2.  The dApp constructs a subintent manifest stub in a particular [Anthic-compatible format](https://docs.anthic.io/concepts/subintents) and sends to the user’s wallet.
3.  The dApp then submits the signed partial transaction from the user with some metadata to the Anthic Trade API.
4.  Anthic attempts to find a matching trade with market makers, gets a signed partial transaction from them. It combines these into a complete transaction and submits it to the network.

<!-- https://whimsical.com/dapp-wallet-request-model-roadmap-2VDXWwR8uHne5PEp2dwen1 -->



### Co-ordinated ticket purchase

In this use case, a user wishes to use a trusted dApp to co-ordinate a ticket purchase with a friend, and ensure that they either both end up with a ticket, or neither person ends up with a ticket.

In this case, the dApp acts as the subintent aggregator and: 1. Proposes a separate subintent to each user for their purchase 1. Combines the resulting signed partial transactions into a single transaction, which must commit atomically. 1. Passes the transaction to its backend for checking, wrapping, signing and submitting as per the delegated fee payment use case.

<!-- https://whimsical.com/dapp-wallet-request-model-roadmap-2VDXWwR8uHne5PEp2dwen1 -->


