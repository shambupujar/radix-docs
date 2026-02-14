---
title: "Developer Quick Start"
---

# Developer Quick Start

Here you’ll find steps for installing the Scrypto toolchain on Linux, macOS and Windows. Troubleshooting suggestions follow after the installation instructions.

## Compatibility

The table below shows the compatibility between Scrypto and other tools.

| Scrypto/Resim | LLVM/Clang | Rust     |
|---------------|------------|----------|
| `v1.3.0`      | `18`       | `1.81.0` |
| `v1.2.0`      | `17`       | `1.77.2` |
| `v1.1.0`      | `17`       | `1.75.0` |
| `v1.0.0`      | `16`       | `1.72.1` |

:::note
Other versions of LLVM and/or Rust may also work, but are not tested.
:::



## Install the Scrypto Toolchain

To begin working with Scrypto, you need to first prepare you system for Rust development. Then you can install the Scrypto Libraries, [Radix Engine Simulator](../reference/developer-tools/radix-engine-simulator-resim.md) (`resim`) and command line tools. You can do this by following the manual steps for [Windows](docs/getting-rust-scrypto/#manual-windows-install), [macOS](docs/getting-rust-scrypto/#manual-macos-install) or [Linux](docs/getting-rust-scrypto/#manual-linux-install) systems, or run our scripts for [automated installation](docs/getting-rust-scrypto/#automated-installation) at the latests scrypto version.

### Automated Installation

Use these scripts to install the full scrypto toolchain on your machine.

#### Windows

``` cmd
Invoke-RestMethod 'https://raw.githubusercontent.com/radixdlt/radixdlt-scrypto/refs/heads/main/scrypto-install-scripts/install-scrypto-windows.ps1' | Invoke-Expression
```

#### macOS

``` sh
curl -fsSL https://raw.githubusercontent.com/radixdlt/radixdlt-scrypto/refs/heads/main/scrypto-install-scripts/install-scrypto-macos.sh | zsh
```

#### Linux (Debian based distributions)

``` sh
curl -fsSL https://raw.githubusercontent.com/radixdlt/radixdlt-scrypto/refs/heads/main/scrypto-install-scripts/install-scrypto-debian.sh | bash
```

#### Next steps

:::note[After Instillation]
Look at [After Installing Scrypto](docs/getting-rust-scrypto/#after-installing-scrypto) for more helpful tools and suggestions
:::



### Manual Windows Install

#### 1. Install LLVM & Rust compiler

- Install git by running the <a href="https://gitforwindows.org/" target="`_blank`">git installer for windows</a>

  - Enable git long path support:

    ``` cmd
    git config --system core.longpaths true
    ```

- Visit the <a href="https://visualstudio.microsoft.com/downloads/?q=build+tools#build-tools-for-visual-studio-2022" target="`_blank`">Visual Studio Downloads page</a>:

  - Download “**Build Tools for Visual Studio 2022**”
  - Once the download is complete, open the downloaded file to run the installer.
  - In the installer, you will see various workloads you can install. Look for “**Desktop development with C++**”.
  - Tick the checkbox next to “**Desktop development with C++**”. This will automatically select all the necessary components for C++ development.
  - After selecting the necessary workload, click the “**Install**” button at the bottom right of the installer window.
  - Once the installation is complete, you can close the installer.
  - To verify the installation, you can a new Command Prompt or PowerShell window and type `cl` to check if the C++ compiler (cl.exe) is available.

- Download and install [`rustup-init.exe`](https://win.rustup.rs/x86_64)

- Download and install `LLVM` from [here](https://github.com/llvm/llvm-project/releases/download/llvmorg-18.1.8/LLVM-18.1.8-win64.exe) or check [the LLVM GitHub repository](https://github.com/llvm/llvm-project/releases) to find other versions - ***be sure to tick the option that adds `LLVM` to the system PATH***

- Install the required Rust toolchain

  ``` sh
  rustup default 1.81.0
  ```

#### 2. Enable cargo in the current shell

- Start a new **PowerShell**

#### 3. Add WebAssembly target

``` sh
rustup target add wasm32-unknown-unknown
```

#### 4. Install Radix Engine Simulator and command-line tools

``` sh
cargo install --force radix-clis@1.3.0
```

#### 5. Next Steps

Go to the [After Installing Scrypto](docs/getting-rust-scrypto/#after-installing-scrypto)

### Manual macOS Install

#### 1. Install LLVM & Rust compiler

- Make sure you have the `xcode` command line tools by running:

  ``` sh
  xcode-select --install
  ```

- Install `cmake` and `LLVM` > **brew**
:::note
If you don’t already have homebrew installed you will need to follow the [instructions here](https://brew.sh/)
:::



  ``` sh
  brew install cmake llvm
  ```

- Add `LLVM` to the system path by updating `~/.zshrc` and `~/.profile`:

  ``` sh
  path_update='export PATH="$(brew --prefix llvm)/bin:$PATH"' 
  echo $path_update >> ~/.zshrc && echo $path_update >> ~/.profile
  ```

- Install Rust compiler

  ``` sh
  # Replace 1.81.0 with the required version
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain=1.81.0 
  ```

#### 2. Enable cargo in the current shell

``` sh
source $HOME/.cargo/env
```

#### 3. Add WebAssembly target

``` sh
rustup target add wasm32-unknown-unknown
```

#### 4. Install Radix Engine Simulator and command-line tools

``` sh
cargo install --force radix-clis@1.3.0
```

#### 5. Next Steps

Go to the [After Installing Scrypto](docs/getting-rust-scrypto/#after-installing-scrypto)

### Manual Linux Install

#### 1. Install LLVM & Rust compiler

- Make sure a C++ compiler and `LLVM` is installed:

  ``` sh
  sudo apt install clang build-essential llvm
  ```

- Install Rust compiler

  ``` sh
  # Replace 1.81.0 with the required version
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- --default-toolchain=1.81.0
  ```

#### 2. Enable cargo in the current shell

``` sh
source $HOME/.cargo/env
```

#### 3. Add WebAssembly target

``` sh
rustup target add wasm32-unknown-unknown
```

#### 4. Install Radix Engine Simulator and command-line tools

``` sh
cargo install --force radix-clis@1.3.0
```

#### 5. Next Steps

Go to the [After Installing Scrypto](docs/getting-rust-scrypto/#after-installing-scrypto)

## Troubleshooting

### Windows

1.  Check your clang version

    ``` sh
    clang --version
    ```

2.  Check your **LLVM/Clang** version is compatible with your **Rust** and **Resim** versions by looking at the [Compatibility Table](docs/getting-rust-scrypto#compatibility)

3.  Install the appropriate LLVM version from [the LLVM GitHub repository](https://github.com/llvm/llvm-project/releases).

4.  Reinstall required Rust toolchain

    ``` bash
    # Replace 1.81.0 with the required version
    rustup default 1.81.0
    ```

5.  Add WebAssembly target

    ``` sh
    rustup target add wasm32-unknown-unknown
    ```

6.  Install Radix Engine Simulator and command-line tools

    ``` sh
    # Replace 1.3.0 with the required version
    cargo install --force radix-clis@1.3.0
    ```

### macOS

Try the following steps:

1.  Define rust stable:

    ``` sh
    # Replace 1.81.0 with the required version
    rustup default 1.81.0
    ```

2.  Install LLVM 17 using brew:

    ``` sh
    # Replace 18 with the required version
    brew install llvm@18
    ```

3.  Confirm the Installation Path:

    ``` sh
    # Replace 18 with the required version
    brew --prefix llvm@18
    ```

    **Output:** `/usr/local/opt/llvm@18`

4.  Add the vesion `LLVM` to the system path:

    ``` sh
    # Replace @18 with the required version
    path_update='export PATH="$(brew --prefix llvm@18)/bin:$PATH"' 
    echo $path_update >> ~/.zshrc && echo $path_update >> ~/.profile
    ```

5.  Open a new terminal window to reload the environment

6.  Check that the installation of LLVM was done correctly by checking the clang version

    ``` sh
    clang --version
    ```

7.  Install XCode from the App Store

8.  Reset the XCode config:

    ``` sh
    xcodebuild -runFirstLaunch
    ```

9.  Add WebAssembly target

    ``` sh
    rustup target add wasm32-unknown-unknown
    ```

10. Install Radix Engine Simulator and command-line tools

    ``` sh
    cargo install --force radix-clis@1.3.0
    ```

### macOS Command line tools

1.  Remove command line tools `sh  sudo rm -rf /Library/Developer/CommandLineTools`
2.  Reinstall command line tools `sh  xcode-select install`

## After Installing Scrypto

You have now successfully installed the Scrypto toolchain and can start writing your own Scrypto code. To do that you we advise you use an IDE/code-editor

### Setting up Your IDE/Code Editor

An IDE, which stands for Integrated Development Environment, is like a text editor, but with added features to help you while programming. For writing Scrypto code you will need to install an IDE with rust support (because Scrypto is built on top of Rust). We recommend Visual Studio Code where there are rust and Radix Developer Tools extensions to assist.

#### Visual Studio Code

To set up Visual Studio Code:

1.  Start by installing VS Code by following the [download and install instructions](https://code.visualstudio.com/).

2.  Install the **rust-analyzer** and **Radix Developer Tools** extensions. This will give you syntax highlighting and code suggestion while you write your Scrypto code and manifests:

    - Open VS Code

    - Click on the extension icon on the left panel

    

    - Search for “**rust-analyzer**”

    - Click on install

    

    - Search for “**Radix Developer Tools**”

    - Click on install

    

You are now ready to start writing your first Scrypto blueprint.

### What Should You do Next?

If your not sure what to do after installing scrypto have a look at our [Learning Step-by-Step](learning-step-by-step/index.md) to learn how to start making Scrypto packages and dapps.

## More Information

- [Scrypto CLI](scrypto/scrypto-cli-tool.md)

- [Radix Engine Simulator](/docs/radix-engine-simulator-resim)
