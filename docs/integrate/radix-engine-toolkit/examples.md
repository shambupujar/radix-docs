---
title: "Examples"
---

# Examples

The <a href="https://github.com/radixdlt/experimental-examples/tree/main/radix-engine-toolkit">radix-engine-toolkit-examples</a> repository contains examples built with the Radix Engine Toolkit C#, Kotlin, Python, and Swift wrappers to showcase how various frequently asked-about topics can be achieved through the Radix Engine Toolkit wrappers.

Each one of the examples has an implementation in all four of the languages that have a UniFFI Radix Engine Toolkit wrapper. A readme file is provided with each of the examples explaining what the example showcases as well as a section on what the reader may learn by going through a particular example. Additionally, each language example comes with a `run.sh` script that can be called to run that particular example. These `run.sh` scripts were written for MacOS and Linux and there is no guarantee that they run on Windows. If they do not, then they could be run in the same way as any program written in those languages is run on that particular operating system. This may be more prevalent with Python and how different operating systems have different names for the Python CLI command: `py`, `python`, and `python3` .

The following is the recommended order of examples to go through:

- <a href="https://github.com/radixdlt/experimental-examples/tree/main/radix-engine-toolkit/examples/transactions/construction-of-simple-transaction">transaction/construction-of-simple-transaction</a>: This example showcases how simple manifests and transactions can be constructed through the Radix Engine Toolkit with a focus on how the `ManifestBuilder` and `TransactionBuilder` can be used. Additionally, it showcases how random private keys can be generated through the secure randomness implementation available in different languages and how a virtual account address can be derived from the public key.

- <a href="https://github.com/radixdlt/experimental-examples/tree/main/radix-engine-toolkit/examples/transactions/construction-of-simple-transaction-string-manifests">transactions/construction-of-simple-transaction-string-manifests</a>: This example is identical to the one above except for how the manifest is constructed: instead of using the `ManifestBuilder` to construct the manifest, a string of the manifest instructions (this is the contents of the `.rtm` files) is used. This example can be very easily tweaked to read a `.rtm` file instead of relying on a hardcoded string.

- <a href="https://github.com/radixdlt/experimental-examples/tree/main/radix-engine-toolkit/examples/transactions/batch-transfers-from-csv">transactions/batch-transfers-from-csv:</a> This example shows how transfers can be made out of one account, of multiple resources, and into multiple different accounts. A CSV file is used as the source of the transfers to be performed out of the source account. This CSV file contains the destination account, the address of the resources to transfer, and the amount to transfer. The source account is derived from a private key that is hardcoded into the examples. This example shows how a simple CSV file could be used to describe transfers and how a more complex manifest could be built out of the contents of this CSV file.

None of the examples provided make actual calls to the Gateway or Core API: the examples solely focus on the Radix Engine Toolkit and everything else is mocked. This is why all of the examples have a `MockGatewayApiClient` class which offers the correct interface of the Gateway API, but does not have any actual implementation for making HTTP calls to the gateway or anything of that sort. 
