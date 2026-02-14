---
title: "Transaction Non Fungible Resource Creation"
---

It is possible to create non-fungible resources with transactions, but it is quite hard to create them manually - this is because a non-fungible resource includes a [Scrypto SBOR Schema](/v1/docs/sbor-schemas) for the non-fungible data.

Instead, it’s better to build the transaction with the [Rust Manifest Builder](../../integrate/rust-libraries/manifest-builder.md), and then submit it using the [developer console](../../reference/developer-tools/developer-console.md).

## Building the Transfer Manifest with the Rust Manifest Builder

First, set-up a Rust/Scrypto project as in the [Rust Manifest Builder](../../integrate/rust-libraries/manifest-builder.md) docs.

The below test can be run to output a manifest to `./transaction_manifest/create_non_fungible.rtm` with the `CREATE_NON_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY` command.

You can tweak lots of the parameters, including renaming/restructuring `MyNonFungibleDataType`.

This code uses `.lock_fee_from_faucet()` to lock the standard test fee from the system faucet in Stokenet. [Learn more about Lock Fees here](../../integrate/rust-libraries/manifest-builder.md#:~:text=Lock%20Fee,-lock_fee).

``` rust
use scrypto::prelude::*;
use scrypto_test::{ prelude::*, utils::dump_manifest_to_file_system };

// The top level struct must derive NonFungibleData.
// Note that marking top-level fields as `#[mutable]` means that the data under
// that field can be updated by the `resource_manager.update_non_fungible_data(...)` method.
//
// All types referenced directly/indirectly also need to derive ScryptoSbor.
// To work with the Manifest Builder, we recommend all types also derive ManifestSbor.
#[derive(ScryptoSbor, NonFungibleData, ManifestSbor)]
struct MyNonFungibleDataType {
    pub name: String,
    pub description: String,
    #[mutable]
    pub key_image_url: Url,
}

#[test]
fn create_nf_resource() {
    let network = NetworkDefinition::stokenet();

    let manifest_builder = ManifestBuilder::new()
        .lock_fee_from_faucet()
        .create_non_fungible_resource(
            OwnerRole::None,
            NonFungibleIdType::Integer,
            true,
            NonFungibleResourceRoles::default(),
            metadata!(
                init {
                    "name" => "Example NF", locked;
                }
            ),
            // Change the below Some expression to None::<IndexMap<NonFungibleLocalId, MyNonFungibleDataType>>,
            // To output CREATE_NON_FUNGIBLE_RESOURCE (without initial supply)
            Some(
                indexmap! {
                NonFungibleLocalId::integer(1) => MyNonFungibleDataType {
                    name: "hello world".to_owned(),
                    description: "lorem ipsum".to_owned(),
                    key_image_url: Url::of("https://assets-global.website-files.com/618962e5f285fb3c879d82ca/61b8f414d213fd7349b654b9_icon-DEX.svg"),
                },
            }
            )
        );

    dump_manifest_to_file_system(
        manifest_builder.object_names(),
        &manifest_builder.build(),
        "./transaction_manifest",
        Some("create_non_fungible"),
        &network
    ).err();
}
```

Example manifest output is as follows. Note that because it is automatically generated, it doesn’t use the [manifest type aliases](../transactions-manifests/manifest-instructions.md) which are typically used for manual creation.

``` bash
CALL_METHOD
    Address("component_tdx_2_1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxyulkzl")
    "lock_fee"
    Decimal("5000")
;
CREATE_NON_FUNGIBLE_RESOURCE_WITH_INITIAL_SUPPLY
    Enum<0u8>()
    Enum<1u8>()
    true
    Enum<0u8>(
        Enum<0u8>(
            Tuple(
                Array<Enum>(
                    Enum<14u8>(
                        Array<Enum>(
                            Enum<0u8>(
                                12u8
                            ),
                            Enum<0u8>(
                                12u8
                            ),
                            Enum<0u8>(
                                198u8
                            )
                        )
                    )
                ),
                Array<Tuple>(
                    Tuple(
                        Enum<1u8>(
                            "MyNonFungibleDataType"
                        ),
                        Enum<1u8>(
                            Enum<0u8>(
                                Array<String>(
                                    "name",
                                    "description",
                                    "key_image_url"
                                )
                            )
                        )
                    )
                ),
                Array<Enum>(
                    Enum<0u8>()
                )
            )
        ),
        Enum<1u8>(
            0u64
        ),
        Array<String>()
    )
    Map<NonFungibleLocalId, Tuple>(
        NonFungibleLocalId("#1#") => Tuple(
            Tuple(
                "hello world",
                "lorem ipsum",
                "https://assets-global.website-files.com/618962e5f285fb3c879d82ca/61b8f414d213fd7349b654b9_icon-DEX.svg"
            )
        )
    )
    Tuple(
        Enum<0u8>(),
        Enum<0u8>(),
        Enum<0u8>(),
        Enum<0u8>(),
        Enum<0u8>(),
        Enum<0u8>(),
        Enum<0u8>()
    )
    Tuple(
        Map<String, Tuple>(
            "name" => Tuple(
                Enum<1u8>(
                    Enum<0u8>(
                        "Example NF"
                    )
                ),
                true
            )
        ),
        Map<String, Enum>()
    )
    Enum<0u8>()
;
```
