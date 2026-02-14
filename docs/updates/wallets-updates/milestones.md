---
title: "Wallets Updates"
---

# Wallets Updates

### Multi-Factor Account/Persona Control and Recovery

Frequently referred to simply as "MFA", this milestone will let you easily configure your accounts to use a variety of different combinations of signing factors in order to access your assets, and enables both personal and social account recovery, finally allowing you to do away with seed phrases (if you so choose).

The Babylon release of the Radix Public Network already contains all the necessary capabilities; this milestone is the work necessary to support the various workflows within the Radix Wallets.

You can read more about it here: <https://www.radixdlt.com/blog/how-radix-multi-factor-smart-accounts-work-and-what-they-can-do>

Or here: <https://learn.radixdlt.com/article/how-are-smart-accounts-created-controlled-and-recovered>

Anticipated design includes:

- Shared platform library for managing signing factors and workflows
- Default MFA Setup w/ basic factor types
  - This device, legacy seed phrase, enter-to-sign seed phrase, Ledger, security questions, trusted contact
- Account “recovery” flows - lost phone, migration to new phone, settings update
- Account-specific MFA settings
- Initiate recovery or lock for friend (from recovery badge)
- First consumer hardware factor type
  - Arculus is current target
- Automated batched transaction submission to preserve Account and Persona separation on ledger

### Push Notifications/Requests

Currently, the user must manually open the Radix Wallet to receive requests (such as logins, transactions, and data requests) from dApps, and can receive them only actively connected to a dApp.  A push notification-based system can add the option to have one-tap opening of the wallet when making a request, and to enable specific dApps (and potentially contacts) to make request to your wallet asynchronously.

Anticipated design includes:

- User’s linked Connector extension given permission to push typical dApp requests (transactions, etc.)
- Per-dApp permission to do side-channel pushes of requests
- Ideally peer-to-peer permissions for push

### 

### Multi-Party Signing

Radix transactions already support applying multiple signatures. This may be to authorize to multiple accounts, or to provide multi-factor authorization to a given access controller as part of the multi-factor system. However currently the Radix Wallet expects to provide all required signatures on any transactions proposed to it. A multi-party signing system would allow collaborative signing of transactions between multiple parties.

Anticipated design includes:

- Wallet-to-wallet transaction passing for peer transactions - RadFi NBA ticket purchase style
- Use cases for off-ledger logic providing its own approval of certain transaction results
- dApps able to provide their own signature on transactions without releasing the wallet’s control of final signature and submission.
- Passing via webRTC/deeplink/QR/NFC?

### 

### Session/Streaming Mode

Typical one-by-one transaction review and approval may limit the user experience for some use cases. A session or "streaming" mode in the wallet would, with the user's permission, allow ongoing transaction approvals without one-by-one wallet interaction.

Anticipated design includes:

- Ability to give timed, dApp-specific permission for requests/transactions for “automatic” signatures against a given account, with constraints on acceptable transactions
- Likely needs to be integrated with Access Controller design update to allow nomination and signature by a limited-time, revocable temporary key without need for individual biometrics, device access, etc.

### Decentralized Identity / Verifiable Credentials

As Web3 and DeFi mature, many uses cases will begin to require the ability of having verified information about individuals, their identity, their qualifications, and more – whether this is various types of "proof of human", AML/KYC information, or more day-to-day credentials. Using the Radix Wallet and on-ledger components and assets, we can create a system that provides composable on-ledger credentials, but without losing the individual's need for privacy and being selective about what they share with who. This has many similarities to the well-considered <a href="https://www.w3.org/TR/vc-data-model-2.0/" rel="nofollow noopener noreferrer" target="_blank">W3C VC/DID model</a>, but using Radix features to create a functional implementation that is convenient, composable, and decentralized.

Anticipated design includes:

- Overall system design for credential issuers, verifiers, and dApps
- Radix Wallet implementation of managing and selective sharing VCs and proofs

### NFC Scanning

Described during <a href="https://radixdlt.com/radfi">RadFi 2022</a>, Near-Field Communication Scanning would give you the option for your wallet to receive requests via NFC, or to show ownership of an NFT, persona, or account to a tap-scanner, which the other system could then freely verify without requiring an on-ledger transaction.

Anticipated design includes:

- Asset/Persona/Account ROLA proofs via NFC tap
- dApp requests or invoices and responses via NFC tap
