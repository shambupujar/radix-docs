---
title: "Underway"
---

# Underway

- **First MFA implementation for release - “Security Shields” that can be applied to accounts and personas**

  - Updated Security Center including Security Shield status, and updated factor addition/configuration

  - Specifying of “default” Security Shield, with ability to apply a specific Shield to single accounts/personas if desired

  - Additional factor options: Arculus cards, passwords, passphrases (BIP39 seed phrase you must type in for each signature)

  - Security Shield configuration wizard, ensuring minimum standards of security and recoverability and suggesting good Shield configurations from available factors while allowing user to fully customize factors used to sign, start recover, and confirm recovery

  - Support for detecting a time-delayed recovery, highlighting it to users, allowing user to cancel or confirm (once delay is complete)

  - Automated signing flow for accounts controlled by arbitrary combinations of MFA factors to complete signing with minimum number of factors, but ensuring user can skip some factors and still complete signing with any valid combination

  - User-friendly migration flows to update Security Shields if a phone is lost or user gets new phone (and the user has chosen to use, including ability for a new phone to request a signature from a previous device via QR code

  - Allow use of more factor types to create new accounts or personas in single-factor mode

  - Batched transaction submission with randomized delay, allowing many accounts/personas to be updated without easy on-ledger association of them belonging to the same human

  - New transaction queue from home screen, showing and letting users manage time-delayed transactions, transactions currently being processed by the network, pre-authorizations being processed by dApps, and any transactions that have failed

  - Detect “out of sync” condition when user’s desired Shield configuration does not match what is applied on-ledger, allow user to easily re-sync via Shield update transaction

  - Much under-the-hood work to ensure consistent MFA implementation across iOS/Android, including signing flow, and managing complex hierarchical deterministic derivations from different factors so different accounts/personas do not appear on-ledger to be using the same factors

  - Under-the-hood support for “personal security questions” factor type, to be added in later update.

  - *Architecture work for future expansion:* expanding Radix Connect Relay to enable future wallet-to-wallet signing flows, including “social recovery” use of a friend’s phone as a factor, use of an extra phone as a factor, and multi-party controlled accounts
