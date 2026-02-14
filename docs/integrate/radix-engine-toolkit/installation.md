---
title: "Installation"
---

# Installation

## Choosing a Toolkit

As mentioned in the previous pages, the Radix Engine Toolkit has wrappers in 5 main languages: C#, Kotlin, Python, Swift, and TypeScript. Rust, being the language of Scrypto and the Radix Engine, has the best support. If you decide to use the Radix Engine Toolkit, there are certain tradeoffs between the various different wrappers that you must consider.

The TypeScript Radix Engine Toolkit is different from the C#, Kotlin, Python, and Swift one in that it does not use UniFFI and is a manually written wrapper. This means that it is simpler, its interface doesn’t change very often, but is less capable than the other toolkit wrappers and can’t do nearly as much as them. It is intended to provide frontend clients and exchange integrators with the tooling needed to construct build manifests and sign transactions either programmatically or for the purpose of integrating with the Radix dApp Toolkit and functionality surrounding that. It is typically the toolkit that you want to use in your frontend but you might not want to use it in your backend and might want to use a more powerful wrapper.

The C#, Kotlin, Python, and Swift wrappers are all UniFFI wrappers which means that they are automatically generated bindings from the Rust library that powers them. These wrappers have a much more powerful manifest and transaction builders, support for typed events, the SBOR codec, derivations, and more features that aligns them more closely to the toolkit’s vision of “*providing non-Rust programming languages with the Scrypto and Radix Engine primitives present in Rust”*. These are an ideal choice for use in backends and in cases where the features provided by these bindings are needed.

Finally, Rust offers the best support for everything that users might want to do and it should be the first language to consider for any application that wishes to interact with the Radix ledger as it has the best support since it is the language of Scrypto and the Radix engine. There does not exist a Radix Engine Toolkit in Rust as one is not needed because all of the functionality present in the toolkit is in the `transactions` and `radix-engine-interface` crates.

It is recommended that users prefer the use of Rust for their needs, then the Uniffi wrappers (C#, Kotlin, Python, and Swift), then the TypeScript toolkit, in this order.

## Installation

This document covers the installation of the various Radix Engine Toolkit wrappers through the appropriate package managers.



C# (Nuget)



The C# Radix Engine Toolkit is published to NuGet under the name: <a href="https://www.nuget.org/packages/RadixDlt.RadixEngineToolkit">RadixDlt.RadixEngineToolkit</a>. If you have the `doenet` CLI tool installed then you can install the C# toolkit wrapper through:

``` bash
dotnet add package RadixDlt.RadixEngineToolkit
```

It may also be installed through the NuGet GUI offered by various IDEs such as Visual Studio and JetBrains Rider.







Kotlin (Maven or Gradle)



*The Kotlin Radix Engine Toolkit is not yet published to Maven Central.*

Instead, the relevant JAR can be downloaded from <a href="https://github.com/radixdlt/radix-engine-toolkit/packages/1895806/versions">https://github.com/radixdlt/radix-engine-toolkit/packages/1895806/versions</a>

To make updates easier, you may need to add github as an <a href="https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-apache-maven-registry">Apache Maven repository</a> or a <a href="https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-gradle-registry">Gradle repository</a>.







Python (PyPi)



The Python Radix Engine Toolkit is published to PyPi under the name <a href="https://pypi.org/project/radix-engine-toolkit/">radix-engine-toolkit</a>. This can be installed by:

``` bash
pip install radix-engine-toolkit
```

:::note
Depending on your operating system and environment you may need to use `pip3`, `python -m pip`, or `python3 -m pip`.
:::








Swift (SPM)



Adding the Swift Radix Engine Toolkit as a dependency can not be done through the CLI, only through manual edits of the `Package.swift` file. The following is an example of the modifications to apply to it.

``` swift
// swift-tools-version: 5.9

import PackageDescription

let package = Package(
    name: "example",
    platforms: [
        .macOS(.v12), // <1>
        .iOS(.v11), // <1>
    ],
    dependencies: [
        .package(url: "https://github.com/radixdlt/swift-engine-toolkit", exact: "1.0.0") // <2>
    ],
    targets: [
        .executableTarget(
            name: "example",
            dependencies: [
                .product(name: "EngineToolkit", package: "swift-engine-toolkit") // <3>
            ]
        ),
    ]
)
```

The three items below need to be added to the `Package.swift` file:

1.  The minimum MacOS and iOS versions need to be set to v12 and v11 respectively or higher. This is due to the minimum version requirements of the Radix Engine Toolkit.

2.  The Swift Radix Engine Toolkit needs to be added as a dependency and the version needs to be specified.

3.  Each of the targets that depend on the Swift Radix Engine Toolkit should have the `EngineToolkit` product added to it.







Go (pkg.go.dev)



The Go Radix Engine Toolkit is published as <a href="https://pkg.go.dev/github.com/radixdlt/radix-engine-toolkit-go/v2">github.com/radixdlt/radix-engine-toolkit-go/v2</a>.

Installation instructions are <a href="https://pkg.go.dev/github.com/radixdlt/radix-engine-toolkit-go/v2#section-readme">available here</a>.





## Hello World

The “Hello World” equivalent of the Radix Engine Toolkit to verify that it has been installed successfully and it works in the current environment is the `build_information` function which prints information about the build of the Radix Engine Toolkit Core that is used such as: its version and the version of Scrypto it depends on.



C#



``` csharp
using RadixEngineToolkit;

Console.WriteLine(RadixEngineToolkitUniffiMethods.BuildInformation());
```







Kotlin



``` kotlin
import com.radixdlt.ret.*

fun main(args: Array<String>) {
    println(buildInformation())
}
```







Python



``` python
from radix_engine_toolkit import *

print(build_information())
```







Swift



``` swift
import EngineToolkit;

print(buildInformation())
```




