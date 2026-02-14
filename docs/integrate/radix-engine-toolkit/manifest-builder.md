---
title: "Manifest Builder"
---

# Manifest Builder

One of the core features offered in the [Radix Engine Toolkit](index.md) is a manifest builder that closely mimics the [Rust Manifest Builder](../rust-libraries/manifest-builder.md) but that works over a foreign function interface (FFI). Thus, the Radix Engine Toolkit manifest builder is not identical to the one in Rust but quite similar. This article explores what methods the manifest builder has, what differences exist between it and the Rust manifest builder, and provides examples and guidance of how this manifest builder may be used in the various Radix Engine Toolkit wrappers.

## Methods

Before discussing what methods are available in the Radix Engine Toolkit manifest builder, some context should be given to the reader on the various instruction models that exist.

The instructions interpreter (the transaction processor) only understands a small handful of instructions. This includes instructions such as `CallMethod`, `CallFunction`, `TakeFromWorktop`, and so on. To the interpreter, there does not exist a `CreateAccount`, `PublishPackage`, `SetMetadata`, or other instructions despite them appearing in `.rtm` files. The transaction manifest compiler has several instruction aliases defined such as `PublishPackage` and maps those high-level instructions to their lower-level equivalent that can be processed by the interpreter, the lower-level representation of these instructions is typically a `CallMethod` or a `CallFunction`. In a way, the compiler extends the set of instructions the interpreter supports by adding various high-level aliases. The following links contain more information on this:

- The list of instructions understood by the instructions interpreter (the transaction processor) can be found <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/main/radix-transactions/src/model/v1/instruction_v1.rs#L526-L701">here</a>.

- The list of instructions understood by the transaction manifest compiler can be found <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/main/radix-transactions/src/manifest/ast.rs#L4-L256">here</a>.

The following diagram shows how all of the various builders and compilers eventually create instructions from the base instruction set that’s understood by the instructions interpreter.







![instruction2.png](/img/instruction2.png)

The Radix Engine Toolkit manifest builder supports the following instructions:

- All of the instructions are understood by the instructions interpreter (the transaction processor).

- Instruction aliases for all of the methods and functions of the native components.

The Radix Engine Toolkit manifest builder supports all of the base instructions as well as many other instruction aliases. It is important to note that there may be differences between the instruction aliases supported by the Rust and Radix Engine Toolkit manifest builders such as the name, the order of arguments, and so on. The naming scheme adopted for all of the aliases supported by this manifest builder will be: `\${blueprint_name}_{method_or_function_name}` which can already be seen in aliases such as `account_lock_fee`. Any aliases that are not supported by this manifest builder may be modeled as regular method or function calls by the client.

The following is a full list of all of the methods that exist on the Radix Engine Toolkit manifest builder:



List of all Radix Engine Toolkit manifest builder methods



**Base Instructions**

- `take_all_from_worktop`

- `take_from_worktop`

- `take_non_fungibles_from_worktop`

- `return_to_worktop`

- `assert_worktop_contains_any`

- `assert_worktop_contains`

- `assert_worktop_contains_non_fungibles`

- `pop_from_auth_zone`

- `push_to_auth_zone`

- `drop_auth_zone_proofs`

- `drop_auth_zone_signature_proofs`

- `drop_all_proofs`

- `create_proof_from_auth_zone_of_all`

- `create_proof_from_auth_zone_of_amount`

- `create_proof_from_auth_zone_of_non_fungibles`

- `create_proof_from_bucket_of_all`

- `create_proof_from_bucket_of_amount`

- `create_proof_from_bucket_of_non_fungibles`

- `burn_resource`

- `clone_proof`

- `drop_proof`

- `call_function`

- `call_method`

- `call_royalty_method`

- `call_metadata_method`

- `call_access_rules_method`

- `call_direct_vault_method`

- `allocate_global_address`

**Misc Aliases**

- `create_fungible_resource_manager`

- `mint_fungible`

**Faucet**

- `faucet_free_xrd`

- `faucet_lock_fee`

**Account**

- `account_create_advanced`

- `account_create`

- `account_securify`

- `account_lock_fee`

- `account_lock_contingent_fee`

- `account_deposit`

- `account_try_deposit_or_abort`

- `account_try_deposit_or_refund`

- `account_deposit_batch`

- `account_try_deposit_batch_or_abort`

- `account_try_deposit_batch_or_refund`

- `account_deposit_entire_worktop`

- `account_try_deposit_entire_worktop_or_refund`

- `account_try_deposit_entire_worktop_or_abort`

- `account_withdraw`

- `account_withdraw_non_fungibles`

- `account_lock_fee_and_withdraw`

- `account_lock_fee_and_withdraw_non_fungibles`

- `account_create_proof_of_amount`

- `account_create_proof_of_non_fungibles`

- `account_set_default_deposit_rule`

- `account_set_resource_preference`

- `account_remove_resource_preference`

- `account_burn`

- `account_burn_non_fungibles`

- `account_add_authorized_depositor`

- `account_remove_authorized_depositor`

**Validator**

- `validator_register`

- `validator_unregister`

- `validator_stake_as_owner`

- `validator_stake`

- `validator_unstake`

- `validator_claim_xrd`

- `validator_update_key`

- `validator_update_fee`

- `validator_update_accept_delegated_stake`

- `validator_accepts_delegated_stake`

- `validator_total_stake_xrd_amount`

- `validator_total_stake_unit_supply`

- `validator_get_redemption_value`

- `validator_signal_protocol_update_readiness`

- `validator_get_protocol_update_readiness`

- `validator_lock_owner_stake_units`

- `validator_start_unlock_owner_stake_units`

- `validator_finish_unlock_owner_stake_units`

**Access Controller**

- `access_controller_new_from_public_keys`

- `access_controller_create_with_security_structure`

- `access_controller_create`

- `access_controller_create_proof`

- `access_controller_initiate_recovery_as_primary`

- `access_controller_initiate_recovery_as_recovery`

- `access_controller_initiate_badge_withdraw_as_primary`

- `access_controller_initiate_badge_withdraw_as_recovery`

- `access_controller_quick_confirm_primary_role_recovery_proposal`

- `access_controller_quick_confirm_recovery_role_recovery_proposal`

- `access_controller_quick_confirm_primary_role_badge_withdraw_attempt`

- `access_controller_quick_confirm_recovery_role_badge_withdraw_attempt`

- `access_controller_timed_confirm_recovery`

- `access_controller_cancel_primary_role_recovery_proposal`

- `access_controller_cancel_recovery_role_recovery_proposal`

- `access_controller_cancel_primary_role_badge_withdraw_attempt`

- `access_controller_cancel_recovery_role_badge_withdraw_attempt`

- `access_controller_lock_primary_role`

- `access_controller_unlock_primary_role`

- `access_controller_stop_timed_recovery`

- `access_controller_mint_recovery_badges`

**Identity**

- `identity_create_advanced`

- `identity_create`

- `identity_securify`

**Package**

- `package_publish`

- `package_publish_advanced`

- `package_claim_royalty`

**One Resource Pool**

- `one_resource_pool_instantiate`

- `one_resource_pool_contribute`

- `one_resource_pool_redeem`

- `one_resource_pool_protected_deposit`

- `one_resource_pool_protected_withdraw`

- `one_resource_pool_get_redemption_value`

- `one_resource_pool_get_vault_amount`

**Two Resource Pool**

- `two_resource_pool_instantiate`

- `two_resource_pool_contribute`

- `two_resource_pool_redeem`

- `two_resource_pool_protected_deposit`

- `two_resource_pool_protected_withdraw`

- `two_resource_pool_get_redemption_value`

- `two_resource_pool_get_vault_amount`

**Multi Resource Pool**

- `multi_resource_pool_instantiate`

- `multi_resource_pool_contribute`

- `multi_resource_pool_redeem`

- `multi_resource_pool_protected_deposit`

- `multi_resource_pool_protected_withdraw`

- `multi_resource_pool_get_redemption_value`

- `multi_resource_pool_get_vault_amount`

**Metadata Module**

- `metadata_get`

- `metadata_set`

- `metadata_lock`

- `metadata_remove`

**Role Assignment Module**

- `role_assignment_get`

- `role_assignment_set`

- `role_assignment_set_owner`

- `role_assignment_lock_owner`

**Royalty Module**

- `royalty_set`

- `royalty_lock`

- `royalty_claim`





## Buckets, Proofs, NamedAddresses, and AddressReservations

The Radix Engine Toolkit manifest builder follows a no-callbacks approach that allows for buckets, proofs, named-addresses, and address reservations to be created without the need for callbacks. This approach makes the manifest builder easier to use and allows it to work over the foreign function interface offered by the toolkit.

Manifest builder methods that create buckets, proofs, named-addresses, or address reservations will be referred to as *source methods* and *sink methods* are methods that consume them. As an example, a `take_from_worktop` is a source manifest builder method since it results in the creation of a new bucket whereas `burn_resource` is a sink method as it consumes the bucket.

The approach followed with transaction transient objects such as buckets, proofs, named addresses, and address reservations in the Radix Engine Toolkit manifest builder is as follows:

- Source methods have an argument that controls the name given to the objects.

- Transient objects are identified by the names given to them at the source methods when sink methods are called.

The following are examples to better aid in explaining this:



C#



``` csharp
using static RadixEngineToolkit.RadixEngineToolkitUniffiMethods;
using RadixEngineToolkit;
using Decimal = RadixEngineToolkit.Decimal;

const byte networkId = 0x02;
var xrd = KnownAddresses(networkId).resourceAddresses.xrd

using var address =
    new Address("account_tdx_2_169ukwfsne0zvwrvsyk3mm3x7m6hggup52t6ng547m9a2qp6q5y99h8");

using var manifest = new ManifestBuilder()
    .FaucetFreeXrd()
    // The following is a source method that creates a bucket by taking a specified amount of 
    // resources from the worktop and into a bucket. The name to use for this bucket is `xrdBucket`.
    // Any following method that wishes to refer to this bucket, it must refer to it using the name
    // given to it here.
    .TakeFromWorktop(xrd, new Decimal("10000"), new ManifestBuilderBucket("xrdBucket"))
    // The following is a sink method that consumes buckets by depositing them into an account. When
    // wishing to refer to the bucket created by the previous method the same name that the bucket
    // was created with is used again here.
    .AccountTryDepositOrAbort(address, new ManifestBuilderBucket("xrdBucket"), null)
    .Build(networkId);
```







Kotlin



``` kotlin
import com.radixdlt.ret.*

fun main(args: Array<String>) {
    val networkId: UByte = 0x02u
    val xrd = knownAddresses(networkId).resourceAddresses.xrd

    val address = Address("account_tdx_2_169ukwfsne0zvwrvsyk3mm3x7m6hggup52t6ng547m9a2qp6q5y99h8")

    val manifest =
        ManifestBuilder()
            .faucetFreeXrd()
            // The following is a source method that creates a bucket by taking a specified amount
            // of resources from the worktop and into a bucket. The name to use for this bucket is
            // `xrdBucket`. Any following method that wishes to refer to this bucket, it must refer
            // to it using the name given to it here.
            .takeFromWorktop(xrd, Decimal("10000"), ManifestBuilderBucket("xrdBucket"))
            // The following is a sink method that consumes buckets by depositing them into an
            // account. When wishing to refer to the bucket created by the previous method the same
            // name that the bucket was created with is used again here.
            .accountTryDepositOrAbort(address, ManifestBuilderBucket("xrdBucket"), null)
            .build(networkId)
}
```







Python



``` python
from radix_engine_toolkit import *

network_id: int = 0x02
xrd: Address = known_addresses(network_id).resource_addresses.xrd

address: Address = Address(
    "account_tdx_2_169ukwfsne0zvwrvsyk3mm3x7m6hggup52t6ng547m9a2qp6q5y99h8"
)

manifest: TransactionManifest = (
    ManifestBuilder().faucet_free_xrd()
    # The following is a source method that creates a bucket by taking a specified amount of
    # resources from the worktop and into a bucket. The name to use for this bucket is `xrdBucket`.
    # Any following method that wishes to refer to this bucket, it must refer to it using the name
    # given to it here.
    .take_from_worktop(xrd, Decimal("10000"), ManifestBuilderBucket("xrd_bucket"))
    # The following is a sink method that consumes buckets by depositing them into an account. When
    # wishing to refer to the bucket created by the previous method the same name that the bucket
    # was created with is used again here.
    .build(network_id)
)
```







Swift



``` swift
import EngineToolkit
import Foundation

let networkId: UInt8 = 0x02
let xrd = knownAddresses(networkId: networkId).resourceAddresses.xrd

let address = try! Address(
    address: "account_tdx_2_169ukwfsne0zvwrvsyk3mm3x7m6hggup52t6ng547m9a2qp6q5y99h8"
)

let manifest = try! ManifestBuilder()
    .faucetFreeXrd()
    // The following is a source method that creates a bucket by taking a specified amount of 
    // resources from the worktop and into a bucket. The name to use for this bucket is `xrdBucket`.
    // Any following method that wishes to refer to this bucket, it must refer to it using the name
    // given to it here.
    .takeFromWorktop(
        resourceAddress: xrd, 
        amount: Decimal(value: "10000"), 
        intoBucket: ManifestBuilderBucket(name: "xrdBucket")
    )
    // The following is a sink method that consumes buckets by depositing them into an account. When
    // wishing to refer to the bucket created by the previous method the same name that the bucket
    // was created with is used again here.
    .accountTryDepositOrAbort(
        accountAddress: address, 
        bucket: ManifestBuilderBucket(name: "xrdBucket"),
        authorizedDepositorBadge: nil
    )
    .build(networkId: networkId)
```





## Method and Function Calls

Due to the large amount of aliases supported by the Radix Engine Toolkit manifest builder, any interactions with native components or packages should not require the use of `CallMethod` or `CallFunction` directly; the manifest builder offers high-level methods which it translates to the lower-level `CallFunction` and `CallMethod` instructions on behalf of the client. However, outside of native components and packages, there is a need to use `CallFunction` and `CallMethod` in manifests. As an example, to call some component and perform a swap.

This section shows how the CallMethod and CallFunction methods on the Radix Engine Toolkit manifest builder may be used in an example manifest. This manifest gets some free XRD from the faucet and deposits them into an account by using CallMethod alone.

Note

The following manifests can be built without the use of `CallMethod` at all since these are all methods that have aliases. This example uses `CallMethod` for them just to show how it can be used.



C#



``` csharp
using RadixEngineToolkit;
using static RadixEngineToolkit.RadixEngineToolkitUniffiMethods;
using Decimal = RadixEngineToolkit.Decimal;

const byte networkId = 0x02;
using var xrd = KnownAddresses(networkId).resourceAddresses.xrd;
using var faucet = KnownAddresses(networkId).componentAddresses.faucet;

using var account =
    new Address("account_tdx_2_168e8u653alt59xm8ple6khu6cgce9cfx9mlza6wxf7qs3wwdyqvusn");

using var manifest = new ManifestBuilder()
    .CallMethod(
        new ManifestBuilderAddress.Static(faucet), // <1>
        "free", 
        new ManifestBuilderValue[] { } // <2>
    )
    .TakeFromWorktop(xrd, new Decimal("10000"), new ManifestBuilderBucket("xrd"))
    .CallMethod(
        new ManifestBuilderAddress.Static(account), // <1>
        "try_deposit_or_abort",
        new ManifestBuilderValue[] // <2>
        {
            new ManifestBuilderValue.BucketValue(new ManifestBuilderBucket("xrd")),
            new ManifestBuilderValue.EnumValue(0, new ManifestBuilderValue[] { }) // <3>
        })
    .Build(networkId);

manifest.StaticallyValidate();
```







Kotlin



``` kotlin
import com.radixdlt.ret.*;

fun main() {
    val networkId: UByte = 0x02u;
    val xrd = knownAddresses(networkId).resourceAddresses.xrd;
    val faucet = knownAddresses(networkId).componentAddresses.faucet;

    val account = Address("account_tdx_2_168e8u653alt59xm8ple6khu6cgce9cfx9mlza6wxf7qs3wwdyqvusn");

    val manifest = ManifestBuilder()
        .callMethod(
            ManifestBuilderAddress.Static(faucet), // <1>
            "free", 
            listOf() // <2>
        )
        .takeFromWorktop(xrd, Decimal("10000"), ManifestBuilderBucket("xrd"))
        .callMethod(
            ManifestBuilderAddress.Static(account), // <1>
            "try_deposit_or_abort",
            listOf( // <2>
                ManifestBuilderValue.BucketValue(ManifestBuilderBucket("xrd")),
                ManifestBuilderValue.EnumValue(0u, listOf()) // <3>
            )
        )
        .build(networkId);
    manifest.staticallyValidate();
}
```







Python



``` python
from radix_engine_toolkit import *

network_id: int = 0x02
xrd: Address = known_addresses(network_id).resource_addresses.xrd
faucet: Address = known_addresses(network_id).component_addresses.faucet

account: Address = Address(
    "account_tdx_2_168e8u653alt59xm8ple6khu6cgce9cfx9mlza6wxf7qs3wwdyqvusn"
)

manifest: TransactionManifest = (
    ManifestBuilder()
    .call_method(
        ManifestBuilderAddress.STATIC(faucet), # <1>
        "free", 
        [] # <2>
    )
    .take_from_worktop(xrd, Decimal("10000"), ManifestBuilderBucket("xrd"))
    .call_method(
        ManifestBuilderAddress.STATIC(account), # <1>
        "try_deposit_or_abort",
        [ # <2>
            ManifestBuilderValue.BUCKET_VALUE(ManifestBuilderBucket("xrd")),
            ManifestBuilderValue.ENUM_VALUE(0, []), # <3>
        ],
    )
    .build(network_id)
)
manifest.statically_validate()
```







Swift



``` swift
import EngineToolkit
import Foundation

let networkId: UInt8 = 0x02
let xrd = knownAddresses(networkId: networkId).resourceAddresses.xrd
let faucet = knownAddresses(networkId: networkId).componentAddresses.faucet

let account = try! Address(address: "account_tdx_2_168e8u653alt59xm8ple6khu6cgce9cfx9mlza6wxf7qs3wwdyqvusn")

let manifest = try! ManifestBuilder()
    .callMethod(
        address: ManifestBuilderAddress.static(value: faucet), // <1>
        methodName: "free", 
        args: [] // <2>
    )
    .takeFromWorktop(
        resourceAddress: xrd, 
        amount: Decimal(value: "10000"), 
        intoBucket: ManifestBuilderBucket(name: "xrd")
    )
    .callMethod(
        address: ManifestBuilderAddress.static(value: account), // <1>
        methodName: "try_deposit_or_abort",
        args: [ // <2>
            ManifestBuilderValue.bucketValue(value: ManifestBuilderBucket(name: "xrd")),
            ManifestBuilderValue.enumValue(discriminator: 0, fields: []), // <3>
        ])
    .build(networkId: networkId)
try! manifest.staticallyValidate()
```





There are several things to note about the examples above. Each of the following points map to an area of the above examples.

1.  The first argument to a `CallMethod` is a `ManifestBuilderAddress` which is a <a href="https://en.wikipedia.org/wiki/Algebraic_data_type">sum type</a> that can either be `Static` or `Named`.

    - Static addresses are addresses that are known prior to the manifest’s execution. As an example, the address of XRD, the Faucet component, a package that’s already been published, or a component that has already been instantiated in a prior transaction.

    - Named addresses are addresses that are **not** known prior to the manifests’s execution. They’re allocated during the manifest’s runtime as a result of `AllocateGlobalAddress` instructions.

2.  The last argument to a `CallMethod` instruction is a list or array of `ManifestBuilderValue` which are the arguments that the method will be called with. In the case of the call to the `free` method on the faucet, there are no arguments; thus, an empty array or list is provided. On the other hand, the `try_deposit_or_abort` method on account components expects a bucket and an `Option<ResourceOrNonFungible>` (as seen <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/d16b3ffa65fea417e9c6d01d76456a0b36c060fa/radix-engine-interface/src/blueprints/account/invocations.rs#L317-L321">here</a>). Thus, the arguments provided through the manifest builder is a `ManifestBuilderValue.BucketValue` and a `ManifestBuilderValue.EnumValue`. Any `Option<T>` can be modeled as a `ManifestBuilderValue.EnumValue` of discriminator 0 and no fields.

3.  `Option<T>`, `Result<O, E>`, and other enums can be modeled as `ManifestBuilderValue.EnumValue`. The discriminator is the index of the enum variant. As an example, for `Option<T>` the discriminator of `None` is 0 and the discriminator of `Some` is 1 (as seen <a href="https://doc.rust-lang.org/src/core/option.rs.html#563-572">here</a>). Similarly, for `Result<O, E>`, the discriminator of `Ok` is 0 and the discriminator of `Err` is 1.

4.  For a comprehensive list of data types compatible with `ManifestBuilder`, refer to the [Data Types](../../build/scrypto/data-types.md) documentation. When working in other languages like Python, certain types such as `i32` are not directly supported. Instead, you must use the corresponding type from the Radix Engine Toolkit library. For example, when using `.CALL_METHOD` with an `i32` argument (e.g., `-6927i32`), you should use `ManifestBuilderValue.I32_VALUE(-6927)` instead. An example for `Python` is provided in the next section.

## Usage Examples

### Account to Account Transfer



C#



``` csharp
using RadixEngineToolkit;
using static RadixEngineToolkit.RadixEngineToolkitUniffiMethods;
using Decimal = RadixEngineToolkit.Decimal;

const byte networkId = 0x02;
var xrd = KnownAddresses(networkId).resourceAddresses.xrd;

using var address1 =
    new Address("account_tdx_2_168e8u653alt59xm8ple6khu6cgce9cfx9mlza6wxf7qs3wwdyqvusn");
using var address2 =
    new Address("account_tdx_2_169ukwfsne0zvwrvsyk3mm3x7m6hggup52t6ng547m9a2qp6q5y99h8");

using var manifest = new ManifestBuilder()
    .AccountLockFeeAndWithdraw(address1, new Decimal("10"), xrd, new Decimal("1000"))
    .TakeFromWorktop(xrd, new Decimal("1000"), new ManifestBuilderBucket("xrdBucket"))
    .AccountTryDepositOrAbort(address2, new ManifestBuilderBucket("xrdBucket"), null)
    .Build(networkId);
```







Kotlin



``` kotlin
import com.radixdlt.ret.*

fun main(args: Array<String>) {
    val networkId: UByte = 0x02u
    val xrd = knownAddresses(networkId).resourceAddresses.xrd

    val address1 = Address("account_tdx_2_168e8u653alt59xm8ple6khu6cgce9cfx9mlza6wxf7qs3wwdyqvusn")
    val address2 = Address("account_tdx_2_169ukwfsne0zvwrvsyk3mm3x7m6hggup52t6ng547m9a2qp6q5y99h8")

    val manifest =
        ManifestBuilder()
            .accountLockFeeAndWithdraw(address1, Decimal("10"), xrd, Decimal("1000"))
            .takeFromWorktop(xrd, Decimal("1000"), ManifestBuilderBucket("xrdBucket"))
            .accountTryDepositOrAbort(address2, ManifestBuilderBucket("xrdBucket"), null)
            .build(networkId)
}
```







Python



``` python
from radix_engine_toolkit import *

network_id: int = 0x02
xrd: Address = known_addresses(network_id).resource_addresses.xrd

address1: Address = Address(
    "account_tdx_2_168e8u653alt59xm8ple6khu6cgce9cfx9mlza6wxf7qs3wwdyqvusn"
)
address2: Address = Address(
    "account_tdx_2_169ukwfsne0zvwrvsyk3mm3x7m6hggup52t6ng547m9a2qp6q5y99h8"
)
component_address: Address = Address(
    "component_tdx_2_1234kwfsne0zvwrvsyk3mm3x7m6hggup52t6ng547m9a2qp6q5yabcd"
)

manifest: TransactionManifest = (
    ManifestBuilder()
    .account_lock_fee_and_withdraw(address1, Decimal("10"), xrd, Decimal("1000"))
    .take_from_worktop(xrd, Decimal("1000"), ManifestBuilderBucket("xrdBucket"))
    .account_try_deposit_or_abort(address2, ManifestBuilderBucket("xrdBucket"))
    .build(network_id)
)

manifest2: TransactionManifest = (
    .account_lock_fee_and_withdraw(address1, Decimal("10"), xrd, Decimal("1000"))
    .take_from_worktop(xrd, Decimal("1000"), ManifestBuilderBucket("xrdBucket"))
    .call_method(
        ManifestBuilderAddress.STATIC(component_address),
        "function_name",[
            ManifestBuilderValue.I32_VALUE(-6927), 
            ManifestBuilderValue.BUCKET_VALUE(ManifestBuilderBucket("xrdBucket"))
    ])
    .account_deposit_entire_worktop(addres1)
)
```







Swift



``` swift
import EngineToolkit
import Foundation

let networkId: UInt8 = 0x02
let xrd = knownAddresses(networkId: networkId).resourceAddresses.xrd

let address1 = try! Address(
    address: "account_tdx_2_168e8u653alt59xm8ple6khu6cgce9cfx9mlza6wxf7qs3wwdyqvusn"
)
let address2 = try! Address(
    address: "account_tdx_2_169ukwfsne0zvwrvsyk3mm3x7m6hggup52t6ng547m9a2qp6q5y99h8"
)

let manifest = try! ManifestBuilder()
    .accountLockFeeAndWithdraw(
        accountAddress: address1, 
        amountToLock: Decimal(value: "10"), 
        resourceAddress: xrd, 
        amount: Decimal(value: "1000")
    )
    .takeFromWorktop(
        resourceAddress: xrd, 
        amount: Decimal(value: "10000"), 
        intoBucket: ManifestBuilderBucket(name: "xrdBucket")
    )
    .accountTryDepositOrAbort(
        accountAddress: address2, 
        bucket: ManifestBuilderBucket(name: "xrdBucket"),
        authorizedDepositorBadge: nil
    )
    .build(networkId: networkId)
```




