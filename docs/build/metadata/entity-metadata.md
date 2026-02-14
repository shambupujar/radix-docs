---
title: "Entity Metadata"
---

# Entity Metadata

Metadata can be added against any global entity, either at creation time, or later using the metadata module’s metadata_set role.

Metadata consists of key-value pairs, where the key is a string (max length 100), and the value either a single value, or a list of values, or a given entity datatype (the value has a max total length of ~4000 bytes).

There is a metadata standard of common metadata entries which should be considered when configuring an entity of a given type. We also recommend that you configure an `OwnerRole` on any created components or resources so that you can update the metadata in future, if new rules or functionalities are added to the standard.

## Entity datatypes

The supported entity datatypes are detailed below.

Each entry value can be either a singleton of a given type, or a list of the same data type. The Singleton Id and List Id columns are the Enum variants of the data type which you may see in the manifest for the given data type.



**Type:** `String`



**Singleton Id:** `0u8`

**List Id:** `128u8`

**Description:** A String of text.

**Example**

``` rust
.metadata(metadata! {
    init {
        "name" => "Component name", locked;
        "description" => "Some description", locked;
        "tags" => ["DEX", "radiswap"], locked;
    }
})
```







**Type:** `Bool`



**Singleton Id:** `1u8`

**List Id:** `129u8`

**Description:** A boolean value.

**Example**

``` rust
.metadata(metadata! {
    init {
        "is_enabled" => true, updatable;
    }
})
```







**Type:** `U8`



**Singleton Id:** `2u8`

**List Id:** `130u8`

**Description:** A byte (u8 value).

**Example**

``` rust
.metadata(metadata! {
    init {
        "some_byte" => 3u8, fixed;
    }
})
```







**Type:** `U32`



**Singleton Id:** `3u8`

**List Id:** `131u8`

**Description:** A 32-bit unsigned integer.

**Example**

``` rust
.metadata(metadata! {
    init {
        "some_u32" => 3u32, fixed;
    }
})
```







**Type:** `U64`



**Singleton Id:** `4u8`

**List Id:** `132u8`

**Description:** A 64-bit unsigned integer.

**Example**

``` rust
.metadata(metadata! {
    init {
        "some_u64" => 3u64, fixed;
    }
})
```







**Type:** `I32`



**Singleton Id:** `5u8`

**List Id:** `133u8`

**Description:** A 32-bit signed integer.

**Example**

``` rust
.metadata(metadata! {
    init {
        "some_i32" => 3i32, fixed;
    }
})
```







**Type:** `I64`



**Singleton Id:** `6u8`

**List Id:** `134u8`

**Description:** A 64-bit signed integer.

**Example**

``` rust
.metadata(metadata! {
    init {
        "some_i64" => 3i64, fixed;
    }
})
```







**Type:** `Decimal`



**Singleton Id:** `7u8`

**List Id:** `135u8`

**Description:** A Decimal value.

**Example**

``` rust
.metadata(metadata! {
    init {
        "pi" => dec!("3.145"), fixed;
    }
})
```







**Type:** `Address`



**Singleton Id:** `8u8`

**List Id:** `136u8`

**Description:** Any global address.

**Example**

``` rust
.metadata(metadata! {
    init {
        "claimed_entities" => [
            GlobalAddress::from(component_1),
            GlobalAddress::from(component_2),
            GlobalAddress::from(resource_1),
        ], mutable;
        "dapp_definitions" => [
            GlobalAddress::from(dapp_definition_account_1),
        ], fixed;
        "friend" => component_3,
    }
})
```







**Type:** `PublicKey`



**Singleton Id:** `9u8`

**List Id:** `137u8`

**Description:** A public key.

**Example**

``` rust
.metadata(metadata! {
    init {
        "keys" => [
            PublicKey::Ed25519(Ed25519PublicKey(key_1_bytes)),
            PublicKey::Secp256k1(Secp256k1PublicKey(key_2_bytes)),
        ], mutable;
    }
})
```







**Type:** `NonFungibleGlobalId`



**Singleton Id:** `10u8`

**List Id:** `138u8`

**Description:** A non fungible global id (resource address + local non fungible id).

**Example**

``` rust
.metadata(metadata! {
    init {
        "badge" => NonFungibleGlobalId::new(
            resource_address,
            NonFungibleLocalId::integer(1),
        ), fixed;
    }
})
```







**Type:** `NonFungibleLocalId`



**Singleton Id:** `11u8`

**List Id:** `139u8`

**Description:** A non fungible local id.

**Example**

``` rust
.metadata(metadata! {
    init {
        "ids" => [
            NonFungibleLocalId::string("Hello_world").unwrap,
            NonFungibleLocalId::integer(42),
            NonFungibleLocalId::bytes(vec![1u8]).unwrap(),
            NonFungibleLocalId::ruid([1; 32]).unwrap(),
        ], updatable;
    }
})
```







**Type:** `Instant`



**Singleton Id:** `12u8`

**List Id:** `140u8`

**Description:** An instant in time (represented as seconds since Unix epoch).

**Example**

``` rust
.metadata(metadata! {
    init {
        "last_updated" => Instant {
            seconds_since_unix_epoch: 1687446137,
        }, updatable;
    }
})
```







**Type:** `Url`



**Singleton Id:** `13u8`

**List Id:** `141u8`

**Description:** A url to a web-based page or image.

**Example**

``` rust
.metadata(metadata! {
    init {
        "info_url" => Url::of("https://tokens.radixdlt.com"), fixed;
        "icon_url" => Url::of("https://assets.radixdlt.com/icons/icon-xrd-32x32.png"), fixed;
    }
})
```







**Type:** `Origin`



**Singleton Id:** `14u8`

**List Id:** `142u8`

**Description:** An origin - ie the scheme, host and port of a URL. Used by browsers to define a distinct security context for web security. This is used to verify a two-way trusted link between a dApp on-ledger and an origin. See the metadata standard for more information.

**Example**

``` rust
.metadata(metadata! {
    init {
        "claimed_websites" => [
            Origin::of("https://dashboard.radixdlt.com"),
        ], mutable;
    }
})
```

:::note
**Origin metadata value**



Note that`claimed_websites`array values should not end with`/`. A`/`at the end of the url will cause an invalid origin error.
:::








**Type:** `PublicKeyHash`



**Singleton Id:** `15u8`

**List Id:** `143u8`

**Description:** A public key hash (the final 29 bytes of the Blake2b hash of the key bytes). This is effectively the content of a virtual account / identity address.

**Example**

``` rust
.metadata(metadata! {
    init {
        "key_hashes" => [
            PublicKeyHash::Ed25519(Ed25519PublicKeyHash(key_1_hash)),
            PublicKeyHash::Secp256k1(Secp256k1PublicKeyHash(key_2_hash)),
        ], mutable;
    }
})
```





## Configuring metadata roles

Metadata functionality lives on the "Metadata Module" of global entities. It has a number of roles, which all default to the entity’s Owner if the roles section isn’t filled in.

A more complicated scrypto example setting these roles is given here:

``` rust
.metadata(metadata! {
    roles {
        metadata_locker => rule!(allow_all);
        metadata_locker_updater => rule!(allow_all);
        metadata_setter => OWNER;
        metadata_setter_updater => rule!(deny_all);
    },
    init {
        "some_key" => "string_value", updatable;
        "empty_locked" => EMPTY, locked;
    }
})
```

## Updating and locking metadata

Once created, metadata will typically be updated from the manifest, using the metadata module’s `metadata_setter` role. Updatable metadata can also be locked with the `metadata_locker` role. As noted above, both of these roles will fallback to the entity’s owner if not explicitly provided. So typically you will need to prove you’re the entity’s owner to update metadata.

Example manifests which cover metadata are here:

- <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/main/radix-transactions/examples/metadata/metadata.rtm" target="_blank">Commented Examples</a>

- <a href="https://github.com/radixdlt/radixdlt-scrypto/tree/main/radix-transaction-scenarios/generated-examples/bottlenose/metadata" target="_blank">Comprehensive Example Manifests</a> relating to <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/main/radix-transaction-scenarios/src/scenarios/metadata.rs" target="_blank">Metadata configured in manifests built here</a>
