---
title: "Sbor Type Model"
---

## Overview

The SBOR type model layers on top of the value model, and adds extra context to a particular value.

A value by itself is compact and encodes just enough information to display the value in a rudimentary form - but to nicely display or validate a value, we need extra information.

This information comes in the form of a **schema** which captures additional information about **sbor types**, which can be associated with values in a particular payload.

### Type Identity

Each type has an identity. The identity of a type in a given schema is encapsulated as a `LocalTypeId` and is either a: \* `WellKnownId` - The type is “well-known” and is defined in code in the SBOR implementation, to save it being duplicated across lots of schemas \* `SchemaLocalIndex` - The index of the type in this particular schema. Types are normalized into an array inside a schema to keep them compact and to enable recursive types.

Sometimes you wish to refer to the identity of a type without having a particular schema in context. In this case there are two wider ids used in the Radix Engine, and can be used to locate the schema with which to resolve the given type: \* The `ScopedTypeId` is `(SchemaHash, LocalTypeId)` \* The `FullyScopedTypeId` is `(NodeId, SchemaHash, LocalTypeId)` and can be used to first locate the schema with the given hash from the schema partition under the given node; and then read the type with the given local type id.

### Type Data

For each type, the information splits into three categories: \* `TypeKind` - the kind of the type \* There is a type kind for each value kind. \* Composite types will include a link to their child type kinds. Types \* `TypeMetadata` - Associated naming for the given type kind \* An optional name of the type \* If it’s a tuple, optionally names of every field \* If it’s an enum, names of each variant, and for each variant, optionally names of every field of that variant. \* `TypeValidation` - Associated validation for the given type kind: \* Numeric types can have an upper and lower bound. \* Strings can have a bound on their length. \* Collection types can have a bound on their entry count. \* Custom types may have their own validations - for example, in Scrypto, it might require that the node passed in an `Own` is a specific blueprint, such as a `FungibleBucket`.

### Example

Consider the following example in Rust.

``` rust
#[derive(Sbor)] // Shorthand for Categorize, Encode, Decode and Describe 
struct Tree {
    root: TreeNode,
    cached_len: TreeLength,
}

#[derive(Sbor)]
struct TreeNode {
   left: Option<TreeNode>,
   right: Option<TreeNode>,
}

#[derive(Sbor)]
#[sbor(transparent)]
struct TreeLength(usize); // A new-type for semantic purposes
```

I could take a particular `Tree` and encode it into an SBOR value. In textual manifest value syntax, this might look like:

``` text
Tuple(                        # Tree { .. }
    Tuple(                    # > root: TreeNode { .. }
        Enum<1u8>(            # >> left: Some(..)
            Tuple(            # >>> TreeNode { .. }
                Enum<0u8>(),  # >>>> left: None
                Enum<0u8>(),  # >>>> right: None
            ), 
        ),
        Enum<0u8>(),          # >> right: None(..)
     ),
     2usize,                  # > cached_len: TreeLength
)
```

The commented parts capture information which is included in the **schema**. The ability to create a schema from a type is captured by the `Describe` trait implementation, which is one of the traits included in the helper `Sbor` derive.

In this particular case, the single type schema created for `Tree` as a single root type would include three schema local types: \* `Tree` (a tuple type-kind, with named fields) \* `TreeNode` (a tuple type-kind, with named fields) \* `Option<TreeNode>` (an enum type-kind, with two variants, each with unnamed fields) \* `TreeLength` (a usize type-kind)

Typically you’ll want Rust new types to be unique / named in the schema. But if you don’t, you can set `#[sbor(transparent, transparent_name)]` to make them invisible to the type model. If setting `transparent_name` on `TreeLength` then there would only be three types in the schema.

## Uses of schemas

By combining a schema with a value, you can enable: \* Validation of a payload or sub-payload against the schema - this is used extensively in the Radix engine \* Annotation of a valid payload when converted to a textual representation - this is used for annotated programmatic JSON, and certain annotated manifest formats. \* The Radix Gateway API does this when outputting component state, key value store entries and transaction events.

## Schema deep-dive

### Type roots

Schemas have an associated set of “type roots” which are used to generate a schema and define particular types of interest in a schema.

Often there is only a single “type root” in the schema, in which case it is called a `SingleTypeSchema`. Given a rust type, you can generate its single type schema. So colloquially this can be known as the type’s schema.

But there can also be multiple root types in a schema, for example in some blueprint schemas.

### Comparison and backwards compatibility

Comparing schemas can be used to track structural changes of types and ensure types haven’t changed in a way which isn’t backwards compatible given the compatibility constraints on the type (e.g. the need for the type to read data from a Database encoded with a previous structure).

This can be automated with the [ScryptoSborAssertion](https://docs.rs/scrypto-test/latest/scrypto_test/prelude/derive.ScryptoSborAssertion.html) derive which can generate tests to ensure that types are only changed in ways which are suitably backwards compatible.
