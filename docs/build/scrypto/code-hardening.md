---
title: "Code Hardening"
---

## Check The Resource Address of All Proofs Passed by Intent

All methods and functions that take `Proof`s by intent must check the resource address of the passed proof before using any of the data on the `Proof`. If such a check is not done then the application risks being deceived by a `Proof` passed by an attacker which has the data, non-fungible ID, amount, and other information that the application expects but of a different resource.



Example



The following is an example of this bug in action. The blueprint shown below is a claim handler blueprint. Each user is given a badge that gives them the right to claim their resources. The component stores the claims in a `KeyValueStore<NonFungibleLocalId, Vault>` which maps the non-fungible local ID of the claimer to a vault containing their resources. When a claimer requests to claim their resources they pass a `Proof` of their user badge and the component returns everything in their claim vault back to them.

In the misconfigured example shown below, the `claim` method does not check for the resource address of the passed `Proof`, it just gets the non-fungible local ID, fetches the associated `Vault`, and then returns all of the resources in the vault. In this case, an attacker can create a resource, mint NFTs of this resource of the non-fungible IDs that they wish to request claims for and be able to successfully perform the claims as the resource address of the `Proof` is not checked.

Mitigating this attack is quite simple and made easy by the fact that `Proof`s do not expose any information about their contents until they are converted into `CheckedProofs` through methods like `check`, `check_with_message`, and `skip_checking`. In the correctly configured example shown below the `check` method is called on the `Proof` to first validate that it is a user badge, only then does the claim process continue.

``` rust
use scrypto::prelude::*;

// ⛔️ Misconfigured
mod misconfigured {
    use super::*;

    #[blueprint]
    mod claim_handler {
        /// Stores the resource claims for users and returns the resources when
        /// the user presents their badge.
        struct ClaimHandler {
            /// Maps the non-fungible local ID of the user's claim badge to the
            /// vault containing the resources that they can claim.
            claims: KeyValueStore<NonFungibleLocalId, Vault>,
        }

        impl ClaimHandler {
            pub fn claim(&mut self, proof: Proof) -> Bucket {
                // ⛔️ The resource address of the passed proof was not checked.
                // Thus, it may not have been an actual user badge, it could
                // very well have been a proof of a non-fungible that an
                // attacker created and they can mint of it the IDs they wish to
                // claim assets that do not belong to them.
                let non_fungible_local_id = proof
                    .skip_checking()
                    .as_non_fungible()
                    .non_fungible_local_id();

                self.claims
                    .get_mut(&non_fungible_local_id)
                    .unwrap()
                    .take_all()
            }
        }
    }
}

// ✅ Correctly Configured
mod correctly_configured {
    use super::*;

    #[blueprint]
    mod claim_handler {
        /// Stores the resource claims for users and returns the resources when
        /// the user presents their badge.
        struct ClaimHandler {
            /// Maps the non-fungible local ID of the user's claim badge to the
            /// vault containing the resources that they can claim.
            claims: KeyValueStore<NonFungibleLocalId, Vault>,

            /// The resource manager of the user badge that's minted for users
            /// to allow them to claim their resources later. This is stored for
            /// two reasons:
            /// 1. To mint additional user badges for future claims.
            /// 2. To check the passed badge against when the claim method is
            ///    called.
            user_badge: ResourceManager,
        }

        impl ClaimHandler {
            pub fn claim(&mut self, proof: Proof) -> Bucket {
                let non_fungible_local_id = proof
                    // ✅ This checks that the passed proof is of the user badge
                    // resource address; thus mitigating any chance for an
                    // attacker to provide a proof of a matching local ID but
                    // of a different resource.
                    .check(self.user_badge.address())
                    .as_non_fungible()
                    .non_fungible_local_id();

                self.claims
                    .get_mut(&non_fungible_local_id)
                    .unwrap()
                    .take_all()
            }
        }
    }
}
```





## Consider The Implications of Proof Amounts

In certain cases, special attention needs to be paid to the use of `Proof` amounts, especially in the context of applications that rely on such amounts for the casting of votes. Multiple proofs can be created of the same underlying assets.



Example



The following is an example showing an application that is using `Proof` amounts in a vulnerable way. This is a Decentralized Autonomous Organization (DAO) blueprint where participants in the DAO could cast votes for different proposals. Any entity holding the DAO resources is considered to be a participant and allowed to cast votes of a maximum weight equal to the amount of DAO resources they possess.

In the misconfigured example shown below, the `vote` method takes a `Proof` of the DAO resources, uses the proof amount to determine the voting weight, and then performs whatever logic is needed to cast a vote of the given weight to the proposal. There are some issues with this:

1.  Voters can vote multiple times since the DAO tokens were not taken away from them.

2.  Voters can create a proof and call the `vote` method multiple times to inflate their voting power.

The `attack` method shown in the example below is an example of how an attacker might go about exploiting such a vulnerability. Using a single legitimate proof, an attacker can increase their voting weight by simply calling the `vote` method of the DAO with clones of the legitimate proof as many times as they want.

Therefore, applications similar to the DAO shown in this example can not rely on proof amounts alone; they must also factor in a mechanism to disallow double voting. The simplest and most straightforward mechanism to do that borrows some ideas from the design of XRD and Liquid Stake Units (LSUs): When casting a vote users must pass in a bucket of their DAO resources which is used to determine the vote weight, the DAO keeps the DAO resources and returns to the user some kind of replacement or claim resources that they can use at any point of time to re-cast their vote or claim their DAO resources after the voting period has concluded. Snippets of that are shown in the well-configured example below.

``` rust
use scrypto::prelude::*;

#[derive(ScryptoSbor)]
pub enum Vote {
    Yes,
    No,
    Abstain,
}

// 💀 Attacker
mod attacker {
    use super::*;

    #[blueprint]
    mod attacker {
        struct Attacker;

        impl Attacker {
            /// 💀 This function shows how an attacker might exploit this. Using
            /// 1 legitimate proof, they're able to multiply their voting power
            /// by 100 by cloning the proof multiple times.
            pub fn attack(legitimate_proof: Proof) {
                let dao: Global<super::misconfigured::dao::Dao> = todo!();
                let proof = legitimate_proof.skip_checking();
                for _ in 0..100 {
                    dao.vote(proof.clone().0, 1, Vote::Yes);
                }
            }
        }
    }
}

// ⛔️ Misconfigured
mod misconfigured {
    use super::*;

    #[blueprint]
    mod dao {
        /// A DAO where participants can vote on proposals.
        struct Dao {
            /// The address of the resource used for the voting. This is the
            /// resource users give to the component in order to vote and this
            /// is what determines their voting weight.
            voting_resource: ResourceManager,
        }

        impl Dao {
            /// ⛔️ This method uses proofs for voting which allows an attacker
            /// to inflate a vote in two main ways:
            ///
            /// 1. Clone the proof and call this method again.
            /// 2. Since they still own the resources, they can just create
            ///    another proof from that bucket or vault and pass it again.
            ///
            /// By passing proof of the same resources multiple times they can
            /// inflate the voting results by casting duplicate votes.
            pub fn vote(
                &mut self,
                proof: Proof,
                _proposal_id: u64,
                _vote: Vote,
            ) {
                let _vote_weight =
                    proof.check(self.voting_resource.address()).amount();
                info!("Congratulations, you've voted!");

                /* Remaining of the voting logic goes here. */
            }
        }
    }
}

// ✅ Correctly Configured
mod correctly_configured {
    use super::*;

    #[blueprint]
    mod dao {
        /// A DAO where participants can vote on proposals.
        struct Dao {
            /// The address of the resource used for the voting. This is the
            /// resource users give to the component in order to vote and this
            /// is what determines their voting weight.
            voting_resource: ResourceManager,

            /// The address of the resource given to the voters after they vote
            /// and after their voting resources are taken away from them. This
            /// resource can be exchanged for the voting resource when the vote
            /// period ends.
            voting_claim_resource: ResourceManager,
        }

        impl Dao {
            /// This fixes the vulnerability seen in the misconfigured [`vote`]
            /// by taking a bucket of the vote resources instead of a proof.
            ///
            /// This method does the following:
            ///
            /// * Ensures that the correct bucket of resources was passed in.
            /// * Calculates the voting weight.
            /// * Deposits the voting resources into a vault.
            /// * Mint an equivalent amount of voting claim resources and return
            ///   them to the caller.
            ///
            /// [`vote`]: [`super::misconfigured::dao::Dao::vote`]
            pub fn vote(
                &mut self,
                bucket: Bucket,
                _proposal_id: u64,
                _vote: Vote,
            ) {
                assert_eq!(
                    bucket.resource_address(),
                    self.voting_resource.address()
                );
                let _vote_weight = bucket.amount();
                info!("Congratulations, you've voted!");

                /* Remaining of the voting logic goes here. */
            }
        }
    }
}
```





## Ensure That No Blueprints Suffer From State Explosion

Blueprints that use eagerly-loaded, growable data structures of unbound size such as `Vec<T>`, `HashMap<K, V>`, `BTreeMap<K, V>`, `IndexMap<K, V>`, `HashSet<T>`, `BTreeSet<T>`, `IndexSet<T>` and other structures should consider switching to lazily-loaded alternatives such as `KeyValueStore<K, V>`. Otherwise, if such growable, eagerly-loaded data structures are used in the component state and continue to grow then invoking methods on the component may become very expensive or outright impossible due to the cost unit limit. In the worst case, this can make the fees high (or impossible to pay) for users of an application that's vulnerable to state explosion. In the worst-case scenario, this can result in the assets of the users of an application being locked with no way to unlock them due to the inability to invoke methods on the component.

When a component uses a growable eagerly-loaded data structure such as `HashMap<K, V>` then all entries in this structure are loaded when the component is called during component state reads. If the application code keeps adding entries, then more and more data will be read with each method invocation on the component. Reading state is costed; thus, the size of such structures can become large enough that invoking methods on the component becomes either too expensive or outright impossible due to the cost unit limit. This can be mitigated by using growable lazily-loaded data structures such as `KeyValueStore<K, V>` where none of the entries are read when the component state is read, only the `NodeId` of the `KeyValueStore` is read.

State explosion is not something to worry about in the following cases:

- When non-growable eagerly-loaded data structures such as `[T; N]` are used.

- When growable eagerly-loaded data structures are used but guaranteed by the application code to never grow. As an example, an `IndexSet<T>` used in component state which is passed as an argument during component instantiation and guaranteed by the application code to never grow.

### Lazy sets

You can build a lazy set from a `KeyValueStore` by using an empty/unit value `()` as follows:

``` rust
type LazyMap<K, V> = KeyValueStore<K, V>;
type LazySet<K> = KeyValueStore<K, ()>;
```

### Support for iteration

Natively, `KeyValueStore` does not support iteration on-ledger. It will soon be possible to iterate over its content off-ledger, through the Gateway or upcoming State APIs.

If you wish to support on-ledger iteration, you will need to make use of an iterable abstraction on top of `KeyValueStore`. The community has created some abstractions you can use in the components - see the disclaimer and list below.

Please beware the following caveats:

- The transaction is subject to a limit in number of substates read, and number of substates written to. If the store grows, you should only plan to read from a small (hopefully bounded) part of the whole store in a single transaction.

- Note that there is typically some overhead (in terms substate read limit and fees) to build / enable iteration on-ledger.

#### Community Libraries

:::note[This list is not vetted]
:::note

:::

Inclusion in this list does *not* imply endorsement. Please look at the individual project / code for more details, to see if it fits your needs.  
If you know of a relevant library and would like it included here, please get in touch on Discord or at <a href="mailto:hello@radixdlt.com">hello@radixdlt.com</a>.
:::


- <a href="https://github.com/ociswap/scrypto-avltree">Ociswap’s AVL Tree</a> (<a href="https://hacken.io/audits/ociswap/">audit report</a>)

### State explosion example



Example



The following is an example showing a blueprint vulnerable to state explosion. This blueprint is of a decentralized exchange where the liquidity is stored in a mapping of the pair resource addresses to the pair vaults. In the misconfigured example an `IndexMap` is used. As more pairs are created, this map can eventually become large enough that it becomes very expensive to load. This makes it so that swaps are very expensive to do as each call to the `swap` method reads the component state which has this  
very large map. In the worst-case scenario, this map could become large enough that reading it exceeds the cost unit limit, making it impossible to make any calls to the exchange component, essentially locking the component and all of the assets contained within. The correctly configured example mitigates this by switching the `IndexMap` with a `KeyValueStore`.

``` rust
use scrypto::prelude::*;

// ⛔️ Misconfigured
mod misconfigured {
    use super::*;

    #[blueprint]
    mod decentralized_exchange {
        /// A decentralized exchange allowing users to swap resources as well as
        /// contribute liquidity.
        struct DecentralizedExchange {
            /// ⛔️ This maps the address of the two resources of the pair to
            /// their respective vaults. There are two main problems with this:
            ///
            /// 1. This map's size is not bounded and can keep growing
            ///    indefinitely
            /// 2. The map is not lazy loaded; its loaded in full with each
            ///    method call to the component.
            ///
            /// This means that it is possible for this map to become large
            /// enough that any call to this component becomes either very
            /// expensive or would outright exceed the cost unit limit and
            /// lead such transactions to fail. In the context of this example
            /// if that happens then users would be unable to swap tokens and
            /// liquidity providers would be unable to redeem their pool units
            /// which would effectively result in loss of assets!
            pairs: IndexMap<(ResourceAddress, ResourceAddress), (Vault, Vault)>,
        }

        impl DecentralizedExchange {
            /* Implementation of the decentralized exchange */
        }
    }
}

// ✅ Correctly Configured
mod correctly_configured {
    use super::*;

    #[blueprint]
    mod decentralized_exchange {
        /// A decentralized exchange allowing users to swap resources as well as
        /// contribute liquidity.
        struct DecentralizedExchange {
            /// ✅ Key value stores are lazily loaded instead of being eagerly
            /// loaded. This means that none of the [`KeyValueStore`] entries
            /// are loaded when the component state is read, only the [`NodeId`]
            /// of the [`KeyValueStore`] is loaded. Thus, [`KeyValueStore`] can
            /// grow in size indefinitely without leading to state explosion
            /// problems.
            pairs: KeyValueStore<
                (ResourceAddress, ResourceAddress),
                (Vault, Vault),
            >,
        }

        impl DecentralizedExchange {
            /* Implementation of the decentralized exchange */
        }
    }
}
```





## Pay Special Attention to Decimal Operations

### Decimal Overflows

Overflows happen when a number can not be represented through the numeric types' internal representation, for example, `Decimal::MAX + Decimal::ONE` overflows. The arithmetic operators for `Decimal` and `PreciseDecimal` panic when an overflow occurs which results in a transaction failure.

While an overflow just causes a panic in the package WASM (which is caught by the Radix Engine) when the arithmetic operators are used, it is still undesirable for the following reasons:

- The overflow could happen for valid but unexpected inputs. Thus, users could have been under the assumption that the blueprint should continue to function as usual with those unanticipated inputs. Depending on the application this might be a small user inconvenience, partial or complete locking of assets, or anything in between.

- Certain overflows are completely avoidable by structuring calculations in different ways.

- Financial applications are expected to handle overflows and underflows correctly.

There are several important questions that blueprint developers need to think about with each calculation involving `Decimal`s and `PreciseDecimal`s:

- Can this calculation overflow?

  - Can this calculation overflow easily?

  - Can this calculation be expressed in a way that makes it harder for it to overflow?

  - Can this calculation be expressed in a way that makes it impossible for it to overflow?

- If an overflow occurs, how should the blueprint handle it? Should a default value be used in the case of an overflow? Is the input that led to the overflow an invalid input and thus it should result in a panic?

- Would an overflow in this particular calculation constitute a security risk for the blueprint? Would it perhaps lead to loss or locking of assets in the component?

The answers to the above questions vary from one application to another and from one calculation to another. It is important for blueprint developers to closely examine each calculation in the context of the questions above.

Overflows can be combated in two main ways: by using checked-math APIs which forces blueprint developers to think about overflows with each operation, and by always doing operations that make the number smaller first before operations that make it bigger.

Firstly, Scrypto offers APIs for checked arithmetic (similar to the Rust standard library) that attempt to perform an operation and return `Option::<Decimal>::Some` if it succeeds and `Option::<Decimal>::None` if it fails. This is different from the built-in arithmetic operators which panic if the operation fails. Developers must use these APIs instead of the regular arithmetic APIs as they push developers to think about overflows and to make a conscious decision about how they wish to handle an overflow: by unwrapping, picking a default, performing other calculations, or completely different means. As an example, developers should prefer using `.checked_add` instead of using the `+` operator which allows them to get an `Option` back.

Secondly, calculations can be expressed in a way that is mathematically equivalent but which makes overflows harder or impossible. As an example, do divisions first before multiplications to make sure that the number does not become too large and overflow.



Example



The following is an example of a mathematical equation that can be coded in two different ways: one where it is impossible to overflow and another where it can easily overflow. This equation calculates how much of resource  an amount of pool units corresponds to.







The two ways of representing the above equation in code are as follows:

``` rust
let pool_unit_amount: Decimal = todo!();
let pool_unit_total_supply: Decimal = todo!();
let reserves: Decimal = todo!();

/// ⛔️ Easily Overflows!
let redemption_amount = pool_unit_amount * reserves / pool_unit_total_supply;

/// ✅ Impossible to Overflow!
let redemption_amount = pool_unit_amount / pool_unit_total_supply * reserves;
```

In the above example, both ways of calculating the redemption amount are mathematically equivalent. However, the first way can overflow quite easily whereas it is impossible for the second way to overflow. Multiplying `pool_unit_amount` by `reserves` can overflow if both numbers are large. However, restructuring the calculation so that the `pool_unit_amount` is first divided by `pool_unit_total_supply` and then multiplied with the `reserves` results in a calculation where it is not only hard to overflow but actually impossible. This is because .





### Loss of Precision

The previous section recommended doing divisions first before multiplication as a way of making overflows more difficult to get. However, this results in a loss of precision and could also result in one part of the equation going to zero.

It is recommended that all calculations are done through `PreciseDecimal` and then converted to `Decimal` at the end.

### Incompatible Divisibility With `take` Methods

Calling `Vault::take` or `Bucket::take` with a number of decimal places incompatible with the divisibility of the resource results in an error and a transaction failure. This commonly happens in applications that perform some kind of arithmetic and then a `Vault::take` or `Bucket::take` of the result. The impact that this has varies from application to application, in a decentralized exchange it might mean that swapping tokens does not work in certain cases.

Developers should make sure that their blueprints correctly handle resources of various divisibilities and any possible arithmetic around them with no issues.

This can be mitigated by one of the following approaches:

- Rounding the amount either up or down to the nearest divisibility decimal places.

- Using the `Vault::take_advanced` and `Bucket::take_advanced` methods which take a rounding mode and will handle the rounding to the nearest divisibility decimal places with the specified rounding mode.



Example



The following is an example of code that is vulnerable to this issue and how it can be mitigated through `take_advanced`:

``` rust
// Divisibility = 2
let vault: Vault = todo!();

let pool_unit_amount: Decimal = dec!(1);
let pool_unit_total_supply: Decimal = dec!(3);
let reserves: Decimal = dec!(10);

// redemption_amount = 3.333333333333333333
let redemption_amount = pool_unit_amount / pool_unit_total_supply * reserves;

// ⛔️ A withdraw of 3.333333333333333333 is invalid for a resource with a 
// divisibility of two. Any decimal with more than 2 decimal places would lead
// this to fail.
let bucket = vault.take(redemption_amount);

// ✅ Correctly handles the divisibility by rounding towards zero.
let bucket = vault.take_advanced(
    redemption_amount, 
    WithdrawStrategy::Rounded(RoundingMode::ToZero)
);
```





## Consider Upgradeability





Note



This section applies until upgradeability is added as a feature of the Radix Engine.





Blueprint upgradeability is not currently supported natively in the Radix Engine. Thus, blueprint developers should consider upgradeability and perhaps implement application-level upgradeability for applications where it makes sense. Most importantly, application developers should have ways of migrating from old code to new code if critical bugs are discovered in their blueprints before upgradeability is implemented natively in the engine.

The following is a set of questions that blueprint developers should think about and determine the answer to in the context of their applications:

- How important is it to have a mechanism to upgrade the behavior?

- How should a component be upgraded if bugs are found?

- What happens between the period a bug is discovered and a fix is rolled out? What if the discovered bug can drain user funds? Should there be ways of shutting down the component operations?

- How should the latest version of a component be discovered?

- How to ensure that external packages and components do not break if the component address changes as part of upgrading?

- How can the assets be moved to the new version?

- How can the state be moved to the new version?

- How can older versions of the code be decommissioned?

- Can the interface of a new version of the component change?

It is important for any non-trivial application to have an answer to the above questions and to have factored application-level upgradeability in mind to have a mechanism for fixing bugs if they arise.

There are many different architectures and ways of implementing application-level upgradeability. What makes sense for one application might not make sense for another. An architecture that might make sense for many applications is shown in the diagram below and discussed afterward:







This architecture separates component state completely from component logic. The entirety of the state and vaults is stored in one component while another logic component operates over the state. Only one logic component can read or write state at any point in time which is established by requiring a badge for each state read or write. This is the mechanism by which old versions of the code are deprecated and decommissioned; they lose access to the badge and thus lose access to their ability to read and write state and service method calls. Similarly, new versions of the logic are given authority to read and write state by having the badge.

A proxy component can be used to ensure that the component address of the application remains the same throughout versions. When the logic of the application is updated the proxy component's state is updated with the component address of the new logic component. Thus, all method calls to the proxy component now forward the method invocations to the new version of the code.

## Ensure That Protected Methods and Functions Are Actually Protected

Misconfigured roles could allow attackers to call methods or perform operations that they should not have access to. Before releasing, the method to role mapping and role to rule mapping should both be checked to ensure that no protected methods are left accidentally public.



Example



The following is an example showing a blueprint whose method auth is misconfigured in a few different ways. The final blueprint in the example shows a properly configured blueprint. This is a payment splitter blueprint that allows deposits to be split among a group of entities according to percentages defined in the component. Payment splitters have admins that can change the percentage share of the participants. Only the payment splitter manager is allowed to mint additional admin badges by calling the `mint_admin_badge` on payment splitter components. It is important in this example that this method is only callable by the payment splitter manager. Otherwise, anybody can mint an admin badge and assume admin powers.

In the first misconfigured example the `enable_method_auth!` macro is not used; thus, method auth is completely disabled, and all methods with visibility of `pub` in the blueprint are public and callable by all. As a result, `mint_admin_badge` can be called by anyone. The second misconfigured example has enabled method auth and defined that the blueprint has a `manager` role. However, the `mint_admin_badge` method is not assigned to the manager role, it is incorrectly assigned to the `PUBLIC` role making it callable by all. In the third misconfigured example, method auth is correctly enabled, a `manager` role is correctly defined, and the mapping of the `mint_admin_badge` method to the `manager` role is correctly done, however, the manager role is assigned a rule of `rule!(allow_all)` which makes `mint_admin_badge` callable by all. Finally, the last blueprint is correctly configured.





Note



Exhaustiveness is enforced by the `rules!` and `enable_method_auth!` macros. Thus, there is no chance of not assigning a method to a role or not assigning a role to a rule, that is a hard-compile-time error.





``` rust
use scrypto::prelude::*;

// ⛔️ Misconfigured
mod misconfigured1 {
    use super::*;

    #[blueprint]
    mod payment_splitter {
        /// Allows for deposited resources to be split across multiple different
        /// parties according to the percentages defined by the component.
        struct PaymentSplitter;

        impl PaymentSplitter {
            /// ⛔️ Method auth is not enabled. Thus, this functions is public
            /// and callable by all!
            pub fn mint_admin_badge(&mut self) -> Bucket {
                todo!()
            }
        }
    }
}

// ⛔️ Misconfigured
mod misconfigured2 {
    use super::*;

    #[blueprint]
    mod payment_splitter {
        enable_method_auth! {
            roles {
                manager => updatable_by: [];
            },
            methods {
                // ⛔️ The method is mapped to the public role. Thus, it can be
                // called by all!
                mint_admin_badge => PUBLIC;
            }
        }

        /// Allows for deposited resources to be split across multiple different
        /// parties according to the percentages defined by the component.
        struct PaymentSplitter;

        impl PaymentSplitter {
            pub fn mint_admin_badge(&mut self) -> Bucket {
                todo!()
            }
        }
    }
}

// ⛔️ Misconfigured
mod misconfigured3 {
    use super::*;

    #[blueprint]
    mod payment_splitter {
        enable_method_auth! {
            roles {
                manager => updatable_by: [];
            },
            methods {
                mint_admin_badge => restrict_to: [manager];
            }
        }

        /// Allows for deposited resources to be split across multiple different
        /// parties according to the percentages defined by the component.
        struct PaymentSplitter;

        impl PaymentSplitter {
            pub fn instantiate() -> Global<PaymentSplitter> {
                Self.instantiate()
                    .prepare_to_globalize(OwnerRole::None)
                    // ⛔️ The `mint_admin_badge` method requires the `manager`
                    // role but this role is defined as being AllowAll. Thus,
                    // this method is callable by all!
                    .roles(roles! { manager => rule!(allow_all); })
                    .globalize()
            }

            pub fn mint_admin_badge(&mut self) -> Bucket {
                todo!()
            }
        }
    }
}

// ✅ Correctly Configured
mod correctly_configured {
    use super::*;

    #[blueprint]
    mod payment_splitter {
        enable_method_auth! {
            roles {
                manager => updatable_by: [];
            },
            methods {
                // Only the manager role can call the mint_admin_badge method.
                mint_admin_badge => restrict_to: [manager];
            }
        }

        /// Allows for deposited resources to be split across multiple different
        /// parties according to the percentages defined by the component.
        struct PaymentSplitter;

        impl PaymentSplitter {
            pub fn instantiate(
                manager_rule: AccessRule,
            ) -> Global<PaymentSplitter> {
                Self.instantiate()
                    .prepare_to_globalize(OwnerRole::None)
                    // The manager role is set to the rule passed to the
                    // constructor function, this should not just be an
                    // allow_all.
                    .roles(roles! { manager => manager_rule; })
                    .globalize()
            }

            pub fn mint_admin_badge(&mut self) -> Bucket {
                todo!()
            }
        }
    }
}
```









Note



Similar care needs to be given to function auth as well.




