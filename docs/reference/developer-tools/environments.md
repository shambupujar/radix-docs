---
title: "Environments"
---

# Environments

There are three main Radix environments.  Each environment has a different network ID and each has a recognizable address format.

## Mainnet

Mainnet is the official Radix Public Network.  It's Production.  It has real assets, and its history goes back to the Radix Olympia Public Network which went live in July of 2021.

Most application releases target mainnet by default.

Mainnet's network ID is 1, and addresses on Mainnet have `_rdx` immediately after the human-readable address type.  E.g., account addresses on mainnet start with `account_rdx`.

## Stokenet

Stokenet is the primary test network for doing Radix development.  It typically runs the exact same protocol version as mainnet, though sometimes it also serves as a first deployment for planned releases.

Stokenet may periodically be wiped and reset, and anything deployed to Stokenet should be treated as for testing purposes only.

Stokenet's network ID is 2, and addresses on Stokenet have `_tdx_2_` immediately after the human-readable address type.  E.g., resource addresses on Stokenet start with `resource_tdx_2_`.

## Local Environment

When using the Radix Engine Simulator ([resim](/v1/docs/radix-engine-simulator-resim)), all deployment and interactions take place on your local filesystem and local machine.

You can reset your local environment at will.

The simulator's network ID is 242.  Addresses on the simulator have `_sim` immediately after the human-readable address type.  E.g., package addresses on the simulator start with `package_sim`.
