---
title: "Radix Dashboard"
---

# Radix Dashboard

## Using the Dashboard dApp with the Radix Wallet

After you have linked Radix Wallet and Connector, the easiest place to see how they work with dApps is to visit the <a href="https://dashboard.radixdlt.com" target="_blank">Radix Dashboard</a> or <a href="https://console.radixdlt.com" target="_blank">Radix Console</a>.

For those familiar with the preceding Olympia network, the Radix Dashboard replaces the Radix Explorer at Babylon. Like the Explorer, the Dashboard lets you search for transactions, accounts, and more. It also expands on these capabilities as a real Web3 dApp where you can connect your Radix Wallet directly, to let users perform common network activities such as staking. The Console supplements this by offering utility pages for developer use, including sending raw transaction manifests, and package deployment.

In the upper right corner is the √ **Connect** button. This is a web component that any developer can use and import into their dApp website project that makes it easy to integrate to the Radix Wallet, and gives users an immediate indication that this is a Web3 site where they can use the Radix Wallet. The [Radix dApp Toolkit](../build/dapp-development/dapp-toolkit.md) provides a seamless way for developers to implement their own √ **Connect** button.

Click that button, select “**Connect Now”** and the Connector extension will automatically attempt to find your Radix Wallet.

Open the Radix Wallet on your phone, and you should receive a connection request from the Dashboard dApp. For the initial version of the Dashboard, all it needs from the wallet is a list of whichever accounts you want to use with it. (For a more complex website, it might have included a request for a Persona login or other things.)

Choose some, or all, of your accounts, click **Continue**, and your wallet will provide those addresses back to the Dashboard – and you’ll see that the √ **Connect** button now shows you as connected!

Now if you go to other Dashboard/Console pages to <a href="https://dashboard.radixdlt.com/network-staking" target="_blank">stake to validators</a>, <a href="https://console.radixdlt.com/deploy-package" target="_blank">deploy a package</a>, or <a href="https://console.radixdlt.com/transaction-manifest" target="_blank">send a raw transaction manifest</a>. The Dashboard can use those addresses from your wallet to populate form inputs and construct transactions to send to your wallet.

During development, you will likely want to use Stokenet, the Radix test network, where you can freely obtain XRD directly in your wallet for testing purposes. Don’t forget to switch your wallet’s Gateway setting to Stokenet, and then visit the <a href="https://stokenet-dashboard.radixdlt.com" target="_blank">Stokenet Dashboard</a> or <a href="https://stokenet-console.radixdlt.com" target="_blank">Stokenet Console</a>.
