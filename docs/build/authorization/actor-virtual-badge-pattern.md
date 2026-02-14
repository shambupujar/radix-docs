---
title: "Actor Virtual Badge Pattern"
---

When we’re writing our blueprints we’ll eventually come to a point where we need to think about how a component can be given authority to perform some kind of action. The [user badge pattern](user-badge-pattern.md) introduces concepts of how to use resources as "badges" to provide authority for certain actions. However, when it comes to enabling components to perform authorized actions, the component itself does not need to have its own badge to provide permission and perform authorized actions. The component itself has the ability to provide the necessary proofs on its behalf to perform a permissioned action. This can be done with the actor virtual badge pattern and it has two common use cases:

## Resource Behavior Permissions

It’s often a common pattern for to have some variation of resource behaviors which needs an autonomous entity to permit it from performing those resource action. This can be the ability to mint a user badge every time a "create_user" method is called, burn a resource, or otherwise. This kind of pattern perfectly suits to employ an actor virtual badge to provide the component the permission to perform such resource action.

Let’s take the contrived blueprint example below:

``` rust
use scrypto::prelude::*;

#[blueprint]
mod rad_social {
    struct RadSocial {
        user_badge_manager: ResourceManager,
    }

    impl RadSocial {
        pub fn instantiate_rad_social() -> Global<RadSocial> {

            let (address_reservation, component_address) =
                Runtime::allocate_component_address(RadSocial::blueprint_id()); // #1

            let user_badge = ResourceBuilder::new_fungible(OwnerRole::None)
                .metadata(metadata!(
                    init {
                        "name" => "User Badge", locked;
                    }
                ))
                .mint_roles(mint_roles! {
                    minter => rule!(require(global_caller(component_address))); // #2
                    minter_updater => rule!(deny_all);
                })
                .create_with_no_initial_supply();

            Self {
                user_badge_manager: user_badge,
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .with_address(address_reservation) // #3
            .globalize()
        }

        pub fn create_user(&mut self) -> Bucket { // #4
            self.user_badge_manager.mint(1)
        }
    }
}
```

1.  We allocate an `address_reservation` and `component_address` for the component to create its own caller badge.

2.  We specify the resource’s `minter` role with an `AccessRule` to use the `component_address` to create a caller badge. The `global_caller` function conveniently allows the component to create its own virtual actor badge to present proof that it has permission to perform such action.

3.  Allocating the component’s address requires us to instantiate the component `.with_address(address_reservation)` to solve for the chicken and egg problem of knowing the ComponentAddress before it has been created.

4.  The component can now freely mint user badge every time the method is called.
