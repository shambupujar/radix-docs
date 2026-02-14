---
title: "This non-fungible token has no data"
---

:::note[Notes]
- Addresses on this page are based on the `simulator` network definition.

- All examples should be compilable, using the `rtmc` CLI. If you spot a broken example, please reach out to the support team on Discord.
:::


## Grammar

Radix transaction manifest adopts a bash-like grammar. Each manifest consists of a sequence of instructions, each of which contains.

- A command for the type of operation

- Zero or more arguments, in [manifest value syntax](manifest-value-syntax.md).

- A semicolon

## Instruction List

The table below shows all the instructions that all currently supported by Radix Engine.

Many instructions, such as `CALL_METHOD` and `CALL_FUNCTION` take arbitrary values - these values can be expressed in [manifest value syntax](manifest-value-syntax.md).

Some instructions are marked as **Added in V2**. These transactions are only available when building manifests for a `TransactionManifestV2` or `SubintentManifestV2`, introduced in Cuttlefish. At Cuttlefish launch, the wallet will only support `TransactionManifestV1`. It will however support `SubintentManifestV2` in pre-authorization requests.

### Bucket Lifecyle



`TAKE_FROM_WORKTOP`



Creates a named bucket with the specified amount of resource on the worktop. It errors if there is insufficient resource available.

If the exact amount of resource is known, this command should be preferred to `TAKE_ALL_FROM_WORKTOP` or `Expression("ENTIRE_WORKTOP")` because it gives clearer static guarantees to the user. If the exact non-fungible ids are known, `TAKE_NON_FUNGIBLES_FROM_WORKTOP` should be used instead, as it is even more specific.

**Example**

``` bash
TAKE_FROM_WORKTOP
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    Decimal("1.0")
    Bucket("xrd_bucket")
;
```







`TAKE_NON_FUNGIBLES_FROM_WORKTOP`



Creates a named bucket with the specified non-fungibles on the worktop. It errors if these are not present on the worktop.

If the exact non-fungibles are known, this command should be preferred to `TAKE_FROM_WORKTOP`, `TAKE_ALL_FROM_WORKTOP` or `Expression("ENTIRE_WORKTOP")` because it gives clearer static guarantees to the user.

**Example**

``` bash
TAKE_NON_FUNGIBLES_FROM_WORKTOP
    Address("resource_sim1n2q4le7dpzucmpnksxj5ku28r3t776pgk879cahgm76c2kfpz48fpj")
    Array<NonFungibleLocalId>(NonFungibleLocalId("#1#"), NonFungibleLocalId("#2#"))
    Bucket("nfts")
;
```







`TAKE_ALL_FROM_WORKTOP`



Creates a named bucket from all of the given resource currently on the worktop.

If the exact non-fungibles are known, prefer `TAKE_NON_FUNGIBLES_FROM_WORKTOP` and if the exact balance is known, prefer `TAKE_FROM_WORKTOP` as these give clearer static guarantees to the user.

**Example**

``` bash
TAKE_ALL_FROM_WORKTOP
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    Bucket("xrd_bucket")
;
```







`RETURN_TO_WORKTOP`



Consumes a named bucket, returning all of its contents to the worktop.

**Example**

``` bash
TAKE_ALL_FROM_WORKTOP
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    Bucket("xrd_bucket")
;
RETURN_TO_WORKTOP
    Bucket("xrd_bucket")
;
```







`BURN_RESOURCE`



Consumes a named bucket, burning all of its contents. This errors if the worktop’s auth zone does not provide authorization for the burn action.

**Example**

``` bash
TAKE_ALL_FROM_WORKTOP
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    Bucket("xrd_bucket")
;
BURN_RESOURCE
    Bucket("xrd_bucket")
;
```





### Resource Assertions



`ASSERT_WORKTOP_CONTAINS_ANY`



Verifies that the worktop contains any non-zero amount of the given fungible or non-fungible resource.

**Example**

``` bash
ASSERT_WORKTOP_CONTAINS_ANY
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
;
```







`ASSERT_WORKTOP_CONTAINS`



Verifies that the worktop contains at least the given (non-zero) amount of the fungible or non-fungible resource, else aborts the transaction.

**Example**

``` bash
ASSERT_WORKTOP_CONTAINS
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    Decimal("1.0")
;
```







`ASSERT_WORKTOP_CONTAINS_NON_FUNGIBLES`



Verifies that the worktop contains the specified non-fungibles, else aborts the transaction.

**Example**

``` bash
ASSERT_WORKTOP_CONTAINS_NON_FUNGIBLES
    Address("resource_sim1n2q4le7dpzucmpnksxj5ku28r3t776pgk879cahgm76c2kfpz48fpj")
    Array<NonFungibleLocalId>(NonFungibleLocalId("#1#"), NonFungibleLocalId("#2#"))
;
```







`ASSERT_WORKTOP_RESOURCES_ONLY` (Added in V2)



Asserts that the worktop’s balance of the specified resources matches the given constraints, and also ensures that all unspecified resources have zero balance.

Use `ASSERT_WORKTOP_RESOURCES_INCLUDE` instead if you want to allow balances of other unspecified resources.

To construct constraints, you may wish to see the definition of `ManifestResourceConstraint` and `GeneralResourceConstraint` <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/develop/radix-common/src/data/manifest/model/manifest_resource_assertion.rs">defined here</a>.

**Example**

``` bash
ASSERT_WORKTOP_RESOURCES_ONLY
    Map<Address, Enum>(
        Address("\${resource_address}") => Enum<ResourceConstraint::NonZeroAmount>(),
    )
;
```







`ASSERT_WORKTOP_IS_EMPTY` (Added in V2 \| alias)



Asserts that the worktop contains no balance of any resource.

This is an alias for `ASSERT_WORKTOP_RESOURCES_ONLY` with an empty map.

**Example**

``` bash
ASSERT_WORKTOP_IS_EMPTY;
```







`ASSERT_WORKTOP_RESOURCES_INCLUDE` (Added in V2)



Asserts that the worktop’s balance of the specified resources matches the given constraints, but permits the worktop to contain non-zero balances of other unspecified resources.

Use `ASSERT_WORKTOP_RESOURCES_ONLY` instead if you want to disallow other unspecified resource balances.

To construct constraints, you may wish to see the definition of `ManifestResourceConstraint` and `GeneralResourceConstraint` <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/develop/radix-common/src/data/manifest/model/manifest_resource_assertion.rs">defined here</a>.

**Example**

``` bash
ASSERT_WORKTOP_RESOURCES_INCLUDE
    Map<Address, Enum>(
        Address("\${fungible_resource_address}") => Enum<ResourceConstraint::ExactAmount>(
            Decimal("1")
        ),
        Address("\${non_fungible_resource_address}") => Enum<ResourceConstraint::AtLeastAmount>(
            Decimal("2")
        ),
    )
;
```







`ASSERT_NEXT_CALL_RETURNS_ONLY` (Added in V2)



Asserts that the following invocation instruction must return buckets whose balance of the specified resources matches the given constraints, and also ensures that all unspecified resources have zero balance.

An invocation instruction is one of the instructions starting `YIELD` or `CALL` or one of the `CALL` aliases. The invocation immediately follow this instruction.

Use `ASSERT_NEXT_CALL_RETURNS_INCLUDE` instead if you want to allow other unspecified resource balances.

To construct constraints, you may wish to see the definition of `ManifestResourceConstraint` and `GeneralResourceConstraint` <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/develop/radix-common/src/data/manifest/model/manifest_resource_assertion.rs">defined here</a>.

**Example**

``` bash
ASSERT_NEXT_CALL_RETURNS_ONLY
    Map<Address, Enum>(
        Address("\${non_fungible_resource_address}") => Enum<ResourceConstraint::ExactNonFungibles>(
            Array<NonFungibleLocalId>(
                NonFungibleLocalId("#234#")
            )
        ),
    )
;
```







`ASSERT_NEXT_CALL_RETURNS_INCLUDE` (Added in V2)



Asserts that the following invocation instruction must return buckets whose balance of the specified resources matches the given constraints, but permits non-zero balances of other unspecified resources.

An invocation instruction is one of the instructions starting `YIELD` or `CALL` or one of the `CALL` aliases. The invocation immediately follow this instruction.

Use `ASSERT_NEXT_CALL_RETURNS_ONLY` instead if you want to disallow other unspecified resource balances.

To construct constraints, you may wish to see the definition of `ManifestResourceConstraint` and `GeneralResourceConstraint` <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/develop/radix-common/src/data/manifest/model/manifest_resource_assertion.rs">defined here</a>.

**Example**

``` bash
ASSERT_NEXT_CALL_RETURNS_INCLUDE
    Map<Address, Enum>(
        Address("\${non_fungible_resource_address}") => Enum<ResourceConstraint::AtLeastNonFungibles>(
            Array<NonFungibleLocalId>(
                NonFungibleLocalId("<My_Id>")
            )
        ),
    )
;
```







`ASSERT_BUCKET_CONTENTS` (Added in V2)



Asserts that the named bucket’s contents matches the given constraints.

To construct constraints, you may wish to see the definition of `ManifestResourceConstraint` and `GeneralResourceConstraint` <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/develop/radix-common/src/data/manifest/model/manifest_resource_assertion.rs">defined here</a>.

**Example**

``` bash
ASSERT_BUCKET_CONTENTS
    Bucket("bucket")
    Enum<ResourceConstraint::General>(    # ManifestResourceConstraint
        Tuple(                            # GeneralResourceConstraint
            Array<NonFungibleLocalId>(),  # - required_ids
            Enum<LowerBound::NonZero>(),  # - lower_bound
            Enum<UpperBound::Inclusive>(  # - upper_bound
                Decimal("123")
            ),
            Enum<AllowedIds::Any>()       # - allowed_ids
        )
    )
;
```





### Proof Lifecycle



`CREATE_PROOF_FROM_BUCKET_OF_AMOUNT`



Creates a proof of some amount from a bucket.

**Example**

``` bash
TAKE_ALL_FROM_WORKTOP
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    Bucket("xrd_bucket")
;
CREATE_PROOF_FROM_BUCKET_OF_AMOUNT
    Bucket("xrd_bucket")
    Decimal("1.0")
    Proof("proof")
;
```







`CREATE_PROOF_FROM_BUCKET_OF_NON_FUNGIBLES`



Creates a proof of some non-fungibles from a bucket.

**Example**

``` bash
TAKE_ALL_FROM_WORKTOP
    Address("resource_sim1n2q4le7dpzucmpnksxj5ku28r3t776pgk879cahgm76c2kfpz48fpj")
    Bucket("nfts")
;
CREATE_PROOF_FROM_BUCKET_OF_NON_FUNGIBLES
    Bucket("nfts")
    Array<NonFungibleLocalId>(NonFungibleLocalId("#123#"))
    Proof("proof1b")
;
```







`CREATE_PROOF_FROM_BUCKET_OF_ALL`



Create a proof with all the resource in a bucket.

**Example**

``` bash
TAKE_ALL_FROM_WORKTOP
    Address("resource_sim1n2q4le7dpzucmpnksxj5ku28r3t776pgk879cahgm76c2kfpz48fpj")
    Bucket("nfts")
;
CREATE_PROOF_FROM_BUCKET_OF_ALL
    Bucket("nfts")
    Proof("proof")
;
```







`CREATE_PROOF_FROM_AUTH_ZONE_OF_AMOUNT`



Creates a proof of some amount of resource from the auth zone.

**Example**

``` bash
CREATE_PROOF_FROM_AUTH_ZONE_OF_AMOUNT
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    Decimal("1.0")
    Proof("proof")
;
```







`CREATE_PROOF_FROM_AUTH_ZONE_OF_NON_FUNGIBLES`



Creates a proof of some non-fungibles from the auth zone.

**Example**

``` bash
CREATE_PROOF_FROM_AUTH_ZONE_OF_NON_FUNGIBLES
    Address("resource_sim1n2q4le7dpzucmpnksxj5ku28r3t776pgk879cahgm76c2kfpz48fpj")
    Array<NonFungibleLocalId>(NonFungibleLocalId("#123#"))
    Proof("proof")
;
```







`CREATE_PROOF_FROM_AUTH_ZONE_OF_ALL`



Creates the max proof of some resource from the auth zone.

**Example**

``` bash
CREATE_PROOF_FROM_AUTH_ZONE_OF_ALL
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    Proof("proof");
```







`CLONE_PROOF`



Clones a proof.

**Example**

``` bash
POP_FROM_AUTH_ZONE
    Proof("proof")
;
CLONE_PROOF
    Proof("proof")
    Proof("cloned_proof")
;
```







`DROP_PROOF`



Drops a proof. This allows resources locked by the proof to be removed if all proofs against those resources are dropped.

**Example**

``` bash
POP_FROM_AUTH_ZONE
    Proof("proof")
;
DROP_PROOF
    Proof("proof")
;
```







`PUSH_TO_AUTH_ZONE`



Pushes a proof to the auth zone.

**Example**

``` bash
POP_FROM_AUTH_ZONE
    Proof("proof")
;
PUSH_TO_AUTH_ZONE
    Proof("proof")
;
```







`POP_FROM_AUTH_ZONE`



Pops the most recent proof from the auth zone.

**Example**

``` bash
POP_FROM_AUTH_ZONE
    Proof("proof")
;
```







`DROP_AUTH_ZONE_PROOFS`



Removes all proofs in the auth zone.

**Example**

``` bash
DROP_AUTH_ZONE_PROOFS
;
```







`DROP_AUTH_ZONE_REGULAR_PROOFS`



Removes all regular (non-signature) proofs in the auth zone.

**Example**

``` bash
DROP_AUTH_ZONE_REGULAR_PROOFS
;
```







`DROP_AUTH_ZONE_SIGNATURE_PROOFS`



Removes all signature proofs in the auth zone.

**Example**

``` bash
DROP_AUTH_ZONE_SIGNATURE_PROOFS
;
```







`DROP_NAMED_PROOFS`



Drops all of the named proofs.

**Example**

``` bash
DROP_NAMED_PROOFS
;
```







`DROP_ALL_PROOFS`



Drops all of the proofs in the auth zone and the named proofs.

**Example**

``` bash
DROP_ALL_PROOFS
;
```





### Invocations



`CALL_FUNCTION`



Invokes a function on a blueprint.

**Example**

``` bash
CALL_FUNCTION
    Address("package_sim1p4nk9h5kw2mcmwn5u2xcmlmwap8j6dzet7w7zztzz55p70rgqs4vag")
    "Hello"
    "instantiate_hello"
    66u32
;
```







`CREATE_ACCOUNT` (alias)



Create a native account component.

This is an alias for `CALL_FUNCTION` to the account blueprint `"create"` function.

**Example**

``` bash
CREATE_ACCOUNT
;
```







`CREATE_ACCOUNT_ADVANCED` (alias)



Create a native account component with an `OwnerRole` configuration.

This is an alias for `CALL_FUNCTION` to the account blueprint `"create_advanced"` function.

**Example**

``` bash
CREATE_ACCOUNT_ADVANCED
    Enum<OwnerRole::Updatable>(
        Enum<AccessRule::AllowAll>()
    )
    None
;
```







`CREATE_ACCESS_CONTROLLER` (alias)



Create an access controller native component.

This is an alias for `CALL_FUNCTION` to the access controller blueprint `"create"` function.

**Example**

``` bash
TAKE_ALL_FROM_WORKTOP
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    Bucket("bucket1")
;
CREATE_ACCESS_CONTROLLER
    Bucket("bucket1")
    Tuple(
        Enum<1u8>(), # primary role
        Enum<1u8>(), # recovery role
        Enum<1u8>()  # confirmation role
    )
    None # timed recovery delay in minutes
    None # address reservation
;
```







`CREATE_FUNGIBLE_RESOURCE` (alias)



Create a fungible resource and deposit it on the worktop.

This is an alias for a `CALL_FUNCTION` to the fungible resource blueprint’s `"create"` function.

**Example**

``` bash
CREATE_FUNGIBLE_RESOURCE
    # Owner role - This gets metadata permissions, and is the default for other permissions
    # Can set as Enum<OwnerRole::Fixed>(access_rule)  or Enum<OwnerRole::Updatable>(access_rule)
    Enum<OwnerRole::None>()
    true             # Whether the engine should track supply (avoid for massively parallelizable tokens)
    18u8             # Divisibility (between 0u8 and 18u8)
    Tuple(
        Some(         # Mint Roles (if None: defaults to DenyAll, DenyAll)
            Tuple(
                Some(Enum<AccessRule::AllowAll>()),  # Minter (if None: defaults to Owner)
                Some(Enum<AccessRule::DenyAll>())    # Minter Updater (if None: defaults to Owner)
            )
        ),
        None,        # Burn Roles (if None: defaults to DenyAll, DenyAll)
        None,        # Freeze Roles (if None: defaults to DenyAll, DenyAll)
        None,        # Recall Roles (if None: defaults to DenyAll, DenyAll)
        None,        # Withdraw Roles (if None: defaults to AllowAll, DenyAll)
        None         # Deposit Roles (if None: defaults to AllowAll, DenyAll)
    )
    Tuple(                                                                   # Metadata initialization
        Map<String, Tuple>(                                                  # Initial metadata values
            "name" => Tuple(
                Some(Enum<Metadata::String>("MyResource")),                  # Resource Name
                true                                                         # Locked
            )
        ),
        Map<String, Enum>(                                                   # Metadata roles
            "metadata_setter" => Some(Enum<AccessRule::AllowAll>()),         # Metadata setter role
            "metadata_setter_updater" => None,                               # Metadata setter updater role as None defaults to OWNER
            "metadata_locker" => Some(Enum<AccessRule::DenyAll>()),          # Metadata locker role
            "metadata_locker_updater" => None                                # Metadata locker updater role as None defaults to OWNER
        )
    )
    None                                                                     # No Address Reservation
;
```







`CREATE_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY` (alias)



Create a resource with a specified badge for authorization.

This is an alias for a `CALL_FUNCTION` to the fungible resource blueprint `"create_with_initial_supply"` function.

**Example**

``` bash
CREATE_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY
    # Owner role - This gets metadata permissions, and is the default for other permissions
    # Can set as Enum<OwnerRole::Fixed>(access_rule)  or Enum<OwnerRole::Updatable>(access_rule)
    Enum<OwnerRole::None>()
    true             # Whether the engine should track supply (avoid for massively parallelizable tokens)
    18u8             # Divisibility (between 0u8 and 18u8)
    Decimal("10000") # Initial supply
    Tuple(
        Some(         # Mint Roles (if None: defaults to DenyAll, DenyAll)
            Tuple(
                Some(Enum<AccessRule::AllowAll>()),  # Minter (if None: defaults to Owner)
                Some(Enum<AccessRule::DenyAll>())    # Minter Updater (if None: defaults to Owner)
            )
        ),
        None,        # Burn Roles (if None: defaults to DenyAll, DenyAll)
        None,        # Freeze Roles (if None: defaults to DenyAll, DenyAll)
        None,        # Recall Roles (if None: defaults to DenyAll, DenyAll)
        None,        # Withdraw Roles (if None: defaults to AllowAll, DenyAll)
        None         # Deposit Roles (if None: defaults to AllowAll, DenyAll)
    )
    Tuple(                                                                   # Metadata initialization
        Map<String, Tuple>(                                                  # Initial metadata values
            "name" => Tuple(
                Some(Enum<Metadata::String>("MyResource")),                  # Resource Name
                true                                                         # Locked
            )
        ),
        Map<String, Enum>(                                                   # Metadata roles
            "metadata_setter" => Some(Enum<AccessRule::AllowAll>()),         # Metadata setter role
            "metadata_setter_updater" => None,                               # Metadata setter updater role as None defaults to OWNER
            "metadata_locker" => Some(Enum<AccessRule::DenyAll>()),          # Metadata locker role
            "metadata_locker_updater" => None                                # Metadata locker updater role as None defaults to OWNER
        )
    )
    None                                                                     # No Address Reservation
;
```







`CREATE_NON_FUNGIBLE_RESOURCE` (alias)



Create a non-fungible resource from the worktop.

This is an alias for `CALL_FUNCTION` to the non fungible resource blueprint’s `"create"` function.

**Example**

``` bash
CREATE_NON_FUNGIBLE_RESOURCE
    # Owner role - This gets metadata permissions, and is the default for other permissions
    # Can set as Enum<OwnerRole::Fixed>(access_rule)  or Enum<OwnerRole::Updatable>(access_rule)
    Enum<OwnerRole::None>()
    Enum<NonFungibleIdType::Integer>()                                                                          # The type of NonFungible Id
    true                                                                                                        # Whether the engine should track supply (avoid for massively parallelizable tokens)
    Enum<0u8>(Enum<0u8>(Tuple(Array<Enum>(), Array<Tuple>(), Array<Enum>())), Enum<0u8>(66u8), Array<String>())     # Non Fungible Data Schema
    Tuple(
        Some(         # Mint Roles (if None: defaults to DenyAll, DenyAll)
            Tuple(
                Some(Enum<AccessRule::AllowAll>()),  # Minter (if None: defaults to Owner)
                Some(Enum<AccessRule::DenyAll>())    # Minter Updater (if None: defaults to Owner)
            )
        ),
        None,        # Burn Roles (if None: defaults to DenyAll, DenyAll)
        None,        # Freeze Roles (if None: defaults to DenyAll, DenyAll)
        None,        # Recall Roles (if None: defaults to DenyAll, DenyAll)
        None,        # Withdraw Roles (if None: defaults to AllowAll, DenyAll)
        None,        # Deposit Roles (if None: defaults to AllowAll, DenyAll)
        None         # Non Fungible Data Update Roles (if None: defaults to DenyAll, DenyAll)
    )
    Tuple(                                                                   # Metadata initialization
        Map<String, Tuple>(                                                  # Initial metadata values
            "name" => Tuple(
                Some(Enum<Metadata::String>("MyResource")),                  # Resource Name
                true                                                         # Locked
            )
        ),
        Map<String, Enum>(                                                   # Metadata roles
            "metadata_setter" => Some(Enum<AccessRule::AllowAll>()),         # Metadata setter role
            "metadata_setter_updater" => None,                               # Metadata setter updater role as None defaults to OWNER
            "metadata_locker" => Some(Enum<AccessRule::DenyAll>()),          # Metadata locker role
            "metadata_locker_updater" => None                                # Metadata locker updater role as None defaults to OWNER
        )
    )
    None;             # No Address Reservation
```







`CREATE_NON_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY` (alias)



Create a non-fungible resource with a specified badge for authorization.

This is an alias for `CALL_FUNCTION` to the non fungible resource blueprint’s `"create_with_initial_supply"` function.

**Example**

``` bash
CREATE_NON_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY
    # Owner role - This gets metadata permissions, and is the default for other permissions
    # Can set as Enum<OwnerRole::Fixed>(access_rule)  or Enum<OwnerRole::Updatable>(access_rule)
    Enum<OwnerRole::None>()
    Enum<NonFungibleIdType::Integer>()                                                                  # The type of NonFungible Id
    true                                                                                                # Whether the engine should track supply (avoid for massively parallelizable tokens)
    Enum<0u8>(Enum<0u8>(Tuple(Array<Enum>(), Array<Tuple>(), Array<Enum>())), Enum<0u8>(66u8), Array<String>())     # Non Fungible Data Schema
    Map<NonFungibleLocalId, Tuple>(                                                                     # Initial supply to mint
        NonFungibleLocalId("#1#") => Tuple(Tuple())
    )
    Tuple(
        Some(         # Mint Roles (if None: defaults to DenyAll, DenyAll)
            Tuple(
                Some(Enum<AccessRule::AllowAll>()),  # Minter (if None: defaults to Owner)
                Some(Enum<AccessRule::DenyAll>())    # Minter Updater (if None: defaults to Owner)
            )
        ),
        None,        # Burn Roles (if None: defaults to DenyAll, DenyAll)
        None,        # Freeze Roles (if None: defaults to DenyAll, DenyAll)
        None,        # Recall Roles (if None: defaults to DenyAll, DenyAll)
        None,        # Withdraw Roles (if None: defaults to AllowAll, DenyAll)
        None,        # Deposit Roles (if None: defaults to AllowAll, DenyAll)
        None         # Non Fungible Data Update Roles (if None: defaults to DenyAll, DenyAll)
    )
    Tuple(                                                                   # Metadata initialization
        Map<String, Tuple>(                                                  # Initial metadata values
            "name" => Tuple(
                Some(Enum<Metadata::String>("MyResource")),                  # Resource Name
                true                                                         # Locked
            )
        ),
        Map<String, Enum>(                                                   # Metadata roles
            "metadata_setter" => Some(Enum<AccessRule::AllowAll>()),         # Metadata setter role
            "metadata_setter_updater" => None,                               # Metadata setter updater role as None defaults to OWNER
            "metadata_locker" => Some(Enum<AccessRule::DenyAll>()),          # Metadata locker role
            "metadata_locker_updater" => None                                # Metadata locker updater role as None defaults to OWNER
        )
    )
    None                                                                     # No Address Reservation
;
```







`CREATE_IDENTITY` (alias)



Create a native Identity component.

This is an alias for `CALL_FUNCTION` to the identity blueprint’s `"create"` function.

**Example**

``` bash
CREATE_IDENTITY
;
```







`CREATE_IDENTITY_ADVANCED` (alias)



Create a native Identity component with an `OwnerRole` configuration.

This is an alias for `CALL_FUNCTION` to the identity blueprint’s `"create_advanced"` function.

**Example**

``` bash
CREATE_IDENTITY_ADVANCED
    Enum<OwnerRole::None>()
;
```







`CREATE_VALIDATOR` (alias)



Create a native validator component.

This is an alias for `CALL_FUNCTION` to the identity blueprint’s `"create"` function.

**Example**

``` bash
TAKE_FROM_WORKTOP
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    Decimal("1000")
    Bucket("bucket1")
;
CREATE_VALIDATOR
    Bytes("02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5")
    Decimal("1")
    Bucket("bucket1")
;
```







`PUBLISH_PACKAGE` (alias)



Publishes a package, giving a package owner badge defined in the owner role.

It’s generally recommended to instead use `PUBLISH_PACKAGE_ADVANCED` for more control.

This is an alias for `CALL_FUNCTION` to the package blueprint’s `"publish_wasm"` function.

**Example**

``` bash
PUBLISH_PACKAGE
    Tuple( # package definition
        Map<String, Tuple>(
            "Hello" => Tuple(
                Enum<0u8>(),
                false,
                Array<String>(),
                Array<Address>(),
                Tuple(
                    Array<Enum>(),
                    Enum<0u8>(
                        Tuple(
                            Array<Enum>(
                                Enum<14u8>(
                                    Array<Enum>(
                                        Enum<0u8>(
                                            167u8
                                        )
                                    )
                                ),
                                Enum<14u8>(
                                    Array<Enum>()
                                ),
                                Enum<17u8>(
                                    Enum<0u8>()
                                ),
                                Enum<14u8>(
                                    Array<Enum>()
                                )
                            ),
                            Array<Tuple>(
                                Tuple(
                                    Enum<1u8>(
                                        "Hello"
                                    ),
                                    Enum<1u8>(
                                        Enum<0u8>(
                                            Array<String>(
                                                "sample_vault"
                                            )
                                        )
                                    )
                                ),
                                Tuple(
                                    Enum<1u8>(
                                        "Hello_instantiate_hello_Input"
                                    ),
                                    Enum<1u8>(
                                        Enum<0u8>(
                                            Array<String>()
                                        )
                                    )
                                ),
                                Tuple(
                                    Enum<1u8>(
                                        "GlobalHello"
                                    ),
                                    Enum<0u8>()
                                ),
                                Tuple(
                                    Enum<1u8>(
                                        "Hello_free_token_Input"
                                    ),
                                    Enum<1u8>(
                                        Enum<0u8>(
                                            Array<String>()
                                        )
                                    )
                                )
                            ),
                            Array<Enum>(
                                Enum<0u8>(),
                                Enum<0u8>(),
                                Enum<14u8>(
                                    Enum<0u8>(
                                        Enum<4u8>(
                                            Enum<0u8>(),
                                            "Hello"
                                        )
                                    )
                                ),
                                Enum<0u8>()
                            )
                        )
                    ),
                    Tuple(
                        Array<Tuple>(
                            Tuple(
                                Enum<0u8>(
                                    Enum<1u8>(
                                        0u64
                                    )
                                ),
                                Enum<0u8>(),
                                Enum<0u8>()
                            )
                        ),
                        Array<Enum>()
                    ),
                    Map<String, Enum>(),
                    Map<String, Enum>(),
                    Tuple(
                        Map<String, Tuple>(
                            "instantiate_hello" => Tuple(
                                Enum<0u8>(),
                                Enum<0u8>(
                                    Enum<1u8>(
                                        1u64
                                    )
                                ),
                                Enum<0u8>(
                                    Enum<1u8>(
                                        2u64
                                    )
                                ),
                                "Hello_instantiate_hello"
                            ),
                            "free_token" => Tuple(
                                Enum<1u8>(
                                    Tuple(
                                        Enum<1u8>(),
                                        Tuple(
                                            1u32
                                        )
                                    )
                                ),
                                Enum<0u8>(
                                    Enum<1u8>(
                                        3u64
                                    )
                                ),
                                Enum<0u8>(
                                    Enum<0u8>(
                                        161u8
                                    )
                                ),
                                "Hello_free_token"
                            )
                        )
                    ),
                    Tuple(
                        Map<Enum, String>()
                    )
                ),
                Enum<0u8>(),
                Tuple(
                    Enum<0u8>(),
                    Enum<0u8>()
                )
            )
        )
    )
    Blob("4cdfc89a539f1cb6fac327c07e95a2f120ea5af6d2e2adfae093f81e1d185925") # code
    Map<String, Tuple>() # metadata
;
```







`PUBLISH_PACKAGE_ADVANCED` (alias)



Publishes a package.

This is an alias for `CALL_FUNCTION` to the package blueprint’s `"publish_wasm_advanced"` function.

**Example**

``` bash
PUBLISH_PACKAGE_ADVANCED
    Enum<1u8>( # owner rule
        Enum<2u8>(
            Enum<0u8>(
                Enum<0u8>(
                    Enum<0u8>(
                        NonFungibleGlobalId("resource_sim1nfzf2h73frult99zd060vfcml5kncq3mxpthusm9lkglvhsr0guahy:#1#")
                    )
                )
            )
        )
    )
    Tuple( # package definition
        Map<String, Tuple>(
            "Hello" => Tuple(
                Enum<0u8>(),
                false,
                Array<String>(),
                Array<Address>(),
                Tuple(
                    Array<Enum>(),
                    Enum<0u8>(
                        Tuple(
                            Array<Enum>(
                                Enum<14u8>(
                                    Array<Enum>(
                                        Enum<0u8>(
                                            167u8
                                        )
                                    )
                                ),
                                Enum<14u8>(
                                    Array<Enum>()
                                ),
                                Enum<17u8>(
                                    Enum<0u8>()
                                ),
                                Enum<14u8>(
                                    Array<Enum>()
                                )
                            ),
                            Array<Tuple>(
                                Tuple(
                                    Enum<1u8>(
                                        "Hello"
                                    ),
                                    Enum<1u8>(
                                        Enum<0u8>(
                                            Array<String>(
                                                "sample_vault"
                                            )
                                        )
                                    )
                                ),
                                Tuple(
                                    Enum<1u8>(
                                        "Hello_instantiate_hello_Input"
                                    ),
                                    Enum<1u8>(
                                        Enum<0u8>(
                                            Array<String>()
                                        )
                                    )
                                ),
                                Tuple(
                                    Enum<1u8>(
                                        "GlobalHello"
                                    ),
                                    Enum<0u8>()
                                ),
                                Tuple(
                                    Enum<1u8>(
                                        "Hello_free_token_Input"
                                    ),
                                    Enum<1u8>(
                                        Enum<0u8>(
                                            Array<String>()
                                        )
                                    )
                                )
                            ),
                            Array<Enum>(
                                Enum<0u8>(),
                                Enum<0u8>(),
                                Enum<14u8>(
                                    Enum<0u8>(
                                        Enum<4u8>(
                                            Enum<0u8>(),
                                            "Hello"
                                        )
                                    )
                                ),
                                Enum<0u8>()
                            )
                        )
                    ),
                    Tuple(
                        Array<Tuple>(
                            Tuple(
                                Enum<0u8>(
                                    Enum<1u8>(
                                        0u64
                                    )
                                ),
                                Enum<0u8>(),
                                Enum<0u8>()
                            )
                        ),
                        Array<Enum>()
                    ),
                    Map<String, Enum>(),
                    Map<String, Enum>(),
                    Tuple(
                        Map<String, Tuple>(
                            "instantiate_hello" => Tuple(
                                Enum<0u8>(),
                                Enum<0u8>(
                                    Enum<1u8>(
                                        1u64
                                    )
                                ),
                                Enum<0u8>(
                                    Enum<1u8>(
                                        2u64
                                    )
                                ),
                                "Hello_instantiate_hello"
                            ),
                            "free_token" => Tuple(
                                Enum<1u8>(
                                    Tuple(
                                        Enum<1u8>(),
                                        Tuple(
                                            1u32
                                        )
                                    )
                                ),
                                Enum<0u8>(
                                    Enum<1u8>(
                                        3u64
                                    )
                                ),
                                Enum<0u8>(
                                    Enum<0u8>(
                                        161u8
                                    )
                                ),
                                "Hello_free_token"
                            )
                        )
                    ),
                    Tuple(
                        Map<Enum, String>()
                    )
                ),
                Enum<0u8>(),
                Tuple(
                    Enum<0u8>(),
                    Enum<0u8>()
                )
            )
        )
    )
    Blob("4cdfc89a539f1cb6fac327c07e95a2f120ea5af6d2e2adfae093f81e1d185925") # code
    Map<String, Tuple>() # metadata
    Enum<0u8>() # optional address reservation
;
```







`CALL_METHOD`



Invokes a method on the main module of a component. See <a href="#native-blueprints">native blueprints</a> below for more typical methods.

**Example**

``` bash
TAKE_ALL_FROM_WORKTOP
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    Bucket("xrd_bucket")
;
CALL_METHOD
    Address("component_sim1cpvs7ulg02ah8mhcc84q7zsj4ta3pfz77uknu29xy50yelakkujqze")
    "buy_gumball"
    Bucket("xrd_bucket")
;
CALL_ROYALTY_METHOD
    Address("component_sim1cpvs7ulg02ah8mhcc84q7zsj4ta3pfz77uknu29xy50yelakkujqze")
    "set_royalty"
    "my_method"
    Enum<0u8>()
;
CALL_METADATA_METHOD
    Address("component_sim1cpvs7ulg02ah8mhcc84q7zsj4ta3pfz77uknu29xy50yelakkujqze")
    "get"
    "HelloWorld"
;
CALL_ROLE_ASSIGNMENT_METHOD
    Address("component_sim1cpvs7ulg02ah8mhcc84q7zsj4ta3pfz77uknu29xy50yelakkujqze")
    "get"
    Enum<0u8>()
    "hello"
;
```







`MINT_FUNGIBLE` (alias)



Mints a fungible resource and deposits it on the worktop.

This is an alias for `CALL_METHOD` to a fungible resource’s `"mint"` method.

**Example**

``` bash
MINT_FUNGIBLE
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    Decimal("1.0")
;
```







`MINT_NON_FUNGIBLE` (alias)



Mint a non-fungible resource and deposit it on the worktop.

This is an alias for `CALL_METHOD` to a non-fungible resource’s `"mint"` method.

**Example**

``` bash
# This non-fungible token has no data
MINT_NON_FUNGIBLE
    Address("resource_sim1n2q4le7dpzucmpnksxj5ku28r3t776pgk879cahgm76c2kfpz48fpj")
    Map<NonFungibleLocalId, Tuple>(
        NonFungibleLocalId("#555#") => Tuple(Tuple())
    )
;
```

``` bash
# This non-fungible token has 2 String data fields and 1 Decimal
MINT_NON_FUNGIBLE
    Address("resource_sim1n2q4le7dpzucmpnksxj5ku28r3t776pgk879cahgm76c2kfpz48fpj")
    Map<NonFungibleLocalId, Tuple>(
        NonFungibleLocalId("<test_string_id>") => Tuple(
            Tuple(
                "Hello",
                "World",
                Decimal("12"),
            )
        )
    )
;
```







`MINT_RUID_NON_FUNGIBLE` (alias)



Mint non-fungible resource with a random Radix Unique Identifier (RUID). Using this instruction, you only have to provide the data. A random UUID will be attached to each entry.

This is an alias for `CALL_METHOD` to a non-fungible resource’s `"mint_ruid"` method.

**Example**

``` bash
# This non-fungible token has 2 data fields, "Hello World" and Decimal("12")
MINT_RUID_NON_FUNGIBLE
    Address("resource_sim1n2q4le7dpzucmpnksxj5ku28r3t776pgk879cahgm76c2kfpz48fpj")
    Array<Tuple>(
        Tuple(Tuple("Hello World", Decimal("12")))
    )
;
```







`CLAIM_PACKAGE_ROYALTIES` (alias)



Claims royalty on an owned package

This is an alias for `CALL_METHOD` to the package blueprint’s `"PackageRoyalty_claim_royalties"` method.

**Example**

``` bash
CLAIM_PACKAGE_ROYALTIES
    Address("package_sim1p4nk9h5kw2mcmwn5u2xcmlmwap8j6dzet7w7zztzz55p70rgqs4vag")
;
```

Learn more about [Royalties](../scrypto/using-royalties.md).







`CALL_ROYALTY_METHOD`



Invokes a method on the royalty module of a component.

Typically you use an alias instruction for this instead (see following instructions).

**Example**

``` bash
CALL_ROYALTY_METHOD
    Address("component_sim1cpvs7ulg02ah8mhcc84q7zsj4ta3pfz77uknu29xy50yelakkujqze")
    "set_royalty"
    "my_method"
    Enum<0u8>()
;
```







`SET_COMPONENT_ROYALTY` (alias)



Sets the royalty configuration on a component.

This is an alias for `CALL_ROYALTY_METHOD "set_royalty"`.

**Example**

``` bash
SET_COMPONENT_ROYALTY
    Address("component_sim1czawvqpwnuwew7zfnsflhyxgmaf4hckjawlfku6jfpet9efa4aeskg")
    "my_method"
    Enum<RoyaltyAmount::Free>()
;
```







`CLAIM_COMPONENT_ROYALTIES` (alias)



Claims royalty on an owned component.

This is an alias for `CALL_ROYALTY_METHOD "claim_royalties"`.

**Example**

``` bash
CLAIM_COMPONENT_ROYALTIES
    Address("component_sim1czawvqpwnuwew7zfnsflhyxgmaf4hckjawlfku6jfpet9efa4aeskg")
;
```

Learn more about [Royalties](../scrypto/using-royalties.md).







`LOCK_COMPONENT_ROYALTY` (alias)



Locks the royalty configuration on a component.

This is an alias for `CALL_ROYALTY_METHOD "lock_royalty"`.

**Example**

``` bash
LOCK_COMPONENT_ROYALTY
    Address("component_sim1czawvqpwnuwew7zfnsflhyxgmaf4hckjawlfku6jfpet9efa4aeskg")
    "my_method"
;
```







`CALL_METADATA_METHOD`



Invokes a method on the metadata module of a component.

Typically you use an alias instruction for this instead (see following instructions).

**Example**

``` bash
CALL_METADATA_METHOD
    Address("component_sim1cpvs7ulg02ah8mhcc84q7zsj4ta3pfz77uknu29xy50yelakkujqze")
    "get"
    "HelloWorld"
;
```







`SET_METADATA` (alias)



Sets a metadata entry of a global entity.

This is an alias for `CALL_METADATA_METHOD "set"`.

**Example**

``` bash
# Set String Metadata on Package
SET_METADATA
    Address("package_sim1p4nk9h5kw2mcmwn5u2xcmlmwap8j6dzet7w7zztzz55p70rgqs4vag")
    "field_name"
    # "Metadata::String" is equivalent to 0u8
    Enum<Metadata::String>(
        "Metadata string value, eg description"
    )
;

# Set String Metadata on Account component
SET_METADATA
    Address("account_sim1c8zvh2cd59pnwfqkkre0rflfhshrhptkweyf7vzefw08u0l3mk2anh")
    "field_name"
    # "Metadata::String" is equivalent to 0u8
    Enum<Metadata::String>(
        "Metadata string value, eg description"
    )
;

# Set String Metadata on Resource
SET_METADATA
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    "field_name"
    # "Metadata::String" is equivalent to 0u8
    Enum<Metadata::String>(
        "Metadata string value, eg description"
    )
;

# Set Bool Metadata on Resource
SET_METADATA
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    "field_name"
    # "Metadata::Bool" is equivalent to 1u8
    Enum<Metadata::Bool>(
        true
    )
;

# Set u8 Metadata on Resource
SET_METADATA
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    "field_name"
    # "Metadata::U8" is equivalent to 2u8
    Enum<Metadata::U8>(
        123u8
    )
;

# Set u32 Metadata on Resource
SET_METADATA
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    "field_name"
    # "Metadata::U32" is equivalent to 3u8
    Enum<Metadata::U32>(
        123u32
    )
;

# Set u64 Metadata on Resource
SET_METADATA
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    "field_name"
    # "Metadata::U64" is equivalent to 4u8
    Enum<Metadata::U64>(
        123u64
    )
;

# Set i32 Metadata on Resource
SET_METADATA
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    "field_name"
    # "Metadata::I32" is equivalent to 5u8
    Enum<Metadata::I32>(
        -123i32
    )
;

# Set i64 Metadata on Resource
SET_METADATA
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    "field_name"
    # "Metadata::I64" is equivalent to 6u8
    Enum<Metadata::I64>(
        -123i64
    )
;

# Set Decimal Metadata on Resource
SET_METADATA
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    "field_name"
    # "Metadata::Decimal" is equivalent to 7u8
    Enum<Metadata::Decimal>( # Single item
        Decimal("10.5")
    )
;

# Set Address Metadata on Resource
SET_METADATA
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    "field_name"
    # "Metadata::Address" is equivalent to 8u8
    Enum<Metadata::Address>(
        Address("account_sim1c8zvh2cd59pnwfqkkre0rflfhshrhptkweyf7vzefw08u0l3mk2anh")
    )
;

# Set Public Key Metadata on Resource
# NOTE: Also see "PublicKeyHash" further down
SET_METADATA
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    "field_name"
    # "Metadata::PublicKey" is equivalent to 9u8
    Enum<Metadata::PublicKey>(
        Enum<PublicKey::Secp256k1>( # 0u8 = Secp256k1, 1u8 = Ed25519
            # Hex-encoded canonical-Radix encoding of the public key
            Bytes("0000000000000000000000000000000000000000000000000000000000000000ff")
        )
    )
;

# Set NonFungibleGlobalId Metadata on Resource
SET_METADATA
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    "field_name"
    # "Metadata::NonFungibleGlobalId" is equivalent to 10u8
    Enum<Metadata::NonFungibleGlobalId>(
        NonFungibleGlobalId("resource_sim1n2q4le7dpzucmpnksxj5ku28r3t776pgk879cahgm76c2kfpz48fpj:<some_string>")
    )
;

# Set NonFungibleLocalId Metadata on Resource
SET_METADATA
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    "field_name"
    # "Metadata::NonFungibleLocalId" is equivalent to 11u8
    Enum<Metadata::NonFungibleLocalId>(
        NonFungibleLocalId("<some_string>")
    )
;

# Set Instant (or the value in seconds since unix epoch) Metadata on Resource
SET_METADATA
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    "field_name"
    # "Metadata::Instant" is equivalent to 12u8
    Enum<Metadata::Instant>(
        # Value in seconds since Unix Epoch
        10000i64
    )
;

# Set Url Metadata on Resource
SET_METADATA
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    "field_name"
    # "Metadata::Url" is equivalent to 13u8
    Enum<Metadata::Url>( # Single item
        "https://radixdlt.com/index.html"
    )
;

# Set Origin Metadata on Resource
SET_METADATA
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    "field_name"
    # "Metadata::Origin" is equivalent to 14u8
    Enum<Metadata::Origin>(
        "https://radixdlt.com"
    )
;

# Set PublicKeyHash Metadata on Resource
SET_METADATA
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    "field_name"
    # "Metadata::PublicKeyHash" is equivalent to 15u8
    Enum<Metadata::PublicKeyHash>(
        Enum<PublicKeyHash::Secp256k1>( # 0u8 = Secp256k1, 1u8 = Ed25519
            # The hex-encoded final 29 bytes of the Blake2b-256 hash of the public key bytes (in the canonical Radix encoding)
            Bytes("0000000000000000000000000000000000000000000000000000000000")
        )
    )
;

# Setting list-based metadata:
# ============================
# If using enum discriminator aliases: Take "Metadata::X" and add Array to the end, eg "Metadata::XArray"
# If using u8 enum discriminators: Add 128 to the single values
#
# Then just make the content an Array<X>.
#
# For example, for strings:
SET_METADATA
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    "field_name"
    # "Metadata::StringArray" is equivalent to 128u8
    Enum<Metadata::StringArray>(
        Array<String>(
            "some_string",
            "another_string",
            "yet_another_string"
        )
    )
;
```







`REMOVE_METADATA` (alias)



Removes the metadata key and value of a global entity.

This is an alias for `CALL_METADATA_METHOD "remove"`.

**Example**

``` bash
REMOVE_METADATA
    Address("package_sim1p4nk9h5kw2mcmwn5u2xcmlmwap8j6dzet7w7zztzz55p70rgqs4vag")
    "field_name";

REMOVE_METADATA
    Address("account_sim1c8zvh2cd59pnwfqkkre0rflfhshrhptkweyf7vzefw08u0l3mk2anh")
    "field_name";

REMOVE_METADATA
    Address("resource_sim1nfnwxdfw2tjzzkvyj9kxe64en6nhnelqmrxwrmgnly4a4wugc6e6cu")
    "field_name";
```







`LOCK_METADATA` (alias)



Locks a metadata entry of a global entity, preventing it from being updated.

This is an alias for `CALL_METADATA_METHOD "lock"`.

**Example**

``` bash
LOCK_METADATA
    Address("package_sim1p4nk9h5kw2mcmwn5u2xcmlmwap8j6dzet7w7zztzz55p70rgqs4vag")
    "field_name";

LOCK_METADATA
    Address("account_sim1c8zvh2cd59pnwfqkkre0rflfhshrhptkweyf7vzefw08u0l3mk2anh")
    "field_name";

LOCK_METADATA
    Address("resource_sim1nfnwxdfw2tjzzkvyj9kxe64en6nhnelqmrxwrmgnly4a4wugc6e6cu")
    "field_name";
```







`CALL_ROLE_ASSIGNMENT_METHOD`



Invokes a method on the role assignment module of a component.

Typically you use an alias instruction for this instead (see following instructions).

**Example**

``` bash
CALL_ROLE_ASSIGNMENT_METHOD
    Address("component_sim1cpvs7ulg02ah8mhcc84q7zsj4ta3pfz77uknu29xy50yelakkujqze")
    "get"
    Enum<0u8>()
    "hello"
;
```







`SET_ROLE` (alias)



Sets the access rule for a specified role of a global entity.

This is an alias for `CALL_ROLE_ASSIGNMENT_METHOD "set"`.

**Example**

``` bash
SET_ROLE
    Address("component_sim1cpvs7ulg02ah8mhcc84q7zsj4ta3pfz77uknu29xy50yelakkujqze")
    Enum<ModuleId::Main>() # Main, Metadata, Royalty or RoleAssignment. You typically want "ModuleId::Main" here, unless setting a native role from the Metadata / Royalty modules.
    "role_name"            # The name of the role to update the access rule for.
    Enum<AccessRule::Protected>( # The access rule associated with the role
        Enum<AccessRuleNode::ProofRule>(
            Enum<ProofRule::Require>(
                Enum<ResourceOrNonFungible::NonFungible>( # Either NonFungible or Resource, which contains either a NonFungibleGlobalId or a Address("<resource address>")
                    NonFungibleGlobalId("resource_sim1n2q4le7dpzucmpnksxj5ku28r3t776pgk879cahgm76c2kfpz48fpj:#123#")
                )
            )
        )
    )
;
```







`SET_OWNER_ROLE` (alias)



Sets an `OwnerRole` configuration of a global entity.

This is an alias for `CALL_ROLE_ASSIGNMENT_METHOD "set_owner"`

**Example**

``` bash
SET_OWNER_ROLE
    Address("resource_sim1n2q4le7dpzucmpnksxj5ku28r3t776pgk879cahgm76c2kfpz48fpj")
    Enum<AccessRule::Protected>(
        Enum<AccessRuleNode::ProofRule>(
            Enum<ProofRule::Require>(
                Enum<ResourceOrNonFungible::NonFungible>( # Either NonFungible or Resource, which contains either a NonFungibleGlobalId or a Address("<resource address>")
                    NonFungibleGlobalId("resource_sim1n2q4le7dpzucmpnksxj5ku28r3t776pgk879cahgm76c2kfpz48fpj:#123#")
                )
            )
        )
    )
;
```







`LOCK_OWNER_ROLE` (alias)



Locks an `OwnerRole` configuration of a global entity.

This is an alias for `CALL_ROLE_ASSIGNMENT_METHOD "lock_owner"`.

**Example**

``` bash
LOCK_OWNER_ROLE
    Address("resource_sim1n2q4le7dpzucmpnksxj5ku28r3t776pgk879cahgm76c2kfpz48fpj")
;
```







`CALL_DIRECT_VAULT_METHOD`



Invokes a direct access method on the given vault.

Typically you use an alias instruction for this instead (see following instructions).







`RECALL_FROM_VAULT` (alias)



Recalls a fungible resource from a vault (if the resource has a recallable behavior).

This is an alias for `CALL_DIRECT_VAULT_METHOD "recall"`.

**Example**

``` bash
RECALL_FROM_VAULT
    Address("internal_vault_sim1tpv9skzctpv9skzctpv9skzctpv9skzctpv9skzctpv9skzcuxymgh")
    Decimal("1.2")
;
```







`RECALL_NON_FUNGIBLES_FROM_VAULT` (alias)



Recalls a non-fungible resource from a vault (if the resource has a recallable behavior).

This is an alias for `CALL_DIRECT_VAULT_METHOD "recall_non_fungibles"`.

**Example**

``` bash
RECALL_NON_FUNGIBLES_FROM_VAULT
    Address("internal_vault_sim1nzvf3xycnzvf3xycnzvf3xycnzvf3xycnzvf3xycnzvf3xyc4apn28")
    Array<NonFungibleLocalId>(NonFungibleLocalId("#123#"), NonFungibleLocalId("#456#"))
;
```







`FREEZE_VAULT` (alias)



`FREEZE_VAULT` manifest instruction has several configurations:

- Freeze withdraws of a `Vault`.

- Freeze deposits of a `Vault`.

- Freeze resource burns of a `Vault`.

- Freeze withdraws/deposits/burn resource(s) of a `Vault`.

This is an alias for `CALL_DIRECT_VAULT_METHOD "freeze"`.

**Example**

``` bash
# Freeze Withdraws from a vault
FREEZE_VAULT
    Address("internal_vault_sim1tpv9skzctpv9skzctpv9skzctpv9skzctpv9skzctpv9skzcuxymgh")
    Tuple(1u32)
;

# Freeze Deposits into a vault
FREEZE_VAULT
    Address("internal_vault_sim1tpv9skzctpv9skzctpv9skzctpv9skzctpv9skzctpv9skzcuxymgh")
    Tuple(2u32)
;

# Freeze Burns in a vault
FREEZE_VAULT
    Address("internal_vault_sim1tpv9skzctpv9skzctpv9skzctpv9skzctpv9skzctpv9skzcuxymgh")
    Tuple(4u32)
;

# Freeze Withdraws/Deposits/Burns of a vault
FREEZE_VAULT
    Address("internal_vault_sim1tpv9skzctpv9skzctpv9skzctpv9skzctpv9skzctpv9skzcuxymgh")
    Tuple(7u32)
;
```







`UNFREEZE_VAULT` (alias)



`UNFREEZE_VAULT` manifest instruction has several configurations:

- Unfreeze withdraws of a `Vault`.

- Unfreeze deposits of a `Vault`.

- Unfreeze resource burns of a `Vault`.

- Unfreeze withdraws/deposits/burn resource(s) of a `Vault`.

This is an alias for `CALL_DIRECT_VAULT_METHOD "unfreeze"`.

**Example**

``` bash
# Unfreeze Withdraws from a vault
UNFREEZE_VAULT
    Address("internal_vault_sim1tpv9skzctpv9skzctpv9skzctpv9skzctpv9skzctpv9skzcuxymgh")
    Tuple(1u32)
;

# Unfreeze Deposits into a vault
UNFREEZE_VAULT
    Address("internal_vault_sim1tpv9skzctpv9skzctpv9skzctpv9skzctpv9skzctpv9skzcuxymgh")
    Tuple(2u32)
;

# Unfreeze Burns in a vault
UNFREEZE_VAULT
    Address("internal_vault_sim1tpv9skzctpv9skzctpv9skzctpv9skzctpv9skzctpv9skzcuxymgh")
    Tuple(4u32)
;

# Unfreeze Withdraws/Deposits/Burns of a vault
UNFREEZE_VAULT
    Address("internal_vault_sim1tpv9skzctpv9skzctpv9skzctpv9skzctpv9skzctpv9skzcuxymgh")
    Tuple(7u32)
;
```





### Address Allocation



`USE_PREALLOCATED_ADDRESS` (Pseudo-instruction \| System only)



This instruction can only be used by System transactions, such as genesis and protocol updates. It must appear at the start of the manifest, before all other instructions.

It defines a pre-allocation of a particular address which can be used for instantiation later.

**Example**

``` bash
USE_PREALLOCATED_ADDRESS
    Address("package_sim1pkgxxxxxxxxxresrcexxxxxxxxx000538436477xxxxxxxxxaj0zg9")
    "FungibleResourceManager"
    AddressReservation("reservation1")
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
;
```







`ALLOCATE_GLOBAL_ADDRESS`



This command can be used to reserve an address, which is useful when creating new global entities (aka “object”) in the manifest and then wanting to interact with them later in the same transaction.

The command takes:

- The first two parameters are the package address and blueprint name, which scope the reserved address to be used by a new global entity of that type.

  - An entity can be a component (i.e. referencing a scrypto blueprint), or a resource or package (by referencing their native blueprint)

- The third parameter is a name-binding for a newly created address reservation. This address reservation will need to be passed into a constructor of an object, and used in the globalize call. It has to be used by the time the transaction ends.

- The fourth parameter is a name-binding for the newly created address. It can be used to call the newly created entity from the manifest after it’s been created.

In Scrypto:

- Constructors are recommended to take an `Option<AddressReservation>` to support this pattern. It’s also recommended they take an `OwnerRole` to be fully customisable.

- The allocate address trick can be used in Scrypto with the `Runtime::allocate_component_address(..)` method.

**Example**

The following could be used to immediately call a function on an uploaded package in the same transaction.

Note that the `PUBLISH_PACKAGE_ADVANCED` constructor includes the `OwnerRole` and `Option<GlobalAddressReservation>` parameters for full flexibility.

``` bash
ALLOCATE_GLOBAL_ADDRESS
    Address("\${package_package_address}")
    "Package"
    AddressReservation("package_reservation")
    NamedAddress("my_package")
;
PUBLISH_PACKAGE_ADVANCED
    Enum<OwnerRole::None>()   # OwnerRole
    Tuple(                    # PackageDefinition
        Map<String, Tuple>()
    )
    Blob("\${code_blob_hash}") # Code (from blob)
    Map<String, Tuple>()      # MetadataInit
    Some(AddressReservation("package_reservation")) # Option<GlobalAddressReservation>
;
CALL_FUNCTION
    NamedAddress("my_package")
    "BlueprintName"
    "function_call"
    # Arguments...
;
```





### Interaction with other intents



`USE_CHILD` (Added in V2 \| Pseudo-instruction)



Must appear at the start of the manifest, before all other instructions.

Defines an explicit child subintent, and names it so that it can be used with `YIELD_TO_CHILD` later in the manifest. It is expected that the constructor of a given manifest knows concretely the contents of any children that they include, so the subintent hash is used to specify the child.

For the manifest to be valid, the number of `YIELD_TO_CHILD` instructions targeting a given child must match the number of `YIELD_TO_PARENT` instructions in the child manifest.

**Example**

``` bash
USE_CHILD
    NamedIntent("child_one")
    Intent("subtxid_sim1achf7hzm72jwhu7vqhuauypjdfnrnnkxnfazn0ue94mkaet5uz3q5g6m2t")
;
```







`YIELD_TO_PARENT` (Added in V2 \| Subintent only)



Pauses or finishes execution of the subintent, and yields to the parent intent. Can also be used to transfer buckets to the parent.

Every subintent must end with an explicit `YIELD_TO_PARENT` to finish execution and return to the parent.

**Example**

``` bash
YIELD_TO_PARENT;
YIELD_TO_PARENT Bucket("my_bucket") Bucket("my_other_bucket");
YIELD_TO_PARENT Expression("ENTIRE_WORKTOP");
```







`YIELD_TO_CHILD` (Added in V2)



Pauses execution of the manifest, and yields to the specified child intent. Execution of the manifest resumes when the child calls `YIELD_TO_PARENT`.

**Examples**

``` bash
USE_CHILD
    NamedIntent("child_one")
    Intent("subtxid_sim1achf7hzm72jwhu7vqhuauypjdfnrnnkxnfazn0ue94mkaet5uz3q5g6m2t")
;
# ...
YIELD_TO_CHILD
    NamedIntent("child_one")
;
# ...
YIELD_TO_CHILD
    NamedIntent("child_one")
    Bucket("my_bucket")
    Bucket("my_other_bucket")
;
# ...
YIELD_TO_CHILD
    NamedIntent("child_one")
    Expression("ENTIRE_WORKTOP")
;
```







`VERIFY_PARENT` (Added in V2 \| Subintent only)



Sometimes, when constructing a subintent, you only want it to be used by a particular counterparty. For example, it could be used by dApps to give users or regulated integrators guarantees who will consume the subintent.

The `VERIFY_PARENT <access_rule>;` instruction can be used to ensure a subintent can only be used as a direct child of an intent which can meet some authorization criteria.

Specifically, it takes an [access rule](../authorization/advanced-accessrules.md) as an argument, and it asserts the access rule against the [auth zone](../authorization/index.md) of the parent intent's processor, which can see:

- Signatures of the parent intent, via a [signature requirement](../authorization/advanced-accessrules.md#signature-requirements)

- Proofs (e.g. of badges) created during execution which are currently on the parent's auth zone

We recommend using the [Rust Manifest Builder](../../integrate/rust-libraries/manifest-builder.md) to create this instruction, as the exact format of an access rule is quite fiddly in the manifest value model.

**Examples**

``` bash
VERIFY_PARENT
    Enum<AccessRule::Protected>(
        Enum<CompositeRequirement::BasicRequirement>(
            Enum<BasicRequirement::Require>(
                Enum<ResourceOrNonFungible::NonFungible>(
                    # Ed25519 signature badge address : public key hash hex
                    # This is most easily created using the Rust Manifest Builder
                    NonFungibleGlobalId("resource_sim1nfxxxxxxxxxxed25sgxxxxxxxxx002236757237xxxxxxxxx8x44q5:6a8a691dae2cd15ed0369931ce0a949ecafa5c3f93f8121833646e15c3")
                )
            )
        )
    )
;
```





## Native Blueprints

Methods callable on [Native Blueprints](../native-blueprints/index.md) are listed within their specifications, e.g. [Account](../native-blueprints/account.md#blueprint-api-function-reference)

## Arguments

In the Radix transaction manifest, all arguments are strongly typed Manifest SBOR Values in <a href="/v1/docs/manifest-value-syntax">Manifest Value Syntax</a>.

When making method/function calls, the Manifest SBOR value is converted by the transaction processor into a Scrypto SBOR value, which is then used to make the engine call. As part of this engine call, the resultant Scrypto value is validated by the Radix Engine against the Component’s interface’s schema at runtime.

### Named buckets

Buckets and proofs created in manifest can be referred by name.

To create a named bucket and use it for method call:

``` bash
TAKE_FROM_WORKTOP
    Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
    Decimal("1.0")
    Bucket("my_bucket")
;
CALL_METHOD
    Address("account_sim1cx0l2jhr3lg8mzg3gp3xsun94vtw3440w77xddvvp4cjte5gdvz35k")
    "deposit"
    Bucket("my_bucket")
;
```

### Named proofs

There are multiple ways to create a named proof to pass it by intent to a method.

Most of the times, this is the syntax you would use:

``` bash
# Lock fees
CALL_METHOD
  Address("account_sim1cx0l2jhr3lg8mzg3gp3xsun94vtw3440w77xddvvp4cjte5gdvz35k")
  "lock_fee"
  Decimal("10");

# Create a proof of a badge on your account. The "create_proof_of_amount" method returns a Proof to the authzone.
CALL_METHOD
  Address("account_sim1cx0l2jhr3lg8mzg3gp3xsun94vtw3440w77xddvvp4cjte5gdvz35k")
  "create_proof_of_amount"
  Address("resource_sim1n2q4le7dpzucmpnksxj5ku28r3t776pgk879cahgm76c2kfpz48fpj")
  Decimal("1");

# Get a named proof from the last proof to have been inserted in the authzone.
POP_FROM_AUTH_ZONE Proof("my_proof");

# You can now pass this proof to a method/function
```

You can also create a proof from a bucket:

``` bash
# Lock fees
CALL_METHOD
  Address("account_sim1cx0l2jhr3lg8mzg3gp3xsun94vtw3440w77xddvvp4cjte5gdvz35k")
  "lock_fee"
  Decimal("10");

CALL_METHOD
  Address("account_sim1cx0l2jhr3lg8mzg3gp3xsun94vtw3440w77xddvvp4cjte5gdvz35k")
  "withdraw"
  Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
  Decimal("10") ;

TAKE_FROM_WORKTOP
  Address("resource_sim1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxakj8n3")
  Decimal("10")
  Bucket("my_bucket");

# Create a proof from the bucket
CREATE_PROOF_FROM_BUCKET_OF_ALL
  Bucket("my_bucket")
  Proof("my_proof");

# You can now pass this proof to a method/function

# Because we withdrew tokens from our account and they are still on the
# worktop, we have to deposit them back into your account
CALL_METHOD
  Address("account_sim1cx0l2jhr3lg8mzg3gp3xsun94vtw3440w77xddvvp4cjte5gdvz35k")
  "deposit_batch"
  Expression("ENTIRE_WORKTOP");
```
