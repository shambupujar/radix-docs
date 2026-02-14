---
title: "Transaction Tracker"
---

# Transaction Tracker

This document offers a description of the design and implementation of the Transaction Tracker: its state and internal responsibilities.

:::note
**>
Low-level details below

**

The Transaction Tracker is an internal implementation detail of the Transaction Executor and, as such, does not offer any Public API.
:::


## Background

In Radix, the Transaction Tracker native component is a specialized data structure used by the Transaction Executor to keep track of the “recently” executed User Transactions: it stores the success/failure indication of each Transaction, keyed by its Intent Hash.

This information allows us to validate the Intent Hash of each newly-submitted Transaction before actually executing it, i.e. to detect a potential duplicate Transaction (which is supposed to be rejected with an `IntentHashPreviouslyCommitted` error).

:::note
Future use-case: Cancelling a Transaction



Apart from the “replay protection” described above, the Transaction Tracker enables Transaction cancellation: it can store a “cancelled” Transaction Status, and the Transaction Executor’s logic is ready to interpret it as`IntentHashPreviouslyCancelled`. However, a public API for cancelling Transactions is not yet available.
:::


Since every Transaction is valid only within its configured Epoch range, and this configuration has a <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/ff21f24952318387803ae720105eec079afe33f3/radix-engine-common/src/constants/transaction_validation.rs#L19">hard-limited maximum span</a>, the Transaction Tracker only needs to keep records for some “recent” subset of the executed Transactions. Specifically: only the transactions with Epoch range *ending after* the current Epoch have any potential of being re-submitted (i.e. all older Transactions would be rejected anyway, due to `TransactionEpochNoLongerValid`).

This allows us to reclaim large volumes of state used by Transaction Tracker, using a Partition-based ring-buffer approach [detailed below](transaction-tracker.md#transaction-status-ringbuffer).

:::note
**>
Network-wide Singleton

**

The singleton Transaction Tracker’s instance is created and started by the system during Genesis (i.e. it is not supposed to be instantiated by users). You can find its well-known address for each Network [here](../../reference/well-known-addresses.md).
:::


## On-ledger State

The `TransactionTracker` blueprint defines a single “state” field - a `TransactionTrackerSubstate` structure, which:

- Maintains the metadata needed to interpret the [Transaction Status Ring-buffer](transaction-tracker.md#transaction-status-ringbuffer) structure:

  - `start_epoch`, indicating the first Epoch covered by the `start_partition`.

  - `start_partition`, identifying the currently-oldest of the Partitions comprising the Ring-buffer.

- Captures (on-Ledger) important constants used by the logic:

  - `partition_range_start_inclusive` - the Ring-buffer’s <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/ff21f24952318387803ae720105eec079afe33f3/radix-engine/src/blueprints/transaction_tracker/package.rs#L38">first usable Partition number</a> (currently `65`).

  - `partition_range_end_inclusive` - the Ring-buffer’s <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/ff21f24952318387803ae720105eec079afe33f3/radix-engine/src/blueprints/transaction_tracker/package.rs#L39">last usable Partition number</a> (currently `255`).

  - `epochs_per_partition` - the <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/ff21f24952318387803ae720105eec079afe33f3/radix-engine/src/blueprints/transaction_tracker/package.rs#L40">number of Epochs tracked in a single Partition</a> (currently `100`).

Apart from the state field, the `TransactionTracker` Entity employs all its remaining Partitions as Key-Value Collections, implementing a circular buffer of expiring Transaction Statuses.

## Transaction Status Ring-buffer

As mentioned earlier, the Transaction Tracker uses multiple consecutive Partitions as slots in a Ring-buffer covering the entire range of Transactions’ end-Epochs allowed at the current Epoch.

### Data structure

Let’s have a look at a specific situation, based on an example `current_epoch = 45168` and actual production constants:

![Transaction Status Ring-buffer](/img/image-19-.png)

Each of these 191 Partitions (within the inclusive range `[65; 255]`) represents a range of `100` future Epochs. The starting Epoch (i.e. `start_epoch` field) [grows in steps](transaction-tracker.md#buffer-rotation) of `100` (constantly catching up to the current Epoch, when possible) and thus the starting point of the Ring-buffer cycles over the available Partitions (as is usual for all <a href="https://en.wikipedia.org/wiki/Circular_buffer">circular buffers</a>).

The exact Epoch range of any Partition, at any moment, can be computed based on the numbers found in the state field.

Each Partition simply stores the Intent Hashes and Statuses of executed Transactions which have their Epoch ranges *ending* within the Partition’s Epoch range. The circular buffer behavior used here is simply expiring the no-longer-needed information on sufficiently-old Transactions.

:::note
**>
Ring-buffer over-allocation

**

A careful reader might have noticed that the Transaction’s maximum Epoch range (i.e. `30 days * 24 hours * 12 epochs = 8640`) is significantly lower than the capacity of the Transaction Status Ring-buffer (i.e. `191 partitions * 100 epochs = 19100`).

This means that at any given time, more than half of the buffer will remain empty - contrary to the over-simplified illustration above.

The over-allocation itself does not bring any significant downsides (and potentially allows for painless future adjustments of our Epoch duration or Transaction’s allowed Epoch range).
:::


### Operations

The Transaction Executor interacts with the Transaction Status Ring-buffer in two ways.

#### Intent Hash Validation

For each Transaction, the Executor performs (among other things) the following steps:

1.  Validates the Transaction’s Epoch range (before even consulting the Transaction Tracker).

    - This rejects Transactions which are already past their end-Epoch (they would not have a corresponding slot in the Ring-buffer *anymore*).

    - And this also rejects Transactions which have their end-Epoch too far in the future (they would not have a corresponding slot in the Ring-buffer *yet*).

2.  Locates the Ring-buffer slot corresponding to the Transaction’s end-Epoch.

    - This determines which Partition’s Key-Value Collection to look at.

3.  Checks whether the determined Partition contains the Transaction’s Intent Hash.

    - If it does, then it means that current Transaction is a duplicate, and it is rejected.

    - This is also the point at which the not-yet-available Transaction cancellation is handled.

4.  Actually executes the Transaction.

5.  If the Transaction gets committed (regardless of its success/failure), the Executor inserts the Intent Hash and Status to the already-determined Partition (from point 2.).

#### Buffer Rotation

After detecting that current Epoch is greater than `start_epoch + epochs_per_partition` (in other words: that `start_partition` no longer covers the current Epoch, but only past), the Transaction Executor advances the Ring-buffer, which means that:

1.  `start_epoch` grows by `epochs_per_partition`.

2.  The entire Partition at `start_partition` is deleted from the Substate Store (i.e. cleared).

3.  `start_partition` grows by `1`…

    - …taking into account that it must cycle back to `partition_range_start_inclusive` once it exceeds the `partition_range_end_inclusive`.
