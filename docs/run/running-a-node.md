---
title: "Running a Node"
---

# Running a Node

## Prerequisites

#### Hardware requirements

To run a reliable, performant node, we suggest that the node’s hardware profile should match or exceed the following specification:

| CPUs | Memory (GB) | Storage(GB) | Network Bandwidth |
|:---|:---|:---|:---|
| 8 | 16 | 500 GB of SSD space (initially) | Recommended at least 100 Mbps |

This is a rough guideline only and each node runner should monitor their node operation to ensure good performance for the intended task.

#### System requirements

The recommended operating system for a production node is <a href="https://releases.ubuntu.com/22.04/" target="_blank">Ubuntu 22.04.2.0 LTS (Jammy Jellyfish)</a>. All our node helper scripts have been tested on this system, as well as all code snippets in this documentation. If you choose to use a different operating system some of our tools might not be available (e.g. the \`babylonnode\` CLI) and you might need to adjust some of the code snippets.

The node software can run on the following platforms:

- darwin-aarch64
- darwin-x86_64
- linux-aarch64
- linux-x86_64
- windows-x86_64-gnu
- windows-x86_64-msvc

Additionally, your platform of choice must be capable of running a **Java SE 17** compatible runtime environment. We recommend using OpenJDK.

## Next steps

In the steps that follow we'll guide you through the process of setting up a Radix Node. There is more than one way to setup a production node, but none is worse that the others.

We have prepared guides for a few most common setups and provided the tools that even further simplify the whole process.  
The whole processes can be divided into 3 "milestones":

1.  Basic node setup (you'll get a fully functional node connected to the network) 
2.  Productionisation (recommended further steps for a production node)
3.   Hardening (recommended further security steps)

For a production node we recommend using one of these two options:

- node process running directly on the host operating system managed by SystemD
- node process running in a Docker container

Our node runner helper application (\`babylonnode\` CLI) was designed to work with both of these setup modes.

Throughout the rest of this guide, in each step we'll consider these two variables:

- Is it a containerized setup (i.e. Docker)?
- Is the user (i.e. you) using our helper CLI application or doing things manually?

Below is a matrix of all productionised setup modes that have been covered in this guide:

<table>
<colgroup>
<col />
<col />
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Description</strong></td>
<td><strong>Primarily uses CLI for setup and management?</strong></td>
<td><strong>Containerized?</strong>****</td>
<td><strong>How is the process managed?<br />
</strong></td>
</tr>
<tr>
<td>Barebones Manual<br />
</td>
<td>No</td>
<td>No</td>
<td>Manually, i.e. you run a script</td>
</tr>
<tr>
<td>Docker w/ CLI</td>
<td>Yes</td>
<td>Yes</td>
<td>With Docker</td>
</tr>
<tr>
<td>Docker Manual (w/o CLI)<br />
</td>
<td>No</td>
<td>Yes</td>
<td>With Docker<br />
</td>
</tr>
<tr>
<td>SystemD w/ CLI</td>
<td>Yes</td>
<td>No</td>
<td>With SystemD units</td>
</tr>
<tr>
<td>SystemD Manual (w/o CLI)<br />
</td>
<td>No</td>
<td>No</td>
<td>With SystemD units<br />
</td>
</tr>
</tbody>


#### The \`babylonnode\` CLI

Before we move on, it's a good time to introduce our node runner helper application: the \`babylonnode\` CLI.  
It is not required to use it, but it can greatly reduce the effort of setting up a node, and thus we recommend doing so. It supports both of our recommended setup modes, that is: SystemD and Docker.

### Next (Optional, but recommended): [Installing the babylonnode CLI](guided-setup/installing-the-babylonnode-cli.md)

### Next next (or just "Next" if skipping the CLI): [Basic node setup](node-setup/basic-node-setup.md)

  

  
