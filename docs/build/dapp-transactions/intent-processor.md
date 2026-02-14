---
title: "Intent Processor"
---

# Intent Processor

The intent process (previously known as the transaction processor) is responsible for running transactions, by interpreting an Intent [Manifest](../learning-step-by-step/create-and-use-transaction-manifests.md) and execution the commands it contains.

When the Radix Engine executes transactions, each intent has its own call stack, and the Intent Processor is the top call-frame of that stack - this is often referred to as the "Transaction Layer".

## Features of the Transaction Layer

Transaction manifests orchestrate the movement of resources between components. This includes accounts, which are also components (that only their owner may withdraw from), and other [intents](intent-structure.md) in the transaction. This is done through a sequence of instructions using a special instruction set created specifically for this purpose (transaction manifests do not use Scrypto). Radix Engine processes these instructions in order, and if any step fails for any reason, the entire transaction fails and none of the steps are committed to the ledger on the Radix network. This is what is meant by the transaction being "atomic".

Execution of a given transaction can be thought of as happening at its own "layer", above any components that are called during the transaction. This layer has some special features that make transaction manifests quite powerful.

### The Worktop

The most common instruction in a transaction manifest is a component call. Each call to a component can include data and buckets of resources, and each component may then return resources.

The transaction layer itself must include a way of managing resources between component calls. For this, we introduce the worktop.

Each transaction has a worktop that is a place that resources may be held during the transaction execution. Resources returned from component calls are automatically put onto the worktop. From there, the manifest may specify that resources on the worktop be put into buckets so that those buckets may be passed as arguments to other component calls.

The manifest may also use `ASSERT` commands to check the contents of the worktop, causing the entire transaction to fail if not enough of the checked resource is present. This is useful to guarantee results of a transaction, even if you may be unsure of what a component may return.

Of course we know that all resources must be in a vault by the end of any transaction, so the transaction manifest creator must ensure that no resources are left hanging around the worktop or in buckets by the end of the manifest’s steps.

### The Authorization Zone

Another key concept is the authorization zone. The Authorization Zone acts somewhat similar to the worktop, but is used specifically for authorization. Rather than holding resources, the authorization zone holds proofs.

A proof is a special object that proves the possession of a given resource or resources. When a component method or blueprint function is called by the transaction manifest, the proofs currently in the transaction’s authorization zone are automatically used to validate against the authorization rules defined in that method/function’s role assignments. If this check fails, the transaction is aborted.

Proofs can enter the auth zone from two places:

- Signatures on the transaction are automatically added to the authorization zone as "virtual signature proofs". This, for example, is how you are able to call the withdraw method on a pre-allocated account component which is still set up to require a proof of a signature with its corresponding public key hash.

- Proofs can also be returned by calls to methods. They are automatically added to the authorization zone by the [transaction processor](/v1/docs/transaction-processor).

For more about proofs and authorization, please see the [Authorization model](../authorization/index.md).
