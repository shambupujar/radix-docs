---
title: "–snip–"
---

It’s time to focus on testing. Thorough testing is essential to ensuring the proper predictable working of any Scrypto packages we write. You may have noticed an example of this in the Hello template used in several previous sections. It has a `test/` directory that holds a `lib.rs` file containing two test functions. These demonstrate two ways to test the Hello blueprint and the two main ways to test any Scrypto package. Here we’ll explain both and show you how to run the tests.

:::note
**The scrypto package referenced in this section can be found in our [official examples here](https://github.com/radixdlt/official-examples/tree/main/step-by-step/19-hello-test**

.)
:::



## Testing Blueprints and Modules

There are two ways to test blueprints and modules, the Ledger Simulator and Test Environment. `LedgerSimulator` is better suited for integration testing, while `TestEnvironment` is more ideal for unit testing.

### Ledger Simulator

The [Ledger Simulator](../scrypto/scrypto-test.md) is an in-memory ledger simulator. Tests interact with the simulator as a user submitting transactions to the network would. This is great for integration and end-to-end testing.

To test in Scrypto, we import `scrypto_test::prelude::*` and the test version of our blueprint. In our case that’s the `hello` blueprint imported with `use hello_test::hello_test`, `hello_test` is the package name followed by the blueprint name, appended with `_test` for the test version of said blueprint. These are imported at the top of our test file:

``` rust
use scrypto_test::prelude::*;

use hello_test::hello_test::*;
```

:::note[Test Module names]
For testing you need to import the test version of packages, appended with `_test`. e.g. to test `example_blueprint` in the `example_package` package you would import it with:

    use example_package::example_blueprint_test::*
:::



To make this import work, we need to add `scrypto_test` to the `Cargo.toml` file:

`toml Cargo.toml [dev-dependencies] scrypto-test = { version = "1.2.0" }`

Where we also need to make sure the `test` feature is enabled:

`toml Cargo.toml [features] default = [] test = []`

Then we can create our simulated ledger. In our case that’s back in the `test/lib.rs` file inside the `test_hello` function:

``` rust
#[test]
fn test_hello() {
    // Setup the ledger
    let mut ledger = LedgerSimulatorBuilder::new().build();
```

In that environment, we create an account:

``` rust
    // Create an account
    let (public_key, _private_key, account) = ledger.new_allocated_account();
```

We then need the package available in the environment:

``` rust
    // Publish package
    let package_address = ledger.compile_and_publish(this_package!());
```

Once we have the package we can test the instantiate function. This is done by:

1.  Building a manifest with the the [ManifestBuilder](../../integrate/rust-libraries/manifest-builder.md):

    ``` rust
        let manifest = ManifestBuilder::new()
            .lock_fee_from_faucet()
            .call_function(
                package_address,
                "Hello",
                "instantiate_hello",
                manifest_args!(),
            )
            .build();
    ```

2.  Submitting the manifest to the ledger:

    ``` rust
        let receipt = ledger.execute_manifest(
            manifest,
            vec![NonFungibleGlobalId::from_public_key(&public_key)],
        );
    ```

3.  Checking the manifest receipt to see if it successfully instantiated a new component, then storing the component address for later use if it did:

    ``` rust
        let component = receipt.expect_commit(true).new_component_addresses()[0];
    ```

With the component in our test environment and its address, we can now test the `free_token` method. A similar 3 steps are followed, but with a different manifest:

1.  Build a manifest:

    ``` rust
     let manifest = ManifestBuilder::new()
         .lock_fee_from_faucet()
         .call_method(component, "free_token", manifest_args!())
         .call_method(
             account,
             "deposit_batch",
             manifest_args!(ManifestExpression::EntireWorktop),
         )
         .build();
    ```

2.  Submit the manifest to the ledger:

    ``` rust
     let receipt = ledger.execute_manifest(
         manifest,
         vec![NonFungibleGlobalId::from_public_key(&public_key)],
     );
    ```

3.  Check the manifest receipt to see if it was successful:

    ``` rust
     receipt.expect_commit_success();
    ```

We do not need to check the return value of the `free_token` method as we are testing the ledger interaction, not the logic of the method. If the method returns an error, the test will fail. Testing the logic of the method is more easily done with `TestEnvironment`.

### Test Environment

The [Test Environment](https://docs.rs/scrypto-test/latest/scrypto-test/) framework is different to the Ledger Simulator. Instead of interacting with the ledger as a user, tests interact as native blueprints. This removes the need for transaction manifests and opens up some extra options unavailable with `LedgerSimulator`. These differences make it better suited for unit testing the logic of a blueprint.

Testing our Hello blueprint with `TestEnvironment` is done with the same test import modules:

``` rust
use scrypto_test::prelude::*;

use hello_test::hello_test::*;
```

Meaning `scrypto-test` is still needed in our `Cargo.toml` file’s dev-dependencies, with the `test` feature enabled:

\`\`\`toml Cargo.toml \[dev-dependencies\] scrypto-test = { version = “1.2.0” }

# –snip–

\[features\] default = \[\] test = \[\]


    We'll use `TestEnvironment` to test the `free_token` method output with a AAA testing pattern: Arrange, Act, Assert.

    In our `test/lib.rs` file, with the modules imported we create a new environment and arrange the conditions for our test by publishing our package and instantiating a new Hello component from it - no manifest required:

    ```rust
    // Arrange
        let mut env = TestEnvironment::new();
        let package_address = PackageFactory::compile_and_publish(this_package!(), &mut env)?;

        let mut hello = Hello::instantiate_hello(package_address, &mut env)?;

This allows us to then perform the action we want to test by calling the method:

``` rust
    // Act
    let bucket = hello.free_token(&mut env)?;
```

The method returns whatever it would on ledger; in this case a bucket. We can now check the amount of tokens in the bucket is what we expect with an assertion:

``` rust
    // Assert
    let amount = bucket.amount(&mut env)?;
    assert_eq!(amount, dec!("1"));
```

If the assertion is incorrect the test will panic and the test will fail. If the assertion is correct we can return an `Ok` (containing an empty value):

``` rust
    Ok(())
```

If you’re wondering about the new syntax, TestEnvironment uses [`Result`](https://doc.rust-lang.org/std/result/) return types for error handling, so we can use the `?` operator to propagate errors up the call stack, and OK to return the function values. In our case we’re just returning `Ok(())`, with an empty value, to indicate the test passed and propagated errors are handled by the test framework.

## Running the Tests

:::note
**Running tests on a scrypto package is simple just follow the instructions here in our [Official Examples on GitHub](https://github.com/radixdlt/official-examples/tree/main/step-by-step/19-hello-test#running-the-tests**

)
:::


