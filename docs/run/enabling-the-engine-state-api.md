---
title: "Enabling the Engine State API"
---

# Enabling the Engine State API

### Introduction

By default the Engine State API is turned on but hidden behind the nginx proxy. The configuration on how to expose this endpoint varies between docker and systemd setups.

#### Nodecli

When using the nodecli a prompt will appear asking to enable the Engine State API when running:

    babylonnode <docker/system> config -m CORE

If the default configurations of this approach are not the desired ones, we recommend to checkout our [guide on additional user configs](guided-setup/installing-node.md#10-advanced-user-config) to avoid overwriting custom settings the next time the config command is executed.

You can find the appropriate configuration values or environment variables in the sections below for systemd/docker-compose respectively.

#### Manual - Docker Compose

To enable the api in docker-compose you need to

- (optional) make sure to update the api with these environment variables if you want to change the port or listen interface

<!-- -->

    services:
      core:
       ...
        env:
          RADIXDLT_ENGINE_STATE_API_PORT: 3336
          RADIXDLT_ENGINE_STATE_API_BIND_ADDRESS: 0.0.0.0

- enable/disable or configure features of the engine state api

<!-- -->

    services:
      core:
        ...
        env:
          RADIXDLT_ENTITY_LISTING_INDICES_ENABLE: <true/false>
          RADIXDLT_DB_HISTORICAL_SUBSTATE_VALUES_ENABLE: <true/false>
          RADIXDLT_STATE_HASH_TREE_STATE_VERSION_HISTORY_LENGTH: 60000

- expose the api through nginx by adding these environment variables to the nginx docker container and use the same port as configured above.

<!-- -->

    services:
      core:
       ...
      nginx:
       ...
        env:
          RADIXDLT_ENGINE_STATE_ENABLE: true
          RADIXDLT_ENGINE_STATE_PORT: 3336 # this is the default

If you have set an admin password. You can now test the api with curl.

    curl -X POST \
      -v -k -u <user>:<password> \
      --header "Content-Type: application/json" \     
      https://localhost:443/engine-state/entity/info \
      --data '{"entity_address": "<ENTER_ANY_ADDRESS>"}' 

#### Manual - Systemd

For systemd the nginx already exposes the engine state by default and the variables for the babylon-node application can usally be found at `/etc/radixdlt/node/default.config`.

The values to configure where the engine_state api is exposed are these:

    api.engine_state.port=3336
    api.engine_state.bind_address=0.0.0.0

To further configure these are the necessary variables:

    db.entity_listing_indices.enable=true
    db.historical_substate_values.enable=true
    state_hash_tree.state_version_history_length=60000
