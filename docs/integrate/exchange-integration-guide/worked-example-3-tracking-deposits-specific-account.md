---
title: "Worked Example 3: Tracking Deposits (Specific Account)"
---

# Worked Example 3: Tracking Deposits (Specific Account)

:::note[Reminder]
As mentioned in the **Transaction Results** section, there is no such thing as a user “transaction type” such as a “transfer” - all transactions make use of a transaction manifest, and could do anything, such as call DeFi components. Instead - we encourage you to think about the transaction’s resultant **balance changes**. For example, a transaction where account X gains 200 XRD could be interpreted as a transfer to account X.
:::



By using the `/core/lts/stream/account-transaction-outcomes` you can filter the transaction stream to only transactions which somehow referenced the given account address.

For each account you are tracking, store a `last_state_version` and poll this endpoint from that state version - updating the `last_state_version` if a new transaction is returned.

You can then read out any relevant fungible balance changes from that transaction, possibly filtering to balance changes under the given account.

:::note
A transaction may reference an account, but might not have any fungible balance changes in the transaction. EG if a NF resource was deposited to the account. This may result in the transaction appearing in this feed under an account, without it having any fungible balance changes against that account.
:::


