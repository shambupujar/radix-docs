---
title: "Releasing"
---

# Releasing

## Network Gateway Releasing

When updating the Network Gateway, we may advise that specific steps are necessary. These steps are documented below.

### Deploy services in order

It is important to deploy new release services in correct order:

1.  Execute Database Migrations. This process completes with zero exit code indicating all migrations, if any, have been executed successfully. Should non-zero exit code be returned deployment procedure must be aborted.

2.  Deploy Data Aggregator and wait for healthy response returned by health check endpoint.

3.  Deploy Gateway API.
