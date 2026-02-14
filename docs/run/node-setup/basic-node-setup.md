---
title: "Basic Node Setup"
---

# Basic Node Setup

## Basic node setup

In this section we'll learn how to actually run a fully functional *Radix Node* connected to the *Radix Network*.

### Node requirements / components

Before we begin setting things up, let's see what's actually required to run a node:

\- **Node Dist Archive**: This is the main node Java application. The distribution archive (zip) contains application JARs as well as all its JAR dependencies. Additionally, the archive contains run scripts that make it easier to start the Java application (\`bin/core\` - for Unix-like systems, \`bin/core.bat\` - for Windows). The archive can be downloaded from <a href="https://github.com/radixdlt/babylon-node/releases">our Github releases page</a>. That's the \`babylon-node-v1.x.y.zip\` file in the release assets (e.g. "babylon-node-v1.0.4.zip").<a href="https://github.com/radixdlt/babylon-node/releases/download/v1.0.4/babylon-node-v1.0.4.zip" class="Truncate"></a>  

\- **Native Library:** This is node's complementary library (written in Rust) that is a natively compiled binary. While *Node dist archive *is the same for all platforms, the *Native library* must be compiled for a specific platform. They too are available on <a href="https://github.com/radixdlt/babylon-node/releases">our Github releases page</a>: \`babylon-node-rust-arch-\<platform\>-release-v1.x.y.zip\`. Depending on the platform of choice, the zip archive contains a \`.so\`, \`.dll\` or a \`.dylib\` file. For example on x86 (64-bit) Linux you should use: \`babylon-node-rust-arch-linux-x86_64-release-v1.x.y.zip\`.

\- **Key Store: Each node on the network must be uniquely identified. Node's identifier (*Node Address*) is derived from an ECDSA (over the \`secp256k1\` curve) key pair, which in turn is stored in an encrypted file: the keystore. Additionally, **for *Validator Nodes, *their** public key is used to associate them with *Validator* (*Component*).**  
**A node must be supplied with a path to the keystore file and its password.**  

\- **Config File: **This is a Java properties file where you configure various aspects of the node. While a default config file is provided, in practice it must almost always be overridden with at least a few custom properties.

### Common steps

Regardless of the setup mode you follow, you'll always need: a *Key Store *and a few common configuration properties in your *Config File* (and, later, a few more mode-specific properties).

#### Generating a *Key Store* manually

#### Creating a base *Config File* manually

#### Generating a *Key Store* and a base *Config File* using the CLI

#### 

### Option 1: Running a node directly on the host system

#### Option 1a) Manually





The \`babylonnode\` CLI can do most of the work in this section for you. If you wish to use it (which we recommend), you can treat this section as an educational read or jump straight to "Option 1b" below.







Without further ado:

1\) Download and unzip the latest *Node Dist Archive *from <a href="https://github.com/radixdlt/babylon-node/releases">our Github releases page</a> (e.g. \`babylon-node-v1.0.4.zip\`).

2) Download and unzip the latest *Native Library *for your system platform (e.g. if you're on 64-bit Linux: \`babylon-node-rust-arch-linux-x86_64-release-v1.0.4.zip\`).

#### Option 1b) Using the babylonnode CLI

  

### Option 2: Running a conteinarized node (Docker)

#### Option 2a) Manually





The \`babylonnode\` CLI can do most of the work in this section for you. If you wish to use it (which we recommend), you can treat this section as an educational read or jump straight to "Option 2b" below.









  

  

**Option 2b) Using the babylonnode CLI**

  

  

  

Next: productionizing

  

  

  

  

  
