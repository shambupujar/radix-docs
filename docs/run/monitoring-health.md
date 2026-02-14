---
title: "Monitoring & Health"
---

# Monitoring & Health

Radix node provides the System API that can be used to monitor its health.

You can query **your own node** at these endpoints to get various kinds of data about the the operation of the node. The easiest way to call the endpoints is through the `babylonnode` script (see [Installing the babylonnode CLI](guided-setup/installing-cli.md) for more information), but you can also use `curl`, for example.

### The /health endpoint

The most basic check on your node’s health is ensuring that it is running and syncing with the network. This is what the `/health` endpoint is used for. Execute the following command to check the status of your node:



**babylonnode**



``` bash
babylonnode api system health
```







**curl**



``` bash
curl -k -u admin:nginx-password "https://localhost/system/health"
```





The call returns a simple status message that is easy to check and monitor, like this:

``` json
{
  "status": "UP",
  ...
}
```

The status message will be one of the following codes:

- *BOOTING_PRE_GENESIS*the node is booting and not ready to accept requests

- *SYNCING*the node is catching up the network

- UP the node is in sync with consensus

- OUT_OF_SYNC the node is out of sync

:::note
Refer to [Health and Metrics](../build/scrypto/logging.md) documentation for more details on monitoring node’s health.
:::


### The /prometheus/metrics endpoint

The `/metrics` endpoint provides a wealth of performance and operational data. While it can be queried directly, it is designed for use with monitoring and alerting dashboards, such as <a href="https://grafana.com/" target="_blank">Grafana</a>, and so provides its data in the [Prometheus data format](https://prometheus.io/docs/instrumenting/exposition_formats/#text-based-format).

Radix provides a convenient [Grafana monitoring dashboard installation through the babylonnode CLI](setting-up-grafana.md).
