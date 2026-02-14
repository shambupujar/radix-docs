---
title: "Account Deposit Patterns"
---

# Account Deposit Patterns

A common desire of blockchain applications is to send tokens to users – whether from dApp smart contract or backend system. Maybe you’re building a fully featured dApp, maybe you’re an exchange, or maybe you just want to do a mass airdrop.

On most blockchains, you have one solution: *call the transfer method of the token smart contract with a recipient address*. Radix’s asset-oriented approach means doing things differently, but also provides more power and control for you and your users.

## Before You Continue

Some important things to understand up-front about Radix:

- [**All tokens and NFTs on Radix are native “resources”, not smart contracts**](https://www.radixdlt.com/blog/its-10pm-do-you-know-where-your-tokens-are "https://www.radixdlt.com/blog/its-10pm-do-you-know-where-your-tokens-are")
  - Sending them means passing a bucket from sender to recipient – not calling a token smart contract  
- [**Accounts on Radix are native “components” (i.e. specialized smart contracts)**](https://www.radixdlt.com/blog/how-radix-multi-factor-smart-accounts-work-and-what-they-can-do "https://www.radixdlt.com/blog/how-radix-multi-factor-smart-accounts-work-and-what-they-can-do")
  - Sending to an account means passing a bucket of resources to a deposit method on it  
  - The account owner can always deposit to their own account (by signing the transaction)  
  - Third parties must use special deposit methods. The user can configure what resources can be deposited by third parties, and who can do so. For example, deposits of unrecognized resources can be turned off, enabling what is often called “no airdrop mode”  
- **Don’t treat a Radix user and an account address as the same thing**
  - The Radix Wallet lets users use multiple accounts with dApps, and has a separate “Persona” system to identify themselves  
  - Users may want to use different accounts at different times  
  - “Badge”-based auth on Radix provides a powerful system for authorization that isn’t account-driven

These unique Radix differences enable a much better experience for users, but as a developer, you might wonder how some use cases are handled. You might be asking: ***What do I do if I want to airdrop or do a payout to an account that doesn’t allow third party deposits?** Or: **How can I send tokens to users without using a fixed account address?***

This page explains some simple Radix patterns you can use for deposits, depending on your use case.

## Deposit Patterns for Specific Use Cases

There are a huge variety of circumstances where applications need to send tokens to users, such as:

- Returning tokens to a connected user from a DeFi transaction  
- Airdropping tokens to a large number of accounts with unknown owners  
- Withdrawing tokens from an exchange to a private account  
- Regularly and automatically allocating royalty payments or fees to users  
- Sending a “soulbound” NFT-based credential to a user

The solutions to these and other use cases on Radix are not difficult, but require a little bit of reorientation of thinking away from the typical “send to address” crypto way today.

A useful way to think about the problem is this: **In the real world, what are the different ways that a business sends a package to a customer?** There isn’t a single method. Is the customer standing in front of you? Do they accept packages at their mailing address? Do they have an existing relationship with your business?

This “physical package” metaphor is one we’ll use in the patterns below to help make them more understandable and intuitive.

The various deposit patterns in this document are useful in different situations and for different application needs. The flow chart below summarizes when the various deposit patterns are used. Each of these deposit patterns has a section in this document that dives deeper into them, their properties, how they’re used, and their advantages.

<p align="center">


</p>

## The “Online” User-signed Deposit Pattern

The simplest case is the one of a user actively interacting with your application, where tokens need to be returned to the user at that point in time. For example, they are doing a swap with your DEX dApp and the result of the trade needs to be returned to them.

To use the “physical package” metaphor, you don’t need to send anything through the mail because *your user is standing right in front of you – you just give them the package directly, and they can put it wherever they like*.

### How to use the User-signed Deposit pattern

**In this pattern, your on-ledger dApp component’s methods only need to return bucket of tokens. The component shouldn’t try to decide where those tokens should be deposited.** For example, a DEX takes some tokens to be swapped as input, and simply returns the bucket of resulting tokens. (This also makes the component design highly composable!)

To continue the example, the DEX application’s frontend will then build a transaction manifest to do the DEX swap and deposit the results. This will include withdrawing the tokens to be traded away from the user’s account, passing them to the DEX component, and then depositing the trade’s results to the user’s account. The DEX frontend probably has gotten the user’s preferred account to be used from the Radix Wallet, and used that selection to determine what account to use for the withdraw and deposit in the transaction manifest it builds.

In this case, [your transaction manifest can confidently use the account component’s deposit method directly](https://www.radixdlt.com/blog/using-native-accounts-to-interact-with-your-users-assets "https://www.radixdlt.com/blog/using-native-accounts-to-interact-with-your-users-assets") – because the user themself will be signing and submitting the transaction to the network in their Radix Wallet. Because they are signing it, they have the authority to deposit anything they like to their own account.

More difficult, however, are the situations where your user is “offline” and you wish to send them some tokens. To use the “physical package” metaphor, the recipient isn’t standing in front of you and you somehow want to get the package to them through the mail. That’s where the following patterns come in…

## “Offline” Send-to-User Application Patterns

To send tokens to a user from your components or backend system directly – not via a transaction that the user signs while connected, as above – there are three patterns that are recommended for developers, depending on the situation.

| Development Pattern | “Package” model description | Use Cases |
|----|----|----|
| **Badge and Claim Pattern** | Come pick up your package from us directly at our place of business. | Most standard dApps, with Scrypto components that need to send tokens to users while they are “offline” |
| **Account Locker Pattern** | We’ll try to send the package to your house, but if we can’t, you’ll have to come pick it up. | “Fire and forget” sends to an account address, like mass airdrops or exchange withdrawals |
| **Authorized Depositor Pattern** | Give us a permission to make a special delivery directly to your house. | Sending a “user badge”, or doing continuous distributions from a component or backend system the user trusts |

### The Badge and Claim Pattern

**This is the pattern to use for the great majority of normal decentralized application and backend transfer needs.**

The situation: You have a relationship with a user beyond a single transaction. Often the user is logging in to your web frontend. You want to send tokens to this user for a variety of reasons - either during an active “session” with the user, or asynchronously when they are offline. You may have specific rules that need to be met before the user can receive the tokens.

If the tokens are like a physical package, in the badge and claim pattern, you will be telling the user *“come pick up your package from us directly at our place of business”*.

#### How to use the Badge and Claim pattern

On a typical blockchain, you might register a particular address for the user and have your logic transfer tokens to it. But of course on Radix the user’s account may reject that deposit of tokens - and then what do you do?

Also, it’s much better if you allow your user to use whatever accounts they want to with your application over time, rather than tying them to a single one.

Instead it is recommended that your application use this process:

1.  Identify your user not by account address, but by a unique NFT “badge” that they hold. This badge could be a persistent non-transferable “user badge” (see pattern \#3), or it might be more like a single-use “claim ticket”.  
2.  When you have tokens to send to your user, store them within your own component in a vault keyed to that unique badge.  
3.  In your frontend, let the user “claim” the tokens at their own convenience. Your frontend builds a transaction in which a proof of their user badge is produced and passed to your component – or the badge itself is “turned in”, in the case of a single-use claim ticket. Your component can examine that proof/badge to identify the user and return the correct tokens.  
4.  The claim transaction can then deposit to any of the user’s accounts, as in the “online” pattern above, since the user themself signs and submits the transaction.

([More about this pattern can be found here](user-badge-pattern.md).)

However, you might be thinking *“if I use a non-transferable user badge, how do I send that badge to the user and ensure it reaches the right person?”*

Good question: see pattern \#3 below.

#### Advantages

- You don’t have to continually care about the third party deposit settings of your user’s accounts. Even if they allow no third party deposits, they can still claim their tokens from you.  
- You can allow your user to use whatever accounts they want with your application, whenever they want. As long as they can produce the proof of the user badge, they can claim their tokens.  
- The user badge may also be useful to gate access to certain features of your dApp’s components.  
- You may include other rules associated with the ability to claim. Perhaps the user has to produce proof not only of a user badge, but a KYC badge issued by another application (or even use that badge as the user badge itself). Perhaps you want to limit the time period during which they can claim. etc. Maybe you want to issue specific claim ticket assets for particular deposits.

### The Account Locker Pattern

:::note[Important Note]
The [Account Locker blueprint](../native-blueprints/locker.md) arrived in Jun 2024 with the Bottlenose protocol updated to the Radix Network, but the Radix Wallet functionality described here isn’t yet available. In the meantime, dApps will need to propose the transaction for the user to claim from the locker through the dApp’s website.
:::



**This is the pattern to use if you have an absolute need to conduct “no fail” deposits to particular account addresses. Exchanges or bulk airdrops are the classic examples.**

The situation: You may have no knowledge or relationship with the user other than the account address, and you simply want a fire-and-forget solution to distribute tokens.

If the tokens are like a physical package, the account locker pattern here is: “*We’ll try to send the package to your house, but if we can’t, you’ll have to come pick it up.*”

#### How to use the Account Locker pattern

The Radix network includes a native component called an [Account Locker](../native-blueprints/locker.md) which is specially designed to enable this pattern.

In short, you instantiate a locker for your dApp and can use it to hold deposits for particular account addresses that may be claimed *exclusively by the account owners*. If you wish you can have the locker attempt to directly deposit the assets to the account, and only hold them in the locker if this isn’t possible.

Basically the locker kind of acts like an “Amazon pick-up locker” that you can notify the user of, and ask them to claim from.

If you link your locker to your dApp Definition, and the user’s wallet already trusts your dApp, then the user may be notified that there is something from your dApp waiting to be claimed and do the claim from the wallet directly.

Use the following process:

1.  Instantiate a single locker component for use by your dApp. You never need more than one.  
2.  *(Recommended)* Configure the [verification metadata](../metadata/metadata-for-verification.md) on the locker to include a `dapp_definition`set to your dApp Definition address. In that dApp Definition, add the locker address to the `claimed_entities` list. This provides a verified link between the locker and your dApp for use by the Radix Wallet. Also add the locker address to an `account_locker` field on the dApp Definition to let the Radix Wallet know that it might check this address for available claims.  
3.  When you wish to do a send of tokens to addresses, use the locker’s `send` method. This will take an account address, resources to be sent, and a flag that control whether the method should first attempt to deposit the resources into the account or not.
    1.  If the method is invoked with the `try_direct_send` flag set to `true` the locker will attempt to immediately deposit the resources in that account, but if that is not possible (due to account deposit settings) it will store those resources for later claim by that account’s owner.  
    2.  If the method is invoked with the `try_direct_send` flag set to `false` the locker immediately keeps the resources for claim by the account owner without attempting to directly deposit. This may be used as a fallback if your own system wishes to attempt the direct deposit itself, or if you prefer to have all users receive their resources by claiming them  
4.  *If you did step 2:* The Radix Wallet will automatically watch the locker associated with your dApp, if it has previously connected to that dApp’s frontend. If there are any resources waiting for claim by accounts controlled by that user’s wallet, the wallet will display a simple alert that there are tokens from your dApp waiting to be claimed, and they will be able to claim them directly from their wallet with a tap.  
5.  *If you did not do step 2, or if the user has never connected to your dApp:* You will likely need to create a simple web UI where the user can connect their wallet and make their claim, and you will need to inform the user that there may be a claim waiting for them. For example, a mass airdrop might simply broadcast on social media that users should visit your website and connect their wallet to see if they were a recipient of the airdrop.

#### Advantages

This provides a good solution for very “one time” sends to particular accounts. It’s also good for sends where the application needs to fire off the send and have it be “off the books” - the user can pick up the deposit or not, but the dApp can forget about it.

In short, while it isn’t recommended for applications with an ongoing relationship with the user (where the Badge and Claim pattern may be better), this pattern provides a close replacement for the typical crypto “send to address” option.

However keep in mind that it will not work for non-transferable tokens, leading us to the final pattern…

### The Authorized Depositor Pattern

This is the pattern to use in the very particular narrow circumstances where you must make a direct deposit to a particular account, but where the Account Locker pattern is unsuitable.

The primary use case here is sending a user a non-transferable (“soulbound”) token to a particular account. In many cases this badge might be a user badge (used with the claim pattern) or other type of KYC or credential badge. And typically the user has provided proof that they own a particular account and the non-transferable token must be deposited into *that particular account*.

Perhaps the user provided a ROLA proof of an account address to your backend system with their Radix Wallet, and now you wish to send a user badge to that account for future use.

This pattern might also potentially be suitable for exchanges as an alternative to the Account Locker pattern where the user demands direct deposit to their account while they are offline.

The “physical package” pattern here is: “*Give us a permission to make a special delivery directly to your house.*”

#### How to use the Authorized Depositor pattern

All Radix accounts give the owner the ability to configure their own preferences for what tokens (resources) may be deposited to that account by an unknown third party. ([See documentation on the account component](../../integrate/exchange-integration-guide/worked-example-2-tracking-deposits-any-account.md))

If you wish to make a direct deposit of a non-transferable token to an account, your system can first ask [a Radix Gateway or Node, via API](../../integrate/network-apis/index.md), if deposit of the token will be allowed by its settings. This will include checking if either the default account deposit mode or the resource preference map would block the deposit. If the answer is that the deposit is okay, go ahead and make the deposit using one of the `try_deposit` methods and you’re done!

If however the account will *not* allow the direct deposit, you can ask the user to allow your particular application to be able to deposit to that account by adding you as an “authorized depositor”. Use the following process:

1.  Create a resource to use as a depositor badge. Store this badge within the dApp component that will be conducting the direct deposit to the user’s target account. (This can be a single badge used for all users of your system.)  
2.  Submit a [transaction request to the user’s wallet](https://github.com/radixdlt/radix-dapp-toolkit?tab=readme-ov-file#transaction-requests "https://github.com/radixdlt/radix-dapp-toolkit?tab=readme-ov-file#transaction-requests") for a transaction that adds your dApp’s badge to the target account’s authorized badge list. The user will be presented with an understandable summary of this transaction explaining that you are requesting this addition to their account’s rules. You may wish to inform the user in your UI that you are making this request, and why. You may even want to make this request part of the “user onboarding” flow for your dApp after they have [logged in with their wallet](https://github.com/radixdlt/radix-dapp-toolkit?tab=readme-ov-file#login-requests "https://github.com/radixdlt/radix-dapp-toolkit?tab=readme-ov-file#login-requests").  
3.  Once this transaction is submitted by the user, your application may present proof of its badge in any transaction your system submits that uses a `try_deposit` call to the user’s account. Because your badge is on the authorized depositor list, the deposit will succeed regardless of any other rules set on the account.

#### Advantages

Once the user has approved your depositor badge, your application has free reign to deposit to that account - just like on a typical crypto network (although using the `try_deposit` method of the Radix account component).

However, it is still encouraged to use the “claim pattern” rather than relying on this pattern completely. By using this pattern to send your user a user badge, you allow the user to use different accounts with your application in the future and you avoid having to continually submit new depositor badge transactions to the user whenever you wish to deposit to a different account.
