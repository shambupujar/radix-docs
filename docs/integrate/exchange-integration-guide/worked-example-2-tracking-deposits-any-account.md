---
title: "Worked Example 2: Tracking Deposits (Any Account)"
---

# Worked Example 2: Tracking Deposits (Any Account)

By using the `/core/lts/stream/transaction-outcomes` you can ingest the transaction stream from the Babylon ledger.

Store a `from_state_version` and poll this endpoint from that state version - updating the `from_state_version` to be the next transaction to read as you go.

The returned `LtsCommittedTransactionOutcome` for each transaction includes its status (Committed Success or Committed Failure) as well as the resultant balance changes (due to eg fee payments or vault withdraws/deposits) of the transaction - grouped by the **global entity** (eg accounts or components) which owned the vault/s which were updated (directly or indirectly).

Negative balance changes can be interpreted as withdrawals from the global entity, and positive balances can be interpreted as deposits.

:::note
It is possible that a transaction can have multiple withdrawals from different global entities, and multiple deposits to different global entities.
:::



A transaction which has account A paying the XRD fee and having a single withdrawal of resource R, and another account B having a deposit of resource R, could be interpreted as a simple transfer of resource R. But more complicated transactions are possible, and should be handled.
