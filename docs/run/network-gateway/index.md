---
title: "Network Gateway"
---

# Network Gateway

## An Introduction to the Network Gateway

### What is the Network Gateway?

The Network Gateway (<a href="https://github.com/radixdlt/babylon-gateway" target="_blank">GitHub</a>) is designed to be the Radix-run publicly exposed gateway into the Babylon Radix network.

The system is in three main parts:

The **Database Migration** sets up PostgreSQL database and applies schema migrations if necessary.

The **Data Aggregator** reads from the Core API of one or more full nodes, ingests from their Core API transaction stream endpoint, and commits transactions to a PostgreSQL database. It also handles the resubmission of submitted transactions, where relevant.

The **Gateway API** provides the public API for Wallets and Explorers. It handles read queries using the database, and proxies transaction preview and submission requests to the Core API of one or more full nodes.

### Running a Network Gateway or similar service

If you wish to perform custom queries on ledger data, or integrate an application against the Radix Network, it would be best to run your own system to compile data from Radix Nodes.

The Network Gateway code forms a reference implementation, and can be deployed directly, forked, or used as a reference to build other systems which integrate with the Core API.

If you wish to deploy a Network Gateway directly, we provide some guidance in the [Setup](setup.md) article.
