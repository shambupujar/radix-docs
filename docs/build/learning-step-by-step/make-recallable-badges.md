---
title: "Make Recallable Badges"
---

It’s time to introduce some more resource behaviors. In this section, we will add the ability to recall and burn staff badges to our candy store (from [Build a Candy Store](build-a-candy-store.md)). We don’t want staff that stop working for us to keep their badges and the access that gives them. We’ll trigger these behaviours in a different way to previous sections. Instead of adding a new method the recall action will be described purely in a transaction manifest, but to allow this to happen we will need to add some new permissions to the staff badge resource.

:::note
**The scrypto package referenced in this section can be found in our [official examples here](https://github.com/radixdlt/official-examples/tree/main/step-by-step/14-candy-store-with-recallable-badges**

.)
:::



## Recallable and Burnable Resources

By default tokens can neither be recalled nor are they burnable. Turning these behaviours on will allow us to both bring a token to us from another vault and burn/destroy it. If we want to add these behaviors we do it the same way the mintable behaviour (or any others) would be added, by including roles for each.

``` rust
    let staff_badges_manager =
            // --snip--
            .recall_roles(recall_roles! {
                recaller => rule!(
                    require(owner_badge.resource_address()) ||
                    require(manager_badge.resource_address())
                );
                recaller_updater => rule!(deny_all);
            })
            .burn_roles(burn_roles! {
                burner => rule!(
                    require(owner_badge.resource_address()) ||
                    require(manager_badge.resource_address())
                );
                burner_updater => rule!(deny_all);
            })
            .create_with_no_initial_supply();
```

The rules for these roles are a little different to the mint roles we added in previous examples. They accept either the owner or manager badges as authorisation not the component’s address. Recall and burn therefore can’t and won’t be called by any of the component’s methods. They will instead be called on the vault containing the staff badge and the recalled badge bucket respectively, shown in the `recall_staff_badge.rtm` transaction manifest here:

    RECALL_NON_FUNGIBLES_FROM_VAULT
        Address("<VAULT_ADDRESS>")
        Array<NonFungibleLocalId>(
            NonFungibleLocalId("#1#"),
        )
    ;

And here:

    BURN_RESOURCE
        Bucket("staff_badge_bucket")
    ;

This is another way we can interact with resources in the radix engine. If they have rules that allow it, we can call them directly from the transaction manifest. A full list of the available manifest actions can be found in the [Manifest Instructions](/manifest-instructions) section of the docs.

## Making Staff Badges Non-Fungible

We’ve also made the Candy Store staff badges non-fungible. This change from the previous section’s Candy Store blueprint, allows us to assign the badges to specific staff members and more easily identify them.

To make this change we added a struct for the staff badge non-fungible data:

``` rust
#[derive(NonFungibleData, ScryptoSbor, Clone)]
struct StaffBadge {
    employee_number: u64,
    employee_name: String,
}
```

Then we changed the staff badge to create a non-fungible resource using the new struct and the `new_integer_non_fungible` method:

``` rust
    let staff_badges_manager =
        ResourceBuilder::new_integer_non_fungible::<StaffBadge>(OwnerRole::None)
            // --snip--
            .create_with_no_initial_supply();
```

Changing the staff badge creation to `create_with_no_initial_supply()` also means it now produces a `ResourceManager` instead of the `Bucket` `mint_initial_supply()` produces. There are a few more minor simplifications to the instantiate function you might notice that account for this.

More significantly, the change to non-fungible staff badges means we need to change the minting method. It now takes 2 arguments, the name and number of the employee, which become the stored non-fungible data. The number is also used as the local ID for the non-fungible, so must be unique. The function is now:

``` rust
    pub fn mint_staff_badge(&mut self, name: String, number: u64) -> Bucket {
        let staff_badge_bucket: Bucket = self.staff_badge_resource_manager.mint_non_fungible(
            &NonFungibleLocalId::integer(number),
            StaffBadge {
                employee_number: number,
                employee_name: name,
            },
        );
        staff_badge_bucket
    }
```

## Using the Recallable Badges

:::note
**Instruction on using the Candy Store and recallable badges are with the [example code on GitHub](https://github.com/radixdlt/official-examples/tree/main/step-by-step/14-candy-store-with-recallable-badges#using-the-candy-store-with-recallable-badges**

.)
:::


