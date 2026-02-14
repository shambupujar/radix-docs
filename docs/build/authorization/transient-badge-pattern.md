---
title: "Transient Badge Pattern"
---

The class of problems that this pattern solves is quite simple to describe but complex to think about and solve. However, this pattern solves this class of problems in such a simple, elegant, and unique asset-oriented approach. As always, this document begins by laying out the problem before describing the pattern and how it solves the problem.

Say we would like to build a flash loan application where borrowers first need to call `take_loan()` on your component and then call `repay_loan()` when they wish to return the funds. The application is to have two two main, key requirements that it must include:

1.  The general security requirements typically present in any flash loans application, must be satisfied. As in, the loan must be returned back in full plus any interest rate imposed on the loan.

2.  The application must return the loan to the transaction worktop so that the borrower may use the funds freely throughout the transaction.

The two requirements above might seem to contradict one another. How can we ensure that the borrower is able to borrow funds to their transaction worktop all while ensuring that the borrower will—​at some point in the transaction—​call `repay_loan()` to pay back their loan in full? Obviously, this can not be something that we trust the user to perform. But how can we ensure that the funds must come back to our component?

A solution which satisfies the first requirement but not the second is to have the `take_loan()` method take in a `ComponentAddress` and a `String` of the address of the component to make calls to and the name of the method to call respectively. In the `take_loan()` method, a call will be made to the specified method on the specified component. We then check that the result of the call is a bucket, check the amount in the bucket, and determine if the loan was paid back or not. While this gets us a basic flash loans application, this approach is not composable at all. So, this leaves us back at square one, how do we move forward from here?

## Transient Resources

A transient resource is a resource which can not be withdrawn or deposited into any vault. It can be minted by some authority, burned by some authority, but not deposited or withdrawn. The powerful checks that the Radix-Engine performs on transactions, combined with the characteristics of transient badges, allow for this problem (the flash loans problem) to be solved in a simple, elegant, and unique asset-oriented approach. In this application, the transient non-fungible token acts as the terms of the loan. It includes data on how much was taken as a loan, how much we expect to get back, what interest rate was the loan given at and what tokens we expect to get back.

The transient resource pattern—​in the context of the flash loan example—​can be implemented as follows:

1.  When the borrower calls `take_loan()`, they are given the funds that they wish to borrow as well as a transient non-fungible token which contains information on how much tokens they wanted to borrow. The transient non-fungible badge can not be deposited into any vault as its transient. Thus, if the borrower acts maliciously and decides to not return the tokens, they would be stopped by the radix-engine as they would be able to deposit the tokens into their vault, but would not be able to deposit the transient token into their vault. Thus, leading the transaction to fail—​with a `ResourceCheckFailure`--as the transient badge would remain in the transaction worktop. Transactions in Radix work on all-or-nothing-basis. Meaning, if the entirety of the transaction does not succeed, then the entirety of the transaction will fail. Thus, even if they had "deposited" the borrowed tokens into their vault, the transaction failure—​lead by the transient badge not being deposited—​would essentially "reverse" the history and bring the state back to before the tokens were deposited.

2.  Once the funds are in the borrower’s transaction worktop, they can do with them as they wish. They can send them to somebody else, they can exchange them on a decentralized exchange, or they can even deposit the borrowed funds into their own account component. However, by the end of the transaction if they do not pay it back, the transient badge will remain in their transaction worktop which will cause the transaction to fail. For the transaction to succeed, the funds must be returned back to the component by calling the `repay_loan()` method. Just like `take_loan()` gave the caller the funds and the transient badge, `repay_loan()` takes the funds and the transient badge back. Once the method gets the funds and the transient non-fungible tokens back, it checks the data on the transient badge to ensure that the loan was paid back in full in the correct expected token. Only when this happens would the transient badge be burned and the transaction allowed to continue.

``` rust
use scrypto::prelude::*;

#[derive(NonFungibleData, ScryptoSbor)]
pub struct LoanDue {
    pub amount_due: Decimal,
}

#[blueprint]
mod basic_flash_loan {
    struct BasicFlashLoan {
        loan_vault: Vault,
        transient_resource_manager: ResourceManager,
    }

    impl BasicFlashLoan {
        pub fn instantiate_default(initial_liquidity: Bucket) -> Global<BasicFlashLoan> {
            // - snip -
            // Define a "transient" resource which can never be deposited once created.
            let transient_token_manager = ResourceBuilder::new_ruid_non_fungible::<LoanDue>(OwnerRole::None)
                .metadata(metadata!
                    init {
                        "name" => "Promise token for BasicFlashLoan - must be returned to be burned!", locked;
                    }
                )
                .mint_roles(mint_roles!(
                    minter => rule!(require(global_caller(component_address)));
                    minter_updater => rule!(deny_all);
                )) // #1
                .burn_roles(burn_roles!(
                    burner => rule!(require(global_caller(component_address)));
                    burner_updater => rule!(deny_all);
                )) // #1
                .deposit_roles(deposit_roles!(
                    depositor => rule!(deny_all);
                    depositor_updater => rule!(deny_all);
                )) // #1
                .create_with_no_initial_supply();

            Self {
                loan_vault: Vault::with_bucket(initial_liquidity),
                transient_resource_manager: transient_token_manager,
            }
            .instantiate()
            .prepare_to_globalize(OwnerRole::None)
            .globalize()
        }

        pub fn take_loan(&mut self, loan_amount: Decimal) -> (Bucket, Bucket) {
            assert!(
                loan_amount <= self.loan_vault.amount(),
                "Not enough liquidity to supply this loan!"
            );

            // Calculate how much we must be repaid
            let amount_due = loan_amount * dec!("1.001"); // #2

            let loan_terms = self.transient_resource_manager
                .mint_uuid_non_fungible( // #2
                        LoanDue {
                            amount_due: amount_due,
                        },
                    );
            (self.loan_vault.take(loan_amount), loan_terms)
        }

        pub fn repay_loan(&mut self, loan_repayment: Bucket, loan_terms: Bucket) {
            assert!(
                loan_terms.resource_address()
                == self.transient_resource_manager.resource_address(),
                "Incorrect resource passed in for loan terms"
            );

            // Verify we are being sent at least the amount due
            let terms: LoanDue = loan_terms.as_non_fungible().non_fungible().data();
            assert!(
                loan_repayment.amount() >= terms.amount_due,
                "Insufficient repayment given for your loan!"
            );

            self.loan_vault.put(loan_repayment);
            // We have our payment; we can now burn the transient token
            loan_terms.burn(); // #3
        }
    }
}
```

1.  Since this is a transient non-fungible badge, it can be minted and burned, but can not be deposited into any vault by anybody, including the admin badge.

2.  Minting a transient non-fungible token which contains the loan terms.

3.  With the token being paid back in full, the transient resource may now be burned to allow the transaction to continue.

This pattern is very powerful and allows for a large degree of control over the transaction by the blueprint creator. The general rule of this pattern is: you can use this pattern when you wish for two or more methods to be called in a specific order—​defined by you, the blueprint developer—​in the same transaction.







The above diagram showcases how this pattern can be used to ensure that n methods will be called in the same transaction and how the different transient badges involved will be handled. Each method takes in the transient badge produced by the method before it, burns it, and creates a new transient badge which may only be burned by the method that follows it. If the transaction does not get to the last method, it fails due to the characteristics of transient resources. If the transaction gets to the last method, then the last transient badge is burned, and the caller is allowed to proceed freely.

## Examples

- <a href="https://github.com/radixdlt/scrypto-examples/tree/main/defi/basic-flash-loan" target="_blank">Basic Flash Loan</a>
