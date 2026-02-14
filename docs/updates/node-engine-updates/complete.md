---
title: "Complete"
---

# Complete

**“Cuttlefish” coordinated protocol update** \* Support for [subintents](../../build/dapp-transactions/pre-authorizations-subintents.md) \* Additional native crypto utils for signature validation within Scrypto \* Getters for Account balances \* Throughput improvements

**“Bottlenose” coordinated protocol update** \* New AccountLocker native blueprint, as described [here](../../build/native-blueprints/locker.md). \* New API for reading component owner role from Scrypto \* New substates that expose the current protocol-related parameters \* Add recovery fee vault to AccessController, removing the need for third-party fee locking during the recovery process \* Various improvements to Account and TransactionProcessor native blueprints

**Generic State APIs** Designing and implementing new APIs for reading entity state, aligning with the “system” layer in the engine.

**API performance improvements** Improving the DB locking used in the node with the APIs to improve throughput.

**Tooling/testing refactor & optimizations (first round)** Cleaning up and optimizing various aspects of the test suites, fuzzer, and benchmarking tools, and streamlining the continuous integration process for faster builds. Housekeeping work to speed up future development.

**“Anemone” Coordinated Protocol Update** \* Support for coordinated protocol updates with the Babylon engine \* Correct the creation cost for validators to 100 USD \* Proof GC - decreases storage usage for validators \* Tweaked the Pool native blueprints to improve precision, and improved behavior with non-18 divisibility resources. \* Add basic BLS support to Scrypto \* Allow requesting TimePrecision::Second when requesting the current time in Scrypto

**Coordinated Protocol Updates** Enables validators to signal readiness for a proposed protocol update, and prevent the network from enacting an update until a certain percentage of stake weight has signaled readiness. This allows for quicker uptake of updates without the risk of leaving too much of the validator set behind.

**Runtime Native Pre-compiles** Certain work intensive operations are impractical to execute in WASM due to excessive runtime costs. An expandable native VM supporting packages where important but “worky” operations can be implemented in-engine in Rust, but callable from Scrypto, enables speedy & low-cost execution of these operations.
