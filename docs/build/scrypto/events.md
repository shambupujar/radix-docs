---
title: "Events"
---

Events in Scrypto are a way to communicate to off chain clients. They are emitted by the component and can be listened for to begin secondary actions with the Gateway or Core APIs. There are many events that already exist in the native blueprints, e.g. the `WithdrawEvent` on accounts:

``` rust
#[derive(ScryptoSbor, ScryptoEvent, Debug, PartialEq, Eq)]
pub enum WithdrawEvent {
    Fungible(ResourceAddress, Decimal),
    NonFungible(ResourceAddress, IndexSet<NonFungibleLocalId>),
}
```

## Observing Events

Events can be observed in the transaction stream. To receive events in this stream the following opt-in must be included in the request body:

    "opt_ins": {
        "receipt_events": true
    }

[Gateway API Stream endpoint documentation can be found here](https://radix-babylon-gateway-api.redoc.ly/#operation/StreamTransactions).

Events can also be observed in the `events` section of transaction receipts e.g:

``` json
{
  "status": "CommittedSuccess",
  // --snip--
  "events": [
    {
      "name": "LockFeeEvent",
      "emitter": {
        "type": "Method",
        "entity": {
          "is_global": false,
          "entity_type": "InternalFungibleVault",
          "entity_address": "internal_vault_tdx_2_1tpv5433wcz7hyg0tutnp0960km5sda8p0jmdnaqanpjw43ucwhyey6"
        },
        "object_module_id": "Main"
      },
      "data": {
        "kind": "Tuple",
        "type_name": "LockFeeEvent",
        "fields": [
          {
            "kind": "Decimal",
            "field_name": "amount",
            "value": "0.6118835683725"
          }
        ]
      }
    },
    {
      "name": "WithdrawEvent",
      "emitter": {
        "type": "Method",
        "entity": {
          "is_global": false,
          "entity_type": "InternalFungibleVault",
          "entity_address": "internal_vault_tdx_2_1tpv5433wcz7hyg0tutnp0960km5sda8p0jmdnaqanpjw43ucwhyey6"
        },
        "object_module_id": "Main"
      },
      "data": {
        "kind": "Tuple",
        "type_name": "WithdrawEvent",
        "fields": [
          {
            "kind": "Decimal",
            "field_name": "amount",
            "value": "3"
          }
        ]
      }
    },
  // --snip--
}
```

These are available with a [Gateway API Committed Transaction Details endpoint](https://radix-babylon-gateway-api.redoc.ly/#operation/TransactionCommittedDetails)

## Custom Events

To create your own events you can register and emit them directly from Scrypto.

``` rust
use scrypto::prelude::*;

#[derive(ScryptoSbor, ScryptoEvent)]
struct RegisteredEvent {
    number: u64,
}

#[blueprint]
#[events(RegisteredEvent)]
mod example_event {
    struct ExampleEvent;

    impl ExampleEvent {
        pub fn emit_registered_event(number: u64) {
            Runtime::emit_event(RegisteredEvent { number });
        }
    }
}
```

The Blueprint macro expects an optional `#[events(…​)]` attribute for the event registration. Multiple attributes could be provided to add more events, i.e:

``` rust
#[blueprint]
#[event(NewUserEvent, UserIsNoMoreEvent, UserIsUserEvent)]
mod blueprint {
    struct Club {}
    impl Club {}
}
```
