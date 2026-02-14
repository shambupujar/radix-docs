---
title: "Advanced AccessRules"
---

# Advanced AccessRules

The **Authorization** section of this documentation repeatedly uses the `rule!(…)` macro to define an “access rule” - most often, a simple one (i.e. “require the caller to hold a certain resource”). However, under the hood, this macro creates an instance of `AccessRule`, which may potentially be a complex, nested tree-like structure.

An example of a complex access rule definition could be:

``` rust
// Example rule to require at least one of:
// (A) a super-admin signature
// (B) proofs of 3 named approver badges
// (C) proofs of 5 moderator badges and an enactment badge.
rule!(
  require(NonFungibleGlobalId::from_public_key(super_admin_public_key))
  || require_n_of(
    3,
    vec![
        NonFungibleGlobalId::new(named_approver_resource_address, NonFungibleLocalId::string("Adam")),
        NonFungibleGlobalId::new(named_approver_resource_address, NonFungibleLocalId::string("Bethany")),
        NonFungibleGlobalId::new(named_approver_resource_address, NonFungibleLocalId::string("Catherine")),
        NonFungibleGlobalId::new(named_approver_resource_address, NonFungibleLocalId::string("Daniel")),
        NonFungibleGlobalId::new(named_approver_resource_address, NonFungibleLocalId::string("Emily")),
    ],
  )
  || (
      require_amount(moderator_badge_resource_address, dec!(5)),
      && require(enactment_badge_resource_address)
  )
)
```

## AccessRule structure

At the top-level, an `AccessRule` may statically allow/disallow all access, or define some specific requirements regarding the Proofs present in the Authentication Zone:

``` rust
// Always allows access: (the default behavior)
rule!(allow_all)

// Never allows access:
rule!(deny_all)

// Allows access if and only if the Authorization Zone contains Proofs
// matching certain requirements:
rule!(<COMPOSITE_REQUIREMENT>)
```

:::note
**>
Underlying data model

**

``` rust
// Rust (post-Cuttlefish)
enum AccessRule {
    AllowAll,
    DenyAll,
    Protected(CompositeRequirement),
}

// SBOR (and Rust pre-Cuttlefish)       v SBOR Enum Discriminator
enum AccessRule {
    AllowAll,                        // 0
    DenyAll,                         // 1
    Protected(AccessRuleNode),       // 2
}
```
:::


### Composite Requirement

A `CompositeRequirement` itself is a boolean-like expression tree built from Basic Requirements. It can be:

- A single `Basic Requirement` (defined below - but roughly `require_*()` conditions)

- `Any Of` a list of `Composite Requirements`

- `All Of` a list of `Composite Requirements`

In Scrypto, we can define composite rules using basic logic operators (`&&` and `||` along with `(..)` brackets for grouping), and the composite rule is built for us automatically.

Some examples of rules with composite requirements follow:

``` rust
// In the below, A, B and C are any composite or basic requirements.

// Requires both A and B to be satisfied:
rule!(A && B)

// Requires (at least) one of A or B or C to be satisfied:
rule!(A || B || C)

// Follows standard boolean operator precedence: (i.e. requires A, or both B and C)
rule!(A || B && C)

// Supports parentheses: (i.e. requires A or B, and additionally C)
rule!((A || B) && C)

// Logical Negation is NOT supported:
// rule!(A && !B) - does NOT compile
```

:::note
**>
Limits

**

To protect resource usage, we enforce the following limits within any `AccessRule`’s expression:

- **Maximum depth of a logical expression tree = 8.**

  - Intuitively, the “depth” corresponds to the number of nested expressions that use different operators.

  - For example, `(a && b) || (c && d || e)` is of depth = 3, while `a || b || c || d || e` is of depth = 1 (since the chained `||` counts as a single, multi-input “or” expression).

  - This prevents excessive native stack usage.

- **Maximum number of nodes in a logical expression tree = 64.**

  - Intuitively, each operation and each leaf condition counts as a node.

  - For example, `(a && b) || (c && d || e)` has 9 nodes, while `a || b || c || d || e` has 6 nodes (since the chained `||` counts as a single, multi-input “or” expression).

  - This prevents excessive number of condition evaluations during `AccessRule` checks.
:::


:::note
**>
Underlying data model

**

`CompositeRequirement` was historically known as an `AccessRuleNode`, and for backwards compatibility, is called an `AccessRuleNode` in SBOR programmatic JSON.

``` rust
// Rust (post-Cuttlefish)
enum CompositeRequirement {
    BasicRequirement(BasicRequirement),
    AnyOf(Vec<CompositeRequirement>),
    AllOf(Vec<CompositeRequirement>),
}

// SBOR (and Rust pre-Cuttlefish)   v SBOR Enum Discriminator
enum AccessRuleNode {
    ProofRule(ProofRule),        // 0
    AnyOf(Vec<AccessRuleNode>),  // 1
    AllOf(Vec<AccessRuleNode>),  // 2
}
```
:::


### Basic Requirements

`BasicRequirement`s are the leaf nodes of an `AccessRule`. Below is a summary of all available `BasicRequirement`s:

``` rust
// Requires a proof of a non-zero amount of the given item to be present in the Authorization Zone:
require(<RESOURCE_ADDRESS or NON_FUNGIBLE>)

// Requires a proof of (at least) the specified amount A of the given resource:
require_amount(dec!(A), <RESOURCE_ADDRESS>)

//-----

// Requires proofs of a non-zero amount of at least one of the given items:
require_any_of(vec![<RESOURCE_ADDRESS or NON_FUNGIBLE 1>, <RESOURCE_ADDRESS or NON_FUNGIBLE 2>, ...]))

// Requires proofs of a non-zero amount of all of the given items:
require_all_of(vec![<RESOURCE_ADDRESS or NON_FUNGIBLE 1>, <RESOURCE_ADDRESS or NON_FUNGIBLE 2>, ...])

// Requires proofs of a non-zero amount of (at least) N of the given items:
require_n_of(N, vec![<RESOURCE_ADDRESS or NON_FUNGIBLE 1>, <RESOURCE_ADDRESS or NON_FUNGIBLE 2>, ...])
```

:::note
**>
Underlying data model

**

`BasicRequirement` was historically known as `ProofRule`, and for backwards compatibility, is called an `ProofRule` in SBOR programmatic JSON.

``` rust
// Rust (post-Cuttlefish)
enum CompositeRequirement {
    Require(ResourceOrNonFungible),
    AmountOf(Decimal, ResourceAddress),
    CountOf(u8, Vec<ResourceOrNonFungible>),
    AllOf(Vec<ResourceOrNonFungible>),
    AnyOf(Vec<ResourceOrNonFungible>),
}

// SBOR (and Rust pre-Cuttlefish)                v SBOR Enum Discriminator
enum ProofRule {
    Require(ResourceOrNonFungible),           // 0
    AmountOf(Decimal, ResourceAddress),       // 1
    CountOf(u8, Vec<ResourceOrNonFungible>),  // 2
    AllOf(Vec<ResourceOrNonFungible>),        // 3
    AnyOf(Vec<ResourceOrNonFungible>),        // 4
}
```
:::


### Resource Address or Non-Fungible

Most basic requirements take a resource address (fungible OR non-fungible) or a specific [non-fungible global id](../resources/non-fungible-display.md#nonfungible-global-id-address-display).

``` rust
// Requires any non-zero amount of a certain fungible resource:
rule!(require(FUNGIBLE_RESOURCE.resource_address()))

// Requires any non-zero amount of a certain non-fungible resource:
rule!(require(NON_FUNGIBLE_RESOURCE.resource_address()))

// Requires a non-fungible resource instance of a specific ID:
rule!(
  require(
    NonFungibleGlobalId::new(
      NON_FUNGIBLE_RESOURCE.resource_address(),
      NonFungibleLocalId::CONCRETE_ID
    )
  )
)
```

Notes:

- The `require_n_of` is a generalization of the common special cases:

  - `require_any_of(resources) == require_n_of(1, resources)`;

  - `require_all_of(resources) == require_n_of(resources.len(), resources)`;

  - `require(resource) == require_n_of(1, vec![resource])`.

- The `require_amount` may be applied both to fungible resources (where the `dec!(A)` minimum value is treated literally), and to non-fungible ones (where, in practice, at least `ceil(dec!(A))` non-fungible instances of the given resource are required). In either case, at present, the entire amount must be found in a *single* proof present in the Authorization Zone - in other words: the rule-checking logic does not sum amounts (or instance counts!) coming from different `Proof` structures. This may change in future versions of the Radix Engine to allow combining of amounts from separate proofs (by taking a union of the underlying proved resources).

:::note
**>
Data model structure

**

``` rust
// Rust and SBOR                          v SBOR Enum Discriminator
enum ResourceOrNonFungible {
    NonFungible(NonFungibleGlobalId),  // 0
    Resource(ResourceAddress),         // 1
}
```
:::


## Implicit Requirements

Access rules can be used to require a proof of an explicit resource or non-fungible is present on the authorization zone. This is sufficient for implementing many custom authorization schemes, where a dApp developer first defines a specialized “badge” resource, and then references it in access rules (see e.g. the `admin_badge` resource within our [User Badge Pattern](user-badge-pattern.md) example).

But access rules can also include requirements on **implicit proofs** under special system-reserved resource addresses, which have special meanings to the Radix Engine and aren’t part of the standard authorization zone.

### Signature Requirements

For each public key which signed a given notarized transaction, the system creates an implicit non-fungible proof of `NonFungibleLocalId::bytes(LOWER_29_BYTES_OF_BLAKE256B_HASH_OF_PUBLIC_KEY_BYTES)` in the authorization zone of the [transaction processor](/v1/docs/transaction-processor) call frame. The non-fungible proof is created under one of the following special reserved non-fungible resource addresses (see [well-known native addresses](../../reference/well-known-addresses.md)):

- Secp256k1 Signature Resource (<a href="https://stokenet-dashboard.radixdlt.com/resource/resource_tdx_2_1nfxxxxxxxxxxsecpsgxxxxxxxxx004638826440xxxxxxxxxcdcdpa">stokenet</a>, <a href="https://dashboard.radixdlt.com/resource/resource_rdx1nfxxxxxxxxxxsecpsgxxxxxxxxx004638826440xxxxxxxxxsecpsg">mainnet</a>)

- Ed25519 Signature Resource (<a href="https://stokenet-dashboard.radixdlt.com/resource/resource_tdx_2_1nfxxxxxxxxxxed25sgxxxxxxxxx002236757237xxxxxxxxx3e2cpa">stokenet</a>, <a href="https://dashboard.radixdlt.com/resource/resource_rdx1nfxxxxxxxxxxed25sgxxxxxxxxx002236757237xxxxxxxxxed25sg">mainnet</a>)

Due to the single-global-frame visibility rule for access rules, **signature proofs are only visible to global frames started as a direct call from the transaction manifest**. This rule is an important one for security - and ensures only calls seen in the manifest by the signer can see the signature. For example, it prevents a malicious component from using a signature to authorize a withdrawal.

``` rust
// It's most performant to store/use the public key hash.
let public_key_hash = PublicKeyHash::Secp256k1(LOWER_29_BYTES_OF_BLAKE256B_HASH_OF_PUBLIC_KEY_BYTES);
let public_key_hash = PublicKeyHash::Ed25519(LOWER_29_BYTES_OF_BLAKE256B_HASH_OF_PUBLIC_KEY_BYTES);
// You can also use a public key, but in this case, the hash has to be performed in Scrypto, which
// will use more execution cost units
let public_key = PublicKey::Secp256k1(...); 
let public_key = PublicKey::Ed25519(...);

// Post-Cuttlefish:
rule!(require(signature(<PUBLIC_KEY_HASH or PUBLIC_KEY>)));

// Pre-Cuttlefish:
rule!(require(NonFungibleGlobalId::from_public_key(<PUBLIC_KEY>)))
rule!(require(NonFungibleGlobalId::from_public_key_hash(<PUBLIC_KEY_HASH>)))
```

### Caller Requirements

:::note
**>
For advanced use only

**

As a general rule, explicit requirements are clearer and more flexible - we advise only using caller requirements where they are strictly needed to meet requirements of your application.
:::


The system creates some implicit proofs which can be used to verify the caller of the given method/function. These non-fungible proofs are created with a byte-based local id, containing a hash of a descriptor of the address / global caller descriptor, under the following special reserved resource addresses (see [well-known native addresses](../../reference/well-known-addresses.md)):

- Package of Direct Caller Resource (<a href="https://stokenet-dashboard.radixdlt.com/resource/resource_tdx_2_1nfxxxxxxxxxxpkcllrxxxxxxxxx003652646977xxxxxxxxxfzcnwk">stokenet</a>, <a href="https://dashboard.radixdlt.com/resource/resource_rdx1nfxxxxxxxxxxpkcllrxxxxxxxxx003652646977xxxxxxxxxpkcllr">mainnet</a>) - `NonFungibleLocalId::bytes(BLAKE256B_HASH_OF_SCRYPTO_ENCODED_PACKAGE_ADDRESS)`

- Global Caller Resource (<a href="https://stokenet-dashboard.radixdlt.com/resource/resource_tdx_2_1nfxxxxxxxxxxglcllrxxxxxxxxx002350006550xxxxxxxxxqtcnwk">stokenet</a>, <a href="https://dashboard.radixdlt.com/resource/resource_rdx1nfxxxxxxxxxxglcllrxxxxxxxxx002350006550xxxxxxxxxglcllr">mainnet</a>) - `NonFungibleLocalId::bytes(BLAKE256B_HASH_OF_SCRYPTO_ENCODED_GLOBAL_CALLER_ENUM)`

``` rust
// Requires that the immediate caller (i.e. the actor which made the
// latest global or internal call) has exactly the given package:
rule!(require(package_of_direct_caller(<PACKAGE_ADDRESS>)))

// Requires that this code was directly called from the given component:
// (more specifically: that the global ancestor of the actor who made the
// latest global call is the main module of the given global component)
rule!(require(global_caller(<COMPONENT_ADDRESS>)))

// Requires that the global ancestor of the actor who made the latest
// global call is a package function on the given blueprint:
rule!(require(global_caller(BlueprintId::new(<PACKAGE_ADDRESS>, "<BLUEPRINT_NAME>")))))
```

Note that the global caller / package of direct caller **cannot be read from the system** - but rather has to be provided by the caller as an argument.

This is for two reasons:

- All intent and semantics should be captured by arguments. The auth layer is “opt-in”. It should be possible to run a transaction without authorization checks enabled, and get the same result as if run with authorization checks and all checks pass.

- The “caller” pattern in other chains has been seen to be easy to mis-apply, and resulted in various hacks. On Radix, we believe the resource-based auth model is more flexible and safer from hacks.

The below gives an example pattern on the receiver which can verify the caller. On the caller end, you can get your own address with `Runtime::global_address()` and pass that in as an argument.

``` rust
fn handle_external_call(&self, claimed_caller_address: ComponentAddress, ...) {
    // Verify that the claimed_caller_address is correct
    Runtime::assert_access_rule(rule!(require(global_caller(claimed_caller_address>)));
    let global_caller_address = claimed_caller_address;

    // Check the component address against some kind of allow-list
    if !self.is_component_authorized(global_caller_address) {
        panic!("Caller is not authorized");
    }

    // ...
}
```

### System Execution Requirements

:::note
**>
You are unlikely to need these!

**

These proofs are only present during system transactions, which only touch native blueprints. During user transactions, these requirements will always fail.
:::


For special system transactions, the system adds these proofs to the transaction processor call frame:

- System Execution Resource (<a href="https://stokenet-dashboard.radixdlt.com/resource/resource_tdx_2_1nfxxxxxxxxxxsystxnxxxxxxxxx002683325037xxxxxxxxxcss8hx">stokenet</a>, <a href="https://dashboard.radixdlt.com/resource/resource_rdx1nfxxxxxxxxxxsystxnxxxxxxxxx002683325037xxxxxxxxxsystxn">mainnet</a>)

  - `SystemExecution::Protocol` is present during protocol update transactions. Although auth is actually entirely disabled during genesis bootstrapping. It is represented by an implicit proof of `NonFungibleLocalId::integer(0)` under the system execution resource.

  - `SystemExecution::Validator` is present in round/epoch change transactions. It is represented by an implicit proof of `NonFungibleLocalId::integer(1)` under the system execution resource.

``` rust
// Post-Cuttlefish
rule!(require(system_execution(SystemExecution::Validator)))
rule!(require(system_execution(SystemExecution::Protocol)))

// Pre-Cuttlefish
rule!(require(AuthAddresses::protocol_role()))
rule!(require(AuthAddresses::validator_role()))
```
