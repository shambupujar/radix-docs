---
title: "Assign Metadata Roles"
---

### Assign AccessRules for Metadata Roles

Every component has Metadata and a set of Metadata Roles:

<table>
<colgroup>
<col />
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>Role</strong></td>
<td><strong>Authority Description</strong></td>
<td><strong>Methods Accessible</strong></td>
</tr>
<tr>
<td>metadata_setter</td>
<td>Update a metadata entry</td>
<td><p><code dir="">Metadata::set(..)</code></p>
<p><code dir="">Metadata::remove(..)</code></p></td>
</tr>
<tr>
<td>metadata_setter_updater</td>
<td>Update the AccessRule of the metadata_setter</td>
<td><code dir="">RoleAssignment::set(ModuleId::Metadata, "metadata_setter", ..)</code></td>
</tr>
<tr>
<td>metadata_locker</td>
<td>Lock metadata entries such that they are no longer updateable</td>
<td><code dir="">Metadata::lock(..)</code></td>
</tr>
<tr>
<td>metadata_locker_updater</td>
<td>Update the AccessRule of the metadata_locker</td>
<td><code dir="">RoleAssignment::set(ModuleId::Metadata, "metadata_locker", ..)</code></td>
</tr>
</tbody>


By default, the Owner Role will inherit all Metadata Roles.

### Assign Custom AccessRules for Metadata Roles

If custom access rules for each metadata role are required (rather than the Owner role inheriting all roles) then add `roles` to the `metadata!` macro during component globalization:

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
            let metadata_setter_access_rule: AccessRule = { .. };

            MyTokenSale { .. }
                .instantiate()
                .prepare_to_globalize(OwnerRole::Fixed(owner_access_rule))
                .metadata(metadata! {
                    roles {
                        metadata_setter => metadata_setter_access_rule.clone(); // #1
                        metadata_setter_updater => metadata_setter_access_rule;
                        metadata_locker => OWNER; // #2
                        metadata_locker_updater => rule!(deny_all); // #3
                    }
                })
                .globalize()

          ..
        }
        ..
    }
}
```

1.  The `metadata_setter_access_rule` is assigned to the `metadata_setter` role

2.  Using `OWNER` specifies that the owner role will inherit the `metadata_locker` role

3.  The `metadata_locker_updater` role is not accessible by anyone effectively “locking” in the AccessRule of `metadata_locker`

### 
