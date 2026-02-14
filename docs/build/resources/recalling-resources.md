---
title: "Recalling Resources"
---

# Recalling Resources

Recalling resources is only possible for resources where this feature has been enabled, by setting an explicit rule for `recaller` or `recaller_updater`. Such resources are clearly flagged in the Radix explorer and wallet, as per the [resource behaviors](resource-behaviors.md) guide.

## Recall Transaction

Retrieve a vault address from an API such as the Gateway API, and then you can pass it to a recall command.

You can recall from the manifest with these commands, assuming you have the requisite `proofs` on the `authzone` for the `recaller` role of the resource.

``` bash
RECALL_FROM_VAULT
    Address("<FUNGIBLE_VAULT_ADDRESS>")
    Decimal("1")
;
RECALL_NON_FUNGIBLES_FROM_VAULT
    Address("<NON_FUNGIBLE_VAULT_ADDRESS>")
    Array<NonFungibleLocalId>(
        NonFungibleLocalId("#123#"),
        NonFungibleLocalId("#456#")
    )
;
```

EG a `<FUNGIBLE_VAULT_ADDRESS>` could look like `internal_vault_sim1tzmfs5qf8xkkqptce9naaf0f52fn6lgfg8uyr4me5qs5derjcmquc4`.

You can also recall from a component, by passing the vault address into the component from the manifest, and then doing the following:

``` rust
// Method inside component
pub fn recall_fungible_from_internal_vault(&self, vault_address: InternalAddress, amount: Decimal) -> Bucket {
  self.recaller_badge_vault.authorize(|| {
    let recalled_bucket: Bucket = scrypto_decode(&ScryptoVmV1Api::object_call_direct(
      vault_address.as_node_id(),
      VAULT_RECALL_IDENT,
      scrypto_args!(Decimal::ONE),
    )).unwrap();

    recalled_bucket
  })
}
```

There will be an improved Scrypto API for programmatic recall in the future.

Note that it is not currently possible to source the vault address from the Radix Engine, so it must be determined from an off-ledger indexer/API, and passed in through a transaction.
