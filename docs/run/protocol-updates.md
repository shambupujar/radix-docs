---
title: "Protocol Updates"
---

# Protocol Updates

<!--
    NOTE: Some of this should move to the Technical Model section, and the rest should be moved to the Node section when we publish the node section.
-->

## Introduction

For the Radix network to commit transactions, it must come to an agreement on the outcome of those transactions. This requires all the nodes constituting the network to be operating according to the same set of rules. These rules are known as the **protocol** of the network.

As Radix is further developed, the protocol will be expanded and amended, resulting in the publishing of new nodes, which can support a new **protocol version**. But if the nodes transitioned to using this new protocol version as soon as they were updated, the network would break because the network wouldn’t all be using the same set of rules.

Instead, the network needs to co-ordinate, and ensure that nodes pick up the same version at the same time. There are known as **triggers** of the protocol update. The node currently supporst two mechanisms to achieve this: \* **Unconditional** enactment at the start of a given epoch: \* This is useful for genesis, test environments, and for hard-coding upgrades after-the-fact. \* Nodes must have been updated by the time this epoch is hit, otherwise the network will suffer incompatibility / liveness issues. \* **Validator readiness-signal based** enactment at the start of an epoch: \* This is the standard option for mainnet protocol updates. \* Validator owners must signal readiness for the update by making a call to their validator component with the readiness signal for the given update. \* Each validator has a space for one optional readiness signal at any time. \* The readiness signal is **not** just the protocol name, but instead a unique string derived from the protocol version and its specific trigger condition. \* There are a combination of constraints that must be valid to enact the update: \* A `lower_bound_epoch_inclusive` - We must be at the start of this epoch or a future epoch to enact the update. \* A `upper_bound_epoch_exclusive` - The update is no longer enactable at the start of this epoch. \* One of more `readiness_thresholds`. Each of these includes a `required_ratio_of_stake_supported` (between 0 and 1) and a `required_consecutive_completed_epochs_of_support` (0 or more). At least one readiness threshold must be met at the start of an epoch to enact the update. A threshold is met if validators representing at least `required_ratio_of_stake_supported` of the total active validator set’s stake are currently signalling for the required readiness signal, AND have also been doing so for all of the last `required_consecutive_completed_epochs_of_support` *additional* epochs.

## Protocol Versions

The original *protocol version* was called `babylon`, and introduced with the `v1.0.0` node and immediately enacted. On top of it, consecutive *protocol updates* are being released and enacted after gathering enough voting power (i.e. share of total stake). Validators have to individually signal readiness for a particular protocol version, and maintain it for some number of consecutive epochs. To limit the voting time, the enactment itself must happen within a defined epoch range.

The table below summarizes the protocol updates <a href="https://github.com/radixdlt/babylon-node/blob/main/core-rust/state-manager/src/protocol/protocol_configs/mainnet_protocol_config.rs" target="`_blank`">configured</a> **for mainnet** so far:

| Version | Readiness signal name | Enactment epoch range | Voting requirement |
|----|----|----|----|
| **Anemone**<br><br>*(Node v1.1.0)* | `220e2a4a4e86e3e6000000000anemone` | `[70019; 74051)`<br><br>*(from ~`2024-02-05T18:00:00Z` to `2024-02-19T18:00:00Z`)* | 75% stake<br>for ~4 days |
| **Bottlenose**<br><br>*(Node v1.2.0)* | `86894b9104afb73a000000bottlenose` | `[104291; 112355)`<br><br>*(from ~`2024-06-03T18:00:00Z` to `2024-07-01T18:00:00Z`)* | 75% stake<br>for ~2 weeks |
| **Cuttlefish**<br><br>*(Node v1.3.0)* | `96e00440adafe5e2000000cuttlefish` | `[158682; 161562)`<br><br>*(from ~`2024-12-10T16:03:58.703Z` to `2024-12-20T16:03:58.703Z`)* | 75% stake<br>for ~2 weeks |

Other internal and public test networks have their separate configurations. The one **for stokenet** can be found [here](https://github.com/radixdlt/babylon-node/blob/main/core-rust/state-manager/src/protocol/protocol_configs/stokenet_protocol_config.rs).

The most definite protocol update status of a specific Node can be queried from its System Health API endpoint (by default: `http://localhost:3334/system/health`). It will contain a list of enacted and pending protocol updates (including their `readiness_signal_name`s).

## Protocol Update Execution

Each new protocol version will come with a potentially new engine configuration, and can also inject new transactions - currently these are limited to system “flash” transactions which update engine substates.

The final consensus proof before an update signs off on the fact a protocol update will be enacted, this ensures that the previous epoch doesn’t end unless a quorum of validators definitely agree that the enactment should proceed.

The update execution then commits zero or more batches of transactions - these come with new ledger proofs with a protocol update execution origin.

## Readiness Signal Process

Validators who wish to signal their readiness should follow the instructions below.

### Update your validator node

Update your node to the latest version, which includes the pending protocol update.

Once you do so, verify that your node has been succesfully updated: - If you’re using the `babylonnode` CLI: `babylonnode api system version` - Otherwise, you can use `curl`, e.g.: `curl http://127.0.0.1:3334/system/version`

Then check the System Health API for the required readiness signal: - If you’re using the `babylonnode` CLI: `babylonnode api system health` - Otherwise, you can use `curl`, e.g.: `curl http://127.0.0.1:3334/system/health` (if on docker, this will need to be inside the container, or on the port you have mapped to 3334).

You’ll find `readiness_signal_status` in the response for the given protocol version, which should be `READINESS_NOT_SIGNALLED`. It will also include a `readiness_signal_name`, if the protocol version has a validator readiness trigger. It should be a string 32 characters long. For example, for anemone on mainnet it is `220e2a4a4e86e3e6000000000anemone` - but it will be different for other protocol versions. Don’t just copy it from here, verify against your system API first!

### Signal readiness

This is done by submitting a transaction, authorized with your validator owner badge, similar to [validator registration](https://docs-babylon.radixdlt.com/main/node-and-gateway/register-as-validator.html), or performing other validator actions (see e.g. [this discussion on radix talk](https://radixtalk.com/t/validator-transaction-manifests/1886)).

If you are using a tool to manage your validator (such as Faraz’s CLI tool), consult the tool owner / documentation.

If you are using a validator badge owner by an account under a Radix wallet, you can use the [dev console to submit the transaction manifest](https://console.radixdlt.com/transaction-manifest). You must use a wallet that controls the account containing your validator owner badge to sign the transaction! If you’ve forgotten where it lives, see the “Owner” by clicking on your validator [on the staking dashboard](https://dashboard.radixdlt.com/network-staking). You can also find your owner badge id and validator address there too.

Submit the following manifest, replacing the four placeholders with their appropriate values:

    CALL_METHOD
        Address("<ACCOUNT ADDRESS WITH VALIDATOR BADGE>")
        "create_proof_of_non_fungibles"
        Address("resource_rdx1nfxxxxxxxxxxvdrwnrxxxxxxxxx004365253834xxxxxxxxxvdrwnr")
        Array<NonFungibleLocalId>(
            NonFungibleLocalId("<BADGE ID STARTING AND ENDING WITH []>")
        );

    CALL_METHOD
        Address("<VALIDATOR ADDRESS>")
        "signal_protocol_update_readiness"
        "<READINESS_SIGNAL_NAME>";

### Verify successful signalling

After your transaction is successfully committed, re-check the System Health API: - If you’re using the `babylonnode` CLI: `babylonnode api system health` - Otherwise, you can use `curl`, e.g.: `curl http://127.0.0.1:3334/system/health`

The `readiness_signal_status` should update to `READINESS_SIGNALLED`.

## Monitoring validator readiness signals

For a quick overview of the validator set’s readiness signals, you can check out community validator dashboards such as [Bart’s StakeSafe dashboard](https://validators.stakesafe.net/).

If you want to monitor this yourself:

- The current readiness signal for any validator individually is available from the `core/state/validator` endpoint. At any given time, a validator can signal readiness for a single protocol version readiness signal.
- The current readiness signal of all the validators in the active set can be extracted from `core/state/consensus-manager` with an opt-in in the request, grouped by the signal. This is the easiest way to see “how close” the network is to a threshold.
- The node exposes various metrics in the `ng_protocol` sub-namespace, for various protocol update related needs
- Finally, for monitoring when something got enacted, the `/stream/proofs` API can be used to filter for state update initialization and execution proofs. It can also be used to read ledger headers (our equivalent of block headers).
