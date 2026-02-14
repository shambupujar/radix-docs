---
title: "Validator"
---

# Validator

This document offers a description of the design and implementation of the Validator blueprint. Additionally, this document provides an API reference which documents each of the Validator blueprint methods and functions in detail and how they can be used.

## Background

In Radix, a Validator is a Node with a delegated “stake” (i.e. some amount of locked XRD) on the Network. The top 100 registered Validators (i.e. of highest stake) form the Active Validator Set and are responsible for executing transactions through Consensus.

Each Validator is registered with the Consensus Manager. At the end of each epoch, based on various rules, the Consensus Manager chooses a new Active Validator Set of validators and stakes to run the next epoch.

The `Validator` blueprint defines the states associated with a Validator (covered by the **On-ledger State** section), and the logic for modifying them (covered by the **API Reference** section).

From the Execution POV, the Validator attains this stake from:

- Individual Users (including the Validator’s Owner): They can delegate their XRD using the `stake` method on a Validator Component (and receive Stake Units in return).

- Network Emissions: The Network emits a predefined amount of XRD at the end of each Epoch, and each Active Validator receives a part proportional to its stake.

- Rewards, coming from 2 sources:

  - Transaction execution Fees: Each executed Transaction requires paying an appropriate Fee, part of which goes to a current Leader Validator, and part is shared among all Active Validators.

  - Transaction Tips: A User submitting a Transaction may specify a percentage-based Tip, to be paid to the Leader Validator.

A Validator has a single role `Owner`:

- The Owner is given responsibilities of maintaining and setting parameters of a Validator (e.g. specifying a Public Key to be used for Consensus, or a Validator Fee percentage raked from Network Emissions to the Owner).

- The Owner can decide to temporarily lock some of their Stake Units in an Validator’s internal delayed-withdrawal Vault, as a public display of their confidence in their Validator Node’s future reliability.

## On-ledger State

The `Validator` blueprint defines 2 fields:

- The `state`, holding the actual configuration and sub-components used for managing the processes of Staking and Owner’s Stake Locking (see relevant sections below)

- The meta-level `protocol_update_readiness_signal`, holding only the protocol version to which the *Node* (currently represented by this Validator component) is ready to upgrade. The “protocol update” flow is still under development, and will be covered in a separate document.

The high-level pieces of `state` are:

- Consensus-related configuration:

  - `key` - a Public Key, identifying the corresponding Node in the Consensus layer. See `update_key`API method.

  - `is_registered` - whether the Owner currently wants this Validator to be a part of Active Validator Set - i.e. if this flag is `false`, then even a Validator with the highest stake among them all will not be considered by the Consensus Manager when choosing a new Active Validator Set for the next epoch. See `register/unregister` API methods.

  - `sorted_key` - A key used internally for storage of registered Validators sorted by their stake descending.

    - It is only useful when the Validator is registered **and** has non-zero stake (the field `None` otherwise).

    - Technically, this field is only a cache (its value could be computed from the Validator’s Stake Vault) and simplifies certain updates implementation-wise.

- Stake-related configuration and sub-components:

  - `accepts_delegated_stake` - whether Users other than Owner can currently delegate stake to this Validator. See `update_accepts_delegated_stake` API method.

  - `stake_unit_resource` - a Resource address of a fungible used as this Validator’s Stake Units.

  - `stake_xrd_vault_id` - the Validator’s Stake Vault, holding the XRDs currently staked to this Validator. Users interact with this Vault when calling `stake/unstake` API methods.

  - `pending_xrd_withdraw_vault_id` - the Pending Withdraw Vault, holding the XRDs that were unstaked, but not yet claimed by Users. In other words: the unstaked amount waits here during the unstake delay. See the details in the the **Staking/Unstaking/Claiming** section below.

  - `claim_nft` - a Resource address of non-fungible tokens used as a receipt for Stake Units unstaked from this Validator. Can be exchanged for the actual XRDs after the unstake delay (see the `claim_xrd` API method). The **Unstake NFT** section describes the token’s internal data.

- Fee-related configuration:

  - `validator_fee_factor` - a fraction of this Validator’s Emissions which gets raked by the Validator's Owner.

    - **Important note:** it may happen that the value held by this field is no longer the actual fee factor; it is implicitly overridden by the latest Validator Fee Change Request after the change becomes effective - see the `validator_fee_change_request` description below.

    - The fee is raked by immediately staking the indicated fraction of the Emissions and locking the resulting Stake Units in the Owner Locked Stake Vault (see the details in the **Locking Stake Units by the Owner** section).

    - This value is expressed as a decimal factor, not a percentage (i.e. `0.015` means "1.5%" here)

  - `validator_fee_change_request` - the most recent request to change the `validator_fee_factor` (if any).

    - As noted in the `update_fee` API method, the change becomes effective after a delay (i.e. requires **2 weeks wait** in case of fee increase).

    - The value from this field is moved to the `validator_fee_factor` only when the next change is requested while this one became effective. For this reason, the requested-and-already-effective fee will be used by the Engine instead of the outdated `validator_fee_factor` (this only re-iterates the **Important note** seen above).

- Owner Locked Stake management:

  - `locked_owner_stake_unit_vault_id` - the Owner Locked Stake Vault, holding the Stake Units that this Validator's Owner voluntarily decided to temporarily lock, as a public display of their confidence in the associated Node’s future reliability (see the entire **Locking Stake Units by the Owner** section). This vault is private to the Owner (i.e. the Owner's badge is required for any interaction via `lock_owner_stake_units/start_unlock_owner_stake_units`).

  - `pending_owner_stake_unit_unlock_vault_id` - the Owner Pending Unlock Vault, holding the Stake Units which the Owner has decided to withdraw from the Owner Locked Stake Vault, but which have not yet been unlocked after the mandatory **4 weeks wait**. This vault is private to the Owner (i.e. the Owner's badge is required for any interaction via `finish_unlock_owner_stake_units`).

  - `pending_owner_stake_unit_withdrawals` - An inline collection of all currently pending Owner Stake Units “unlocking” operations.

    - Schema-wise, this is an ordered map from an epoch number to an amount of stake units that become unlocked at that epoch.

    - Because of performance considerations, a maximum size of this map is limited to 100: a consecutive `start_unlock_owner_stake_units` call will first attempt to move any already-available amount to the `already_unlocked_owner_stake_unit_amount` field, and only then will fail if the limit is exceeded.

  - `already_unlocked_owner_stake_unit_amount` - An amount of Owner's Stake Units that has already waited for a sufficient number of epochs in the `pending_owner_stake_unit_withdrawals` and was then automatically moved from there.

    - The very next `finish_unlock_owner_stake_units` call will release this amount (plus any additional already-unlocked entries from `pending_owner_stake_unit_withdrawals`).

    - Technically, this field is only a cache (its value could be computed from `pending_owner_stake_unit_withdrawals` if it had no size limit).

## Staking/Unstaking/Claiming

All Users may participate in the Emissions and Rewards earned by Validators by delegating their own stake to one or more Validators.

This is achieved by calling the `stake` method of a Validator with an XRD bucket. In exchange for this XRD, User receives back some amount of fungible resource called Stake Units (specific to that Validator). They represent the fractional “ownership” the User can claim of the pool of XRD held in that Validator’s Stake Vault.

After Emissions and Rewards are accrued through many Epochs, the User may then claim their proportion of the Stake Vault by calling the `unstake` method (and passing the Stake Units they received earlier). They will then receive an Unstake NFT which represents an amount of XRD claimable from the Validator’s Pending Withdraw Vault after a certain number of Epochs, roughly equivalent to **1 week wait**.

Once the target Epoch is reached, the Unstake NFT can be exchanged for actual XRD using the Validator’s `claim_xrd` method.

The following is a sequence diagram describing this process:





<img
src="https://cdn.document360.io/50e78792-5410-4ac9-aa43-4612b4d33953/Images/Documentation/image(5).png" type="figure" width="956"
height="1740" />


Staking, Unstaking and Claiming






*Note: This diagram avoids the complexity related to “automatic staking and locking” of the Owner’s share of Emissions and Rewards. These details do not affect the general mechanism of staking.*

### Unstake NFT

The Unstake NFT which is returned to the User upon unstaking has the following data:

``` rust
pub struct UnstakeData {
  // Always "Stake Claim".
  pub name: String,
  
  /// An epoch number at (or after) which the pending unstaked XRD may be claimed.
  pub claim_epoch: Epoch,
  
  /// An XRD amount to be claimed.
  pub claim_amount: Decimal,
}
```

## Locking Stake Units by the Owner

The “Stake Units locking” is the Validator Owner’s way of publicly displaying “their own skin in the game”.

The Owner, after staking to their Validator, may at any time decide to lock their Stake Units inside the Validator’s internal Owner Locked Stake Vault. This temporary lock only adds constraints to the Owner, but is intended to serve as a signal to potential stakers, saying “I am trustworthy as a Validator, since I am economically committed to the validator running in an orderly fashion”. In future, these locked stake units may be at risk for slashing if the validator purposefully subverts the expectations of the consensus protocol.

:::note
Why does it only work when the Owner’s Stake Units are locked in a dedicated, delayed-withdrawal Vault?



We wish to have a signal that the Owner is committed to their Validator’s orderly behaviour. Economically speaking, this relates to their stake units not losing value.

If a Validator owner were aware that their Validator might go offline / commit some form of attack which could result in their Stake Units being worth less; then they could attempt to sell or unstake these Stake Units in a week shortly before this happens. Therefore, simply holding Stake Units in their Account does not prove any ongoing commitment.

Instead, we require that Owner’s stake is locked to the Validator. Currently there is a **4 week withdrawal delay**, which is purposefully longer than the 1 week unstake delay. This gives time for Users to unstake if they see that a Validator Owner has started unlocking a large proportion of Owner Locked Stake.
:::


The Stake Units locked in the Owner Stake Vault are a bit trickier to unlock: the operation is started by moving the Stake Units from the Owner Locked Stake Vault to the Owner Pending Unlock Vault. The Validator Component internally tracks all such pending withdrawal requests, and only allows actual withdrawal of Stake Units from the Owner Pending Unlock Vault after a preconfigured number of Epochs (roughly equivalent to **4 weeks wait**).

The following is a sequence diagram describing the entire process:





<img
src="https://cdn.document360.io/50e78792-5410-4ac9-aa43-4612b4d33953/Images/Documentation/image(7).png" type="figure" width="956"
height="1229" />


Locking and Unlocking Owner Stake Units






*Note: This diagram purposefully does not show any staking/unstaking. These are separate processes: the Owner still needs to stake to his Validator (the usual way) if he wants to obtain Stake Units to lock - and similarly, after finishing the lengthy unlocking, the Owner still needs to go through the regular unstaking process in order to obtain XRD.*

:::note
**>
Why is there no “Owner Locked Stake NFT” involved in this process?

**

All the relevant Validator methods (i.e. `lock_owner_stake_units`, `start_unlock_owner_stake_units`, `finish_unlock_owner_stake_units`) are only accessible to the Validator’s Owner. The locked amount and pending withdrawals are all tracked internally in the Validator’s Component state - see the **On-ledger State** section for details.
:::


Additionally, the Owner Stake Vault serves as a destination for the following Validator Owner’s earnings:

- Validator Fee (a configured percentage raked from the Emissions),

- Rewards (both from Tips and from execution Fees).

Even though the above amounts are originally given as XRD, they are automatically staked (as if a regular `stake` method was called) and then the obtained Stake Units are locked in the Owner Stake Vault (as if a regular `lock_owner_stake_units` method was called).

## API Reference

### Methods

#### `stake`

Stakes an amount of XRD to the Validator in exchange for Stake Units.

This call will fail if the Validator is currently configured to NOT accept delegated stake.

|  |  |
|:---|:---|
| **Name** | `stake` |
| **Type** | Method |
| **Callable By** | Public |
| **Arguments** | `stake` - `Bucket`: An XRD bucket |
| **Returns** | `Bucket`: A bucket containing the Validator’s Stake Unit resource |

#### `stake_as_owner`

Stakes an amount of XRD to the Validator in exchange for Stake Units.

This call will succeed even if the Validator is currently configured to NOT accept delegated stake, but is only callable by the Owner.

|  |  |
|:---|:---|
| **Name** | `stake` |
| **Type** | Method |
| **Callable By** | `Owner` |
| **Arguments** | `stake` - `Bucket`: An XRD bucket |
| **Returns** | `Bucket`: A bucket containing the Validator’s Stake Unit resource |

#### `unstake`

Begins the process of unstaking XRD from a Validator. Removes a proportionate amount of XRD from the Stake Vault and returns an Unstake NFT.

|  |  |
|:---|:---|
| **Name** | `unstake` |
| **Type** | Method |
| **Callable By** | Public |
| **Arguments** | `stake` - `Bucket`: A bucket of the Validator’s Stake Units |
| **Returns** | `Bucket`: A bucket containing an Unstake NFT |

#### `claim_xrd`

Claims the XRD associated with the given Unstake NFT(s).

This call will fail if any Unstake NFT’s `claim_epoch` has not been reached yet.

|                 |                                               |
|:----------------|:----------------------------------------------|
| **Name**        | `claim_xrd`                                   |
| **Type**        | Method                                        |
| **Callable By** | Public                                        |
| **Arguments**   | `bucket` - `Bucket`: A bucket of Unstake NFTs |
| **Returns**     | `Bucket`: An XRD bucket                       |

#### `accepts_delegated_stake`

Queries whether the Validator is currently accepting delegated stake (a.k.a. allows the `stake` method call).

|  |  |
|:---|:---|
| **Name** | `accepts_delegated_stake` |
| **Type** | Method |
| **Callable By** | Public |
| **Arguments** | None |
| **Returns** | `bool`: True if this Validator accepts delegated stake, false otherwise |

#### `total_stake_xrd_amount`

Queries the total amount of XRD in the Validator’s Stake Vault.

|  |  |
|:---|:---|
| **Name** | `total_stake_xrd_amount` |
| **Type** | Method |
| **Callable By** | Public |
| **Arguments** | None |
| **Returns** | `Decimal`: The amount of xrd in the Validator’s Stake Vault |

#### `total_stake_unit_supply`

Queries the total amount of existing Stake Units for this Validator.

|                 |                                               |
|:----------------|:----------------------------------------------|
| **Name**        | `total_stake_unit_supply`                     |
| **Type**        | Method                                        |
| **Callable By** | Public                                        |
| **Arguments**   | None                                          |
| **Returns**     | `Decimal`: The amount of existing Stake Units |

#### `get_redemption_value`

Estimates the redemption value (XRD) of the given amount of Stake Units.

|  |  |
|:---|:---|
| **Name** | `get_redemption_value` |
| **Type** | Method |
| **Callable By** | Public |
| **Arguments** | `amount_of_stake_units` - `Decimal`: The amount of Stake Units to estimate the redemption value of |
| **Returns** | `Decimal`: The estimate XRD redemption value |

#### `register`

Registers the Validator to be available to validate and propose transactions in Consensus.

Only callable by the Owner.

:::note
Note that the Validator will not immediately be entered into the Active Validator Set. The Validator will be added on the start of the next Epoch. provided it has enough stake to be in the top 100.
:::


|                 |            |
|:----------------|:-----------|
| **Name**        | `register` |
| **Type**        | Method     |
| **Callable By** | `Owner`    |
| **Arguments**   | None       |
| **Returns**     | Nothing    |

#### `unregister`

Unregisters the validator from validating and proposing transactions in Consensus. Only callable by the Owner.

:::note
Note that the Validator must finish its responsibility of validating for the current Epoch and will only be removed from the Active Validator Set on the start of the next Epoch.
:::


|                 |              |
|:----------------|:-------------|
| **Name**        | `unregister` |
| **Type**        | Method       |
| **Callable By** | `Owner`      |
| **Arguments**   | None         |
| **Returns**     | Nothing      |

#### `update_key`

Updates the public key of the Validator.

Only callable by the Owner.

:::note
Note that the Validator’s key will only be updated and used by Consensus on the next Epoch.
:::


|  |  |
|:---|:---|
| **Name** | `update_key` |
| **Type** | Method |
| **Callable By** | `Owner` |
| **Arguments** | `key` - `Secp256k1PublicKey`: The public key to replace the Validator’s Consensus public key with |
| **Returns** | Nothing |

#### `update_fee`

Updates the fee percentage which a Validator skims off the Network Emissions (and puts into the Owner’s Stake Vault).

Notes:

- The change is not applied immediately:

  - If the newly requested fee is higher than the current one, the change becomes effective after approximately **2 weeks wait**.

  - If it is lower, then it becomes effective from the beginning of the next epoch.

- Requesting consecutive change discards the previous request (if any not-yet-effective one was pending).

  |  |  |
  |:---|:---|
  | **Name** | `update_fee` |
  | **Type** | Method |
  | **Callable By** | `Owner` |
  | **Arguments** | `fee_factor` - `Decimal`: A decimal \>= 0.0 and \<= 1.0 representing the new fee fraction |
  | **Returns** | Nothing |

#### `lock_owner_stake_units`

Locks the given Stake Units in an internal “delayed withdrawal” vault (as a way of showing the Owner’s commitment to running the Validator).

Only callable by the Owner.

|                 |                                                         |
|:----------------|:--------------------------------------------------------|
| **Name**        | `lock_owner_stake_units`                                |
| **Type**        | Method                                                  |
| **Callable By** | `Owner`                                                 |
| **Arguments**   | `stake_unit_bucket` - `Bucket`: A bucket of Stake Units |
| **Returns**     | Nothing                                                 |

#### `start_unlock_owner_stake_units`

Begins the process of unlocking the Owner’s Stake Units.

The requested amount of Stake Units (if available) will be ready for withdrawal after the Network-configured number of Epochs is reached.

Only callable by the Owner.

|  |  |
|:---|:---|
| **Name** | `start_unlock_owner_stake_units` |
| **Type** | Method |
| **Callable By** | `Owner` |
| **Arguments** | `requested_stake_unit_amount` - `Decimal`: The amount of Stake Units to start unlocking |
| **Returns** | Nothing |

#### `finish_unlock_owner_stake_units`

Finishes the process of unlocking the Owner’s Stake Units by withdrawing all the pending amounts which have reached their target Epoch and thus are already available - potentially none.

Only callable by the Owner.

|                 |                                   |
|:----------------|:----------------------------------|
| **Name**        | `finish_unlock_owner_stake_units` |
| **Type**        | Method                            |
| **Callable By** | `Owner`                           |
| **Arguments**   | None                              |
| **Returns**     | `Bucket`: A bucket of Stake Units |

#### `update_accept_delegated_stake`

Updates the flag deciding whether the Validator should accept delegated stake.

Only callable by the Owner.

|  |  |
|:---|:---|
| **Name** | `update_accept_delegated_stake` |
| **Type** | Method |
| **Callable By** | `Owner` |
| **Arguments** | `accept_delegated_stake` - `bool`: Whether to accept delegated stake |
| **Returns** | Nothing |

#### `signal_protocol_update_readiness`

Signals on ledger what protocol version to potentially change to. Used by Consensus to coordinate protocol updates.

Only callable by the Owner.

|  |  |
|:---|:---|
| **Name** | `signal_protocol_update_readiness` |
| **Type** | Method |
| **Callable By** | `Owner` |
| **Arguments** | `protocol_version_name` - `String`: The protocol version to signal readiness for |
| **Returns** | Nothing |

### Events

The Validator is the source of the following events:

#### `RegisterValidatorEvent`

``` rust
{} // body intentionally empty
```

Emitted when the source Validator is registered at Consensus Manager by the Owner (i.e. on `register` API call).

#### `UnregisterValidatorEvent`

``` rust
{} // body intentionally empty
```

Emitted when the source Validator is unregistered from Consensus Manager by the Owner (i.e. on `unregister` API call).

#### `StakeEvent`

``` rust
{
  // The amount of XRD received from the User.
  xrd_staked: Decimal
}
```

Emitted when a User (potentially the Owner) delegates new stake to the source Validator via `stake/stake_as_owner` API call.

Note: this deliberately does **not** include the auto-staked Validator Fee during Network Emission handling.

#### `UnstakeEvent`

``` rust
{
  // The amount of Stake Units received from the User and burnt.
  stake_units: Decimal
}
```

Emitted when a User (potentially the Owner) starts the unstaking process from the source Validator (i.e. receives the Unstake NFT) via `unstake` API call.

#### `ClaimXrdEvent`

``` rust
{
  // The amount of XRD returned to the User.
  claimed_xrd: Decimal
}
```

Emitted when a User (potentially the Owner) finishes the unstaking process from the source Validator (i.e. claims the XRD) via `claim_xrd` API call.

#### `UpdateAcceptingStakeDelegationStateEvent`

``` rust
{
  // The new value of the flag.
  accepts_delegation: bool
}
```

Emitted on the `update_accept_delegated_stake` API call.

#### `ProtocolUpdateReadinessSignalEvent`

``` rust
{
  // The name of the protocol version that the Node is ready for.
  protocol_version_name: String
}
```

Emitted on the `signal_protocol_update_readiness` API call.

#### `ValidatorEmissionAppliedEvent`

``` rust
{
  // The *concluded* epoch for which this Emission applies.
  epoch: Epoch

  // The XRD amount in the Validator's Stake Vault captured before this Emission.
  starting_stake_pool_xrd: Decimal,

  // The XRD amount added to the Validator's Stake Vault from this epoch's Emission.
  // Note: This number represents the net amount, after any applicable reliability penalty
  // and validator fee have been subtracted.
  stake_pool_added_xrd: Decimal,

  // The total supply of the Validator's Stake Units at the moment of applying this Emission
  // (i.e. *before* the auto-staking of the Validator's Fee described below).
  //
  // Derivable values:
  // - calculating `stake_pool_added_xrd / total_stake_unit_supply` gives a convenient "XRD emitted
  // per stake unit" factor, which may be used to easily calculate individual staker's gains.
  total_stake_unit_supply: Decimal,

  // The XRD amount received by the Validator's Owner (according to the configured Validator Fee
  // percentage).
  // Note: This fee is automatically staked and locked in the Owner Locked Stake Vault.
  //
  // Derivable values:
  // - calculating `stake_pool_added_xrd + validator_fee_xrd` gives the total emission for this
  // Validator (entirety of which goes into its Stake Vault).
  // - calculating `validator_fee_xrd / (stake_pool_added_xrd + validator_fee_xrd)` gives the
  // Validator's configured Fee percentage effective during the Emission's period.
  validator_fee_xrd: Decimal,
  
  // The number of proposals successfully made by this Validator during the Emission's period.
  proposals_made: u64,
  
  // The number of proposals missed by this Validator during the Emission's period.
  proposals_missed: u64,
}
```

Emitted at the epoch change, after the Consensus Manager distributes the appropriate share of Network Emissions to the source Validator.

#### `ValidatorRewardAppliedEvent`

``` rust
{
  // The *concluded* epoch for which this Reward applies.
  epoch: Epoch

  // The XRD amount rewarded (which got auto-staked and locked in the Owner's Locked Stake Vault).
  amount: Decimal
}
```

Emitted at the epoch change, after the Consensus Manager distributes the appropriate share of Rewards (i.e. Transaction Fees and Tips) to the source Validator.
