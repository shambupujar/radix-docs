---
title: "Structure Roles Methods"
---

Methods, unlike functions, use roles to further structure how AccessRules are assigned.

Roles and the methods each role may access are defined statically for each blueprint. This means that every component of a given blueprint will have the same role/method structure as every other component of the same blueprint.

### Use the Owner Role and Self Role

Every component will always have an Owner Role and a Self Role. The Owner Role is a role which must be defined for every component instantiation. The Self Role is a special role which refers to the component itself.

To only allow a subset of methods to be accessed by the owner or self role use the `enable_method_auth!` macro at the top of your blueprint code:

``` rust
#[blueprint]
mod my_token_sale {
    enable_method_auth! {
        methods { // #1
            buy => PUBLIC; // #2
            create_admin => restrict_to: [OWNER, SELF]; // #3
            change_price => restrict_to: [OWNER];
            redeem_profits => restrict_to: [OWNER];
        }
    }

    struct MyTokenSale { .. }
    
    impl MyTokenSale {
        pub fn buy(&mut self) { .. }
        pub fn create_admin(&mut self) { .. }
        pub fn change_price(&mut self) { .. }
        pub fn redeem_profits(&mut self) { .. }
        ..
    }
}
```

1.  Each `pub` method in `impl MyTokenSale { .. }` must be assigned which roles may access it. Non-`pub`methods are never accessible.

2.  Use `PUBLIC` to allow anyone to call a method. In this case, `buy` may be called by anyone().

3.  Use `restrict_to` to specify which roles may call a method. In this case, `create_admin` is restricted to callers who can prove they have the OWNER role, or the component itself (SELF).

### Use Custom Roles

Each blueprint may also define it’s own custom roles to have greater control of authorization. To do so, add `roles` to the `enable_method_auth!` macro:

``` rust
#[blueprint]
mod my_token_sale {
    enable_method_auth! {
        roles {
            super_admin_role => updatable_by: []; // #1
            admin_role => updatable_by: [super_admin_role];
        },
        methods {
            buy => PUBLIC;
            create_admin => restrict_to: [super_admin]; // #2
            change_price => restrict_to: [admin, super_admin];
            redeem_profits => restrict_to: [OWNER];
        }
    }

    struct MyTokenSale { .. }
    
    impl MyTokenSale {
        pub fn buy(&mut self) { .. }
        pub fn create_admin(&mut self) { .. }
        pub fn change_price(&mut self) { .. }
        pub fn redeem_profits(&mut self) { .. }
        ..
    }
}
```

1.  Each custom role is associated with a set of roles which specify which roles may update the conditions of that role. In this case, `super_admin_role` has an empty set effectively setting it’s AccessRules to be immutable once defined. The `admin_role` on the other hand may be updated by the `super_admin_role`.

2.  Custom roles may then be used when defining which roles a method may be accessed by.

### Ignore Auth and Create a Fully Public Blueprint

It may be that Auth is unnecessary for your blueprint and that every method should be accessible by everyone. In this case, NOT including `enable_method_auth!` macro makes every method public.

``` rust
#[blueprint]
mod my_faucet {
    struct MyFaucet { .. }
    
    impl MyFaucet {
        pub fn take(&mut self) { .. } // #1
        ..
    }
}
```

1.  Since `enable_method_auth!` is not used the `take` method is callable by anyone
