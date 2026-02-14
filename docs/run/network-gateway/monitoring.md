---
title: "Monitoring"
---

# Monitoring

## Network Gateway Monitoring

:::note
We recommend [installing a Grafana Dashboard](../setting-up-grafana.md) to help monitor your node and gateway.
:::


The rest of this article explains more detail about the gateway logging configuration, and the various metrics exposed by the gateway.

### Logs

Logging configuration follows the <a href="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/logging/?view=aspnetcore-6.0#dnrvs" target="_blank">ASP.NET paradigms</a>.

In particular, both the log levels and the logger can be configured in the configuration.

By default, a simple one-line console logger is used in development, and a JSON logger is used in production. These can be configured further in the `app configuration`, as per the <a href="https://docs.microsoft.com/en-us/dotnet/core/extensions/console-log-formatter" target="_blank">ASP.NET guidance</a> - eg this is done in the <a href="https://github.com/radixdlt/babylon-gateway/tree/v1.0.0/deployment" target="_blank">deployment folder</a> for optimizing log readability in Docker.

An example of configuring for the systemd console logger is given below.

``` bash
{
    "Logging": {
        "Console": {
            "FormatterName": "systemd",
            "FormatterOptions": {
                "IncludeScopes": true,
                "UseUtcTimestamp": true,
                "TimestampFormat": "yyyy-MM-ddTHH\\:mm\\:ss.fff\\Z "
            }
        }
    }
}
```

### Health Checks

The Data Aggregator and Gateway API have a health check configured on their main ASP .NET url: `/health` will return a 200 status if all health checks pass, or a 500 if one of more health checks fail.

This can be integrated with Kubernetes or other health checking systems.

The Data Aggregator has a health check to check for database connectivity, and a custom health check to check for either recent start-up (with 10 seconds) or a ledger extension in the last 20 seconds (this can be configured with the `Monitoring.UnhealthyCommitmentGapSeconds` parameter). The Gateway API has a health check for each of its Database connections.

The health check endpoint will come up after the service loads. For the Data Aggregator, the migrations run before the health check is up, so we recommend the migrations run separately if they are slow-running, see [releasing](releasing.md) for more information.

### Prometheus Metrics

The Network Gateway services export metrics in Prometheus format, via metric endpoints; to be picked up by Prometheus.

The default endpoints are:

- Data Aggregator - <a href="http://localhost:1234">http://localhost:1234</a>

- Gateway API - <a href="http://localhost:1235">http://localhost:1235</a>

But these can be changed with the configuration variable `PrometheusMetricsPort`.

#### Metric Types

Metrics fall into a number of groupings, separated out by distinct prefixes.

These are metrics provided by libraries:

- dotnet\_\* - Metrics about the runtime (eg threadpool, known allocated memory)

- process\_\* - Metrics about the process (eg process threads, process memory)

- http_request\_\* and http_requests\_\* - Metrics about controller actions

- httpclient\_\* - Metrics about requests that the service makes to upstream services (is the full nodes)

- aspnetcore\_\* - Metrics related to <a href="http://ASP.NET">ASP.NET</a> core (eg healthcheck status)

There are custom metrics, all prefixed by ng\_ (for network gateway):

- ng_aggregator\_\* - metrics about aggregator status

- ng_node_fetch\_\* - metrics about fetching data from a node

- ng_ledger_sync\_\* - metrics about syncing the ledger from full nodes

- ng_ledger_commit\_\* - metrics about committing the agreed ledger to the database

- ng_node_ledger\_\* - metrics about the ledger / state of the full node/s (with node label)

- ng_node_mempool\_\* - metrics about full node mempool/s (or the combination of them)

- ng_db_mempool\_\* - metrics about the MempoolTransactions in the database

- ng_construction_transaction\_\* - metrics relating to construction, submission or resubmission

Each service also exposes a /metrics endpoint, at a separate port to the health check / main APIs. This port can be changed with the `PrometheusMetricsPort` configuration, defaulting to `1234` for the Data Aggregator and `1235` for the Gateway API.

Many custom metrics are available which can be used for a comprehensive dashboard. The metrics should include a description to explain how they can be interpreted.

The various metrics are documented inline, which can be seen by going to the /metrics endpoint in your browser, or in prometheus.

#### Alerting

Alerting should align with your monitoring requirements. The thresholds below may need adjusting for your use case.

Some suggested alerts are below:

|  |  |  |
|:---|:---|:---|
| Importance | Explanation | Possible Alerting Criteria |
| High | MoreThanOnePrimary - More than one primary data aggregator (this can cause high levels of errors with both Data Aggregators trying to do the same thing) | `sum(ng_aggregator_is_primary) != 1` |
| High | HighTimeSinceLastLedgerCommit - The DB ledger hasn’t been updated in the last minute | `time() - ng_ledger_commit_last_commit_timestamp_seconds{container="data-aggregator"} > 60` |
| Medium | Resubmission Queue Backlog - This might indicate that resubmissions are delayed | `ng_db_mempool_transactions_needing_resubmission_total{container="data-aggregator"} > 100` |
| Medium | FailingDataAggregatorHealthChecks | `sum(aspnetcore_healthcheck_status{container="data-aggregator"}) >= 1` |
| Medium | FailingGatewayAPIHealthChecks | `sum(aspnetcore_healthcheck_status{container="gateway-api"}) >= 1` |

Depending on your use cases, you may also wish to configure alerting on transaction submission or resubmission errors, possibly making use of some of the following metrics:

- `ng_construction_transaction_submission_request_count`, `ng_construction_transaction_submission_success_count` and `ng_construction_transaction_submission_error_count`

- `ng_construction_transaction_resubmission_attempt_count`, `ng_construction_transaction_resubmission_success_count` and `ng_construction_transaction_resubmission_error_count`
