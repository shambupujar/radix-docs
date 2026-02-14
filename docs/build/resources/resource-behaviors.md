---
title: "Resource Behaviors"
---

# Resource Behaviors

New resources created with the ResourceBuilder can also be attributed with special characteristics. For example, you can specify behaviors to mark a resource as mintable, burnable, or even restrict its ability to be withdrawn, making them <a href="https://www.radixdlt.com/blog/asset-oriented-soulbound-tokens-done" target="_blank">“Soulbound”</a> tokens. AccessRules can also be specified with resource behaviors, which allows you to determine the conditions need to be present before the behavior action can be performed. We can also determine the mutability of these authorization rules to have the ability to change the authorization rules in the future or lock its mutability to prevent its rules from being changed.

## Resource Behaviors

:::note
**>
Defining access rules

**

Full details on the `rule!(..)` macro in the below is covered in [Advanced AccessRules](../authorization/advanced-accessrules.md).
:::




<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Method</td>
<td>Description</td>
</tr>
<tr>
<td><pre class="language-rust"><code>OwnerRole::None
OwnerRole::Fixed(rule!(..))
OwnerRole::Updatable(rule!(..))</code></pre></td>
<td><p>The <code>OWNER</code> of a resource is set in the <code>new_..</code> method of the resource builder and is by default able to update the metadata of the resource, and other rules can be set to forward to the <code>OWNER</code> role, as a useful fallback.</p>
<p>It is recommended to set this to some kind of dApp admin badge so that the metadata can be updated in future if required. This may be necessary as part of establishing [two-way dApp linking](../metadata/metadata-for-verification.md) during bootstrapping.</p></td>
</tr>
<tr>
<td><pre class="language-rust"><code>.mint_roles(mint_roles! {
    minter =&gt; rule!(..);         // Or =&gt; OWNER;
    minter_updater =&gt; rule!(..); // Or =&gt; OWNER;
})</code></pre></td>
<td><p>Specify the <code>AccessRule</code> for <code>MintRoles</code> to provide permission to mint tokens.</p>
<p>Defaults: <code>minter =&gt; rule!(deny_all)</code> and <code>minter_updater =&gt; rule!(deny_all)</code>.</p></td>
</tr>
<tr>
<td><pre class="language-rust"><code>.burn_roles(burn_roles! {
    burner =&gt; rule!(..);         // Or =&gt; OWNER;
    burner_updater =&gt; rule!(..); // Or =&gt; OWNER;
})</code></pre></td>
<td><p>Specify the <code>AccessRule</code> for <code>BurnRoles</code> to provide permission to burn tokens.</p>
<p>Defaults: <code>burner =&gt; rule!(deny_all)</code> and <code>burner_updater =&gt; rule!(deny_all)</code>.</p></td>
</tr>
<tr>
<td><pre class="language-rust"><code>.withdraw_roles(withdraw_roles! {
    withdrawer =&gt; rule!(..);          // Or =&gt; OWNER;
    withdrawer_updater =&gt; rule!(..);  // Or =&gt; OWNER;
})</code></pre></td>
<td><p>Specify the <code>AccessRule</code> for <code>WithdrawRoles</code> to provide permission to withdraw tokens from a <code>Vault</code>.</p>
<p>Defaults: <code>withdrawer =&gt; rule!(allow_all)</code> and <code>withdrawer_updater =&gt; rule!(deny_all)</code>.</p></td>
</tr>
<tr>
<td><pre class="language-rust"><code>.deposit_roles(deposit_roles! {
    depositor =&gt; rule!(..);         // Or =&gt; OWNER;
    depositor_updater =&gt; rule!(..); // Or =&gt; OWNER;
})</code></pre></td>
<td><p>Specify the <code>AccessRule</code> for <code>DepositRoles</code> to provide permission to deposit tokens to a <code>Vault</code>.</p>
<p>Defaults: <code>depositor =&gt; rule!(allow_all)</code> and <code>depositor_updater =&gt; rule!(deny_all)</code>.</p></td>
</tr>
<tr>
<td><pre class="language-rust"><code>.recall_roles(recall_roles! {
    recaller =&gt; rule!(..);          // Or =&gt; OWNER;
    recaller_updater =&gt; rule!(..);  // Or =&gt; OWNER;
})</code></pre></td>
<td><p>Specify the <code>AccessRule</code> for <code>RecallRoles</code> to provide permission to recall tokens. By default recalling is locked as <code>rule!(deny_all)</code>.</p>
<p>Defaults: <code>recaller =&gt; rule!(deny_all)</code> and <code>recaller_updater =&gt; rule!(deny_all)</code>.</p></td>
</tr>
<tr>
<td><pre class="language-rust"><code>.freeze_roles(freeze_roles! {
    freezer =&gt; rule!(..);         // Or =&gt; OWNER;
    freezer_updater =&gt; rule!(..); // Or =&gt; OWNER;
})</code></pre></td>
<td><p>Specify the <code>AccessRule</code> for <code>FreezeRoles</code> to provide permission to freeze tokens. By default freezing is locked as <code>rule!(deny_all)</code>.</p>
<p>Defaults: <code>freezer =&gt; rule!(deny_all)</code> and <code>freezer_updater =&gt; rule!(deny_all)</code>.</p></td>
</tr>
<tr>
<td><pre class="language-rust"><code>.non_fungible_data_update_roles(non_fungible_data_update_roles! {
    non_fungible_data_updater =&gt; rule!(..);
    non_fungible_data_updater_updater =&gt; rule!(..);
})</code></pre></td>
<td><p>(Non-fungible only)</p>
<p>Specify the <code>AccessRule</code> for <code>NonFungibleDataUpdateRoles</code> to provide permission to update the <code>NfData</code> attached to each individual non-fungible.</p>
<p>Defaults: <code>non_fungible_data_updater =&gt; rule!(deny_all)</code> and <code>non_fungible_data_updater_updater =&gt; rule!(deny_all)</code>.</p></td>
</tr>
<tr>
<td><pre class="language-rust"><code>.divisibility(number)</code></pre></td>
<td><p>(Fungible only)</p>
<p>The divisibility is a number between 0 and 18 and it represents the number of decimal places that this resource can be split into. For example, if you set the divisibility to 0, people will only be able to send whole amounts of that resource.</p>
<p>Default: 18. You can also use the constants <code>DIVISIBILITY_NONE = 0</code> and <code>DIVISIBILITY_MAXIMUM = 18</code></p></td>
</tr>
<tr>
<td><pre class="language-rust"><code>.metadata(metadata! {
    init {
        &quot;name&quot; =&gt; &quot;Super Admin Badge&quot;.to_string(), locked;
    }
})</code></pre></td>
<td>Not strictly about behaviour on ledger, but you will likely wish to [configure metadata](../metadata/scrypto-entity-metadata.md) as per the [Metadata for Wallet Display](../metadata/metadata-for-wallet-display.md) and [Metadata for Verification](../metadata/metadata-for-verification.md) standards so that the resource has a clear identity in wallets and explorers.</td>
</tr>
</tbody>




## Mintable

To make a resource mintable means that we allow the creation of additional supply of that resource. We can do this by simply adding .mint_roles() when we create our resource and map the AccessRule to each BurnRoles.

``` rust
// Note our resource takes and OwnerRole argument this can be Fixed, Updatable, or None
let my_token = ResourceBuilder::new_fungible(OwnerRole::Fixed(rule!(require(access_rule))))
    .metadata(metadata!{
        init {
            "name" => "My Token", locked;
            "symbol" => "TKN", locked;
        }
    })
    .mint_roles(mint_roles!{ // #1
        minter => rule!(allow_all); // #2
        minter_updater => rule!(deny_all); // #3
    })
    .create_with_no_initial_supply();
```

1.  To make a resource mintable, you simply have to make a call to the `mint_roles()` method during the resource creation which requires that we map the AccessRule for two roles.

2.  Here we set the `AccessRule` for the `minter` role, `allow_all` makes minting public. We can of course and often will want to restrict minting to a particular badge here instead with something like `minter => rule!(require(badge_address));` instead.

3.  The `minter_updater` is how we control the mutability of the `minter` role. `deny_all` locks the `minter` role, we can again also pass in a badge address to create an authority which can change the `minter` role like `minter_updater => rule!(require(badge_address));`

## Burnable

Having a resource burnable indicates that an specified supply of this resource can essentially be destroyed. If all the supply of that resource is burnt, the ResourceManager will still exist. Additionally, if that resource is mintable then more of that resource can be created. Similar to our previous example, to make our resource burnable, we call the `.burn_roles()` method when we create our resource and map the `AccessRule` to each `BurnRoles.`

``` rust
// Note our resource takes and OwnerRole argument this can be Fixed, Updatable, or None
let my_token = ResourceBuilder::new_fungible(OwnerRole::None)
    .metadata(metadata!{
        init {
            "name" => "My Token", locked;
            "symbol" => "TKN", locked;
        }
    })
    .burn_roles(burn_roles!{
        burner => rule!(allow_all); // This makes the resource freely burnable. You could also require(admin_badge) to restrict who can burn the token.
        burner_updater => rule!(deny_all);
    })
    .create_with_no_initial_supply();
```

## Restrict Withdraw

Resources restricted from being withdrawn are effectively locked in the `Vault` that contains it. This makes the resource soulbound and its most common use-case is to attach some form of identification or reputation to the account that owns that resource.

``` rust
// Note our resource takes and OwnerRole argument this can be Fixed, Updatable, or None
let my_token = ResourceBuilder::new_fungible(OwnerRole::Fixed(rule!(require(access_rule))))
    .metadata(metadata!{
        init {
            "name" => "My Token", locked;
            "symbol" => "TKN", locked;
        }
    })
    .withdraw_roles(withdraw_roles!{
        withdrawer => rule!(deny_all);
        withdrawer_updater => rule!(deny_all);
    })
    .create_with_no_initial_supply();
```

## Restrict Deposit

Resources restricted from being deposited are commonly called transient resources. This forces a dangling resource to exist. If the resource can’t be deposited into a `Vault`, the resource must be burnt, else we will encounter a dangling resource error. Transient resources are most commonly used as a means to force a specified condition to happen within a transaction. If that condition is met, we can permit the resource to be burned. Alternatively, if we specify an authorization requirement, we can allow this resource to be deposited if a specified condition is met.

``` rust
// Note our resource takes and OwnerRole argument this can be Fixed, Updatable, or None
let my_token = ResourceBuilder::new_fungible(OwnerRole::Fixed(rule!(require(access_rule))))
    .metadata(metadata!{
        init {
            "name" => "My Token", locked;
            "symbol" => "TKN", locked;
        }
    })
    .deposit_roles(deposit_roles!{
        depositor => rule!(deny_all);
        depositor_updater => rule!(deny_all);
    })
    .create_with_no_initial_supply();
```

## Recallable Token

Having a resource to be recallable allows us to send our tokens to anybody, but have the ability for us to retrieve it if we desire. The most common use case for this is to allow for <a href="https://www.radixdlt.com/blog/asset-oriented-rental-nfts-done" target="_blank">“Rental NFTs”</a>. We can create conditions in how long this resource can essentially be borrowed for.

``` rust
// Note our resource takes and OwnerRole argument this can be Fixed, Updatable, or None
let my_token = ResourceBuilder::new_fungible(OwnerRole::Fixed(rule!(require(access_rule))))
    .metadata(metadata!{
        init {
            "name" => "My Token", locked;
            "symbol" => "TKN", locked;
        }
    })
    .recall_roles(recall_roles!{
        recaller => rule!(require(admin_badge));
        recaller_updater => rule!(deny_all);
    })
    .create_with_no_initial_supply();
```

## Freezable Token

When building regulated assets you may need to have the ability to freeze those assets so of course Scrypto has this functionality built in for you to compose for your own use case.

``` rust
// Note our resource takes and OwnerRole argument this can be Fixed, Updatable, or None
let freezer_token =
    ResourceBuilder::new_fungible(OwnerRole::Fixed(rule!(require(access_rule))))
        .metadata(metadata! {
            init {
                "name" => "My Token", locked;
                "symbol" => "TKN", locked;
            }
        })
        .freeze_roles(freeze_roles! {
            freezer => rule!(require(admin_badge));
            freezer_updater => rule!(deny_all);
        })
        .mint_initial_supply(1000)
        .into();
```

## A Non-fungible with updatable metadata

``` rust
let non_fungible: NonFungibleResourceManager =
    ResourceBuilder::new_ruid_non_fungible::<TestNFData>(OwnerRole::None)
        .metadata(metadata! {
            init {
                "name" => "My NF Resource", locked;
            }
        })
        .non_fungible_data_update_roles(non_fungible_data_update_roles! {
            non_fungible_data_updater => rule!(require(admin_badge));
            non_fungible_data_updater_updater => rule!(deny_all);
        })
        .create_with_no_initial_supply()
        .into();
```

## Updating the rules after creating resources

Up till now, we have specified all rules with an `_updater` rule set to `rule!(denyall)`.

This means that it can never be changed, ever. Instead of `rule!(deny_all)` you could provide a custom rule with the usual `rule!()` macro. The authority you provide here has the ability to update the rule in the future. They can change the rule at will, and at any point they also have the right to change the `_updater` role’s rule to `rule!(denyall)`, so that it may never again be changed. This means that it will display as fixed in the wallet.

:::note
Locking is a one-way process…​ there’s no going back to a mutable rule once it has been locked.
:::


Here’s an example of playing with some rules around freezing a token:

``` rust
// Initial creation, rule_admin is some badge address we have previously defined
let resource_address = ResourceBuilder::new_fungible(OwnerRole::Updatable(rule!(require(access_rule))))
  .metadata(metadata!(
    init {
        "name" => "Globally freezable token", locked;
    }
  ))
  .withdraw_roles(withdraw_roles! {
      withdrawer => rule!(allow_all);
      withdrawer_updater => rule!(require(rule_admin));
  })
  .deposit_roles(deposit_roles! {
      depositor => rule!(allow_all);
      depositor_updater => rule!(require(rule_admin));
  })
  .create_with_no_initial_supply();

... // Later in the code

// `rule_admin_vault` is a vault that contains the badge allowed to make the following changes.
self.rule_admin_vault.authorize(|| {
  // Freeze the token, so no one may withdraw or deposit it
  let resource_manager = ResourceManager::from_address(resource_address);
  resource_manager.set_depositable(AccessRule::DenyAll);
  resource_manager.set_withdrawable(AccessRule::DenyAll);

  // ...or, make it so only a person presenting the proper badge can withdraw or deposit
  resource_manager.set_depositable(rule!(require(transfer_badge)));
  resource_manager.set_withdrawable(rule!(require(transfer_badge)));

  // Unfreeze the token!
  resource_manager.set_depositable(AccessRule::AllowAll);
  resource_manager.set_withdrawable(AccessRule::AllowAll);

  // Lock the token in the unfrozen state, so it may never again be changed
  resource_manager.lock_depositable();
  resource_manager.lock_withdrawable();
});
```

### The `authorize()` method

In the previous example, you saw the use of the `authorize()` method on the `rule_admin_vault`. This method is available on both `Vaults` and `Buckets` and is used to temporarily put a `proof` of the underlying resources on the `authzone` for authorization.

The method takes as parameter a <a href="https://doc.rust-lang.org/rust-by-example/fn/closures.html" target="_blank">closure</a> with no argument and runs it after putting the proofs on the auth zone. After running the closure, the proofs are removed from the auth zone.

## Default Rules

All roles have defaults they are set to when unspecified or set to `None`. They are:



|                                  |             |                   |
|:---------------------------------|:------------|:------------------|
| Roles                            | Role Rule   | Updater Role Rule |
| `mint_roles`                     | `deny_all`  | `deny_all`        |
| `burn_roles`                     | `deny_all`  | `deny_all`        |
| `freeze_roles`                   | `deny_all`  | `deny_all`        |
| `recall_roles`                   | `deny_all`  | `deny_all`        |
| `withdraw_roles`                 | `allow_all` | `deny_all`        |
| `deposit_roles`                  | `allow_all` | `deny_all`        |
| `non_fungible_data_update_roles` | `deny_all`  | `deny_all`        |



:::note
- For more info on the `ResourceManager` setting and updating methods check the Rust docs <a href="https://docs.rs/scrypto/latest/scrypto/resource/resource_manager/struct.ResourceManager.html" target="_blank">here</a>

- For additional methods you may also want to check out the `ResourceManagerStub` Rust docs <a href="https://docs.rs/scrypto/latest/scrypto/resource/resource_manager/struct.ResourceManagerStub.html" target="_blank">here</a>
:::

