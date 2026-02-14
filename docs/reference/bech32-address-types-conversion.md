---
title: "Bech32 Address Types & Conversion"
---

# Bech32 Address Types & Conversion

## Converting Bech32 to Address Type

To convert a Bech32 address to an Address type in Scrypto (e.g., `ComponentAddress`), you can use the following example for a `ComponentAddress` on mainnet:

``` rust
let my_bech32_address = "component_tdx_2_1cptxxxxxxxxxfaucetxxxxxxxxx000527798379xxxxxxxxxyulkzl";
let my_component_address = ComponentAddress::try_from_bech32(
    &AddressBech32Decoder::new(&NetworkDefinition::stokenet()), 
    &my_bech32_address
).unwrap();
```

This approach is applicable for other address types such as `ResourceAddress`. Simply replace `ComponentAddress` with the desired address type.

If you are working in a different environment, replace `::stokenet()` with the appropriate network, such as `::mainnet()` or `::simulator()`.

## Converting Address Type to Bech32

To convert an Address type (e.g., ResourceAddress) to a Bech32 encoded address, you can use the following method:

``` rust
let my_resource_address = resource_manager.address();
let my_bech32_address = Runtime::bech32_encode_address(my_resource_address);
```

This method works for any address type. Replace `resource_manager.address()` with the appropriate method to obtain the address you want to encode.

By following these examples, you can easily convert between Bech32 encoded addresses and their respective Address types across different environments.
