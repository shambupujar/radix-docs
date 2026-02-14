---
title: "Exchange Integration Guide"
---

# Exchange Integration Guide

The following guide will take you through recommendations for how to integrate with the Radix ledger.

This includes use of simplified tools (Core LTS API and the Toolkit for exchanges) which provide easy interfaces where you only care about fungible transfers, and sending fungible resources between accounts.

We also suggest reading through the [Technical Concepts](/v1/docs/babylon-technical-concepts) documentation for information on concepts described in this guide.

## Overview

Your production integration will typically involve:

- A production node in full node configuration, connected to mainnet.
  - You should also run a back-up node for hot-swapping if the main node has issues.
- Deployed custom code which connects to your infrastructure, and Radix infrastructure. It would typically make use of:
  - An integration with a Radix Engine Toolkit library for constructing/signing/finalizing transactions.
    - We have created a high-level “Toolkit for exchanges” extension to the toolkit wrappers, with an API which will be compatible for mainnet launch and beyond.
    - This “Toolkit for exchanges” extension is designed to make it easy to construct fungible token transfers between single-signer accounts.
  - An integration with the Core API of your node.
    - We have created an /lts/\* sub-api, designed to be simple for exchanges to use, and compatible for mainnet launch and beyond.
