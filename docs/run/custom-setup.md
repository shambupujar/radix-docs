---
title: "Custom Setup"
---

# Custom Setup

## Network Gateway - Custom Setup Overview

Before starting with custom setup, read the [Network Gateway architecture and setup overview](network-gateway/setup.md).

### Overview

For high-traffic production systems, these four components (full node/Core API, Data Aggregator, PostgreSQL DB and Gateway API) will need to be set up in a resilient configuration, and monitored.

Depending on your infrastructure provider, there are many ways to deploy these components - so in these docs, we’ll stick to the [recommended requirements for a production setup](node-setup/requirements.md), and explain how the services can be [configured](network-gateway/configuration.md) and [monitored](network-gateway/monitoring.md) so that this can be adapted to your infrastructure requirements.

Radix Publishing Ltd provides the Data Aggregator and Gateway APIs as both:

- Docker containers (see Docker Hub: <a href="https://hub.docker.com/r/radixdlt/babylon-ng-data-aggregator" target="_blank">Data Aggregator</a>, <a href="https://hub.docker.com/r/radixdlt/babylon-ng-gateway-api" target="_blank">Gateway API</a>, <a href="https://hub.docker.com/r/radixdlt/babylon-ng-database-migrations" target="_blank">Database Migration</a>)

- Binaries (see <a href="https://github.com/radixdlt/babylon-gateway/releases" target="_blank">Network Gateway Github Releases</a>)

You can choose to configure / run these as best fits your needs. The Docker containers are ready to be configured and run out of the box, and are recommended as the easiest deployment option. If you choose to run the binaries themselves (say, via systemd), you will need to be set up the server to run an ASP .NET Core app, running in the .NET 7 runtime, and configured with appropriate resiliency, to eg restart on failure.

If [deploying the Grafana / Monitoring stack](setting-up-grafana.md), we would always recommend this is deployed onto a separate host.
