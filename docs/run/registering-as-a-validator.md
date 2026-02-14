---
title: "Creation of a validator entity will cost a certain amount of XRD (equating to ~100USD)"
---

## Introduction

Make sure you’ve read the [Node Introduction](overview.md) and have a good understanding of what a validator node is before you decide to register.

:::note
On Babylon, a "Validator" exists on the ledger independently from its currently configured public key (and associated node). This means that you can change the public key associated with your validator! You will manage your "Validator Component" using an "Owner Badge", which can be stored/protected in an account.

This guide will take you through setting up an account in your wallet for this purpose.

In practice, you may wish to use a "shared ownership" account, which is configured to allow access upon presenting badges, which you can hand out to your validator co-owners.
:::


Validator nodes provide the critical infrastructure of the Radix network and owners of active validators receive tips and a share of the transaction fees to offset this cost. However attempting to become one of the network’s 100 validator nodes is not a decision to be taken lightly, requiring commitment to high reliability operation and engagement with the Radix community. Registration as a validator node alone does not guarantee participation in consensus or that you will receive incentive rewards.

A validator node is a node that has configured to act on behalf of an validator component which has been created on the Radix ledger.

The validator component can be configured to receive delegated stake and potentially be selected to participate in network consensus. It is also configured with a single public key.

At the start of each epoch, the validator components which are currently registered are ordered by stake descending, and the top 100 are selected to form the validator set for the next epoch. A snapshot of each of their validator adddress, current stake and public key is taken, and this forms the active validator set for this epoch.

In the consensus layer, a node can represent the validator if it is configured with its validator address, and is using a key pair matching the key pair set in the validator component at the start of the last epoch.

<a href="https://learn.radixdlt.com/categories/staking-on-radix?_gl=1*lyznnq*_ga*ODM5MDk4MjgxLjE2OTU4Nzg2Njg.*_ga_MZBXX3HP5Q*MTY5ODQxNjQyOC4xOC4xLjE2OTg0MTY5NzQuNy4wLjA." target="_blank">Click here for general information about staking and validator participation.</a>

## Prerequisites

- You should have completed setting up your node, and have it running. Follow our [Node Setup Guide](node-setup/index.md) if you haven’t done so yet.

- You should have set up a <a href="https://www.radixdlt.com/wallet" target="_blank">Babylon Radix Wallet</a>.

### 1. Get your wallet connected and an account set up with XRD

- Go to the Dashboard \[<a href="https://stokenet-dashboard.radixdlt.com/">Stokenet</a> \| <a href="https://dashboard.radixdlt.com/" target="_blank">Mainnet</a>\], and connect your wallet using the connect button.

- Ensure that you have some XRD for the transaction fees in your wallet (on Stokenet you can claim some through the wallet, see the <a href="https://wallet.radixdlt.com/" target="_blank">Babylon Radix Wallet</a> set-up guide)

- Click on the Connect button, and make a note of the referenced account address. This will be your `<ACCOUNT_ADDRESS>` in the following steps.

### 2. Gather your node public key

Query your node’s System API to retrieve the public key that’s associated with it (in a hex format).



Using `babylonnode` CLI (Guided Setup Mode)



``` bash
babylonnode api system identity
```







Using `curl` (Manual Setup Mode)



``` bash
curl http://localhost:3334/system/identity
```





You will receive a response like this:

``` bash
{
  "public_key_hex": "...",
  "node_address": "...",
  "node_uri": "...",
  "node_name": "...",
  "node_id": "...",
  "validator_name": "...",
  "consensus_status": "NOT_CONFIGURED_AS_VALIDATOR"
}
```

Take a note of the `public_key_hex`. This will be your `<NODE_PUBLIC_KEY_HEX>` in the following steps.

### 3. Create your validator component

Go to “Send Raw Transaction” on the console \[<a href="https://stokenet-console.radixdlt.com/transaction-manifest" target="_blank">Stokenet</a> \| <a href="https://console.radixdlt.com/transaction-manifest" target="_blank">Mainnet</a>\].

The following transaction will create your validator entity, which also creates a validator owner badge, which gets deposited to your account. Keep this validator badge safe! This validator badge will be used for controlling your validator.

The created validator badge will be a non-fungible, under the native "Validator Owner badge" resource, with a local id being the bytes of your validator address.

Copy in the following manifest, replacing the placeholders `<ACCOUNT_ADDRESS>` and `<NODE_PUBLIC_KEY_HEX>` with their values from the previous steps:



Stokenet (Testnet)



``` bash
# Creation of a validator entity will cost a certain amount of XRD (equating to ~100USD)
# So first, we withdraw enough XRD from our account to cover the fee, and then store it in a bucket.
CALL_METHOD
    Address("<ACCOUNT_ADDRESS>")
    "withdraw"
    Address("resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc")
    Decimal("2000");
TAKE_FROM_WORKTOP
    Address("resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc")
    Decimal("2000")
    Bucket("validator_creation_fee");
# We then create the validator.
# This will return us an owner badge, and any excess change after paying for the fee.
CREATE_VALIDATOR
    Bytes("<NODE_PUBLIC_KEY_HEX>")
    # The following argument is the "Fee factor" - a decimal between 0 and 1
    #  which describes the proportion of the emissions that the owner will take.
    #  Unlike Olympia, this is expressed as a decimal proportion, not as basis points.
    Decimal("0")
    Bucket("validator_creation_fee");
# And finally, we deposit the owner badge and any change from the validator creation
# back into our account
CALL_METHOD
    Address("<ACCOUNT_ADDRESS>")
    "try_deposit_batch_or_abort"
    Expression("ENTIRE_WORKTOP")
    None;
```







Mainnet



``` bash
# Creation of a validator entity will cost a certain amount of XRD (equating to ~100USD)
# So first, we withdraw enough XRD from our account to cover the fee, and then store it in a bucket.
CALL_METHOD
    Address("<ACCOUNT_ADDRESS>")
    "withdraw"
    Address("resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd")
    Decimal("2000");
TAKE_FROM_WORKTOP
    Address("resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd")
    Decimal("2000")
    Bucket("validator_creation_fee");
# We then create the validator.
# This will return us an owner badge, and any excess change after paying for the fee.
CREATE_VALIDATOR
    Bytes("<NODE_PUBLIC_KEY_HEX>")
    # The following argument is the "Fee factor" - a decimal between 0 and 1
    #  which describes the proportion of the emissions that the owner will take.
    #  Unlike Olympia, this is expressed as a decimal proportion, not as basis points.
    Decimal("0")
    Bucket("validator_creation_fee");
# And finally, we deposit the owner badge and any change from the validator creation
# back into our account
CALL_METHOD
    Address("<ACCOUNT_ADDRESS>")
    "try_deposit_batch_or_abort"
    Expression("ENTIRE_WORKTOP")
    None;
```





Submit this transaction, approve it in the wallet, and go to the results page in the dashboard (e.g. following the link from the Connect button).

For the next steps, you will need the following:

- Find your `<VALIDATOR_ADDRESS>` by taking a note of the validator address under "CREATED ENTITIES" in the transaction results page for the above transaction.

Then, go to the “Network staking” page of the dashboard \[<a href="https://stokenet-dashboard.radixdlt.com/network-staking">Stokenet</a> \| <a href="https://dashboard.radixdlt.com/network-staking">Mainnet</a>\] and locate your validator, and click on it:

- Find your `<VALIDATOR_STAKE_UNIT_RESOURCE_ADDRESS>` by copying the value in the `POOL_UNIT` metadata.

- Find your `<VALIDATOR_CLAIM_NFT_RESOURCE_ADDRESS>` by copying the value in the `CLAIM_NFT` metadata.

- Find your `<BADGE_LOCAL_ID>` by copying the value in the `OWNER_BADGE` metadata.

### 4. Reconfigure your node to identify as this validator

#### 4.1. If set-up using the `babylonnode` CLI

On the first run of the node configuration, a question for your validator address is being asked. On the first run you can not know the validator address.

After creating your validator component above, you can now reconfigure your node as below, and provide the `<VALIDATOR_ADDRESS>` when questioned.

``` bash
babylonnode docker config -m CORE
```

Alternatively you can also edit your config file usually located here `~/babylon-node-config/config.yaml` and add the “validator_address” line and replace the placeholder with your validator address.

``` bash
core_node:
  core_release: ...
  data_directory: /home/ubuntu/babylon-ledger
  .
  .
  validator_address: <VALIDATOR_ADDRESS>
```

Restart the node by executing:

``` bash
babylonnode docker install
```

Your node should start up as a validator now - which can be verified that the validator address appears when you do this:

``` bash
babylonnode api system identity
```

#### 4.2. If set-up with docker

Adjust your docker compose to set the following environment variable:

``` bash
RADIXDLT_CONSENSUS_VALIDATOR_ADDRESS: <VALIDATOR_ADDRESS>
```

Then restart. Your node should start up as a validator now - which can be verified that the validator address appears when you do this inside your container:

``` bash
curl http://localhost:3334/system/identity
```

#### 4.3. If set-up with native JAR

Configure with:

``` bash
consensus.validator_address=<VALIDATOR_ADDRESS>
```

Then restart. Your node should start up as a validator now - which can be verified that the validator address appears when you do this:

``` bash
curl http://localhost:3334/system/identity
```

### 5. Configure your validator

Go to “Send Raw Transaction” on the console \[<a href="https://stokenet-console.radixdlt.com/transaction-manifest" target="_blank">Stokenet</a> \| <a href="https://console.radixdlt.com/transaction-manifest" target="_blank">Mainnet</a>\].

Copy in the following manifest, replacing the `<ACCOUNT_ADDRESS>`, `<BADGE_LOCAL_ID>` and `<VALIDATOR_ADDRESS>` placeholders with their values from the previous steps, and inserting appropriate values for the `<METADATA_*>` values. For more details on the metadata standard, please see the [metadata standard docs](../build/metadata/metadata-for-wallet-display.md).



Stokenet (Testnet)



``` bash
# Generate proof of owner badge
CALL_METHOD
    Address("<ACCOUNT_ADDRESS>")
    "create_proof_of_non_fungibles"
    Address("resource_tdx_2_1nfxxxxxxxxxxvdrwnrxxxxxxxxx004365253834xxxxxxxxxyerzzk")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("<BADGE_LOCAL_ID>"),
    );
# Register your validator, so that it can be part of the validator set
CALL_METHOD
    Address("<VALIDATOR_ADDRESS>")
    "register";
# Set your validator to accept stake from non-owners
CALL_METHOD
    Address("<VALIDATOR_ADDRESS>")
    "update_accept_delegated_stake"
    true;

# OPTIONAL - Set metadata according to the metadata standard
# Feel free to remove any of these commands if you don't have things to put there
SET_METADATA
    Address("<VALIDATOR_ADDRESS>")
    "name"
    Enum<Metadata::String>("<METADATA_VALIDATOR_NAME>");
SET_METADATA
    Address("<VALIDATOR_ADDRESS>")
    "description"
    Enum<Metadata::String>("<METADATA_VALIDATOR_DESCRIPTION>");
SET_METADATA
    Address("<VALIDATOR_ADDRESS>")
    "icon_url"
    Enum<Metadata::Url>("<METADATA_VALIDATOR_ICON_URL>");
SET_METADATA
    Address("<VALIDATOR_ADDRESS>")
    "info_url"
    Enum<Metadata::Url>("<METADATA_VALIDATOR_INFO_URL>");
```







Mainnet



``` bash
# Generate proof of owner badge
CALL_METHOD
    Address("<ACCOUNT_ADDRESS>")
    "create_proof_of_non_fungibles"
    Address("resource_rdx1nfxxxxxxxxxxvdrwnrxxxxxxxxx004365253834xxxxxxxxxvdrwnr")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("<BADGE_LOCAL_ID>"),
    );
# Register your validator, so that it can be part of the validator set
CALL_METHOD
    Address("<VALIDATOR_ADDRESS>")
    "register";
# Set your validator to accept stake from non-owners
CALL_METHOD
    Address("<VALIDATOR_ADDRESS>")
    "update_accept_delegated_stake"
    true;

# OPTIONAL - Set metadata according to the metadata standard
# Feel free to remove any of these commands if you don't have things to put there
SET_METADATA
    Address("<VALIDATOR_ADDRESS>")
    "name"
    Enum<Metadata::String>("<METADATA_VALIDATOR_NAME>");
SET_METADATA
    Address("<VALIDATOR_ADDRESS>")
    "description"
    Enum<Metadata::String>("<METADATA_VALIDATOR_DESCRIPTION>");
SET_METADATA
    Address("<VALIDATOR_ADDRESS>")
    "icon_url"
    Enum<Metadata::Url>("<METADATA_VALIDATOR_ICON_URL>");
SET_METADATA
    Address("<VALIDATOR_ADDRESS>")
    "info_url"
    Enum<Metadata::Url>("<METADATA_VALIDATOR_INFO_URL>");
```





Submit this transaction, approve it in the wallet, and go to the results page in the dashboard.

Note: You can use the "update_key", "update_fee" and "update_accept_delegated_stake" to update the validator’s Secp256k1PublicKey, decimal fee factor proportion, and accept stake boolean respectively. Updating the fee factor takes effect after a number of epochs. This fee factor update delay will be 100 epochs (500 minutes) for testnets, but 2 weeks of epochs for mainnet. Further updates to the fee factor in that time will reset the time till update.

### 6. Stake a little to your validator

Go to “Send Raw Transaction” on the console \[<a href="https://stokenet-console.radixdlt.com/transaction-manifest" target="_blank">Stokenet</a> \| <a href="https://console.radixdlt.com/transaction-manifest" target="_blank">Mainnet</a>\].

Copy in the following manifest, replacing the placeholders with their values from the previous steps:



Stokenet (Testnet)



``` bash
# Withdraw 500 XRD from your account
CALL_METHOD
    Address("<ACCOUNT_ADDRESS>")
    "withdraw"
    Address("resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc")
    Decimal("500");
TAKE_FROM_WORKTOP
    Address("resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc")
    Decimal("500")
    Bucket("stake_xrd");
# Stake to your validator
CALL_METHOD
    Address("<VALIDATOR_ADDRESS>")
    "stake"
    Bucket("stake_xrd");
# Deposit your liquid stake token back to your account
CALL_METHOD
    Address("<ACCOUNT_ADDRESS>")
    "try_deposit_batch_or_abort"
    Expression("ENTIRE_WORKTOP")
    None;
```







Mainnet



``` bash
# Withdraw 500 XRD from your account
CALL_METHOD
    Address("<ACCOUNT_ADDRESS>")
    "withdraw"
    Address("resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd")
    Decimal("500");
TAKE_FROM_WORKTOP
    Address("resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd")
    Decimal("500")
    Bucket("stake_xrd");
# Stake to your validator
CALL_METHOD
    Address("<VALIDATOR_ADDRESS>")
    "stake"
    Bucket("stake_xrd");
# Deposit your liquid stake token back to your account
CALL_METHOD
    Address("<ACCOUNT_ADDRESS>")
    "try_deposit_batch_or_abort"
    Expression("ENTIRE_WORKTOP")
    None;
```





Submit this transaction, approve it in the wallet, and go to the results page in the dashboard.

Note - Instead of the "stake" method, there is also a "stake_as_owner" method which requires the owner badge, but can allow you to stake even if your validator does not currently accept delegated stake.

### 7. Lock some stake as owner stake

New at Babylon is the concept of "Owner Stake". This works a little differently compared to Olympia.

The "Owner Stake" concept has the same purpose - proving to the staking community that the validator runner is committed to running the validator in an orderly fashion, with the aim of giving confidence to community stakers that the node is reputable and worth staking to. But, because stake units can be traded, just holding stake units in your account isn’t enough to prove that you have such a commitment, and is hard to define.

Instead, Owner stake is validator stake units which are "locked" into the validator, in the owner stake vault. These can be requested to be unlocked, which immediately removes them from the owner stake vault, and instead, puts them in an unlocking vault. This process completes after a delay of a number of epochs, after which the owner stake units can be claimed. Multiple batches can be claimed in parallel, up to a limit (a few 100 parallel batches).

This unlock delay will be 100 epochs (500 minutes) for testnets, but 4 weeks of epochs for mainnet. It is purposefully longer than the unstake delay, to allow a large owner unlock to be caught by the community and to allow time for users to unstake.

Owner tips, fees and emissions at the end of epochs where your validator was active will automatically be staked, and sent to the owner stake vault.



Stokenet (Testnet)



``` bash
# Generate proof of owner badge
CALL_METHOD
    Address("<ACCOUNT_ADDRESS>")
    "create_proof_of_non_fungibles"
    Address("resource_tdx_2_1nfxxxxxxxxxxvdrwnrxxxxxxxxx004365253834xxxxxxxxxyerzzk")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("<BADGE_LOCAL_ID>"),
    );
# Withdraw 250 stake units from your account
CALL_METHOD
    Address("<ACCOUNT_ADDRESS>")
    "withdraw"
    Address("<VALIDATOR_STAKE_UNIT_RESOURCE_ADDRESS>")
    Decimal("250");
TAKE_FROM_WORKTOP
    Address("<VALIDATOR_STAKE_UNIT_RESOURCE_ADDRESS>")
    Decimal("250")
    Bucket("stake_units_to_lock");
# Lock owner stake to your validator
CALL_METHOD
    Address("<VALIDATOR_ADDRESS>")
    "lock_owner_stake_units"
    Bucket("stake_units_to_lock");
```







Mainnet



``` bash
# Generate proof of owner badge
CALL_METHOD
    Address("<ACCOUNT_ADDRESS>")
    "create_proof_of_non_fungibles"
    Address("resource_rdx1nfxxxxxxxxxxvdrwnrxxxxxxxxx004365253834xxxxxxxxxvdrwnr")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("<BADGE_LOCAL_ID>"),
    );
# Withdraw 250 stake units from your account
CALL_METHOD
    Address("<ACCOUNT_ADDRESS>")
    "withdraw"
    Address("<VALIDATOR_STAKE_UNIT_RESOURCE_ADDRESS>")
    Decimal("250");
TAKE_FROM_WORKTOP
    Address("<VALIDATOR_STAKE_UNIT_RESOURCE_ADDRESS>")
    Decimal("250")
    Bucket("stake_units_to_lock");
# Lock owner stake to your validator
CALL_METHOD
    Address("<VALIDATOR_ADDRESS>")
    "lock_owner_stake_units"
    Bucket("stake_units_to_lock");
```





You can start unlocking stake units with `"start_unlock_owner_stake_units" Decimal("<Amount>")` and claim stake units which have finished unlocking with `"finish_unlock_owner_stake_units"` and then depositing the returned stake units to your account.

### 8. Checking your validator is active

:::note
**>
This only applies if you’ve made it to the top 100 validators.

**
:::


Wait 5 minutes or so for the next epoch, then check the identity endpoint of your node again.

This time, it should include `"consensus_status": "VALIDATING_IN_CURRENT_EPOCH"`.

Also check out the validators page on the dashboard and see if you can spot your validator.

### 9. \[Stokenet only\] Request the RDX team stake to your validator

Post on the \#node-runners channel on the <a href="https://discord.com/invite/radixdlt" target="_blank">Radix Discord server</a>, and the Network Team will be able to stake a large chunk of XRD to your validator, so it can get a decent count of rounds in consensus.
