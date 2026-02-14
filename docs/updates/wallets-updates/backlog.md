---
title: "Backlog"
---

# Backlog

### Higher Priority

#### QOL Enhancements

- **Indication on dApp card (transaction review screen) if it is currently not on authorized dApps list**
- **Copying and zooming of NFT images**

#### User Features

- **Redeem pool units directly from within wallet**
- **Unstake directly from within wallet**
- **Name service provider support**
  - Add a name service provider in the wallet, and do lookups of names in place of account addresses
- **Dark mode**
- **Persona Avatars**
  - Both uploaded and NFT-based
- **“Share all” option for account sharing**
  - Always shares the full list of all accounts (not just the current list of all accounts). Would actually be a specific profile entry.
- **Encrypted message support**
- **Account details update**
  - Viewing and selecting of relevant resource tags
  - View by type, dApp, tag

#### Developer Features

- **Full Persona data implementation**
  - <a href="https://www.radixdlt.com/blog/feedback-wanted-radix-persona-data-types">Greatly expanded persona data fields</a>

### 

### General Items

#### QOL Enhancements

- **Homescreen enhancements**
  - User-specified re-ordering of accounts on homescreen
  - Security prompt to user on first address copy of an account:
    - *"If you're about to send tokens to this account, you should consider writing down the seed phrase securing it. Do you want to do that now?"*
  - Indication on account cards if an account is configured to not allow third party deposits
- **Transfer flow enhancements**
  - When selecting resources, make resources tappable to bring up their details - as it does in the Account view (helps differentiate between tokens with the same name)
  - Allow selection of a full "collection" of NFTs to send
  - Allow amount of pool units to send to be picked by percentage (showing redeemable value)
- **Transaction Review enhancements**
  - Indication on asset card (specifically in transaction review) if it is unknown to the wallet
  - Check if any withdraws or badge proofs from user’s accounts will be invalid based on current state (ie. “you don’t actually have enough of X to do that”)
    - Should mostly only happen if a dApp is lazy, but avoids user spending fees for nothing - or having a transaction that is “rejected” but is still out there in the mempool and has to be explicitly canceled.
    - In fee customization, show XRD balances shown in accounts when picking fee payment account
    - Check for and warn about unusually high fees / royalties
  - Access to view non-resource parameters passed to components called in manifest
    - Transparency for users for dApps where assets aren't the primary function (data access for example)
- ** Connector Extension /** Radix Connect enhancements
  - User switching between signaling servers (similar to gateway server switching)
    - Expose similar option in CE
  - User-specified option for Radix Connect to never fall back to relay server
  - Support for Wallet push notifications and async communicaction
- **dApp usage enhancements**
  - Have RDT send an explicit “cancel” request to the wallet - for a given request ID - if the user cancels that request on the dApp side
    - Just friendly to not have the user have to manually also cancel on the dApp side, even if no bad behavior can result from not doing this
- **General display enhancements**
  - Comma/period use in numbers on iOS, from OS setting
- **Other QOL**
  - Add link from account settings to Dashboard page for the account (once Dashboard can show more helpful transaction history)
  - Ledger device hiding/"deleting"
  - Have Connector extension linking QR code act as a deep link to go straight to linking flow in wallet
  - Initiate transfer from asset detail screen (within an account)
  - Wallet/extension version checking and update prompting
  - Offer option to set third-party deposit rule to “deny all” when an Account is hidden

#### User Features

- **Enable applying guarantees of specific nonfungible IDs**
- **Resource safety locking - prevent casual/accidental transfer of certain resources**
  - Related: option (default on?) to warn severely against transfer of assets with “badge” tag - gives appropriate meaning to that tag, behavior can be part of metadata standard’s wallet handling to encourage use
- **Alias services support, for things like "domain" services that provide a name for an address**
- **Address Book**
  - User-added and managed aliases
  - Overlay with Name Service support
- **Handling of multiple in-flight transactions**
  - Support cancelation for things stuck in mempool (when we have cancelation on ledger)
  - Time-delayed submission to preserve account ownership separation
  - Easily see recent successes/failures
- **“Check recovery” feature**
  - Run the user through using their recovery/confirmation factors so they can be sure everything is good if something goes wrong.
  - Maybe even occasionally prompt to consider doing that check.
- **Support for nested/contained NFT display and manipulation**
  - Requires Radix Engine support

#### Developer Features

- **“No-modify” transaction manifest support**
  - dApp must specify the signatures it needs directly, and the Transaction Review screen has special warnings, and does not modify the transaction at all (including fees).
  - Need to consider this in the context of MFA and external signer capability
- **New dApp request: ROLA proof of a specific resource/nonfungible**
  - Useful when a frontend wants to gate access by badge ownership, much more direct than just requesting accounts and looking through them. Also useful in an “ongoing” sense, allowing the resource to even move around between accounts.
  - Wallet finds an account that contains it, provides ROLA proof of ownership of that account
- **Wallet-side storage of dApp data**
  - Cookie style
- **Invoicing functionality**
  - Requests using specific manifest templates partially specifying results, but also prompting wallet to fill in certain required information (eg. a source account, token quantity, ) Enables things like one-step payments without getting a list of accounts first from the ultimate signer
  - dApp-to-wallet (via Wallet API)
  - wallet-to-wallet or device-to-wallet (via QR)
- **Document signing/notarization**
  - PDF/text legal agreements
  - Readable message payloads that grant off-ledger permissions to dApps

### 

### Acknowledged

- **Android wallet on F-Droid or similar**
  - Interesting, but needs consideration/review of non-technical factors
- **More factor types**
  - Relevant after MFA implementation
  - Additional hardware devices?
  - Second phone, tablet, watch?
  - Third party custodial signer?
  - An asset I hold? (transferable?)
  - Use of existing credit card NFC?
- **More intelligent security configuration prompting**
  - Relevant after MFA implementation
  - Prompt advanced security setups for high-value accounts, or in response to questions about user risk profile?
- **Real Account/Persona deletion**
  - Set "tombstone" state on-ledger to no longer accept deposits/withdrawals, remove public keys, etc.
  - Fully remove from wallet (not just hide)
- **Language localization to top priority 1-3 non-English languages**
- **Multi-device syncing**
  - ie. single Profile synced across devices
- **“Plausible deniability” mode**
  - Secretly put wallet in a mode certain accounts are hidden from view and are inaccessible, but other (ostensibly low-value) accounts remain visible
- **Passport credential scanning via NFC**
  - Storage as Persona data field that can be requested as proof of human: ePassport Basics from ICAO, summary blog

  
