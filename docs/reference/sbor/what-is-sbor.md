---
title: "SBOR"
---

# SBOR


SBOR is an **open-source standard for modelling, interpretation and representation of data**. The term SBOR was originally an acronym coined from “Scrypto Binary-Friendly Object Representation”, and was designed to give a great developer experience for defining blueprint interfaces in Scrypto, but is now much more than a binary data format, and is used across the Radix Engine for transaction encoding, state storage and inter-frame communication in the Radix Engine.

SBOR is a key technology in the Radix stack, and allows the Radix Engine and APIs to **understand the meaning/intention of data**. This enables top-tier experiences across the entire stack, for both **dApp builders** and **end users**. From interface validation and code-gen in Scrypto, through a natural JSON representation of dApp state in the Browse API, all the way to structured, intuitive representations of data in the wallets and dashboards.

## What’s in the SBOR standard?

The SBOR standard encompasses a powerful **logical model**. The logical model includes a core set of value kinds and types, as well as in-built support for defining extensions. The Radix Engine uses this extension paradigm to define **bespoke variants of SBOR**, tailored to specific needs in the Radix protocol. The SBOR standard also covers **representations** of the value model, including the canonical binary format which gives SBOR its name, as well as textual representations, and a choice of JSON formats.

The logical model has two main parts:

- A **[Value model](sbor-value-model.md)**, which defines how data can be represented in SBOR. There are 16 core **value kinds**, covering Strings, Integers, Enums, Arrays, Tuples, Maps. Extensions can define additional custom value kinds, specific to their use case.
- A **[Type model](sbor-type-model.md)**, which is used to represent concrete types used by the programmer. Types have a structure which defines how it can be represented in the value model and its relation to other types. Types additionally include names/metadata and validation instructions. The core and each extension define a set of “well-known” types, baked into the standard. User-defined types can be packaged into a schema.

The Radix Engine currently defines three SBOR variants:

- **Basic SBOR** is primarily used for testing of the SBOR standard. It uses an empty extension.
- **Scrypto SBOR** is used for communication between actors in the engine, and for storing state. The Scrypto SBOR extension adds new value kinds to communicate entity ownership and reference semantics. It also adds a custom schema, capturing various validations which the Radix Engine can perform.
- **Manifest SBOR** is used for the Radix transaction. The Manifest SBOR extension includes representations of placeholders in the manifest. The Manifest Extension doesn’t have its own type/schema model, and actually shares the Scrypto schema. This allows component calls in manifests to be interpreted and validated against scrypto schemas. The standard also defines standardized representations of the value model. All variants share the same representation for core value kinds, but can have extension-specific representations of custom value kinds.

The SBOR standard also includes standardized representations of the value model:

- A unique serialization of the value model to/from bytes.
- Various string representations of the value model, some of which also make use of information in the Schema:
  - **RustLike** - Takes inspiration from Rust and other programming languages. Uses optional type context for a more compact format.
  - **NestedString** - Deprecated, intended to be like the manifest format.
  - [Manifest Value Syntax](../../build/transactions-manifests/manifest-value-syntax.md) - Not a standardized representation, but used when creating Manifests.
- Various JSON representations, some of which also make use of information in the Schema:
  - [Programmatic JSON](sbor-programmatic-json.md) is stable / standardized.
  - **Natural JSON** is intended as a JSON-native format, relying on type context for a more compact / intuitive format - is half-implemented - but in beta, and subject to change.
  - **Display JSON** is intended for use creating tree-based UIs from SBOR with type context.
  - **Model JSON** is deprecated, replaced by Programmatic JSON.
