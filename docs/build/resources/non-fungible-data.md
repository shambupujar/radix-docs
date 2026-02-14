---
title: "Non Fungible Data"
---


Each Non-fungible on the Radix ledger can have its own unique associated data. Unlike metadata, this non-fungible data is unique to the token rather than shared across the resource collection. There are several common fields for [Displaying Non-fungible data](non-fungible-data-for-wallet-display.md) in the [Radix Wallet](../../use/radix-wallet-overview.md), [Dashboard](../../use/radix-dashboard.md) and other explorers, but we can choose whichever fields we want when defining a non-fungible data structure.

Non-fungible data structures are defined when creating a non-fungible resource collection. The specific data for each token is then added at minting. It is immutable by default, but we can choose for some or all of it to be updatable. Below you will find how to define, set, retrieve and update non-fungible data.

## Creating a Resource that has Non-fungible Data

To add non-fungible data to resource we first define the data structure.

``` rust
// A top-level struct must derive NonFungibleData.
// All types referenced directly/indirectly also need to derive ScryptoSbor.
#[derive(ScryptoSbor, NonFungibleData)]
struct MyData {
    name: String,
    description: String,
    // Note that marking top-level fields as `#[mutable]` means that the data
    // under that field can be updated.
    #[mutable]
    mutable_field: String,
    // Add any other custom data fields could go here
}
```

With a defined non-fungible data struct we can create the resource. Note where `::<MyData>` is below.

``` rust
#[blueprint]
mod example {
    struct Example {
    }

    impl Example {
        pub fn new() -> Global<Example> {
            let collection_manager = ResourceBuilder::new_ruid_non_fungible::<MyData>(OwnerRole::None)
            // --snip--
```

## Adding Non-fungible Data When Minting

When minting new non-fungibles we decide the vales for any data they will hold. This is a little different for the different non-fungible types:

### RUID Type Non-fungibles

``` rust
        pub fn mint_non_fungible(
            &mut self,
            name: String,
            description: String,
        ) -> NonFungibleBucket {
            // Create non-fungible data
            let non_fungible_data = MyData {
                name,
                description,
                mutable_field: "original value".to_owned(),
            };

            // Mint a single non-fungible with the data
            self.collection_manager.mint_ruid_non_fungible(non_fungible_data)
        }
```

### Integer Type Non-fungibles

``` rust
        pub fn mint_non_fungible(
            &mut self,
            id: u64,
            name: String,
            description: String,
        ) -> NonFungibleBucket {
            // Create non-fungible data
            let non_fungible_data = MyData {
                name,
                description,
                mutable_field: "original value".to_owned(),
            };

            // Mint a single non-fungible with the data
            self.collection_manager
                .mint_non_fungible(&NonFungibleLocalId::integer(id), non_fungible_data)
        }
```

### String Type Non-fungibles

``` rust
        pub fn mint_non_fungible(
            &mut self,
            id: String,
            name: String,
            description: String,
        ) -> NonFungibleBucket {
            // Create non-fungible data
            let non_fungible_data = MyData {
                name,
                description,
                mutable_field: "original value".to_owned(),
            };

            // Mint a single non-fungible with the data
            self.collection_manager
                .mint_non_fungible(&NonFungibleLocalId::string(id).unwrap(), non_fungible_data)
        }
```

### Byte Type Non-fungibles

``` rust
        pub fn mint_non_fungible(
            &mut self,
            id: [u8; 32],
            name: String,
            description: String,
        ) -> NonFungibleBucket {
            // Create non-fungible data
            let non_fungible_data = MyData {
                name,
                description,
                mutable_field: "original value".to_owned(),
            };

            // Mint a single non-fungible with the data
            self.collection_manager
                .mint_non_fungible(&NonFungibleLocalId::bytes(id).unwrap(), non_fungible_data)
        }
```

## Retrieving Non-fungible Data

### Using a Non-fungible Local ID

With the resource address and a local ID we can retrieve non-fungible data. The `collection_manger` holds the resource address in the example below.

``` rust
        pub fn get_non_fungible_data_by_id(&self, id: NonFungibleLocalId) -> MyData {
            self.collection_manager.get_non_fungible_data::<MyData>(&id)
        }
```

### From Buckets

For a bucket containing a single non-fungible

``` rust
        pub fn get_non_fungible_id_and_data_from_bucket(
            &self,
            bucket: NonFungibleBucket,
        ) -> (NonFungibleLocalId, MyData) {
            let non_fungible_id = bucket.non_fungible_local_id();
            let non_fungible_data = bucket.non_fungible().data();

            (non_fungible_id, non_fungible_data)
        }
```

For a bucket containing a multiple non-fungibles

``` rust
        pub fn get_multiple_non_fungible_ids_and_data_from_bucket(
            &self,
            bucket: NonFungibleBucket,
        ) -> Vec<(NonFungibleLocalId, MyData)> {
            // Get all non-fungible IDs from the bucket
            let non_fungible_ids = bucket.non_fungible_local_ids();
            // Get all the non-fungible data from the bucket
            let non_fungible_data: Vec<MyData> = bucket
                .non_fungibles()
                .iter()
                .map(|non_fungible| non_fungible.data())
                .collect();

            // For each ID, get the associated data and add to results
            non_fungible_ids.iter().cloned().zip(non_fungible_data).collect()
        }
```

### From Proofs

There are different ways to retrieve non-fungible data from Proofs depending on whether they are [sitting on the Auth Zone](../authorization/using-proofs.md#verify-your-caller-precisely-with-the-authzone) or have been [passed by intent](../authorization/using-proofs.md#getting-non-fungible-data-from-proofs). Have a look at the [Authorizing callers of your method section](../authorization/using-proofs.md#authorizing-callers-of-your-method) of [Using Proofs](../authorization/using-proofs.md) for a complete description of how.

### Reading Individual Data Fields

There is no way to read a single specified non-fungible data field by name yet. However if you know its position in the data struct you can use the following method.

``` rust
        pub fn get_non_fungible_data_field(
            &self,
            field_index: usize,
            id: NonFungibleLocalId,
        ) -> Value<ScryptoCustomValueKind, ScryptoCustomValue> {
            // Get the non-fungible data
            let structured_data: ScryptoValue = self.collection_manager.call(
                NON_FUNGIBLE_RESOURCE_MANAGER_GET_NON_FUNGIBLE_IDENT,
                &NonFungibleResourceManagerGetNonFungibleInput { id: id.clone() },
            );
            // Unwrap the tuple to get the fields
            let ScryptoValue::Tuple { fields } = structured_data else {
                panic!("NF data was not a tuple");
            };
            // Retrieve then return the field at the given index
            fields.get(field_index).unwrap().to_owned()
        }
```

You could use a [Gateway API call](https://radix-babylon-gateway-api.redoc.ly/#operation/NonFungibleData) to find the position of your chosen data field.

## Modifying Non-fungible Data

For a non-fungible data field to be mutable we have to mark it as such in it’s struct.

``` rust
// All types referenced directly/indirectly also need to derive ScryptoSbor.
#[derive(ScryptoSbor, NonFungibleData)]
pub struct MyData {
    name: String,
    description: String,
    #[mutable]
    mutable_field: String,
}
```

We can then update it, as long as we have the resource address and our token’s local ID.

### Updating Fields Using Scrypto

In most circumstances, to update a non-fungible data field in Scrypto you will need an resource-owner or resource-non-fungible-data-updater badge stored in your component. In the example below that’s our `owner_badge`, which we use to authorize the update.

The authorized closure ( method in `authorize_with_amount()`) can then use the resource address in the form of the `collection_manger` and the `id` of our chosen non-fungible to identify and update the `mutable_field` value.

``` rust
        pub fn update_non_fungible_data(
            &mut self,
            id: NonFungibleLocalId,
            new_field_value: String,
        ) {
            self.owner_badge.authorize_with_amount(1, || {
                self.collection_manager.update_non_fungible_data(
                    &id,
                    "mutable_field",
                    new_field_value,
                );
            });
        }
```

### Updating Fields Using Transaction Manifests

We can change updatable non-fungible data fields using Radix transaction maniefsts. In the example below we first authorize the change by adding an `owner_badge` Proof to the authzone, then we call `update_non_fungible_data` on the resource manager.

``` shell
CALL_METHOD
  Address("\${account_address}")
  "lock_fee"
  Decimal("100")
;
CALL_METHOD
  Address("\${account_address}")
  "create_proof_of_amount"
  Address("\${non_fungible_owner_badge_address}")
  Decimal("1")
;
CALL_METHOD
  Address("\${non_fungible_resource_address}")
  "update_non_fungible_data"
  NonFungibleLocalId("\${non_fungible_local_id}")
  "mutable_field" # Field name
  "Updated Value" # New value
;
```
