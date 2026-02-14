---
title: "Node Setup"
---

# Node Setup

## Introduction

Welcome to the Radix node installation guide! Before we begin, let’s take a look at a high-level overview of the whole process. Please read [Node Introduction](../overview.md) first, if you haven’t done so yet.

#### Process overview

A complete node setup can be broken down into the following steps:

1.  **Installing the node software, running it and connecting to the network**  
    This is the heart of the process that gets you a fully functional Radix node.

2.  **Strengthening your node’s security**

    This includes, among other things, setting up an nginx proxy for your node’s APIs.

3.  **Learning how to monitor your node’s health and perform simple administrative tasks**

4.  **(Optional) Advanced monitoring, optimization and configuration**

    A node can be configured in a number of ways to suit different purposes (e.g. it might enable some additional indices). We discuss some of the possibilities later in this guide.

5.  **(Optional) Running additional software**

    A few additional applications can be installed and connected to a running node, e.g.:

    - an advanced indexer with rich query capabilities: <a href="https://github.com/radixdlt/babylon-gateway" target="_blank">Network Gateway</a>

    - a Grafana dashboard

6.  **(Optional) Registering as a Validator**

    Only for node runners who wish to become validators. Make sure you have a good understanding [of what a validator node is](../overview.md) before engaging in this step.

In the first part of this guide we’ll focus on the top three items from above list as they’re typically done together.

#### Node components

Before we begin, let’s also take a look at the key components of a node. Each node consists of:

- The primary software package: a zip file containing the Java application and all its dependencies (that’s the `babylon-node-va.b.c.zip` file on our <a href="https://github.com/radixdlt/babylon-node/releases" target="_blank">Releases Page</a>)

- An additional native library - a piece of compiled software written in Rust (`babylon-node-rust-arch-<arch>-release-va.b.c.zip` file on our <a href="https://github.com/radixdlt/babylon-node/releases" target="_blank">Releases Page</a>). Unlike the Java application, a different version of the native library is needed depending on the target system architecture

- A file containing node’s cryptographic key used to uniquely identify the node on the network (keystore file)

- A configuration file (depending on the setup mode, this could either be a Java properties file or a set of environment variables)

- A directory where the node can store its files (which include a complete ledger, any additional indices, etc)

Depending on the setup mode of your choice (described below) you’ll need to install/configure some of these things manually, while others will be taken care of for you.

#### Radix networks

There are two public Radix networks available that your node can connect to: the main/real network (Mainnet) and a public test network (Stokenet). Once you connect to one of them, your node can’t switch to the other, unless you reconfigure the node and point it to a fresh data directory. As you follow the tutorial, at some point you’ll be presented with a choice as to which network to setup your node for.

:::note
Radix Foundation controls the Stokenet (testnet) stake distribution and which nodes are in the Active Validator Set. If you wish to setup a validator node and test its operation as an Active Validator, you can request that your node is staked XRD so that it can join the validator set. You can do so on the \#stokenet-requests channel on our Discord server.
:::


## **Prerequisites**

#### **Hardware requirements**

To run a reliable, performant node, we suggest that the node’s hardware profile should match or exceed the following specification:

|  |  |  |  |
|:---|:---|:---|:---|
| **CPUs** | **Memory** | **Storage** | **Network Bandwidth** |
| 4 | 16 GB | 500 GB of SSD space (initially) | Recommended at least 100 Mbps |

This is a rough guideline only and each node runner should monitor their node operation to ensure good performance for the intended task.

#### **System requirements**

The recommended operating system for a production node is <a href="https://releases.ubuntu.com/22.04/" target="_blank"><u>Ubuntu 22.04.2.0 LTS (Jammy Jellyfish)</u></a>. All our node helper scripts have been tested on this system, as well as all code snippets in this documentation. If you choose to use a different operating system some of our tools might not be available (e.g. the `babylonnode` CLI) and you might need to adjust some of the code snippets.

The node software can run on the following platforms:

- darwin-aarch64

- darwin-x86_64

- linux-aarch64

- linux-x86_64

- windows-x86_64-gnu

- windows-x86_64-msvc

Additionally, your platform of choice must be capable of running a **Java SE 17** compatible runtime environment. We recommend using OpenJDK.

#### Cloud instance recommendations

We’re assuming that you’re comfortable provisioning a cloud service instance and installing basic tools (Git, Docker) on it. You’ll also need a working knowledge of Git, and the UNIX command line.

AWS provisioning is beyond the scope of this doc, but there are plenty of resources dotted around the web which will help you to<a href="https://docs.aws.amazon.com/index.html?nc2=h_ql_doc_do" target="_blank">get started</a>.





Example instance configuration for AWS



|  |  |  |  |  |  |
|:---|:---|:---|:---|:---|:---|
| Model | vCPU | Memory | Storage | Operating System | Network Bandwidth |
| m6i-xlarge | 4 | 16 GB | <a href="https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html" target="_blank">Provision a gp2 storage volume</a>. You should initially provision 500 GiB of SSD space. | <a href="https://releases.ubuntu.com/22.04/" target="_blank">Ubuntu 22.04.2.0 LTS (Jammy Jellyfish)</a> | Up to 10 Gbps |







## Choosing the installation mode

On the next pages we'll guide you through the process of setting up a Radix node. There is more than one way to setup a production node. Choose the one that best suit your needs:

#### Guided Mode (Recommended)

In this mode, you’ll use our Python CLI tool (\`babylonnode\`) for a straightforward, guided installation of a Radix node on an Ubuntu host. We recommend this method for most people. This process works best on a fresh, dedicated machine (e.g. cloud instance).  
`babylonnode` is a versatile tool that can not only assist in setting up a node and related tools, but also helps to manage it afterwards.

<a href="/v1/docs/node-setup-guided"><strong>Proceed to Guided Mode docs</strong></a>

#### Manual (Advanced) Setup with Docker

This section will guide you through a manual (i.e. without using the `babylonnode` CLI tool) setup where the node and related tools (e.g. nginx) are running inside Docker containers on a host machine.

<a href="/v1/docs/node-setup-docker" target="_blank"><strong>Proceed to Manual Setup with Docker docs</strong></a>

#### Manual (Advanced) Setup with systemd

This section will guide you through a manual (i.e. without using the `babylonnode` CLI tool) setup where the node and related tools (e.g. nginx) are running directly on a host machine. The processes will be managed by systemd. This method is suitable for those who want the most hands-on approach, and may be a useful reference for those figuring out installation on different operating systems.

<a href="/v1/docs/node-setup-systemd"><strong>Proceed to Manual Setup with systemd docs</strong></a>
