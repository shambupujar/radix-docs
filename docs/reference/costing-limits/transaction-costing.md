---
title: "Transaction Costing"
---

# Transaction Costing

## What are transaction costs?

At the very high-level, transaction costs can be broken down into the following categories:

<table>
<colgroup>
<col />
<col />
<col />
</colgroup>
<thead>
<tr>
<th><br />
Item</th>
<th>Unit of Measurement</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>Execution</td>
<td>Execution Cost Unit</td>
<td><p>This is to account for the CPU usage during the execution of a transaction.</p>
<p><br />
</p>
<p>In this context, execution refers to the process of determining the state changes and other side effects by interpreting the instructions one-by-one upon some existing world state.</p></td>
</tr>
<tr>
<td>Finalisation</td>
<td>Finalisation Cost Unit</td>
<td>This is to account for the CPU usage during the finalisation of a transaction.<br />
<br />
In this context, finalisation refers to the process of committing state changes derived from a transaction and other auxiliary indices.</td>
</tr>
<tr>
<td>Storage</td>
<td>Bytes</td>
<td><p>This is to account for the additional data being added to a Node database.<br />
<br />
There are currently two type of storage costs:</p>
<ol type="1">
<li>State Storage - The substates</li>
<li>Archive Storage - Transaction payload, events and logs</li>
</ol></td>
</tr>
<tr>
<td>Royalties</td>
<td>XRD and USD</td>
<td>The amount of XRD paid to blueprint developers and component owners for the use of the code or component instances.</td>
</tr>
<tr>
<td>Tip</td>
<td>Percentage</td>
<td>The extra amount of XRD paid to validators for the processing of a transaction.<br />
<br />
This is designed to help prioritise transaction when there is a traffic jam.</td>
</tr>
</tbody>


## How does costing work?

Transaction costing is done through the costing module within the System.

This module is responsible for tracking the fee balance, counting execution and finalisation cost units and applying the costs listed above, with the help of a <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/6d35fe85de69d82b85700aaa9a68310a6163b72e/radix-engine/src/system/system_modules/costing/fee_reserve.rs#L98-L143">fee reserve</a>.

At the beginning of a transaction, the fee reserve is provided with a loan of XRD to bootstrap transaction execution. 

- The amount is defined as:

``` rust
execution_cost_unit_price  * ( 1 + tip_percentage / 100) * execution_cost_unit_loan
```

- This loan must be repaid before `execution_cost_unit_loan` number of execution cost units are consumed ("repay condition"), otherwise the transaction is rejected.

After that, transaction execution starts, during which two processes happen

- Kernel and system sends **execution cost **events** **(such as CPU usage, royalties) to the costing module:
  - To deduct the fee balance
  - To increase the cost unit counter
  - To repay system loan and apply deferred costs, if **repay condition** is met
- System sends vault lock fee events to the costing module:
  - To credit fee balance

Once execution is done, costing module is instructed to apply **finalisation cost **and** storage cost**.

## Costing Parameters

The following parameters are used by the costing module.

### Protocol defined parameters

| Name | Value | Description |
|:---|---:|:---|
| `execution_cost_unit_price` | 0.00000005 | The price of execution cost unit in XRD. |
| `execution_cost_unit_limit` | 100,000,000 | The maximum number of execution cost units that a transaction can consume. |
| `execution_cost_unit_loan` | 4,000,000 | The number of execution cost units loaned from the system, to bootstrap transaction execution. |
| `finalization_cost_unit_price` | 0.00000005 | The price of finalisation cost unit in XRD. |
| `finalization_cost_unit_limit` | 50,000,000 | The maximum number of finalisation cost units that a transaction can consume. |
| `usd_price` | 16.666666666666666666 | The price of USD in XRD.  1 XRD = 0.06 USD |
| `state_storage_price` | 0.00009536743 | The price of state storage. 1 MiB = 6 USD |
| `archive_storage_price` | 0.00009536743 | The price of archive storage.  1MiB = 6 USD |

### Transaction defined parameters

| Name | Description |
|:---|:---|
| `tip_percentage` | The tip percentage specified by the transaction. |
| `free_credit_in_xrd` | The free credit amount specified by a preview request. |

## Fee Table

The table below further defines the cost of each costing entry.

<table>
<colgroup>
<col />
<col />
<col />
<col />
</colgroup>
<thead>
<tr>
<th>Category</th>
<th>Entry</th>
<th>Description</th>
<th>Cost</th>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="30"><p>Execution<br />
(execution cost unit)</p>

<p></p>
</td>
<td>
<p>VerifyTxSignatures</p>
</td>
<td>Verify transaction signature.</td>
<td>Variable: <code>num_of_signature * 7000</code></td>
</tr>
<tr>
<td>
<p>ValidateTxPayload</p>
</td>
<td>Verify transaction payload.</td>
<td>Variable: <code>size(payload) * 40</code></td>
</tr>
<tr>
<td>
<p>RunNativeCode</p>
</td>
<td>Run native code.</td>
<td>Native code execution is billed in native execution unit per function based on table <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/main/radix-engine/assets/native_function_base_costs.csv">here</a>.<br />
<code>34 native execution units = 1 execution cost unit</code></td>
</tr>
<tr>
<td>
<p>RunWasmCode</p>
</td>
<td>Run WASM code.</td>
<td>WASM code execution is billed in WASM execution units per instruction based on weights <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/main/radix-engine/src/vm/wasm/weights.rs">here</a>.<br />
<code>3000 WASM execution units = 1 execution cost unit</code></td>
</tr>
<tr>
<td>
<p>PrepareWasmCode</p>
</td>
<td>Prepare WASM code.</td>
<td>Variable: <code>size(wasm) * 2</code><br />
</td>
</tr>
<tr>
<td>
<p>BeforeInvoke</p>
</td>
<td>Before function invocation.</td>
<td>Variable: <code>size(input) * 2</code><br />
</td>
</tr>
<tr>
<td>
<p>AfterInvoke</p>
</td>
<td>After function invocation.</td>
<td>Variable: <code>size(output) * 2</code><br />
</td>
</tr>
<tr>
<td>
<p>AllocateNodeId</p>
</td>
<td>Allocate a new node id. Node is the lower level representation of an object or key value store.</td>
<td>Fixed: <code>97</code></td>
</tr>
<tr>
<td>
<p>CreateNode</p>
</td>
<td>Create a new node.</td>
<td>Variable: <code>size(substate) + 456</code><br />
</td>
</tr>
<tr>
<td>
<p>DropNode</p>
</td>
<td>Drop a node.</td>
<td>Variable: <code>size(substate) +1143</code><br />
</td>
</tr>
<tr>
<td>
<p>PinNode</p>
</td>
<td>Pin a node to a device (heap or track).</td>
<td>Variable: <code>12 + IO access</code></td>
</tr>
<tr>
<td>
<p>MoveModule</p>
</td>
<td>Move module from one node to another.</td>
<td>Variable: <code>140 + IO access</code></td>
</tr>
<tr>
<td>
<p>OpenSubstate</p>
</td>
<td>Open a substate of a node.</td>
<td>Variable: <code>303 + IO access</code></td>
</tr>
<tr>
<td>
<p>ReadSubstate</p>
</td>
<td>Read the value of a substate.</td>
<td><p>Variable:</p>
<ul>
<li>If from heap: <code>65 + size(substate) * 2 + IO access</code></li>
<li>If from track: <code>113 + size(substate) * 2 + IO access</code></li>
</ul></td>
</tr>
<tr>
<td>
<p>WriteSubstate</p>
</td>
<td>Update the value of a substate.</td>
<td>Variable: <code>218 + size(substate) * 2 + IO access</code></td>
</tr>
<tr>
<td>
<p>CloseSubstate</p>
</td>
<td>Cloes a substate.</td>
<td>Fixed: <code>129</code></td>
</tr>
<tr>
<td>
<p>MarkSubstateAsTransient</p>
</td>
<td>Marks a substate a transient. Transient substates are not committed after transaction.</td>
<td>Fixed: <code>55</code></td>
</tr>
<tr>
<td>
<p>SetSubstate</p>
</td>
<td>Set the value of a substate</td>
<td>Variable: <code>133 + size(substate) * 2 + IO access</code></td>
</tr>
<tr>
<td>
<p>RemoveSubstate</p>
</td>
<td>Remove a substate</td>
<td>Variable: <code>717 + IO access</code></td>
</tr>
<tr>
<td>
<p>ScanKeys</p>
</td>
<td>Scan substate keys in a collection</td>
<td>Variable: <code>498 + IO access</code></td>
</tr>
<tr>
<td>
<p>ScanSortedSubstates</p>
</td>
<td>Scan substates in a collection</td>
<td>Variable: <code>187 + IO access</code></td>
</tr>
<tr>
<td>
<p>DrainSubstates</p>
</td>
<td>Drain substates in a collection</td>
<td>Variable: <code>273 * num_of_substates + 272 + IO access</code></td>
</tr>
<tr>
<td>
<p>LockFee</p>
</td>
<td>Lock fee</td>
<td>Fixed: <code>500</code></td>
</tr>
<tr>
<td>
<p>QueryFeeReserve</p>
</td>
<td>Query state of fee reserve</td>
<td>Fixed: <code>500</code></td>
</tr>
<tr>
<td>
<p>QueryActor</p>
</td>
<td>Query actor of this call frame</td>
<td>Fixed: <code>500</code></td>
</tr>
<tr>
<td>
<p>QueryTransactionHash</p>
</td>
<td>Query the transaction hash</td>
<td>Fixed: <code>500</code></td>
</tr>
<tr>
<td>
<p>GenerateRuid</p>
</td>
<td>Generate a RUID</td>
<td>Fixed: <code>500</code></td>
</tr>
<tr>
<td>
<p>EmitEvent</p>
</td>
<td>Emit an event</td>
<td>Variable: <code>500 + size(event) * 2</code></td>
</tr>
<tr>
<td>
<p>EmitLog</p>
</td>
<td>Emit a log</td>
<td>Variable: <code>500 + size(log) * 2</code></td>
</tr>
<tr>
<td>
<p>Panic</p>
</td>
<td>Panic and abort execution</td>
<td>Variable: <code>500 + size(message) * 2</code></td>
</tr>
<tr>
<td rowspan="3">Finalisation<br />
(finalisation cost unit)</td>
<td>
<p>CommitStateUpdates</p>
</td>
<td>Commit state updates</td>
<td><p>Variable, per substate:</p>
<ul>
<li>Insert or update: <code>100,000 + size(substate) / 4</code></li>
<li>Delete: <code>100,000</code></li>
</ul></td>
</tr>
<tr>
<td>
<p>CommitEvents</p>
</td>
<td>Commit events</td>
<td>Variable, per event: <code>5,000 + size(event) / 4</code></td>
</tr>
<tr>
<td>
<p>CommitLogs</p>
</td>
<td>Commit logs</td>
<td>Variable, per log: <code>1,000 + size (log) / 4</code></td>
</tr>
<tr>
<td rowspan="2">Storage<br />
(XRD)</td>
<td>
<p>IncreaseStateStorageSize</p>
</td>
<td>Increase the size of the state storage</td>
<td>Variable, per byte: <code>0.00009536743</code></td>
</tr>
<tr>
<td>
<p>IncreaseArchiveStorageSize</p>
</td>
<td>Increase the size of the archive storage</td>
<td>Variable, per byte: <code>0.00009536743</code></td>
</tr>
</tbody>


IO access cost:

- Read from database and found: `40,000 + size / 10`
- Read from database and not found: `160,000`

## Costing Runtime APIs

The system exposes a list of API to query the current state of the fee reserve.

See <a href="https://github.com/radixdlt/radixdlt-scrypto/blob/6d35fe85de69d82b85700aaa9a68310a6163b72e/scrypto/src/engine/wasm_api.rs#L240-L258">WASM API</a> and <a href="https://docs.rs/scrypto/latest/scrypto/runtime/struct.Runtime.html#method.get_execution_cost_unit_limit">Scrypto rustdoc</a>.

## Fee Distribution

| Cost         | To Proposer | To Validator Set | To Burn | To Royalty Owners |
|:-------------|:------------|:-----------------|:--------|:------------------|
| Execution    | 25%         | 25%              | 50%     | 0                 |
| Finalisation | 25%         | 25%              | 50%     | 0                 |
| Storage      | 25%         | 25%              | 50%     | 0                 |
| Royalty      | 0           | 0                | 0       | 100%              |
| Tip          | 100%        | 0                | 0       | 0                 |

  
