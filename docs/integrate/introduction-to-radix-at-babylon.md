---
title: "Introduction to Radix at Babylon"
---

# Introduction to Radix at Babylon

The Radix Public Network is a Layer-1 Decentralized-Finance (DeFi) platform. Radix has been designed and built from the ground up over many years to be a full-stack for the mainstream adoption of DeFi. This is most easily understood by watching our <a href="https://www.radixdlt.com/radfi" target="`_blank`">RadFi keynote</a>, which explains the problems we see with DeFi right now, and how the Radix platform can enable:

- A mainstream-ready user experience
- A bespoke programming language and execution engine which allows for simple building of secure decentralized applications
- A network which can support unlimited scalability at our Xi’an release

There are three key milestones in the Radix journey:

- **Olympia** - Released in July 2021, but now has ended, with all data migrated to Babylon.
  - Simple UTXO-based state/transaction model supporting fungible resources, accounts, validators and staking.
- **Babylon** - Released September 27 2023. Currently live.
  - A complete rework of the network’s state and transaction model, using a more intuitive account-based state model and intent-based transaction model, with support for offline transaction construction.
  - This release brings full smart-contract style functionality, built to run in the Radix Engine. The Radix Engine is an execution environment built from scratch for DeFi, which is not EVM compatible - a decision which enables it to be tailored for DeFi security, user experience, and network throughput.
- **Xi’an** - Planned as the next major milestone after Babylon.
  - Xi’an will bring infinitely scalable, multi-sharded consensus to the Radix network with the Cerberus consensus protocol.

**This guide will help you to prepare for an integration with the Radix Babylon Network.**

Given that Olympia is no longer live, most integrators do not need to worry about Olympia. In which case, you should start at **[Babylon Technical Concepts](/v1/docs/babylon-technical-concepts)**. Some integrators (e.g. auditors, tax integrations, etc) may also care about ingesting data from Olympia, please also see the **[Integrations with the historic Olympia ledger](/v1/docs/integrations-with-the-historic-olympia-ledger)** section if this applies to you.
