---
title: "Register as a Validator (Docker)"
---

# Register as a Validator (Docker)

<a href="https://docs-babylon.radixdlt.com/main/node-and-gateway/docker-register-as-validator.html">https://docs-babylon.radixdlt.com/main/node-and-gateway/docker-register-as-validator.html</a>

## Registering a Validator Node

### Introduction

A Validator node is a Full Node that has registered with the Radix network to receive delegated stake and potentially be selected to participate in network consensus.

Validator nodes provide the critical infrastructure of the Radix network and may receive special incentive rewards as a result. However attempting to become one of the network’s 100 validator nodes is not a decision to be taken lightly, requiring commitment to high reliability operation and engagement with the Radix community. Registration as a validator node alone does not guarantee participation in consensus or that you will receive incentive rewards.

<a href="https://learn.radixdlt.com/categories/staking-on-radix?_gl=1*zd2b23*_ga*ODM5MDk4MjgxLjE2OTU4Nzg2Njg.*_ga_MZBXX3HP5Q*MTY5ODI1MzAxOC4xMy4xLjE2OTgyNTg5ODAuNjAuMC4w" target="_blank">Click here for general information about staking and validator participation.</a>

Once running, a validator node offers two interface endpoints on a private port:

The `/core` endpoint can be used to conduct transactions from the node’s account, including validator configuration, registration, and de-registration. The node’s account must hold XRD tokens to pay for network fees on these transactions.

The `/system` endpoint can be used to query aspects of the node and network such as current version, current peers, etc.

### Prerequisites

To register a validator node, you need a Radix full node installed, running, and syncing with the network. If you haven’t yet set one, then please run through one of these guides:

[Installing and Running a Node as a Docker Instance](/docs/docker-compose-mode)

[Installing and Running a Node using SystemD](/docs/systemd-mode)

### Register the node as a validator

Please refer to [Registering a Validator Node](../../build/native-blueprints/validator.md)
