---
title: "dApp Definition Setup"
---

# dApp Definition Setup

A dApp Definition Account allow you to prove the authenticity of your dApp and its it’s relationships with other entities. It does this by:

1.  [Providing an on-ledger registration to establish relationships between your dApp’s entities (packages, components, resources)](../metadata/metadata-for-wallet-display.md)

2.  [Providing an on-ledger registration for a dApp (frontend) verification to ensure user interacting with your dApp is authentic.](../metadata/metadata-for-verification.md)

The role of the dApp Definition Account is visibly most meaningful in the Radix Wallet to inform your users how entities of your dApp are related to each other. Most importantly, it helps authenticate your dApp’s website (and other entities) to ensure your users are not fooled by fake representation of your dApp. In essence, the dApp Definition Account acts as a hub which connects all the parts of your dApp together.

## Setting up a dApp Definition using Dev Console

Ideally, a dApp Definition account should be created after you have built your dApp’s components and resources, and created a website front end for it.

1.  **Create a new account in the Radix Wallet**. This is the account which we will convert to a dApp Definition account.

2.  If you’re just learning <a href="https://stokenet-console.radixdlt.com/configure-metadata">Head to the Stokenet Developer Console</a>. “Configure Metadata” page provides a simple interface to set the metadata on an account to make it a dApp Definition. If you are ready for production make sure to set up your dApp Definition on the <a href="https://console.radixdlt.com/configure-metadata" target="_blank">Mainnet Dev Console</a>.

3.  **Connect your Radix Wallet to the Dev Console**. Share the account you’re about to convert into dApp definition.

4.  Go to “Configure Metadata” page

5.  Fill in the account address to entity search input. You can copy it from the list of accounts you’ve already shared.

6.  Click “Search” button or hit “Enter”.

7.  You will see initial form with one “account_type” field and “Badges” section. Change value of “account_type” field to “dapp definition”.

8.  Fill in the name, description, tags and icon_url. These fields are [standard display metadata](../metadata/metadata-for-wallet-display.md) entries for account entity. Values of these fields will be displayed when your dApp sends requests to wallet

9.  In order to set [metadata for verification](../metadata/metadata-for-verification.md), you need to fill claimed_websites and claimed_entities fields.

    1.  **claimed_websites** - Here, you can claim ownership of your dApps website(s) for authenticity. This is confirmed by looking up an expected `.well-known/radix.json` file at the claimed website origin. **This will be required for your dApp to successfully send requests to the Radix Wallet at Mainnet.**

    2.  **claimed_entities** - Here, you can claim ownership of resources, components, and packages.

10. **Click “Send to the Radix Wallet”**

11. An approve transaction should appear in your Radix Wallet to confirm!

When you set up the [Radix dApp Toolkit](dapp-toolkit.md) in your dApp frontend website, you’ll configure it with the dApp Definition address that you just created, and it will be sent to the Radix Wallet whenever a user connects or receives a transaction from your dApp. The Wallet will then look up that dApp Definition address on the Radix Network, pull the latest metadata, and show it to the user. When a user logins to your dApp, an entry in the wallet’s preferences for your dApp will appear too.

## Claimed Entities

You can use “Standard Metadata” page to link resources or components back to dApp definition account. This way you will setup correct 2-way link which can be verified by Radix Wallet. In order to do that, paste address of a component or a resource to initial entity search input. You’ll see a predefined set of standard metadata fields for given entity. Fill them and send transaction to the Radix Wallet, the same as it was done for dApp definition account.

## Badges

Sometimes setting metadata on a component or a resource is restricted only to people who hold a certain badge. You can use badge section in “Configure Metadata” page to proof that you do own some resources. Selecting fungible token from the list will create a proof that you own at least one. Selecting non fungible resource will allow you to present particular NFT from collection. This way you can change metadata on entities with more sophisticated rules for updating metadata
