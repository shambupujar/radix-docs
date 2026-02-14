---
title: "Freeze Withdraws from a vault"
---

Freezing vaults is only possible for resources where this feature has been enabled, by setting an explicit rule for `freezer` or `freezer_updater` roles. Such resources are clearly flagged in the Radix explorer and wallet, as per the [resource behaviors](resource-behaviors.md) guide.

## To Freeze or Unfreeze

Retrieve a vault address from an API such as the Gateway API, and then you can pass it to the `FREEZE_VAULT` or `UNFREEZE_VAULT` manifest commands, assuming the requisite `proofs` are on the `authzone` for the `freezer` role `AccessRule` for the resource.

These commands use a binary flags approach to specify which actions to freeze. Add the flags up determine which to specify on calls to FREEZE/UNFREEZE:

- 1 - Withdraws

- 2 - Deposits

- 4 - Burns

You can check out a few examples below:

``` bash
# Freeze Withdraws from a vault
FREEZE_VAULT Address("<VAULT_ADDRESS>") Tuple(1u32);

# Freeze Deposits into a vault
FREEZE_VAULT Address("<VAULT_ADDRESS>") Tuple(2u32);

# Freeze Burns in a vault
FREEZE_VAULT Address("<VAULT_ADDRESS>") Tuple(4u32);

# Freeze Withdraws/Deposits/Burns of a vault
FREEZE_VAULT Address("<VAULT_ADDRESS>") Tuple(7u32);

# Unfreeze Withdraws from a vault
UNFREEZE_VAULT Address("<VAULT_ADDRESS>") Tuple(1u32);

# Unfreeze Deposits into a vault
UNFREEZE_VAULT Address("<VAULT_ADDRESS>") Tuple(2u32);

# Unfreeze Burns in a vault
UNFREEZE_VAULT Address("<VAULT_ADDRESS>") Tuple(4u32);

# Unfreeze Withdraws/Deposits/Burns of a vault
UNFREEZE_VAULT Address("<VAULT_ADDRESS>") Tuple(7u32);
```

EG a `<VAULT_ADDRESS>` could look like `internal_vault_sim1tzmfs5qf8xkkqptce9naaf0f52fn6lgfg8uyr4me5qs5derjcmquc4`.
