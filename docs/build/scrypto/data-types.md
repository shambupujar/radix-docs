---
title: "Data Types"
---

Scrypto is based on Rust which is a statically typed language. All variables are associated with a type, either explicitly specified or inferred by the compiler.

In this section, we describe how different data types are supported.

## Primitive Types

Most primitive types are supported. You’re free to use any of the following types:

- `i8`, `i16`, `i32`, `i64`, `i128`, `isize`

- `u8`, `u16`, `u32`, `u64`, `u128`, `usize`

- `String`

:::note
`isize` and `usize` are compiled into `i32` and `u32` respectively.
:::


## Safe Types

Safe types are types that are guaranteed to panic, when they overflow as opposed to primitive types.

The following types are supported:

- `I8`, `I16`, `I32`, `I64`, `I128`, `I256`, `I384`, `I512`

- `U8`, `U16`, `U32`, `U64`, `U128`, `U256`, `U384`, `U512`

- `Decimal`, `PreciseDecimal`

:::note
Notice that there are types that have up to 512 bits of precision.
:::


``` rust
// builtin types wrap silently instead of panicking in case of overflow
let a: i32 = i32::MAX;
let b: i32 = i32::MAX + 1; // b is wrapping, no panic

// as opposed safe types panic in case of overflow
let c: I32 = I32::MAX;
let d: I32 = I32::MAX + 1; // d is overflowing, panic
```

Using safe types ensures that a transaction on RadixDLT will be rejected if any of the used safe types would overflow. This is important to make your code safe.

## Decimals

You might have noticed that there are no `f32` or `f64` listed in the previous section. That is because floating point arithmetic is not deterministic and does not work in distributed ledgers systems. Another technique we can use instead is fixed point arithmetic. We implemented this with the `Decimal` and `PreciseDecimal` types.

There are multiple ways to instantiate a Decimal:

``` rust
let a: Decimal = 10.into();
let b: Decimal = dec!(10);
let c: Decimal = dec!("10.333");
let d: Decimal = Decimal::from(20);
let e: Decimal = Decimal::from("20.123444");
```

Notice that you have to wrap numbers that have a fractional part in quotes. If you don’t, you will not be able to publish the package since it would contain floating-point numbers.

This `Decimal` type represents a 192 bit fixed-scale decimal number that can have up to **18 decimal places**. If you need even more precision, we provide the 256 bit `PreciseDecimal` type which allows up to **36 decimal places**.

Decimal and PreciseDecimal provide you some useful methods:

You can check out the `Decimal` <a href="https://docs.rs/scrypto/1.2.0/scrypto/math/struct.Decimal.html" target="_blank">Scrypto Crate Rust Docs here</a> to see all of them in detail.

Likewise the `PreciseDecimal` <a href="https://docs.rs/scrypto/1.2.0/scrypto/math/precise_decimal/struct.PreciseDecimal.html" target="_blank">Scrypto Crate Rust Docs here</a>

## Struct and Enums

Rust `struct` and `enum` are also supported, as long as the fields are of the supported types.

At this stage, no generics are supported for custom structs and enums.

To use enums in Scrypto, you have to make them derive `ScryptoSbor`:

``` rust
#[derive(ScryptoSbor)]
pub enum Color {
    White,
    Blue,
    Black,
    Red,
    Green,
}
```

## Container Types

In addition to basic types, the following container types are also supported:

- `Option<T>`: optional types

- `[T; N]`: array types

- `(T, U, P, L, E)`: tuple types

- `Vec<T>`: dynamic-length vector type

- `BTreeSet<T>`, `BTreeMap<K, V>`: B-Tree set and map

- `HashSet<T>`, `HashMap<K, V>`: Hash set and map

## Scrypto Types

Scrypto also introduces a few domain-specific types to enable asset-oriented programming.

#### Types related to blueprints and components

|  |  |
|:---|:---|
| Type | Description |
| `PackageAddress` | Represents the system-wide address of a Package. |
| `ComponentAddress` | Represents the system-wide address of a Component. |
| `Global<T>` | Represents a reference to a global object (e.g `Global<MyComponent>`). |
| `Globalizing<T>` | Represents a local component to be globalized. |
| `Attached<T>` | Represents an attached module to a global object (e.g `Attached<Metadata>`). |
| `Owned<T>` | Represents an owned local component. |
| `KeyValueStore` | Represents a lookup table and the data it contains. It uses key-value pairs to store and retrieve data. |

#### Types related to cryptograpy

|  |  |
|:---|:---|
| Type | Description |
| `Hash` | Represents a 32-byte hash digest. Currently, the only supported hash algorithm is `SHA256`. |
| `Secp256k1PublicKey` | Represents an ECDSA public key. Currently, the only supported curve is `secp256k1`. |
| `Secp256k1PrivateKey` | Represents an ECDSA signature. Currently, the only supported curve is `secp256k1`. |

#### Types related to Math

|  |  |
|:---|:---|
| Type | Description |
| `Decimal` | `Decimal` type represents a 192 bit fixed-scale decimal number that can have up to **18 decimal places**. |
| `PreciseDecimal` | If you need even more precision, we provide the 256 bit `PreciseDecimal` type which allows up to **36 decimal places** |

#### Types related to Resources

|  |  |
|:---|:---|
| Type | Description |
| `Bucket` | Represents a bucket of resources. Can be of fungible or non-fungible type. Resources in Scrypto can only be moved using Buckets. |
| `FungibleBucket` | Represents a bucket of fungible resource. This bucket can only contain fungible resource. |
| `NonFungibleBucket` | Represents a bucket of non-fungible resource. This bucket can only contain non-fungible resource. |
| `Proof` | Represents a proof of ownership of a resource. Can be a proof of a fungible resource or non-fungible resource. |
| `FungibleProof` | Represents a proof of a fungible resource. Can only be of a fungible resource. |
| `NonFungibleProof` | Represents a proof of a non-fungible resource. Can only be of a non-fungible resource. |
| `CheckedProof` | Represents a proof that has been validated to be legitimate at the application layer. |
| `Vault` | Represents a vault of resources. Resources in Scrypto can only be stored using Vaults. |
| `FungibleVault` | Represents a vault which contains a fungible resource. Can only contain fungible resource. |
| `NonFungibleVault` | Represents a vault which contains a non-fungible resource. Can only contain non-fungible resource. |
| `NonFungibleGlobalId` | Represents a system-wide address of a Non-Fungible Resource. |
| `NonFungibleLocalId` | Represents an Id of an Non-Fungible Resource. |
| `ResourceAddress` | Represents a system-wide address of a Resource. |
