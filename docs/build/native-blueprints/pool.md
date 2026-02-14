---
title: "Pool"
---

## Resource Pools

Liquidity pools are a concept used pervasively in a very wide range of DeFi applications.

Users that participate in contributing to liquidity pools receive a token that represents their proportional contribution. These tokens are often called "LP tokens"; we call them more generically "pool units". The contents of the pool may shift over time (depending on the application) and ultimately the pool units are redeemable for the user’s proportion of the pool.

This makes pool units an important type of asset where the user would like to have a clear indication in their wallet exactly what those pool units are worth from their pool at any given time, and be confident that there is no question of their ability to redeem them. On other networks this is virtually impossible to do with any guarantees because each pool is implemented with arbitrary logic. To show users what pool units are worth consistently and without risk, and to ensure redeemability, pools and pool units must have guaranteed predictable behavior.

Fortunately the fundamental concept of the pool and pool unit is quite universal and so have created a native pool package that allows any developer to instantiate pools for their application without constraining application functionality. These native pool components and the pool units they issue allow the wallet to provide the information and guaranteed behavior that they desire, similar to other native components like accounts and validators.

The pool package has three blueprints: a one-resource pool blueprint, a two-resource pool blueprint, and a more general multi-resource pool blueprint. This page documents the two-resource pool blueprint. However, information provided here is still relevant to other blueprints but with small differences to data types.

## Goals

While pool-based application functionality varies enormously, the pool concept itself is quite simple and has a set of consistent properties:

- The pool has one or more predefined token types that it holds.

- Users can contribute tokens to the pool.

  - If there is more than one token type in the pool, the ratio of token types contributed must match the ratio of the token types in the pool.

  - When users contribute, they always receive back a quantity of newly-minted pool unit tokens. For a contribution of tokens equal to X% of the pool, the user receives a quantity of pool units equal to X% of the total supply of those pool units at that moment.

- Users can redeem pool units for tokens from the pool.

  - If there is more than one token type in the pool, the ratio of token types returned in the redemption matches the ratio of the token types in the pool.

  - When users redeem, they send a quantity of pool units to the pool. For a quantity of pool units equal to X% of the total supply of pool units at that moment, the pool returns tokens equal to X% of the pool. The redeemed pool units are burned.

- Special entities outside of the pool have the rights to directly deposit tokens to or withdraw tokens from the pool according to application-specific logic.

With the above universal behavior, all of the variation of application usage of pools can be served with just three elements of pool configuration:

1.  What token type(s) is the pool configured to accept?

2.  What is the metadata configuration of the pool unit token, to "brand” it for users of the application?

3.  Who/what has the rights to directly deposit and withdraw tokens from the pool according to the business logic of the application?

For example, a DEX:

1.  The DEX system instantiates a pool with two token types for the two sides of a trading pair, XRD and ZOMBO.

2.  It sets the pool unit metadata to have the name "CoolDEX: XRD/ZOMBO”, and a specified icon URL.

3.  It sets the authorities for the protected_deposit/protected_withdraw methods to a badge held by the DEX’s component logic. That component logic would then use those methods to conduct XRD/ZOMBO trades out of the pool according to its preferred bonding curve, as well as perform any distribution of fees to the pool.

The native Pool component doesn’t presuppose what the pool means or who controls it via the protected_deposit/protected_withdraw methods; it only provides the basic universal pool functions: Contributions and withdrawals are of the correct type and adhere to the current pool ratio, and proportional pool unit minting/burning is done correctly to always represent the right share of the pool.

This in turn means that, with a native pool component, a wallet or dashboard UI for pool units knows some important things with certainty:

- This is in fact a pool unit that was minted by a pool (not something that behaves oddly)

- A quantity of pool units is in fact redeemable at this moment for a known quantity of tokens in the pool

- No application logic may stop the holder of the pool units from redeeming them at the pool

## Auth Roles

All three of the pool blueprints come with two auth roles whose definition is configurable by the instantiator of the blueprint. These two roles have the following responsibilities:

- `owner`: The `AccessRule` associated with the owner role can be configured by the instantiator of the pool. The `instantiate` function on the pool will set this as the owner of both the pool unit resource and the pool component. The owner is given the ability to update the metadata of the pool component and pool unit resource.

- `pool_manager_role`: This role is given the ability to call the `protected_withdraw`, `protected_deposit`, and `contribute` methods on the pool components to manage and utilize the funds in the pool.

Based on the above, the following is an example configuration of the `owner` and `pool_manager_role` roles that developers who use the pool blueprints may wish to adopt. Say you’re developing a radiswap style blueprint of a Constant Function Market Maker (CFMM) which makes use of the two-resource pool under the hood for elegant management of pool units and pool ownership proportions. The owner role could be configured to be a badge that is stored in the account of the owner of the protocol such that they can update metadata on their pool components and pool unit resources freely after the instantiation of their components. The `pool_manager_role` role could be configured to be a badge owned by the Radiswap component (or a virtual component caller badge) to allow the Radiswap component to manage the funds of the pool.

## Pool Unit

Contributing to a pool provides liquidity providers with pool units that represent their proportion of ownership in the pool and can be redeemed for said proportion of the pool. Pool units have the following access rules configuration:



|                 |            |              |
|-----------------|:-----------|:-------------|
|                 | Role       | Role Updater |
| Mint            | Pool       | DenyAll      |
| Burn            | Pool       | DenyAll      |
| Withdraw        | AllowAll   | DenyAll      |
| Deposit         | AllowAll   | DenyAll      |
| Recall          | DenyAll    | DenyAll      |
| Update Metadata | Owner Role | DenyAll      |



## API Reference

This section documents the interface of the two-resource pool blueprint. The information provided here is also relevant for the one-resource pool and multi-resource pool blueprints but some of the arguments and return types might be different. However, the core concepts still apply.

Additional Details for the various pool blueprints can be found in the Rust docs

- <a href="https://docs.rs/scrypto/latest/scrypto/component/struct.OneResourcePool.html" target="_blank">OneResourcePool</a>

- <a href="https://docs.rs/scrypto/latest/scrypto/component/struct.TwoResourcePool.html" target="_blank">TwoResourcePool</a>

- <a href="https://docs.rs/scrypto/latest/scrypto/component/struct.MultiResourcePool.html" target="_blank">MultiResourcePool</a>

#### `instantiate`



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Name</td>
<td><code>instantiate</code></td>
</tr>
<tr>
<td>Type</td>
<td>Function</td>
</tr>
<tr>
<td>Description</td>
<td><p>This function instantiates a new two-resource pool of the two resources provided in the <code>resource_addresses</code> argument of the function. The <code>owner_role</code> and <code>pool_manager_rule</code> provided as arguments to this function are set as the rule definitions of the owner and pool manager roles respectively.</p>
<p>There are certain cases where this function panics and the creation of the pool fails. These cases are as follows:</p>
<ul>
<li><p>If the resource addresses in the <code>resource_addresses</code> are not different (i.e., a pool is being created between the resource and itself).</p></li>
<li><p>If one of the resource addresses in the <code>resource_addresses</code> tuple is of a non-fungible resource.</p></li>
</ul></td>
</tr>
<tr>
<td>Callable by</td>
<td>Public</td>
</tr>
<tr>
<td>Arguments</td>
<td><ul>
<li><p><code>owner_role</code> - <code>OwnerRole</code>: The configuration (<code>AccessRule</code> and <code>mutability</code>) of the owner role to use for the pool component and the pool unit resource. Information on the powers given to this role can be found in the [Auth Roles](pool.md#auth-roles) section of this document.</p></li>
<li><p><code>pool_manager_rule</code> - <code>AccessRule</code>: The access rule to associate with the <code>pool_manager_role</code>. Information on the powers given to this role can be found in the [Auth Roles](pool.md#auth-roles) section of this document.</p></li>
<li><p><code>resource_addresses</code> - (<code>ResourceAddress</code>, <code>ResourceAddress</code>): A two-element tuple where each element is a <code>ResourceAddress</code> of the resources that this pool will be made out of.</p></li>
<li><p><code>address_reservation</code> - <code>Option&lt;GlobalAddressReservation&gt;</code>: An optional reservation for the global address of the component being instantiated. If provided, this reservation ensures that the component will be assigned the reserved address upon globalizing. If None is passed, the system will automatically allocate an address.</p></li>
</ul></td>
</tr>
<tr>
<td>Returns</td>
<td><ul>
<li><code>Global&lt;TwoResourcePool&gt;</code>: A global <code>TwoResourcePool</code> object is returned of the newly instantiated pool component.</li>
</ul></td>
</tr>
</tbody>




#### `contribute`



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Name</td>
<td><code>contribute</code></td>
</tr>
<tr>
<td>Type</td>
<td>Method</td>
</tr>
<tr>
<td>Description</td>
<td><p>A method that is only callable by the <code>pool_manager_role</code> that allows for resources to be contributed to the pool in exchange for pool unit tokens minted by the pool.</p>
<p>When this method is called, there are four states that the pool could be in which change the behavior of the pool slightly.</p>

<p><strong>State 1</strong> - <em>Reserves:</em> Both Empty, <em>Pool Unit Supply:</em> Zero</p>

<p><strong>Behavior:</strong></p>
<p>In this case, the pool is considered to be new. The entire contribution provided in the buckets argument of the method is accepted and no change is returned. The amount of pool units minted for the caller is equal to the geometric mean of the contribution provided.</p>



<p><strong>State 2 -</strong> <em>Reserves:</em> Any Empty, <em>Pool Unit Supply:</em> Non-Zero</p>

<p><strong>Behavior:</strong></p>
<p>In this case, the pool does not accept any contributions since the pool is considered to be in an illegal state. Despite there being no reserves in the pool, there are some pool units in circulation meaning that somebody owns some percentage of zero. Contributing to a pool that is in this state leads to a panic.</p>



<p><strong>State 3 -</strong> <em>Reserves:</em> Any Not Empty, <em>Pool Unit Supply: Zero</em></p>

<p><strong>Behavior:</strong></p>
<p>In this case, the pool is considered to be new. The entire contribution provided in the <code>buckets</code> argument of the method is accepted and no change is returned. The amount of pool units minted for the caller is equal to the geometric mean of the contribution provided. The first contributor gets any dust that is remaining in the reserves.</p>



<p><strong>State 4 -</strong> <em>Reserves:</em> Both Not Empty, <em>Pool Unit Supply:</em> Non-Zero</p>

<p><strong>Behavior:</strong></p>
<p>In this case, the pool is considered to be operating normally. An appropriate amount of the provided resources are contributed to the pool and the remaining resources are returned as change. The amount of pool units minted for the caller is proportional to the amount of resources the pool has accepted as contribution.</p>


<p>Depending on which state the pool is currently in, the pool will either accept the contribution in full, in part, or reject the contribution completely. Additionally, the amount of pool units minted changes depending on the state of the pool.</p>
<p>There are certain cases where this method panics and the creation contribution fails. These cases are as follows:</p>
<ul>
<li><p>If the resources provided in the <code>buckets</code> argument do not belong to the pool, thus the contribution is invalid.</p></li>
<li><p>If any of the buckets provided are empty.</p></li>
<li><p>If there are no reserves but the total supply of pool units is not zero (described in the table above).</p></li>
</ul></td>
</tr>
<tr>
<td>Callable by</td>
<td><code>pool_manager_role</code></td>
</tr>
<tr>
<td>Arguments</td>
<td><code>buckets</code> - (<code>Bucket</code>, <code>Bucket</code>): A two-element tuple where each element is a <code>Bucket</code> of the resources to contribute to the pool.</td>
</tr>
<tr>
<td>Returns</td>
<td><ul>
<li><p><code>Bucket</code> - A bucket of the pool units minted for the contribution made to the pool.</p></li>
<li><p><code>Option&lt;Bucket&gt;</code> - An optional return of change that is remaining from the contribution to the pool.</p></li>
</ul></td>
</tr>
<tr>
<td>Note</td>
<td>This method takes into account the case where one or both of the resources in the pool have divisibility that is not 18. In this case, the amount of resources that the pool accepts of the resource of non-18 divisibility is always rounded down to the nearest decimal point allowed for by the resource’s divisibility. The amount of pool units minted take this into account.</td>
</tr>
</tbody>




#### `redeem`



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Name</td>
<td><code>redeem</code></td>
</tr>
<tr>
<td>Type</td>
<td>Method</td>
</tr>
<tr>
<td>Description</td>
<td><p>Given a <code>Bucket</code> of pool units, this method redeems the pool units for the proportion of the pool that they own. This method is callable by everybody who has pool units and can not be protected.</p>
<p>There are certain cases where this method panics and redemption of pool units fails. These cases are as follows:</p>
<ul>
<li>If the resource in the provided bucket is not the pool unit resource expected by the pool component.</li>
</ul></td>
</tr>
<tr>
<td>Callable By</td>
<td>Public</td>
</tr>
<tr>
<td>Arguments</td>
<td><code>bucket</code> - <code>Bucket</code>: A bucket of the pool units to redeem for some proportion of the pool.</td>
</tr>
<tr>
<td>Returns</td>
<td>(<code>Bucket</code>, <code>Bucket</code>): A tuple of two elements where each element is a <code>Bucket</code> of the proportion of the resources in the pool owed for the pool units.</td>
</tr>
<tr>
<td>Note</td>
<td>This method takes into account the case where one or both of the resources in the pool have divisibility that is not 18. In this case, the amount of resources given back to the caller is always rounded down to fit into the divisibility of the resource. In this case, a pool that gets completely drained out may have some dust remaining in one or more of its vaults.</td>
</tr>
</tbody>




#### `protected_deposit`



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Name</td>
<td><code>protected_deposit</code></td>
</tr>
<tr>
<td>Type</td>
<td>Method</td>
</tr>
<tr>
<td>Description</td>
<td><p>Given a <code>Bucket</code> of tokens, this method deposits this bucket into the appropriate vault in the pool. This method is only callable by the <code>pool_manager_role</code> role since it’s considered a method used for the management of funds in the pool.</p>
<p>There are certain cases where this method panics and the deposit fails. These cases are as follows:</p>
<ul>
<li>If the resources in the provided bucket do not belong to the pool.</li>
</ul></td>
</tr>
<tr>
<td>Callable By</td>
<td><code>pool_manager_role</code></td>
</tr>
<tr>
<td>Arguments</td>
<td><code>bucket</code> - <code>Bucket</code>: A bucket of the resources to deposit into the pool.</td>
</tr>
<tr>
<td>Returns</td>
<td>Nothing</td>
</tr>
</tbody>




#### `protected_withdraw`



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Name</td>
<td><code>protected_withdraw</code></td>
</tr>
<tr>
<td>Type</td>
<td>Method</td>
</tr>
<tr>
<td>Description</td>
<td><p>Given a <code>ResourceAddress</code> and a <code>Decimal</code> amount, this method withdraws the amount from the pool. This method is only callable by the <code>pool_manager_role</code> role since it’s considered a method used for the management of funds in the pool.</p>
<p>There are certain cases where this method panics and the withdraw fails. These cases are as follows:</p>
<ul>
<li>If the provided resource address does not belong to the pool.</li>
</ul></td>
</tr>
<tr>
<td>Callable By</td>
<td><code>pool_manager_role</code></td>
</tr>
<tr>
<td>Arguments</td>
<td><ul>
<li><p><code>resource_address</code> - <code>ResourceAddress</code>: The address of the resource to withdraw from the pool.</p></li>
<li><p><code>amount</code> - <code>Decimal</code>: The amount to withdraw from the pool.</p></li>
<li><p><code>withdraw_strategy</code> - <code>WithdrawStrategy</code>: This argument controls how the withdraw of the resource is to be handled in relation to the divisibility of the resource. If <code>WithdrawStrategy::Exact</code> is used, then it’s the responsibility of the caller to ensure that the provided amount is suitable with the divisibility of the resource. If <code>WithdrawStrategy::Rounded</code> is specified, then it’s the responsibility of the pool to handle the rounding of the given amount to ensure that it’s suitable with the divisibility of the resource. It is recommended to always set this to <code>WithdrawStrategy::Rounded(RoundingMode::ToZero)</code> when calling this method such that your blueprint never runs into any panics.</p></li>
</ul></td>
</tr>
<tr>
<td>Returns</td>
<td><code>Bucket</code>: A bucket of the withdrawn resources.</td>
</tr>
</tbody>




#### `get_redemption_value`



|  |  |
|:---|:---|
| Name | `get_redemption_value` |
| Type | Method |
| Description | Calculates the amount of pool resources that some amount of pool units can be redeemed for. |
| Callable By | Public |
| Arguments | `amount_of_pool_units` - `Decimal`: The amount of pool units to calculate the corresponding amount of pool resources for. |
| Returns | `BTreeMap<ResourceAddress, Decimal>`: A map of the resources that the pool units can be redeemed for. This is a mapping of the address of the resource to the amount of this resource. |



#### `get_vault_amounts`



|  |  |
|:---|:---|
| Name | `get_vault_amounts` |
| Type | Method |
| Description | Returns the amount of reserves in the pool. |
| Callable By | Public |
| Arguments | none |
| Returns | `BTreeMap<ResourceAddress, Decimal>`: A map of the amount of reserves in the pool. This is a mapping of the address of the resource to the amount of this resource. |



## Events

#### `ContributionEvent`



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Name</td>
<td><code>ContributionEvent</code></td>
</tr>
<tr>
<td>Description</td>
<td>An event emitted when resources are contributed to the pool through the contribute method.</td>
</tr>
<tr>
<td>Fields</td>
<td><ul>
<li><p><code>contributed_resources</code> - <code>BTreeMap&lt;ResourceAddress, Decimal&gt;</code>: A map of the resources that the pool has accepted as a contribution.</p></li>
<li><p><code>pool_units_minted</code> - <code>Decimal</code>: The amount of pool units that have been minted as a result of this contribution to the pool.</p></li>
</ul></td>
</tr>
</tbody>




#### `RedemptionEvent`



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Name</td>
<td><code>RedemptionEvent</code></td>
</tr>
<tr>
<td>Description</td>
<td>An event that is emitted whenever pool units are redeemed from the pool through the redeem method.</td>
</tr>
<tr>
<td>Fields</td>
<td><ul>
<li><p><code>pool_unit_tokens_redeemed</code> - <code>Decimal</code>: The amount of pool units that have been redeemed.</p></li>
<li><p><code>redeemed_resources</code> - <code>BTreeMap&lt;ResourceAddress, Decimal&gt;</code>: The resources that have been redeemed.</p></li>
</ul></td>
</tr>
</tbody>




#### `WithdrawEvent`



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Name</td>
<td><code>WithdrawEvent</code></td>
</tr>
<tr>
<td>Description</td>
<td>An event that is emitted whenever resources are withdrawn from the pool through the protected_withdraw method.</td>
</tr>
<tr>
<td>Fields</td>
<td><ul>
<li><p><code>resource_address</code> - <code>ResourceAddress</code>: The address of the resource that has been withdrawn</p></li>
<li><p><code>amount</code> - <code>Decimal</code>: The amount of the resource that has been withdrawn.</p></li>
</ul></td>
</tr>
</tbody>




#### `DepositEvent`



<table>
<colgroup>
<col />
<col />
</colgroup>
<tbody>
<tr>
<td>Name</td>
<td><code>DepositEvent</code></td>
</tr>
<tr>
<td>Description</td>
<td>An event that is emitted whenever resources are deposited into the pool through the <code>protected_deposit</code> method.</td>
</tr>
<tr>
<td>Fields</td>
<td><ul>
<li><p><code>resource_address</code> - <code>ResourceAddress</code>: The address of the resource that has been deposited.</p></li>
<li><p><code>amount</code> - <code>Decimal</code>: The amount of the resource that has been deposited.</p></li>
</ul></td>
</tr>
</tbody>




## Metadata

### Pool Component



|  |  |  |
|:---|:---|:---|
| Key | Value Type | Description |
| `pool_vault_number` | `u8` | The number of vaults that the pool component has. |
| `pool_resources` | `Vec<GlobalAddress>` | The addresses of the resources in the pool. |
| `pool_unit` | `GlobalAddress` | The address of the pool unit resource associated with this pool. |



### Pool Unit Resource



|  |  |  |
|:---|:---|:---|
| Key | Value Type | Description |
| `pool` | `GlobalAddress` | The address of the pool component that this pool unit resource is associated with. |



## Example

A CFMM pool can be built on top of a two-resource pool, requiring the CFMM’s blueprint to only implement the functionality of a CFMM while letting the two-resource pool component handle the proportion of ownership of the pool and providing the liquidity providers with pool unit tokens which are recognized by the Babylon wallet and can be redeemed at any time directly through the wallet.

The following example is of a Radiswap blueprint, a CFMM pool blueprint that’s utilizes a two-resource pool.

``` rust
use scrypto::prelude::*;

#[blueprint]
#[events(InstantiationEvent, AddLiquidityEvent, RemoveLiquidityEvent, SwapEvent)]
mod radiswap {
    struct Radiswap {
        pool_component: Global<TwoResourcePool>,
    }

    impl Radiswap {
        pub fn new(
            owner_role: OwnerRole,
            resource_address1: ResourceAddress,
            resource_address2: ResourceAddress,
            dapp_definition_address: ComponentAddress,
        ) -> Global<Radiswap> {
            let (address_reservation, component_address) =
                Runtime::allocate_component_address(Radiswap::blueprint_id());
            let global_component_caller_badge =
                NonFungibleGlobalId::global_caller_badge(component_address);

            // Creating a new pool will check the following for us:
            // 1. That both resources are not the same.
            // 2. That none of the resources are non-fungible
            let pool_component = Blueprint::<TwoResourcePool>::instantiate(
                owner_role.clone(),
                rule!(require(global_component_caller_badge)),
                (resource_address1, resource_address2),
                None,
            );

            let component = Self { pool_component }
                .instantiate()
                .prepare_to_globalize(owner_role.clone())
                .with_address(address_reservation)
                .metadata(metadata!(
                    init {
                        "name" => "Radiswap", updatable;
                        "dapp_definition" => dapp_definition_address, updatable;
                    }
                ))
                .globalize();

            Runtime::emit_event(InstantiationEvent {
                component_address: component.address(),
                resource_address1,
                resource_address2,
                owner_role,
            });

            component
        }

        pub fn add_liquidity(
            &mut self,
            resource1: Bucket,
            resource2: Bucket,
        ) -> (Bucket, Option<Bucket>) {
            Runtime::emit_event(AddLiquidityEvent([
                (resource1.resource_address(), resource1.amount()),
                (resource2.resource_address(), resource2.amount()),
            ]));

            // All the checks for correctness of buckets and everything else is handled by the pool
            // component! Just pass it the resources and it will either return the pool units back
            // if it succeeds or abort on failure.
            self.pool_component.contribute((resource1, resource2))
        }

        /// This method does not need to be here - the pool units are redeemable without it by the
        /// holders of the pool units directly from the pool. In this case this is just a nice proxy
        /// so that users are only interacting with one component and do not need to know about the
        /// address of Radiswap and the address of the Radiswap pool.
        pub fn remove_liquidity(&mut self, pool_units: Bucket) -> (Bucket, Bucket) {
            let pool_units_amount = pool_units.amount();
            let (bucket1, bucket2) = self.pool_component.redeem(pool_units);

            Runtime::emit_event(RemoveLiquidityEvent {
                pool_units_amount,
                redeemed_resources: [
                    (bucket1.resource_address(), bucket1.amount()),
                    (bucket2.resource_address(), bucket2.amount()),
                ],
            });

            (bucket1, bucket2)
        }

        pub fn swap(&mut self, input_bucket: Bucket) -> Bucket {
            let mut reserves = self.vault_reserves();

            let input_amount = input_bucket.amount();

            let input_reserves = reserves
                .remove(&input_bucket.resource_address())
                .expect("Resource does not belong to the pool");
            let (output_resource_address, output_reserves) = reserves.into_iter().next().unwrap();

            let output_amount = input_amount
                .checked_mul(output_reserves)
                .unwrap()
                .checked_div(input_reserves.checked_add(input_amount).unwrap())
                .unwrap();

            Runtime::emit_event(SwapEvent {
                input: (input_bucket.resource_address(), input_bucket.amount()),
                output: (output_resource_address, output_amount),
            });

            // NOTE: It's the responsibility of the user of the pool to do the appropriate rounding
            // before calling the withdraw method.

            self.deposit(input_bucket);
            self.withdraw(output_resource_address, output_amount)
        }

        fn vault_reserves(&self) -> IndexMap<ResourceAddress, Decimal> {
            self.pool_component.get_vault_amounts()
        }

        fn deposit(&mut self, bucket: Bucket) {
            self.pool_component.protected_deposit(bucket)
        }

        fn withdraw(&mut self, resource_address: ResourceAddress, amount: Decimal) -> Bucket {
            self.pool_component.protected_withdraw(
                resource_address,
                amount,
                WithdrawStrategy::Rounded(RoundingMode::ToZero),
            )
        }
    }
}

#[derive(ScryptoSbor, ScryptoEvent)]
pub struct InstantiationEvent {
    pub owner_role: OwnerRole,
    pub resource_address1: ResourceAddress,
    pub resource_address2: ResourceAddress,
    pub component_address: ComponentAddress,
}

#[derive(ScryptoSbor, ScryptoEvent)]
pub struct AddLiquidityEvent([(ResourceAddress, Decimal); 2]);

#[derive(ScryptoSbor, ScryptoEvent)]
pub struct RemoveLiquidityEvent {
    pub pool_units_amount: Decimal,
    pub redeemed_resources: [(ResourceAddress, Decimal); 2],
}

#[derive(ScryptoSbor, ScryptoEvent)]
pub struct SwapEvent {
    pub input: (ResourceAddress, Decimal),
    pub output: (ResourceAddress, Decimal),
}
```

1.  All three of the pool blueprints come with stubs defined in Scrypto which provides type safety and allows for a rust-like way of invoking methods on the pool components. The possible stubs to use are: OneResourcePool, TwoResourcePool, and MultiResourcePool.

2.  There are two cases where this function can panic: a) if both resources are the same, b) if any of the resources are non-fungible.

3.  The pool does all of the necessary checks to ensure that the correct resources were provided and contains all of the logic for determining how much pool units to mint in return and whether there is any change to return back to the caller.

4.  This method does not need to be here - the pool units are redeemable without it by the holders of the pool units directly from the pool. In this case this is just a nice proxy so that users are only interacting with one component and do not need to know about the address of Radiswap and the address of the Radiswap pool.

In the above example, the only method that the Radiswap blueprint needed to implement was the swap method which defines how the resources in the pool can be used by the manager of the pool to conduct an exchange or swap of resources. Additionally, most of the methods on the Radiswap blueprint are pass-through methods implemented purely for a nicer interface.
