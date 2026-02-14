---
title: "Using Proofs"
---

Proofs give us a way to tell if a resource exists in a Vault or Bucket without having to remove it. A Proof can be created from a resource and used instead, which allows us to know if an actor possesses a resource without the resource being sent.

Proofs can be useful for a variety of reasons, but first and foremost is authorization. The most common version of this is creating a Proof of a badge to [Call a Protected Method/Function](call-a-protected-method-function.md) on a component, e.g. an owner badge that’s required for the withdrawal of collected XRD from a [Gumball Machine component](../learning-step-by-step/give-the-gumball-machine-an-owner.md).

:::note[Proofs are Transient]
Proofs can only exist for the duration of a transaction.
:::



## Proof Lifecycle

Proofs can be created, transferred, and dropped.

Proofs can be passed around as tangible objects like Buckets, or put on/taken off an AuthZone. [Implicit proofs](advanced-accessrules.md#implicit-requirements) only live on the AuthZone and can’t be created as tangible Proofs like others.

Only Proofs in an AuthZone can be used to meet authorization checks in called methods/functions. If checks fail, the transaction will abort, otherwise it proceeds as normal.

Just as with [Buckets and Vaults](../resources/buckets-and-vaults.md) there are multiple Scrypto types to refer to tangible Proofs: - `Proof` - A general Proof type for fungible or non-fungible resources - `FungibleProof` - A Proof of fungible resources - `NonFungibleProof` - A Proof of non-fungible resources

:::note[How does an authorization check work?]
Authorization checks happen when a [protected method](../../reference/core-system-features/structure-roles-methods.md) or [function](assign-function-accessrules.md) is called, or when `Runtime::assert_access_rule(rule!(...))` is called directly on an [access rule](advanced-accessrules.md).

This check works by comparing the requirements in the access rule against Proofs in the parent `LocalAuthZone`.

Technically speaking, it’s not just the parent AuthZone which is used - the contents of the `LocalAuthZone` of all the ancestor local callframes in the current and parent global callframe are used.
:::



## Creating Proofs

You can create Proofs from Vaults or Buckets.

:::note[Proofs lock resources in Vaults and Buckets]
Resources are locked in their Vault or Bucket while a Proof of them exists to guarantee the presenter of the Proof has possession of the original resource.
:::



### Creating Proofs in Scrypto

You can create Proofs from Vaults or Buckets with several different Scrypto methods.

``` rust
// Make an IndexSet of one NonFungibleLocalId for our NonFungibleProofs
let non_fungible_local_ids =
    indexset![NonFungibleLocalId::string("example_id").unwrap()];

// Proofs from Vaults
let proof_1: FungibleProof = self.fungible_vault.create_proof_of_amount(1);
let proof_2: NonFungibleProof = self
    .non_fungible_vault
    .create_proof_of_non_fungibles(&non_fungible_local_ids);

// Proofs from Buckets
let proof_3: Proof = bucket.create_proof_of_all();
let proof_4: FungibleProof = fungible_bucket.create_proof_of_all();
let proof_5: FungibleProof = fungible_bucket.create_proof_of_amount(1);
let proof_6: NonFungibleProof = non_fungible_bucket.create_proof_of_all();
let proof_5: NonFungibleProof =
    non_fungible_bucket.create_proof_of_non_fungibles(&non_fungible_local_ids);
```

You can also make Proofs from Proofs:

``` rust
let proof_2 = proof_1.clone();
```

### Creating Proofs in the manifest

Proofs can be sourced from component calls. Commonly you create Proofs from your [Account](../native-blueprints/account.md).

There are two main Account methods for this, depending on the resource type: \* Fungible: `create_proof_of_amount` \* Non-fungible: `create_proof_of_non_fungibles`

These can be used as follows:

``` sh
CALL_METHOD
  Address("\${ACCOUNT_ADDRESS}")
  "create_proof_of_amount"
  Address("\${FUNGIBLE_OWNER_BADGE_ADDRESS}")
  Decimal("1");
```

``` sh
CALL_METHOD
  Address("\${ACCOUNT_ADDRESS}")
  "create_proof_of_non_fungibles"
  Address("\${NON_FUNGIBLE_OWNER_BADGE_ADDRESS}")
  Array<NonFungibleLocalId>(NonFungibleLocalId("{BADGE_LOCAL_ID}"));
```

When you receive Proofs from a manifest call, they are automatically placed on the Auth Zone.

There are also lots of manifest instructions for creating, moving and dropping Proofs, such as `CREATE_PROOF_FROM_BUCKET_OF_ALL` and `CREATE_PROOF_FROM_BUCKET_OF_NON_FUNGIBLES`. These and other such instructions are listed with examples in [Manifest Instructions](../transactions-manifests/manifest-instructions.md).

## Transferring Proofs

### Transferring to/from the AuthZone

Tangible Proofs can be put on and popped off the AuthZone:

``` rust
    LocalAuthZone::push(proof);
    let proof = LocalAuthZone::pop().unwrap();
```

In the Transaction manifest, Proofs returned from methods go straight onto the AuthZone.

If necessary, Proofs can be taken off with `POP_FROM_AUTH_ZONE` and put back with `PUSH_TO_AUTH_ZONE`:

``` sh
PUSH_TO_AUTH_ZONE Proof("proof");
POP_FROM_AUTH_ZONE Proof("popped_proof"); # Same proof, but it needs a new name
```

### Returning a Proof from a call

Tangible Proofs can be returned freely from a method to a caller.

Be careful - this allows the caller to use the Proof for authorization, so only return Proofs to callers you trust.

### Passing a Proof to a call

Tangible Proofs can be passed to a method call, to facilitate “proof by intent” discussed later in this article.

However, to protect users, Proofs passed by intent to a non-internal call become **restricted**. Restricted Proofs cannot be put on the AuthZone or be passed by intent to another non-internal call.

:::note[Why do Proofs get restricted?]
This allows you to safely pass a Proof by intent without fear it will get misused: Conceptually, you can show your badge to someone, but they can’t use the badge themselves.

This means we can give users much better guarantees about what they are authorizing from a manifest.

We are aware this restriction mechanism causes some friction. We are planning an expansion to the authorization system ([“allowances”](https://discord.com/channels/417762285172555786/1186424910365605898)) which will transiently permit actions non-locally.
:::



## Authorizing callers of your method

When authorizing a caller, you’ll use one of two strategies:

- **Verify the role of your caller** - Typically, you want to check that your caller has a particular role, for example: “check that your caller is an admin” or “check that your caller is a user”.
- **Verify precisely who your caller is** - Occasionally, you will want to verify precisely who your caller is, for example “check the caller is a particular user” or “check which component has called your component”. To verify precisely who your caller is, you must require they pass details of who they are and then validate those details are accurate. There are two common patterns for this covered below.

If possible, we recommend verifying the role of your caller because this is easier and more flexible.

:::note[Why do we require a caller to tell us who they are?]
For precise verifications, the caller must pass in details of who they are in their arguments.

This is because we have designed the authorization layer to not affect how a transaction executes. Authorization can only cause the transaction to fail when enabled.

This has a few benefits: \* Conceptual simplicity: It’s easier to reason about how a method behaves if only arguments and component state can affect its execution. \* Practical use-cases: It allows authorization to be disabled in the engine for use cases such as preview or testing. \* Reproducibility: We want the result of preview/execution to not depend on exactly *who* signed a transaction. Signatures should just enable a transaction to succeed, not affect its execution.
:::



### Verify **the role of your caller** with the AuthZone

The standard method to protect your methods is by [assigning roles to methods](../../reference/core-system-features/structure-roles-methods.md) using Scrypto’s **role based access control**.

For example, this might look like:

``` rust
    enable_method_auth! {
        methods {
            withdraw_earnings => restrict_to: [OWNER];
        }
    }

        // --snip--
        .prepare_to_globalize(
            OwnerRole::Fixed(rule!(require(owner_badge.resource_address())))
        )
```

### Verify **your caller precisely** with the AuthZone

If your badge resource is non-fungible you can authorize the method and retrieve the non-fungible data from it. To do that you:

1.  Pass the non-fungible local ID as one of your Scrypto function’s arguments
2.  Check a Proof with that ID and resource address is on the Auth Zone with `assert_access_rule`
3.  Use the ID to get the non-fungible data.

``` rust
fn get_non_fungible_data(
    &self,
    badge_local_id: NonFungibleLocalId,
) -> OwnerBadgeData {
    // assemble Proof global_id
    let global_id =
        NonFungibleGlobalId::new(self.owner_badge_address, badge_local_id.clone());

    // check that a Proof of the non-fungible resource is in the AuthZone
    Runtime::assert_access_rule(rule!(require(global_id)));

    // get the data from the non-fungible resource
    let non_fungible_data = ResourceManager::from(self.admin_badge_address)
        .get_non_fungible_data::<OwnerBadgeData>(&badge_local_id);

    // return the non-fungible data
    non_fungible_data
}
```

This also gives us access to our non-fungible’s local ID as it was passed in as a method argument.

This pattern can also be used to validate the calling component [using the global_caller implicit requirement](advanced-accessrules.md#caller-requirements).

:::note[Methods Protected with `assert_access_rule`]
A `Runtime::assert_access_rule` call, protects a method so it often wont also need to be in the `enable_method_auth!` macro at the top of your blueprint. However the macro is still a good way to see which methods are protected at a glance, so we encourage you to still add a user role check, even if also manually checking a user badge.
:::



### Verify your caller precisely with a proof by intent

The general pattern is to accept a *tangible Proof* as a parameter, and then check that the proof is of the expected resource.

Typically, this will be done in three steps:

#### Checking Proofs

If Proofs aren’t placed on the Auth Zone you will need to check that they are a from the correct resource before you do anything else with them.

``` rust
fn check_admin_proof(&self, admin_proof: Proof) -> CheckedProof {
    admin_proof.check(self.admin_badge_address)
}
```

A check like this will panic and the transaction will fail if the resources address of the Proof and the `.check` argument do not match.

#### Getting Non-fungible Data from Proofs

With our Proof checked we can retrieve any non-fungible data from it.

e.g. If we’ve derived the following `AdminBadgeData` for our badge and added it to our Scrypto package, outside the blueprint, with code like this.

``` rust
#[derive(ScryptoSbor, NonFungibleData)]
struct AdminBadgeData {
    admin_id: String,
}
```

We could then retrieve the `admin_id` data field like so.

``` rust
fn get_admin_id(&self, admin_proof: NonFungibleProof) -> String {
    // check the proof and retrieve the non-fungible data
    let non_fungible_data = admin_proof
        // check the proof
        .check(self.admin_badge_address)
        // retrieve data
        .non_fungible::<AdminBadgeData>()
        .data();

    // return the admin id
    non_fungible_data.admin_id
}
```

#### Getting Non-fungible IDs from Proofs

Sometimes we might need to retrieve the a non-fungible ID from a Proof. In this example we’ve stored our admin IDs as the non-fungible local IDs of our badges instead of in a data field. We can retrieve it like so.

``` rust
fn get_admin_id(&self, admin_proof: NonFungibleProof) -> NonFungibleLocalId {
    // check the proof then retrieve and return the non-fungible local ID
    let non_fungible_id = admin_proof
        // check the proof
        .check(self.admin_badge_address)
        // retrieve non-fungible local ID
        .non_fungible_local_id();

    // return the non-fungible local ID
    non_fungible_id
}
```

Or if we need to unwrap the type to something other than a `NonFungibleLocalId` we can use some more advanced Rust pattern matching.

``` rust
fn get_admin_id(&self, admin_proof: NonFungibleProof) -> String {
    // check the proof and retrieve the non-fungible local ID
    let non_fungible_id_string = match admin_proof
        // check the proof
        .check(self.admin_badge_address)
        // retrieve non-fungible local ID
        .non_fungible_local_id()
    {
        // if it has a String type local ID return it as a String
        NonFungibleLocalId::String(local_id) => local_id.value().to_owned(),

        // We know the local ID type as we minted the badge,
        // so other possibilities are unreachable
        _ => unreachable!("All admin badges have String local IDs"),
    };

    // return the non-fungible local ID as a string
    non_fungible_id_string
}
```

## Using proofs to call methods

When calling a protected method, you will need to prepare your proofs: \* Typically, you will need to ensure proofs are on your AuthZone \* If the method takes a proof by intent, you may also need to pass a tangible proof. This proof may need to be cloned if it also needs to be on your AuthZone to pass an AuthZone check.

### Calling AuthZone protected methods in Scrypto

To call an AuthZone protected method, you will need to put the required proofs on your AuthZone. You can do that as follows:

``` rust
pub fn withdraw_earnings(&mut self, owner_badge: Proof) -> FungibleBucket {
    // place the proof on the local auth zone authorizing methods called within
    // this one
    LocalAuthZone::push(owner_badge);
    
    // withdraw XRD collected from the gumball machine, authorized by the owner
    // badge proof
    let earnings = self.gumball_machine_component.withdraw_earnings();

    // remove the proof from the local auth zone to prevent unauthorized method
    // calls
    let proof = LocalAuthZone::pop().unwrap();
    
    // The proof can be dropped manually, or will automatically be dropped
    // when this component returns
    proof.drop();

    // return the earnings
    earnings
}
```

Alternatively, there is an abbreviated form that automates adding and removing the Proof to the AuthZone:

``` rust
pub fn withdraw_earnings(&mut self, owner_badge: Proof) -> FungibleBucket {
    // place the proof on the local auth zone authorizing methods called within  
    // its closure method, then remove it
    owner_badge.authorize(|| {
    
        // withdraw XRD collected from the gumball machine, authorized by the  
        // owner badge proof
        self.gumball_machine_component.withdraw_earnings()
    })
}
```

For convenience, the `authorize` method also exists on Vaults and Buckets. This method creates a Proof, calls authorize with it, and then drops it.

### Passing a Proof by intent

In Scrypto, you can just pass a non-restricted tangible Proof in the arguments of a [cross-component call](/v1/docs/cross-blueprint-calls).

In transaction manifests, to provide Proofs as method arguments, you will usually just pop the latest added Proof from the AuthZone and then call your method, as follows:

``` sh
POP_FROM_AUTH_ZONE
    Proof("badge_proof");
CALL_METHOD
    Address("\${COMPONENT_ADDRESS}")
    "method_name"
    Proof("badge_proof");
```

For some dApps, you will also need to keep a copy of the Proof on your AuthZone to pass an AuthZone based access check, AND also pass the same Proof by intent. To do this, you can use one of two techniques.

The easiest is to simply use `CREATE_PROOF_FROM_AUTH_ZONE_OF_ALL` to create a separate tangible Proof for passing into the method, which will be backed by the same resources as the Proof/s on the AuthZone:

``` sh
CREATE_PROOF_FROM_AUTH_ZONE_OF_ALL
    Address("\${BADGE_RESOURCE_ADDRESS}")
    Proof("badge_proof");
CALL_METHOD
    Address("\${COMPONENT_ADDRESS}")
    "method_name"
    Proof("badge_proof");
```

Or if you don’t know the resource address, you can pop it from the AuthZone, explicitly clone the Proof and return it to the AuthZone:

``` sh
POP_FROM_AUTH_ZONE
    Proof("badge_proof_1");
CLONE_PROOF
    Proof("badge_proof_1")
    Proof("badge_proof_2");
PUSH_TO_AUTH_ZONE
    Proof("badge_proof_1");
CALL_METHOD
    Address("\${COMPONENT_ADDRESS}")
    "method_name"
    Proof("badge_proof_2");
```
