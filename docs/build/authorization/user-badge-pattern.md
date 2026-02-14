---
title: "User Badge Pattern"
---

The problem that this pattern solves is the problem of how to tell that somebody is an admin in your system, or more generically, how to tell that a user has the authority to perform a certain action in the context of your system. If you come from the Ethereum world, your first intuition might be to use the caller’s address to perform authorization checks. If the caller’s address is in the list of whitelisted addresses then their call is valid, otherwise they’re not authorized to perform the call. The address-based approach, however, is far from being optimal as it introduces issues with composability and the smallest of mistakes in implementation could have the biggest of consequences, to the extent of privileged users losing access. The address-based approach to authorization has the following problems:

- It assumes a one-to-one mapping of public keys to account addresses, as in, this approach assumes that one key-pair can only control one account. While this is true on Ethereum, it is not true on Radix where an account is a component and a single key-pair can have control over multiple accounts. Thus, authorizing one of my owned component accounts to perform an action while not authorizing the others feels weird and clunky.

- It requires that additional methods are implemented on the smart contract to allow for additional authorized or whitelisted addresses to be added, removed, replaced, and so on. Failure to implement such functions correctly could mean that the contract "owner" is forever locked and may never be changed. This proves to be an issue when looking at the possibility of accounts being hacked, a dApp getting sold, or if the contract’s "owner" wishes to add other admins with them in a contract which used to be single-admin.

- Unless the required functions are present on the contract, this approach mandates that the contract’s "owner" must never migrate to a new account—​not even in the case of a hack—​as their authority to perform privileged actions on a contract is directly linked to their account address.

- Most implementations of the Ownable contract on Ethereum assumes that the contract creator is the contract’s owner. This would mean that in the case that the caller was using a proxy which they no longer have access to, then the proxy contract would be considered the "owner" of the contract.

- In Ethereum, there may only be one contract caller at a time, as Ethereum has no native support for multi-signature transactions. This means that authorization logic which involves multiple-signatures is a lot harder to correctly implement.

With the above points in mind, using the caller’s address to perform authorization checks begins to seem less intuitive and moves from being a simple solution to implement, to a design decision which requires a lot of thought in terms of what the system’s current and future requirements.

## Using Badges for Authorization

Radix solves the problems with address-based authorization techniques through the concept of badges. A badge is any normal resource—​meaning that it may be fungible or non-fungible—​which components use to perform authentication, and authorization checks. Components may be setup such that they require that some badge is present to allow certain method(s) to be called, then only when the caller presents a valid badge, through the auth zone or by passing it by intent, may they be authorized to call such methods.

Let’s look at a Scrypto example of how badges may be used for the purpose of authorization. Say that we are developing some blueprint where there is a vault that only admins can withdraw funds from. To implement this pattern, we would make it so that when our component is instantiated, it creates an admin badge, sets up the access rules to limit withdrawals to only admins, then returns the admin badge back to the caller. This would look as follows in Scrypto:

``` rust
use scrypto::prelude::*;

#[blueprint]
mod dontaions_box_module {
    enable_method_auth! {
        methods {
            withdraw => restrict_to: [OWNER]; // #1
        }
    }
    pub struct DonationsBox {
        donations: Vault
    }

    impl DonationsBox {
        pub fn instantiate_donations_box() -> (Global<DonationsBox>, Bucket) {
            // Create the admin badges
            let admin_badge: Bucket = ResourceBuilder::new_fungible(OwnerRole::None) // #2
                .divisibility(DIVISIBILITY_NONE)
                .metadata(metadata!(
                    init {
                        "name" => "Admin Badge", locked;
                    }
                ))
                .mint_initial_supply(1);

            // Instantiate the component
            let component = Self {
                donations: Vault::new(XRD)
            }
            .instantiate()
            .prepare_to_globalize(
                OwnerRole::Fixed(rule!(require(admin_badge.resource_address())))
            ) // #3
            .globalize();

            // Return the component address and the admin_badge
            (
                component,
                admin_badge
            )
        }

        pub fn withdraw(&mut self) -> Bucket {
            // This method can only be called if the caller presents an admin badge
            self.donations.take_all()
        }
    }
}
```

1.  Calling `enable_method_auth!`\` to restrict the withdraw method to the component `OWNER`.

2.  Creating the admin badge which will be used for authorization checks throughout the component.

3.  Mapping the AccessRule for the OWNER role to the admin badge.
