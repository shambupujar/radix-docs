---
title: "Configuration"
---

# Configuration

## Network Gateway Configuration

### App Configuration

The Data Aggregator and Gateway APIs are ASP .NET Core 7 services, and can be configured using the <a href="https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-7.0" target="_blank">ASP .NET Core configuration paradigm</a>, with some slight tweaks.

- JSON App settings should be provided in a `appsettings.Production.overrides.json` in the app’s run directory.

- Environment variables to provide configuration values for the Data Aggregator may be prefixed with `DataAggregator__` to disambiguate from other environment variables

- Environment variables to provide configuration values for the Gateway API may be prefixed with `GatewayApi__` to disambiguate from other environment variables

- If you wish to provide JSON App settings from a location other than the app’s run directory, you can use the environment variable `CustomJsonConfigurationFilePath` to point at a JSON file somewhere else in the system, from which settings can be read (assuming the user running the service has access to this file).

The recommended approach is to use JSON to configure the application, but provide any secrets as environment variable overrides.

The configuration works on a priority basis, with configuration at a higher priority overriding any configuration at a lower priority. From lowest to highest priority, these are:

- Variables provided in the application code as defaults

- Configuration in the `appsettings.json` file (provided by the application)

- Configuration in the `appsettings.Production.json` file (provided by the application)

- Configuration from environment variables

- Configuration from environment variables with the relevant app prefix `DataAggregator` or `GatewayApi`

- Configuration provided by command line parameters

- Configuration in the `appsettings.Production.overrides.json` file (optionally provided by the user running the application)

- Configuration in the JSON file at `CustomJsonConfigurationFilePath` (optionally provided by the user running the application)

:::note
At v1, configuration provided in `appsettings.Production.overrides.json` or `CustomJsonConfigurationFilePath` <a href="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-6.0#json-configuration-provider" target="_blank">overrides the environment variables</a>. This may be adjusted in future versions. For now, we’d advise not relying on this priority ordering, and not specifying any values in the JSON documents which should be provided by environment variables.
:::


Default configuration for reference can be seen on github in the various JSON files for the <a href="https://github.com/radixdlt/babylon-gateway/tree/v1.0.0/apps/DataAggregator" target="_blank">Data Aggregator</a> and <a href="https://github.com/radixdlt/babylon-gateway/tree/v1.0.0/apps/GatewayApi" target="_blank">Gateway API</a>.

### Common Configuration

#### Core API / Full Node Connections

Both the Data Aggregator and Gateway API will need to be configured to read from one or more Core APIs. These can be configured to live in the same private network, or can be configured to communicate over the internet, although we advise that the Core API is not designed to be publicly exposed.

See the [Radix Node Setup](../node-setup/index.md) guide for further information on running the Radix Nodes.

In terms of Network Gateway configuration, the connection details for the Core API/s can be configured in the `CoreApiNodes` array, each element of the array should configure a single Core API full node, and look like:

``` plainText
    {
        "Name": "<Name of Node>",
        "CoreApiAddress": "<Address of the Core API>",
        "Enabled": true
    }
```

The `CoreApiAuthorizationHeader` property can be added to this configuration object for each node, to use with Basic Authentication (say, provided by the default nginx configuration of a production node). This is likely a secret, so can be provided via an environment variable, eg

`DataAggregator__Network__CoreApiNodes__0__CoreApiAuthorizationHeader` - where the `0` is replaced by the index of the CoreApiNode you wish to configure. The Authorization header value for basic auth is `Basic <X>` where `<X> = base64("USERNAME:PASSWORD")`.

If absolutely necessary, `"DisableCoreApiHttpsCertificateChecks": "true"` can be provided in the root configuration (eg `DataAggregator__Network__DisableCoreApiHttpsCertificateChecks`) to disable certificate checks if self-signed certificates are used.

For advanced configuration, the Core API Node object also supports <a href="https://github.com/radixdlt/babylon-gateway/tree/v1.0.0/apps/DataAggregator" target="_blank">further options in the Data Aggregator</a>, and some <a href="https://github.com/radixdlt/babylon-gateway/tree/v1.0.0/apps/GatewayApi" target="_blank">further options in the Gateway API</a>.

#### Database Connections

The Network Gateway and Gateway API are configured to talk to the PostgreSQL database via <a href="https://www.npgsql.org/doc/connection-string-parameters.html" target="_blank">Npgsql connection strings</a>.

In each of DataAggregator and GatewayAPI, there are two settings to provide:

- `ConnectionStrings.NetworkGatewayReadWrite` in the JSON, or `ConnectionStrings\__NetworkGatewayReadWrite` as an environment variable - which is used by the DataAggregator for writing ledger state during sync, and is used for reading and writing data about transactions submitted through the Gateway API.

- `ConnectionStrings.NetworkGatewayReadOnly` in the JSON, or `ConnectionStrings__NetworkGatewayReadOnly` as an environment variable - which is used for read only queries about ledger state, mostly in the Gateway API. For single database deployments, the `NetworkGatewayReadOnly` can match the `__NetworkGatewayReadWrite`.

The connection string/s will contain secrets, so it will likely be easier to provide them as environment variables.

### Data Aggregator Configuration

There are many configuration options, which can be seen <a href="https://github.com/radixdlt/babylon-gateway/tree/v1.0.0/apps/DataAggregator" target="_blank">in code</a>, but notably the following many commonly wish to be adjusted by other runners of the Data Aggregator:

- `CommitRequiresNodeQuorumTrustProportion` - this configures the proportion of sufficiently synced full nodes which must be seen to agree before committing to the database. Setting to 1 requires all sufficiently synced up nodes to return before committing.

- `MempoolConfiguration.TrackTransactionsNotSubmittedByThisGateway` can be set to `false` to disable tracking of pending transactions not submitted through the Gateway, which will reduce the resource and data requirements of the Data Aggregator during network congestion.

The port used for health checks can be configured using <a href="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/servers/kestrel/endpoints?view=aspnetcore-6.0" target="_blank">standard Kestrel configuration</a>.

### Gateway API Configuration

There are many configuration options, which can be seen <a href="https://github.com/radixdlt/babylon-gateway/tree/v1.0.0/apps/GatewayApi" target="_blank">in code</a>, but notably the following many commonly wish to be adjusted by other runners of the Gateway API:

- `AcceptableLedgerLag.ReadRequestAcceptableDbLedgerLagSeconds` and `AcceptableLedgerLag.ConstructionRequestsAcceptableDbLedgerLagSeconds` configure the threshold before stale data results in the API returning a NotSyncedUpError, if the DataAggregator isn’t sufficiently synced up, and the Database is over this threshold behind consensus.

- `EnableSwagger` - If the service is enabled privately, you can turn on this option to enable an easy web interface for interacting with the API at `/swagger`

The port/address which is used for the Gateway API can be configured using <a href="https://docs.microsoft.com/en-us/aspnet/core/fundamentals/servers/kestrel/endpoints?view=aspnetcore-6.0" target="_blank">standard Kestrel configuration</a>.
