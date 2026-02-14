---
title: "Assign Function Accessrules"
---

To specify the access rules for each function use the `enable_function_auth!` macro at the top of your blueprint code.

:::note
#### NOTE

If the `enable_function_auth!` macro is not used that all functions will default to `rule!(allow_all)` AccessRule.
:::


``` rust
#[blueprint]
mod my_token_sale {
    enable_function_auth! { // #1
        create_component => rule!(allow_all); // #2
        create_special_component => rule!(require(XRD)); // #3
    }

    struct MyTokenSale { .. }
    
    impl MyTokenSale {
        pub fn create_component() -> Global<MyTokenSale> { .. }
        pub fn create_special_component() -> Global<MyTokenSale> { .. }
        ..
    }
}
```

1.  Each `pub` function in `impl MyTokenSale { .. }` must be assigned an AccessRule if the `enable_function_auth!` macro is used. Non-`pub`functions are never accessible.

2.  `rule!(allow_all)` specifies that anyone may call the `create_component` function

3.  `rule!(require(XRD))` specifies that only a caller who has a proof of XRD in their AuthZone may call the `create_special_component` function
