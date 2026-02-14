---
title: "Setup with CLI"
---

# Setup with CLI

## Install gateway and core using CLI

Before starting on this, please read the [Network Gateway Setup Overview](../network-gateway/setup.md) to decide what setup you require.

### Introduction

The `babylonnode` CLI tool supports installing a Network Gateway, as well as a full node (AKA core).

All services will be setup to run in docker, except PostgreSQL, which will be setup to run using systemd. This is because, in our experience, running a PostgreSQL docker image has a tendency to hang the docker daemon or make it unresponsive.

This guide will take you through how to setup the full stack with docker and the `babylonnode` CLI.

### 1. Provision the host machines

The first step is to work out which setup and host machine requirements best suite your needs using the [Network Gateway Setup Overview](../network-gateway/setup.md).

Once you have provisioned the required host machines, continue the instructions below.

### 2. Prepare the host machines

This is required only to be run during first time setup on a new host machine.

On each host machine, first [install the CLI](setup-with-cli.md). Then install the dependencies:

``` bash
babylonnode docker dependencies
```

Once the process has completed, you will be asked to log out of your ssh bash session and log back in.

### 3. Configure each host machine

You should only need to do this setup the first time you setup on a host machine. If you’re upgrading, skip to the next step.

First, for each host, you are lead through an interactive prompt to create a `config.yaml` file, which by default is stored at `/home/ubuntu/babylon-node-config/config.yaml`. This config file is then used for future installs and upgrades, to avoid having to remember your settings later.

:::note
KeyStore and PostgreSQL passwords which are created/entered during the config command are written to the generated config.yaml file.
:::




**Single Host**



:::note
Running both full node and Gateway database on the same host is not recommended as it creates IO contention, resulting in a slower ledger sync. Instead, it is recommended to run the database on a separate host from the full node, using one of the other options.
:::


This process will configure the following services onto the single host:

- \[CORE, STATEFUL\] A full node running with docker compose, with its associated ledger store and key store.

- \[GATEWAY, STATELESS\] A Data Aggregator running with docker compose.

- \[GATEWAY, STATEFUL\] A PostgreSQL database, run with systemd.

- \[GATEWAY, STATELESS\] A Gateway API running with docker compose.

- \[CORE & GATEWAY, STATELESS\] An Nginx reverse proxy running with docker compose, providing access to the Core, System and Gateway APIs.

This setup can be achieved by creating a config file using the combined simple `CORE GATEWAY` mode:

``` bash
babylonnode docker config -m CORE GATEWAY
```















**Single Host with separate DB**



This process will configure the following services onto the single host:

- \[CORE, STATEFUL\] A full node running with docker compose, with its associated ledger store and key store.

- \[GATEWAY, STATELESS\] A Data Aggregator running with docker compose.

- \[GATEWAY, STATELESS\] A Gateway API running with docker compose.

- \[CORE & GATEWAY, STATELESS\] An Nginx reverse proxy running with docker compose, providing access to the Core, System and Gateway APIs.

It is assumed that you already have a [PostgreSQL database with sufficient specification](../network-gateway/configuration.md) - either in a separate managed service or on another host; that you can connect to from the host we’re configuring. You will need to provide connection details to this database as part of the config process.

This setup can be achieved by creating a config file using the `DETAILED` mode:

``` bash
babylonnode docker config -m DETAILED
```







**Dual Host**



This process will configure the following services onto the first host:

- \[CORE, STATEFUL\] A full node running with docker compose, with its associated ledger store and key store.

- \[CORE, STATELESS\] An Nginx reverse proxy running with docker compose, providing access to the Core and System APIs.

This process will configure the following services onto the second host:

- \[GATEWAY, STATELESS\] A Data Aggregator running with docker compose.

- \[GATEWAY, STATEFUL\] A PostgreSQL database, run with systemd.

- \[GATEWAY, STATELESS\] A Gateway API running with docker compose.

- \[GATEWAY, STATELESS\] An Nginx reverse proxy running with docker compose, providing access to the Gateway API.

This setup can be achieved by creating a config file using the DETAILED mode, on each host.

``` bash
babylonnode docker config -m DETAILED
```







**Dual Host with separate DB**



This process will configure the following services onto the first host:

- \[CORE, STATEFUL\] A full node running with docker compose, with its associated ledger store and key store.

- \[CORE, STATELESS\] An Nginx reverse proxy running with docker compose, providing access to the Core and System APIs.

This process will configure the following services onto the second host:

- \[GATEWAY, STATELESS\] A Data Aggregator running with docker compose.

- \[GATEWAY, STATELESS\] A Gateway API running with docker compose.

- \[GATEWAY, STATELESS\] An Nginx reverse proxy running with docker compose, providing access to the Gateway API.

It is assumed that you already have a [PostgreSQL database with sufficient specification](../network-gateway/configuration.md) - either in a separate managed service or on another host; that you can connect to from the second host. You will need to provide connection details to this database as part of the config process.

This setup can be achieved by creating a config file using the DETAILED mode, on each host:

``` bash
babylonnode docker config -m DETAILED
```





### 4. Install or update on each host machine

Once the configuration file has been created, run the following on each host:



**Docker mode**



``` bash
babylonnode docker install
```

:::note
1.  **Optional**** **- Use parameter `-f <path to config.yaml>` if the config file is different from the `/home/ubunu/babylon-node-config/config.yaml`.

2.  **Optional** - Use parameter `-a` or `--autoapprove` to run this command without any prompts. It is only recommended for automation purpose.

3.  Use parameter `-u` or `--update` to deploy latest versions of software.
:::






:::note
The configuration file includes a version number. If the CLI is updated to use a new configuration version, it may prompt you to manually migrate the configuration file to the new version. Instructions to perform this manual migration will live in the release notes of the CLI.
:::


### 5. Set passwords for nginx reverse proxy

The full node’s Core API and System API; and the Network Gateway’s Gateway API, are both protected by nginx. If Core and Gateway are on the same host, they share a single nginx, otherwise, the full node and Gateway API will have separate nginx instances on each host.

Nginx runs bound to http on port 80, and https on port 443 - note that the certificates it exposes for https are self-signed.

When you run setup, you can select which endpoints are protected by HTTP basic auth. A number of users are setup for you, with each user protecting different sets of endpoints:

- `gateway` - For Gateway API endpoints

- `admin` - For low-risk node endpoints, not designed to be public-facing (Core/System API)

- `superadmin` - For high-risk node endpoints, that should under no circumstances be exposed publicly (Core/System API)

- `metrics` - For the node, Data Aggregator and Gateway API metrics endpoints

For more details on these endpoints, see the [api specification docs](../../integrate/network-apis/index.md).

By default, a random password is generated for each user and output by the CLI, but this can be updated using the following CLI commands. Ensure you update the relevant password on each host that runs nginx:

``` bash
babylonnode auth set-gateway-password --setupmode DOCKER
babylonnode auth set-admin-password --setupmode DOCKER
babylonnode auth set-superadmin-password --setupmode DOCKER
babylonnode auth set-metrics-password --setupmode DOCKER
```

### 6. Make sure the gateway is running

The gateway status can be checked by running the below command.

``` bash
curl --request GET --insecure --user "gateway:$NGINX_GATEWAY_PASSWORD" https://localhost/gateway
```

It should return a response like shown below:

``` json
{
  "network_identifier": {
    "network": "mainnet"  // #1
  },
  "gateway_api": {
    "version": "1.1.7",
    "open_api_schema_version": "1.1.6"
  },
  "ledger_state": {
    "version": 54523000,  // #2
    "timestamp": "2022-02-09T05:12:20.749Z",
    "epoch": 5389,
    "round": 9987
  },
  "target_ledger_state": {
    "version": 89039430  // #3
  }
}
```

The key values in the above response are:

1.  `gateway.network_identifier.network` would be pointing to the right network. For mainnet, this should be mainnet

2.  `ledger_state.version` is the ledger transaction number that your GATEWAY has synced up to. If this value is close to `target_ledger_state.version` then the GATEWAY is synced up.

3.  `target_ledger_state.version` is the latest ledger transaction number that the connected CORE node can see on the network.

### 7. Setting up Monitoring

Monitoring can be set up on the same host as an existing setup, or on another host. It also includes a database, so can cause increased IO contention. For that reason, we’d recommend running it on a separate host, with connections to the other hosts.

Please see [this guide for setting up the Grafana Monitoring stack](../setting-up-grafana.md).
