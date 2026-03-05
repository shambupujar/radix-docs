---
title: "Pay fees from the faucet:"
---

The faucet is available on test networks to get XRD. There are a number of ways to use the faucet:

- In the mobile wallet, after you’ve created an account, you can click the … menu and request test XRD.
- The LTS Toolkit has a function for building a transaction to deposit XRD from a faucet into an account.
- In a transaction manifest, you can use the following to lock fee or withdraw money from the faucet - the faucet address can be found in the **Test Networks** section:

``` rust
# Pay fees from the faucet:
CALL_METHOD Address("<FAUCET_ADDRESS>") "lock_fee" Decimal("10");

# Get 1000 XRD onto your worktop, put it in a bucket, and deposit it into your account:
CALL_METHOD Address("<FAUCET_ADDRESS>") "free";
CALL_METHOD Address("<ACCOUNT_ADDRESS>") "deposit_batch" Expression("ENTIRE_WORKTOP");
```
