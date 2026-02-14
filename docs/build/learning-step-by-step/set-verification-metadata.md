---
title: "Set Verification Metadata"
---

# Set Verification Metadata

After getting our Gumball Machine dapp up and running on the Stokenet test network, there are still a few things that would stop it from working correctly on the main Radix network and in the Radix Wallet. This section will show you how to add metadata to your dapp definition, and link that to your on ledger component and front end, to get it working and displaying correctly on all versions of the network.

:::note
**The scrypto package referenced in this section can be found in our [official examples here](https://github.com/radixdlt/official-examples/tree/main/step-by-step/11-gumball-machine-dapp-verification-data**

.)
:::



## Two Way Linking

You may have noticed when using example dapps in previous sections, when your wallet receives a transaction it appears to come from “1 Unknown Components”. This is because the wallet cannot be sure it’s the correct definition for that dapp; that someone hasn’t created a fake dapp linking to a more credible definition. The way we solve this problem is two way linking.

Two way linking involves linking a dapp definition to a component, resources and web address, and linking the component, resources and web address back to the dapp. Linking in both directions proves the validity of the relationships. For components, this means the wallet will use the dapp definition’s `name`, `image_url`, and other metadata for identification, to show the user which dapp they’re interacting with. For resources it allows their associated dapp to be displayed, so you know which machine your gumball came from. We add these links in the metadata of the entities.

## Metadata for Verification

[The system of dapp, component and resource verification](../metadata/metadata-for-verification.md) involves a dapp definition and a collection of metadata fields for linking entities together.

Each component can have a `dapp_definition` stored in metadata and each resource can be linked to multiple `dapp_definitions`. The dapp definition account will need to have all of these components and resources stored in `claimed_entities` metadata to complete the links. The dapp definition can also link to other `dapp_definitions` and `claimed_websites`. In the last case, the website will need to have a `.well-known/radix.json` file with the dapp definition address in it to complete the link.

The full list, with data types for each, can be found in the [Metadata for verification](../metadata/metadata-for-verification.md#metadata-standards-for-verification-of-onledger-entities) section of the documentation.

Often, when components and resources are created, we won’t have a dapp definition yet. Fortunately [metadata can be updated by a component or resource owner by default](../metadata/entity-metadata.md#updating-and-locking-metadata), so all we need to do is give them an owner, then update the metadata when we have a dapp definition. Ownership is again a shortcut to the most used parts of the authorization system.

You can see this change when creating the Gumball resource for this section.

``` rust
  let bucket_of_gumballs: Bucket = ResourceBuilder::new_fungible(
    OwnerRole::Fixed(rule!(require(
      owner_badge.resource_address()
  ))))
```

By adding the `OwnerRole::Fixed` to the resource, we can update the metadata after initial creation as long as we posses the `owner_badge`.

## Running the Gumball Machine dApp with Verification Metadata

:::note
**To get the Gumball Machine set up with verification metadata and working in the browser for yourself go to [the official examples repo’s instructions](https://github.com/radixdlt/official-examples/tree/main/step-by-step/11-gumball-machine-dapp-verification-data#setting-up-the-gumball-machine-dapp**

and follow the steps.)
:::


