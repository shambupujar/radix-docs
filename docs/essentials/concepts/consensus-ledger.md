---
title: "Consensus & Ledger"
---

# Consensus & Ledger

The Babylon Radix Network uses HotStuff BFT - with a decentralized validator set. This process has deterministic finality: commits are final and there are no probabilistic forks in the ledger.

Unlike most blockchains, the transaction stream is **not** separated into distinct blocks. Rather, the Babylon Radix ledger is a chain of **transactions**, broken into **epochs**. Each epoch lasts approximately 5 minutes.

Transactions are given a “(resultant) **state version**” which starts at 1 and effectively acts as an auto-incrementing primary key for the committed transaction stream (with no gaps).

If for your integration you need a **block hash** or **block index**, you should consider using a given transaction’s (resultant) **state version** instead.

Consensus operates on a tree of vertices, but these vertex boundaries effectively disappear once committed. Instead, the ledger is a stream of committed transactions, with signed “proofs” pointing at the last transaction in each vertex. A node does not need to keep all of these proofs - although will definitely keep the proofs marking the end of each epoch.

The validator set is fixed for each epoch, but may change at an epoch boundary. Assuming the validator set has always been trusted, by starting from the genesis epoch proof, this chain of epoch proofs can be quickly used to verify who the current validator set is, to verify current ledger proofs.

Babylon Radix Network includes a 2-tier Jellyfish Merkle Tree and epoch-based Transaction Payload and Transaction Receipt Merkle-Trees, which can be used to verify the system state and transaction outcomes respectively.
