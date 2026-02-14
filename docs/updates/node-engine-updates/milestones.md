---
title: "Node/Engine Updates"
---

# Node/Engine Updates

### Liveness Jailing

Introduce automated mechanisms to temporarily remove validators from the validator set if they consistently fail to meet their network obligations. The system is designed such that well-run nodes which experience unusual problems can quickly get back to validating once their difficulties are resolved, but nodes which repeatedly fail to perform after re-entering the validator set will find themselves jailed for longer and longer periods.

### Node Rust Rewrite

The Node code base is currently written in Java, while the Radix Engine is implemented in Rust. This milestone will unify both to Rust. This move will be accompanied by a host of other improvements and optimizations, to be detailed as work progresses.

### Large Throughput Optimizations

There are several areas in different parts of the stack that have room for optimization, and can be individually addressed based as appropriate at any point in time. This particular milestone is concerned with larger, structural optimizations that can make a significant impact on overall throughput, as network demand rises and it becomes desired.  This work is also a necessary step on the road to the Xi'an release.

### Xi'an Network Upgrade

Xi'an is the next major upgrade to the Radix network.  Xi'an will implement the Cerberus consensus algorithm, enabling linear scalability without sacrificing atomic composability. This is an extraordinarily deep topic with a host of related content. You can get started by reading the <a href="https://radixdlt.com/whitepapers/consensus">original whitepaper</a> on Cerberus, or jump straight to the <a href="http://radixdlt.com/whitepapers/peerreview">peer-reviewed whitepaper</a>.
