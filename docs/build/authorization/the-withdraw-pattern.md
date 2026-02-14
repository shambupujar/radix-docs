---
title: "The Withdraw Pattern"
---

This pattern builds upon the [user badge pattern](user-badge-pattern.md) and could be considered as one of its use cases. The problem which this pattern solves is the problem of getting funds from component A to component B. Similar to the badge pattern, if you come from the Ethereum world, you might assume that "sending" funds to the address of the component is the way to go here. However, it is not. <a href="https://quantstamp.com/blog/what-is-a-re-entrancy-attack" target="_blank">Ethereum’s approach leads to reentrancy</a> attacks which are often triggered by the contract’s fallback function. In addition, Ethereum’s approach allows contracts to receive funds which they did not accept to receive. While this might seem like a non-issue when thinking about it in the context of accounts, the real issue becomes clearer when considering the fact that anybody can send funds to a liquidity pool to tip the balance of the pool without the pool having any say on whether it wishes to accept or reject such funds.

While the direct transfer of funds is possible to perform in Scrypto by calling the appropriate methods on the recipient’s component, its heavily discouraged to perform deposits in this way from the inside of your blueprints. Before going with the hard-coded approach of "sending" funds to a component, ask yourself the following questions:

- How can I be certain that the recipient’s component address corresponds to an account component and not some other component?

- If the recipient’s component is not an account component, then, does it have methods such as "deposit" to allow for direct deposits into the component?

- If the recipient’s component does not have a "deposit" method, then how do I determine the appropriate methods to use for the deposit from inside the my component?

- How can I determine if the recipient’s component has a vault for the type of tokens which I will be sending.

- Is it desirable for my blueprint to only work with account components and fail when any other component is being used?

- What if my user wishes to use the withdrawn funds atomically in a transaction instead of having the funds sent to their account? Remember, there is a strong use case for allowing your users to do so.

Clearly, the address-based approach of managing funds raises too many questions, and would in all likelihood, result in a number of assumptions being made. These hard-coded assumptions could prove catastrophic in edge-cases where they do not apply, which could result in funds getting locked in the component forever.

## Locking and Withdrawing Funds

The recommended pattern to handling funds which are owed to another component is by issuing badges for the different entities in your system and keeping track of owed funds in your component. You can then write methods which can withdraw the funds owed to the caller after authenticating the caller’s badge to ensure that they’re a valid entity in the system.

Imagine you are building a lottery blueprint. You want participants to send XRD to a vault which, later, the winner will receive their prize from. You might think of including a method distribute_funds which, when called by an admin, moves the prize directly to the winner’s wallet. There are multiple problems with this approach. First, this is not really composable. What if the user wanted to do something with the prize tokens in the same transaction ? Second, what if the user provided an address that is not a wallet ? The funds would be locked in the component. Instead, you should create a withdraw method where users present their badge and if they are the winner, the funds gets returned:

``` rust
use scrypto::prelude::*;

#[derive(ScryptoSbor, NonFungibleData)]
struct TicketData {
    minted_on: Epoch
}

#[blueprint]
mod lottery_example {
    struct LotteryExample {
        xrd_vault: Vault,
        ticket_resource_manager: ResourceManager,
        // Here we keep track of the user's NFT badge id
        winner_id: Option<NonFungibleLocalId>
    }

    impl LotteryExample {

        pub fn create_lottery(&mut self) -> Global<LotteryExample> {

            let (address_reservation, component_address) =
                Runtime::allocate_component_address(Runtime::blueprint_id());

            // Create a badge to identify this user
            let ticket_badge_manager =
                ResourceBuilder::new_ruid_non_fungible::<TicketData>(OwnerRole::None)
                .metadata(metadata!(
                    init {
                        "name" => "Lottery Ticket", locked;
                    }
                ))
                .mint_roles(mint_roles!(
                    minter => rule!(require(global_caller(component_address)));
                    minter_updater => rule!(deny_all);
                ))
                .create_with_no_initial_supply();

            Self {
                xrd_vault: Vault::new(XRD),
                ticket_resource_manager: ticket_badge_manager,
                winner_id: None
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .with_address(address_reservation)
            .globalize();
        }

        pub fn enter_lottery(&mut self, xrd: Bucket) -> Bucket {
            self.xrd_vault.put(xrd);

            let ticket_badge = self.ticket_resource_manager
                .mint_ruid_non_fungible(
                    TicketData {
                        minted_on: Runtime::current_epoch()
                    }
                );
            return ticket_badge
        }

        // After the winner was picked, they
        // can withdraw the funds
        pub fn withdraw(&mut self, ticket_badge: Proof) -> Bucket {
            let ticket_badge = ticket_badge.check(
                    self.ticket_resource_manager.address()
                );

            let nft: NonFungible<TicketData> = ticket_badge
                .as_non_fungible()
                .non_fungible();

            assert!(
                self.winner_id.as_ref().unwrap() == nft.local_id(),
                "You are not the winner"
            );

            self.xrd_vault.take_all()
        }
    }
}
```

This approach of handling the distribution of funds brings with it a number of advantages, such as:

- No one person ends up paying the fee for the sending of tokens (although this is possible to do if they want to).

- Removes the burden of figuring out how the funds can be sent.

- This approach allows for the blueprint to work with account and non-account components which may or may not expose similar methods for deposits.

- Ensures atomic composability.

## Examples

- <a href="https://github.com/radixdlt/scrypto-examples/tree/main/core/radix-name-service" target="_blank">Radix Name Service</a>

- <a href="https://github.com/radixdlt/scrypto-examples/tree/main/core/payment-splitter" target="_blank">Payment Splitter</a>

- <a href="https://github.com/radixdlt/scrypto-examples/tree/main/core/vesting" target="_blank">Vesting</a>
