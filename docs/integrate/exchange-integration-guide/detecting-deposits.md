---
title: "Detecting Deposits"
---

# Detecting Deposits

There are two main approaches:

- **Approach 1: Generate new account addresses for each user (better UX)**
  - Generate a new public key pair for the given user, and derive a virtual account address for it from the Toolkit. Store this account to user correspondence, and set up tracking for this account.
  - OPTIONAL: Consider sending a transaction to update the account’s deposit rules so that only the supported resources can be deposited there (e.g. XRD). This would prevent users accidentally sending the wrong resource to the account. [See docs](../../build/native-blueprints/account.md).
  - On your “Deposit” page:
    - Show this account address
    - Show the QR code with content of radix: `<account_address>` where `<account_address>` should be replaced by the account address that has been generated for the user.
    - Direct the user to initiate a transfer to that address from their wallet.
  - Monitor deposits into these generated account addresses (see Worked Example 2), and use the stored address to user mapping to resolve the user who deposited.
- **Approach 2: Use a single address with messages to distinguish the user**  
  > **Warning**
:::note
Encrypted messages will not be implemented in the wallet for mainnet launch.
:::


  - Have a single account address which receives transfers.
  - OPTIONAL: Consider sending a transaction to update the account’s deposit rules so that only the supported resources can be deposited there (e.g. XRD). This would prevent users accidentally sending the wrong resource to the account. [See docs](../../build/native-blueprints/account.md).
  - On your “Deposit” page:
    - Show a required message and this account address, and make clear to the user that they **must** input this message with their transfer.
    - Show the QR code with content of radix: `<account_address>` where `<account_address>` should be replaced by the account address.
    - Direct the user to initiate a transfer to that address from their wallet, and include the message.
  - Monitor deposits into the account address (see Worked Example 3), and use the attached message to resolve the user who deposited.
