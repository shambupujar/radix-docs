---
title: "Consensus Manager"
---

# Consensus Manager

This document offers a description of the design and implementation of the Consensus Manager component: its state, public API, and its system-triggered, internal responsibilities.

:::note
**>
Low-level details below

**

If you are only looking for the Consensus Manager’s public interface, please skip directly to the [API reference](consensus-manager.md#api-reference).
:::


## Background

In Radix, the Consensus Manager native component is responsible for bridging the Ledger state with the world of distributed Consensus run by the Validator Nodes. This means:

- Storing the current leader Validator, Round number and wall-clock time reported by the Consensus algorithm.

- Triggering the Epoch changes.

- Tracking all registered Validators and picking the top-staked Active Validator Set to run the Consensus.

- Calculating and applying the Validator emissions/penalties according to their tracked performance statistics.

- Keeping the global settings of all the rules governing the Network’s behaviors mentioned above.

:::note
**>
Network-wide Singleton

**

The singleton Consensus Manager’s instance is created and started by the system during Genesis (i.e. it is not supposed to be instantiated by users). You can find its well-known address for each Network [here](../../reference/well-known-addresses.md).
:::


The Consensus Manager’s [internal responsibilities](consensus-manager.md#internal-responsibilities) (i.e. related to Consensus progress) are performed at the beginning of each Consensus Round, when a special system transaction calls the protected `ConsensusManager::next_round()` method.

Apart from that, the Consensus Manager exposes [public methods](consensus-manager.md#methods) for:

- Using the Consensus wall-clock.

- Creating a new Validator.

## On-ledger State

The `ConsensusManager` blueprint defines the following fields:

- `config`, holding the Network’s Consensus-related configuration, e.g.:

  - maximum number of Active Validators,

  - target round count and duration of an Epoch,

  - timeouts for unstaking / unlocking / fee changes,

  - amount of XRD emitted for Validators on each Epoch change,

  - cost of creating a Validator,

  - minimum reliability expected from a Validator (according to which the Network Emission penalties are applied).

- `state`, holding the Consensus’ progress:

  - current Epoch and Round,

  - timestamps of the current Epoch’s start:

    - the “effective start, used to maintain the Epoch’s target duration;

    - the “actual start”, used only to measure the potential drift of the Epoch’s start.

  - a reference to the current Leader (among the Active Validator Set).

- `validator_rewards` containing:

  - the actual XRD Vault holding all Network Fees and Tips collected during the current Epoch (to be distributed on the Epoch change),

  - accounting information tracking the Rewards assigned to individual Leaders for transactions they proposed (used to calculate the Rewards distribution from the Vault mentioned above).

- `current_validator_set`, which simply represents the Active Validator Set of the current Epoch, as a list of component addresses, public keys and stakes (captured at the Epoch’s start).

- `current_proposal_statistic`, which tracks a number of successful vs missed proposals of each Validator of the current Epoch (for the Rounds during which it was a Leader).

- `proposer_minute_timestamp` holding a minute-resolution counterpart of the `proposer_milli_timestamp`described below.

- `proposer_milli_timestamp` holding a millisecond-resolution Unix timestamp captured by the Leader at the moment of proposing the most recently committed Round. Note: the Engine’s logic ensures that this number is non-decreasing (even if there is a clock skew between consecutive Leaders).

And a single collection:

- `registered_validators_by_stake` - a sorted index of all currently registered Validators, by their stake (descending):

  - The sort key is calculated as a scaled down and inverted stake of a Validator. This is done so that this single 16-bit integer represents an approximate magnitude of a stake, with the highest stakes being first (in the natural ordering).

  - This structure ensures convenient and performant selection of next Active Validator Set.

## Internal responsibilities

The public-facing services provided by the Consensus Manager are quite modest (accessing the wall-clock and creating new validator components). However, apart from those, it has an important internal Consensus-related responsibility: on each Round, the Consensus Leader automatically triggers the `ConsensusManager`‘s protected `next_round()` method, which progresses the Consensus’ Rounds and Epochs.

### Round Change

The Leader of the Round starts it with a special transaction, which provides the details of the new Round (i.e. as inputs to the `next_round()` method being called).

This method then:

1.  Updates the wall-clock (i.e. the `proposer_milli_timestamp` and `proposer_minute_timestamp` substates) with the timestamp provided in the input.

    - The new timestamp is validated: it must be greater or equal to the previous one, or the transaction will fail.  

2.  Updates the proposal statistics of the current Epoch (i.e. the `current_proposal_statistic`).

    - In most cases, on a healthy network, this will simply increment a number of successful rounds of the current Leader.

    - However, it may happen that one or more Rounds were skipped before the one being started. In such case, the current Leader will provide the list of past Leaders which missed their Rounds (and their “miss counters” will be incremented accordingly).

    - The statistics are accumulated this way throughout the Epoch - they will be used for calculating potential Emission penalties of each Validator, at the end of the Epoch.  

3.  Updates the current Leader reference (within the `state` substate).  

4.  Determines whether the current Epoch should end (i.e. whether the currently started Round should in fact become the first round of a newly-started Epoch). This simply evaluates the Epoch change condition stored within the `config` substate:

    - If the started Round’s number is *strictly less than* the configured *minimum* Round count (<a href="https://github.com/radixdlt/babylon-node/blob/d2af01b8f27df69b7cfc07d784777a3490a8c640/core-rust-bridge/src/main/java/com/radixdlt/genesis/GenesisConsensusManagerConfig.java#L134">currently on mainnet:</a> `500`), the Epoch definitely continues.

    - If the started Round’s number is *greater or equal to* the configured *maximum* Round count (<a href="https://github.com/radixdlt/babylon-node/blob/d2af01b8f27df69b7cfc07d784777a3490a8c640/core-rust-bridge/src/main/java/com/radixdlt/genesis/GenesisConsensusManagerConfig.java#L135">currently on mainnet:</a> `3000`), the Epoch definitely ends.

    - If the above hard-limitting special cases do not occur, then the Epoch ends as soon as it lasted for the configured *target* Epoch duration (<a href="https://github.com/radixdlt/babylon-node/blob/d2af01b8f27df69b7cfc07d784777a3490a8c640/core-rust-bridge/src/main/java/com/radixdlt/genesis/GenesisConsensusManagerConfig.java#L131">currently on mainnet:</a> `5 minutes`).  

5.  Applies the actual Round/Epoch change:

    - If the Epoch is not supposed to end, then simply a new Round’s number is updated (within the `state` substate), and a `RoundChangeEvent` is emitted.

    - Otherwise, an **Epoch Change** is applied, as detailed in the section below.

### Epoch Change

When the **Round Change** logic (i.e. point **4.** described above) determines the end of the current Epoch, the Consensus Manager:

1.  Calculates and distributes the Network Emissions to Validators belonging to the ended Epoch’s Active Validator Set:

    - First, for each Validator, we calculate its “reliability factor”. This is simply rescaling its absolute successful proposal ratio (recorded within `current_proposal_statistic`) into a value relative to the minimum required reliability (set in the `config`).

      > **>
      > Example
      >
      > **
      >
      > Let’s assume a Validator had `7` successful and `3` missed Rounds.
      >
      > Then, its absolute reliability is `0.7`.
      >
      > If the minimum required reliability is configured as `0.6`, then the rescaling `(0.7 - 0.6) / (1.0 - 0.6)`gives us the *reliability* *factor* of `0.25`.

      > **>
      > Mainnet configuration note
      >
      > **
      >
      > <a href="https://github.com/radixdlt/babylon-node/blob/d2af01b8f27df69b7cfc07d784777a3490a8c640/core-rust-bridge/src/main/java/com/radixdlt/genesis/GenesisConsensusManagerConfig.java#L146">Currently on mainnet</a>, the minimum required reliability is set to `1.0`. This means that effectively, the reliability factor of any Validator may either be `1.0` (if it did *not* miss *any* Round during an Epoch) or `0.0` (if it missed even one).

    - Then, a configured amount of XRD is minted for Network Emissions purposes (<a href="https://github.com/radixdlt/babylon-node/blob/d2af01b8f27df69b7cfc07d784777a3490a8c640/core-rust-bridge/src/main/java/com/radixdlt/genesis/GenesisConsensusManagerConfig.java#L140">currently on mainnet:</a> `~2853.9` per Epoch, which is approximately `300M XRD` per year).

    - Each Validator is assigned a fraction of the above Emission, proportional to its stake (compared to the total stake of the entire Active Validator Set).

      - However, the actually received amount is multiplied by the Validator’s reliability factor. This means that some of the Emission may not be distributed at all.

        > **>
        > Example
        >
        > **
        >
        > Let’s assume a Validator with a `200 XRD` stake, and an Active Validator Set with a total stake of `1000 XRD`.
        >
        > For simplicity, let’s say that `100 XRD` is minted for Network Emissions each Epoch.
        >
        > In theory, our Validator is entitled to 20% of this Emission (i.e. `20 XRD`).
        >
        > However, if the Validator missed some of its Rounds, and has reliability factor of `0.25`, then it will actually receive only `4 XRD`. The remaining `16 XRD` will not be distributed (neither to this Validator, nor to any other from the Active Validator Set).

      - As an implementation detail, the “not distributed” part of the Emission is *not* explicitly burned, but simply calculated upfront (i.e. appropriately lower Emission is actually minted).  

2.  Distributes Proposer Rewards to the ended Epoch’s Active Validator Set:

    - These Rewards are already calculated (on a per-Validator basis) and stored directly in the `validator_rewards` substate.

    - For context: they contain 100% of the voluntary Tips and 25% of the Network Fees charged for executing the transactions proposed by particular Validator.

    - Unlike Emissions, they are received in full, regardless of the Validator’s reliability.  

3.  Calculates and distributes the remaining shared Rewards to the ended Epoch’s Active Validator Set:

    - This is supposed to distribute the amount remaining in the `validator_rewards`Vault proportionally among all Active Validators.

    - For context: it comes from 25% of the Network Fees charged for executing all transactions during the ended Epoch. As a side note, one can correctly observe that 50% of those Fees are burned during the transaction execution itself.

    - These rewards are divided according to each Validator’s *effective* stake: i.e. its stake multiplied by the reliability factor (the same one as used for Network Emissions distribution).

      > **>
      > Example
      >
      > **
      >
      > Let’s assume that the Vault within `validator_rewards`substate contained `100 XRD`, and after distributing `10 XRD` as Proposer Rewards (according to point **2.** above), `90 XRD` is left for Active Validator Set’s Rewards.
      >
      > Let’s say that the Active Validator Set consists of only 2 Validators: `A` with stake `4000 XRD` and reliability factor `1.0` and `B` with stake `1000 XRD` and reliability factor `0.5`.
      >
      > Then, the effective stake of `A` is `4000 XRD`, and the effective stake of `B` is `500 XRD`.
      >
      > This means that `A` will receive `80 XRD` , while `B`will receive `10 XRD`.

    - Any leftovers remaining in the Rewards’ Vault (due to rounding down during calculations) will simply be retrievable on the next Epoch. This will normally be negligibly small amounts.  

4.  Selects the new Active Validator Set (for the newly-started Epoch):

    - This simply requires listing the configured number of top-stake Validators (<a href="https://github.com/radixdlt/babylon-node/blob/d2af01b8f27df69b7cfc07d784777a3490a8c640/core-rust-bridge/src/main/java/com/radixdlt/genesis/GenesisConsensusManagerConfig.java#L153">currently on mainnet:</a> `100`) from the `registered_validators_by_stake` collection.

    - The selected Validators are stored in the `current_validator_set`, together with their stake captured at this moment.

    - Naturally, the `current_proposal_statistic` and the per-Validator counters within the `validator_rewards` are cleared (i.e. all Validators start the Epoch with a clean slate).  

5.  Emits the `EpochChangeEvent`:

    - It contains the started Epoch’s number and the new Active Validator Set.

    - Additionally, it contains a summarized information about the Protocol Versions for which the new Active Validators signalled their readiness.  

6.  Updates its `state` substate:

    - The Epoch number is incremented (always by exactly 1; Epochs cannot be skipped, unlike Rounds).

    - The Round number is set to 0.

    - The “actual” Epoch start timestamp is set to the Proposer’s timestamp.

    - The “effective” Epoch start timestamp is calculated, in a way designed to mitigate a small systematic drift caused by network latencies:

      - If the ended Epoch’s actual duration is within 10% tolerance from the configured target Epoch duration, then `next.effective_start = previous.effective_start + config.target_duration` (i.e. as if that Epoch had precisely the target duration).

      - Otherwise, the effective start timestamp is set to the Proposer’s timestamp (i.e. the same as actual Epoch start timestamp).

## API Reference

### Methods

This section focuses only on publicly-available methods. The internal ones (i.e. `create`, `start`, `next_round`) use very restrictive access rules (or even completely custom ones), and are automatically called only by the system itself.

#### `get_current_epoch`

Gets the current Epoch number.

This is a simple read-out from the `state` field.

|  |  |
|:---|:---|
| **Name** | `get_current_epoch` |
| **Type** | Method |
| **Callable By** | Public |
| **Arguments** | None |
| **Returns** | `Epoch`: A type-safe wrapper containing the current Epoch’s number. |

#### `get_current_time`

Gets the current Proposer timestamp (i.e. not the one committed to ledger, but the one with which it is actually being proposed), with the requested precision.

<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code dir="">get_current_time</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable By</strong></td>
<td>Public</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><code dir="">precision</code> - <code dir="">TimePrecision</code>: The required precision enum.</td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><code dir="">Instant</code>: A type-safe wrapper containing the number of seconds since Unix epoch.<br />
Please note that even though it is expressed as seconds, its actual precision is driven by the argument.</td>
</tr>
</tbody>


#### `compare_current_time`

Checks whether the given condition on the current Proposer timestamp is met.

<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code dir="">compare_current_time</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable By</strong></td>
<td>Public</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><code dir="">instant</code> - <code dir="">Instant</code>: The reference timestamp to compare against.<br />
<code dir="">precision</code> - <code dir="">TimePrecision</code>: The comparison precision.<br />
The reference timestamp will be truncated accordingly.<br />
The proposer timestamp will be read out as in <code dir="">get_current_time</code>.<br />
<code dir="">operator</code> - <code dir="">TimeComparisonOperator</code>: The operator to apply.<br />
The exact condition can be expressed as:<br />
<code dir="">get_current_time(precision) &lt;operator&gt; instant.truncated_to(precision)</code></td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><code dir="">bool</code>: True if the current Proposer timestamp meets the given condition.</td>
</tr>
</tbody>


#### `create_validator`

Creates a new Validator component, allowing the caller to configure a Validator Node and potentially participate in the Consensus.

<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Name</strong></td>
<td><code dir="">stake</code></td>
</tr>
<tr>
<td><strong>Type</strong></td>
<td>Method</td>
</tr>
<tr>
<td><strong>Callable By</strong></td>
<td>Public</td>
</tr>
<tr>
<td><strong>Arguments</strong></td>
<td><code dir="">key</code> - <code dir="">Secp256k1PublicKey</code>: The Public Key identifying the Validator.<br />
<code dir="">fee_factor</code> - <code dir="">Decimal</code>: An initial “Validator’s fee fraction” configuration.<br />
Please consult [the relevant Validator’s documentation](validator.md#updatefee).<br />
<code dir="">xrd_payment</code> - <code dir="">Bucket</code>: A bucket containing the required XRD amount.<br />
The cost is specified in the Consensus Manager’s <code dir="">config</code> substate.</td>
</tr>
<tr>
<td><strong>Returns</strong></td>
<td><p><code dir="">(ComponentAddress, Bucket, Bucket)</code>: A tuple with:</p>
<ul>
<li><p>The address of the created Validator.</p></li>
<li><p>A bucket containing the newly-created Owner Badge.</p></li>
<li><p>A bucket with any remaining contents of <code dir="">xrd_payment</code>.</p></li>
</ul></td>
</tr>
</tbody>


### Events

The Consensus Manager only emits the following progress-related events:

#### `RoundChangeEvent`

``` rust
{
  // The new Round.
  round: Round
}
```

Emitted when the Round has changed - with an important exception of an Epoch change (i.e. this event is *not* emitted when the Round changes to `Round::zero()` on the beginning of an Epoch).

#### `EpochChangeEvent`

``` rust
{
  // The new Epoch.
  epoch: Epoch,

  // The new Epoch's Validator Set.
  validator_set: ActiveValidatorSet,

  // A mapping of protocol version name to a total stake (within the new Epoch's
  // Validator Set) that has signalled the readiness for the given protocol update.
  // The mapping only contains entries with associated stake of at least 10% of the
  // total stake.
  significant_protocol_update_readiness: IndexMap<String, Decimal>
}
```

Emitted when the Epoch has changed.
