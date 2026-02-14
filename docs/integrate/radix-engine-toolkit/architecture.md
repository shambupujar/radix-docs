---
title: "Architecture"
---

# Architecture

The Radix Engine Toolkit is written in Rust and is split between three main crates:

- **Radix Engine Toolkit Core:** Includes the implementation of the core functionality of the Radix Engine Toolkit in a functional way. This crate makes no assumptions about how it will be exposed or interfaced with. None of the models in this crate are either Serde or UniFFI serializable. This helps establish a clear separation of concerns: the core of the toolkit implements the functionality alone without any assumptions on the interface, and the interface crates implement the interface without any knowledge of the implementation of the underlying functionality. This allows the Radix Engine Toolkit to have extensible interfaces. As an example, the Radix Engine Toolkit could be extended to be exposed over a REST API or JSON RPC by adding an interface crate.
- **Radix Engine Toolkit Interfaces**
  - **Radix Engine Toolkit UniFFI:** Exposes the Radix Engine Toolkit through a <a href="https://mozilla.github.io/uniffi-rs/">UniFFI</a> interface where each of the exposed functions maps directly to one or more functions from the Radix Engine Toolkit Core. This is the interface that the Swift, Kotlin, C#, and Python Radix Engine Toolkit wrappers are based on. UniFFI allows for bindings to be generated from the Rust code which allowed the Radix Engine Toolkit to support a variety of different programming languages in a fairly short time. 
  - **Radix Engine Toolkit JSON:** Exposes the Radix Engine Toolkit through a C-ABI Foreign Function Interface (FFI) where all of the inputs and outputs of functions are pointers to JSON strings. The TypeScript Radix Engine toolkit wraps a WASM module of this toolkit interface. This interface offers a simple API that is WASM-compatible and thus suitable for the web and other platforms where a WASM runtime is available. 

The following diagram visualizes the different layers that exist in the Radix Engine toolkit stack:

![Radix Engine Toolkit Architecture](/img/RET.drawio-3-.png)

The

Swift, Kotlin, C#, and Python implementations of the Radix Engine Toolkit are referred to as ***toolkit wrappers***, as they wrap a Radix Engine Toolkit dynamic library, make calls to it, and return results back to the caller. From this point onward, Radix Engine Toolkit implementation in non-Rust languages will be referred to as ***toolkit wrappers*** or ***Radix Engine Toolkit wrappers ***from this point onward.

The UniFFI toolkit wrappers such as the ones written in Kotlin, C#, and Python do not have either public or private GitHub repositories. This is because at Radix Engine Toolkit build time in the GitHub CI, UniFFI is used to generate the bindings (i.e., the .kt, .cs, and .py files required to interface with the dynamic libraries) and then CI packages those bindings up and publishes them to the appropriate package managers such as Maven Central, NuGet, and PyPi. Therefore, the Kotlin, C#, and Python Radix Engine Toolkit do not require traditional GitHub repositories as they're fully automatically generated and have no need for things such as commit history, issues, pull requests, and so on. Any issues or pull requests should be opened against the main Radix Engine Toolkit repository <a href="https://github.com/radixdlt/radix-engine-toolkit/">here</a>. Out of the four UniFFI toolkit wrappers only the Swift Radix Engine Toolkit has a <a href="https://github.com/radixdlt/swift-engine-toolkit">GitHub repository</a> as it is essential for the Swift Package Manager (SPM). However, no manual commits are made to that

repository; just commits from the GitHub CI runner during the Radix Engine Toolkit builds.

## Compatibility

As described above, all of the toolkit wrappers contain dynamic libraries. These libraries are platform-specific and thus do not run everywhere, just most of the environments. The following table shows the platforms supported by the various toolkit wrappers:

<table>
<colgroup>
<col />
<col />
<col />
<col />
<col />
<col />
</colgroup>
<tbody>
<tr>
<td><strong>LLVM Target Triple</strong></td>
<td><strong>Swift</strong></td>
<td><strong>Kotlin (Android)</strong></td>
<td><strong>Kotlin</strong></td>
<td><strong>C#</strong></td>
<td><strong>Python</strong></td>
</tr>
<tr>
<td><code>x86_64-pc-windows-gnu</code></td>
<td><br />
</td>
<td><br />
</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
</tr>
<tr>
<td><code>aarch64-pc-windows-msvc</code></td>
<td><br />
</td>
<td><br />
</td>
<td><br />
</td>
<td><br />
</td>
<td><br />
</td>
</tr>
<tr>
<td><code>x86_64-unknown-linux-gnu</code></td>
<td><br />
</td>
<td><br />
</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
</tr>
<tr>
<td><code>aarch64-unknown-linux-gnu</code></td>
<td><br />
</td>
<td><br />
</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
</tr>
<tr>
<td><code>aarch64-apple-darwin</code></td>
<td>✅</td>
<td><br />
</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
</tr>
<tr>
<td><code>x86_64-apple-darwin</code></td>
<td>✅</td>
<td><br />
</td>
<td>✅</td>
<td>✅</td>
<td>✅</td>
</tr>
<tr>
<td><code>x86_64-apple-ios</code></td>
<td>✅</td>
<td><br />
</td>
<td><br />
</td>
<td><br />
</td>
<td><br />
</td>
</tr>
<tr>
<td><code>aarch64-apple-ios</code></td>
<td>✅</td>
<td><br />
</td>
<td><br />
</td>
<td><br />
</td>
<td><br />
</td>
</tr>
<tr>
<td><code>aarch64-apple-ios-sim</code></td>
<td>✅</td>
<td><br />
</td>
<td><br />
</td>
<td><br />
</td>
<td><br />
</td>
</tr>
<tr>
<td><code>aarch64-linux-android</code></td>
<td><br />
</td>
<td>✅</td>
<td><br />
</td>
<td><br />
</td>
<td><br />
</td>
</tr>
<tr>
<td><code>armv7-linux-androideabi</code></td>
<td><br />
</td>
<td>✅</td>
<td><br />
</td>
<td><br />
</td>
<td><br />
</td>
</tr>
</tbody>


This means that the different toolkit wrappers should run on ARM and x86_64 processors and Windows, Linux, and MacOS operating systems with no issues. The only exception is Windows running on ARM processors which is quite uncommon. If you encounter problems relating to supported targets then feel free to open an issue in the Radix Engine Toolkit <a href="https://github.com/radixdlt/radix-engine-toolkit/">repository</a> and the team will look into adding additional target support to the Radix Engine Toolkit.
