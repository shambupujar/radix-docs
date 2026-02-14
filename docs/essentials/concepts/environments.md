---
title: "Environments"
---

# Environments

There are three main Radix environments. Each environment has a different network ID and each has a recognizable address format.

## Mainnet

Mainnet is the official Radix Public Network. It’s Production. It has real assets, and its history goes back to the Radix Olympia Public Network which went live in July of 2021.

Mainnet’s network ID is 1, and addresses on Mainnet have `_rdx` immediately after the human-readable address type. E.g., account addresses on mainnet start with `account_rdx`.

| Mainnet Item | Value |
|----|----|
| Network Id | **1** |
| Logical Name | **mainnet** |
| Dashboard / Explorer | [https://dashboard.radixdlt.com/](https://stokenet-dashboard.radixdlt.com/) |
| Developer Console | <https://console.radixdlt.com/> |
| Gateway | [https://mainnet.radixdlt.com/swagger/](https://babylon-stokenet-gateway.radixdlt.com/swagger) |
| Native addresses | \- XRD: `resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd` <br/> - More are detailed in [Well-known Addresses](../../reference/well-known-addresses.md#mainnet-system-native-addresses). |

## Stokenet (Public Test Network)

Stokenet is the primary test network for doing Radix development. It typically runs the exact same protocol version as mainnet, though sometimes it also serves as a first deployment for planned releases.

Stokenet is intended to be stable, but in exceptional circumstances may be wiped and reset. Anything deployed to Stokenet should be treated as for testing purposes only.

Stokenet’s network ID is 2, and addresses on Stokenet have `_tdx_2_` immediately after the human-readable address type. E.g., resource addresses on Stokenet start with `resource_tdx_2_`.

Stokenet is our primary public test network, intended for integration and testing work.

| Stokenet Item | Value |
|----|----|
| Network Id | **2** |
| Logical Name | **stokenet** |
| Dashboard / Explorer | <https://stokenet-dashboard.radixdlt.com/> |
| Developer Console | <https://stokenet-console.radixdlt.com/> |
| Gateway | [https://stokenet.radixdlt.com/swagger/](https://babylon-stokenet-gateway.radixdlt.com/swagger) |
| Docker compose node <br/> for Core API development | <https://github.com/radixdlt/babylon-node/tree/main/testnet-node> |
| Native addresses | \- XRD: `resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc`<br/> - Faucet: `component_tdx_2_1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxyulkzl` <br/> - More are detailed in [Well-known Addresses](../../reference/well-known-addresses.md#stokenet-system-native-addresses) |

## Local Environment

When using the Radix Engine Simulator (resim), all deployment and interactions take place on your local filesystem and local machine.

You can reset your local environment at will.

The simulator’s network ID is 242. Addresses on the simulator have `_sim` immediately after the human-readable address type. E.g., package addresses on the simulator start with `package_sim`.

| resim Item | Value |
|----|----|
| Native addresses | \- XRD: `resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3` <br/> - Faucet: `component_sim1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxhkrefh` <br /> - More are detailed in [Well-known Addresses](../../reference/well-known-addresses.md#resim-system-native-addresses) |
