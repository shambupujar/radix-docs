---
title: "Run the Gumball Machine Front End dApp"
---

# Run the Gumball Machine Front End dApp

:::note[If you aren’t planning on using a front end, you can skip this section of the series.]

:::



In the previous Step-by-Step section we looked at the basics of how to create a dApp with a simple front end. In this one we’ll take this further by applying the same concepts to our Gumball Machine package.

We deployed a Gumball Machine package onto the test network in [Use the Gumball Machine on Stokenet](use-the-gumball-machine-on-stokenet.md), so all this section will introduce is a front end for that package. (You may need to go back to the [Use the Gumball Machine on Stokenet](use-the-gumball-machine-on-stokenet.md) section if you don’t already have a deployed and working Gumball Machine) This example will be more complex than the last, introducing the Gateway API to query network state, and using all our transaction manifests from Use the Gumball Machine on Stokenet. Just like the last section though, you’ll want some familiarity with JavaScript and front end web development before jumping in.

:::note
**The code for the dapp referenced in this section can be found in our [official examples here](https://github.com/radixdlt/official-examples/tree/main/step-by-step/10-gumball-machine-front-end**

.)
:::



## File Structure

Our file structure will be similar to the last section, with the addition of a `manifests` directory to hold our transaction manifests, now converted into javascript functions so they can be called by `main.js`.

    /
    ├── client/
    │  ├── index.html
    │  ├── main.js
    │  ├── package.json
    │  ├── style.css
    │  ├── manifests
    │  └── ...
    └── scrypto-package/
       └── ...

## Gumball Machine Transactions

The transactions sent by the front end cover the `instantiate_gumball_machine` function and all but one of the blueprint’s methods (`get_status` isn’t included as we can get the price and remaining number of gumballs from the component state via the Gateway API instead).

Each transaction manifest is generated from one of the manifest functions in `client/manifests/`. These functions take the same arguments as the corresponding blueprint method plus necessary addresses. For example, the `refill_gumball_machine` manifest function:

``` javascript
export const refillManifest = (
  accountAddress,
  componentAddress,
  ownerBadgeAddress
) => `
CALL_METHOD
  Address("\${accountAddress}")
  "create_proof_of_amount"
  Address("\${ownerBadgeAddress}")
  Decimal("1")
;
CALL_METHOD
  Address("\${componentAddress}")
  "refill_gumball_machine"
;
CALL_METHOD
  Address("\${accountAddress}")
  "deposit_batch"
  Expression("ENTIRE_WORKTOP")
;`
```

(You can also see that we’ve used our owner badge in this manifest, to pass the required proof.)

The transactions are then sent to the wallet for signing and submission to the network:

``` javascript
// Send manifest to wallet for signing
const result = await rdt.walletApi.sendTransaction({
  transactionManifest: manifest,
  version: 1,
});
```

The effects of these transactions are tracked and displayed with the help of the Gateway API

## The Gateway API

We saw how the Radix Developer Toolkit (RDT) can be used to interact with the network via the Radix Wallet in the last example. If we want to access the network more directly we use the Gateway API and [it’s npm package](https://github.com/radixdlt/babylon-gateway/tree/main/sdk/typescript/).

The Gateway API is set up in a similar way to RDT. It’s imported into `client/main.js`:

``` javascript
import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
```

Then we generate an instance so we can use it’s various methods:

``` javascript
const gatewayApi = GatewayApiClient.initialize(dappConfig);
```

The Gateway API is used by the Radix Wallet and both the Console and Dashboard that we’ve been using to deploy packages and instantiate components. It gives us access to [a wide array of different network interaction](https://radix-babylon-gateway-api.redoc.ly), but we’ll use it to query the network for the state of the ledger, the status of the network and of specific transactions. Specifically, we’ll be using the Gateway API for:

- Getting the status of various transactions after they’ve been submitted to the network via the wallet:

  ``` javascript
  // Fetch the transaction status from the Gateway API
  const transactionStatus = await gatewayApi.transaction.getStatus(
    result.value.transactionIntentHash
  );
  ```

- Finding the addresses of the new component and resources after instantiation (as component instantiation is a part of the front end this time):

  ``` javascript
  // Fetch the details of changes committed to ledger from Gateway API
  const committedDetails = await gatewayApi.transaction.getCommittedDetails(
    result.value.transactionIntentHash
  );
  console.log("Instantiate committed details:", committedDetails);

  // Set addresses from details committed to the ledger in the transaction
  componentAddress = committedDetails.transaction.affected_global_entities[2];
  ownerBadgeAddress = committedDetails.transaction.affected_global_entities[3];
  gumballResourceAddress =
    committedDetails.transaction.affected_global_entities[4];
  ```

- Querying the ledger state of our Gumball Machine component to track price, number of gumballs and earnings:

  ``` javascript
  async function fetchAndShowGumballMachineState() {
    // Use Gateway API to fetch component details
    if (componentAddress) {
      const componentDetails =
        await gatewayApi.state.getEntityDetailsVaultAggregated(
          componentAddress
        );
      console.log("Component Details:", componentDetails);

      // Get the price, number of gumballs, and earnings from the component state
      const price = componentDetails.details.state.fields.find(
        (field) => field.field_name === "price"
      )?.value;
      const numOfGumballs = componentDetails.fungible_resources.items.find(
        (item) => item.resource_address === gumballResourceAddress
      )?.vaults.items[0].amount;
      const earnings = componentDetails.fungible_resources.items.find(
        (item) => item.resource_address === xrdAddress
      )?.vaults.items[0].amount;
  ```

  We then use these values to update the page:

  ``` javascript
      // Show the values on the page
      document.getElementById("numOfGumballs").innerText = numOfGumballs;
      document.getElementById("price").innerText = price;
      document.getElementById("earnings").innerText = earnings + " XRD";
    }
  }
  ```

## Running the Gumball Machine dApp

:::note
**To get the Gumball Machine working in the browser for yourself go to [the official examples repo’s instructions](https://github.com/radixdlt/official-examples/tree/main/step-by-step/10-gumball-machine-front-end#running-the-example**

and follow the steps.)
:::


