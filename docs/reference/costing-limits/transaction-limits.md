---
title: "Transaction Limits"
---

# Transaction Limits

## SBOR Limits

In Radix Engine, almost all payloads are encoded [Scrypto SBOR ](../sbor/scrypto-sbor-specs.md)or [Manifest SBOR](../../build/transactions-manifests/manifest-sbor-specs.md), including but not limited to:

- Transaction payload
- Component state
- Function invocation input and output
- System APIs

When the engine validates or decodes these payloads, it applies the following additional limits:

| Limit | Value | Description |
|:---|---:|:---|
| `BLUEPRINT_PAYLOAD_MAX_DEPTH` | 48 | The max depth of blueprint payload, such as component state, events and function input/output. |
| `KEY_VALUE_STORE_ENTRY_MAX_DEPTH` | 48 | The max depth of KeyValueStore entries, both keys and values. |

## Transaction Limits

| Limit | Value | Description |
|:---|---:|:---|
| `MAX_NUMBER_OF_INTENT_SIGNATURES` | 16 | The maximum number of signatures that can be used to sign a transaction intent. This does not include notary signature. |
| `MAX_NUMBER_OF_BLOBS` | 16 | The maximum number of blobs a transaction can include. |
| `MIN_TIP_PERCENTAGE` | 0% | The minimum tip percentage. |
| `MAX_TIP_PERCENTAGE` | 65,535% | The maximum tip percentage. |
| `MAX_EPOCH_RANGE` | 8640 | The maximum allowed epoch range in the transaction header. This is roughly about 30 days assuming a 5-minute epoch time. |
| `MAX_TRANSACTION_SIZE` | 1 MiB | The maximum transaction payload size. |

## System Limits

<table>
<colgroup>
<col />
<col />
<col />
</colgroup>
<thead>
<tr>
<th>Limit</th>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>EXECUTION_COST_UNIT_LIMIT</code></td>
<td>100,000,000</td>
<td>The maximum number of execution cost units that a transaction can use.</td>
</tr>
<tr>
<td><code>FINALISATION_COST_UNIT_LIMIT</code></td>
<td>50,000,000</td>
<td>The maximum number of finalisation cost units that a transaction can use.</td>
</tr>
<tr>
<td><code>PREVIEW_CREDIT_IN_XRD</code></td>
<td>1,000,000</td>
<td>The amount of XRD that is used as transaction fee when previewing a manifest intent.</td>
</tr>
<tr>
<td><code>MAX_CALL_DEPTH</code></td>
<td>8</td>
<td>The max depth of the call frames.<br />
Depth increases by 1 when a function or method is invoked and decreases by 1 after the invocation is finished.</td>
</tr>
<tr>
<td><code>MAX_HEAP_SUBSTATE_TOTAL_SIZE</code></td>
<td>64 MiB</td>
<td><p>The maximum total size of substates in the Heap.</p>
<ul>
<li>Both substate keys and values are accounted.</li>
<li>Heap is the storage that keeps all the substates of nodes that are neither globalised nor owned by a global object.</li>
</ul></td>
</tr>
<tr>
<td><code>MAX_TRACK_SUBSTATE_TOTAL_SIZE</code></td>
<td>64 MiB</td>
<td><p>The maximum total size of substates in the Heap.</p>
<ul>
<li>Both substate keys and values are accounted.</li>
<li>Track is the storage that keeps all the substates of "loaded" globalised nodes and their children.</li>
</ul></td>
</tr>
<tr>
<td><code>MAX_SUBSTATE_KEY_SIZE</code></td>
<td>2 KiB</td>
<td>The maximum size of a substate key.</td>
</tr>
<tr>
<td><code>MAX_SUBSTATE_VALUE_SIZE</code></td>
<td>2 MiB</td>
<td>The maximum size of a substate value.</td>
</tr>
<tr>
<td><code>MAX_INVOKE_PAYLOAD</code></td>
<td>1 MiB</td>
<td>The maximum size of invocation payload, encoding of the call arguments.</td>
</tr>
<tr>
<td><code>MAX_EVENT_SIZE</code></td>
<td>32 KiB</td>
<td>The maximum size of a single event.</td>
</tr>
<tr>
<td><code>MAX_NUMBER_OF_EVENTS</code></td>
<td>256</td>
<td>The maximum number of events that a transaction can produce.</td>
</tr>
<tr>
<td><code>MAX_LOG_SIZE</code></td>
<td>32 KiB</td>
<td>The maximum size of a single log.</td>
</tr>
<tr>
<td><code>MAX_NUMBER_OF_LOGS&lt;</code></td>
<td>256</td>
<td>The maximum number of logs that a transaction can produce.</td>
</tr>
<tr>
<td><code>MAX_PACK_MESSAGE_SIZE</code></td>
<td>32 KiB</td>
<td>The maximum size of a panic message.</td>
</tr>
</tbody>


## WASM Limits

<table>
<colgroup>
<col />
<col />
<col />
</colgroup>
<thead>
<tr>
<th>Limit</th>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>MAX_MEMORY_SIZE_IN_PAGES</code></td>
<td>8</td>
<td>The maximum depth of an access rule.</td>
</tr>
<tr>
<td><code>MAX_INITIAL_TABLE_SIZE</code></td>
<td>1024</td>
<td>The maximum initial table size.</td>
</tr>
<tr>
<td><code>MAX_NUMBER_OF_BR_TABLE_TARGETS</code></td>
<td>256</td>
<td>The maximum of BR table targets.</td>
</tr>
<tr>
<td><code>MAX_NUMBER_OF_GLOBALS</code></td>
<td>512</td>
<td>The maximum number of global variables.</td>
</tr>
<tr>
<td><code>MAX_NUMBER_OF_FUNCTIONS</code></td>
<td>8192<br />
</td>
<td>The maximum number of functions.</td>
</tr>
<tr>
<td><code>MAX_NUMBER_OF_FUNCTION_PARAMS</code></td>
<td>32</td>
<td>The maximum of parameters in a single function.</td>
</tr>
<tr>
<td><code>MAX_NUMBER_OF_FUNCTION_LOCALS</code></td>
<td>256</td>
<td>The maximum of locals in a single function.</td>
</tr>
<tr>
<td><code>MAX_NUMBER_OF_BUFFERS</code></td>
<td>32</td>
<td>The max number of buffers that a Scrypto VM can allocate.<br />
Buffers are used for data exchange between system and Scrypto blueprints.</td>
</tr>
</tbody>


## Metadata Limits

| Limit | Value | Description |
|:---|---:|:---|
| `MAX_METADATA_KEY_STRING_LEN` | 100 | The maximum length of a metadata key (in characters). |
| `MAX_METADATA_VALUE_SBOR_LEN` | 4 KiB | The maximum size of a metadata value (measured in bytes of the SBOR encoding). |
| `MAX_URL_LENGTH` | 1024 | The maximum length of a URL. |
| `MAX_ORIGIN_LENGTH` | 1024 | The maximum length of an Origin. |
| `MAX_ACCESS_RULE_DEPTH` | 8 | The maximum depth of an access rule. |
| `MAX_ACCESS_RULE_TOTAL_NODES` | 64 | The maximum total number of nodes in an access rule. |

## Access Rule Limits

| Limit | Value | Description |
|:---|---:|:---|
| `MAX_ACCESS_RULE_DEPTH` | 8 | The maximum depth of an access rule. |
| `MAX_ACCESS_RULE_TOTAL_NODES` | 64 | The maximum total number of nodes in an access rule. |

## Royalty Limits

<table>
<colgroup>
<col />
<col />
<col />
</colgroup>
<thead>
<tr>
<th>Limit</th>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>MAX_PER_FUNCTION_ROYALTY_AMOUNT_IN_XRD</code></td>
<td>166.666666666666666666</td>
<td>The maximum royalty amount (converted into XRD) that can be set on a function.<br />
This is roughly 10 USD.</td>
</tr>
</tbody>


## Blueprint Package Limits

<table>
<colgroup>
<col />
<col />
<col />
</colgroup>
<thead>
<tr>
<th>Limit</th>
<th>Value</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>MAX_FEATURE_NAME_LEN</code></td>
<td>100</td>
<td>The maximum length of a feature name.<br />
<strong>Note</strong>: The "features" is a capability exposed to native blueprints only.</td>
</tr>
<tr>
<td><code>MAX_EVENT_NAME_LEN</code></td>
<td>100</td>
<td>The maximum length of an event name.</td>
</tr>
<tr>
<td><code>MAX_REGISTERED_TYPE_NAME_LEN</code><br />
</td>
<td>100</td>
<td>The maximum length of the name of a registered type.</td>
</tr>
<tr>
<td><code>MAX_BLUEPRINT_NAME_LEN</code><br />
</td>
<td>100</td>
<td>The maximum length of a blueprint name.</td>
</tr>
<tr>
<td><code>MAX_FUNCTION_NAME_LEN</code><br />
</td>
<td>256</td>
<td>The maximum length of a function name.</td>
</tr>
<tr>
<td><code>MAX_NUMBER_OF_BLUEPRINT_FIELDS</code><br />
</td>
<td>256</td>
<td>The maximum number of fields defined in a blueprint.<br />
</td>
</tr>
<tr>
<td></td>
<td></td>
<td><strong>Note</strong>: Scrypto blueprints have only one field as of now.<br />
</td>
</tr>
</tbody>


  

  
