---
title: "Worked Example 1: Transfer Transaction"
---

# Worked Example 1: Transfer Transaction

:::note
[See here for example code](https://github.com/radixdlt/typescript-radix-engine-toolkit/blob/main/examples/core-e2e-example/main.ts) for this worked example.
:::



As preparation:

- Know which account you wish to be transferring from/to, the resource, and quantity.
- Use the `/core/lts/transaction/construction` Core API endpoint to find the current epoch. You should check that the `ledger_clock` field is close to the current time to ensure that the node is synced up, and that the current epoch is accurate.
- Check the account’s current XRD balance with `/core/lts/state/account-fungible-resource-balance` to ensure you have sufficient XRD balance to pay fees from the account, and any resource you wish to transfer.
- Use the `/core/lts/state/account-deposit-behaviour` Core API to check whether the target account [currently accepts deposits](worked-example-2-tracking-deposits-any-account.md#configuring-account-deposit-modes-and-resource-preference-map) of the resource you are transferring.
  - This endpoint returns all the details explaining why the given transfer would be accepted (or not). Please expand the response schema of its [API documentation](https://radix-babylon-core-api.redoc.ly/#tag/LTS/paths/~1lts~1state~1account-deposit-behaviour/post) to see the summary of all relevant transfer rules.
  - If the API tells you that the account does not currently accept the deposit, you should inform the user to update their account settings.

Then, use the Toolkit for exchanges to build the transaction:

- Use the SimpleTransactionBuilder to build a transaction with the fee-payer account address / notary corresponding to the public key of the sender account. An epoch is approximately 5 minutes.
  - *Note: The SimpleTransactionBuilder uses the “notary is signer” flag and 0 signatories. So notarizing is equivalent to signing the transaction.*
- The builder will return a `hash_to_sign` which will be signed by the corresponding private key.
- The toolkit can then be used to compile the notarized transaction, and returns you the:
  - Notarized transaction payload (for submission)
  - Transaction Identifier (also known as the intent hash).

You can then submit the notarized transaction payload to `/core/lts/transaction/submit` in the Core API, and then poll the `/core/lts/transaction/status` endpoint with the transaction intent hash to look at the current status of the transaction.

:::note[Important]
Please read the **Transaction Outcome** section of this document. As well as the success case “Committed Success”, there are a number of different failure cases which are possible and will need to be handled: “Temporary Rejection”, “Permanent Rejection”, and “Committed Failure”.
:::



Typically you will want to handle these in the following ways:

- **Temporary Rejection**: You may wish to wait or resubmit the same transaction (with the same transaction intent / transaction identifier).
  - Be careful: the transaction may still be able to be committed successfully! For example - if not enough XRD is available to lock a fee in the account, the transaction will be marked as a temporary rejection. Because if the account is topped up, the transaction might still go through.
  - Eventually this transaction will be permanently rejected because its “max epoch” that was configured during transaction construction will have passed.
  - You may wish to tune the max epoch so that transactions permanently reject sooner. Each epoch lasts about 5 minutes.
- **Permanent Rejection** or **Committed Failure**: The transaction at this stage cannot be committed successfully. You will need to remedy the reason for failure - EG the account doesn’t have enough XRD to pay for fees - and then build/sign a new, replacement transaction - which will have a new transaction identifier.

If committed (as either a success or failure), the status endpoint will return a (resultant) `state_version` for the transaction.

If you wish, that can be used with the `/core/lts/stream/transaction-outcomes` endpoint (as the `from_state_version` with limit 1) to return the balance changes of the transaction.
