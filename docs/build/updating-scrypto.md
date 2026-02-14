---
title: "Updating Scrypto to the latest version"
---

# Updating Scrypto to the latest version

When a new version of Scrypto is released, it is recommended to update your toolchain to benefit from the latest changes. To update to the latest version, follow these steps:

1.  Open a terminal, or PowerShell if you are on Window

2.  Install the [required Rust compiler](developer-quick-start.md) and set it as default  

    ``` bash
    rustup default <rust-version>
    ```

3.  Reinstall the Radix CLIs with:  

    ``` bash
    cargo install --force radix-clis
    ```

4.  Reset your simulator with:  

    ``` bash
    resim reset
    ```

:::note
**>
Updating existing projects

**

When updating an existing project, to recompile with all the latest updates:

1.  delete the existing Cargo.lock file

2.  run `cargo clean`

3.  run `scrypto build`
:::

