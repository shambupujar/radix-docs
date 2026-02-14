---
title: "Requirements"
---

# Requirements

## Network Gateway - Service Requirements

These system and resiliency requirements are suggestions, for when deploying these services to individual kubernetes pods or equivalent, and may be tuned to the needs of an individual system runner.

### Core API

<table>
<colgroup>
<col />
<col />
<col />
<col />
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Model</td>
<td>vCPU</td>
<td>Memory (GB)</td>
<td>Storage (GB)</td>
<td>Network Bandwidth (Gbps)</td>
<td>Operating System</td>
</tr>
<tr>
<td>c5.2xlarge</td>
<td>8</td>
<td>16</td>
<td><p><a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html" target="_blank">Provision a gp2 storage volume</a>.</p>
<p>You should initially provision 250 GB of SSD space</p></td>
<td>Up to 10</td>
<td><p><a href="https://releases.ubuntu.com/22.04/" target="_blank">Ubuntu 22.04.2.0 LTS (Jammy Jellyfish)</a></p>
<p>You should initially provision 250 GB of SSD space</p></td>
</tr>
</tbody>


### Data Aggregator

Data Aggregator is stateless, with data stored in the PostgreSQL database.

Only a single Data Aggregator should be (for v1) run at any given time. Having two running will cause many failed database writes as they will step on each other.

The Data Aggregator should be configured to restart on failure. There is a health check endpoint available, discussed in [the monitoring guide](../network-gateway/monitoring.md).

The Data Aggregator depends on migrations executed by Database Migrations. Those must be executed before Data Aggregator gets deployed.

Suggested system requirements:

- CPUs: 2

- Memory: at least 4 GiB

### PostgreSQL Database

Suggested system requirements:

- 1 write replicas

- 2 read replicas

- CPUs: 2

- Memory: at least 32 GiB

- Disk size: at least 512 GiB

The database should be deployed resiliently. A managed service such as AWS Aurora is ideal for this.

Read replicas can handle the main query load from the Gateway API; with the read/write primary configured for the Data Aggregator, and for pending transaction status reads and writes from the Gateway API.

### Gateway API

Gateway APIs are stateless, and read data from the PostgreSQL database. 1 or more Gateway APIs can be configured to run against the same database, and may be placed behind a load balancer.

The size of the Gateway API and number of Gateway APIs you require will depend on the load profile you expect.

The following is a suggested requirement for a Gateway API server which is set to auto-scale:

- CPUs: 1

- Memory: at least 1 GiB
