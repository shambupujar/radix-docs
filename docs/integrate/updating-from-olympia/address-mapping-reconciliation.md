---
title: "Address Mapping & Reconciliation"
---

# Address Mapping & Reconciliation

There was an automatic migration of state from Olympia to Babylon on release day in September 2023. At switchover time, the Olympia network stopped, the Babylon nodes read the end state from their Olympia node, and used it to create the Babylon genesis. As more validators completed the process, the Babylon network then sprang into life.

To read more on the mechanics of the switchover, see this blog here: [Babylon Automatic Migration Guide](https://www.radixdlt.com/blog/babylon-automatic-migration-guide).

As part of the migration (during Babylon mainnet epoch 32717), each entity was recreated with its new address, resources got minted, owner badges were created and passed to their accounts, and stakes got turned into stake units.

If you have a need for reconciling the Olympia and Mainnet ledger, please see this spreadsheet: Radix Mainnet - Olympia-Babylon Address Mapping \[PUBLIC DOCUMENT\]. The spreadsheet captures instructions about the migration, as well as multiple tabs covering the data which was migrated, including mappings between the Olympia and Babylon addresses for all addresses that existed at the end of Olympia.
