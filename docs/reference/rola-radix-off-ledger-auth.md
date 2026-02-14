---
title: "ROLA (Radix Off-Ledger Auth)"
---

# ROLA (Radix Off-Ledger Auth)

ROLA is method of authenticating something claimed by the user connected to your dApp with the Radix Wallet. It uses the capabilities of the Radix Network to make this possible in a way that is decentralized and flexible for the user.

ROLA is intended for use in the server backend portion of a Full Stack dApp. It runs "off-ledger" alongside backend business and user management logic, providing reliable authentication of claims of user control using "on-ledger" data from the Radix Network.

Learn more about Pure Frontend dApps and Full Stack dApps at [What is a dApp on Radix?](../build/setting-up-for-development.md)

## Uses of ROLA

There are two kinds of authentication ROLA is designed for:

- Authenticating a user’s **login using a Persona**

- Authenticating a user’s **control of an account on Radix**

In short, these two cases are solved by ROLA authenticating a cryptographic proof of control of an entity on the Radix Network:

- Proof of control of an **Identity component**

- Proof of control of an **Account component**

If a user’s Radix Wallet can produce a proof of control of an Identity component at a given address, and ROLA authenticates it, then that user may safely be considered to be logged in. The Identity’s address may be used as the unique identifier for that user.

If a user’s Radix Wallet can produce a proof of control of an Account component at a given address, and ROLA authenticates it, then that user may safely be considered to be the owner of that account. They may also be safely considered the owner of the assets contained within the account.

## How ROLA Works

ROLA is somewhat similar to the <a href="https://fidoalliance.org/passkeys/" target="_blank">PassKeys system of FIDO authentication</a>, but leverages the existence of a safe decentralized network to enable cycling of public keys used for authentication, rather than relying on fixed public keys and a cloud backup of the corresponding private key.

ROLA works on the expectation that all Identity and Account components on the Radix Network include a piece of metadata that defines an array of public key hashes as the `owner_keys` for that component, where any of the corresponding keys could sign to prove ownership of the account/identity. A signle public key hash is set automatically on creation of a preallocated account/identity, corresponding to the private key that created the component. The user (assisted by the Radix Wallet) may change it in the future to enable convenient multi-factor recovery of control of accounts and identities.

Then the typical workflow for ROLA authentication is this:

1.  **The dApp backend** creates a challenge (with a limited time of validity) and passes it to the frontend.

2.  **The dApp frontend** makes a request to the Radix Wallet (using √ Connect Button or Wallet SDK) for either a login or account(s) address(es) with required proof of ownership. The challenge is included in this request.

3.  **The user** selects the Persona or Account(s) requested.

4.  **The user’s Radix Wallet** produces a cryptographic signature using the private key corresponding to one of the configured public key hashes in the `owner_keys` metadata entry. It returns to the dApp the address, challenge, public key, and signature.

5.  **The dApp frontend** then passes that information to ROLA in the dApp backend.

6.  **ROLA** checks that the challenge is still good, and that the address, public key hash, and signature match for the current state of the account/identity component. If so, correct proof has been provided and the dApp backend and frontend may act accordingly (perhaps considering that user logged in and creating an active sessions in the user’s browser).

## Installation and Usage

Please check <a href="https://github.com/radixdlt/rola" target="_blank">ROLA examples</a> for more documentation and an end-to-end implementation of ROLA using a express server as backend and a TypeScript dApp as client.

And please check out the <a href="https://www.npmjs.com/package/@radixdlt/rola" target="_blank">ROLA npm library</a> for use in building Node.js backends using ROLA.

Finally, some [Community APIs](../integrate/network-apis/index.md) offer delegated ROLA-as-a-service, which could be a good choice assuming you trust the given service with the responsibility to authenticate users on your behalf.
