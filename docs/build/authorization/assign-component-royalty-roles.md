---
title: "Assign Component Royalty Roles"
---

### Assign AccessRules for Component Royalty Roles

Components may optionally include Component Royalties. If so, a set of component royalty roles will be defined for that component:

|  |  |  |
|:---|:---|:---|
| **Role** | **Authority Description** | **Methods Accessible** |
| royalty_setter | Update royalty amount for a method | `ComponentRoyalty::set_royalty` |
| royalty_setter_updater | Update the AccessRule of the royalty_setter | `RoleAssignment::set(ModuleId::Royalty, "royalty_setter", ..)` |
| royalty_locker | Lock the royalty amount for a method such that they are no longer updateable | `ComponentRoyalty::lock_royalty` |
| royalty_locker_updater | Update the AccessRule of the royalty_locker | `RoleAssignment::set(ModuleId::Royalty, "royalty_locker", ..)` |
| royalty_claimer | Withdraw the royalties accumulated by the component | `ComponentRoyalty::claim_royalties` |
| royalty_claimer_updater | Update the AccessRule of the royalty_claimer | `RoleAssignment::set(ModuleId::Royalty, "royalty_claimer", ..)` |

By default, the Owner Role will inherit all Metadata Roles.

### Assign Custom AccessRules for Component Royalty Roles

If custom access rules for each component royalty role are required (rather than the Owner role inheriting all roles) then add `roles` to the `component_royalties!` macro during component globalization:

``` rust
#[blueprint]
mod my_token_sale {
    enable_method_auth! {
        roles {
            super_admin_role => updatable_by: [];
            admin_role => updatable_by: [super_admin_role];
        },
        methods { .. }
    }

    struct MyTokenSale { .. }
    
    impl MyTokenSale {
        pub fn create() {
            let owner_badge: Bucket = { .. };
            let owner_access_rule: AccessRule = { .. };
            let royalty_setter_access_rule: AccessRule = { .. };
            let royalty_locker_access_rule: AccessRule = { .. };
            let royalty_locker_updater_access_rule: AccessRule = { .. };

            MyTokenSale { .. }
                .instantiate()
                .prepare_to_globalize(OwnerRole::Fixed(owner_access_rule))
                .enable_component_royalties(component_royalties! {
                    roles {
                        royalty_setter => royalty_setter_access_rule; // #1
                        royalty_setter_updater => rule!(deny_all); // #2
                        royalty_locker => royalty_locker_access_rule;
                        royalty_locker_updater => royalty_locker_updater_access_rule;
                        royalty_claimer => OWNER; // #3
                        royalty_claimer_updater => OWNER;
                    },
                    init { .. }
                })
                .globalize()

          ..
        }
        ..
    }
}
```

1.  The `royalty_setter_access_rule` is assigned to the `royalty_setter` role

2.  The `royaty_setter_updater` role is not accessible by anyone effectively “locking” in the AccessRule of `royalty_setter`

3.  Using `OWNER` specifies that the owner role will inherit the `royalty_claimer` role

  
