---
title: "Manifest Builder"
---

:::note
**>
Examples

**

Examples of the Rust Manifest Builder can be found in the <a href="https://github.com/radixdlt/experimental-examples/tree/main/manifest-builder">experimental-examples repository</a>.
:::


You may also wish to read the <a href="https://docs.rs/radix-transactions/latest/radix_transactions/builder/struct.ManifestBuilder.html">ManifestBuilder rust docs on docs.rs</a>.

This page will provide information on how to use the Rust `ManifestBuilder`. The Rust `ManifestBuilder` is used to easily write transaction manifests without leaving the Rust environment when building your Scrypto package. This page is structured by first teaching you how to import the `ManifestBuilder` module in your Rust file to begin working with the `ManifestBuilder`. Then go over a few examples to familiarize the structure of creating transaction manifests with the `ManifestBuilder`, provide how to generate a manifest String with an .rtm file format for transaction submission, and reference table for each ManifestBuilder method.

## Importing the Rust ManifestBuilder

Every Scrypto package generated from `scrypto new-package` will contain a “tests” folder with a `lib.rs` file. This `lib.rs` file will contain the integration tests for your Scrypto package. The generated file already contains the necessary Scrypto crates imports to begin testing and writing transaction manifests which will look like this:

``` rust
use scrypto::prelude::*;
use scrypto_test::{prelude::*, utils::dump_manifest_to_file_system};

use hello_token::test_bindings::*;
```

Particularly, with the ManifestBuilder module imported, we can now easily create transaction manifests.

## Writing Manifests with the ManifestBuilder

We’ll provide a few examples to help familiarize the general structure of writing manifests with the `ManifestBuilder`. However, it’s worth noting that the general structure will consist of:

1.  Creating a new instance of the `ManifestBuilder` using `ManifestBuilder::new()`

2.  Chaining together a series of instructions for the transaction manifest.

3.  Calling `.build()` as the last method to build the transaction manifest.

### Calling a Function and Instantiating a Package

``` rust
let manifest = ManifestBuilder::new()  // #1
    .lock_fee_from_faucet()
    .call_function(  // #2
        package_address,
        "Hello",
        "instantiate_hello",
        manifest_args!(),  // #3
    )
    .build();  // #4
```

1.  To create a new instance of the `ManifestBuilder`.

2.  The `call_function` method is one of several methods the `ManifestBuilder` provides to assist us with writing manifest instructions.

3.  The `manifest_args!()` is a macro which we can use to conveniently pass in function and method arguments. As of RCnet v3, it is optional, and a tuple (…​,) can be used for arguments instead. Be careful if using tuples that singleton tuples will require a trailing comma.

4.  At the end of the list of manifest instructions, we call the `.build()` method to generate a `TransactionManifest`.

### Method Calls

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .call_method(  // #1 
        account_address,
        "withdraw",
        (
            resource_address,  // #2
            amount,
        )
    )
    .call_method(  // #3
        account_address,
        "deposit_batch",
        (
            ManifestExpression::EntireWorktop,  // #4
        )
    )
    .build();
```

1.  `call_method` is another method `ManifestBuilder` provides. This method is an instruction to perform a method call.

2.  We can pass in several arguments for our method call with different types with each argument separated by commas.

3.  We can chain multiple manifest instructions together within a `TransactionManifest`.

4.  We can pass expressions as arguments as well. More info [here](/v1/docs/specifications)

### Special Account Methods

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(  // #1
        account_address,
        resource_address,
        amount
    )
    .try_deposit_batch_or_abort(account_address)  // #2
        .build();
```

1.  The `ManifestBuilder` also provides several methods to easily call account component methods.

2.  try_deposit_batch_or_abort is also another convenient account method we can use.

The `call_method` provided by the `ManifestBuilder` allows us to flexibly write component method call instructions. However, accounts on Radix are native and the `ManifestBuilder` gives us special methods as a convenience to call account component methods.

### Using the Worktop

The `ManifestBuilder` has several worktop methods we can use to account and manage asset flows between component method calls.

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(10)
    )
    .take_all_from_worktop(  // #1
        resource_address,
        "bucket"  // #2
    )
    .deposit(account_address, "bucket")
    .build();
```

1.  `take_all_from_worktop` is one of several methods the `ManifestBuilder` offers to allow us to easily work with assets returned to the worktop from component method calls.

2.  The `take_all_from_worktop` method has a second argument which requires us to pass a name for the `Bucket` which will hold our resource to create a named `Bucket`.

### Resolving Named Buckets and Proofs

Using the `ManifestBuilder` provides convenient methods to retrieve resources from the worktop or pop a `Proof` from the `AuthZone` to create named buckets and proofs. These are named because we want to refer to them later on by passing them as arguments to methods. Some methods provided by the `ManifestBuilder` conveniently allow you to pass named buckets and proofs that were previously created. For example, we can withdraw a resource from an account, take the resource from the worktop, and deposit it into an account like so:

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(10)
    )
    .take_all_from_worktop(resource_address, "bucket")
    .deposit(account_address, "bucket")  // #1
    .build();
```

1.  The `deposit` method provides clean and convenient way to resolve named buckets.

However, particularly when it comes to passing arguments to a `call_method` or `call_function`, it’s not as convenient. Therefore, we need to use a lookup function to resolve these named buckets and proofs by using `with_name_lookup` methods.

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(1)
    )
    .take_all_from_worktop(
        resource_address,
        "payment_bucket"
    )
    .call_method_with_name_lookup(  // #1
        component_address,
        "buy_gumball",
        |lookup| (  // #2
            lookup.bucket("payment_bucket"),  // #3
        )
    )
    .deposit_batch(account_address)
    .build();
```

1.  Using `call_method_with_name_lookup` allows us to pass named argument such as the named "payment_bucket" we created.

2.  `lookup` is an arbitrary variable we’re using to create our callback function which allows us to resolve our named buckets and proofs.

3.  By using `lookup.bucket()` and passing `"payment_bucket"`, we can pass it as an argument and resolve the Bucket we created earlier.

### Using the AuthZone

The `AuthZone` has similar mechanics to the worktop where there are things pushed to this layer, except, instead of resources, they are proofs. Most `Proof` creation methods are automatically pushed to the worktop and popping a `Proof`, from the `AuthZone` requires the `Proof` to be named, much like taking resources from the worktop and into a `Bucket`.

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .pop_from_auth_zone("proof")  // #1
    .call_method_with_name_lookup(
        component_address,
        "method_requiring_named_proof",
        |lookup| (
            lookup.proof("proof"),
        )
    )
    .deposit_batch(account_address)
    .build();
```

1.  Similar to taking resources from the worktop and placing them in a named `Bucket`, popping a `Proof` from the `AuthZone` will require you to name it (e.g "proof").

#### Creating Named Proofs

The `ManifestBuilder` offers instructions to create named proofs. These named proofs are not automatically pushed to the `AuthZone` and must manually be pushed to the `AuthZone` or be passed into an argument of a method call.

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .create_proof_from_auth_zone_of_amount(
        resource_address,
        dec!(1),
        "proof"  // #1
    )
    .push_to_auth_zone("proof")  // #2
    .build();
```

1.  Creating a named `Proof` called `"proof"`.

2.  Manually pushing the named `"proof"` to the `AuthZone`.

## Common Transaction Manifest Instructions

### Transferring Tokens Between Accounts

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(100)
    )
    .call_method(  // #1
        account_address2,
        "try_deposit_batch_or_abort",
        manifest_args!(
            ManifestExpression::EntireWorktop
        )
    )
    .build();
```

1.  Previously, we’ve been using `.deposit_batch` method to conveniently deposit any resources from the worktop to an account. However, since accounts are also components, we can use .call_method to interact with accounts (accounts are components on Radix after all).

### Transferring Tokens to Multiple Accounts

We want to withdraw tokens (resources) from an account, equally split them, and send them to two accounts. To do that, we can use the `.take_from_worktop` method to specify how many tokens we would like to deposit into each account.

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(  // #1
        account_address,
        resource_address,
        dec!(200)  
    )
    .take_from_worktop(  // #2
        resource_address,
        dec!(100),
        "bucket1"
    )
    .take_all_from_worktop(  // #3
        resource_address,
        "bucket2"
    )
    .try_deposit_or_abort( // #4
        account_1_address,
        "bucket1"
    )
    .try_deposit_or_abort(
        account_2_address,
        "bucket2"
    )
    .build();
```

1.  We are withdrawing 200 tokens from an account to the worktop.

2.  The first `.take_from_worktop` instruction takes 100 of the 200 tokens on the worktop and puts them into a `Bucket` named `bucket1`.

3.  Since we know the remainder of tokens on the worktop, we can simply use `.take_all_from_worktop` and place in a `Bucket` named `bucket2`.

4.  Then we can start depositing the buckets into the other accounts passing our named buckets in with the account address we wish to send to.

### Exporting TransactionManifest as a String to an .rtm File Format

Building a transaction on the Radix Network require a transaction manifest to describe the intent of resource movement between component. Therefore, the `scrypto_unit` module provides a convenient function: `dump_manifest_to_file_system`, to generate a transaction manifest file as a `.rtm` file format. Additionally, using this function also comes with a convenient feature to statically validate the transaction manifest before it is converted to a manifest `String`.

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(10)
    )
    .try_deposit_batch_or_abort(account_address);

// This generates the .rtm file of the Transaction Manifest.
dump_manifest_to_file_system(  // #1
    manifest.object_names(),   // #2
    &manifest.build(),         // #3
    "./transaction-manifest",  // #4
    Some("manifest_name"),     // #5 
    &NetworkDefinition::simulator()  // #6
).err();  // #6
```

1.  We are using `dump_manifest_to_file_system` to generate a transaction manifest `String` as an `.rtm` file based on the reference of the manifest we created.

2.  Calling `object_names` returns `ManifestObjectNames` to provide the function tracking of named buckets and proofs (if available).

3.  Takes a reference of the built `TransactionManifest`.

4.  Specifying the path directory where this `.rtm` file will be generated, if the directory does not exist, then it will be created.

5.  Specifying the Transaction Manifest name.

6.  Specifying the network which entity addresses will be encoded to. Please see [addressing page](/v1/docs/addressing-on-radix) for reference.

7.  Generates an error if the transaction manifest is statically invalid.

Calling the `dump_manifest_to_file_system` function will generate an `.rtm` file in the `./transaction-manifest` directory which will look like this:

``` bash
CALL_METHOD
    Address("component_sim1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxhkrefh")
    "lock_fee"
    Decimal("5000")
;
CALL_METHOD
    Address("account_sim1c8ng5f2pmcxart0t5y9gftcymuzpkaytavy852mx74txkqamfp9y8w")
    "withdraw"
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    Decimal("10")
;
CALL_METHOD
    Address("account_sim1c8ng5f2pmcxart0t5y9gftcymuzpkaytavy852mx74txkqamfp9y8w")
    "try_deposit_batch_or_abort"
    Expression("ENTIRE_WORKTOP")
;
```

:::note
The entity addresses encoded in your `.rtm` file will look different based on the addresses inputted and the network specified to be encoded to.
:::


## Rust ManifestBuilder Methods

The list below provides the method name, summary and example for each of the methods the Rust ManifestBuilder supports.

If you feel more at home in Rust Docs you can check out the `ManifestBuilder` <a href="https://docs.rs/scrypto-test/latest/scrypto_test/prelude/struct.ManifestBuilder.html" target="_blank">here</a>.

### Account, Identity, AccessController



`new_account`



Creates a new account native component.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .new_account()
    .build();
```







`new_account_advanced`



Creates a new account with specified `OwnerRole`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .new_account_advanced(
        OwnerRole::Updatable(
            rule!(resource_address)
        )
    )
    .build();
```







`withdraw_from_account`



Withdraws a specified fungible resource from an account component and places into the worktop.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(1)
    )
    .deposit_batch(account_address)
    .build();
```







`withdraw_non_fungibles_from_account`



Withdraws a specified non-fungible resource from an account component and places into the worktop.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_non_fungibles_from_account(
        account_address,
        resource_address,
        indexset!(NonFungibleLocalId::integer(1), NonFungibleLocalId::integer(2))
    )
    .deposit_batch(account_address)
    .build();
```







`burn_in_account`



Burns a fungible resource with a burnable resource behavior within the account.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .burn_in_account(
        account_address,
        resource_address,
        dec!(1)
    )
    .build();
```







`deposit_batch`



Drains all resources from the worktop and deposits all into a specified account component.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(1)
    )
    .deposit_batch(account_address)
    .build();
```







`try_deposit_batch_or_abort`



Attempts to deposit a `Bucket` of resource to an `account` or aborts the transaction if the `account` does not allow the resource to be deposited.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(1)
    )
    .try_deposit_batch_or_abort(account_address)
    .build();
```







`try_deposit_batch_or_refund`



Attempts to deposit a `Bucket` of `resource` to an `account` or returns the `Bucket` of `resource` to the originator if the `account` does not allow the `resource` to be deposited.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(1)
    )
    .try_deposit_batch_or_refund(account_address)
    .build();
```







`create_identity_advanced`



Creates an`identity`native component with an owner role configuration.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_identity_advanced(
        OwnerRole::Fixed(
            rule!(require(resource_address)
        )
    )
    .build();
```







`create_identity`



Creates an `identity` native component.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_identity()
    .deposit_batch(account_address)
    .build();
```







`create_access_controller`



Creates an access controller native component with the controlled resource and specified authority roles.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(1)
    )
    .take_from_worktop(
        resource_address,
        dec!(1),
        "bucket"
    )
    .create_access_controller(
        "bucket",
        rule!(require(primary_role_bage)),
        rule!(require(recovery_role_badge)),
        rule!(require(confirmation_role_bage)),
        None
    )
    .build();
```





### Call Function and Call Method



`call_function`



Calls a function where the arguments should be an array of encoded Scrypto value.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .call_function(
        package_address,
        "Hello",
        "instantiate_hello",
        manifest_args!()
    )
    .build();
```







`call_function_with_name_lookup`



Calls a function with a `lookup` callback function to resolve named `Bucket` or `Proof`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .pop_from_auth_zone("proof")
    .call_function_with_name_lookup(
        package_address,
        "ExampleBlueprint",
        "instantiate",
        |lookup| (
            lookup.proof("proof"),
        )
    )
    .deposit_batch(account_address)
    .build();
```







`call_method`



Calls a component method

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .call_method(
        component_address,
        "mint",
        manifest_args!()
    )
    .deposit_batch(account_address)
    .build();
```







`call_method_with_name_lookup`



Calls a method with a `lookup` callback function to resolve named `Bucket` or `Proof`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .pop_from_auth_zone("proof")
    .call_method_with_name_lookup(
        component_address,
        "method_requiring_named_proof",
        |lookup| (
            lookup.proof("proof"),
        ),
    )
    .deposit_batch(account_address)
    .build();
```





### Worktop



`take_all_from_worktop`



Take all of a specified resource from the worktop and place into a `Bucket`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(10)
    )
    .take_all_from_worktop(resource_address, "bucket")
    .deposit(account_address, "bucket")
    .build();
```







`take_from_worktop`



Takes a resource from a worktop and place into a `Bucket`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(10)
    )
    .take_from_worktop(
        resource_address,
        dec!(10),
        "bucket")
    .deposit(account_address, "bucket")
    .build();
```







`take_non_fungibles_from_worktop`



Takes specified non-fungibles from the worktop and puts into a `Bucket`

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_non_fungibles_from_account(
        account_address,
        resource_address,
        indexset!(NonFungibleLocalId::integer(1))
    )
    .take_non_fungibles_from_worktop(
        resource_address,
        indexset!(NonFungibleLocalId::integer(1)),
        "bucket"
    )
    .deposit(account_address, "bucket")
    .build();
```







`return_to_worktop`



Returns a resource back to the worktop.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(10)
    )
    .take_all_from_worktop(
        resource_address,
        "bucket"
    )
    .return_to_worktop("bucket")
    .deposit_batch(account_address)
    .build();
```







`assert_worktop_contains`



Asserts the worktop contains a particular resource.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(10)
    )
    .assert_worktop_contains(
        resource_address,
        dec!(10)
    )
    .deposit_batch(account_address)
    .build();
```







`assert_worktop_contains_any`



Asserts the worktop contains a specified resource of any amount.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(10)
    )
    .assert_worktop_contains_any(resource_address)
    .deposit_batch(account_address)
    .build();
```







`assert_worktop_contains_non_fungibles`



Asserts the worktop contains specified non-fungibles.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_non_fungibles_from_account(
        account_address,
        resource_address,
        indexset!(NonFungibleLocalId::integer(1))
    )
    .assert_worktop_contains_non_fungibles(
        resource_address,
        indexset!(NonFungibleLocalId::integer(1))
    )
    .deposit_batch(account_address)
    .build();
```







`burn_from_worktop`



Burns a `Bucket` of resource with a burnable resource behavior.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(1)
    )
    .take_from_worktop(
        resource_address,
        dec!(1),
        "bucket"
    )
    .burn_resource("bucket")
    .build();
```







`burn_all_from_worktop`



Burns all resources in the worktop.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(100)
    )
    .burn_all_from_worktop(resource_address)
    .build();
```







`burn_non_fungible_from_worktop`



Burns a non-fungible resource from worktop.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_non_fungibles_from_account(
        account_address,
        resource_address,
        indexset!(NonFungibleLocalId::integer(1))
    )
    .burn_non_fungible_from_worktop(non_fungible_global_id);
```





### AuthZone



`pop_from_auth_zone`



Pops the last `Proof` entered to the `AuthZone`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .pop_from_auth_zone("proof")
    .drop_proof("proof")
    .build();
```







`push_to_auth_zone`



Pushes a named `Proof` back into the `AuthZone`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(1)
    )
    .take_from_worktop(
        resource_address,
        dec!(1),
        "bucket"
    )
    .create_proof_from_bucket_of_amount(
        "bucket",
        dec!(1),
        "proof"
    )
    .push_to_auth_zone("proof")
    .call_method(
        component_address,
        "authorized_method",
        manifest_args!()
    )
    .pop_from_auth_zone("popped_proof")
    .drop_proof("popped_proof")
    .deposit(account_address, "bucket")
    .build();
```







`clear_auth_zone`



Clears the `AuthZone` of all proofs.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .clear_auth_zone()
    .build();
```





### Proof



`create_proof_from_bucket_of_amount`



Creates a specified number of proofs from a named `Bucket` containing a fungible resource.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(1)
    )
    .take_from_worktop(
        resource_address,
        dec!(1),
        "bucket"
    )
    .create_proof_from_bucket_of_amount(
        "bucket",
        dec!(1),
        "proof"
    )
    .call_method_with_name_lookup(
        component_address,
        "method_requiring_named_proof",
        |lookup| (
            lookup.proof("proof"),
        ),
    )
    .deposit(account_address, "bucket")
    .build();
```







`create_proof_from_bucket_of_non_fungibles`



Create a `Proof` from a named `Bucket` containing a non-fungible resource.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_non_fungibles_from_account(
        account_address,
        resource_address,
        indexset!(
            NonFungibleLocalId::integer(1),
        )
    )
    .take_non_fungibles_from_worktop(
        resource_address,
        indexset!(
            NonFungibleLocalId::integer(1)
        ),
        "bucket"
    )
    .create_proof_from_bucket_of_non_fungibles(
        "bucket",
        indexset!(
            NonFungibleLocalId::integer(1)
        ),
        "proof"
    )
    .call_method_with_name_lookup(
        component_address,
        "method_requiring_named_proof",
        |lookup| (
            lookup.proof("proof"),
        ),
    )
    .deposit(account_address, "bucket")
    .build();
```







`create_proof_from_bucket_of_all`



Create a composite `Proof` of all amount of resource contained within a `Bucket`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        resource_address,
        dec!(1)
    )
    .take_all_from_worktop(
        resource_address,
        "bucket"
    )
    .create_proof_from_bucket_of_all(
        "bucket",
        "proof"
    )
    .call_method_with_name_lookup(
        component_address,
        "method_requiring_named_proof",
        |lookup| (
            lookup.proof("proof"),
        ),
    )
    .deposit(account_address, "bucket")
    .build();
```







`clone_proof`



Clones a named `Proof`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .pop_from_auth_zone("proof")
    .clone_proof(
        "proof",
        "cloned_proof"
    )
    .clear_auth_zone()
    .drop_all_proofs()
    .build();
```







`drop_proof`



Drops a single named `Proof`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .pop_from_auth_zone("proof")
    .drop_proof("proof")
    .build();
```







`drop_all_proofs`



Drops all named proofs.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(2)
    )
    .drop_all_proofs()
    .build();
```







`create_proof_from_account_of_amount`



Creates a specified number of `proof`'s of a specified resource from an `account` component and push to the `AuthZone`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account(
        account_address,
        resource_address,
        dec!(1)
    )
    .build();
```







`create_proof_from_account_of_non_fungibles`



Creates a `Proof` for each specified non-fungibles.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_non_fungibles(
        account_address,
        resource_address,
        indexset!(NonFungibleLocalId::integer(1))
    )
    .build();
```







`create_proof_from_auth_zone_of_amount`



Creates a named `Proof` of an existing `Proof` from the `AuthZone`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .create_proof_from_auth_zone_of_amount(
        resource_address,
        dec!(1),
        "proof"
    )
    .push_to_auth_zone("proof")
    .call_method(
        component_address,
        "authorized_method_requiring_two_proofs",
        manifest_args!()
    )
    .clear_auth_zone()
    .build();
```







`create_proof_from_auth_zone_of_non_fungibles`



Create a named `Proof` from a specified non-fungible `Proof` that is currently in the `AuthZone`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_non_fungibles(
        account_address,
        resource_address,
        indexset!(NonFungibleLocalId::integer(1))
    )
    .create_proof_from_auth_zone_of_non_fungibles(
        resource_address,
        indexset!(NonFungibleLocalId::integer(1)),
        "proof"
    )
    .push_to_auth_zone("proof")
    .call_method(
        component_address,
        "authorized_method_requiring_two_proofs",
        manifest_args!()
    )
    .clear_auth_zone()
    .build();
```







`create_proof_from_auth_zone_of_all`



Creates a named `Proof` from all proofs that are currently in the `AuthZone`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .create_proof_from_auth_zone_of_all(
        resource_address,
        "proof"
    )
    .push_to_auth_zone("proof")
    .call_method(
        component_address,
        "authorized_method_requiring_two_proofs",
        manifest_args!()
    )
    .clear_auth_zone()
    .build();
```





### Resources and Badges



`create_fungible_resource`



Create a fungible resource with configuration for divisibility, metadata, roles, and an optional initial supply.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_fungible_resource(
        OwnerRole::None,
        false,
        0u8,
        FungibleResourceRoles {
            mint_roles: mint_roles!(
                minter => rule!(allow_all);
                minter_updater => rule!(deny_all);
            ),
            burn_roles: None,
            freeze_roles: None,
            recall_roles: None,
            withdraw_roles: None,
            deposit_roles: None
        },
        Default::default(),
        Some(dec!(1000))
    )
    .deposit_batch(account_address)
    .build();
```







`create_non_fungible_resource`



Create a non-fungible resource with configuration for `NonFungibleLocalIdType`, `metadata`, `roles`, and an optional initial supply. First declare the `struct NFT` and specify the `<T, V>` arguments.

**Example**

``` rust
#[derive(ScryptoSbor, NonFungibleData, ManifestSbor)]
pub struct NFTData {
    name: String,
    ...
}

let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_non_fungible_resource(
        OwnerRole::None,
        NonFungibleIdType::Integer,
        false,
        NonFungibleResourceRoles {
            mint_roles: mint_roles!(
                minter => rule!(allow_all);
                minter_updater => rule!(deny_all);
            ),
            burn_roles: None,
            freeze_roles: None,
            recall_roles: None,
            withdraw_roles: None,
            deposit_roles: None,
            non_fungible_data_update_roles: None
        },
        Default::default(),
        Some(
            [(
                NonFungibleLocalId::integer(1),
                NFTData { 
                    name: "Bob".to_owned(),
                }
            )]
        )
    )
    .deposit_batch(account_address)
    .build();
```

To create a non-fungible resource with no initial supply

**Example**

``` rust
#[derive(ScryptoSbor, NonFungibleData, ManifestSbor)]
pub struct NFTData {
    name: String,
    key_image_url: Url,
    ...
}

...

let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_non_fungible_resource::<Vec<_>, NFTData>(
        OwnerRole::None,
        NonFungibleIdType::Integer,
        false,
        NonFungibleResourceRoles {
            mint_roles: mint_roles!(
                minter => rule!(allow_all);
                minter_updater => rule!(deny_all);
            ),
            burn_roles: None,
            freeze_roles: None,
            recall_roles: None,
            withdraw_roles: None,
            deposit_roles: None,
            non_fungible_data_update_roles: None
        },
        Default::default(),
        None
    )
    .deposit_batch(account_address)
    .build();
```







`create_ruid_non_fungible_resource`



Create a non-fungible resource with a `NonFungibleLocalId::RUID`, `metadata`, `roles`, and an optional initial supply.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_ruid_non_fungible_resource(
        OwnerRole::None,
        false,
        Default::default(),
        NonFungibleResourceRoles {
            mint_roles: mint_roles!(
                minter => rule!(allow_all);
                minter_updater => rule!(deny_all);
            ),
            burn_roles: None,
            freeze_roles: None,
            recall_roles: None,
            withdraw_roles: None,
            deposit_roles: None,
            non_fungible_data_update_roles: None
        },
        Some([Nft { name: "Bob".to_owned() }])
    )
    .deposit_batch(account_address)
    .build();
```







`new_token_mutable`



Creates a fungible resource with a mutable supply.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .new_token_mutable(
        Default::default(),
        AccessRule::AllowAll
    )
    .build();
```







`new_token_fixed`



Creates a fungible resource with a fixed supply.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .new_token_fixed(
        OwnerRole::None,
        Default::default(),
        dec!(1000)
    )
    .deposit_batch(account_address)
    .build();
```







`new_badge_mutable`



Creates a badge resource with an updatable `OwnerRole` and specified initial supply.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .new_badge_mutable(
        Default::default(),
        AccessRule::AllowAll
    )
    .build();
```







`new_badge_fixed`



Creates a badge resource with a specified `OwnerRole` and initial supply.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .new_badge_fixed(
        OwnerRole::None,
        Default::default(),
        dec!(1)
    )
    .deposit_batch(account_address)
    .build();
```







`mint_fungible`



Mints a fungible resource of a specified amount and places into the worktop.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .mint_fungible(
        resource_address,
        dec!(100)
    )
    .deposit_batch(account_address)
    .build();
```







`mint_non_fungible`



Mints a non-fungible resource with a specified non-fungible id and non-fungible data then places into the worktop.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .mint_non_fungible(
        resource_address,[(NonFungibleLocalId::integer(1), Nft { name: "Bob".into() })])
    .deposit_batch(account_address)
    .build();
```







`mint_ruid_non_fungible`



Mints a `RUID` id type non-fungible resource with a specified non-fungible data and pre-determined non-fungible id then places into the worktop.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .mint_ruid_non_fungible(
        resource_address,
        [Nft { name: "Bob".into() }]
    )
    .deposit_batch(account_address)
    .build();
```







`recall`



Retrieves a fungible resource with a recallable resource behavior from a specified `Vault`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .recall(
        vault_id,
        dec!(1)
    )
    .deposit_batch(account_address)
    .build();
```







`recall_non_fungibles`



Retrieves a non-fungible resource with a recallable resource behavior from a specified `Vault`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .recall_non_fungibles(
        vault_id,
        indexset!(NonFungibleLocalId::integer(1))
    )
    .deposit_batch(account_address)
    .build();
```







`freeze_withdraw`



Freezes withdrawal of a resource with a freezable resource behavior from a specified `Vault`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .freeze_withdraw(vault_id)
    .build();
```







`unfreeze_withdraw`



Unfreezes withdrawal of a resource with a freezable resource behavior from a specified `Vault`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .unfreeze_withdraw(vault_id)
    .build();
```







`freeze_deposit`



Freezes deposit of a resource with a freezable resource behavior from a specified `Vault`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .freeze_deposit(vault_id)
    .build();
```







`unfreeze_deposit`



Unfreezes deposit of a resource with a freezable resource behavior from a specified `Vault`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .unfreeze_deposit(vault_id)
    .build();
```







`freeze_burn`



Freezes burn functionality of a resource with a freezable resource behavior from a specified `Vault`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .freeze_burn(vault_id)
    .build();
```







`unfreeze_burn`



Unfreezes burn functionality of a resource with a freezable resource behavior from a specified `Vault`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .unfreeze_burn(vault_id)
    .build();
```





### Lock Fee



`lock_fee`



Locks a specified amount from an account’s `Vault` with `XRD` for fee payment.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee(
        account_address,
        dec!(1)
    )
    .build();
```







`lock_standard_fee`



Locks the standard testing fee from the account’s `Vault` with `XRD`.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_standard_test_fee(account_address)
    .build();
```







`lock_fee_from_faucet`



Locks the standard testing fee from the system faucet.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .build();
```







`lock_fee_and_withdraw`



Locks a specified amount of `XRD` from an `account` for fee payment and `withdraw` a specified resource and amount to the worktop.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_and_withdraw(
        account_address,
        dec!(1),
        resource_address,
        dec!(10)
    )
    .deposit_batch(account_address)
    .build();
```







`lock_fee_and_withdraw_non_fungibles`



Locks a specified amount of `XRD` from an `account` for fee payment and `withdraw` specified non-fungibles to the worktop.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_and_withdraw_non_fungibles(
        account_address,
        dec!(10),
        resource_address,
        indexset!(NonFungibleLocalId::integer(1))
    )
    .deposit_batch(account_address)
    .build();
```





### Validator



`stake_validator`



Stakes a `Bucket` of `XRD` to a validator.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        RADIX_TOKEN,
        dec!(100)
    )
    .take_all_from_worktop(
        RADIX_TOKEN,
        "bucket"
    )
    .stake_validator(
        validator_address,
        "bucket"
    )
    .build();
```







`unstake_validator`



Unstakes a `Bucket` of `XRD` from a validator.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .withdraw_from_account(
        account_address,
        stake_units,
        dec!(100)
    )
    .take_all_from_worktop(
        stake_units,
        "bucket"
    )
    .unstake_validator(
        validator_address,
        "bucket"
    )
    .build();
```





### Royalty



`claim_package_royalty`



Claim royalty from a blueprint package.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_non_fungibles(
        account_address,
        resource_address,
        indexset!(NonFungibleLocalId::integer(1))
    )
    .claim_package_royalties(package_address)
    .deposit_batch(account_address)
    .build();
```







`set_component_royalty`



Updates a component method royalty configuration.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .set_component_royalty(
        component_address,
        "mint",
        RoyaltyAmount::Xrd(dec!(1))
    )
    .build();
```







`lock_component_royalty`



Lock a component’s method royalty configuration.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .lock_component_royalty(
        component_address,
        "mint",
    )
    .build();
```







`claim_component_royalty`



Claim royalty from a global component.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .claim_component_royalties(component_address)
    .deposit_batch(account_address)
    .build();
```





### Role



`set_owner_role`



Configures an owner role of a global entity (e.g `PackageAddress`, `ComponentAddress`, `ResourceAddress`).

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .set_owner_role(
        component_address,
        rule!(require(resource_address))
    )
    .build();
```







`update_role`



Updates a role’s `AccessRule` of a specified global entity.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .update_role(
        component_address,
        ObjectModuleId::Main,
        RoleKey::from("admin"),
        rule!(require(resource_address))
    )
    .build();
```







`get_role`



Retrieve’s a role’s `AccessRule` of a specified global entity.

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .get_role(
        component_address,
        ObjectModuleId::Main,
        RoleKey { key: "admin".to_string() }
    )
    .build();
```





### Metadata



`set_metadata`



Sets a metadata field of a global entity (e.g `PackageAddress`, `ComponentAddress`, `ResourceAddress`).

**Example**

``` rust
let manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .set_metadata(
        component_address,
        "name",
        MetadataValue::String("HelloComponent".into())
    )
    .build();
```







`lock_metadata`



Lock’s a global entity’s `metadata` from being updated.

**Example**

``` rust
let  manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .lock_metadata(component_address, "name");
```







`freeze_metadata`



Freezes a global entity’s `metadata` from being updated.

**Example**

``` rust
let  manifest = ManifestBuilder::new()
    .lock_fee_from_faucet()
    .create_proof_from_account_of_amount(
        account_address,
        resource_address,
        dec!(1)
    )
    .freeze_metadata(
        component_address,
        "name",
    )
    .build();
```





### Publish Package



`publish_package`



Publish a blueprint package.

**Example**

``` rust
let (code, definition) = Compile::compile(this_package!());

let manifest = ManifestBuilder::new()
    .publish_package(code, definition)
    .deposit_batch(account_address)
    .build();
```







`publish_package_advanced`



Publishes a blueprint package with custom configuration.

**Example**

``` rust
let (code, definition) = Compile::compile(this_package!());

let manifest = ManifestBuilder::new()
    .publish_package_advanced(
        None,
        code,
        definition,
        metadata_init!(),
        OwnerRole::Updatable(rule!(require(resource_address)))
    )
    .build();
```







`publish_package_with_owner`



Publish a blueprint package with a specified owner badge.

**Example**

``` rust
let (code, schema) = Compile::compile(this_package!());

let manifest = ManifestBuilder::new()
    .publish_package_with_owner(
        code,
        schema,
        NonFungibleGlobalId::new(
            resource_address,
            NonFungibleLocalId::integer(1)
        )
    )
    .build();
```




