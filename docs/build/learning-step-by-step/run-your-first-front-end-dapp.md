---
title: "Run Your First Front End dApp"
---

# Run Your First Front End dApp

:::note[If you aren’t planning on using a front end, you can skip this and the next sections in the series.]

:::



:::note[create-radix-app]
If your in a hurry to get a working front end dapp up and running, use [create-radix-app](https://github.com/radixdlt/create-radix-app#readme). It will give you some great templates to build more from. To understand how to turn a template into a dapp of your own, learn how Radix dapps work across this and the next few lessons.
:::



This section shows you how to make a very simple dapp with a front end. We deployed a package to the network and started interacting with it on ledger in the last section. Before we turn that Gumball Machine into a fully fledged dapp, we need to learn how to connect a front end to the Radix network and wallet. This section shows you how using the Hello package from the first and [second sections](explain-your-first-scrypto-project.md), adding a front end that sends a connected user a free Hello Token.

We assume you have some familiarity with JavaScript and front end web development for this section, but it’s kept as simple as possible.

:::note
**The code for the dapp referenced in this section can be found in our [official examples here](https://github.com/radixdlt/official-examples/tree/main/step-by-step/09-hello-token-front-end**

.)
:::



## File Structure

Now that we have more than just the scrypto package, we need to reorganize our project a little. We’ll put the scrypto package in a `scrypto-package` directory and add a front end `client` directory. In the `client` directory we have an `index.html` file, a `main.js` file and a `package.json` file. The `index.html` file is the main page of our dapp. The `main.js` file is the javascript that runs on the page. The `package.json` file is be used to install the Radix Dapp Toolkit and has scripts to start and build the front end. There’s also a small amount of styling added with the `style.css` file.

    /
    ├── client/
    │  ├── index.html
    │  ├── main.js
    │  ├── package.json
    │  ├── style.css
    │  └── ...
    └── scrypto-package/
       └── ...

## Dapp Definitions

Every dapp needs a dapp definition; an account with metadata that identifies the dapp on the network. It creates a way for the Radix Wallet (and other clients) to know and verify what dapp it’s interacting with as well as what components and resources that dapp is associated with.



We are only going to connect this dapp to the Stokenet test network, but for Mainnet you will need to [provide the dapp definition address in the client](../dapp-development/dapp-definition-setup.md) as well. Without this, verification will not work and the Radix Wallet will not be able to connect. This is explained further in [Set Verification Metadata](set-verification-metadata.md) section of this step-by-step



## The Radix Dapp Toolkit

There are a collection of utilities that are needed to build a dapp on Radix. They include things like ways to query the state of the network, the wallet connect button, ways to send transactions, etc. We’ve collected some of them into an npm package called the [Radix dApp Toolkit](https://github.com/radixdlt/radix-dapp-toolkit). You can see some of it’s essential uses in two places in this dapp:

First it’s used in the `client/index.html` file to connect the wallet:

``` html
<radix-connect-button />
```

Second it’s used in `client/main.js` to interact with the network and wallet. To do this we first need to import the toolkit:

``` javascript
import {
  DataRequestBuilder,
  RadixDappToolkit,
  RadixNetwork,
} from "@radixdlt/radix-dapp-toolkit";
```

Then we generate an instance of the toolkit so we can use it’s various methods:

``` javascript
// Create a dapp configuration object for the Radix Dapp Toolkit
const dappConfig = {
  networkId: RadixNetwork.Stokenet,
  applicationVersion: "1.0.0",
  applicationName: "Hello Token dApp",
  applicationDappDefinitionAddress: dAppDefinitionAddress,
};
// Instantiate DappToolkit to connect to the Radix wallet and network
const rdt = RadixDappToolkit(dappConfig);
```

We then use the toolkit’s wallet API to do a few different things. First we decide what data we want to request from connected wallets:

``` javascript
rdt.walletApi.setRequestData(DataRequestBuilder.accounts().exactly(1));
```

Next, to send a transaction we first need to get the user’s account address:

``` javascript
const accountAddress = rdt.walletApi.getWalletData().accounts[0].address;
```

Which we use in a transaction manifest that we send back to the wallet:

``` javascript
const result = await rdt.walletApi.sendTransaction({
  transactionManifest: manifest,
  version: 1,
});
```

The wallet then calculates fees, prompts the user to sign the transaction and sends it to the network.

## Running the Example

:::note
**All the steps to get the dapp up and running are in the [official examples repo](https://github.com/radixdlt/official-examples/tree/main/step-by-step/09-hello-token-front-end#running-the-example**

)
:::


