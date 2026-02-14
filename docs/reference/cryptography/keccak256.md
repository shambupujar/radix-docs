---
title: "Keccak256"
---

**Keccak256** digest is being calculated over given vector of bytes.

See the example below:

``` rust
use scrypto::prelude::*;

#[blueprint]
mod crypto_example {
    struct CryptoScrypto {}

    impl CryptoScrypto {
        pub fn keccak256_hash(data: Vec<u8>) -> Hash {
            let hash = CryptoUtils::keccak256_hash(data);
            hash
        }
    }
}
```
