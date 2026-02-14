---
title: "Setup"
---

# Setup

## Network Gateway Setup Overview

### Architecture Overview





Architecture Overview




A Network Gateway deployment consists of the following services:

- One or more Radix Nodes, in their Full Node configuration, with the transaction endpoint of the Core API enabled.

- A single<sup>\[1\]</sup> (Network Gateway) Data Aggregator.

- A PostgreSQL Database

- One or more (Network Gateway) Gateway APIs

These services may be spread between one or more hosts, depending on the deployment approach.

### Choosing the right setup

:::note
For any setup used in production, we would recommend full stack redundancy - running two stacks in parallel - a production stack, and a backup stack. The backup stack can be swapped to if the production stack hits any issues.

At update time, the backup stack can be updated first as a trial, and then swapped out with the production stack, which can then be upgraded.
:::


Depending on your use case, we recommend different setups:



**Local development/testing**



If you just want to try running a stack, without needing it fully synced, you may run a full stack locally following the **Local Development** deployment approach tab below. This may cause your machine to run slowly, and will take a long time to fully sync. It runs Network Gateway services and PostgreSQL database as docker containers.

If you require working against a fully synced Gateway, we recommend creating a cloud hosted deployment of the whole stack, and developing against that. See the **Internal-facing**, **low-medium traffic** tab for more details.







**Internal-facing, low-medium traffic**



For low-medium traffic levels (10-50 Gateway API requests per second, depending on database host and request type), deploying a single copy of each service should be sufficient (with a whole parallel stack for production redundancy).

- If sluggish system performance during sync is acceptable, you can attempt running a full stack on a single, well-provisioned host. For host requirements, see the **Single Host** tab below.

- The first optimization we’d recommend is having a separate host for the Gateway Database, ideally a managed PostgreSQL database service. This reduces IO contention between the full node and the Gateway. For host requirements, see the **Single Host with separate DB** tab below.

- You can also achieve this by running the full node on one host, and the rest of the Gateway stack (including the PostgreSQL database) on a second host. For host requirements, see the **Dual Host** tab below.

- For best performance, we’d recommend deploying the full node onto one host, the stateless Gateway services onto a second host, and use an additional dedicated database host, or managed database service. For host requirements, see **Dual Host with separate DB** tab below.

For the deployment approach, you can consider the CLI (recommended) or Custom options, in tabs below.







**High traffic**



For high traffic (\> 50 Gateway API requests per second), scalable or public-facing loads, we recommend a setup using kubernetes or any other high availability scalable orchestration.

This would include:

- Two full nodes

- A single data aggregator

- A dedicated host or replica set for the PostgreSQL database

- An auto-scaling group of Gateway APIs behind a load balancer

For host requirements of the pods, see the **Kubernetes** tab below.

For the deployment approach, see the **Custom** option, in a tab below.





### Host Requirements

Whatever your setup, we’d also recommend [deploying the Grafana / Monitoring stack](../setting-up-grafana.md), which should be deployed onto a separate host.



**Single Host**



:::note
- This setup runs both CORE and GATEWAY on the same machine. This setup is not recommended as it creates IO contention, resulting in a slower ledger sync. Instead, it is recommended to use another deployment option.

- For optimal performance, we’d recommend running PostgreSQL using systemd or using a separate database on a dedicated host. If run in a docker image, PostgreSQL has a tendency to consume all available resources, and may make the docker daemon sluggish or unresponsive. This is particularly bad whilst syncing.
:::


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
<td>Storage(GB)</td>
<td>Network Bandwidth (Gbps)</td>
<td>Operating System</td>
</tr>
<tr>
<td>c5.4xlarge</td>
<td>16</td>
<td>32</td>
<td><p><a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html" target="_blank">Provision a gp2 storage volume</a>.</p>
<p>You should initially provision 500 GB of SSD space</p></td>
<td>Up to 10</td>
<td><a href="https://releases.ubuntu.com/22.04/" target="_blank">Ubuntu 22.04.2.0 LTS (Jammy Jellyfish)</a></td>
</tr>
</tbody>








**Single Host with separate DB**



**CORE and GATEWAY:**

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
<td>Storage(GB)</td>
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


GATEWAY DB:

See the dedicated [Network Gateway service requirements](../node-setup/requirements.md) for the suggested Gateway DB requirements.







**Dual Host**



:::note
For optimal performance, we’d recommend running PostgreSQL using systemd or using a separate database on a dedicated host. If run in a docker image, PostgreSQL has a tendency to consume all available resources, and may make the docker daemon sluggish or unresponsive. This is particularly bad whilst syncing.
:::


**CORE:**

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
<td>Storage(GB)</td>
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


**GATEWAY:**

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
<td>Storage(GB)</td>
<td>Network Bandwidth (Gbps)</td>
<td>Operating System</td>
</tr>
<tr>
<td>c5.4xlarge</td>
<td>16</td>
<td>32</td>
<td><p><a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html" target="_blank">Provision a gp2 storage volume</a>.</p>
<p>You should initially provision 600 GB of SSD space</p></td>
<td>Up to 10</td>
<td><a href="https://releases.ubuntu.com/22.04/" target="_blank">Ubuntu 22.04.2.0 LTS (Jammy Jellyfish)</a></td>
</tr>
</tbody>








**Dual Host with separate DB**



**CORE:**

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
<td>Storage(GB)</td>
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


**GATEWAY:**

See the dedicated [Network Gateway service requirements](../node-setup/requirements.md). You will want to combine Data Aggregator and Gateway API requirements, as these will be deployed onto the same host. Both of these services are stateless.

**GATEWAY DB:**

See the dedicated [Network Gateway service requirements](../node-setup/requirements.md) for the suggested Gateway DB requirements.







**Kubernetes**



See the [dedicated Network Gateway service requirements](../node-setup/requirements.md) for requirements by service / pod.





### Deployment Approach



**Local Development**



If you are looking to run a local system for development of integrations with a Network Gateway, you can see the <a href="https://github.com/radixdlt/babylon-gateway/tree/v1.0.0/deployment" target="_blank">documentation on running a toy local environment</a> which runs the full stack in docker compose on a single machine.

This setup isn’t designed for production workloads, and so defaults to running against stokenet.







**CLI**



This runs the node and gateway on Ubuntu hosts, with the option of connecting to an external PostgreSQL Database.

See [setting up the network gateway using the CLI](../node-setup/setup-with-cli.md) for more information.

The CLI configures the Gateway with sensible default configuration. If you’d like to have more ability to configure your Gateway, you may need to instead [deploy and configure a custom network gateway.](../custom-setup.md)







**Custom**



See [setting up a custom network gateway](../custom-setup.md).





------------------------------------------------------------------------

1\. For v1, only a single Data Aggregator is supported. In future versions, we hope to add support for allowing deployment of multiple Data Aggregators, which will configure themselves as a primary and 0 or more secondaries, ready for hot failover if required
