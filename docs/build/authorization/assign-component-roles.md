---
title: "Assign Component Roles"
---

### Assign Component Roles

The conditions for proving if a caller has a role is defined by an **AccessRule**. During component instantiation each role defined for the blueprint will be assigned an AccessRule. Each AccessRule defines a set of resources, called badges, which the caller must prove they have access to.

### Create a Badge Resource

A **Badge** is simply a [resource](../resources/index.md) used for authorization in an AccessRule. It is no different from any other resource and in fact existing resources may be used as a badge.

To create a badge resource from scratch use the [resource builder pattern](../resources/resource-creation-in-detail.md):

``` rust
#[blueprint]
mod my_token_sale {
    enable_method_auth! { .. }

    struct MyTokenSale { .. }
    
    impl MyTokenSale {
        pub fn create() {
            let owner_badge: Bucket = ResourceBuilder::new_fungible(OwnerRole::None)
                .divisibility(DIVISIBILITY_NONE)
                .mint_initial_supply(1);

            ..
        }
        ..
    }
}
```

### Create an Access Rule

An **AccessRule** defines the set of resources which a caller must prove they have access to in order to pass auth.

To create an AccessRule use the `rule!` macro:

``` rust
#[blueprint]
mod my_token_sale {
    enable_method_auth! { .. }

    struct MyTokenSale { .. }
    
    impl MyTokenSale {
        pub fn create() {
            let owner_badge: Bucket = { .. };
            let access_rule: AccessRule = rule!(require(owner_badge.resource_address())); // #1

            ..
        }
        ..
    }
}
```

1.  Using `rule!` along with `require` sets the rule that a caller must show proof of any non-zero amount of the owner badge resource

It is possible to create advanced access rules which define more complex sets of resources. This is documented [here](advanced-accessrules.md).

### Assign an AccessRule to the Owner Role

The owner role is a special role which every component must define on instantiation. It is special as it inherits the role of any role which isn’t assigned an AccessRule.

The Owner Role has three variations:

|  |  |
|:---|:---|
| **Variation** | **Description** |
| None | No one may claim they are the owner of the component and this is immutable. |
| Fixed | There is an owner of the component provable by the assigned AccessRule and this AccessRule is immutable. |
| Updatable | There is an owner of the component provable by the assigned AccessRule and this AccessRule is updatable by the owner. |

To set an AccessRule for the Owner Role, specify the owner role with access rule in the `prepare_to_globalize` method during component globalization:

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
            let access_rule: AccessRule = { .. };

            MyTokenSale { .. }
                .instantiate()
                .prepare_to_globalize(OwnerRole::Fixed(access_rule)) // #1
                .globalize()

          ..
        }
        ..
    }
}
```

1.  A fixed owner role is assigned. Since no access rules have been defined for any custom roles, the owner role automatically inherits the `super_admin_role` and `admin_role` roles.

### Assign Custom AccessRules for Custom Roles

If custom access rules for each role are required (rather than the Owner role inheriting all roles) then use the `roles!` macro during component globalization:

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
            let admin_access_rule: AccessRule = { .. };

            MyTokenSale { .. }
                .instantiate()
                .prepare_to_globalize(OwnerRole::Fixed(owner_access_rule))
                .roles(roles! {
                    admin => admin_access_rule; // #1
                    super_admin => OWNER; // #2
                })
                .globalize()

          ..
        }
        ..
    }
}
```

1.  The `admin_access_rule` is assigned to the `admin` role

2.  Using `OWNER` specifies that the owner role will inherit the `super_admin` role
