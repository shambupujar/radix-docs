---
title: "SBOR Value Model"
---

# SBOR Value Model

## Overview

:::note[Mental model]
You can think about the SBOR Value model as like a more flexible, binary-friendly [JSON model](https://www.json.org/json-en.html).

A similar diagram covering the grammar of the binary encoding of an SBOR payload is in the Grammar section below.
:::



The SBOR value model is a discriminated union of values, discriminated by their value kind. In other words, each SBOR value has a specific value kind, and the data specific to that kind.

An SBOR value can be thought of as a tree, with parent nodes being composite values such as Tuples/Arrays etc, and leaf nodes being basic data, or empty composite values.

- A value kind which cannot contain children is known as a “**leaf value kind**”
- A value kind which permits children is known as a “**composite value kind**” or in some cases “container”.

Each value kind has an associated discriminator byte used in the binary encoding to tell a decoder what the kind of a given value is. [These can be seen in Rust here](https://github.com/radixdlt/radixdlt-scrypto/blob/6d35fe85de69d82b85700aaa9a68310a6163b72e/sbor/src/value.rs#L22-L78).

### Core and Extension Value Kinds

There are a set of value kinds common to all extensions, these are known as the core value kinds. These core value kinds take inspiration from the Rust data model.

Each extension (such as Scrypto or Manifest SBOR) have their own set of custom value kinds, which can have a binary discriminator starting from `0x80`.

At present, all custom value kinds of supported extensions are leaf value kinds. In practice, custom value kinds could be composite, although some tooling currently assumes they are leaf only.

## Core Value Kinds

### Leaf Value Kinds

| Value Kind                             | Byte Discriminator | Byte Data  |
|----------------------------------------|--------------------|------------|
| **Bool** - A boolean value             | `0x01`             | `0` or `1` |
| **I8** - A signed 8-bit integer        | `0x02`             | The value  |
| **I16** - A signed 16-bit integer      | `0x03`             | Big-endian |
| **I32** - A signed 32-bit integer      | `0x04`             | Big-endian |
| **I64** - A signed 64-bit integer      | `0x05`             | Big-endian |
| **I128** - A signed 128-bit integer    | `0x06`             | Big-endian |
| **U8** - An unsigned 8-bit integer     | `0x07`             | The value  |
| **U16** - An unsigned 16-bit integer   | `0x08`             | Big-endian |
| **U32** - An unsigned 32-bit integer   | `0x09`             | Big-endian |
| **U64** - An unsigned 64-bit integer   | `0x0a`             | Big-endian |
| **U128** - An unsigned 128-bit integer | `0x0b`             | Big-endian |
| **String** - A UTF-8 string            | `0x0c`             | UTF-8      |

:::note[Floats are not supported in the core model]
Note that floats are not part of the core value model. This is because SBOR was designed for use with the Radix financial engine, which had no need for float data, for two reasons: \* Execution has to be deterministic, and some floating point operations can have differing behaviour across different processors, even inside WASM. \* Floating point numbers are rarely in financial applications (instead, Scrypto uses a fixed precision `Decimal` construct).
:::



### Composite Value Kinds

These value kinds allow construction of more complex types.

The encodings of Arrays and Maps “lift up” the value kinds of their children, to avoid duplication and make certain operations more concise and performant (for example, enable a Rust `Vec<u8>` to be copied into an SBOR `Array<U8>`).

| Value Kind | Byte Discriminator | Byte Data |
|----|----|----|
| **Array** - Any number of ordered elements of the same value kind. In Rust, this can correspond to `[T]` or `[T; N]` or any iterable collection | `0x20` | The discriminator of the value kind, then the LEB128-encoded element count of the array, followed by each value **without** its value kind discriminator |
| **Tuple** - A general product type: An ordered list of elements of possibly different value kinds. This corresponds to a Rust tuple or struct | `0x21` | The LEB128-encoded item count of the tuple, followed by each value **with** its value kind discriminator |
| **Enum** - A general sum type / discriminated union with a tuple-like payload. This corresponds to a Rust enum. | `0x22` | A byte for the enum’s discriminator, followed by the its tuple data, i.e. the LEB128-encoded item count of its data tuple, followed by each value **with** its value kind discriminator |
|  | `0x23` | The discriminator of the key value kind, then the discriminator of the value value kind, then the LEB128-encoded entry count of the map, followed by each entry (i.e. key then value **without** their value kind discriminators) |

### Value Model Caveats

The following are some interesting caveats to understand when working with the value model, and understanding its invariants.

\#### Child types of arrays and maps must have a fixed value kind (i.e. must implement `Categorize`)

In Rust, to have a `Vec<X>` or an `IndexMap<X, Y>` implement SBOR traits, it’s required that `X` and `Y` have a fixed value kind. This is given by the `Categorize` trait.

Types which don’t have a fixed value kind (such as an arbitrary `ScryptoValue`) do not implement Categorize and can’t be put into an array or map directly.

If you wish to have an array item or map key/value be an arbitrary SBOR value, you will need a workaround. The following workarounds are possible:

- Use a singleton tuple wrapper, e.g. `Vec<(ScryptoValue,)>` - the Categorize constraint only applies to the tuple and you can put anything you want inside the tuple. This works *ok* with the type system, but is slightly wasteful in the codec, and looks a little confusing.
- Use a more specific type. e.g. instead of the child being an arbitrary SBOR value, maybe it could be an arbitrary tuple. That is, instead of `IndexMap<String, ScryptoValue>` (which is a compile error because `ScryptoValue` doesn’t implement `Categorize`) you could instead use an `IndexMap<String, ScryptoTuple>`.
- Use a tuple instead of an array. This works well in the value model, but doesn’t play well with the type model, which expects a tuple to have a fixed length.

\#### Child type constraints are only one level deep

In the value model, only the value kind of child types are constrained. That means things like the following are allowed: \* Arrays of tuples of distinct types \* Jagged Arrays

The SBOR type model can be used to specify / add additional constraints on the data.

#### Arrays and Maps are inherently ordered

To ensure a value can be round-tripped uniquely, the value model only concerns ordered values.

If the round-trip property is important, ordered sets and maps such as `IndexSet` and `IndexMap` are recommended to maintain the ordering.

When a non-ordered map is encoded, its entries are first ordered by key, which can slow things down for large maps.

#### Arrays and Maps permit duplicate items/keys

A set can be encoded as SBOR arrays and a map can be encoded as an SBOR map - but the SBOR array and map model does not consider key identity or uniqueness.

Instead, a particular codec for a Map or Set may choose to enforce this at encoding and/or decoding time.

#### Tuples and enums care about field ordering and not field names

If encoding a Rust struct or enum, note that there isn’t any sense of “field name” in the value model for tuples or enums. The name of fields is instead captured in the schema at the type model layer.

If you wish to maintain a string key in the data, you could choose to use a `Map<String, X>` instead.

## Grammar

The grammar for the canonical binary encoding of SBOR is defined below. This is [covered in Rust here](https://github.com/radixdlt/radixdlt-scrypto/tree/main/sbor/src).


