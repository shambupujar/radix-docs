---
title: "Transactions on Radix"
---

# Transactions on Radix

On other smart contract platforms, transactions are typically a one-trick pony: sending a method call to a smart contract. The result of that call is some combination of updating the smart contract’s internal state and often invisibly calling methods on other contracts to coordinate some state changes. The sequence of steps is locked-in; all your transaction can do is pick an entry point and the rest is out of your hands.

On Radix, transactions describe a series of calls to different on-ledger components, passing data and resources between them. This sequence of calls is called a **transaction manifest**, and it describes exactly the steps that must occur in order for the transaction to complete successfully. This composition of various on-ledger items is atomic—either *everything* happens together, or *nothing* happens. There's no chance of a transaction executing only a subset of the steps and leaving you with an unexpected half-way result.

Transaction manifests support **user-defined guarantees**, added by client tools (like a wallet), which provide network assurance that outcomes will be as expected. There is no need for components to build in handling for things like slippage and sandwich trading...on Radix that's all handled at a higher layer, and the user is in control.

Builders of web sites which integrate the use of multiple different components do not need to deploy any code in order to achieve custom sequences of calls; combinations can be brought together, on-the-fly, directly within the manifest, and customers can always count on their wallet software to lay out what is happening within the transaction, and guarantee the outcomes they care about.
