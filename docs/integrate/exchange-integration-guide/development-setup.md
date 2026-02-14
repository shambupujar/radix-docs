---
title: "Development Setup"
---

# Development Setup

The recommended development set-up is to either:

- Run a docker node locally via docker-compose, synced to a test network by cloning the [babylon-node](https://github.com/radixdlt/babylon-node) repository by following the [instructions in the testnet-node folder](https://github.com/radixdlt/babylon-node/tree/main/testnet-node).
- Run a shared testnet node in your infrastructure which you can connect to. See the **Test Networks** section (or follow the link in the previous bullet point) for more details on how to configure this node.

You will then need to develop integrations against:

- The LTS Core Api - see the **Integration: LTS Core API** section.
- The Toolkit for Exchanges - see the **Integration: LTS Toolkit for Exchanges** section.
- Any custom data sources/infrastructure that you wish to push data into.

To test sending transfers as a user would:

- You may wish to [install the wallet and connector extension](https://docs-babylon.radixdlt.com/main/getting-started-developers/wallet/wallet-and-connecter-installation.html).
- When you have created an account, you can retrieve test XRD through the wallet.
